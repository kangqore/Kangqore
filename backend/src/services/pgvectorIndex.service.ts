// S316-S318 — pgvector index over KnowledgeChunk / KimmpSystemKnowledge.
//
// All query touch points use parameterized Prisma tagged template literals
// ($queryRaw / $executeRaw) with strict table whitelist validation to prevent SQL injection.

import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { cosineSimilarity } from './embeddings.service'

export type VectorTable = 'knowledge_chunks' | 'kimmp_system_knowledge'

const ALLOWED_TABLES: Record<VectorTable, string> = {
  knowledge_chunks: 'knowledge_chunks',
  kimmp_system_knowledge: 'kimmp_system_knowledge',
}

function getSafeTable(table: VectorTable): string {
  const safe = ALLOWED_TABLES[table]
  if (!safe) throw new Error(`Invalid vector table identifier: ${table}`)
  return safe
}

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(',')}]`
}

export interface VectorMatch {
  id: string
  score: number // cosine similarity, 1 - distance
}

export const PgvectorIndex = {
  /** Write embeddingVector for one row at ingest time, alongside the existing
   *  Float[] write — keeps the index current without waiting for a backfill. */
  async upsertVector(table: VectorTable, id: string, embedding: number[]): Promise<void> {
    if (embedding.length !== 1024) return
    const safeTable = getSafeTable(table)
    const literal = toVectorLiteral(embedding)
    await prisma.$executeRaw`UPDATE ${Prisma.raw(`"${safeTable}"`)} SET "embeddingVector" = ${literal}::vector WHERE id = ${id}`
  },

  /** Backfill embeddingVector from the existing Float[] `embedding` column for
   *  rows that don't have it yet. Additive — never touches `embedding`. */
  async backfillTable(table: VectorTable, batchSize = 200): Promise<{ table: VectorTable; updated: number }> {
    const safeTable = getSafeTable(table)
    const safeLimit = Math.max(1, Math.min(1000, Number(batchSize) || 200))
    let updated = 0
    for (;;) {
      const rows = await prisma.$queryRaw<Array<{ id: string; embedding: number[] }>>`
        SELECT id, embedding FROM ${Prisma.raw(`"${safeTable}"`)} WHERE "embeddingVector" IS NULL AND array_length(embedding, 1) = 1024 LIMIT ${safeLimit}
      `
      if (rows.length === 0) break

      for (const row of rows) {
        const literal = toVectorLiteral(row.embedding)
        await prisma.$executeRaw`
          UPDATE ${Prisma.raw(`"${safeTable}"`)} SET "embeddingVector" = ${literal}::vector WHERE id = ${row.id}
        `
        updated++
      }
      if (rows.length < safeLimit) break
    }
    return { table, updated }
  },

  async backfillAll(): Promise<Array<{ table: VectorTable; updated: number }>> {
    const results = []
    for (const table of Object.keys(ALLOWED_TABLES) as VectorTable[]) {
      results.push(await this.backfillTable(table))
    }
    return results
  },

  /** Top-k nearest neighbours by cosine distance. Returns just id+score —
   *  callers resolve display content from their own source of truth. */
  async queryTopK(table: VectorTable, queryEmbedding: number[], limit: number, extraWhere = ''): Promise<VectorMatch[]> {
    const safeTable = getSafeTable(table)
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10))
    const literal = toVectorLiteral(queryEmbedding)

    let rows: Array<{ id: string; distance: number }>
    if (extraWhere) {
      // Validate extraWhere matches safe system identifier pattern (e.g. system = '...' AND active = true)
      const isSystemMatch = /^system = '[a-zA-Z0-9_-]+' AND active = true$/.test(extraWhere)
      if (isSystemMatch) {
        rows = await prisma.$queryRaw<Array<{ id: string; distance: number }>>`
          SELECT id, "embeddingVector" <=> ${literal}::vector AS distance FROM ${Prisma.raw(`"${safeTable}"`)} WHERE "embeddingVector" IS NOT NULL AND ${Prisma.raw(extraWhere)} ORDER BY "embeddingVector" <=> ${literal}::vector LIMIT ${safeLimit}
        `
      } else {
        rows = await prisma.$queryRaw<Array<{ id: string; distance: number }>>`
          SELECT id, "embeddingVector" <=> ${literal}::vector AS distance FROM ${Prisma.raw(`"${safeTable}"`)} WHERE "embeddingVector" IS NOT NULL ORDER BY "embeddingVector" <=> ${literal}::vector LIMIT ${safeLimit}
        `
      }
    } else {
      rows = await prisma.$queryRaw<Array<{ id: string; distance: number }>>`
        SELECT id, "embeddingVector" <=> ${literal}::vector AS distance FROM ${Prisma.raw(`"${safeTable}"`)} WHERE "embeddingVector" IS NOT NULL ORDER BY "embeddingVector" <=> ${literal}::vector LIMIT ${safeLimit}
      `
    }
    return rows.map(r => ({ id: r.id, score: 1 - Number(r.distance) }))
  },

  /** Row counts, coverage (rows with a vector vs. total), and on-disk index size */
  async health(): Promise<Array<{ table: VectorTable; totalRows: number; indexedRows: number; indexSizeBytes: number }>> {
    const results = []
    for (const table of Object.keys(ALLOWED_TABLES) as VectorTable[]) {
      const safeTable = getSafeTable(table)
      const indexName = `${safeTable}_embedding_hnsw_idx`
      const [counts] = await prisma.$queryRaw<Array<{ total: bigint; indexed: bigint }>>`
        SELECT count(*) AS total, count("embeddingVector") AS indexed FROM ${Prisma.raw(`"${safeTable}"`)}
      `
      const [size] = await prisma.$queryRaw<Array<{ bytes: bigint }>>`
        SELECT pg_relation_size(${indexName}::regclass) AS bytes
      `.catch(() => [{ bytes: 0n }])
      results.push({
        table,
        totalRows: Number(counts?.total ?? 0),
        indexedRows: Number(counts?.indexed ?? 0),
        indexSizeBytes: Number(size?.bytes ?? 0),
      })
    }
    return results
  },

  /** p50/p95 query latency, index vs. legacy scan */
  async benchmarkLatency(table: VectorTable, queryEmbedding: number[], samples = 7): Promise<{
    table: VectorTable
    indexMs: { p50: number; p95: number }
    legacyScanMs: { p50: number; p95: number }
    rowsScanned: number
  }> {
    const safeTable = getSafeTable(table)
    const percentile = (sorted: number[], p: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))]

    const indexTimes: number[] = []
    for (let i = 0; i < samples; i++) {
      const start = performance.now()
      await this.queryTopK(table, queryEmbedding, 6)
      indexTimes.push(performance.now() - start)
    }

    const legacyRows = await prisma.$queryRaw<Array<{ embedding: number[] }>>`
      SELECT embedding FROM ${Prisma.raw(`"${safeTable}"`)} WHERE array_length(embedding, 1) = 1024
    `
    const legacyTimes: number[] = []
    for (let i = 0; i < samples; i++) {
      const start = performance.now()
      legacyRows
        .map(r => cosineSimilarity(queryEmbedding, r.embedding))
        .sort((a, b) => b - a)
        .slice(0, 6)
      legacyTimes.push(performance.now() - start)
    }

    indexTimes.sort((a, b) => a - b)
    legacyTimes.sort((a, b) => a - b)
    return {
      table,
      indexMs: { p50: percentile(indexTimes, 0.5), p95: percentile(indexTimes, 0.95) },
      legacyScanMs: { p50: percentile(legacyTimes, 0.5), p95: percentile(legacyTimes, 0.95) },
      rowsScanned: legacyRows.length,
    }
  },
}
