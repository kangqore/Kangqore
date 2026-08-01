-- AlterTable
ALTER TABLE "ontology_objects" ADD COLUMN     "validTo" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "ontology_objects_validTo_idx" ON "ontology_objects"("validTo");

