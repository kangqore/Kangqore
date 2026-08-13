-- Overshadow Roadmap P6 — Partner Ecosystem. PartnerTier ships with zero
-- seeded rows: revenue-share percentages and certification requirements are
-- real business terms only Kangqore's leadership sets, not invented here.

CREATE TABLE "partner_tiers" (
    "id"                        TEXT NOT NULL,
    "name"                      TEXT NOT NULL,
    "description"               TEXT,
    "certificationRequirements" TEXT,
    "revenueSharePct"           DOUBLE PRECISION,
    "enablementMaterialsNote"   TEXT,
    "status"                    TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt"                 TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"                 TIMESTAMP(3) NOT NULL,
    CONSTRAINT "partner_tiers_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "partner_tiers_name_key" ON "partner_tiers"("name");

CREATE TABLE "partner_relationships" (
    "id"            TEXT NOT NULL,
    "firmName"      TEXT NOT NULL,
    "practiceArea"  TEXT,
    "tierId"        TEXT,
    "contactName"   TEXT,
    "contactEmail"  TEXT,
    "stage"         TEXT NOT NULL DEFAULT 'IDENTIFIED',
    "notes"         TEXT,
    "activatedAt"   TIMESTAMP(3),
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    CONSTRAINT "partner_relationships_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "partner_relationships_stage_idx" ON "partner_relationships"("stage");
ALTER TABLE "partner_relationships" ADD CONSTRAINT "partner_relationships_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "partner_tiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
