

-- CreateTable
CREATE TABLE "kangqore_vis_outcomes" (
    "id" TEXT NOT NULL,
    "dataSourceId" TEXT NOT NULL,
    "blueprintId" TEXT,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raw" JSONB,

    CONSTRAINT "kangqore_vis_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kangqore_vis_outcomes_blueprintId_idx" ON "kangqore_vis_outcomes"("blueprintId");

-- CreateIndex
CREATE INDEX "kangqore_vis_outcomes_metric_measuredAt_idx" ON "kangqore_vis_outcomes"("metric", "measuredAt");

-- AddForeignKey
ALTER TABLE "kangqore_vis_outcomes" ADD CONSTRAINT "kangqore_vis_outcomes_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "kangqore_vis_data_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

