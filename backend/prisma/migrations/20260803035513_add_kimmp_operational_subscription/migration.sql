-- S326 — partner webhook registrations for KIMMP operational events (eval
-- regressions, budget breaches), the operational-surface counterpart to
-- OntologySubscription. Same CDC-event-bus integration point, new event types.
--
-- Note: `prisma migrate diff` also proposes DROP INDEX on the two S316 HNSW
-- indexes (knowledge_chunks_embedding_hnsw_idx, kimmp_system_knowledge_embedding_hnsw_idx)
-- every time it runs — HNSW/ivfflat aren't expressible in schema.prisma, so
-- Prisma always sees them as "undeclared" and wants to remove them. Deliberately
-- excluded here; those indexes stay.

CREATE TABLE "kimmp_operational_subscriptions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "eventTypes" TEXT[] DEFAULT ARRAY['eval.drift_alert', 'budget.exceeded']::TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastTriggeredAt" TIMESTAMP(3),
    "lastStatus" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kimmp_operational_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "kimmp_operational_subscriptions_enabled_idx" ON "kimmp_operational_subscriptions"("enabled");
