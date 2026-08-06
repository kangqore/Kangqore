-- Overshadow Roadmap P2 — scope ComplianceControl rows to a certification
-- program (SOC2 | ISO27001) so the same readiness-checkpoint table can track
-- more than one framework without duplicating the model. Existing rows
-- default to 'SOC2' (the only framework tracked before this migration).

ALTER TABLE "compliance_controls" ADD COLUMN "framework" TEXT NOT NULL DEFAULT 'SOC2';

CREATE INDEX "compliance_controls_framework_status_idx" ON "compliance_controls"("framework", "status");
