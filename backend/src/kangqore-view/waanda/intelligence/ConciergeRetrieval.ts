import path from 'path';
import { prisma } from '../../../lib/prisma';
import logger from '../../../utils/logger';
import {
  KBChunk,
  getKB,
  reloadKB,
} from '../../kimmp/knowledge/KbLoader';
import {
  cosineSimilarity,
  embedDocuments,
  embedQuery,
  getEmbeddingModel,
  isEmbeddingsConfigured,
} from '../../kimmp/knowledge/EmbeddingsService';
import { PgvectorIndex } from '../../kimmp/knowledge/PgvectorIndex';
import { KimmpFlags } from '../../kimmp/core/flags';

interface IndexedChunk {
  id: string;
  parentId: string;
  sourceFile: string;
  title: string;
  body: string;
  tags: string[];
  embedding: number[];
}

let memoryIndex: IndexedChunk[] = [];
let memoryIndexById = new Map<string, IndexedChunk>();
let lastIndexedAt: Date | null = null;

export function getIndexState() {
  return {
    chunks: memoryIndex.length,
    embeddingsConfigured: isEmbeddingsConfigured(),
    model: getEmbeddingModel(),
    lastIndexedAt,
  };
}

async function loadIndexFromDb(): Promise<void> {
  const rows = await prisma.knowledgeChunk.findMany({
    where: { populated: true, internal: false },
  });
  memoryIndex = rows.map((r) => ({
    id: r.id,
    parentId: r.parentId,
    sourceFile: r.sourceFile,
    title: r.title,
    body: r.body,
    tags: r.tags || [],
    embedding: (r.embedding as unknown as number[]) || [],
  }));
  memoryIndexById = new Map(memoryIndex.map((c) => [c.id, c]));
  logger.info(`retrieval.index.loaded chunks=${memoryIndex.length}`);
}

export async function indexKnowledgeBase(options: { force?: boolean } = {}): Promise<{
  added: number;
  updated: number;
  unchanged: number;
  removed: number;
  skipped: boolean;
}> {
  const { force = false } = options;
  const kb = getKB();

  if (!isEmbeddingsConfigured()) {
    logger.warn(
      'retrieval.index.skip — VOYAGE_API_KEY not configured; KnowledgeChunk table will not be populated. Concierge will fall back to stuffing the full KB into the prompt.'
    );
    await loadIndexFromDb();
    return { added: 0, updated: 0, unchanged: 0, removed: 0, skipped: true };
  }

  const sourceChunks = kb.publicChunks.filter((c) => c.parentId !== '07-brand-voice');
  const existing = await prisma.knowledgeChunk.findMany();
  const existingById = new Map(existing.map((r) => [r.id, r]));

  const toEmbed: KBChunk[] = [];
  const unchanged: string[] = [];

  for (const chunk of sourceChunks) {
    const prior = existingById.get(chunk.id);
    if (!force && prior && prior.contentHash === chunk.contentHash) {
      unchanged.push(chunk.id);
    } else {
      toEmbed.push(chunk);
    }
  }

  let added = 0;
  let updated = 0;
  if (toEmbed.length > 0) {
    const texts = toEmbed.map((c) => `${c.title}\n\n${c.body}`);
    const embeddings = await embedDocuments(texts);
    for (let i = 0; i < toEmbed.length; i++) {
      const chunk = toEmbed[i];
      const emb = embeddings[i];
      const data = {
        id: chunk.id,
        sourceFile: chunk.sourceFile,
        parentId: chunk.parentId,
        title: chunk.title,
        body: chunk.body,
        tags: chunk.tags,
        embedding: emb,
        embedModel: getEmbeddingModel(),
        contentHash: chunk.contentHash,
        populated: true,
        internal: false,
      };
      if (existingById.has(chunk.id)) {
        await prisma.knowledgeChunk.update({ where: { id: chunk.id }, data });
        updated++;
      } else {
        await prisma.knowledgeChunk.create({ data });
        added++;
      }
      // S317 — keep the pgvector index current at ingest time; the backfill
      // script only needs to run once for pre-existing rows.
      PgvectorIndex.upsertVector('knowledge_chunks', chunk.id, emb).catch(() => {});
    }
  }

  // Remove rows for chunks no longer in source files
  const sourceIds = new Set(sourceChunks.map((c) => c.id));
  const toRemove = existing.filter((r) => !sourceIds.has(r.id));
  if (toRemove.length > 0) {
    await prisma.knowledgeChunk.deleteMany({
      where: { id: { in: toRemove.map((r) => r.id) } },
    });
  }

  await loadIndexFromDb();
  lastIndexedAt = new Date();
  logger.info(
    `retrieval.index.done added=${added} updated=${updated} unchanged=${unchanged.length} removed=${toRemove.length}`
  );

  return {
    added,
    updated,
    unchanged: unchanged.length,
    removed: toRemove.length,
    skipped: false,
  };
}

export async function ensureIndexLoaded(): Promise<void> {
  if (memoryIndex.length === 0) {
    await loadIndexFromDb();
  }
}

let watcher: any = null;
let watchTimer: NodeJS.Timeout | null = null;

export function startKbWatcher(): void {
  if (watcher || process.env.NODE_ENV === 'production') return;
  try {
    // Lazy require so production builds (where chokidar may be pruned) don't crash.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const chokidar = require('chokidar');
    const KB_DIR = path.resolve(__dirname, '../../knowledge-base');
    watcher = chokidar.watch(`${KB_DIR}/*.md`, {
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 250, pollInterval: 50 },
    });
    const debounced = () => {
      if (watchTimer) clearTimeout(watchTimer);
      watchTimer = setTimeout(async () => {
        watchTimer = null;
        try {
          reloadKB();
          const result = await indexKnowledgeBase();
          logger.info(
            `kb.watcher.reload added=${result.added} updated=${result.updated} unchanged=${result.unchanged} removed=${result.removed} skipped=${result.skipped}`
          );
        } catch (e: any) {
          logger.error(`kb.watcher.reload.error: ${e.message}`);
        }
      }, 500);
    };
    watcher.on('add', debounced).on('change', debounced).on('unlink', debounced);
    logger.info(`kb.watcher.started watching=${KB_DIR}/*.md`);
  } catch (e: any) {
    logger.warn(`kb.watcher.start.failed: ${e.message}`);
  }
}

export function stopKbWatcher(): void {
  if (watcher) {
    watcher.close();
    watcher = null;
  }
  if (watchTimer) {
    clearTimeout(watchTimer);
    watchTimer = null;
  }
}

function mmr(
  candidates: { chunk: IndexedChunk; score: number }[],
  k: number,
  lambda = 0.6
): IndexedChunk[] {
  const selected: { chunk: IndexedChunk; score: number }[] = [];
  const remaining = [...candidates];

  while (selected.length < k && remaining.length > 0) {
    let bestIdx = 0;
    let bestVal = -Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const cand = remaining[i];
      const relevance = cand.score;
      let maxSimToSelected = 0;
      for (const sel of selected) {
        const sim = cosineSimilarity(cand.chunk.embedding, sel.chunk.embedding);
        if (sim > maxSimToSelected) maxSimToSelected = sim;
      }
      const val = lambda * relevance - (1 - lambda) * maxSimToSelected;
      if (val > bestVal) {
        bestVal = val;
        bestIdx = i;
      }
    }
    selected.push(remaining[bestIdx]);
    remaining.splice(bestIdx, 1);
  }
  return selected.map((s) => s.chunk);
}

export async function retrieve(
  query: string,
  options: { k?: number; minScore?: number; useMMR?: boolean } = {}
): Promise<KBChunk[]> {
  const { k = 6, minScore = 0.25, useMMR = true } = options;

  if (!isEmbeddingsConfigured() || memoryIndex.length === 0) {
    return [];
  }

  let queryEmb: number[];
  try {
    queryEmb = await embedQuery(query);
  } catch (e: any) {
    logger.warn(`retrieval.embedQuery.error: ${e.message}`);
    return [];
  }

  // S317 — query the HNSW index for the initial candidate set instead of
  // cosine-scoring every row in memory; MMR still runs in TS on the (much
  // smaller) result. Feature-flagged so the two paths can be compared before
  // fully cutting over — both return the identical IndexedChunk[] shape.
  let scored: Array<{ chunk: IndexedChunk; score: number }>;
  if (KimmpFlags.pgvectorEnabled()) {
    const matches = await PgvectorIndex.queryTopK('knowledge_chunks', queryEmb, Math.max(k * 3, k) * 2).catch(() => []);
    scored = matches
      .map((m) => ({ chunk: memoryIndexById.get(m.id), score: m.score }))
      .filter((s): s is { chunk: IndexedChunk; score: number } => !!s.chunk && s.score >= minScore)
      .sort((a, b) => b.score - a.score);
  } else {
    scored = memoryIndex
      .map((c) => ({ chunk: c, score: cosineSimilarity(queryEmb, c.embedding) }))
      .filter((s) => s.score >= minScore)
      .sort((a, b) => b.score - a.score);
  }

  if (scored.length === 0) return [];

  const candidates = scored.slice(0, Math.max(k * 3, k));
  const winners = useMMR ? mmr(candidates, k) : candidates.slice(0, k).map((c) => c.chunk);

  const kb = getKB();
  return winners
    .map((w) => kb.chunks.get(w.id))
    .filter((c): c is KBChunk => Boolean(c));
}
