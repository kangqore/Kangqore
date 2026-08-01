-- AlterTable
ALTER TABLE "ontology_actions" ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "parameters" SET DEFAULT '[]';
UPDATE "ontology_actions" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;
ALTER TABLE "ontology_actions" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateTable
CREATE TABLE "action_validation_rules" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "condition" JSONB NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'BLOCK',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_validation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_effects" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "effectType" TEXT NOT NULL,
    "configuration" JSONB NOT NULL DEFAULT '{}',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_effects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_executions" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "objectId" TEXT,
    "actorId" TEXT,
    "actorType" TEXT NOT NULL DEFAULT 'HUMAN',
    "params" JSONB NOT NULL DEFAULT '{}',
    "effectsApplied" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "errorMessage" TEXT,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "action_validation_rules_actionId_idx" ON "action_validation_rules"("actionId");

-- CreateIndex
CREATE INDEX "action_effects_actionId_idx" ON "action_effects"("actionId");

-- CreateIndex
CREATE INDEX "action_executions_actionId_idx" ON "action_executions"("actionId");

-- CreateIndex
CREATE INDEX "action_executions_objectId_idx" ON "action_executions"("objectId");

-- CreateIndex
CREATE INDEX "action_executions_actorType_createdAt_idx" ON "action_executions"("actorType", "createdAt");

-- CreateIndex
CREATE INDEX "action_executions_status_idx" ON "action_executions"("status");

-- AddForeignKey
ALTER TABLE "action_validation_rules" ADD CONSTRAINT "action_validation_rules_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "ontology_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_effects" ADD CONSTRAINT "action_effects_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "ontology_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_executions" ADD CONSTRAINT "action_executions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "ontology_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_executions" ADD CONSTRAINT "action_executions_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ontology_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

