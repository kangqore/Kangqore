-- CreateTable
CREATE TABLE "eqore_sales_notes" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "authorId" TEXT,
    "noteType" TEXT NOT NULL DEFAULT 'CALL_NOTE',
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eqore_sales_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "eqore_sales_notes_leadId_idx" ON "eqore_sales_notes"("leadId");

-- CreateIndex
CREATE INDEX "eqore_sales_notes_opportunityId_idx" ON "eqore_sales_notes"("opportunityId");

-- AddForeignKey
ALTER TABLE "eqore_sales_notes" ADD CONSTRAINT "eqore_sales_notes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "eqore_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_notes" ADD CONSTRAINT "eqore_sales_notes_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "eqore_sales_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

