-- CreateTable
CREATE TABLE "object_sets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rootTypeId" TEXT,
    "query" JSONB NOT NULL DEFAULT '{}',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "lastRunAt" TIMESTAMP(3),
    "lastCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "object_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_set_memberships" (
    "id" TEXT NOT NULL,
    "objectSetId" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "object_set_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "object_sets_rootTypeId_idx" ON "object_sets"("rootTypeId");

-- CreateIndex
CREATE INDEX "object_sets_isSystem_idx" ON "object_sets"("isSystem");

-- CreateIndex
CREATE UNIQUE INDEX "object_sets_name_createdBy_key" ON "object_sets"("name", "createdBy");

-- CreateIndex
CREATE INDEX "object_set_memberships_objectSetId_idx" ON "object_set_memberships"("objectSetId");

-- CreateIndex
CREATE INDEX "object_set_memberships_objectId_idx" ON "object_set_memberships"("objectId");

-- CreateIndex
CREATE UNIQUE INDEX "object_set_memberships_objectSetId_objectId_key" ON "object_set_memberships"("objectSetId", "objectId");

-- AddForeignKey
ALTER TABLE "object_sets" ADD CONSTRAINT "object_sets_rootTypeId_fkey" FOREIGN KEY ("rootTypeId") REFERENCES "ontology_object_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_set_memberships" ADD CONSTRAINT "object_set_memberships_objectSetId_fkey" FOREIGN KEY ("objectSetId") REFERENCES "object_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_set_memberships" ADD CONSTRAINT "object_set_memberships_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ontology_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

