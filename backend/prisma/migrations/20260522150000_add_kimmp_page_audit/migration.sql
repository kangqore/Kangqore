-- CreateTable
CREATE TABLE "kimmp_page_audit" (
    "id" TEXT NOT NULL,
    "pageId" TEXT,
    "slug" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kimmp_page_audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kimmp_page_audit_pageId_idx" ON "kimmp_page_audit"("pageId");

-- CreateIndex
CREATE INDEX "kimmp_page_audit_createdAt_idx" ON "kimmp_page_audit"("createdAt");
