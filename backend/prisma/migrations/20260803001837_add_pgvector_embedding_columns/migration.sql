-- S316 — pgvector Migration
-- Additive only: the existing Float[] `embedding` columns are untouched.
-- embeddingVector is populated by a separate backfill script (see
-- backend/scripts/backfillPgvector.ts), not by this migration.

CREATE EXTENSION IF NOT EXISTS vector;

-- AlterTable
ALTER TABLE "kimmp_system_knowledge" ADD COLUMN     "embeddingVector" vector(1024);

-- AlterTable
ALTER TABLE "knowledge_chunks" ADD COLUMN     "embeddingVector" vector(1024);

-- HNSW over ivfflat: both tables are small today (hundreds-to-low-thousands
-- of rows) — ivfflat's clustering needs real volume (and an ANALYZE pass) to
-- pay off, HNSW performs well at any scale with no training step.
CREATE INDEX IF NOT EXISTS "knowledge_chunks_embedding_hnsw_idx"
  ON "knowledge_chunks" USING hnsw ("embeddingVector" vector_cosine_ops);

CREATE INDEX IF NOT EXISTS "kimmp_system_knowledge_embedding_hnsw_idx"
  ON "kimmp_system_knowledge" USING hnsw ("embeddingVector" vector_cosine_ops);
