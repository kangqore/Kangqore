import type { ScoredDimension } from '../types';

/**
 * Stub — no deterministic implementation-effort estimator exists yet (see
 * VIS 3.3: page-exists / hub-exists / entities-exist / schema-supported
 * heuristics). Effort is not part of the additive weighted sum — it's
 * applied as a final multiplier in OpportunityScoringEngine, and an
 * UNAVAILABLE effort applies a neutral ×1.0 (no adjustment), never a
 * fabricated LOW/MEDIUM/HIGH guess.
 */
export function scoreEffort(): ScoredDimension {
  return {
    status: 'UNAVAILABLE',
    weight: 0,
    detail: 'NOT_ESTIMATED — no deterministic effort estimator yet (see VIS 3.3).',
  };
}
