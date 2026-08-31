-- CreateTable
CREATE TABLE "dashboards" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "workspace" TEXT,
    "columns" INTEGER NOT NULL DEFAULT 12,
    "ownerId" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_panels" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL DEFAULT 'WHAT',
    "source" TEXT NOT NULL,
    "params" JSONB NOT NULL DEFAULT '{}',
    "render" TEXT NOT NULL DEFAULT 'stat',
    "span" INTEGER NOT NULL DEFAULT 3,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dashboard_panels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashboards_key_key" ON "dashboards"("key");

-- CreateIndex
CREATE INDEX "dashboards_workspace_idx" ON "dashboards"("workspace");

-- CreateIndex
CREATE INDEX "dashboard_panels_dashboardId_order_idx" ON "dashboard_panels"("dashboardId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_panels_dashboardId_key_key" ON "dashboard_panels"("dashboardId", "key");

-- AddForeignKey
ALTER TABLE "dashboard_panels" ADD CONSTRAINT "dashboard_panels_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "dashboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Re-assert the jsonb GIN index; `migrate diff` cannot see raw-SQL indexes.
CREATE INDEX IF NOT EXISTS "ontology_objects_props_gin_idx"
  ON "ontology_objects" USING GIN ("properties" jsonb_path_ops);
