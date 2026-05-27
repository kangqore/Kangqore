-- KIMMP Phase 5 — Prediction Ledger
-- Stores every prediction run for future ML model training (features + outcome labels).

CREATE TABLE IF NOT EXISTS "kimmp_predictions" (
  "id"                    TEXT             NOT NULL,
  "leadId"                TEXT             NOT NULL,
  "conversionProbability" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "acvEstimate"           DOUBLE PRECISION NOT NULL DEFAULT 0,
  "deliveryRisk"          TEXT             NOT NULL DEFAULT 'LOW',
  "modelVersion"          TEXT             NOT NULL DEFAULT 'v0-rules',
  "features"              JSONB,
  "actualConverted"       BOOLEAN,
  "actualAcv"             DOUBLE PRECISION,
  "actualDeliveryIssue"   BOOLEAN,
  "createdAt"             TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_predictions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "kimmp_predictions_leadId_idx"   ON "kimmp_predictions"("leadId");
CREATE INDEX IF NOT EXISTS "kimmp_predictions_createdAt_idx" ON "kimmp_predictions"("createdAt");
