-- Work OS Slice 0 — expression + GIN indexes on ontology_objects.properties
--
-- WorkItem is modelled as an OntologyObject rather than its own table, so board
-- views filter and sort on properties->>'status' / 'dueDate' / 'assigneeId'.
-- Without these, every board render is a sequential scan over the whole table.
--
-- Prisma cannot declare expression or GIN indexes, so this is raw SQL — the same
-- pattern already used for the pgvector index.
--
-- CONCURRENTLY is deliberately NOT used: it cannot run inside the transaction
-- Prisma wraps migrations in. The table is small today (tens of rows); revisit
-- with a manual concurrent build if it grows before this ships to a live tenant.

CREATE INDEX IF NOT EXISTS "ontology_objects_type_status_idx"
  ON "ontology_objects" ("typeId", (("properties"->>'status')));

CREATE INDEX IF NOT EXISTS "ontology_objects_type_assignee_idx"
  ON "ontology_objects" ("typeId", (("properties"->>'assigneeId')));

CREATE INDEX IF NOT EXISTS "ontology_objects_type_due_idx"
  ON "ontology_objects" ("typeId", (("properties"->>'dueDate')));

CREATE INDEX IF NOT EXISTS "ontology_objects_type_priority_idx"
  ON "ontology_objects" ("typeId", (("properties"->>'priority')));

-- Containment / existence queries across arbitrary properties (the ObjectSet
-- query DSL's `eq` and `in` operators compile to these).
CREATE INDEX IF NOT EXISTS "ontology_objects_props_gin_idx"
  ON "ontology_objects" USING GIN ("properties" jsonb_path_ops);
