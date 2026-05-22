-- CreateTable
CREATE TABLE "kimmp_signals" (
    "id" TEXT NOT NULL,
    "sourceModule" TEXT NOT NULL,
    "signalType" TEXT NOT NULL,
    "signalCategory" TEXT NOT NULL,
    "signalValue" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "severity" TEXT NOT NULL DEFAULT 'LOW',
    "conversationId" TEXT,
    "leadId" TEXT,
    "sessionId" TEXT,
    "metadata" JSONB,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kimmp_signals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kimmp_signals_sourceModule_idx" ON "kimmp_signals"("sourceModule");

-- CreateIndex
CREATE INDEX "kimmp_signals_signalCategory_idx" ON "kimmp_signals"("signalCategory");

-- CreateIndex
CREATE INDEX "kimmp_signals_status_idx" ON "kimmp_signals"("status");

-- CreateIndex
CREATE INDEX "kimmp_signals_createdAt_idx" ON "kimmp_signals"("createdAt");
