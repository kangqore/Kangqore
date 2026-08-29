-- CreateTable
CREATE TABLE "agent_missions" (
    "id" TEXT NOT NULL,
    "intentText" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "status" TEXT NOT NULL DEFAULT 'PLANNING',
    "goal" JSONB,
    "contextSummary" JSONB,
    "findings" JSONB,
    "simulations" JSONB,
    "verification" JSONB,
    "policyId" TEXT,
    "policyName" TEXT,
    "policyEffect" TEXT,
    "failureReason" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plannedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_mission_steps" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "stage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "data" JSONB,
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_mission_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_proposed_actions" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "actionName" TEXT NOT NULL,
    "params" JSONB NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "rationale" TEXT NOT NULL,
    "expectedImpact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PROPOSED',
    "policyEffect" TEXT,
    "approvalId" TEXT,
    "executionId" TEXT,
    "resultSummary" TEXT,
    "errorMessage" TEXT,
    "executedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_proposed_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agent_missions_actorId_startedAt_idx" ON "agent_missions"("actorId", "startedAt");

-- CreateIndex
CREATE INDEX "agent_missions_status_idx" ON "agent_missions"("status");

-- CreateIndex
CREATE INDEX "agent_mission_steps_missionId_ordinal_idx" ON "agent_mission_steps"("missionId", "ordinal");

-- CreateIndex
CREATE INDEX "agent_proposed_actions_missionId_ordinal_idx" ON "agent_proposed_actions"("missionId", "ordinal");

-- CreateIndex
CREATE INDEX "agent_proposed_actions_status_idx" ON "agent_proposed_actions"("status");

-- AddForeignKey
ALTER TABLE "agent_mission_steps" ADD CONSTRAINT "agent_mission_steps_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "agent_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_proposed_actions" ADD CONSTRAINT "agent_proposed_actions_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "agent_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

