-- CreateEnum
CREATE TYPE "EqoreSchedulingStatus" AS ENUM ('NONE', 'INTERESTED', 'PARSING_TIME', 'SLOT_OFFERED', 'NEGOTIATING', 'BOOKING_PENDING', 'BOOKED', 'CANCELLED', 'FAILED');

-- CreateTable
CREATE TABLE "eqore_conversations" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentIntent" TEXT,
    "device" TEXT,
    "ipHash" TEXT,
    "referrer" TEXT,
    "sourcePage" TEXT,
    "summary" TEXT,
    "userAgent" TEXT,
    "userId" TEXT,
    "utmSource" TEXT,
    "visitorType" TEXT,

    CONSTRAINT "eqore_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_leads" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "visitorType" TEXT,
    "leadScore" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyName" TEXT,
    "conversationSummary" TEXT,
    "email" TEXT,
    "leadCategory" TEXT,
    "leadConfidence" INTEGER NOT NULL DEFAULT 0,
    "leadQuality" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "primaryIntent" TEXT,
    "role" TEXT,
    "secureTokenHash" TEXT,
    "sourcePage" TEXT,
    "website" TEXT,
    "authoritySignal" TEXT,
    "budgetSignal" TEXT,
    "buyingSignals" JSONB,
    "buyingStage" TEXT,
    "negativeSignals" JSONB,
    "nextBestQuestion" TEXT,
    "painPoints" JSONB,
    "problemStatement" TEXT,
    "recommendedAction" TEXT,
    "urgency" TEXT,
    "lastShadowAnalyzedAt" TIMESTAMP(3),
    "lastShadowAnalyzedMessageId" TEXT,
    "lastShadowError" TEXT,
    "shadowAnalysisStatus" TEXT DEFAULT 'IDLE',
    "shadowAnalysisVersion" TEXT,
    "shadowExtractionConfidence" INTEGER,
    "departmentFitScores" JSONB,
    "lastServiceMatchedAt" TIMESTAMP(3),
    "matchedServices" JSONB,
    "primaryDepartment" TEXT,
    "recommendedSolutionPackage" TEXT,
    "secondaryDepartments" JSONB,
    "serviceFitScores" JSONB,
    "serviceMatchReason" TEXT,
    "serviceMatchVersion" TEXT,
    "consultationTimezone" TEXT DEFAULT 'Asia/Kolkata',
    "lastSchedulingIntentAt" TIMESTAMP(3),
    "offeredSlots" JSONB,
    "parsedConsultationWindow" JSONB,
    "preferredConsultationTime" TEXT,
    "scheduledEventId" TEXT,
    "schedulingStatus" "EqoreSchedulingStatus" NOT NULL DEFAULT 'NONE',
    "selectedSlot" JSONB,
    "pipelineWeight" DOUBLE PRECISION DEFAULT 0,
    "projectedValue" DECIMAL(12,2),
    "valueReasoning" JSONB,
    "valueTier" TEXT,
    "nurtureActions" JSONB,
    "nurtureBrief" TEXT,
    "graphContext" JSONB,
    "graphEnrichedAt" TIMESTAMP(3),
    "graphContextVersion" TEXT,
    "recommendedCrossSells" JSONB,
    "recommendedCaseStudies" JSONB,
    "recommendedConsultant" JSONB,
    "assignedOwnerId" TEXT,
    "assignedOwnerName" TEXT,
    "assignedTeam" TEXT,
    "assignmentReason" TEXT,
    "assignedAt" TIMESTAMP(3),
    "assignmentStatus" TEXT,
    "salesStage" TEXT,
    "salesPriority" TEXT,
    "lastSalesActivityAt" TIMESTAMP(3),

    CONSTRAINT "eqore_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_lead_events" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "previousScore" INTEGER,
    "newScore" INTEGER,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventData" JSONB,
    "newStatus" TEXT,
    "previousStatus" TEXT,

    CONSTRAINT "eqore_lead_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "intent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "eqore_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_agent_logs" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT,
    "leadId" TEXT,
    "messageId" TEXT,
    "routerSource" TEXT,
    "detectedIntent" TEXT,
    "routingConfidence" DOUBLE PRECISION,
    "selectedAgents" JSONB,
    "skippedAgents" JSONB,
    "reason" TEXT,
    "resultsJson" JSONB,
    "modelProvider" TEXT,
    "modelName" TEXT,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "estimatedCost" DOUBLE PRECISION,
    "classificationMs" INTEGER,
    "totalLatencyMs" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eqore_agent_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_assurance_scenarios" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "tags" JSONB,
    "departments" JSONB,
    "services" JSONB,
    "urgencyLevel" TEXT NOT NULL DEFAULT 'URGENT',
    "category" TEXT,
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eqore_assurance_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_case_studies" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "industryId" TEXT,
    "departmentSlug" TEXT,
    "servicesSlugs" JSONB,
    "outcomeMetrics" JSONB,
    "proofStatus" TEXT NOT NULL DEFAULT 'SEED_EXAMPLE',
    "clientName" TEXT,
    "isAnonymized" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eqore_case_studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_consultant_profiles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "bio" TEXT,
    "userId" TEXT,
    "departmentSlugs" JSONB,
    "serviceSlugs" JSONB,
    "expertiseTags" JSONB,
    "industryExperience" JSONB,
    "availableForRouting" BOOLEAN NOT NULL DEFAULT true,
    "priorityLevel" TEXT NOT NULL DEFAULT 'standard',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eqore_consultant_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_crm_sync_logs" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "crmProvider" TEXT NOT NULL DEFAULT 'INTERNAL',
    "externalCrmId" TEXT,
    "syncStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "syncPayload" JSONB,
    "errorMessage" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eqore_crm_sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_graph_edges" (
    "id" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "confidence" INTEGER NOT NULL DEFAULT 100,
    "reason" TEXT,
    "metadata" JSONB,
    "version" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eqore_graph_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_graph_nodes" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "version" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eqore_graph_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_sales_activities" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eqore_sales_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_sales_opportunities" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "ownerId" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'NEW',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "estimatedValue" DECIMAL(12,2),
    "primaryDepartment" TEXT,
    "matchedServices" JSONB,
    "recommendedPackage" TEXT,
    "nextAction" TEXT,
    "wonReason" TEXT,
    "lostReason" TEXT,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eqore_sales_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_sales_tasks" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "ownerId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "taskType" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "dueAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eqore_sales_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eqore_industries" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priorityLevel" TEXT NOT NULL DEFAULT 'standard',
    "commonPainPoints" JSONB,
    "relevantDepartments" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eqore_industries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "eqore_conversations_sessionId_key" ON "eqore_conversations"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "eqore_leads_conversationId_key" ON "eqore_leads"("conversationId");

-- CreateIndex
CREATE INDEX "eqore_leads_sessionId_idx" ON "eqore_leads"("sessionId");

-- CreateIndex
CREATE INDEX "eqore_leads_leadScore_idx" ON "eqore_leads"("leadScore");

-- CreateIndex
CREATE INDEX "eqore_leads_status_idx" ON "eqore_leads"("status");

-- CreateIndex
CREATE INDEX "eqore_lead_events_leadId_idx" ON "eqore_lead_events"("leadId");

-- CreateIndex
CREATE INDEX "eqore_lead_events_eventType_idx" ON "eqore_lead_events"("eventType");

-- CreateIndex
CREATE INDEX "eqore_messages_conversationId_idx" ON "eqore_messages"("conversationId");

-- CreateIndex
CREATE INDEX "eqore_agent_logs_conversationId_idx" ON "eqore_agent_logs"("conversationId");

-- CreateIndex
CREATE INDEX "eqore_agent_logs_leadId_idx" ON "eqore_agent_logs"("leadId");

-- CreateIndex
CREATE INDEX "eqore_agent_logs_detectedIntent_idx" ON "eqore_agent_logs"("detectedIntent");

-- CreateIndex
CREATE INDEX "eqore_agent_logs_createdAt_idx" ON "eqore_agent_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "eqore_case_studies_slug_key" ON "eqore_case_studies"("slug");

-- CreateIndex
CREATE INDEX "eqore_case_studies_industryId_idx" ON "eqore_case_studies"("industryId");

-- CreateIndex
CREATE INDEX "eqore_case_studies_departmentSlug_idx" ON "eqore_case_studies"("departmentSlug");

-- CreateIndex
CREATE INDEX "eqore_case_studies_proofStatus_idx" ON "eqore_case_studies"("proofStatus");

-- CreateIndex
CREATE UNIQUE INDEX "eqore_consultant_profiles_slug_key" ON "eqore_consultant_profiles"("slug");

-- CreateIndex
CREATE INDEX "eqore_consultant_profiles_slug_idx" ON "eqore_consultant_profiles"("slug");

-- CreateIndex
CREATE INDEX "eqore_crm_sync_logs_leadId_idx" ON "eqore_crm_sync_logs"("leadId");

-- CreateIndex
CREATE INDEX "eqore_crm_sync_logs_opportunityId_idx" ON "eqore_crm_sync_logs"("opportunityId");

-- CreateIndex
CREATE INDEX "eqore_crm_sync_logs_syncStatus_idx" ON "eqore_crm_sync_logs"("syncStatus");

-- CreateIndex
CREATE INDEX "eqore_graph_edges_fromNodeId_idx" ON "eqore_graph_edges"("fromNodeId");

-- CreateIndex
CREATE INDEX "eqore_graph_edges_toNodeId_idx" ON "eqore_graph_edges"("toNodeId");

-- CreateIndex
CREATE INDEX "eqore_graph_edges_type_idx" ON "eqore_graph_edges"("type");

-- CreateIndex
CREATE UNIQUE INDEX "eqore_graph_edges_fromNodeId_toNodeId_type_key" ON "eqore_graph_edges"("fromNodeId", "toNodeId", "type");

-- CreateIndex
CREATE INDEX "eqore_graph_nodes_type_idx" ON "eqore_graph_nodes"("type");

-- CreateIndex
CREATE INDEX "eqore_graph_nodes_slug_idx" ON "eqore_graph_nodes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "eqore_graph_nodes_type_slug_key" ON "eqore_graph_nodes"("type", "slug");

-- CreateIndex
CREATE INDEX "eqore_sales_activities_leadId_idx" ON "eqore_sales_activities"("leadId");

-- CreateIndex
CREATE INDEX "eqore_sales_activities_opportunityId_idx" ON "eqore_sales_activities"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "eqore_sales_opportunities_leadId_key" ON "eqore_sales_opportunities"("leadId");

-- CreateIndex
CREATE INDEX "eqore_sales_tasks_leadId_idx" ON "eqore_sales_tasks"("leadId");

-- CreateIndex
CREATE INDEX "eqore_sales_tasks_opportunityId_idx" ON "eqore_sales_tasks"("opportunityId");

-- CreateIndex
CREATE INDEX "eqore_sales_tasks_ownerId_idx" ON "eqore_sales_tasks"("ownerId");

-- CreateIndex
CREATE INDEX "eqore_sales_tasks_status_idx" ON "eqore_sales_tasks"("status");

-- CreateIndex
CREATE UNIQUE INDEX "eqore_industries_slug_key" ON "eqore_industries"("slug");

-- CreateIndex
CREATE INDEX "eqore_industries_slug_idx" ON "eqore_industries"("slug");

-- AddForeignKey
ALTER TABLE "eqore_leads" ADD CONSTRAINT "eqore_leads_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "eqore_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_lead_events" ADD CONSTRAINT "eqore_lead_events_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "eqore_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_messages" ADD CONSTRAINT "eqore_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "eqore_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_case_studies" ADD CONSTRAINT "eqore_case_studies_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "eqore_industries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_crm_sync_logs" ADD CONSTRAINT "eqore_crm_sync_logs_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "eqore_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_crm_sync_logs" ADD CONSTRAINT "eqore_crm_sync_logs_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "eqore_sales_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_graph_edges" ADD CONSTRAINT "eqore_graph_edges_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "eqore_graph_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_graph_edges" ADD CONSTRAINT "eqore_graph_edges_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "eqore_graph_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_activities" ADD CONSTRAINT "eqore_sales_activities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "eqore_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_activities" ADD CONSTRAINT "eqore_sales_activities_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "eqore_sales_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_opportunities" ADD CONSTRAINT "eqore_sales_opportunities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "eqore_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_tasks" ADD CONSTRAINT "eqore_sales_tasks_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "eqore_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_tasks" ADD CONSTRAINT "eqore_sales_tasks_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "eqore_sales_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

