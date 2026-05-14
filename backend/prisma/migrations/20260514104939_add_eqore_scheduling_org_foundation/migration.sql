-- CreateEnum
CREATE TYPE "EqoreSchedulingStatus" AS ENUM ('NONE', 'INTERESTED', 'PARSING_TIME', 'SLOT_OFFERED', 'NEGOTIATING', 'BOOKING_PENDING', 'BOOKED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "InviteeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScheduledEventStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "availability_schedules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Working Hours',
    "userId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "rules" JSONB NOT NULL,
    "overrides" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_schedules_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "event_invitees" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "timezone" TEXT,
    "responses" JSONB,
    "status" "InviteeStatus" NOT NULL DEFAULT 'ACCEPTED',
    "viewedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_invitees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_types" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#2564ea',
    "bufferBefore" INTEGER NOT NULL DEFAULT 0,
    "bufferAfter" INTEGER NOT NULL DEFAULT 0,
    "maxPerDay" INTEGER,
    "minNotice" INTEGER NOT NULL DEFAULT 60,
    "maxAdvanceDays" INTEGER NOT NULL DEFAULT 30,
    "hostId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "location" TEXT,
    "locationType" TEXT NOT NULL DEFAULT 'VIDEO',
    "requirePhone" BOOLEAN NOT NULL DEFAULT false,
    "requireCompany" BOOLEAN NOT NULL DEFAULT false,
    "customQuestions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitee_no_shows" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "invitee_no_shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_locations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meeting_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_invitations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_memberships" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routing_forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "questions" JSONB NOT NULL,
    "routingRules" JSONB NOT NULL,
    "fallbackEventTypeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routing_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routing_form_submissions" (
    "id" TEXT NOT NULL,
    "routingFormId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "routedToEventTypeId" TEXT,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "routing_form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_events" (
    "id" TEXT NOT NULL,
    "eventTypeId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "status" "ScheduledEventStatus" NOT NULL DEFAULT 'ACTIVE',
    "locationType" TEXT,
    "locationValue" TEXT,
    "joinUrl" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelledBy" TEXT,
    "cancelReason" TEXT,
    "rescheduledFrom" TEXT,
    "schedulingLinkId" TEXT,
    "consultationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduling_links" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "eventTypeId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "maxUses" INTEGER,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "prefillName" TEXT,
    "prefillEmail" TEXT,
    "prefillCompany" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scheduling_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AvailabilityScheduleToEventType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "availability_schedules_userId_idx" ON "availability_schedules"("userId");

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
CREATE UNIQUE INDEX "eqore_conversations_sessionId_key" ON "eqore_conversations"("sessionId");

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
CREATE UNIQUE INDEX "eqore_industries_slug_key" ON "eqore_industries"("slug");

-- CreateIndex
CREATE INDEX "eqore_industries_slug_idx" ON "eqore_industries"("slug");

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
CREATE INDEX "eqore_sales_activities_leadId_idx" ON "eqore_sales_activities"("leadId");

-- CreateIndex
CREATE INDEX "eqore_sales_activities_opportunityId_idx" ON "eqore_sales_activities"("opportunityId");

-- CreateIndex
CREATE INDEX "eqore_sales_notes_leadId_idx" ON "eqore_sales_notes"("leadId");

-- CreateIndex
CREATE INDEX "eqore_sales_notes_opportunityId_idx" ON "eqore_sales_notes"("opportunityId");

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
CREATE INDEX "event_invitees_eventId_idx" ON "event_invitees"("eventId");

-- CreateIndex
CREATE INDEX "event_invitees_email_idx" ON "event_invitees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "event_invitees_eventId_email_key" ON "event_invitees"("eventId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "event_types_slug_key" ON "event_types"("slug");

-- CreateIndex
CREATE INDEX "event_types_hostId_idx" ON "event_types"("hostId");

-- CreateIndex
CREATE INDEX "event_types_slug_idx" ON "event_types"("slug");

-- CreateIndex
CREATE INDEX "event_types_isActive_isPublic_idx" ON "event_types"("isActive", "isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "invitee_no_shows_inviteeId_key" ON "invitee_no_shows"("inviteeId");

-- CreateIndex
CREATE INDEX "invitee_no_shows_eventId_idx" ON "invitee_no_shows"("eventId");

-- CreateIndex
CREATE INDEX "meeting_locations_userId_idx" ON "meeting_locations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "org_invitations_token_key" ON "org_invitations"("token");

-- CreateIndex
CREATE INDEX "org_invitations_token_idx" ON "org_invitations"("token");

-- CreateIndex
CREATE UNIQUE INDEX "org_memberships_organizationId_userId_key" ON "org_memberships"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "routing_forms_slug_key" ON "routing_forms"("slug");

-- CreateIndex
CREATE INDEX "routing_forms_slug_idx" ON "routing_forms"("slug");

-- CreateIndex
CREATE INDEX "routing_form_submissions_routingFormId_idx" ON "routing_form_submissions"("routingFormId");

-- CreateIndex
CREATE INDEX "scheduled_events_hostId_startTime_idx" ON "scheduled_events"("hostId", "startTime");

-- CreateIndex
CREATE INDEX "scheduled_events_eventTypeId_idx" ON "scheduled_events"("eventTypeId");

-- CreateIndex
CREATE INDEX "scheduled_events_status_idx" ON "scheduled_events"("status");

-- CreateIndex
CREATE UNIQUE INDEX "scheduling_links_slug_key" ON "scheduling_links"("slug");

-- CreateIndex
CREATE INDEX "scheduling_links_slug_idx" ON "scheduling_links"("slug");

-- CreateIndex
CREATE INDEX "scheduling_links_eventTypeId_idx" ON "scheduling_links"("eventTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "_AvailabilityScheduleToEventType_AB_unique" ON "_AvailabilityScheduleToEventType"("A", "B");

-- CreateIndex
CREATE INDEX "_AvailabilityScheduleToEventType_B_index" ON "_AvailabilityScheduleToEventType"("B");

-- AddForeignKey
ALTER TABLE "availability_schedules" ADD CONSTRAINT "availability_schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "eqore_leads" ADD CONSTRAINT "eqore_leads_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "eqore_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_lead_events" ADD CONSTRAINT "eqore_lead_events_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "eqore_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_messages" ADD CONSTRAINT "eqore_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "eqore_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_activities" ADD CONSTRAINT "eqore_sales_activities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "eqore_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_activities" ADD CONSTRAINT "eqore_sales_activities_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "eqore_sales_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_notes" ADD CONSTRAINT "eqore_sales_notes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "eqore_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_notes" ADD CONSTRAINT "eqore_sales_notes_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "eqore_sales_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_opportunities" ADD CONSTRAINT "eqore_sales_opportunities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "eqore_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_tasks" ADD CONSTRAINT "eqore_sales_tasks_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "eqore_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eqore_sales_tasks" ADD CONSTRAINT "eqore_sales_tasks_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "eqore_sales_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_invitees" ADD CONSTRAINT "event_invitees_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "scheduled_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_types" ADD CONSTRAINT "event_types_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitee_no_shows" ADD CONSTRAINT "invitee_no_shows_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "scheduled_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitee_no_shows" ADD CONSTRAINT "invitee_no_shows_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "event_invitees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_locations" ADD CONSTRAINT "meeting_locations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_invitations" ADD CONSTRAINT "org_invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routing_forms" ADD CONSTRAINT "routing_forms_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routing_form_submissions" ADD CONSTRAINT "routing_form_submissions_routingFormId_fkey" FOREIGN KEY ("routingFormId") REFERENCES "routing_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_events" ADD CONSTRAINT "scheduled_events_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_events" ADD CONSTRAINT "scheduled_events_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_events" ADD CONSTRAINT "scheduled_events_schedulingLinkId_fkey" FOREIGN KEY ("schedulingLinkId") REFERENCES "scheduling_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduling_links" ADD CONSTRAINT "scheduling_links_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduling_links" ADD CONSTRAINT "scheduling_links_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AvailabilityScheduleToEventType" ADD CONSTRAINT "_AvailabilityScheduleToEventType_A_fkey" FOREIGN KEY ("A") REFERENCES "availability_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AvailabilityScheduleToEventType" ADD CONSTRAINT "_AvailabilityScheduleToEventType_B_fkey" FOREIGN KEY ("B") REFERENCES "event_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

