import type { ScoredDimension } from '../types';
import { DIMENSION_WEIGHTS } from '../weights';

const SEVERITY_SCORE: Record<string, number> = {
  LOW: 25,
  MODERATE: 50,
  HIGH: 75,
  CRITICAL: 100,
};

/** Severity of the correlated pattern is a real, if coarse, proxy for how
 *  material the visibility gap is (more/stronger contributing signals →
 *  Rule 5 already assigns higher severity — see kimmpCorrelation.service.ts). */
export function scoreVisibilityPotential(severity: string): ScoredDimension {
  const score = SEVERITY_SCORE[severity] ?? SEVERITY_SCORE.LOW;

  return {
    status: 'AVAILABLE',
    score,
    weight: DIMENSION_WEIGHTS.visibilityPotential,
    detail: `Derived from correlation severity (${severity}).`,
  };
}
