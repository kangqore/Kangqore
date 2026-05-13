-- CreateEnum
CREATE TYPE "AdminItemType" AS ENUM ('SPAM', 'TRASH', 'IMPORTANT', 'STARRED', 'SCHEDULED', 'LEAD');

-- CreateEnum
CREATE TYPE "ActorRole" AS ENUM ('ADMIN', 'CLIENT', 'SYSTEM', 'PARTNER');

-- CreateEnum
CREATE TYPE "EventSource" AS ENUM ('DASHBOARD', 'EMAIL', 'SYSTEM_RULE', 'API', 'ADMIN_OVERRIDE');

-- CreateEnum
CREATE TYPE "RelatedEntityType" AS ENUM ('DECISION', 'RISK', 'CHANGE_REQUEST', 'DELIVERABLE', 'TASK', 'INVOICE');

-- CreateEnum
CREATE TYPE "ObligationType" AS ENUM ('APPROVAL_REQUIRED', 'ACCESS_REQUIRED', 'SIGN_OFF_REQUIRED', 'INPUT_REQUIRED', 'PAYMENT_REQUIRED');

-- CreateEnum
CREATE TYPE "ObligationStatus" AS ENUM ('OPEN', 'FULFILLED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "ImpactType" AS ENUM ('DELAY_DAYS', 'COST_INCREASE', 'RISK_SCORE', 'SCOPE_EXPANSION');

-- CreateEnum
CREATE TYPE "ImpactUnit" AS ENUM ('DAYS', 'INR', 'USD', 'SCORE', 'PERCENT');

-- CreateEnum
CREATE TYPE "ImpactDomain" AS ENUM ('TIMELINE', 'BUDGET', 'RISK', 'QUALITY');

-- AlterEnum
ALTER TYPE "ConsultationStatus" ADD VALUE 'RESCHEDULED';

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'VISITOR';

-- AlterTable
ALTER TABLE "consultations" ADD COLUMN     "location" TEXT,
ADD COLUMN     "meetingLink" TEXT,
ADD COLUMN     "meetingMode" TEXT,
ADD COLUMN     "previousScheduledAt" TIMESTAMP(3),
ADD COLUMN     "services" TEXT[],
ADD COLUMN     "topic" TEXT;

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "inquiryType" TEXT,
ADD COLUMN     "interestedServices" TEXT[],
ADD COLUMN     "organization" TEXT,
ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "contents" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "kind" TEXT DEFAULT 'chatbot',
ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "deliverables" ADD COLUMN     "acceptanceCriteria" TEXT,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedByRole" TEXT,
ADD COLUMN     "complianceCheckPassed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "invoiceId" TEXT,
ADD COLUMN     "partnerId" TEXT,
ADD COLUMN     "qualityGateStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "securityScanPassed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "job_applications" ADD COLUMN     "jobId" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "adminConfidenceScore" INTEGER DEFAULT 0,
ADD COLUMN     "budget" DECIMAL(12,2),
ADD COLUMN     "category" TEXT DEFAULT 'Transformation',
ADD COLUMN     "clientSentimentScore" INTEGER DEFAULT 0,
ADD COLUMN     "constraints" JSONB,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "health" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "lastAlignmentCheck" TIMESTAMP(3),
ADD COLUMN     "leadId" TEXT,
ADD COLUMN     "nextGate" TEXT,
ADD COLUMN     "partnerId" TEXT,
ADD COLUMN     "priorityOrder" TEXT,
ADD COLUMN     "progress" INTEGER DEFAULT 0,
ADD COLUMN     "progressCalculationMethod" TEXT DEFAULT 'MANUAL',
ADD COLUMN     "progressConfidence" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "progressEvidence" JSONB,
ADD COLUMN     "progressLastValidated" TIMESTAMP(3),
ADD COLUMN     "progressOverride" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "progressOverrideReason" TEXT,
ADD COLUMN     "services" TEXT[],
ADD COLUMN     "slaMetrics" JSONB,
ADD COLUMN     "spend" DECIMAL(12,2) DEFAULT 0,
ADD COLUMN     "vision" TEXT,
ADD COLUMN     "visionClientFeedback" TEXT,
ADD COLUMN     "visionStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "visionWorkflows" JSONB;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "partnerId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "appleId" TEXT,
ADD COLUMN     "authorityRole" TEXT,
ADD COLUMN     "collegeEmail" TEXT,
ADD COLUMN     "customId" TEXT,
ADD COLUMN     "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "investorInterests" TEXT[],
ADD COLUMN     "investorPortfolio" TEXT[],
ADD COLUMN     "isRedFlagged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkedinId" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "portfolio" JSONB,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "purpose" TEXT;

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ASSET',
    "size" INTEGER,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_resources" (
    "id" TEXT NOT NULL,
    "deliverableId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_signals" (
    "id" TEXT NOT NULL,
    "deliverableId" TEXT NOT NULL,
    "signalType" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "payload" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_chunks" (
    "id" TEXT NOT NULL,
    "sourceFile" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "tags" TEXT[],
    "embedding" DOUBLE PRECISION[],
    "embedModel" TEXT,
    "contentHash" TEXT NOT NULL,
    "populated" BOOLEAN NOT NULL DEFAULT true,
    "internal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concierge_feedback" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "messageIndex" INTEGER NOT NULL,
    "rating" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "concierge_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "probability" TEXT,
    "impact" TEXT,
    "owner" TEXT,
    "riskOwner" TEXT DEFAULT 'SHARED',
    "trend" TEXT DEFAULT 'STABLE',
    "mitigationPlan" TEXT,
    "contingencyPlan" TEXT,
    "clientResponse" TEXT,
    "clientResponseAt" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "acceptanceNote" TEXT,
    "clientAcceptedAt" TIMESTAMP(3),
    "clientAcceptedBy" TEXT,
    "acceptanceSignature" TEXT,
    "isClientVisible" BOOLEAN NOT NULL DEFAULT true,
    "sourceEmailId" TEXT,
    "sourceMeetingId" TEXT,
    "sourceMessageId" TEXT,

    CONSTRAINT "risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "priority" TEXT,
    "dueDate" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "approverId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvalRole" TEXT,
    "approvedAt" TIMESTAMP(3),
    "impactTime" TEXT,
    "impactCost" TEXT,
    "impactRisk" TEXT,
    "changeRequestId" TEXT,
    "riskId" TEXT,
    "sourceEmailId" TEXT,
    "sourceMeetingId" TEXT,
    "sourceMessageId" TEXT,

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_views" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_status_history" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "fromStatus" TEXT NOT NULL,
    "toStatus" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "fileUrl" TEXT,
    "notes" TEXT,
    "projectId" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_requests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "decisionType" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'PROPOSED',
    "rationale" TEXT,
    "tradeoffs" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "acknowledgedBy" TEXT,
    "costImpact" DECIMAL(10,2),
    "timeImpact" TEXT,
    "adminResponseRationale" TEXT,
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "requestedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceId" TEXT,
    "rejectionImpact" TEXT,
    "sourceEmailId" TEXT,
    "sourceMeetingId" TEXT,
    "sourceMessageId" TEXT,

    CONSTRAINT "change_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "department" TEXT,
    "location" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "isp" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "device" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_items" (
    "id" TEXT NOT NULL,
    "type" "AdminItemType" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "notes" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_views" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "userId" TEXT,
    "viewerIp" TEXT,
    "userAgent" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_shares" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "userId" TEXT,
    "platform" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_analytics" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "byCountry" JSONB,
    "byDevice" JSONB,
    "byRole" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "source" TEXT,
    "notifyNewContent" BOOLEAN NOT NULL DEFAULT true,
    "notifyWeeklyDigest" BOOLEAN NOT NULL DEFAULT false,
    "unsubscribeToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "contentId" TEXT NOT NULL,
    "duration" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "platform" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "joinLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "clientId" TEXT,
    "createdBy" TEXT NOT NULL,
    "services" TEXT[],
    "adminConfidenceScore" INTEGER NOT NULL DEFAULT 100,
    "clientSentimentScore" INTEGER NOT NULL DEFAULT 100,
    "lastAlignmentCheck" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "investorId" TEXT,
    "partnerId" TEXT,
    "jobSeekerId" TEXT,
    "momUrl" TEXT,
    "recordingLink" TEXT,
    "location" TEXT,
    "meetingMode" TEXT,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "clientId" TEXT NOT NULL,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_messages" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_versions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "version" TEXT,
    "metadata" JSONB,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_links" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT,
    "channelId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachments" JSONB,
    "partnerId" TEXT,
    "contextType" TEXT,
    "contextId" TEXT,
    "tags" JSONB,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "preview" TEXT,
    "hasAttachment" BOOLEAN NOT NULL DEFAULT false,
    "isUnread" BOOLEAN NOT NULL DEFAULT true,
    "clientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investorId" TEXT,
    "partnerId" TEXT,
    "attachments" JSONB,
    "direction" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "replyToId" TEXT,
    "threadId" TEXT,
    "jobSeekerId" TEXT,
    "adminFolder" TEXT DEFAULT 'INBOX',
    "adminLabels" JSONB,
    "clientFolder" TEXT DEFAULT 'INBOX',
    "clientLabels" JSONB,
    "investorFolder" TEXT DEFAULT 'INBOX',
    "investorLabels" JSONB,
    "isAdminImportant" BOOLEAN NOT NULL DEFAULT false,
    "isAdminStarred" BOOLEAN NOT NULL DEFAULT false,
    "isClientImportant" BOOLEAN NOT NULL DEFAULT false,
    "isClientStarred" BOOLEAN NOT NULL DEFAULT false,
    "isInvestorImportant" BOOLEAN NOT NULL DEFAULT false,
    "isInvestorStarred" BOOLEAN NOT NULL DEFAULT false,
    "isJobSeekerImportant" BOOLEAN NOT NULL DEFAULT false,
    "isJobSeekerStarred" BOOLEAN NOT NULL DEFAULT false,
    "isPartnerImportant" BOOLEAN NOT NULL DEFAULT false,
    "isPartnerStarred" BOOLEAN NOT NULL DEFAULT false,
    "jobSeekerFolder" TEXT DEFAULT 'INBOX',
    "jobSeekerLabels" JSONB,
    "partnerFolder" TEXT DEFAULT 'INBOX',
    "partnerLabels" JSONB,
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "isImmutable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_updates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investor_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "legalEntityName" TEXT,
    "registeredAddress" TEXT,
    "taxId" TEXT,
    "industryDomain" TEXT,
    "jurisdiction" TEXT,
    "dataResidency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "billingContactEmail" TEXT,
    "billingContactName" TEXT,
    "billingContactPhone" TEXT,
    "escalationMatrix" JSONB,
    "interestedServices" TEXT[],
    "governanceRules" TEXT,
    "governanceRationale" TEXT,
    "governanceApprovedBy" TEXT,
    "governanceApprovedAt" TIMESTAMP(3),
    "rulesLastUpdated" TIMESTAMP(3),
    "rulesAcknowledgedAt" TIMESTAMP(3),
    "rulesAcknowledgedBy" TEXT,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorityRole" (
    "id" TEXT NOT NULL,
    "clientProfileId" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "canApproveBudget" BOOLEAN NOT NULL DEFAULT false,
    "canApproveScope" BOOLEAN NOT NULL DEFAULT false,
    "canApproveGoLive" BOOLEAN NOT NULL DEFAULT false,
    "signingLimit" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorityRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessObjective" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "kpiMetric" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ON_TRACK',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accountability_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventCategory" TEXT NOT NULL,
    "eventSource" "EventSource",
    "actorRole" "ActorRole",
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "decisionId" TEXT,
    "riskId" TEXT,
    "changeRequestId" TEXT,
    "deliverableId" TEXT,
    "relatedEntityType" "RelatedEntityType",
    "relatedEntityId" TEXT,
    "actionTaken" TEXT NOT NULL,
    "impactSummary" TEXT,
    "commitmentNote" TEXT,
    "ipAddress" TEXT,
    "summary" TEXT,
    "eventTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accountability_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accountability_obligations" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "obligationType" "ObligationType" NOT NULL,
    "owedByRole" "ActorRole" NOT NULL,
    "owedByUserId" TEXT,
    "description" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "ObligationStatus" NOT NULL DEFAULT 'OPEN',
    "linkedEventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "accountability_obligations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accountability_impacts" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "impactType" "ImpactType" NOT NULL,
    "impactValue" DECIMAL(12,2) NOT NULL,
    "impactUnit" "ImpactUnit" NOT NULL,
    "appliedTo" "ImpactDomain" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accountability_impacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accountability_snapshots" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "snapshotDate" DATE NOT NULL,
    "clientDelayDays" INTEGER NOT NULL DEFAULT 0,
    "adminDelayDays" INTEGER NOT NULL DEFAULT 0,
    "externalDelayDays" INTEGER NOT NULL DEFAULT 0,
    "budgetClientCaused" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "budgetAdminCaused" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "riskScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accountability_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_lines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_metrics" (
    "id" TEXT NOT NULL,
    "serviceLineId" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "revenue" DECIMAL(12,2) NOT NULL,
    "cost" DECIMAL(12,2) NOT NULL,
    "margin" DECIMAL(5,2) NOT NULL,
    "utilization" DECIMAL(5,2) NOT NULL,
    "headcount" INTEGER NOT NULL,
    "bench" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practice_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "risk" TEXT NOT NULL DEFAULT 'LOW',
    "tier" TEXT NOT NULL DEFAULT 'Operational',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "renewalDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issues" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "owner" TEXT,
    "dueDate" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assumptions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "owner" TEXT,
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dependencies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'INTERNAL',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "owner" TEXT,
    "dueDate" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ip_assets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "owner" TEXT,
    "tags" TEXT[],
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ip_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_feedbacks" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "npsScore" INTEGER NOT NULL,
    "comment" TEXT,
    "testimonial" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "adminResponse" TEXT,
    "designation" TEXT,
    "clientName" TEXT,
    "idNumber" TEXT,
    "companyName" TEXT,
    "logoUrl" TEXT,
    "photoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToServiceLine" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "delivery_signals_deliverableId_idx" ON "delivery_signals"("deliverableId");

-- CreateIndex
CREATE INDEX "knowledge_chunks_parentId_idx" ON "knowledge_chunks"("parentId");

-- CreateIndex
CREATE INDEX "knowledge_chunks_sourceFile_idx" ON "knowledge_chunks"("sourceFile");

-- CreateIndex
CREATE INDEX "knowledge_chunks_contentHash_idx" ON "knowledge_chunks"("contentHash");

-- CreateIndex
CREATE INDEX "concierge_feedback_conversationId_idx" ON "concierge_feedback"("conversationId");

-- CreateIndex
CREATE INDEX "concierge_feedback_rating_createdAt_idx" ON "concierge_feedback"("rating", "createdAt");

-- CreateIndex
CREATE INDEX "risks_projectId_idx" ON "risks"("projectId");

-- CreateIndex
CREATE INDEX "risks_clientId_idx" ON "risks"("clientId");

-- CreateIndex
CREATE INDEX "risks_status_idx" ON "risks"("status");

-- CreateIndex
CREATE INDEX "decisions_projectId_idx" ON "decisions"("projectId");

-- CreateIndex
CREATE INDEX "decisions_clientId_idx" ON "decisions"("clientId");

-- CreateIndex
CREATE INDEX "decisions_status_idx" ON "decisions"("status");

-- CreateIndex
CREATE INDEX "decision_views_decisionId_idx" ON "decision_views"("decisionId");

-- CreateIndex
CREATE INDEX "decision_views_userId_idx" ON "decision_views"("userId");

-- CreateIndex
CREATE INDEX "decision_status_history_decisionId_idx" ON "decision_status_history"("decisionId");

-- CreateIndex
CREATE INDEX "decision_status_history_userId_idx" ON "decision_status_history"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_clientId_idx" ON "invoices"("clientId");

-- CreateIndex
CREATE INDEX "invoices_projectId_idx" ON "invoices"("projectId");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "change_requests_projectId_idx" ON "change_requests"("projectId");

-- CreateIndex
CREATE INDEX "change_requests_clientId_idx" ON "change_requests"("clientId");

-- CreateIndex
CREATE INDEX "change_requests_status_idx" ON "change_requests"("status");

-- CreateIndex
CREATE INDEX "visits_createdAt_idx" ON "visits"("createdAt");

-- CreateIndex
CREATE INDEX "visits_country_idx" ON "visits"("country");

-- CreateIndex
CREATE INDEX "admin_items_type_idx" ON "admin_items"("type");

-- CreateIndex
CREATE INDEX "admin_items_adminId_idx" ON "admin_items"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_items_type_entityType_entityId_adminId_key" ON "admin_items"("type", "entityType", "entityId", "adminId");

-- CreateIndex
CREATE INDEX "content_views_contentId_idx" ON "content_views"("contentId");

-- CreateIndex
CREATE INDEX "content_views_userId_idx" ON "content_views"("userId");

-- CreateIndex
CREATE INDEX "content_views_createdAt_idx" ON "content_views"("createdAt");

-- CreateIndex
CREATE INDEX "content_views_country_idx" ON "content_views"("country");

-- CreateIndex
CREATE INDEX "content_shares_contentId_idx" ON "content_shares"("contentId");

-- CreateIndex
CREATE INDEX "content_shares_platform_idx" ON "content_shares"("platform");

-- CreateIndex
CREATE INDEX "content_shares_createdAt_idx" ON "content_shares"("createdAt");

-- CreateIndex
CREATE INDEX "content_analytics_date_idx" ON "content_analytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "content_analytics_contentId_date_key" ON "content_analytics"("contentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_unsubscribeToken_key" ON "subscribers"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "subscribers_status_idx" ON "subscribers"("status");

-- CreateIndex
CREATE INDEX "subscribers_createdAt_idx" ON "subscribers"("createdAt");

-- CreateIndex
CREATE INDEX "reading_history_userId_idx" ON "reading_history"("userId");

-- CreateIndex
CREATE INDEX "reading_history_sessionId_idx" ON "reading_history"("sessionId");

-- CreateIndex
CREATE INDEX "reading_history_contentId_idx" ON "reading_history"("contentId");

-- CreateIndex
CREATE INDEX "reading_history_createdAt_idx" ON "reading_history"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "tickets_clientId_idx" ON "tickets"("clientId");

-- CreateIndex
CREATE INDEX "tickets_status_idx" ON "tickets"("status");

-- CreateIndex
CREATE INDEX "ticket_messages_ticketId_idx" ON "ticket_messages"("ticketId");

-- CreateIndex
CREATE INDEX "messages_senderId_receiverId_idx" ON "messages"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "messages_contextType_contextId_idx" ON "messages"("contextType", "contextId");

-- CreateIndex
CREATE INDEX "email_logs_threadId_idx" ON "email_logs"("threadId");

-- CreateIndex
CREATE INDEX "email_logs_partnerId_idx" ON "email_logs"("partnerId");

-- CreateIndex
CREATE INDEX "email_logs_clientId_idx" ON "email_logs"("clientId");

-- CreateIndex
CREATE INDEX "email_logs_investorId_idx" ON "email_logs"("investorId");

-- CreateIndex
CREATE INDEX "email_logs_jobSeekerId_idx" ON "email_logs"("jobSeekerId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_userId_key" ON "ClientProfile"("userId");

-- CreateIndex
CREATE INDEX "accountability_events_projectId_eventTimestamp_idx" ON "accountability_events"("projectId", "eventTimestamp");

-- CreateIndex
CREATE INDEX "accountability_events_clientId_eventTimestamp_idx" ON "accountability_events"("clientId", "eventTimestamp");

-- CreateIndex
CREATE INDEX "accountability_events_eventType_idx" ON "accountability_events"("eventType");

-- CreateIndex
CREATE INDEX "accountability_obligations_clientId_status_idx" ON "accountability_obligations"("clientId", "status");

-- CreateIndex
CREATE INDEX "accountability_obligations_projectId_status_idx" ON "accountability_obligations"("projectId", "status");

-- CreateIndex
CREATE INDEX "accountability_obligations_owedByRole_status_idx" ON "accountability_obligations"("owedByRole", "status");

-- CreateIndex
CREATE INDEX "accountability_obligations_linkedEventId_idx" ON "accountability_obligations"("linkedEventId");

-- CreateIndex
CREATE INDEX "accountability_impacts_eventId_idx" ON "accountability_impacts"("eventId");

-- CreateIndex
CREATE INDEX "accountability_impacts_appliedTo_idx" ON "accountability_impacts"("appliedTo");

-- CreateIndex
CREATE INDEX "accountability_snapshots_clientId_snapshotDate_idx" ON "accountability_snapshots"("clientId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "accountability_snapshots_projectId_snapshotDate_key" ON "accountability_snapshots"("projectId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "service_lines_slug_key" ON "service_lines"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "practice_metrics_serviceLineId_period_key" ON "practice_metrics"("serviceLineId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToServiceLine_AB_unique" ON "_ProjectToServiceLine"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToServiceLine_B_index" ON "_ProjectToServiceLine"("B");

-- CreateIndex
CREATE INDEX "conversations_kind_createdAt_idx" ON "conversations"("kind", "createdAt");

-- CreateIndex
CREATE INDEX "projects_clientId_idx" ON "projects"("clientId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_customId_key" ON "users"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "users_appleId_key" ON "users"("appleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_linkedinId_key" ON "users"("linkedinId");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_resources" ADD CONSTRAINT "external_resources_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "deliverables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_signals" ADD CONSTRAINT "delivery_signals_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "deliverables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risks" ADD CONSTRAINT "risks_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risks" ADD CONSTRAINT "risks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risks" ADD CONSTRAINT "risks_sourceEmailId_fkey" FOREIGN KEY ("sourceEmailId") REFERENCES "email_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risks" ADD CONSTRAINT "risks_sourceMeetingId_fkey" FOREIGN KEY ("sourceMeetingId") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risks" ADD CONSTRAINT "risks_sourceMessageId_fkey" FOREIGN KEY ("sourceMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_changeRequestId_fkey" FOREIGN KEY ("changeRequestId") REFERENCES "change_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "risks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_sourceEmailId_fkey" FOREIGN KEY ("sourceEmailId") REFERENCES "email_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_sourceMeetingId_fkey" FOREIGN KEY ("sourceMeetingId") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_sourceMessageId_fkey" FOREIGN KEY ("sourceMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_views" ADD CONSTRAINT "decision_views_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "decisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_views" ADD CONSTRAINT "decision_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_status_history" ADD CONSTRAINT "decision_status_history_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_status_history" ADD CONSTRAINT "decision_status_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_sourceEmailId_fkey" FOREIGN KEY ("sourceEmailId") REFERENCES "email_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_sourceMeetingId_fkey" FOREIGN KEY ("sourceMeetingId") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_sourceMessageId_fkey" FOREIGN KEY ("sourceMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_items" ADD CONSTRAINT "admin_items_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_views" ADD CONSTRAINT "content_views_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_shares" ADD CONSTRAINT "content_shares_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_analytics" ADD CONSTRAINT "content_analytics_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_versions" ADD CONSTRAINT "product_versions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_versions" ADD CONSTRAINT "product_versions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_links" ADD CONSTRAINT "resource_links_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorityRole" ADD CONSTRAINT "AuthorityRole_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessObjective" ADD CONSTRAINT "BusinessObjective_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_events" ADD CONSTRAINT "accountability_events_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_events" ADD CONSTRAINT "accountability_events_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_events" ADD CONSTRAINT "accountability_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_events" ADD CONSTRAINT "accountability_events_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "decisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_events" ADD CONSTRAINT "accountability_events_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "risks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_events" ADD CONSTRAINT "accountability_events_changeRequestId_fkey" FOREIGN KEY ("changeRequestId") REFERENCES "change_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_events" ADD CONSTRAINT "accountability_events_deliverableId_fkey" FOREIGN KEY ("deliverableId") REFERENCES "deliverables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_obligations" ADD CONSTRAINT "accountability_obligations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_obligations" ADD CONSTRAINT "accountability_obligations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_obligations" ADD CONSTRAINT "accountability_obligations_linkedEventId_fkey" FOREIGN KEY ("linkedEventId") REFERENCES "accountability_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_obligations" ADD CONSTRAINT "accountability_obligations_owedByUserId_fkey" FOREIGN KEY ("owedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_impacts" ADD CONSTRAINT "accountability_impacts_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "accountability_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_snapshots" ADD CONSTRAINT "accountability_snapshots_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountability_snapshots" ADD CONSTRAINT "accountability_snapshots_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_lines" ADD CONSTRAINT "service_lines_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_metrics" ADD CONSTRAINT "practice_metrics_serviceLineId_fkey" FOREIGN KEY ("serviceLineId") REFERENCES "service_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assumptions" ADD CONSTRAINT "assumptions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assumptions" ADD CONSTRAINT "assumptions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependencies" ADD CONSTRAINT "dependencies_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependencies" ADD CONSTRAINT "dependencies_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_feedbacks" ADD CONSTRAINT "client_feedbacks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_feedbacks" ADD CONSTRAINT "client_feedbacks_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToServiceLine" ADD CONSTRAINT "_ProjectToServiceLine_A_fkey" FOREIGN KEY ("A") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToServiceLine" ADD CONSTRAINT "_ProjectToServiceLine_B_fkey" FOREIGN KEY ("B") REFERENCES "service_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

