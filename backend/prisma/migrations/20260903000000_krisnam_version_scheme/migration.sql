-- Krisnam version scheme: genN -> 0.1.(N-1). Renames the Krisnam fine-tune / A/B
-- canary surface only; the WAANDA evolution-roadmap gen3/4/5 tables are untouched.
-- Hand-written RENAMEs (not drop/create) so the autonomy_config value is preserved.

-- 1. Gen2Model -> KrisnamModel  (gen2_models has 0 rows)
ALTER TABLE "gen2_models" RENAME TO "krisnam_models";
ALTER INDEX "gen2_models_pkey" RENAME TO "krisnam_models_pkey";
ALTER INDEX "gen2_models_isDeployed_idx" RENAME TO "krisnam_models_isDeployed_idx";
ALTER TABLE "krisnam_models" ADD COLUMN "version" TEXT NOT NULL DEFAULT '0.1.1';

-- 2. Gen2AccuracyRecord -> KrisnamAccuracyRecord  (gen2_accuracy_records has 0 rows)
ALTER TABLE "gen2_accuracy_records" RENAME TO "krisnam_accuracy_records";
ALTER INDEX "gen2_accuracy_records_pkey" RENAME TO "krisnam_accuracy_records_pkey";
ALTER INDEX "gen2_accuracy_records_tenantId_idx" RENAME TO "krisnam_accuracy_records_tenantId_idx";
ALTER INDEX "gen2_accuracy_records_provider_idx" RENAME TO "krisnam_accuracy_records_arm_idx";
ALTER TABLE "krisnam_accuracy_records" RENAME COLUMN "provider" TO "arm";
ALTER TABLE "krisnam_accuracy_records" ALTER COLUMN "arm" SET DEFAULT 'baseline';
UPDATE "krisnam_accuracy_records" SET "arm" = 'baseline' WHERE "arm" = 'gen1';
UPDATE "krisnam_accuracy_records" SET "arm" = 'candidate' WHERE "arm" IN ('gen2', 'krisnam');

-- 3. AutonomyConfig.gen2TrafficPct -> krisnamCanaryPct  (value preserved)
ALTER TABLE "autonomy_config" RENAME COLUMN "gen2TrafficPct" TO "krisnamCanaryPct";

-- 4. PlanDecompositionTree.gen2ModelId -> krisnamModelId  (values preserved)
ALTER TABLE "plan_decomposition_trees" RENAME COLUMN "gen2ModelId" TO "krisnamModelId";

-- 5. Data: llm_call_logs.provider 'gen2' -> 'krisnam' (canary calls fold into the Krisnam bucket)
UPDATE "llm_call_logs" SET "provider" = 'krisnam' WHERE "provider" = 'gen2';
