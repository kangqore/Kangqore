// ---------------------------------------------------------------------------
// KIMMP — Tier-1 behavior lexicons
//
// Deterministic phrase lexicons that drive the local signal extractor. This is
// the GitSentiment / SentiStrength-style layer: no model, no API call, just
// weighted phrase matching + structural heuristics. Fast (~1ms) and free, so
// it can run on every message.
//
// Weights are relative contribution toward a state's raw score; they are
// normalized later in signalExtractor.service.ts.
// ---------------------------------------------------------------------------

import { BehaviorStateType } from '../core/types';

export interface LexiconEntry {
  /** Lowercased phrase. Single words match on word boundaries. */
  phrase: string;
  weight: number;
}

export interface StateLexicon {
  state: BehaviorStateType;
  /** Raw-score value at which intensity saturates to 1.0. */
  saturation: number;
  entries: LexiconEntry[];
}

export const BEHAVIOR_LEXICONS: StateLexicon[] = [
  {
    state: 'URGENCY',
    saturation: 6,
    entries: [
      { phrase: 'asap', weight: 3 },
      { phrase: 'urgent', weight: 3 },
      { phrase: 'urgently', weight: 3 },
      { phrase: 'immediately', weight: 3 },
      { phrase: 'right away', weight: 3 },
      { phrase: 'right now', weight: 2.5 },
      { phrase: 'emergency', weight: 3.5 },
      { phrase: 'deadline', weight: 2.5 },
      { phrase: 'time-sensitive', weight: 2.5 },
      { phrase: 'as soon as possible', weight: 3 },
      { phrase: "can't wait", weight: 2.5 },
      { phrase: 'cannot wait', weight: 2.5 },
      { phrase: 'today', weight: 1.5 },
      { phrase: 'this week', weight: 1.2 },
      { phrase: 'quickly', weight: 1.5 },
      { phrase: 'fast', weight: 1.3 },
      { phrase: 'soon', weight: 1 },
    ],
  },
  {
    state: 'FRUSTRATION',
    saturation: 6,
    entries: [
      { phrase: 'frustrated', weight: 3 },
      { phrase: 'frustrating', weight: 3 },
      { phrase: 'annoyed', weight: 2.5 },
      { phrase: 'annoying', weight: 2.5 },
      { phrase: 'fed up', weight: 3 },
      { phrase: 'sick of', weight: 3 },
      { phrase: 'tired of', weight: 2.5 },
      { phrase: 'keeps breaking', weight: 3 },
      { phrase: 'keeps failing', weight: 3 },
      { phrase: 'still not working', weight: 3 },
      { phrase: 'not working', weight: 2 },
      { phrase: 'again', weight: 1.2 },
      { phrase: 'broken', weight: 1.8 },
      { phrase: 'nightmare', weight: 2.8 },
      { phrase: 'useless', weight: 2.5 },
      { phrase: 'terrible', weight: 2 },
      { phrase: 'disappointed', weight: 2.2 },
      { phrase: 'unacceptable', weight: 2.8 },
    ],
  },
  {
    state: 'STRESS',
    saturation: 6,
    entries: [
      { phrase: 'stressed', weight: 3 },
      { phrase: 'stressful', weight: 2.8 },
      { phrase: 'overwhelmed', weight: 3 },
      { phrase: 'panic', weight: 3.2 },
      { phrase: 'panicking', weight: 3.2 },
      { phrase: 'worried', weight: 2.2 },
      { phrase: 'anxious', weight: 2.5 },
      { phrase: 'losing money', weight: 3 },
      { phrase: 'losing customers', weight: 3 },
      { phrase: 'down', weight: 1.2 },
      { phrase: 'outage', weight: 2.8 },
      { phrase: 'crisis', weight: 3.2 },
      { phrase: 'falling apart', weight: 3 },
      { phrase: 'pressure', weight: 1.8 },
      { phrase: 'under pressure', weight: 2.5 },
      { phrase: 'team is frustrated', weight: 2.5 },
    ],
  },
  {
    state: 'CONFUSION',
    saturation: 5,
    entries: [
      { phrase: 'confused', weight: 3 },
      { phrase: 'confusing', weight: 2.8 },
      { phrase: "don't understand", weight: 3 },
      { phrase: 'do not understand', weight: 3 },
      { phrase: 'not sure', weight: 2 },
      { phrase: 'unclear', weight: 2.5 },
      { phrase: 'what do you mean', weight: 2.5 },
      { phrase: 'can you explain', weight: 2 },
      { phrase: 'how does that work', weight: 2 },
      { phrase: 'how does this work', weight: 2 },
      { phrase: "i'm lost", weight: 2.8 },
      { phrase: 'no idea', weight: 2.2 },
      { phrase: "what's the difference", weight: 1.8 },
      { phrase: 'simplify', weight: 1.5 },
      { phrase: 'in simple terms', weight: 2 },
    ],
  },
  {
    state: 'SKEPTICISM',
    saturation: 5,
    entries: [
      { phrase: 'prove', weight: 2.8 },
      { phrase: 'proof', weight: 2.5 },
      { phrase: 'evidence', weight: 2.5 },
      { phrase: 'guarantee', weight: 2.5 },
      { phrase: 'guaranteed', weight: 2.5 },
      { phrase: 'doubt', weight: 2.8 },
      { phrase: 'skeptical', weight: 3.2 },
      { phrase: 'sounds too good', weight: 3 },
      { phrase: 'how do i know', weight: 2.8 },
      { phrase: 'how can i trust', weight: 3 },
      { phrase: 'case study', weight: 2 },
      { phrase: 'case studies', weight: 2 },
      { phrase: 'references', weight: 2 },
      { phrase: 'really', weight: 1 },
      { phrase: 'actually work', weight: 2 },
      { phrase: 'not convinced', weight: 3 },
      { phrase: 'is that true', weight: 2.2 },
    ],
  },
  {
    state: 'TRUST_NEED',
    saturation: 5,
    entries: [
      { phrase: 'reliable', weight: 2.2 },
      { phrase: 'reliability', weight: 2.2 },
      { phrase: 'trustworthy', weight: 2.5 },
      { phrase: 'secure', weight: 2 },
      { phrase: 'security', weight: 1.8 },
      { phrase: 'safe', weight: 1.8 },
      { phrase: 'reputation', weight: 2.2 },
      { phrase: 'testimonial', weight: 2 },
      { phrase: 'testimonials', weight: 2 },
      { phrase: 'experience', weight: 1.5 },
      { phrase: 'how long have you', weight: 2.2 },
      { phrase: 'who have you worked with', weight: 2.5 },
      { phrase: 'certified', weight: 1.8 },
      { phrase: 'compliance', weight: 1.8 },
      { phrase: 'confidential', weight: 1.8 },
    ],
  },
  {
    state: 'TECHNICAL_DEPTH',
    saturation: 7,
    entries: [
      { phrase: 'api', weight: 1.8 },
      { phrase: 'database', weight: 1.8 },
      { phrase: 'kubernetes', weight: 2.5 },
      { phrase: 'microservice', weight: 2.5 },
      { phrase: 'microservices', weight: 2.5 },
      { phrase: 'architecture', weight: 2 },
      { phrase: 'latency', weight: 2.2 },
      { phrase: 'throughput', weight: 2.2 },
      { phrase: 'ci/cd', weight: 2.5 },
      { phrase: 'pipeline', weight: 1.8 },
      { phrase: 'deployment', weight: 1.8 },
      { phrase: 'schema', weight: 2 },
      { phrase: 'integration', weight: 1.6 },
      { phrase: 'migration', weight: 1.8 },
      { phrase: 'erp', weight: 1.8 },
      { phrase: 'legacy system', weight: 2 },
      { phrase: 'infrastructure', weight: 1.8 },
      { phrase: 'scalability', weight: 2 },
      { phrase: 'authentication', weight: 1.8 },
      { phrase: 'webhook', weight: 2.2 },
      { phrase: 'load balancer', weight: 2.5 },
    ],
  },
  {
    state: 'DECISION_READINESS',
    saturation: 5,
    entries: [
      { phrase: 'ready to start', weight: 3 },
      { phrase: "let's start", weight: 3 },
      { phrase: "let's begin", weight: 3 },
      { phrase: 'get started', weight: 2.5 },
      { phrase: 'sign up', weight: 2.5 },
      { phrase: 'move forward', weight: 2.8 },
      { phrase: 'proceed', weight: 2.2 },
      { phrase: 'next steps', weight: 2.5 },
      { phrase: 'when can we', weight: 2.2 },
      { phrase: 'how do we begin', weight: 2.5 },
      { phrase: 'book a call', weight: 2.8 },
      { phrase: 'schedule', weight: 2 },
      { phrase: 'kick off', weight: 2.5 },
      { phrase: 'onboard', weight: 2 },
      { phrase: 'send a proposal', weight: 2.5 },
    ],
  },
  {
    state: 'BUYING_SERIOUSNESS',
    saturation: 6,
    entries: [
      { phrase: 'our company', weight: 1.8 },
      { phrase: 'our team', weight: 1.6 },
      { phrase: 'our business', weight: 1.8 },
      { phrase: 'we need', weight: 1.8 },
      { phrase: 'budget', weight: 2.5 },
      { phrase: 'budget approved', weight: 3 },
      { phrase: 'investment', weight: 2 },
      { phrase: 'roi', weight: 2.2 },
      { phrase: 'contract', weight: 2.5 },
      { phrase: 'procurement', weight: 2.8 },
      { phrase: 'stakeholders', weight: 2.2 },
      { phrase: 'decision maker', weight: 2.5 },
      { phrase: 'timeline', weight: 1.8 },
      { phrase: 'long term', weight: 1.8 },
      { phrase: 'enterprise', weight: 2.2 },
      { phrase: 'quarter', weight: 1.5 },
    ],
  },
];
