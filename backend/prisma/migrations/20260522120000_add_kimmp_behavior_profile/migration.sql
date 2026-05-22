-- CreateTable
CREATE TABLE "kimmp_behavior_profiles" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT,
    "leadId" TEXT,
    "sessionId" TEXT,
    "analyzedRole" TEXT NOT NULL DEFAULT 'USER',
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "totalChars" INTEGER NOT NULL DEFAULT 0,
    "states" JSONB NOT NULL,
    "communicationStyle" TEXT NOT NULL,
    "traits" JSONB NOT NULL,
    "recommendedResponseMode" TEXT NOT NULL,
    "emotionalSummary" TEXT NOT NULL,
    "tier1Confidence" DOUBLE PRECISION NOT NULL,
    "tier2Used" BOOLEAN NOT NULL DEFAULT false,
    "guardrailFlags" JSONB,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kimmp_behavior_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kimmp_behavior_profiles_conversationId_idx" ON "kimmp_behavior_profiles"("conversationId");

-- CreateIndex
CREATE INDEX "kimmp_behavior_profiles_leadId_idx" ON "kimmp_behavior_profiles"("leadId");

-- CreateIndex
CREATE INDEX "kimmp_behavior_profiles_sessionId_idx" ON "kimmp_behavior_profiles"("sessionId");

-- CreateIndex
CREATE INDEX "kimmp_behavior_profiles_createdAt_idx" ON "kimmp_behavior_profiles"("createdAt");
