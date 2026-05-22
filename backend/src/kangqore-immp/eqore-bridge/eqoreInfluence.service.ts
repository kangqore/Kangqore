// ---------------------------------------------------------------------------
// KIMMP → eQORE Influence (PR 2b)
//
// Lets KIMMP's behavior reading actually SHAPE eQORE's response — the step
// beyond shadow mode (which only observes). It applies a short, mode-appropriate
// framing line to eQORE's synthesized response.
//
// SAFETY: flag-gated by KIMMP_EQORE_INFLUENCE, default OFF. With the flag off
// this is a guaranteed no-op — merging the PR changes nothing until an admin
// explicitly enables it. `apply()` is best-effort: any failure returns the
// original response unchanged. Tier-2 is disabled here (Tier-1 only) so it adds
// ~1ms and no API call to the live chat path.
//
// NOTE: this v1 mechanism prepends a framing line. A deeper integration —
// threading the response mode into the concierge agent's own generation — is
// the higher-quality follow-up. Until KIMMP's behavior reading is validated on
// real traffic, keep this flag OFF.
// ---------------------------------------------------------------------------

import logger from '../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { BehaviorAnalyzer } from '../behavior/behaviorAnalyzer.service';
import { ResponseMode } from '../core/types';

/** Short, standalone lead-ins — only for the modes where a brief framing helps. */
const FRAMING: Partial<Record<ResponseMode, string>> = {
  CALM_ASSURANCE_FIRST: "I hear this is pressing — let's steady it first, then solve it.",
  SIMPLIFY: "Here's the simple version.",
  SHOW_PROOF: 'Let me back that up with specifics.',
};

export interface InfluenceResult {
  content: string;
  applied: boolean;
  mode: ResponseMode | null;
}

export class KimmpEqoreInfluence {
  /**
   * Shape an eQORE response with KIMMP's behavior reading.
   * Returns the (possibly framed) content; never throws.
   */
  static async apply(
    responseContent: string,
    messages: { role: string; content: string }[]
  ): Promise<InfluenceResult> {
    if (!KimmpFlags.enabled() || !KimmpFlags.eqoreInfluence()) {
      return { content: responseContent, applied: false, mode: null };
    }
    try {
      const profile = await BehaviorAnalyzer.analyze(
        { messages, analyzedRole: 'USER' },
        { disableTier2: true } // Tier-1 only — fast + free on the live chat path
      );
      const mode = profile.recommendedResponseMode;
      const framing = FRAMING[mode];
      if (!framing) {
        return { content: responseContent, applied: false, mode };
      }
      logger.info(`[KIMMP:INFLUENCE] mode=${mode} applied to eQORE response`);
      return { content: `${framing}\n\n${responseContent}`, applied: true, mode };
    } catch (error) {
      logger.warn(`[KIMMP:INFLUENCE] skipped: ${(error as Error).message}`);
      return { content: responseContent, applied: false, mode: null };
    }
  }
}
