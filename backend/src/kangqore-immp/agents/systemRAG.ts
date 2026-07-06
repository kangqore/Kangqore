// ---------------------------------------------------------------------------
// KIMMP System RAG — per-system Retrieval-Augmented Generation.
//
// Each of the 6 systems (EQORE, LEAD_INTEL, ALIS, VIS, SENTINEL, KIMMP)
// maintains a namespaced knowledge base. Documents are embedded with
// Voyage AI and stored in PostgreSQL (Float[] — same pattern as KnowledgeChunk).
// Cosine similarity + MMR retrieval runs in TypeScript.
//
// Two sources feed each system's knowledge:
//   1. Manual ingestion  — operator posts documents via API
//   2. Auto-indexing     — every completed briefing is indexed back into its
//                          system's knowledge so it learns from its own outputs
//
// The retrieval result is injected into the REASON phase prompt so systems
// reason from grounded historical context, not just their static system prompt.
// ---------------------------------------------------------------------------

import crypto from 'crypto'
import { prisma } from '../../lib/prisma'
import logger from '../../utils/logger'
import {
  embedDocuments,
  embedQuery,
  cosineSimilarity,
  isEmbeddingsConfigured,
  getEmbeddingModel,
  EmbeddingsUnavailable,
} from '../../services/embeddings.service'
import { SystemType } from './agentRegistry'
import { AegisLedger } from '../../kangqore-aegis/aegisLedger.service'

// ─── Types ────────────────────────────────────────────────────────────────────

export type RAGSystem = SystemType | 'KIMMP'

export const RAG_SYSTEMS: RAGSystem[] = [
  'EQORE', 'LEAD_INTEL', 'ALIS', 'VIS', 'SENTINEL', 'DELIVERY_OPS', 'FINANCE_OPS', 'KIMMP',
]

// Canonical doc types per system — informational, not enforced at DB level.
export const SYSTEM_DOC_TYPES: Record<RAGSystem, string[]> = {
  EQORE:        ['meeting', 'client_note', 'action_item', 'conversation', 'org_knowledge', 'briefing'],
  LEAD_INTEL:   ['scoring_rationale', 'deal_history', 'win_loss', 'tender', 'prospect_note', 'briefing'],
  ALIS:         ['playbook', 'sop', 'campaign_brief', 'workflow_template', 'performance_report', 'briefing'],
  VIS:          ['report', 'exec_summary', 'competitor_intel', 'market_research', 'strategy_doc', 'briefing'],
  SENTINEL:     ['cve', 'incident_report', 'compliance_doc', 'security_policy', 'audit_log', 'briefing'],
  DELIVERY_OPS: ['project_health_report', 'delivery_retrospective', 'milestone_escalation', 'twin_simulation', 'portfolio_assessment', 'briefing'],
  FINANCE_OPS:  ['invoice_validation', 'collections_escalation', 'budget_variance', 'deal_coaching', 'pipeline_assessment', 'briefing'],
  KIMMP:        ['loop_synthesis', 'strategic_decision', 'cross_system_pattern', 'board_doc', 'briefing'],
}

export interface RAGChunk {
  id:      string
  docType: string
  title:   string
  body:    string
  source:  string
  score:   number
}

interface IndexedDoc {
  id:        string
  docType:   string
  title:     string
  body:      string
  source:    string
  tags:      string[]
  embedding: number[]
  createdAt: Date
}

// ─── In-memory per-system index ───────────────────────────────────────────────

const indexes  = new Map<RAGSystem, IndexedDoc[]>()
const loadedAt = new Map<RAGSystem, Date>()
const INDEX_TTL_MS = 5 * 60 * 1000

async function loadIndex(system: RAGSystem): Promise<void> {
  const last = loadedAt.get(system)
  if (last && Date.now() - last.getTime() < INDEX_TTL_MS) return

  const rows: any[] = await (prisma as any).kimmpSystemKnowledge.findMany({
    where:  { system, active: true },
    select: { id: true, docType: true, title: true, body: true, source: true, tags: true, embedding: true, createdAt: true },
  }).catch(() => [])

  indexes.set(system, rows.map(r => ({
    id:        r.id,
    docType:   r.docType,
    title:     r.title,
    body:      r.body,
    source:    r.source ?? '',
    tags:      r.tags ?? [],
    embedding: (r.embedding as unknown as number[]) ?? [],
    createdAt: new Date(r.createdAt),
  })))
  loadedAt.set(system, new Date())
  logger.debug(`[KIMMP:RAG] index=${system} chunks=${rows.length}`)
}

// ─── MMR — Maximal Marginal Relevance ─────────────────────────────────────────
// Reduces redundancy in retrieved chunks: prefers diverse, relevant results
// over the top-k most similar (which tend to repeat the same information).

function mmr(
  candidates: { doc: IndexedDoc; score: number }[],
  k: number,
  lambda = 0.6,
): IndexedDoc[] {
  const selected: { doc: IndexedDoc; score: number }[] = []
  const remaining = [...candidates]

  while (selected.length < k && remaining.length > 0) {
    let bestIdx = 0
    let bestVal = -Infinity
    for (let i = 0; i < remaining.length; i++) {
      const cand = remaining[i]
      let maxSimToSelected = 0
      for (const sel of selected) {
        const sim = cosineSimilarity(cand.doc.embedding, sel.doc.embedding)
        if (sim > maxSimToSelected) maxSimToSelected = sim
      }
      const val = lambda * cand.score - (1 - lambda) * maxSimToSelected
      if (val > bestVal) { bestVal = val; bestIdx = i }
    }
    selected.push(remaining[bestIdx])
    remaining.splice(bestIdx, 1)
  }

  return selected.map(s => s.doc)
}

// ─── SystemRAG service ────────────────────────────────────────────────────────

export class SystemRAG {

  // ── Ingest a document ────────────────────────────────────────────────────────
  // Embeds and stores a document into a system's knowledge namespace.
  // Deduplicates by sha256(title+body) — safe to call repeatedly.
  // Degrades gracefully: stores without embedding if VOYAGE_API_KEY is absent.

  static async ingest(params: {
    system:   RAGSystem
    docType:  string
    title:    string
    body:     string
    source?:  string
    tags?:    string[]
  }): Promise<{ id: string; ok: boolean; skipped?: boolean }> {
    const { system, docType, title, body, source = 'manual', tags = [] } = params
    const contentHash = crypto.createHash('sha256').update(`${title}\n${body}`).digest('hex')

    // Skip if identical content already exists for this system
    const existing = await (prisma as any).kimmpSystemKnowledge.findFirst({
      where:  { system, contentHash },
      select: { id: true },
    }).catch(() => null)
    if (existing) return { id: existing.id, ok: true, skipped: true }

    let embedding:  number[] = []
    let embedModel: string | null = null

    if (isEmbeddingsConfigured()) {
      try {
        const [emb] = await embedDocuments([`${title}\n\n${body.slice(0, 2000)}`])
        embedding  = emb
        embedModel = getEmbeddingModel()
      } catch (err: any) {
        if (!(err instanceof EmbeddingsUnavailable)) {
          logger.warn(`[KIMMP:RAG] embed failed ${system}/${docType}: ${err.message}`)
        }
      }
    }

    try {
      const record = await (prisma as any).kimmpSystemKnowledge.create({
        data: {
          system, docType, title,
          body:      body.slice(0, 8000),
          source, tags, embedding, embedModel, contentHash,
          active: true,
        },
      })
      loadedAt.delete(system)  // invalidate in-memory index
      logger.info(`[KIMMP:RAG] ingested system=${system} type=${docType} id=${record.id}`)
      return { id: record.id, ok: true }
    } catch (err: any) {
      logger.warn(`[KIMMP:RAG] ingest.failed: ${err.message}`)
      return { id: '', ok: false }
    }
  }

  // ── Retrieve top-k relevant chunks ───────────────────────────────────────────
  // Returns empty array if embeddings not configured or no history for system.

  static async retrieve(
    system:  RAGSystem,
    query:   string,
    topK = 5,
  ): Promise<RAGChunk[]> {
    if (!isEmbeddingsConfigured() || !query.trim()) return []

    await loadIndex(system)
    const index = indexes.get(system) ?? []
    if (index.length === 0) return []

    let queryEmb: number[]
    try {
      queryEmb = await embedQuery(query)
    } catch {
      return []
    }

    const MIN_SCORE = 0.3
    const now = Date.now()
    const scored = index
      .filter(d => d.embedding.length > 0)
      .map(d => {
        const cosine    = cosineSimilarity(queryEmb, d.embedding)
        const daysSince = (now - d.createdAt.getTime()) / 86_400_000
        // Decay: full weight at 0 days, ~37% at 90 days, ~5% at 270 days
        const decay = Math.exp(-daysSince / 90)
        // Blend: 80% cosine relevance + 20% recency so fresh docs are preferred
        // but a highly relevant old doc still beats a barely-relevant new one
        const score = cosine * 0.8 + cosine * decay * 0.2
        return { doc: d, score }
      })
      .filter(s  => s.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score)

    if (scored.length === 0) return []

    const candidates = scored.slice(0, Math.max(topK * 3, topK))
    const winners    = mmr(candidates, topK)

    return winners.map(w => ({
      id:      w.id,
      docType: w.docType,
      title:   w.title,
      body:    w.body.slice(0, 600),
      source:  w.source,
      score:   scored.find(s => s.doc.id === w.id)?.score ?? 0,
    }))
  }

  // ── Format retrieved chunks as a prompt block ─────────────────────────────────

  static formatRAGBlock(system: RAGSystem, chunks: RAGChunk[]): string {
    if (chunks.length === 0) return ''
    const lines: string[] = [
      `${system} KNOWLEDGE BASE — ${chunks.length} relevant records retrieved`,
    ]
    for (const c of chunks) {
      lines.push('')
      lines.push(`[${c.docType.toUpperCase()}] ${c.title}`)
      lines.push(c.body)
      if (c.source && c.source !== 'manual') lines.push(`Source: ${c.source}`)
    }
    return lines.join('\n')
  }

  // ── Auto-index a completed briefing ──────────────────────────────────────────
  // Called fire-and-forget after every system dispatch so each system's knowledge
  // base grows from its own outputs — no manual curation required.

  static async autoIndexBriefing(params: {
    system:          RAGSystem
    dispatchId:      string
    trigger:         string
    summary:         string
    keyFindings:     string[]
    recommendations: string[]
  }): Promise<void> {
    const { system, dispatchId, trigger, summary, keyFindings, recommendations } = params
    const body = [
      summary,
      keyFindings.length     > 0 ? `Key findings:\n${keyFindings.map(f => `• ${f}`).join('\n')}`     : '',
      recommendations.length > 0 ? `Recommendations:\n${recommendations.map(r => `• ${r}`).join('\n')}` : '',
    ].filter(Boolean).join('\n\n')

    if (!body.trim()) return

    const docType = system === 'KIMMP' ? 'loop_synthesis' : 'briefing'
    const result = await SystemRAG.ingest({
      system,
      docType,
      title:   `${system} briefing — ${trigger}`,
      body,
      source:  `dispatch:${dispatchId}`,
      tags:    [trigger, system.toLowerCase(), 'auto'],
    }).catch(err => { logger.warn(`[KIMMP:RAG] autoIndex failed: ${err.message}`); return null })

    // AEGIS: register every ingested briefing as a KIMMP-owned intelligence asset
    if (result?.id) {
      AegisLedger.logKnowledgeAsset({
        system,
        assetId:     result.id,
        assetType:   docType,
        assetSource: `dispatch:${dispatchId}`,
        dispatchId,
      }).catch(() => {})
    }
  }

  // ── Soft-delete a document ───────────────────────────────────────────────────

  static async delete(id: string): Promise<{ ok: boolean }> {
    try {
      await (prisma as any).kimmpSystemKnowledge.update({
        where: { id },
        data:  { active: false },
      })
      loadedAt.clear()  // invalidate all indexes (system unknown without extra query)
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }

  // ── List documents for a system ───────────────────────────────────────────────

  static async list(
    system:   RAGSystem,
    limit  = 50,
    docType?: string,
  ): Promise<{ id: string; docType: string; title: string; source: string; createdAt: Date }[]> {
    return (prisma as any).kimmpSystemKnowledge.findMany({
      where:   { system, active: true, ...(docType ? { docType } : {}) },
      select:  { id: true, docType: true, title: true, source: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take:    limit,
    }).catch(() => [])
  }

  // ── Index state — for status APIs ─────────────────────────────────────────────

  static indexState(): Record<RAGSystem, { chunks: number; loadedAt: string | null }> {
    return Object.fromEntries(
      RAG_SYSTEMS.map(s => [s, {
        chunks:   indexes.get(s)?.length ?? 0,
        loadedAt: loadedAt.get(s)?.toISOString() ?? null,
      }])
    ) as Record<RAGSystem, { chunks: number; loadedAt: string | null }>
  }

  // ── Warm up all indexes on startup ───────────────────────────────────────────
  // Called once at server start so the first REASON phase doesn't pay load cost.

  static async warmUp(): Promise<void> {
    if (!isEmbeddingsConfigured()) return
    await Promise.allSettled(RAG_SYSTEMS.map(s => loadIndex(s)))
    logger.info('[KIMMP:RAG] indexes warmed up')
  }
}
