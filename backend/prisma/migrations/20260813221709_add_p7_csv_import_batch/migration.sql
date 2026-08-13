-- Overshadow Roadmap P7.2 — Migration Accelerator
-- One-shot CSV → Ontology import batches (provenance for a "coexist first"
-- ServiceNow CMDB import, distinct from OntologyPipeline's recurring runs).

-- CreateTable
CREATE TABLE "ontology_csv_import_batches" (
    "id" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "objectSetId" TEXT,
    "sourceLabel" TEXT NOT NULL DEFAULT 'CSV Import',
    "fileName" TEXT,
    "rowCount" INTEGER NOT NULL DEFAULT 0,
    "createdCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB NOT NULL DEFAULT '[]',
    "importedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ontology_csv_import_batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ontology_csv_import_batches_typeId_idx" ON "ontology_csv_import_batches"("typeId");

-- AddForeignKey
ALTER TABLE "ontology_csv_import_batches" ADD CONSTRAINT "ontology_csv_import_batches_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ontology_object_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ontology_csv_import_batches" ADD CONSTRAINT "ontology_csv_import_batches_objectSetId_fkey" FOREIGN KEY ("objectSetId") REFERENCES "object_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
