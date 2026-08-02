-- S321 — optional PromptRegistry name on KimmpAgent; when set, the runtime
-- resolves it via the router's existing registry lookup, falling back to
-- the raw systemPrompt text on a miss (same pattern as S311's gateway link).
--
-- Note: `prisma migrate diff` also proposes DROP INDEX on the two S316 HNSW
-- indexes (knowledge_chunks_embedding_hnsw_idx, kimmp_system_knowledge_embedding_hnsw_idx)
-- every time it runs — HNSW/ivfflat aren't expressible in schema.prisma, so
-- Prisma always sees them as "undeclared" and wants to remove them. Deliberately
-- excluded here; those indexes stay.

ALTER TABLE "kimmp_agent" ADD COLUMN     "promptName" TEXT;
