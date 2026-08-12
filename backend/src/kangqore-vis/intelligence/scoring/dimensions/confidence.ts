import type { ScoredDimension } from '../types';
import { DIMENSION_WEIGHTS } from '../weights';

/**
 * Real, but coarse: averages the correlation pattern's own confidence
 * (0-100) with the mean KimmpSignal.confidence (0-1, scaled to 0-100) of
 * the contributing signals. Known limitation, stated plainly rather than
 * hidden: entity-match "confidence" behind those signals is currently
 * binary (exact substring match in entityThemeMatcher.ts) — this is not a
 * graded semantic-similarity score. Do not read this number as more
 * precise than that.
 */
export function scoreConfidence(patternConfidence: number, signals: { confidence: number }[]): ScoredDimension {
  const avgSignalConfidence = signals.length
    ? (signals.reduce((sum, s) => sum + (s.confidence ?? 0), 0) / signals.length) * 100
    : 0;
  const score = Math.round((patternConfidence + avgSignalConfidence) / 2);

  return {
    status: 'AVAILABLE',
    score,
    weight: DIMENSION_WEIGHTS.confidence,
    detail: `Pattern confidence ${Math.round(patternConfidence)}, mean signal confidence ${Math.round(avgSignalConfidence)} — entity matching is exact-substring, not graded.`,
  };
}
