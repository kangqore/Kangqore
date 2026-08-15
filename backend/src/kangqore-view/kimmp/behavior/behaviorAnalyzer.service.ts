// ---------------------------------------------------------------------------
// KIMMP — Behavior Analyzer (orchestrator)
//
// Runs the two-tier pipeline:
//   Tier-1  deterministic extractor (always)
//   Tier-2  Claude reasoning pass   (only when Tier-1 is unsure or stakes high)
// then volume-gated trait estimation, response-mode selection, a safe summary,
// and the harmful-label guardrail. Produces a BehaviorProfile.
// ---------------------------------------------------------------------------

import { v4 as uuidv4 } from 'uuid';
import logger from '../../../utils/logger';
import {
  BehaviorProfile,
  BehaviorSignal,
  BehaviorStateType,
  CommunicationStyle,
  KIMMP_VERSION,
  ResponseMode,
  Severity,
} from '../core/types';
import { KimmpFlags } from '../core/flags';
import { AnalyzeInputParsed } from './behaviorSchema';
import { Tier1SignalExtractor, Tier1Metrics } from './signalExtractor.service';
import { Tier2ClaudeReasoner } from './claudeReasoner.service';
import { TraitEstimator } from './traitEstimator.service';
import { LabelGuardrail } from '../guardrails/labelGuardrail';

function severityOf(intensity: number): Severity {
  if (intensity >= 0.67) return 'HIGH';
  if (intensity >= 0.34) return 'MODERATE';
  return 'LOW';
}

/** Safe, non-clinical descriptive clauses for the deterministic summary. */
const STATE_CLAUSES: Record<BehaviorStateType, string> = {
  URGENCY: 'appears to be working under time pressure',
  FRUSTRATION: 'sounds frustrated with a current situation',
  STRESS: 'seems to be under operational pressure',
  CONFUSION: 'seems to want a clearer explanation',
  SKEPTICISM: 'is looking for evidence before trusting a claim',
  TRUST_NEED: 'is weighing how dependable a partner would be',
  TECHNICAL_DEPTH: 'is engaging at a technical level of detail',
  DECISION_READINESS: 'sounds close to deciding on next steps',
  BUYING_SERIOUSNESS: 'is framing this as a real business decision',
};

const MODE_CLAUSES: Record<ResponseMode, string> = {
  CALM_ASSURANCE_FIRST: 'A calm, assurance-first response is suggested.',
  SIMPLIFY: 'A simplified, plain-language response is suggested.',
  SHOW_PROOF: 'Leading with proof and case studies is suggested.',
  DISCOVERY: 'Moving toward concrete next steps is suggested.',
  EXECUTIVE: 'A concise, senior, outcome-led response is suggested.',
  STANDARD: 'A standard helpful response is suggested.',
};

export class BehaviorAnalyzer {
  static async analyze(
    input: AnalyzeInputParsed,
    options?: { disableTier2?: boolean }
  ): Promise<BehaviorProfile> {
    const analyzedRole = (input.analyzedRole || 'USER').toUpperCase();

    const texts = input.messages
      .filter((m) => m.role.toUpperCase() === analyzedRole)
      .map((m) => (m.content || '').trim())
      .filter(Boolean);

    // ── Tier 1 — always ──
    const tier1 = Tier1SignalExtractor.extract(texts.length ? texts : ['']);

    // ── Tier 2 — only when unsure or high-stakes ──
    const hasHighSeverity = tier1.states.some((s) => s.severity === 'HIGH');
    const wantTier2 =
      KimmpFlags.tier2Enabled() &&
      !options?.disableTier2 &&
      texts.length > 0 &&
      (tier1.tier1Confidence < KimmpFlags.tier2ConfidenceFloor() || hasHighSeverity);

    const traitsEligible =
      tier1.metrics.totalChars >= KimmpFlags.traitMinChars() &&
      tier1.metrics.messageCount >= KimmpFlags.traitMinMessages();

    let tier2 = null;
    if (wantTier2) {
      tier2 = await Tier2ClaudeReasoner.reason({ texts, tier1, traitsEligible });
    }

    // ── Merge ──
    const tier2Used = tier2 !== null;
    const states = tier2Used ? this.mergeStates(tier1.states, tier2!) : tier1.states;
    const communicationStyle: CommunicationStyle = tier2Used
      ? tier2!.communicationStyle
      : tier1.communicationStyle;
    const recommendedResponseMode: ResponseMode = tier2Used
      ? tier2!.recommendedResponseMode
      : this.deriveResponseMode(states);

    // ── Traits (volume-gated) ──
    const traits = TraitEstimator.estimate(states, tier1.metrics, tier2?.traits ?? null);

    // ── Summary + guardrail ──
    const rawSummary = tier2Used
      ? tier2!.emotionalSummary
      : this.buildSummary(states, recommendedResponseMode);
    const guarded = LabelGuardrail.scan(rawSummary);
    if (guarded.flags.length) {
      logger.warn(`KIMMP guardrail scrubbed unsafe labels: ${guarded.flags.join(', ')}`);
    }

    return {
      analysisId: uuidv4(),
      version: KIMMP_VERSION,
      createdAt: new Date().toISOString(),
      input: {
        messageCount: texts.length,
        totalChars: tier1.metrics.totalChars,
        analyzedRole,
      },
      states,
      communicationStyle,
      traits,
      recommendedResponseMode,
      emotionalSummary: guarded.clean,
      tier1Confidence: tier1.tier1Confidence,
      tier2Used,
      guardrailFlags: guarded.flags,
    };
  }

  /** Tier-2 readings are authoritative; Tier-1 evidence is merged in for explainability. */
  private static mergeStates(
    tier1States: BehaviorSignal[],
    tier2: NonNullable<Awaited<ReturnType<typeof Tier2ClaudeReasoner.reason>>>
  ): BehaviorSignal[] {
    const tier1ByType = new Map(tier1States.map((s) => [s.type, s]));
    const merged: BehaviorSignal[] = tier2.states.map((s) => {
      const type = s.type as BehaviorStateType;
      const t1 = tier1ByType.get(type);
      const evidence = [...new Set([...(s.evidence || []), ...(t1?.evidence || [])])].slice(0, 10);
      return {
        type,
        intensity: Number(s.intensity.toFixed(3)),
        confidence: Number(s.confidence.toFixed(3)),
        severity: severityOf(s.intensity),
        evidence,
        source: 'TIER2',
      };
    });
    // Keep any Tier-1 state Tier-2 omitted, so nothing detected is silently lost.
    for (const t1 of tier1States) {
      if (!merged.some((m) => m.type === t1.type)) merged.push(t1);
    }
    merged.sort((a, b) => b.intensity * b.confidence - a.intensity * a.confidence);
    return merged;
  }

  /** Deterministic response-mode selection used when Tier-2 did not run. */
  private static deriveResponseMode(states: BehaviorSignal[]): ResponseMode {
    const at = (t: BehaviorStateType) => states.find((s) => s.type === t)?.intensity ?? 0;

    if (at('STRESS') >= 0.6 || at('FRUSTRATION') >= 0.6) return 'CALM_ASSURANCE_FIRST';
    if (at('URGENCY') >= 0.6 && at('BUYING_SERIOUSNESS') >= 0.34) return 'EXECUTIVE';
    if (at('CONFUSION') >= 0.6) return 'SIMPLIFY';
    if (at('SKEPTICISM') >= 0.6) return 'SHOW_PROOF';
    if (at('DECISION_READINESS') >= 0.6) return 'DISCOVERY';
    return 'STANDARD';
  }

  /** Deterministic, guardrail-safe summary used when Tier-2 did not run. */
  private static buildSummary(states: BehaviorSignal[], mode: ResponseMode): string {
    if (states.length === 0) {
      return 'The messages are brief and neutral; no strong behavioral signals were detected.';
    }
    const top = states[0];
    const second = states[1];
    let s = `This visitor ${STATE_CLAUSES[top.type]}`;
    if (second && second.intensity >= 0.34) {
      s += `, and also ${STATE_CLAUSES[second.type]}`;
    }
    s += `. ${MODE_CLAUSES[mode]}`;
    return s;
  }
}
