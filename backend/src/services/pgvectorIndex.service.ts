// S316-S318 — pgvector index over KnowledgeChunk / KimmpSystemKnowledge.
//
// Prisma can't read/write the `Unsupported("vector(1024)")` column through
// its normal client API — every touch point here goes through $queryRawUnsafe/
// $executeRawUnsafe. Kept in one file so the raw-SQL surface area is small
// and auditable rather than scattered across the two retrieval call sites.

import { prisma } from '../lib/prisma'
import { cosineSimilarity } from './embeddings.service'

export type VectorTable = 'knowledge_chunks' | 'kimmp_system_knowledge'

const TABLES: VectorTable[] = ['knowledge_chunks', 'kimmp_system_knowledge']

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
    await prisma.$executeRawUnsafe(
      `UPDATE "${table}" SET "embeddingVector" = $1::vector WHERE id = $2`,
      toVectorLiteral(embedding), id,
    ).catch(() => {}) // never let index maintenance break the ingest path
  },


  /** Backfill embeddingVector from the existing Float[] `embedding` column for
   *  rows that don't have it yet. Additive — never touches `embedding`. */
  async backfillTable(table: VectorTable, batchSize = 200): Promise<{ table: VectorTable; updated: number }> {
    let updated = 0
    // Loop in batches rather than one giant UPDATE — these tables can hold
    // thousands of rows and a single multi-thousand-row UPDATE ... FROM
    // (unnest) is harder to reason about than "fetch a batch, write it back."
    for (;;) {
      const rows = await prisma.$queryRawUnsafe<Array<{ id: string; embedding: number[] }>>(
        `SELECT id, embedding FROM "${table}" WHERE "embeddingVector" IS NULL AND array_length(embedding, 1) = 1024 LIMIT ${batchSize}`
      )
      if (rows.length === 0) break

      for (const row of rows) {
        await prisma.$executeRawUnsafe(
          `UPDATE "${table}" SET "embeddingVector" = $1::vector WHERE id = $2`,
          toVectorLiteral(row.embedding), row.id,
        )
        updated++
      }
      if (rows.length < batchSize) break
    }
    return { table, updated }
  },

  async backfillAll(): Promise<Array<{ table: VectorTable; updated: number }>> {
    const results = []
    for (const table of TABLES) results.push(await this.backfillTable(table))
    return results
  },

  /** Top-k nearest neighbours by cosine distance. Returns just id+score —
   *  callers resolve display content from their own source of truth (the
   *  static KB for KnowledgeChunk, the row itself for KimmpSystemKnowledge).
   *  `extraWhere` is interpolated as raw SQL — only ever call this with a
   *  literal built from validated enum/constant values (e.g. SystemRAG's
   *  RAGSystem union), never from unvalidated request input. */
  async queryTopK(table: VectorTable, queryEmbedding: number[], limit: number, extraWhere = ''): Promise<VectorMatch[]> {
    const literal = toVectorLiteral(queryEmbedding)
    const where = extraWhere ? `WHERE "embeddingVector" IS NOT NULL AND ${extraWhere}` : `WHERE "embeddingVector" IS NOT NULL`
    const rows = await prisma.$queryRawUnsafe<Array<{ id: string; distance: number }>>(
      `SELECT id, "embeddingVector" <=> $1::vector AS distance FROM "${table}" ${where} ORDER BY "embeddingVector" <=> $1::vector LIMIT $2`,
      literal, limit,
    )
    return rows.map(r => ({ id: r.id, score: 1 - r.distance }))
  },

  /** Row counts, coverage (rows with a vector vs. total), and on-disk index
   *  size — S318's health panel. */
  async health(): Promise<Array<{ table: VectorTable; totalRows: number; indexedRows: number; indexSizeBytes: number }>> {
    const results = []
    for (const table of TABLES) {
      const indexName = `${table}_embedding_hnsw_idx`
      const [counts] = await prisma.$queryRawUnsafe<Array<{ total: bigint; indexed: bigint }>>(
        `SELECT count(*) AS total, count("embeddingVector") AS indexed FROM "${table}"`
      )
      const [size] = await prisma.$queryRawUnsafe<Array<{ bytes: bigint }>>(
        `SELECT pg_relation_size($1::regclass) AS bytes`, indexName,
      ).catch(() => [{ bytes: 0n }])
      results.push({
        table,
        totalRows: Number(counts.total),
        indexedRows: Number(counts.indexed),
        indexSizeBytes: Number(size?.bytes ?? 0),
      })
    }
    return results
  },

  /** p50/p95 query latency, index vs. the pre-S317 "load every row, cosine-
   *  score in JS" approach — same query embedding run `samples` times against
   *  each, for an honest apples-to-apples before/after comparison. */
  async benchmarkLatency(table: VectorTable, queryEmbedding: number[], samples = 7): Promise<{
    table: VectorTable
    indexMs: { p50: number; p95: number }
    legacyScanMs: { p50: number; p95: number }
    rowsScanned: number
  }> {
    const percentile = (sorted: number[], p: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))]

    const indexTimes: number[] = []
    for (let i = 0; i < samples; i++) {
      const start = performance.now()
      await this.queryTopK(table, queryEmbedding, 6)
      indexTimes.push(performance.now() - start)
    }

    const legacyRows = await prisma.$queryRawUnsafe<Array<{ embedding: number[] }>>(
      `SELECT embedding FROM "${table}" WHERE array_length(embedding, 1) = 1024`
    )
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
