// ---------------------------------------------------------------------------
// KIMMP — eQORE Shadow Observer (PR 2 / PR 2.5)
//
// SHADOW MODE: KIMMP analyzes every eQORE conversation and LOGS the behavioral
// reading it would recommend. It does NOT change eQORE's response, routing, or
// any data. This exists to gather real production-traffic accuracy data before
// KIMMP is ever allowed to influence live responses (PR 2b).
//
// PR 2.5 adds an in-memory ring buffer of recent observations so an admin can
// review the readings via an endpoint instead of grepping logs. The buffer is
// in-memory only — it clears on server restart. Durable storage lands with
// KIMMP persistence (PR 1.5).
//
// Contract: `observe()` is fire-and-forget — it returns immediately, never
// throws, and never blocks or breaks the eQORE request flow.
// ---------------------------------------------------------------------------

import logger from '../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { BehaviorAnalyzer } from '../behavior/behaviorAnalyzer.service';
import { BehaviorProfileStore } from '../behavior/behaviorProfileStore.service';
import { SignalLedger } from '../signals/signalLedger.service';
import { CommunicationStyle, ResponseMode, Severity } from '../core/types';

export interface ShadowObserveInput {
  conversationId: string;
  leadId?: string;
  sessionId?: string;
  messages: { role: string; content: string }[];
}

/** A compact, review-friendly record of one shadow observation. */
export interface ShadowObservation {
  observedAt: string;
  conversationId: string;
  leadId?: string;
  sessionId?: string;
  messageCount: number;
  recommendedResponseMode: ResponseMode;
  communicationStyle: CommunicationStyle;
  tier1Confidence: number;
  tier2Used: boolean;
  topStates: { type: string; intensity: number; severity: Severity }[];
  traitsAvailable: boolean;
  emotionalSummary: string;
  guardrailFlags: string[];
}

export class KimmpEqoreShadowObserver {
  /** Newest-last ring buffer of recent observations (in-memory only). */
  private static buffer: ShadowObservation[] = [];

  /**
   * Observe a conversation in shadow mode. Detaches immediately — the caller is
   * never blocked and never sees an error from KIMMP.
   */
  static observe(input: ShadowObserveInput): void {
    if (!KimmpFlags.enabled() || !KimmpFlags.eqoreShadow()) return;

    // Detach from the request lifecycle. Any failure is swallowed and logged.
    void this.run(input).catch((err) => {
      logger.warn(`[KIMMP:SHADOW] observation failed: ${(err as Error).message}`);
    });
  }

  /** Most-recent-first slice of the in-memory observation buffer. */
  static getRecent(limit = 50): ShadowObservation[] {
    return this.buffer.slice(-Math.max(1, limit)).reverse();
  }

  private static record(obs: ShadowObservation): void {
    this.buffer.push(obs);
    const cap = KimmpFlags.shadowBufferSize();
    if (this.buffer.length > cap) this.buffer.splice(0, this.buffer.length - cap);
  }

  private static async run(input: ShadowObserveInput): Promise<void> {
    const profile = await BehaviorAnalyzer.analyze(
      {
        messages: input.messages,
        conversationId: input.conversationId,
        sessionId: input.sessionId,
        analyzedRole: 'USER',
      },
      // Tier-2 (Claude) is off by default on the live chat path to bound cost.
      { disableTier2: !KimmpFlags.shadowTier2() }
    );

    const topStates = profile.states.slice(0, 3).map((s) => ({
      type: s.type,
      intensity: s.intensity,
      severity: s.severity,
    }));

    this.record({
      observedAt: profile.createdAt,
      conversationId: input.conversationId,
      leadId: input.leadId,
      sessionId: input.sessionId,
      messageCount: profile.input.messageCount,
      recommendedResponseMode: profile.recommendedResponseMode,
      communicationStyle: profile.communicationStyle,
      tier1Confidence: profile.tier1Confidence,
      tier2Used: profile.tier2Used,
      topStates,
      traitsAvailable: profile.traits.available,
      emotionalSummary: profile.emotionalSummary,
      guardrailFlags: profile.guardrailFlags,
    });

    // Durable persistence (PR 1.5) — flag-gated; a no-op + graceful when
    // KIMMP_PERSIST=false or the table is absent. Keeps shadow data across restarts.
    await BehaviorProfileStore.save(profile, {
      conversationId: input.conversationId,
      leadId: input.leadId,
      sessionId: input.sessionId,
    });

    // Phase 1 — emit the behavior reading into the Signal Ledger (best-effort).
    await SignalLedger.record({
      sourceModule: 'kimmp',
      signalType: 'BEHAVIOR_READING',
      signalCategory: 'BEHAVIOR',
      signalValue: profile.recommendedResponseMode,
      confidence: profile.tier1Confidence,
      severity: profile.states[0]?.severity ?? 'LOW',
      conversationId: input.conversationId,
      leadId: input.leadId,
      sessionId: input.sessionId,
      metadata: {
        communicationStyle: profile.communicationStyle,
        tier2Used: profile.tier2Used,
        topStates,
      },
    });

    // Greppable, structured single-line log — the PR 2 review surface.
    const stateStr = topStates.map((s) => `${s.type}:${s.intensity}/${s.severity}`).join(' ');
    logger.info(
      `[KIMMP:SHADOW] conv=${input.conversationId} lead=${input.leadId ?? '-'} ` +
        `mode=${profile.recommendedResponseMode} style=${profile.communicationStyle} ` +
        `tier1Conf=${profile.tier1Confidence} tier2=${profile.tier2Used} ` +
        `states=[${stateStr || 'none'}] ` +
        `traits=${profile.traits.available ? 'available' : 'gated'} ` +
        `guardrail=[${profile.guardrailFlags.join(',') || 'clean'}]`
    );
  }
}
