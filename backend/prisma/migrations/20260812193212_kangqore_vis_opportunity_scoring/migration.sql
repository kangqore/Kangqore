

-- CreateTable
CREATE TABLE "kangqore_vis_opportunities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "entitySlugs" TEXT[],
    "contributingCapabilities" TEXT[],
    "evidenceSignalIds" TEXT[],
    "dimensions" JSONB NOT NULL,
    "baseOpportunityScore" DOUBLE PRECISION NOT NULL,
    "priorityScore" DOUBLE PRECISION NOT NULL,
    "priorityTier" TEXT NOT NULL DEFAULT 'LOW',
    "certainty" DOUBLE PRECISION NOT NULL,
    "recommendation" TEXT NOT NULL,
    "decisionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DETECTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kangqore_vis_opportunities_priorityScore_idx" ON "kangqore_vis_opportunities"("priorityScore");

-- CreateIndex
CREATE INDEX "kangqore_vis_opportunities_status_idx" ON "kangqore_vis_opportunities"("status");

