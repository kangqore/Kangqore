-- AlterTable
ALTER TABLE "client_crm" ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingOwnerId" TEXT,
ADD COLUMN     "onboardingStage" TEXT NOT NULL DEFAULT 'PROSPECT',
ADD COLUMN     "onboardingStartedAt" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT;


-- Re-assert the raw-SQL GIN index. `prisma migrate diff` cannot see indexes it
-- did not declare, so it emits a DROP for this on every subsequent migration.
-- Keeping the CREATE here makes the migration idempotent and self-healing.
CREATE INDEX IF NOT EXISTS "ontology_objects_props_gin_idx"
  ON "ontology_objects" USING GIN ("properties" jsonb_path_ops);
