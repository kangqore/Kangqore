// Weights for the 6 additively-scored dimensions, summing to 1.0 once every
// dimension has a real data source. Today only EVIDENCE + CONFIDENCE +
// VISIBILITY_POTENTIAL are AVAILABLE (weight 0.65 of 1.0) — the engine
// renormalizes over whichever dimensions are actually scored, and reports
// that 0.65 as `certainty`. EFFORT is not in this sum — per the scoring
// architecture it's a final multiplier applied after the weighted average
// (see OpportunityScoringEngine).
export const DIMENSION_WEIGHTS = {
  evidence: 0.25,
  confidence: 0.15,
  visibilityPotential: 0.25,
  strategicAlignment: 0.2,
  businessValue: 0.1,
  conversionPotential: 0.05,
} as const;

export const TOTAL_WEIGHT = Object.values(DIMENSION_WEIGHTS).reduce((a, b) => a + b, 0);

export const EFFORT_MULTIPLIERS = {
  LOW: 1.15,
  MEDIUM: 1.0,
  HIGH: 0.85,
  UNAVAILABLE: 1.0,
} as const;
