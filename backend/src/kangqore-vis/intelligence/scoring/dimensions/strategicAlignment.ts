import type { ScoredDimension } from '../types';
import { DIMENSION_WEIGHTS } from '../weights';

/**
 * Stub — VIS 3.2 (Strategic Context / VIS Priority Registry). No priority
 * industries/services/products/pillars are registered anywhere in the
 * codebase yet, so this dimension cannot honestly be scored. Replacing this
 * file's body with a real lookup against that registry is the entire
 * integration surface — nothing else in the scoring engine needs to change.
 */
export function scoreStrategicAlignment(): ScoredDimension {
  return {
    status: 'UNAVAILABLE',
    weight: DIMENSION_WEIGHTS.strategicAlignment,
    detail: 'NOT_CONFIGURED — no VIS Priority Registry yet (see VIS 3.2).',
  };
}
