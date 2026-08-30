-- CreateTable
CREATE TABLE "work_templates" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "rootTypeName" TEXT NOT NULL,
    "nodes" JSONB NOT NULL DEFAULT '[]',
    "edges" JSONB NOT NULL DEFAULT '[]',
    "board" JSONB,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_template_runs" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "createdObjects" JSONB NOT NULL DEFAULT '{}',
    "createdEdges" INTEGER NOT NULL DEFAULT 0,
    "rootObjectId" TEXT,
    "boardId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "notes" JSONB NOT NULL DEFAULT '[]',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_template_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "work_templates_key_key" ON "work_templates"("key");

-- CreateIndex
CREATE INDEX "work_templates_category_idx" ON "work_templates"("category");

-- CreateIndex
CREATE INDEX "work_template_runs_templateId_createdAt_idx" ON "work_template_runs"("templateId", "createdAt");

-- CreateIndex
CREATE INDEX "work_template_runs_rootObjectId_idx" ON "work_template_runs"("rootObjectId");

-- AddForeignKey
ALTER TABLE "work_template_runs" ADD CONSTRAINT "work_template_runs_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "work_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Re-assert the jsonb indexes Prisma cannot declare natively. `migrate diff`
-- proposes dropping these on every run because they exist only in raw SQL;
-- every new migration must put them back or ontology property queries fall
-- back to sequential scans.
CREATE INDEX IF NOT EXISTS "ontology_objects_props_gin_idx"
  ON "ontology_objects" USING GIN ("properties" jsonb_path_ops);
