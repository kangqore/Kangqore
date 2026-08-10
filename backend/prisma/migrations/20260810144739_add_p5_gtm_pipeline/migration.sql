-- Overshadow Roadmap P5 — tracking infrastructure for reference-customer
-- permission, real BIDS proof-point publishing, and analyst relationships.
-- No completed outcome is represented here; every table starts empty.

CREATE TABLE "reference_customer_candidates" (
    "id"             TEXT NOT NULL,
    "customerName"   TEXT NOT NULL,
    "contactName"    TEXT,
    "contactEmail"   TEXT,
    "stage"          TEXT NOT NULL DEFAULT 'IDENTIFIED',
    "outcomeSummary" TEXT,
    "notes"          TEXT,
    "ownerUserId"    TEXT,
    "publishedAt"    TIMESTAMP(3),
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "reference_customer_candidates_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "reference_customer_candidates_stage_idx" ON "reference_customer_candidates"("stage");

CREATE TABLE "analyst_relationships" (
    "id"             TEXT NOT NULL,
    "firm"           TEXT NOT NULL,
    "analystName"    TEXT,
    "category"       TEXT,
    "status"         TEXT NOT NULL DEFAULT 'NOT_CONTACTED',
    "lastBriefingAt" TIMESTAMP(3),
    "nextFollowUpAt" TIMESTAMP(3),
    "notes"          TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "analyst_relationships_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "analyst_relationships_status_idx" ON "analyst_relationships"("status");

CREATE TABLE "bids_proof_point_publications" (
    "id"           TEXT NOT NULL,
    "engagementId" TEXT NOT NULL,
    "publicLabel"  TEXT NOT NULL,
    "anonymized"   BOOLEAN NOT NULL DEFAULT true,
    "baselineNote" TEXT,
    "status"       TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt"  TIMESTAMP(3),
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "bids_proof_point_publications_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "bids_proof_point_publications_status_idx" ON "bids_proof_point_publications"("status");
