
-- Fix mutable search_path on prevent_accountability_modification trigger function
CREATE OR REPLACE FUNCTION public.prevent_accountability_modification()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    RAISE EXCEPTION 'Accountability events are immutable. Update/delete operations are forbidden for audit trail integrity.';
    RETURN NULL;
END;
$function$;

-- Revoke SELECT from anon and authenticated on all public tables
-- (fixes pg_graphql_anon_table_exposed lint 0026 and 0027)
-- This app uses its own JWT auth via Express; Supabase client roles have no business accessing tables directly.
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM authenticated;
