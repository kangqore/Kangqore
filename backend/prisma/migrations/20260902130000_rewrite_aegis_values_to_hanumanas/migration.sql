-- Rewrite historical 'AEGIS' identity values -> 'HANUMANAS' so stored data
-- matches the code rename. Single transaction (Prisma wraps it; Postgres DML
-- is transactional — any failure rolls the whole thing back).
--
-- EXCLUDED: qef_certificates (sha256 tamper-evidence over gateSnapshot JSON —
-- rewriting would mark every historical certificate as tampered).

-- ── hanumanas_audit_logs ────────────────────────────────────────────────────
UPDATE "hanumanas_audit_logs" SET "actor" = 'HANUMANAS' WHERE "actor" = 'AEGIS';
UPDATE "hanumanas_audit_logs" SET "trigger" = 'HANUMANAS' || substring("trigger" from 6)  WHERE "trigger" LIKE 'AEGIS%';
UPDATE "hanumanas_audit_logs" SET "trigger" = 'hanumanas.' || substring("trigger" from 7) WHERE "trigger" LIKE 'aegis.%';

-- ── hanumanas_action_logs / agent_runs / pending_actions — agentId prefix ───
UPDATE "hanumanas_action_logs"     SET "agentId" = 'hanumanas.' || substring("agentId" from 7) WHERE "agentId" LIKE 'aegis.%';
UPDATE "hanumanas_agent_runs"      SET "agentId" = 'hanumanas.' || substring("agentId" from 7) WHERE "agentId" LIKE 'aegis.%';
UPDATE "hanumanas_pending_actions" SET "agentId" = 'hanumanas.' || substring("agentId" from 7) WHERE "agentId" LIKE 'aegis.%';

-- ── action_executions / pending_approvals — actorType ──────────────────────
UPDATE "action_executions" SET "actorType" = 'HANUMANAS' WHERE "actorType" = 'AEGIS';
UPDATE "pending_approvals" SET "actorType" = 'HANUMANAS' WHERE "actorType" = 'AEGIS';

-- ── kimmp_signals — sourceModule + signalType ─────────────────────────────
UPDATE "kimmp_signals" SET "sourceModule" = 'HANUMANAS' WHERE "sourceModule" = 'AEGIS';
UPDATE "kimmp_signals" SET "signalType" = 'HANUMANAS' || substring("signalType" from 6)  WHERE "signalType" LIKE 'AEGIS%';
UPDATE "kimmp_signals" SET "signalType" = 'hanumanas.' || substring("signalType" from 7) WHERE "signalType" LIKE 'aegis.%';

-- ── llm_call_logs — actorType + sourceModule path ────────────────────────
UPDATE "llm_call_logs" SET "actorType" = 'HANUMANAS' WHERE "actorType" = 'AEGIS';
UPDATE "llm_call_logs"
   SET "sourceModule" = replace(replace("sourceModule", 'esf/aegis', 'esf/hanumanas'), 'kangqore-aegis', 'kangqore-view/esf/hanumanas')
 WHERE "sourceModule" ILIKE '%aegis%';

-- ── record the rewrite in the governance ledger itself ────────────────────
INSERT INTO "hanumanas_audit_logs" ("id", "eventType", "actor", "trigger", "autonomous", "metadata", "createdAt")
VALUES (
  'cm' || substr(md5(random()::text || clock_timestamp()::text), 1, 23),
  'ACTIVATION', 'SYSTEM', 'MIGRATION_HANUMANAS_RENAME', false,
  '{"migration":"20260902130000_rewrite_aegis_values_to_hanumanas","note":"historical governance identity values rewritten to HANUMANAS; qef_certificates excluded"}'::jsonb,
  now()
);

-- ── Reverse (for reference; run manually to roll back) ────────────────────
-- UPDATE "hanumanas_audit_logs" SET "actor" = 'AEGIS' WHERE "actor" = 'HANUMANAS';
-- UPDATE "hanumanas_audit_logs" SET "trigger" = 'AEGIS' || substring("trigger" from 10)   WHERE "trigger" LIKE 'HANUMANAS%';
-- UPDATE "hanumanas_audit_logs" SET "trigger" = 'aegis.' || substring("trigger" from 11)  WHERE "trigger" LIKE 'hanumanas.%';
-- UPDATE "hanumanas_action_logs"     SET "agentId" = 'aegis.' || substring("agentId" from 11) WHERE "agentId" LIKE 'hanumanas.%';
-- UPDATE "hanumanas_agent_runs"      SET "agentId" = 'aegis.' || substring("agentId" from 11) WHERE "agentId" LIKE 'hanumanas.%';
-- UPDATE "hanumanas_pending_actions" SET "agentId" = 'aegis.' || substring("agentId" from 11) WHERE "agentId" LIKE 'hanumanas.%';
-- UPDATE "action_executions" SET "actorType" = 'AEGIS' WHERE "actorType" = 'HANUMANAS';
-- UPDATE "pending_approvals" SET "actorType" = 'AEGIS' WHERE "actorType" = 'HANUMANAS';
-- UPDATE "kimmp_signals" SET "sourceModule" = 'AEGIS' WHERE "sourceModule" = 'HANUMANAS';
-- UPDATE "kimmp_signals" SET "signalType" = 'AEGIS' || substring("signalType" from 10)  WHERE "signalType" LIKE 'HANUMANAS%';
-- UPDATE "kimmp_signals" SET "signalType" = 'aegis.' || substring("signalType" from 11) WHERE "signalType" LIKE 'hanumanas.%';
-- UPDATE "llm_call_logs" SET "actorType" = 'AEGIS' WHERE "actorType" = 'HANUMANAS';
-- (llm_call_logs.sourceModule path rewrite is not cleanly reversible — it collapsed two old forms into one)
