CREATE TABLE "kimmp_goal" (
  "id"          TEXT    NOT NULL,
  "objective"   TEXT    NOT NULL,
  "deadline"    TIMESTAMP(3),
  "owner"       TEXT,
  "status"      TEXT    NOT NULL DEFAULT 'PENDING_APPROVAL',
  "strategy"    TEXT    NOT NULL,
  "progressPct" INTEGER NOT NULL DEFAULT 0,
  "approvedAt"  TIMESTAMP(3),
  "approvedBy"  TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_goal_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "kimmp_goal_status_idx" ON "kimmp_goal"("status");

CREATE TABLE "kimmp_goal_task" (
  "id"           TEXT    NOT NULL,
  "goalId"       TEXT    NOT NULL,
  "step"         INTEGER NOT NULL,
  "title"        TEXT    NOT NULL,
  "description"  TEXT    NOT NULL,
  "actionType"   TEXT,
  "actionParams" JSONB,
  "agentHint"    TEXT,
  "status"       TEXT    NOT NULL DEFAULT 'PENDING',
  "dueDate"      TIMESTAMP(3),
  "completedAt"  TIMESTAMP(3),
  "result"       TEXT,
  CONSTRAINT "kimmp_goal_task_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "kimmp_goal_task_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "kimmp_goal"("id") ON DELETE CASCADE
);
CREATE INDEX "kimmp_goal_task_goalId_idx" ON "kimmp_goal_task"("goalId");

CREATE TABLE "kimmp_leverage_log" (
  "id"             TEXT    NOT NULL,
  "goalId"         TEXT,
  "weekStarting"   TIMESTAMP(3) NOT NULL,
  "hoursRemoved"   DOUBLE PRECISION NOT NULL DEFAULT 0,
  "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
  "description"    TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_leverage_log_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "kimmp_leverage_log_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "kimmp_goal"("id") ON DELETE SET NULL
);
CREATE INDEX "kimmp_leverage_log_weekStarting_idx" ON "kimmp_leverage_log"("weekStarting");
