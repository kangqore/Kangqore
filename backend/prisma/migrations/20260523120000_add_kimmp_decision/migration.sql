-- CreateTable
CREATE TABLE "kimmp_decisions" (
    "id" TEXT NOT NULL,
    "signalId" TEXT,
    "decisionType" TEXT NOT NULL,
    "recommendedAction" TEXT NOT NULL,
    "targetModule" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'PROPOSED',
    "conversationId" TEXT,
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kimmp_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kimmp_decisions_status_idx" ON "kimmp_decisions"("status");

-- CreateIndex
CREATE INDEX "kimmp_decisions_targetModule_idx" ON "kimmp_decisions"("targetModule");

-- CreateIndex
CREATE INDEX "kimmp_decisions_createdAt_idx" ON "kimmp_decisions"("createdAt");
