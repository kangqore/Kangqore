-- CreateTable
CREATE TABLE "object_comments" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "parentId" TEXT,
    "body" TEXT NOT NULL,
    "authorType" TEXT NOT NULL DEFAULT 'HUMAN',
    "authorId" TEXT,
    "sourceModule" TEXT,
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "object_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_mentions" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'USER',
    "userId" TEXT,
    "role" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_reactions" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_fields" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "typeName" TEXT NOT NULL,
    "compute" TEXT NOT NULL DEFAULT 'DERIVED',
    "kind" TEXT NOT NULL,
    "inputs" JSONB NOT NULL DEFAULT '[]',
    "relatedTypes" JSONB NOT NULL DEFAULT '[]',
    "instruction" TEXT,
    "options" JSONB NOT NULL DEFAULT '[]',
    "outputField" TEXT NOT NULL,
    "refresh" TEXT NOT NULL DEFAULT 'MANUAL',
    "governanceTier" INTEGER NOT NULL DEFAULT 1,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intelligence_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_field_runs" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OK',
    "value" JSONB,
    "confidence" DOUBLE PRECISION,
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "reasoning" TEXT,
    "model" TEXT,
    "error" TEXT,
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intelligence_field_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingestion_documents" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "text" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "linkedObjectId" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingestion_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingestion_candidates" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "properties" JSONB NOT NULL DEFAULT '{}',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sourceText" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PROPOSED',
    "promotedObjectId" TEXT,
    "decidedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingestion_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "object_comments_objectId_createdAt_idx" ON "object_comments"("objectId", "createdAt");

-- CreateIndex
CREATE INDEX "object_comments_parentId_idx" ON "object_comments"("parentId");

-- CreateIndex
CREATE INDEX "comment_mentions_commentId_idx" ON "comment_mentions"("commentId");

-- CreateIndex
CREATE INDEX "comment_mentions_userId_acknowledgedAt_idx" ON "comment_mentions"("userId", "acknowledgedAt");

-- CreateIndex
CREATE INDEX "comment_reactions_commentId_idx" ON "comment_reactions"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_reactions_commentId_actorId_reaction_key" ON "comment_reactions"("commentId", "actorId", "reaction");

-- CreateIndex
CREATE UNIQUE INDEX "intelligence_fields_key_key" ON "intelligence_fields"("key");

-- CreateIndex
CREATE INDEX "intelligence_fields_typeName_enabled_idx" ON "intelligence_fields"("typeName", "enabled");

-- CreateIndex
CREATE INDEX "intelligence_field_runs_fieldId_createdAt_idx" ON "intelligence_field_runs"("fieldId", "createdAt");

-- CreateIndex
CREATE INDEX "intelligence_field_runs_objectId_idx" ON "intelligence_field_runs"("objectId");

-- CreateIndex
CREATE INDEX "ingestion_documents_status_createdAt_idx" ON "ingestion_documents"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ingestion_documents_linkedObjectId_idx" ON "ingestion_documents"("linkedObjectId");

-- CreateIndex
CREATE INDEX "ingestion_candidates_documentId_status_idx" ON "ingestion_candidates"("documentId", "status");

-- AddForeignKey
ALTER TABLE "object_comments" ADD CONSTRAINT "object_comments_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ontology_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_comments" ADD CONSTRAINT "object_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "object_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_mentions" ADD CONSTRAINT "comment_mentions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "object_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "object_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intelligence_field_runs" ADD CONSTRAINT "intelligence_field_runs_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "intelligence_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingestion_candidates" ADD CONSTRAINT "ingestion_candidates_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ingestion_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Re-assert the jsonb GIN index; `migrate diff` cannot see raw-SQL indexes and
-- proposes dropping it on every run.
CREATE INDEX IF NOT EXISTS "ontology_objects_props_gin_idx"
  ON "ontology_objects" USING GIN ("properties" jsonb_path_ops);
