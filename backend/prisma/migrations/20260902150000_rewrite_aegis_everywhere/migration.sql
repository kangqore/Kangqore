-- Blanket rewrite: "aegis" -> "hanumanas" (all three casings) across EVERY
-- text / varchar / jsonb / json / text[] column in the public schema.
--
-- EXCLUDED: qef_certificates (sha256 tamper-evidence), _prisma_migrations.
-- One implicit transaction — any failure rolls the whole thing back. Not reversible.

DO $$
DECLARE
  r RECORD;
  n BIGINT;
  grand BIGINT := 0;
BEGIN
  FOR r IN
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name NOT LIKE 'qef_cert%'
      AND table_name <> '_prisma_migrations'
      AND data_type IN ('text','character varying','jsonb','json','ARRAY')
  LOOP
    BEGIN
      IF r.data_type = 'ARRAY' THEN
        EXECUTE format(
          'UPDATE %I SET %I = (SELECT array_agg(replace(replace(replace(x,''AEGIS'',''HANUMANAS''),''Aegis'',''Hanumanas''),''aegis'',''hanumanas'')) FROM unnest(%I) AS x) '
          || 'WHERE array_to_string(%I, chr(1)) ILIKE ''%%aegis%%''',
          r.table_name, r.column_name, r.column_name, r.column_name);
      ELSIF r.data_type IN ('jsonb','json') THEN
        EXECUTE format(
          'UPDATE %I SET %I = replace(replace(replace(%I::text,''AEGIS'',''HANUMANAS''),''Aegis'',''Hanumanas''),''aegis'',''hanumanas'')::%s '
          || 'WHERE %I::text ILIKE ''%%aegis%%''',
          r.table_name, r.column_name, r.column_name, r.data_type, r.column_name);
      ELSE
        EXECUTE format(
          'UPDATE %I SET %I = replace(replace(replace(%I,''AEGIS'',''HANUMANAS''),''Aegis'',''Hanumanas''),''aegis'',''hanumanas'') '
          || 'WHERE %I ILIKE ''%%aegis%%''',
          r.table_name, r.column_name, r.column_name, r.column_name);
      END IF;

      GET DIAGNOSTICS n = ROW_COUNT;
      IF n > 0 THEN
        RAISE NOTICE '  % . %  ->  % rows', r.table_name, r.column_name, n;
        grand := grand + n;
      END IF;
    EXCEPTION WHEN others THEN
      -- non-text array (int[], enum[], …) — nothing to rewrite
      RAISE NOTICE '  skip % . % (%)', r.table_name, r.column_name, SQLERRM;
    END;
  END LOOP;

  RAISE NOTICE '--- rewrote % row-columns total ---', grand;
END $$;
