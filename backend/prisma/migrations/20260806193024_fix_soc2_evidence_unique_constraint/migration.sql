-- Pre-existing bug fix (Overshadow Roadmap P2): the collect-evidence route
-- has always upserted on a periodId_controlId compound unique key that this
-- table never actually had (only a plain index) — every upsert failed
-- silently under a blanket .catch(() => null), so "Collect Evidence" has
-- never persisted a single row. This adds the constraint the route code
-- already assumes exists.

DROP INDEX "soc2_evidence_periodId_controlId_idx";
CREATE UNIQUE INDEX "soc2_evidence_periodId_controlId_key" ON "soc2_evidence"("periodId", "controlId");
