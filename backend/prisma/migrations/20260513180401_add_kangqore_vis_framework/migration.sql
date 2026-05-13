-- CreateEnum
CREATE TYPE "KangqoreVisPageType" AS ENUM ('HOME', 'DEPARTMENT', 'SERVICE', 'INDUSTRY', 'CASE_STUDY', 'INSIGHT', 'BLOG', 'WHITE_PAPER', 'EVENT', 'BROCHURE', 'COMPANY', 'LEGAL', 'CAREERS', 'CONTACT', 'OTHER');

-- CreateEnum
CREATE TYPE "KangqoreVisSearchIntent" AS ENUM ('INFORMATIONAL', 'NAVIGATIONAL', 'COMMERCIAL', 'TRANSACTIONAL', 'LEARN_EVALUATE_HIRE');

-- CreateEnum
CREATE TYPE "KangqoreVisCtaKind" AS ENUM ('BOOK_CONSULTATION', 'CONTACT_SALES', 'REQUEST_PROPOSAL', 'DOWNLOAD_ASSET', 'SUBSCRIBE', 'APPLY', 'NONE');

-- CreateEnum
CREATE TYPE "KangqoreVisBlueprintStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "KangqoreVisAdapterKind" AS ENUM ('ANALYTICS', 'SEO', 'PERFORMANCE', 'ANSWER_ENGINE');

-- CreateEnum
CREATE TYPE "KangqoreVisConnectorStatus" AS ENUM ('CONNECTED', 'UNCONNECTED', 'ERROR');

-- CreateEnum
CREATE TYPE "KangqoreVisSchemaKind" AS ENUM ('ORGANIZATION', 'WEBSITE', 'WEBPAGE', 'SERVICE', 'FAQ_PAGE', 'BREADCRUMB_LIST', 'ARTICLE', 'PERSON', 'PRODUCT', 'PROFESSIONAL_SERVICE', 'CONTACT_POINT');

-- CreateEnum
CREATE TYPE "KangqoreVisAuditKind" AS ENUM ('SCHEMA_CONTENT_MATCH', 'GOVERNANCE_CHECKLIST', 'BROKEN_LINK', 'PERFORMANCE_BUDGET', 'BRAND_VOICE', 'FORBIDDEN_CLAIM');

-- CreateEnum
CREATE TYPE "KangqoreVisAuditSeverity" AS ENUM ('INFO', 'WARN', 'ERROR');

-- CreateTable
CREATE TABLE "kangqore_vis_page_blueprints" (
    "id" TEXT NOT NULL,
    "pageName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pageType" "KangqoreVisPageType" NOT NULL DEFAULT 'OTHER',
    "primaryKeyword" TEXT,
    "secondaryKeywords" TEXT[],
    "targetBuyer" TEXT,
    "searchIntent" "KangqoreVisSearchIntent",
    "aiIntent" TEXT,
    "problemSolved" TEXT,
    "businessOutcome" TEXT,
    "parentHubId" TEXT,
    "proofRequired" TEXT,
    "faqRequired" BOOLEAN NOT NULL DEFAULT false,
    "schemaRequired" "KangqoreVisSchemaKind"[],
    "ctaKind" "KangqoreVisCtaKind" NOT NULL DEFAULT 'NONE',
    "conversionGoal" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,
    "status" "KangqoreVisBlueprintStatus" NOT NULL DEFAULT 'DRAFT',
    "source" TEXT DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_page_blueprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_hubs" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_hubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_spokes" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hubId" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_spokes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_entities" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "url" TEXT,
    "schemaType" "KangqoreVisSchemaKind",
    "sameAs" TEXT[],
    "proofPoints" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_entity_relations" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_entity_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_faq_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_faq_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "categoryId" TEXT,
    "blueprintId" TEXT,
    "source" TEXT DEFAULT 'manual',
    "position" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_schema_records" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "schemaKind" "KangqoreVisSchemaKind" NOT NULL,
    "jsonLd" JSONB NOT NULL,
    "contentHash" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "lastAuditedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_schema_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_internal_links" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "anchorText" TEXT,
    "position" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_internal_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_keywords" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "blueprintId" TEXT,
    "searchVolume" INTEGER,
    "difficulty" INTEGER,
    "rankingHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_backlinks" (
    "id" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "anchorText" TEXT,
    "domainRating" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "firstSeenAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "disavowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_backlinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_audits" (
    "id" TEXT NOT NULL,
    "kind" "KangqoreVisAuditKind" NOT NULL,
    "severity" "KangqoreVisAuditSeverity" NOT NULL DEFAULT 'INFO',
    "blueprintId" TEXT,
    "message" TEXT NOT NULL,
    "details" JSONB,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_data_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "KangqoreVisAdapterKind" NOT NULL,
    "status" "KangqoreVisConnectorStatus" NOT NULL DEFAULT 'UNCONNECTED',
    "config" JSONB,
    "lastError" TEXT,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_ingestion_jobs" (
    "id" TEXT NOT NULL,
    "dataSourceId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "rowsIngested" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,

    CONSTRAINT "kangqore_vis_ingestion_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_kpi_snapshots" (
    "id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "dimension" TEXT,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,

    CONSTRAINT "kangqore_vis_kpi_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_cwv_samples" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT,
    "url" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "rating" TEXT NOT NULL,
    "navigationType" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_cwv_samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_governance_checks" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "checkId" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "detail" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_governance_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlueprintSpokes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "kangqore_vis_page_blueprints_url_key" ON "kangqore_vis_page_blueprints"("url");

-- CreateIndex
CREATE INDEX "kangqore_vis_page_blueprints_pageType_idx" ON "kangqore_vis_page_blueprints"("pageType");

-- CreateIndex
CREATE INDEX "kangqore_vis_page_blueprints_status_idx" ON "kangqore_vis_page_blueprints"("status");

-- CreateIndex
CREATE UNIQUE INDEX "kangqore_vis_hubs_slug_key" ON "kangqore_vis_hubs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "kangqore_vis_spokes_slug_key" ON "kangqore_vis_spokes"("slug");

-- CreateIndex
CREATE INDEX "kangqore_vis_spokes_hubId_idx" ON "kangqore_vis_spokes"("hubId");

-- CreateIndex
CREATE UNIQUE INDEX "kangqore_vis_entities_slug_key" ON "kangqore_vis_entities"("slug");

-- CreateIndex
CREATE INDEX "kangqore_vis_entities_category_idx" ON "kangqore_vis_entities"("category");

-- CreateIndex
CREATE INDEX "kangqore_vis_entity_relations_toId_idx" ON "kangqore_vis_entity_relations"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "kangqore_vis_entity_relations_fromId_toId_kind_key" ON "kangqore_vis_entity_relations"("fromId", "toId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "kangqore_vis_faq_categories_slug_key" ON "kangqore_vis_faq_categories"("slug");

-- CreateIndex
CREATE INDEX "kangqore_vis_faqs_categoryId_idx" ON "kangqore_vis_faqs"("categoryId");

-- CreateIndex
CREATE INDEX "kangqore_vis_faqs_blueprintId_idx" ON "kangqore_vis_faqs"("blueprintId");

-- CreateIndex
CREATE UNIQUE INDEX "kangqore_vis_schema_records_blueprintId_schemaKind_key" ON "kangqore_vis_schema_records"("blueprintId", "schemaKind");

-- CreateIndex
CREATE INDEX "kangqore_vis_internal_links_targetId_idx" ON "kangqore_vis_internal_links"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "kangqore_vis_internal_links_sourceId_targetId_anchorText_key" ON "kangqore_vis_internal_links"("sourceId", "targetId", "anchorText");

-- CreateIndex
CREATE INDEX "kangqore_vis_keywords_term_idx" ON "kangqore_vis_keywords"("term");

-- CreateIndex
CREATE INDEX "kangqore_vis_keywords_blueprintId_idx" ON "kangqore_vis_keywords"("blueprintId");

-- CreateIndex
CREATE INDEX "kangqore_vis_backlinks_status_idx" ON "kangqore_vis_backlinks"("status");

-- CreateIndex
CREATE UNIQUE INDEX "kangqore_vis_backlinks_sourceUrl_targetUrl_key" ON "kangqore_vis_backlinks"("sourceUrl", "targetUrl");

-- CreateIndex
CREATE INDEX "kangqore_vis_audits_kind_severity_idx" ON "kangqore_vis_audits"("kind", "severity");

-- CreateIndex
CREATE INDEX "kangqore_vis_audits_blueprintId_idx" ON "kangqore_vis_audits"("blueprintId");

-- CreateIndex
CREATE UNIQUE INDEX "kangqore_vis_data_sources_name_key" ON "kangqore_vis_data_sources"("name");

-- CreateIndex
CREATE INDEX "kangqore_vis_ingestion_jobs_dataSourceId_startedAt_idx" ON "kangqore_vis_ingestion_jobs"("dataSourceId", "startedAt");

-- CreateIndex
CREATE INDEX "kangqore_vis_kpi_snapshots_metric_capturedAt_idx" ON "kangqore_vis_kpi_snapshots"("metric", "capturedAt");

-- CreateIndex
CREATE INDEX "kangqore_vis_cwv_samples_url_metric_createdAt_idx" ON "kangqore_vis_cwv_samples"("url", "metric", "createdAt");

-- CreateIndex
CREATE INDEX "kangqore_vis_governance_checks_blueprintId_checkedAt_idx" ON "kangqore_vis_governance_checks"("blueprintId", "checkedAt");

-- CreateIndex
CREATE UNIQUE INDEX "_BlueprintSpokes_AB_unique" ON "_BlueprintSpokes"("A", "B");

-- CreateIndex
CREATE INDEX "_BlueprintSpokes_B_index" ON "_BlueprintSpokes"("B");

-- AddForeignKey
ALTER TABLE "kangqore_vis_page_blueprints" ADD CONSTRAINT "kangqore_vis_page_blueprints_parentHubId_fkey" FOREIGN KEY ("parentHubId") REFERENCES "kangqore_vis_hubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_spokes" ADD CONSTRAINT "kangqore_vis_spokes_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "kangqore_vis_hubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_entity_relations" ADD CONSTRAINT "kangqore_vis_entity_relations_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "kangqore_vis_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_entity_relations" ADD CONSTRAINT "kangqore_vis_entity_relations_toId_fkey" FOREIGN KEY ("toId") REFERENCES "kangqore_vis_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_faqs" ADD CONSTRAINT "kangqore_vis_faqs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "kangqore_vis_faq_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_faqs" ADD CONSTRAINT "kangqore_vis_faqs_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "kangqore_vis_page_blueprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_schema_records" ADD CONSTRAINT "kangqore_vis_schema_records_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "kangqore_vis_page_blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_internal_links" ADD CONSTRAINT "kangqore_vis_internal_links_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "kangqore_vis_page_blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_internal_links" ADD CONSTRAINT "kangqore_vis_internal_links_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "kangqore_vis_page_blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_keywords" ADD CONSTRAINT "kangqore_vis_keywords_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "kangqore_vis_page_blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_audits" ADD CONSTRAINT "kangqore_vis_audits_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "kangqore_vis_page_blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_ingestion_jobs" ADD CONSTRAINT "kangqore_vis_ingestion_jobs_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "kangqore_vis_data_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_cwv_samples" ADD CONSTRAINT "kangqore_vis_cwv_samples_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "kangqore_vis_page_blueprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kangqore_vis_governance_checks" ADD CONSTRAINT "kangqore_vis_governance_checks_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "kangqore_vis_page_blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlueprintSpokes" ADD CONSTRAINT "_BlueprintSpokes_A_fkey" FOREIGN KEY ("A") REFERENCES "kangqore_vis_page_blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlueprintSpokes" ADD CONSTRAINT "_BlueprintSpokes_B_fkey" FOREIGN KEY ("B") REFERENCES "kangqore_vis_spokes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

