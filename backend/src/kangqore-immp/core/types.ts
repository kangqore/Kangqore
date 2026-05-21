// ---------------------------------------------------------------------------
// KIMMP — Kangqore Intelligence Mind Management Processor
// Core shared types for the Human Behavior Intelligence Layer (PR 1).
//
// This layer infers behavioral *states* (and, when there is enough text,
// coarse personality *traits*) from conversation signals — always with
// confidence scores, never as medical or psychological diagnoses.
// ---------------------------------------------------------------------------

export const KIMMP_VERSION = '0.1.0';

/** Behavioral states the Tier-1 deterministic extractor can detect per message. */
export type BehaviorStateType =
  | 'URGENCY'
  | 'FRUSTRATION'
  | 'STRESS'
  | 'CONFUSION'
  | 'SKEPTICISM'
  | 'TRUST_NEED'
  | 'TECHNICAL_DEPTH'
  | 'DECISION_READINESS'
  | 'BUYING_SERIOUSNESS';

export const ALL_BEHAVIOR_STATES: BehaviorStateType[] = [
  'URGENCY',
  'FRUSTRATION',
  'STRESS',
  'CONFUSION',
  'SKEPTICISM',
  'TRUST_NEED',
  'TECHNICAL_DEPTH',
  'DECISION_READINESS',
  'BUYING_SERIOUSNESS',
];

export type Severity = 'LOW' | 'MODERATE' | 'HIGH';

/** How the visitor communicates — a style, not a judgement of the person. */
export type CommunicationStyle =
  | 'DIRECT'
  | 'EXPLORATORY'
  | 'ANXIOUS'
  | 'ANALYTICAL'
  | 'NEUTRAL';

/** The response posture KIMMP recommends to eQORE (advisory only in PR 1). */
export type ResponseMode =
  | 'STANDARD'
  | 'CALM_ASSURANCE_FIRST'
  | 'SIMPLIFY'
  | 'SHOW_PROOF'
  | 'DISCOVERY'
  | 'EXECUTIVE';

/** A single detected behavioral signal with its evidence and confidence. */
export interface BehaviorSignal {
  type: BehaviorStateType;
  /** 0..1 — how strongly the state is present. */
  intensity: number;
  /** 0..1 — how much the layer trusts this reading. */
  confidence: number;
  severity: Severity;
  /** Matched phrases / heuristics that produced the signal. */
  evidence: string[];
  source: 'TIER1' | 'TIER2';
}

/**
 * Big Five (OCEAN) estimate. "Neuroticism" is deliberately surfaced as
 * "emotionalSensitivity" so no human-facing output carries a clinical label.
 */
export interface BigFiveScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  emotionalSensitivity: number;
}

export interface TraitEstimate {
  /** False when there is not enough text to be defensible. */
  available: boolean;
  reason: string;
  confidence: number;
  scores?: BigFiveScores;
}

/** The full behavior reading returned by the analyzer. */
export interface BehaviorProfile {
  analysisId: string;
  version: string;
  createdAt: string;
  input: {
    messageCount: number;
    totalChars: number;
    analyzedRole: string;
  };
  states: BehaviorSignal[];
  communicationStyle: CommunicationStyle;
  traits: TraitEstimate;
  recommendedResponseMode: ResponseMode;
  /** Safe, non-clinical natural-language summary. */
  emotionalSummary: string;
  /** Aggregate confidence of the Tier-1 pass. */
  tier1Confidence: number;
  tier2Used: boolean;
  /** Notes from the harmful-label guardrail (empty when clean). */
  guardrailFlags: string[];
}

export interface ConversationTurn {
  role: string;
  content: string;
}

export interface AnalyzeInput {
  messages: ConversationTurn[];
  /** Optional linkage for stored profiles. */
  conversationId?: string;
  sessionId?: string;
  /** Which role's text to analyze; defaults to USER. */
  analyzedRole?: string;
}
