

-- CreateTable
CREATE TABLE "kangqore_vis_locale_targets" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT,
    "locale" TEXT NOT NULL,
    "hreflang" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_locale_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_local_listings" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "phone" TEXT,
    "gmbUrl" TEXT,
    "napConsistent" BOOLEAN NOT NULL DEFAULT false,
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_local_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_page_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slugPattern" TEXT NOT NULL,
    "variableSchema" JSONB NOT NULL,
    "pageType" TEXT NOT NULL,
    "generatedCount" INTEGER NOT NULL DEFAULT 0,
    "lastGeneratedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_page_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_ai_citations" (
    "id" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "citedUrl" TEXT,
    "snippet" TEXT,
    "cited" BOOLEAN NOT NULL DEFAULT false,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_ai_citations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_experiments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hypothesis" TEXT,
    "blueprintId" TEXT,
    "variantA" TEXT NOT NULL,
    "variantB" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "winner" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_ux_findings" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT,
    "source" TEXT NOT NULL,
    "findingType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "foundAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_ux_findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_a11y_issues" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT,
    "url" TEXT NOT NULL,
    "wcagCriterion" TEXT,
    "impact" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "selector" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_a11y_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_topic_relevance" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT,
    "queryTerm" TEXT NOT NULL,
    "relevanceScore" DOUBLE PRECISION NOT NULL,
    "isGap" BOOLEAN NOT NULL DEFAULT false,
    "scoredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_topic_relevance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_video_assets" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "durationSeconds" INTEGER,
    "transcript" TEXT,
    "hasVideoSchema" BOOLEAN NOT NULL DEFAULT false,
    "sitemapIncluded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_video_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_image_assets" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "lazyLoaded" BOOLEAN NOT NULL DEFAULT false,
    "sitemapIncluded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kangqore_vis_image_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_voice_queries" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT,
    "conversationalQuery" TEXT NOT NULL,
    "speakableSelector" TEXT,
    "answered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_voice_queries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kangqore_vis_content_assets" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT,
    "format" TEXT NOT NULL,
    "url" TEXT,
    "schemaKind" "KangqoreVisSchemaKind",
    "coverageNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kangqore_vis_content_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kangqore_vis_locale_targets_locale_idx" ON "kangqore_vis_locale_targets"("locale");

-- CreateIndex
CREATE INDEX "kangqore_vis_locale_targets_blueprintId_idx" ON "kangqore_vis_locale_targets"("blueprintId");

-- CreateIndex
CREATE INDEX "kangqore_vis_local_listings_city_country_idx" ON "kangqore_vis_local_listings"("city", "country");

-- CreateIndex
CREATE UNIQUE INDEX "kangqore_vis_page_templates_name_key" ON "kangqore_vis_page_templates"("name");

-- CreateIndex
CREATE INDEX "kangqore_vis_ai_citations_engine_checkedAt_idx" ON "kangqore_vis_ai_citations"("engine", "checkedAt");

-- CreateIndex
CREATE INDEX "kangqore_vis_experiments_status_idx" ON "kangqore_vis_experiments"("status");

-- CreateIndex
CREATE INDEX "kangqore_vis_experiments_blueprintId_idx" ON "kangqore_vis_experiments"("blueprintId");

-- CreateIndex
CREATE INDEX "kangqore_vis_ux_findings_resolved_idx" ON "kangqore_vis_ux_findings"("resolved");

-- CreateIndex
CREATE INDEX "kangqore_vis_ux_findings_blueprintId_idx" ON "kangqore_vis_ux_findings"("blueprintId");

-- CreateIndex
CREATE INDEX "kangqore_vis_a11y_issues_resolved_idx" ON "kangqore_vis_a11y_issues"("resolved");

-- CreateIndex
CREATE INDEX "kangqore_vis_a11y_issues_url_idx" ON "kangqore_vis_a11y_issues"("url");

-- CreateIndex
CREATE INDEX "kangqore_vis_topic_relevance_blueprintId_idx" ON "kangqore_vis_topic_relevance"("blueprintId");

-- CreateIndex
CREATE INDEX "kangqore_vis_topic_relevance_isGap_idx" ON "kangqore_vis_topic_relevance"("isGap");

-- CreateIndex
CREATE INDEX "kangqore_vis_video_assets_blueprintId_idx" ON "kangqore_vis_video_assets"("blueprintId");

-- CreateIndex
CREATE INDEX "kangqore_vis_image_assets_blueprintId_idx" ON "kangqore_vis_image_assets"("blueprintId");

-- CreateIndex
CREATE INDEX "kangqore_vis_voice_queries_blueprintId_idx" ON "kangqore_vis_voice_queries"("blueprintId");

-- CreateIndex
CREATE INDEX "kangqore_vis_voice_queries_answered_idx" ON "kangqore_vis_voice_queries"("answered");

-- CreateIndex
CREATE INDEX "kangqore_vis_content_assets_blueprintId_idx" ON "kangqore_vis_content_assets"("blueprintId");

-- CreateIndex
CREATE INDEX "kangqore_vis_content_assets_format_idx" ON "kangqore_vis_content_assets"("format");

