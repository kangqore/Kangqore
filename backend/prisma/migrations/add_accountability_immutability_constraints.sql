-- Migration: Add database-level immutability constraints to accountability_events
-- Purpose: Enforce append-only pattern at the database layer for MNC-grade audit trails

-- Step 1: Remove UPDATE and DELETE privileges (PostgreSQL/Supabase)
-- This prevents accidental modifications even if application code is compromised

REVOKE UPDATE, DELETE ON "AccountabilityEvent" FROM PUBLIC;
REVOKE UPDATE, DELETE ON "AccountabilityEvent" FROM authenticated;

-- Step 2: Create trigger to prevent updates (defense in depth)
-- Even if privileges are accidentally granted, this trigger blocks modifications

CREATE OR REPLACE FUNCTION prevent_accountability_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Accountability events are immutable. Update/delete operations are forbidden for audit trail integrity.';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER block_accountability_updates
    BEFORE UPDATE OR DELETE ON "AccountabilityEvent"
    FOR EACH ROW
    EXECUTE FUNCTION prevent_accountability_modification();

-- Step 3: Add comment for documentation
COMMENT ON TABLE "AccountabilityEvent" IS 
'IMMUTABLE AUDIT TABLE: Append-only ledger for MNC governance and legal compliance. 
Updates and deletes are disabled at database level. To correct errors, create compensating events.';

-- Step 4: Ensure automatic timestamp (already in schema, documented here)
-- eventTimestamp has @default(now()) in Prisma schema
-- Indexed: @@index([projectId, eventTimestamp]) for time-ordered queries

-- VERIFICATION QUERIES (run after migration):
-- 1. Check privileges: SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name = 'AccountabilityEvent';
-- 2. Test immutability: UPDATE "AccountabilityEvent" SET "actionTaken" = 'test' WHERE id = 'some-id'; -- Should fail
-- 3. Verify trigger: SELECT trigger_name, event_manipulation FROM information_schema.triggers WHERE event_object_table = 'AccountabilityEvent';
