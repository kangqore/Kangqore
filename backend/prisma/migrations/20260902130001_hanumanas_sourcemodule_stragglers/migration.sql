-- Catch kimmp_signals.sourceModule values the previous migration's exact
-- 'AEGIS' match missed (lowercase 'aegis', and any rows written between the
-- two migrations). Identity field — normalise to 'HANUMANAS'.
UPDATE "kimmp_signals" SET "sourceModule" = 'HANUMANAS' WHERE "sourceModule" ILIKE 'aegis';

-- Reverse: (not restorable — original case is lost; all were the AEGIS module)
