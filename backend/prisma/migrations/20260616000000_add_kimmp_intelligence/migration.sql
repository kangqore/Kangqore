-- KIMMP Memory: long-term learned knowledge about user preferences and org facts
CREATE TABLE "kimmp_memory" (
  "id" TEXT NOT NULL,
  "memoryType" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  "source" TEXT NOT NULL DEFAULT 'inference',
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_memory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "kimmp_memory_key_memoryType_key" ON "kimmp_memory"("key", "memoryType");
CREATE INDEX "kimmp_memory_memoryType_idx" ON "kimmp_memory"("memoryType");

-- KIMMP Interaction log: every query+response pair, with operator feedback
CREATE TABLE "kimmp_interaction" (
  "id" TEXT NOT NULL,
  "query" TEXT NOT NULL,
  "response" TEXT NOT NULL,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "model" TEXT NOT NULL DEFAULT 'unknown',
  "navigate" TEXT,
  "feedback" TEXT,
  "correction" TEXT,
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_interaction_pkey" PRIMARY KEY ("id")
);

-- KIMMP Workflow: automation definitions
CREATE TABLE "kimmp_workflow" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "trigger" TEXT NOT NULL DEFAULT 'manual',
  "steps" JSONB NOT NULL DEFAULT '[]',
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "lastRunAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_workflow_pkey" PRIMARY KEY ("id")
);

-- KIMMP Task: individual step executions within workflows
CREATE TABLE "kimmp_task" (
  "id" TEXT NOT NULL,
  "workflowId" TEXT,
  "step" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "input" JSONB,
  "output" JSONB,
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "kimmp_task_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "kimmp_task" ADD CONSTRAINT "kimmp_task_workflowId_fkey"
  FOREIGN KEY ("workflowId") REFERENCES "kimmp_workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;
