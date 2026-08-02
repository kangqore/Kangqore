// S318 — Unified semantic search across KnowledgeChunk (the public KB) and
// KimmpSystemKnowledge (every RAG system's namespace), source-tagged. Always
// queries the pgvector index directly — there's no legacy path to preserve
// here since this endpoint didn't exist before this sprint.

import { prisma } from '../lib/prisma'
import { embedQuery, isEmbeddingsConfigured } from './embeddings.service'
import { PgvectorIndex } from './pgvectorIndex.service'
import { getKB } from './kb-loader'

export interface UnifiedSearchResult {
  id: string
  source: 'knowledge_chunk' | 'system_knowledge'
  title: string
  body: string
  score: number
  system?: string
  docType?: string
}

export async function unifiedSearch(query: string, k = 8): Promise<UnifiedSearchResult[]> {
  if (!isEmbeddingsConfigured() || !query.trim()) return []

  const emb = await embedQuery(query)

  const [kbMatches, sysMatches] = await Promise.all([
    PgvectorIndex.queryTopK('knowledge_chunks', emb, k),
    PgvectorIndex.queryTopK('kimmp_system_knowledge', emb, k, 'active = true'),
  ])

  const kb = getKB()
  const kbResults: UnifiedSearchResult[] = kbMatches
    .map((m): UnifiedSearchResult | null => {
      const c = kb.chunks.get(m.id)
      return c ? { id: c.id, source: 'knowledge_chunk', title: c.title, body: c.body.slice(0, 600), score: m.score } : null
    })
    .filter((r): r is UnifiedSearchResult => !!r)

  const sysIds = sysMatches.map(m => m.id)
  const sysDocs = sysIds.length
    ? await prisma.kimmpSystemKnowledge.findMany({
        where: { id: { in: sysIds } },
        select: { id: true, title: true, body: true, system: true, docType: true },
      })
    : []
  const sysById = new Map(sysDocs.map(d => [d.id, d]))
  const sysResults: UnifiedSearchResult[] = sysMatches
    .map((m): UnifiedSearchResult | null => {
      const d = sysById.get(m.id)
      return d ? { id: d.id, source: 'system_knowledge', title: d.title, body: d.body.slice(0, 600), score: m.score, system: d.system, docType: d.docType } : null
    })
    .filter((r): r is UnifiedSearchResult => !!r)

  return [...kbResults, ...sysResults].sort((a, b) => b.score - a.score).slice(0, k)
}
