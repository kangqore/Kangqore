import { API_KEYS } from '../../../api-keys';
import logger from '../../../utils/logger';

const VOYAGE_URL = 'https://api.voyageai.com/v1/embeddings';
const MODEL = process.env.VOYAGE_MODEL || 'voyage-3-large';
const DIM = parseInt(process.env.VOYAGE_DIM || '1024', 10);

export class EmbeddingsUnavailable extends Error {
  constructor(message = 'VOYAGE_API_KEY not configured') {
    super(message);
    this.name = 'EmbeddingsUnavailable';
  }
}

export function isEmbeddingsConfigured(): boolean {
  return Boolean(API_KEYS.VOYAGE_API_KEY);
}

export function getEmbeddingDim(): number {
  return DIM;
}

export function getEmbeddingModel(): string {
  return MODEL;
}

async function callVoyage(
  texts: string[],
  inputType: 'document' | 'query',
  attempt = 0
): Promise<number[][]> {
  if (!API_KEYS.VOYAGE_API_KEY) {
    throw new EmbeddingsUnavailable();
  }
  if (texts.length === 0) return [];

  const res = await fetch(VOYAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEYS.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: texts,
      model: MODEL,
      input_type: inputType,
    }),
  });

  if (res.status === 429 && attempt < 5) {
    if (inputType === 'query') {
      throw new Error('Voyage API 429 Rate Limit on query - failing fast to prevent chat hang');
    }
    const retryAfter = parseInt(res.headers.get('retry-after') || '0', 10);
    // Free tier is 3 RPM / 10K TPM — wait at least 25s, exponentially back off if it keeps failing.
    const waitMs = Math.max(retryAfter * 1000, 25000) * Math.pow(1.4, attempt);
    logger.warn(`embeddings.429 — retry ${attempt + 1}/5 in ${Math.round(waitMs / 1000)}s`);
    await new Promise((r) => setTimeout(r, waitMs));
    return callVoyage(texts, inputType, attempt + 1);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '<no body>');
    throw new Error(`Voyage API ${res.status}: ${body.slice(0, 200)}`);
  }

  const json: any = await res.json();
  if (!Array.isArray(json.data)) {
    throw new Error(`Voyage API: unexpected response shape`);
  }
  const sorted = [...json.data].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return sorted.map((d) => d.embedding as number[]);
}

// Default batch size 16 keeps a single request well under the free tier's 10K TPM cap.
const BATCH = parseInt(process.env.VOYAGE_BATCH_SIZE || '16', 10);
// Pause between batches so we stay under 3 RPM on free tier (3 RPM = 20s between requests).
const BATCH_DELAY_MS = parseInt(process.env.VOYAGE_BATCH_DELAY_MS || '0', 10);

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH) {
    const slice = texts.slice(i, i + BATCH);
    const emb = await callVoyage(slice, 'document');
    out.push(...emb);
    logger.debug(`embeddings.batch ${i + slice.length}/${texts.length}`);
    if (BATCH_DELAY_MS > 0 && i + BATCH < texts.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }
  return out;
}

export async function embedQuery(text: string): Promise<number[]> {
  const out = await callVoyage([text], 'query');
  return out[0];
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
