-- Rewrite "AEGIS" in historical free-text / descriptive content -> "HANUMANAS".
-- (The structured identity fields were done in 20260902130000. This is the prose:
-- agent-run summaries/findings/actions, action params, signal descriptions,
-- Gen2 training examples.) Verified: 'aegis' never appears as a JSON key, so the
-- ::text replace only touches string values.
--
-- Still EXCLUDED: qef_certificates (sha256 tamper-evidence).

-- ── hanumanas_agent_runs ────────────────────────────────────────────────────
UPDATE "hanumanas_agent_runs"
   SET summary = replace(replace(replace(summary, 'AEGIS','HANUMANAS'), 'Aegis','Hanumanas'), 'aegis','hanumanas')
 WHERE summary ILIKE '%aegis%';

UPDATE "hanumanas_agent_runs"
   SET findings = (SELECT array_agg(replace(replace(replace(x,'AEGIS','HANUMANAS'),'Aegis','Hanumanas'),'aegis','hanumanas')) FROM unnest(findings) AS x)
 WHERE array_to_string(findings, '|') ILIKE '%aegis%';

UPDATE "hanumanas_agent_runs"
   SET actions = (SELECT array_agg(replace(replace(replace(x,'AEGIS','HANUMANAS'),'Aegis','Hanumanas'),'aegis','hanumanas')) FROM unnest(actions) AS x)
 WHERE array_to_string(actions, '|') ILIKE '%aegis%';

-- ── hanumanas_action_logs.params (jsonb — string values only) ───────────────
UPDATE "hanumanas_action_logs"
   SET params = replace(replace(replace(params::text, 'AEGIS','HANUMANAS'), 'Aegis','Hanumanas'), 'aegis','hanumanas')::jsonb
 WHERE params::text ILIKE '%aegis%';

-- ── kimmp_signals ──────────────────────────────────────────────────────────
UPDATE "kimmp_signals"
   SET "signalValue" = replace(replace(replace("signalValue", 'AEGIS','HANUMANAS'), 'Aegis','Hanumanas'), 'aegis','hanumanas')
 WHERE "signalValue" ILIKE '%aegis%';

UPDATE "kimmp_signals"
   SET metadata = replace(replace(replace(metadata::text, 'AEGIS','HANUMANAS'), 'Aegis','Hanumanas'), 'aegis','hanumanas')::jsonb
 WHERE metadata::text ILIKE '%aegis%';

-- ── hanumanas_audit_logs.metadata ──────────────────────────────────────────
UPDATE "hanumanas_audit_logs"
   SET metadata = replace(replace(replace(metadata::text, 'AEGIS','HANUMANAS'), 'Aegis','Hanumanas'), 'aegis','hanumanas')::jsonb
 WHERE metadata::text ILIKE '%aegis%';

-- ── waanda_training_examples (Gen2 fine-tune data — text) ───────────────────
UPDATE "waanda_training_examples"
   SET "userPrompt" = replace(replace(replace("userPrompt", 'AEGIS','HANUMANAS'), 'Aegis','Hanumanas'), 'aegis','hanumanas')
 WHERE "userPrompt" ILIKE '%aegis%';

UPDATE "waanda_training_examples"
   SET completion = replace(replace(replace(completion, 'AEGIS','HANUMANAS'), 'Aegis','Hanumanas'), 'aegis','hanumanas')
 WHERE completion ILIKE '%aegis%';

-- Reverse: not restorable (original casing/wording is lost).
