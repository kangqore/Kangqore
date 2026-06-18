-- KIMMP Agent registry
CREATE TABLE "kimmp_agent" (
  "id"           TEXT    NOT NULL,
  "name"         TEXT    NOT NULL,
  "role"         TEXT    NOT NULL,
  "description"  TEXT,
  "maxLevel"     INTEGER NOT NULL DEFAULT 1,
  "status"       TEXT    NOT NULL DEFAULT 'ACTIVE',
  "tools"        TEXT[]  NOT NULL DEFAULT '{}',
  "model"        TEXT    NOT NULL DEFAULT 'claude-sonnet-4-6',
  "systemPrompt" TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_agent_pkey" PRIMARY KEY ("id")
);

-- KIMMP Agent activity log
CREATE TABLE "kimmp_agent_log" (
  "id"         TEXT    NOT NULL,
  "agentId"    TEXT    NOT NULL,
  "action"     TEXT    NOT NULL,
  "input"      JSONB,
  "output"     JSONB,
  "level"      INTEGER NOT NULL,
  "status"     TEXT    NOT NULL DEFAULT 'COMPLETED',
  "durationMs" INTEGER,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_agent_log_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "kimmp_agent_log" ADD CONSTRAINT "kimmp_agent_log_agentId_fkey"
  FOREIGN KEY ("agentId") REFERENCES "kimmp_agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- KIMMP Tool registry
CREATE TABLE "kimmp_tool" (
  "id"           TEXT    NOT NULL,
  "name"         TEXT    NOT NULL,
  "description"  TEXT    NOT NULL,
  "category"     TEXT    NOT NULL,
  "defaultLevel" INTEGER NOT NULL DEFAULT 3,
  "isActive"     BOOLEAN NOT NULL DEFAULT true,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kimmp_tool_pkey"  PRIMARY KEY ("id"),
  CONSTRAINT "kimmp_tool_name_key" UNIQUE ("name")
);

-- Seed initial tool registry
INSERT INTO "kimmp_tool" ("id","name","description","category","defaultLevel") VALUES
  (gen_random_uuid(),'QUERY_LEADS',      'Search and retrieve lead data from eQORE',        'DATA',         0),
  (gen_random_uuid(),'QUERY_PROJECTS',   'Search and retrieve project data',                 'DATA',         0),
  (gen_random_uuid(),'QUERY_CLIENTS',    'Search and retrieve client data',                  'DATA',         0),
  (gen_random_uuid(),'EMIT_SIGNAL',      'Emit a KIMMP intelligence signal to the ledger',  'WRITE',        2),
  (gen_random_uuid(),'SCHEDULE_TASK',    'Schedule a follow-up task or reminder',            'AUTOMATION',   3),
  (gen_random_uuid(),'SEND_NOTIFICATION','Send an internal system notification',             'COMMUNICATION',3),
  (gen_random_uuid(),'CREATE_LEAD',      'Create a new lead record in eQORE',               'WRITE',        3),
  (gen_random_uuid(),'UPDATE_LEAD_STATUS','Update a lead status in eQORE',                  'WRITE',        3),
  (gen_random_uuid(),'DELETE_RECORD',    'Permanently delete a record — irreversible',       'WRITE',        3),
  (gen_random_uuid(),'SEND_EMAIL',       'Send an email via the Kangqore email system',      'COMMUNICATION',3),
  (gen_random_uuid(),'EXTERNAL_API_CALL','Call an external API or webhook',                  'AUTOMATION',   3);

-- KIMMP Approval request queue (replaces in-memory pendingStore)
CREATE TABLE "kimmp_approval_request" (
  "id"          TEXT    NOT NULL,
  "agentId"     TEXT,
  "tool"        TEXT    NOT NULL,
  "action"      TEXT    NOT NULL,
  "description" TEXT    NOT NULL,
  "input"       JSONB,
  "level"       INTEGER NOT NULL DEFAULT 3,
  "status"      TEXT    NOT NULL DEFAULT 'PENDING',
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt"  TIMESTAMP(3),
  "reviewedBy"  TEXT,
  "expiresAt"   TIMESTAMP(3) NOT NULL,
  CONSTRAINT "kimmp_approval_request_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "kimmp_approval_request" ADD CONSTRAINT "kimmp_approval_request_agentId_fkey"
  FOREIGN KEY ("agentId") REFERENCES "kimmp_agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "kimmp_approval_request_status_idx" ON "kimmp_approval_request"("status");
