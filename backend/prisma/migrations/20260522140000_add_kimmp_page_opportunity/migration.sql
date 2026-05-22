-- CreateTable
CREATE TABLE "kimmp_page_opportunities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "suggestedSlug" TEXT NOT NULL,
    "pageType" TEXT NOT NULL DEFAULT 'faq',
    "sourceModule" TEXT NOT NULL DEFAULT 'eqore',
    "sourceReason" TEXT NOT NULL,
    "sampleQuestion" TEXT,
    "signalCount" INTEGER NOT NULL DEFAULT 1,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "priorityLabel" TEXT NOT NULL DEFAULT 'Single mention',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kimmp_page_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kimmp_page_opportunities_suggestedSlug_key" ON "kimmp_page_opportunities"("suggestedSlug");

-- CreateIndex
CREATE INDEX "kimmp_page_opportunities_status_idx" ON "kimmp_page_opportunities"("status");

-- CreateIndex
CREATE INDEX "kimmp_page_opportunities_priority_idx" ON "kimmp_page_opportunities"("priority");
