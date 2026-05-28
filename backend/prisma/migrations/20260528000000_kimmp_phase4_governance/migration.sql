-- KIMMP Phase 4 — Governance, Permission, Observability, Cost
-- Adds governance columns to kimmp_decisions, and creates
-- kimmp_audit_entries and kimmp_llm_costs tables.

-- Extend kimmp_decisions with Phase 4 approval/audit columns
ALTER TABLE "kimmp_decisions"
  ADD COLUMN IF NOT EXISTS "approvedBy"  TEXT,
  ADD COLUMN IF NOT EXISTS "approvedAt"  TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "dismissedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "dismissedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "executedBy"  TEXT,
  ADD COLUMN IF NOT EXISTS "executedAt"  TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "notes"       TEXT;

-- KIMMP Audit Log — immutable governance record
CREATE TABLE IF NOT EXISTS "kimmp_audit_entries" (
  "id"         TEXT        NOT NULL,
  "actor"      TEXT        NOT NULL,
  "action"     TEXT        NOT NULL,
  "targetType" TEXT        NOT NULL,
  "targetId"   TEXT,
  "notes"      TEXT,
  "metadata"   JSONB,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_audit_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "kimmp_audit_entries_actor_idx"
  ON "kimmp_audit_entries"("actor");

CREATE INDEX IF NOT EXISTS "kimmp_audit_entries_action_createdAt_idx"
  ON "kimmp_audit_entries"("action", "createdAt");

CREATE INDEX IF NOT EXISTS "kimmp_audit_entries_targetType_targetId_idx"
  ON "kimmp_audit_entries"("targetType", "targetId");

-- KIMMP LLM Cost Ledger
CREATE TABLE IF NOT EXISTS "kimmp_llm_costs" (
  "id"               TEXT          NOT NULL,
  "operation"        TEXT          NOT NULL,
  "model"            TEXT          NOT NULL,
  "inputTokens"      INTEGER       NOT NULL DEFAULT 0,
  "outputTokens"     INTEGER       NOT NULL DEFAULT 0,
  "estimatedCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "conversationId"   TEXT,
  "leadId"           TEXT,
  "pageId"           TEXT,
  "createdAt"        TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_llm_costs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "kimmp_llm_costs_operation_idx"
  ON "kimmp_llm_costs"("operation");

CREATE INDEX IF NOT EXISTS "kimmp_llm_costs_createdAt_idx"
  ON "kimmp_llm_costs"("createdAt");
