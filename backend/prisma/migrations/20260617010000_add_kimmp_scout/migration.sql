CREATE TABLE "kimmp_scout_job" (
  "id"             TEXT    NOT NULL,
  "sourceName"     TEXT    NOT NULL,
  "query"          TEXT    NOT NULL,
  "resultsFound"   INTEGER NOT NULL DEFAULT 0,
  "signalsEmitted" INTEGER NOT NULL DEFAULT 0,
  "status"         TEXT    NOT NULL DEFAULT 'COMPLETED',
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_scout_job_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "kimmp_scout_job_sourceName_idx" ON "kimmp_scout_job"("sourceName");
