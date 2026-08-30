-- CreateTable
CREATE TABLE "boards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "workspace" TEXT,
    "rootTypeName" TEXT,
    "objectSetId" TEXT,
    "query" JSONB NOT NULL DEFAULT '{}',
    "sort" JSONB NOT NULL DEFAULT '[]',
    "defaultView" TEXT NOT NULL DEFAULT 'table',
    "groupByField" TEXT,
    "statusField" TEXT DEFAULT 'status',
    "ownerId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "templateKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_columns" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "type" TEXT,
    "columnClass" TEXT,
    "editable" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "colorMap" JSONB NOT NULL DEFAULT '{}',
    "width" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "board_columns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_groups" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "collapsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "board_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_item_positions" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "groupKey" TEXT NOT NULL,
    "position" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "board_item_positions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "boards_templateKey_key" ON "boards"("templateKey");

-- CreateIndex
CREATE INDEX "boards_rootTypeName_idx" ON "boards"("rootTypeName");

-- CreateIndex
CREATE INDEX "boards_ownerId_idx" ON "boards"("ownerId");

-- CreateIndex
CREATE INDEX "boards_isTemplate_idx" ON "boards"("isTemplate");

-- CreateIndex
CREATE INDEX "board_columns_boardId_order_idx" ON "board_columns"("boardId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "board_columns_boardId_key_key" ON "board_columns"("boardId", "key");

-- CreateIndex
CREATE INDEX "board_groups_boardId_order_idx" ON "board_groups"("boardId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "board_groups_boardId_key_key" ON "board_groups"("boardId", "key");

-- CreateIndex
CREATE INDEX "board_item_positions_boardId_groupKey_position_idx" ON "board_item_positions"("boardId", "groupKey", "position");

-- CreateIndex
CREATE UNIQUE INDEX "board_item_positions_boardId_objectId_key" ON "board_item_positions"("boardId", "objectId");

-- AddForeignKey
ALTER TABLE "board_columns" ADD CONSTRAINT "board_columns_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_groups" ADD CONSTRAINT "board_groups_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_item_positions" ADD CONSTRAINT "board_item_positions_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Re-assert the raw-SQL GIN index; migrate diff cannot see it and emits a DROP.
CREATE INDEX IF NOT EXISTS "ontology_objects_props_gin_idx"
  ON "ontology_objects" USING GIN ("properties" jsonb_path_ops);
