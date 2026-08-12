import type { ScoredDimension } from '../types';
import { DIMENSION_WEIGHTS } from '../weights';

/** Real signal count + distinct contributing capabilities — always available. */
export function scoreEvidence(signals: { sourceModule: string }[]): ScoredDimension {
  const distinctCapabilities = new Set(signals.map((s) => s.sourceModule)).size;
  const evidenceCount = signals.length;
  const score = Math.min(100, distinctCapabilities * 20 + evidenceCount * 5);

  return {
    status: 'AVAILABLE',
    score,
    weight: DIMENSION_WEIGHTS.evidence,
    detail: `${distinctCapabilities} distinct VIS capabilities, ${evidenceCount} contributing signals.`,
  };
}
