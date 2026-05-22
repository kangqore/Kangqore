// ---------------------------------------------------------------------------
// KIMMP — eQORE Shadow Observer (PR 2)
//
// SHADOW MODE: KIMMP analyzes every eQORE conversation and LOGS the behavioral
// reading it would recommend. It does NOT change eQORE's response, routing, or
// any data. This exists to gather real production-traffic accuracy data before
// KIMMP is ever allowed to influence live responses (PR 2b).
//
// Contract: `observe()` is fire-and-forget — it returns immediately, never
// throws, and never blocks or breaks the eQORE request flow.
// ---------------------------------------------------------------------------

import logger from '../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { BehaviorAnalyzer } from '../behavior/behaviorAnalyzer.service';

export interface ShadowObserveInput {
  conversationId: string;
  leadId?: string;
  sessionId?: string;
  messages: { role: string; content: string }[];
}

export class KimmpEqoreShadowObserver {
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

    const topStates = profile.states
      .slice(0, 3)
      .map((s) => `${s.type}:${s.intensity}/${s.severity}`)
      .join(' ');

    // Greppable, structured single-line log — the PR 2 review surface.
    logger.info(
      `[KIMMP:SHADOW] conv=${input.conversationId} lead=${input.leadId ?? '-'} ` +
        `mode=${profile.recommendedResponseMode} style=${profile.communicationStyle} ` +
        `tier1Conf=${profile.tier1Confidence} tier2=${profile.tier2Used} ` +
        `states=[${topStates || 'none'}] ` +
        `traits=${profile.traits.available ? 'available' : 'gated'} ` +
        `guardrail=[${profile.guardrailFlags.join(',') || 'clean'}]`
    );
  }
}
