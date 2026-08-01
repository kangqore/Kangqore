-- AlterTable
ALTER TABLE "action_executions" ADD COLUMN     "agentsMixed" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "policyId" TEXT,
ADD COLUMN     "reasoning" TEXT,
ADD COLUMN     "sourceModule" TEXT;

-- CreateTable
CREATE TABLE "pending_approvals" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "objectId" TEXT,
    "actorId" TEXT,
    "actorType" TEXT NOT NULL DEFAULT 'KIMMP',
    "params" JSONB NOT NULL DEFAULT '{}',
    "policyId" TEXT,
    "policyName" TEXT,
    "reason" TEXT,
    "confidence" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "executionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pending_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pending_approvals_status_createdAt_idx" ON "pending_approvals"("status", "createdAt");

-- CreateIndex
CREATE INDEX "pending_approvals_actionId_idx" ON "pending_approvals"("actionId");

-- CreateIndex
CREATE INDEX "pending_approvals_objectId_idx" ON "pending_approvals"("objectId");

-- AddForeignKey
ALTER TABLE "pending_approvals" ADD CONSTRAINT "pending_approvals_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "ontology_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_approvals" ADD CONSTRAINT "pending_approvals_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ontology_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

