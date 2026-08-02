-- AlterTable
ALTER TABLE "programmatic_api_keys" ADD COLUMN     "scopedActions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "scopedObjectTypes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "ontology_sdk_versions" (
    "id" TEXT NOT NULL,
    "schemaHash" TEXT NOT NULL,
    "typesCount" INTEGER NOT NULL,
    "actionsCount" INTEGER NOT NULL,
    "objectSetsCount" INTEGER NOT NULL,
    "diffFromPrevious" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ontology_sdk_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ontology_subscriptions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "objectTypeId" TEXT,
    "eventTypes" TEXT[] DEFAULT ARRAY['object.created', 'object.updated']::TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastTriggeredAt" TIMESTAMP(3),
    "lastStatus" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ontology_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ontology_sdk_versions_createdAt_idx" ON "ontology_sdk_versions"("createdAt");

-- CreateIndex
CREATE INDEX "ontology_subscriptions_objectTypeId_idx" ON "ontology_subscriptions"("objectTypeId");

-- CreateIndex
CREATE INDEX "ontology_subscriptions_enabled_idx" ON "ontology_subscriptions"("enabled");

-- AddForeignKey
ALTER TABLE "ontology_subscriptions" ADD CONSTRAINT "ontology_subscriptions_objectTypeId_fkey" FOREIGN KEY ("objectTypeId") REFERENCES "ontology_object_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

