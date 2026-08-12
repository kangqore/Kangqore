

-- CreateTable
CREATE TABLE "kangqore_vis_priority_registry" (
    "id" TEXT NOT NULL,
    "priorityIndustry" TEXT,
    "priorityService" TEXT,
    "priorityProduct" TEXT,
    "strategicPillar" TEXT,
    "priorityWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_priority_registry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kangqore_vis_priority_registry_active_idx" ON "kangqore_vis_priority_registry"("active");

