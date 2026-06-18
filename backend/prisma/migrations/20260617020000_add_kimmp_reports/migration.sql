-- KIMMP Research Results and Reports tables
-- Migration: 20260617020000_add_kimmp_reports

CREATE TABLE "kimmp_research_result" (
  "id"          TEXT         NOT NULL,
  "question"    TEXT         NOT NULL,
  "domain"      TEXT,
  "summary"     TEXT         NOT NULL,
  "content"     JSONB        NOT NULL,
  "sources"     TEXT[]       NOT NULL DEFAULT '{}',
  "confidence"  INTEGER      NOT NULL DEFAULT 70,
  "signalId"    TEXT,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_research_result_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "kimmp_report" (
  "id"          TEXT         NOT NULL,
  "type"        TEXT         NOT NULL,
  "title"       TEXT         NOT NULL,
  "summary"     TEXT         NOT NULL,
  "content"     TEXT         NOT NULL,
  "fromDate"    TIMESTAMP(3) NOT NULL,
  "toDate"      TIMESTAMP(3) NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "generatedBy" TEXT,
  CONSTRAINT "kimmp_report_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "kimmp_report_type_idx" ON "kimmp_report"("type");
