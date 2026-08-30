-- CreateTable
CREATE TABLE "work_automations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trigger" JSONB NOT NULL,
    "conditions" JSONB NOT NULL DEFAULT '[]',
    "actions" JSONB NOT NULL DEFAULT '[]',
    "typeName" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "runCount" INTEGER NOT NULL DEFAULT 0,
    "lastRunAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_automations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_automation_runs" (
    "id" TEXT NOT NULL,
    "automationId" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "triggeredBy" TEXT NOT NULL,
    "matched" BOOLEAN NOT NULL DEFAULT false,
    "actionsApplied" JSONB NOT NULL DEFAULT '[]',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_automation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "work_automations_enabled_idx" ON "work_automations"("enabled");

-- CreateIndex
CREATE INDEX "work_automation_runs_automationId_createdAt_idx" ON "work_automation_runs"("automationId", "createdAt");

-- CreateIndex
CREATE INDEX "work_automation_runs_objectId_idx" ON "work_automation_runs"("objectId");

-- AddForeignKey
ALTER TABLE "work_automation_runs" ADD CONSTRAINT "work_automation_runs_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "work_automations"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Re-assert the jsonb GIN index: `migrate diff` cannot see raw-SQL indexes and
-- proposes dropping it on every run.
CREATE INDEX IF NOT EXISTS "ontology_objects_props_gin_idx"
  ON "ontology_objects" USING GIN ("properties" jsonb_path_ops);
