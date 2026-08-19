-- CreateTable
CREATE TABLE "developer_apps" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "category" TEXT NOT NULL DEFAULT 'COMMUNITY',
    "description" TEXT NOT NULL,
    "publisherName" TEXT NOT NULL,
    "publisherEmail" TEXT NOT NULL,
    "publisherSite" TEXT,
    "iconEmoji" TEXT DEFAULT '🧩',
    "ownerUserId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecretHash" TEXT NOT NULL,
    "secretPrefix" TEXT NOT NULL,
    "manifest" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "governanceScore" INTEGER NOT NULL DEFAULT 0,
    "certifiedBadge" BOOLEAN NOT NULL DEFAULT false,
    "certifiedAt" TIMESTAMP(3),
    "certificationNotes" TEXT,
    "redirectUris" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "installCount" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0.20,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "developer_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_installations" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "installedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "grantedPermissions" JSONB NOT NULL,
    "grantedScopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allowedActions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allowedObjectTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "policyId" TEXT,
    "budgetCredits" INTEGER NOT NULL DEFAULT 1000,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "rateLimitPerMin" INTEGER NOT NULL DEFAULT 60,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uninstalledAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_installations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_audit_events" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "installationId" TEXT,
    "tenantId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorType" TEXT NOT NULL DEFAULT 'DEVELOPER_APP',
    "eventType" TEXT NOT NULL,
    "actionName" TEXT,
    "outcome" TEXT NOT NULL,
    "policyId" TEXT,
    "policyName" TEXT,
    "policyEffect" TEXT,
    "creditsCharged" INTEGER NOT NULL DEFAULT 0,
    "durationMs" INTEGER,
    "params" JSONB,
    "result" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_oauth_tokens" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "grantType" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "refreshHash" TEXT,
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_oauth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_oauth_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "redirectUri" TEXT NOT NULL,
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "codeChallenge" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_oauth_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_deployments" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "environment" TEXT NOT NULL DEFAULT 'SANDBOX',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "manifestSnapshot" JSONB NOT NULL,
    "releaseNotes" TEXT,
    "deployedBy" TEXT NOT NULL,
    "logs" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "app_deployments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_test_runs" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "suiteName" TEXT NOT NULL DEFAULT 'default',
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "totalTests" INTEGER NOT NULL DEFAULT 0,
    "passedTests" INTEGER NOT NULL DEFAULT 0,
    "failedTests" INTEGER NOT NULL DEFAULT 0,
    "results" JSONB,
    "durationMs" INTEGER,
    "triggeredBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_test_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "developer_apps_appId_key" ON "developer_apps"("appId");

-- CreateIndex
CREATE UNIQUE INDEX "developer_apps_slug_key" ON "developer_apps"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "developer_apps_clientId_key" ON "developer_apps"("clientId");

-- CreateIndex
CREATE INDEX "developer_apps_status_category_idx" ON "developer_apps"("status", "category");

-- CreateIndex
CREATE INDEX "developer_apps_ownerUserId_idx" ON "developer_apps"("ownerUserId");

-- CreateIndex
CREATE INDEX "developer_apps_clientId_idx" ON "developer_apps"("clientId");

-- CreateIndex
CREATE INDEX "app_installations_tenantId_status_idx" ON "app_installations"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "app_installations_appId_tenantId_key" ON "app_installations"("appId", "tenantId");

-- CreateIndex
CREATE INDEX "app_audit_events_appId_createdAt_idx" ON "app_audit_events"("appId", "createdAt");

-- CreateIndex
CREATE INDEX "app_audit_events_tenantId_createdAt_idx" ON "app_audit_events"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "app_audit_events_eventType_outcome_idx" ON "app_audit_events"("eventType", "outcome");

-- CreateIndex
CREATE UNIQUE INDEX "app_oauth_tokens_tokenHash_key" ON "app_oauth_tokens"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "app_oauth_tokens_refreshHash_key" ON "app_oauth_tokens"("refreshHash");

-- CreateIndex
CREATE INDEX "app_oauth_tokens_appId_revoked_idx" ON "app_oauth_tokens"("appId", "revoked");

-- CreateIndex
CREATE INDEX "app_oauth_tokens_tokenHash_idx" ON "app_oauth_tokens"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "app_oauth_codes_code_key" ON "app_oauth_codes"("code");

-- CreateIndex
CREATE INDEX "app_oauth_codes_code_idx" ON "app_oauth_codes"("code");

-- CreateIndex
CREATE INDEX "app_deployments_appId_environment_idx" ON "app_deployments"("appId", "environment");

-- CreateIndex
CREATE INDEX "app_test_runs_appId_createdAt_idx" ON "app_test_runs"("appId", "createdAt");

-- AddForeignKey
ALTER TABLE "app_installations" ADD CONSTRAINT "app_installations_appId_fkey" FOREIGN KEY ("appId") REFERENCES "developer_apps"("appId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_audit_events" ADD CONSTRAINT "app_audit_events_appId_fkey" FOREIGN KEY ("appId") REFERENCES "developer_apps"("appId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_oauth_tokens" ADD CONSTRAINT "app_oauth_tokens_appId_fkey" FOREIGN KEY ("appId") REFERENCES "developer_apps"("appId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_deployments" ADD CONSTRAINT "app_deployments_appId_fkey" FOREIGN KEY ("appId") REFERENCES "developer_apps"("appId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_test_runs" ADD CONSTRAINT "app_test_runs_appId_fkey" FOREIGN KEY ("appId") REFERENCES "developer_apps"("appId") ON DELETE CASCADE ON UPDATE CASCADE;

