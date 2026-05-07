-- Apply immutability constraints to existing accountability_events table
-- This is a safe operation that adds protections without modifying data

-- Create trigger function first
CREATE OR REPLACE FUNCTION prevent_accountability_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Accountability events are immutable. Update/delete operations are forbidden for audit trail integrity.';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS block_accountability_updates ON "accountability_events";
CREATE TRIGGER block_accountability_updates
    BEFORE UPDATE OR DELETE ON "accountability_events"
    FOR EACH ROW
    EXECUTE FUNCTION prevent_accountability_modification();

-- Add documentation comment
COMMENT ON TABLE "accountability_events" IS 
'IMMUTABLE AUDIT TABLE: Append-only ledger for MNC governance. Updates/deletes blocked by trigger.';
