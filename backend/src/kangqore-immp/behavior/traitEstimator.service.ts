// ---------------------------------------------------------------------------
// KIMMP — Volume-Gated Big Five (OCEAN) Trait Estimator
//
// Personality traits need text VOLUME to be defensible (the myPersonality-based
// research models train on full posting histories, not 3 chat lines). So this
// estimator refuses to score traits until a conversation crosses a configurable
// volume gate. Behavioral *states* are always available; traits are not.
//
// When eligible: prefers the Tier-2 (Claude) estimate; otherwise falls back to
// a coarse heuristic mapping, always flagged low-confidence.
// ---------------------------------------------------------------------------

import { BehaviorSignal, BehaviorStateType, BigFiveScores, TraitEstimate } from '../core/types';
import { KimmpFlags } from '../core/flags';
import { Tier1Metrics } from './signalExtractor.service';

function clamp(n: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, n));
}

function round(n: number): number {
  return Number(clamp(n).toFixed(2));
}

export class TraitEstimator {
  /**
   * @param states   Tier-1/merged behavioral signals.
   * @param metrics  Tier-1 text metrics (drives the volume gate).
   * @param tier2Traits Big Five from Claude, if it ran and was eligible.
   */
  static estimate(
    states: BehaviorSignal[],
    metrics: Tier1Metrics,
    tier2Traits?: BigFiveScores | null
  ): TraitEstimate {
    const minChars = KimmpFlags.traitMinChars();
    const minMsgs = KimmpFlags.traitMinMessages();

    // ── Volume gate ──
    if (metrics.totalChars < minChars || metrics.messageCount < minMsgs) {
      return {
        available: false,
        confidence: 0,
        reason:
          `Not enough text for a defensible Big Five estimate ` +
          `(${metrics.totalChars}/${minChars} chars, ${metrics.messageCount}/${minMsgs} messages). ` +
          `Behavioral states are reported instead.`,
      };
    }

    // ── Eligible: prefer Tier-2, else heuristic ──
    if (tier2Traits) {
      return {
        available: true,
        confidence: 0.55,
        reason: 'Estimated by the Tier-2 reasoning pass over sufficient conversation text.',
        scores: {
          openness: round(tier2Traits.openness),
          conscientiousness: round(tier2Traits.conscientiousness),
          extraversion: round(tier2Traits.extraversion),
          agreeableness: round(tier2Traits.agreeableness),
          emotionalSensitivity: round(tier2Traits.emotionalSensitivity),
        },
      };
    }

    return {
      available: true,
      confidence: 0.3,
      reason:
        'Coarse heuristic estimate from behavioral signals (Tier-2 unavailable). ' +
        'Treat as low-confidence and directional only.',
      scores: this.heuristic(states, metrics),
    };
  }

  /** Coarse signal→OCEAN mapping. Deliberately conservative — centers near 0.5. */
  private static heuristic(states: BehaviorSignal[], metrics: Tier1Metrics): BigFiveScores {
    const intensity = (t: BehaviorStateType) =>
      states.find((s) => s.type === t)?.intensity ?? 0;

    const technical = intensity('TECHNICAL_DEPTH');
    const decisionReady = intensity('DECISION_READINESS');
    const buying = intensity('BUYING_SERIOUSNESS');
    const frustration = intensity('FRUSTRATION');
    const stress = intensity('STRESS');
    const confusion = intensity('CONFUSION');

    const exploratory = clamp(metrics.questionCount / 6);
    const verbosity = clamp(metrics.avgMessageChars / 400);

    return {
      // Curiosity / breadth — technical exploration + asking questions.
      openness: round(0.5 + technical * 0.25 + exploratory * 0.2 - confusion * 0.1),
      // Organization / follow-through — decisiveness + serious buying intent.
      conscientiousness: round(0.5 + decisionReady * 0.25 + buying * 0.2 - frustration * 0.1),
      // Outward energy — only weakly inferable from text volume; stays near neutral.
      extraversion: round(0.45 + verbosity * 0.2),
      // Warmth / cooperativeness — reduced when frustration is high.
      agreeableness: round(0.55 - frustration * 0.3 - stress * 0.1),
      // Emotional sensitivity (not "neuroticism") — stress + frustration load.
      emotionalSensitivity: round(0.35 + stress * 0.35 + frustration * 0.25),
    };
  }
}
