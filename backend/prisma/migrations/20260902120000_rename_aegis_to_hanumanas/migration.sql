-- Rename the six AEGIS governance tables to HANUMANAS.
-- Structural only: table + index + constraint names. No column values are touched.
-- (Row-value rewrites — actorType/engine/shield/agentId etc. — are a separate migration.)

-- ── Tables ──────────────────────────────────────────────────────────────────
ALTER TABLE "aegis_audit_logs"      RENAME TO "hanumanas_audit_logs";
ALTER TABLE "aegis_agent_runs"      RENAME TO "hanumanas_agent_runs";
ALTER TABLE "aegis_pending_actions" RENAME TO "hanumanas_pending_actions";
ALTER TABLE "aegis_action_logs"     RENAME TO "hanumanas_action_logs";
ALTER TABLE "AegisPolicy"           RENAME TO "hanumanas_policies";
ALTER TABLE "AegisLedgerEntry"      RENAME TO "hanumanas_ledger_entries";

-- ── Secondary indexes ───────────────────────────────────────────────────────
ALTER INDEX "aegis_audit_logs_eventType_createdAt_idx"     RENAME TO "hanumanas_audit_logs_eventType_createdAt_idx";
ALTER INDEX "aegis_audit_logs_autonomous_createdAt_idx"    RENAME TO "hanumanas_audit_logs_autonomous_createdAt_idx";
ALTER INDEX "aegis_audit_logs_system_createdAt_idx"        RENAME TO "hanumanas_audit_logs_system_createdAt_idx";
ALTER INDEX "aegis_audit_logs_actor_createdAt_idx"         RENAME TO "hanumanas_audit_logs_actor_createdAt_idx";
ALTER INDEX "aegis_agent_runs_engine_raisedAt_idx"         RENAME TO "hanumanas_agent_runs_engine_raisedAt_idx";
ALTER INDEX "aegis_agent_runs_verdict_raisedAt_idx"        RENAME TO "hanumanas_agent_runs_verdict_raisedAt_idx";
ALTER INDEX "aegis_agent_runs_agentId_raisedAt_idx"        RENAME TO "hanumanas_agent_runs_agentId_raisedAt_idx";
ALTER INDEX "aegis_pending_actions_status_requestedAt_idx" RENAME TO "hanumanas_pending_actions_status_requestedAt_idx";
ALTER INDEX "aegis_action_logs_agentId_executedAt_idx"     RENAME TO "hanumanas_action_logs_agentId_executedAt_idx";
ALTER INDEX "aegis_action_logs_status_executedAt_idx"      RENAME TO "hanumanas_action_logs_status_executedAt_idx";

-- AegisPolicy.name is a bare unique index (Prisma @unique), not a constraint.
ALTER INDEX "AegisPolicy_name_key" RENAME TO "hanumanas_policies_name_key";

-- ── Primary-key constraints ────────────────────────────────────────────────
ALTER TABLE "hanumanas_audit_logs"      RENAME CONSTRAINT "aegis_audit_logs_pkey"      TO "hanumanas_audit_logs_pkey";
ALTER TABLE "hanumanas_agent_runs"      RENAME CONSTRAINT "aegis_agent_runs_pkey"      TO "hanumanas_agent_runs_pkey";
ALTER TABLE "hanumanas_pending_actions" RENAME CONSTRAINT "aegis_pending_actions_pkey" TO "hanumanas_pending_actions_pkey";
ALTER TABLE "hanumanas_action_logs"     RENAME CONSTRAINT "aegis_action_logs_pkey"     TO "hanumanas_action_logs_pkey";
ALTER TABLE "hanumanas_policies"        RENAME CONSTRAINT "AegisPolicy_pkey"           TO "hanumanas_policies_pkey";
ALTER TABLE "hanumanas_ledger_entries"  RENAME CONSTRAINT "AegisLedgerEntry_pkey"      TO "hanumanas_ledger_entries_pkey";

-- ── Reverse (for reference; run manually to roll back) ──────────────────────
-- ALTER TABLE "hanumanas_policies"        RENAME CONSTRAINT "hanumanas_policies_name_key"       TO "AegisPolicy_name_key";
-- ALTER TABLE "hanumanas_ledger_entries"  RENAME CONSTRAINT "hanumanas_ledger_entries_pkey"     TO "AegisLedgerEntry_pkey";
-- ALTER TABLE "hanumanas_policies"        RENAME CONSTRAINT "hanumanas_policies_pkey"            TO "AegisPolicy_pkey";
-- ALTER TABLE "hanumanas_action_logs"     RENAME CONSTRAINT "hanumanas_action_logs_pkey"         TO "aegis_action_logs_pkey";
-- ALTER TABLE "hanumanas_pending_actions" RENAME CONSTRAINT "hanumanas_pending_actions_pkey"     TO "aegis_pending_actions_pkey";
-- ALTER TABLE "hanumanas_agent_runs"      RENAME CONSTRAINT "hanumanas_agent_runs_pkey"          TO "aegis_agent_runs_pkey";
-- ALTER TABLE "hanumanas_audit_logs"      RENAME CONSTRAINT "hanumanas_audit_logs_pkey"          TO "aegis_audit_logs_pkey";
-- ALTER INDEX "hanumanas_action_logs_status_executedAt_idx"      RENAME TO "aegis_action_logs_status_executedAt_idx";
-- ALTER INDEX "hanumanas_action_logs_agentId_executedAt_idx"     RENAME TO "aegis_action_logs_agentId_executedAt_idx";
-- ALTER INDEX "hanumanas_pending_actions_status_requestedAt_idx" RENAME TO "aegis_pending_actions_status_requestedAt_idx";
-- ALTER INDEX "hanumanas_agent_runs_agentId_raisedAt_idx"        RENAME TO "aegis_agent_runs_agentId_raisedAt_idx";
-- ALTER INDEX "hanumanas_agent_runs_verdict_raisedAt_idx"        RENAME TO "aegis_agent_runs_verdict_raisedAt_idx";
-- ALTER INDEX "hanumanas_agent_runs_engine_raisedAt_idx"         RENAME TO "aegis_agent_runs_engine_raisedAt_idx";
-- ALTER INDEX "hanumanas_audit_logs_actor_createdAt_idx"         RENAME TO "aegis_audit_logs_actor_createdAt_idx";
-- ALTER INDEX "hanumanas_audit_logs_system_createdAt_idx"        RENAME TO "aegis_audit_logs_system_createdAt_idx";
-- ALTER INDEX "hanumanas_audit_logs_autonomous_createdAt_idx"    RENAME TO "aegis_audit_logs_autonomous_createdAt_idx";
-- ALTER INDEX "hanumanas_audit_logs_eventType_createdAt_idx"     RENAME TO "aegis_audit_logs_eventType_createdAt_idx";
-- ALTER TABLE "hanumanas_ledger_entries"  RENAME TO "AegisLedgerEntry";
-- ALTER TABLE "hanumanas_policies"        RENAME TO "AegisPolicy";
-- ALTER TABLE "hanumanas_action_logs"     RENAME TO "aegis_action_logs";
-- ALTER TABLE "hanumanas_pending_actions" RENAME TO "aegis_pending_actions";
-- ALTER TABLE "hanumanas_agent_runs"      RENAME TO "aegis_agent_runs";
-- ALTER TABLE "hanumanas_audit_logs"      RENAME TO "aegis_audit_logs";
