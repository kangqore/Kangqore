-- CreateTable
CREATE TABLE "hcip_feedback" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "engineVersion" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hcip_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hcip_outcome" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "revenue" DECIMAL(12,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hcip_outcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hcip_decision_snapshots" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "decisionState" TEXT NOT NULL,
    "persona" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "risk" INTEGER NOT NULL,
    "recommendationId" TEXT,
    "engineVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hcip_decision_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hcip_recommendation_history" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "impact" INTEGER NOT NULL,
    "urgency" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "businessValue" INTEGER,
    "engineVersion" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hcip_recommendation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hcip_engine_versions" (
    "id" TEXT NOT NULL,
    "engineVersion" TEXT NOT NULL,
    "reasoningVersion" TEXT NOT NULL,
    "decisionVersion" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "releasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedBy" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "hcip_engine_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hcip_feedback_recommendationId_idx" ON "hcip_feedback"("recommendationId");
CREATE INDEX "hcip_feedback_visitorId_idx" ON "hcip_feedback"("visitorId");
CREATE INDEX "hcip_feedback_action_idx" ON "hcip_feedback"("action");

-- CreateIndex
CREATE INDEX "hcip_outcome_recommendationId_idx" ON "hcip_outcome"("recommendationId");
CREATE INDEX "hcip_outcome_outcome_idx" ON "hcip_outcome"("outcome");

-- CreateIndex
CREATE INDEX "hcip_decision_snapshots_sessionId_idx" ON "hcip_decision_snapshots"("sessionId");
CREATE INDEX "hcip_decision_snapshots_visitorId_idx" ON "hcip_decision_snapshots"("visitorId");
CREATE INDEX "hcip_decision_snapshots_createdAt_idx" ON "hcip_decision_snapshots"("createdAt");

-- CreateIndex
CREATE INDEX "hcip_recommendation_history_recommendationId_idx" ON "hcip_recommendation_history"("recommendationId");
CREATE INDEX "hcip_recommendation_history_objective_idx" ON "hcip_recommendation_history"("objective");
CREATE INDEX "hcip_recommendation_history_createdAt_idx" ON "hcip_recommendation_history"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "hcip_engine_versions_engineVersion_key" ON "hcip_engine_versions"("engineVersion");
CREATE INDEX "hcip_engine_versions_engineVersion_idx" ON "hcip_engine_versions"("engineVersion");
