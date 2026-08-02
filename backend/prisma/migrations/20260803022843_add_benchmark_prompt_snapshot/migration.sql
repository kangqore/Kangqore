-- S319 — snapshot of active AIPrompt versions at benchmark-run start, for
-- correlating a drift alert with which prompt versions were live at the time.
--
-- Note: `prisma migrate diff` also proposes DROP INDEX on the two S316 HNSW
-- indexes (knowledge_chunks_embedding_hnsw_idx, kimmp_system_knowledge_embedding_hnsw_idx)
-- every time it runs — HNSW/ivfflat aren't expressible in schema.prisma, so
-- Prisma always sees them as "undeclared" and wants to remove them. Deliberately
-- excluded here; those indexes stay.

ALTER TABLE "kimmp_benchmark_runs" ADD COLUMN     "promptVersionSnapshot" JSONB;
