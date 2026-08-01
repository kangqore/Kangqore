-- CreateTable
CREATE TABLE "ontology_timeseries" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ontology_timeseries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ontology_pipelines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceQuery" JSONB NOT NULL DEFAULT '{}',
    "targetTypeId" TEXT NOT NULL,
    "fieldMapping" JSONB NOT NULL DEFAULT '{}',
    "schedule" TEXT NOT NULL DEFAULT 'ON_CHANGE',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "lastObjectCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ontology_pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ontology_timeseries_objectId_propertyName_timestamp_idx" ON "ontology_timeseries"("objectId", "propertyName", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "ontology_pipelines_name_key" ON "ontology_pipelines"("name");

-- CreateIndex
CREATE INDEX "ontology_pipelines_enabled_idx" ON "ontology_pipelines"("enabled");

-- AddForeignKey
ALTER TABLE "ontology_timeseries" ADD CONSTRAINT "ontology_timeseries_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ontology_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ontology_pipelines" ADD CONSTRAINT "ontology_pipelines_targetTypeId_fkey" FOREIGN KEY ("targetTypeId") REFERENCES "ontology_object_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

