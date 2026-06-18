CREATE TABLE "kimmp_orchestration" (
  "id"             TEXT         NOT NULL,
  "question"       TEXT         NOT NULL,
  "intent"         TEXT         NOT NULL,
  "agentsUsed"     TEXT[]       NOT NULL DEFAULT '{}',
  "summary"        TEXT,
  "recommendation" TEXT,
  "evidence"       JSONB,
  "riskFactors"    JSONB,
  "nextSteps"      JSONB,
  "confidence"     INTEGER      NOT NULL DEFAULT 0,
  "durationMs"     INTEGER      NOT NULL DEFAULT 0,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy"      TEXT,
  CONSTRAINT "kimmp_orchestration_pkey" PRIMARY KEY ("id")
);
