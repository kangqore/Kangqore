import type { ScoredDimension } from '../types';
import { DIMENSION_WEIGHTS } from '../weights';

/**
 * Stub — no commercial-value data source exists yet (deal size, ACV by
 * industry, pipeline value). Replacing this file's body once one does is
 * the entire integration surface.
 */
export function scoreBusinessValue(): ScoredDimension {
  return {
    status: 'UNAVAILABLE',
    weight: DIMENSION_WEIGHTS.businessValue,
    detail: 'NOT_AVAILABLE — no commercial-value data source wired in yet.',
  };
}
