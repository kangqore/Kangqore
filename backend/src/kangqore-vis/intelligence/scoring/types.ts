// ---------------------------------------------------------------------------
// VIS 3.1 — Opportunity Scoring types
//
// A dimension is AVAILABLE (or CONFIGURED/ESTIMATED once a future data
// source lands) only when it is backed by a real signal. UNAVAILABLE
// dimensions carry no `score` — never a fabricated number. Missing
// dimensions reduce `certainty` in OpportunityScoringEngine; they never
// silently change the priority score by defaulting to a neutral value.
// ---------------------------------------------------------------------------

export type DimensionStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'CONFIGURED' | 'ESTIMATED';

export interface ScoredDimension {
  status: DimensionStatus;
  /** 0-100. Present only when status is AVAILABLE, CONFIGURED, or ESTIMATED. */
  score?: number;
  /** This dimension's share of the total weighted score (see weights.ts). */
  weight: number;
  /** Human-readable explanation of the score, or of why it's unavailable. */
  detail: string;
}

export interface OpportunityDimensions {
  evidence: ScoredDimension;
  confidence: ScoredDimension;
  visibilityPotential: ScoredDimension;
  strategicAlignment: ScoredDimension;
  businessValue: ScoredDimension;
  conversionPotential: ScoredDimension;
  effort: ScoredDimension;
}

export type PriorityTier = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
