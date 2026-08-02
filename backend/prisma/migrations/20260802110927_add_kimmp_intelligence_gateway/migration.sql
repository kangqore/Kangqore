-- CreateTable
CREATE TABLE "llm_call_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "actorType" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL DEFAULT 0,
    "completionTokens" INTEGER NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latencyMs" INTEGER NOT NULL DEFAULT 0,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "referencedObjectIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "taskType" TEXT,
    "agentRole" TEXT,
    "sourceModule" TEXT,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "piiDetected" BOOLEAN NOT NULL DEFAULT false,
    "piiPatterns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llm_call_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_budgets" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    "monthlyTokenLimit" INTEGER NOT NULL,
    "alertThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "hardStop" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pii_scan_configs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'AUDIT',
    "enabledPatterns" TEXT[] DEFAULT ARRAY['email', 'phone', 'ni_number', 'ssn', 'nhs_number', 'iban', 'passport']::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pii_scan_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "llm_call_logs_userId_idx" ON "llm_call_logs"("userId");

-- CreateIndex
CREATE INDEX "llm_call_logs_actorType_idx" ON "llm_call_logs"("actorType");

-- CreateIndex
CREATE INDEX "llm_call_logs_createdAt_idx" ON "llm_call_logs"("createdAt");

-- CreateIndex
CREATE INDEX "llm_call_logs_status_idx" ON "llm_call_logs"("status");

-- CreateIndex
CREATE INDEX "token_budgets_userId_idx" ON "token_budgets"("userId");

-- CreateIndex
CREATE INDEX "token_budgets_teamId_idx" ON "token_budgets"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "pii_scan_configs_name_key" ON "pii_scan_configs"("name");

