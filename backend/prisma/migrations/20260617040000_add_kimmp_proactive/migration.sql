CREATE TABLE "kimmp_proactive_alert" (
  "id"              TEXT         NOT NULL,
  "ruleId"          TEXT         NOT NULL,
  "entityId"        TEXT         NOT NULL,
  "category"        TEXT         NOT NULL,
  "title"           TEXT         NOT NULL,
  "description"     TEXT         NOT NULL,
  "severity"        TEXT         NOT NULL DEFAULT 'MODERATE',
  "suggestedAction" TEXT,
  "actionType"      TEXT,
  "actionPayload"   JSONB,
  "dismissed"       BOOLEAN      NOT NULL DEFAULT false,
  "expiresAt"       TIMESTAMP(3) NOT NULL,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_proactive_alert_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "kimmp_proactive_alert_dismissed_expiresAt_idx" ON "kimmp_proactive_alert"("dismissed", "expiresAt");
