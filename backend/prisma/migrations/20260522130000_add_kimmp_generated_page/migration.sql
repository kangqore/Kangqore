-- CreateTable
CREATE TABLE "kimmp_generated_pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "department" TEXT,
    "primaryService" TEXT,
    "contentJson" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kimmp_generated_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kimmp_generated_pages_slug_key" ON "kimmp_generated_pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "kimmp_generated_pages_route_key" ON "kimmp_generated_pages"("route");

-- CreateIndex
CREATE INDEX "kimmp_generated_pages_status_idx" ON "kimmp_generated_pages"("status");

-- CreateIndex
CREATE INDEX "kimmp_generated_pages_pageType_idx" ON "kimmp_generated_pages"("pageType");
