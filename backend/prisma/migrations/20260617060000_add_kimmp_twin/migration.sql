CREATE TABLE "kimmp_twin_snapshot" (
  "id"                TEXT         NOT NULL,
  "revenueHealth"     INTEGER      NOT NULL DEFAULT 0,
  "pipelineVelocity"  INTEGER      NOT NULL DEFAULT 0,
  "executionCapacity" INTEGER      NOT NULL DEFAULT 0,
  "riskExposure"      INTEGER      NOT NULL DEFAULT 0,
  "marketPosition"    INTEGER      NOT NULL DEFAULT 0,
  "overallScore"      INTEGER      NOT NULL DEFAULT 0,
  "metadata"          JSONB,
  "computedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_twin_snapshot_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "kimmp_twin_snapshot_computedAt_idx" ON "kimmp_twin_snapshot"("computedAt");
