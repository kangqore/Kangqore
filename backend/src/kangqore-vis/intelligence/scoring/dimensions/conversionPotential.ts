import type { ScoredDimension } from '../types';
import { DIMENSION_WEIGHTS } from '../weights';

/**
 * Stub — the `cro` module (KangqoreVisExperiment) exists but no baseline
 * traffic/conversion telemetry flows into it yet, so there's nothing real
 * to score against. See VIS 3.4 (Outcome Telemetry).
 */
export function scoreConversionPotential(): ScoredDimension {
  return {
    status: 'UNAVAILABLE',
    weight: DIMENSION_WEIGHTS.conversionPotential,
    detail: 'NOT_AVAILABLE — CRO experiment infrastructure exists but no conversion telemetry feeds it yet (see VIS 3.4).',
  };
}
