-- Rewrite "AEGIS" inside logged LLM prompts/responses -> "HANUMANAS".
-- ~67k rows / ~75 MB of text (the "You are AEGIS, Kangqore's governance AI…"
-- agent system prompts + completions). Keeps the telemetry consistent with the
-- rename and with waanda_training_examples (Gen2 fine-tune source).
--
-- Fidelity note: the prompt bytes now differ from what was literally sent at the
-- time. Deliberate — the identity, not a verbatim wire capture, is what matters
-- for this log. Not reversible.

UPDATE "llm_call_logs"
   SET prompt = replace(replace(replace(prompt, 'AEGIS','HANUMANAS'), 'Aegis','Hanumanas'), 'aegis','hanumanas')
 WHERE prompt ILIKE '%aegis%';

UPDATE "llm_call_logs"
   SET response = replace(replace(replace(response, 'AEGIS','HANUMANAS'), 'Aegis','Hanumanas'), 'aegis','hanumanas')
 WHERE response ILIKE '%aegis%';
