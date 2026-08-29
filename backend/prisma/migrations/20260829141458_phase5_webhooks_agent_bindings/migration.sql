-- CreateTable
CREATE TABLE "app_webhook_deliveries" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "installationId" TEXT,
    "tenantId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "signature" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "responseStatus" INTEGER,
    "responseBody" TEXT,
    "errorMessage" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "app_webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_agent_bindings" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "kimmpAgentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_agent_bindings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "app_webhook_deliveries_appId_createdAt_idx" ON "app_webhook_deliveries"("appId", "createdAt");

-- CreateIndex
CREATE INDEX "app_webhook_deliveries_tenantId_event_idx" ON "app_webhook_deliveries"("tenantId", "event");

-- CreateIndex
CREATE INDEX "app_webhook_deliveries_status_idx" ON "app_webhook_deliveries"("status");

-- CreateIndex
CREATE INDEX "app_agent_bindings_kimmpAgentId_idx" ON "app_agent_bindings"("kimmpAgentId");

-- CreateIndex
CREATE UNIQUE INDEX "app_agent_bindings_appId_agentName_key" ON "app_agent_bindings"("appId", "agentName");

