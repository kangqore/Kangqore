// ---------------------------------------------------------------------------
// KIMMP → Lead Intelligence scoring bridge (Phase 2)
//
// Reads KIMMP's behavioral summary for a lead and returns a score adjustment
// (+0 to +10) that Lead Intelligence can apply on top of its deterministic
// score. This is the "KIMMP behavior signals feed lead scoring" step from the
// roadmap.
//
// Safety rules:
// - The boost is advisory: it adds points, never subtracts or overrides.
// - Maximum adjustment is +10 — KIMMP does not dominate the deterministic score.
// - Returns 0 if no profile exists, on any error, or if the posture is NEUTRAL.
// - Called from EqoreLeadScoringService.updateLeadScore via a flag gate
//   (KIMMP_SCORE_BRIDGE, off by default — enable after KIMMP's behavior
//   reading is validated on real traffic).
// ---------------------------------------------------------------------------

import { KimmpFlags } from '../core/flags';
import { LeadBehaviorSummaryService, SalesPosture } from './leadBehaviorSummary.service';
import logger from '../../../utils/logger';

/** Maximum KIMMP-sourced bonus points added to a lead score. */
const MAX_BOOST = 10;

const POSTURE_BOOST: Record<SalesPosture, number> = {
  HIGH_INTENT: 10,
  NEEDS_REASSURANCE: 4,
  EXPLORING: 2,
  NEUTRAL: 0,
};

export class LeadScoringBridge {
  /**
   * Returns a 0–10 point boost for the lead based on KIMMP's behavioral read.
   * Always returns 0 on any failure so it never breaks the scoring pipeline.
   */
  static async behaviorBoost(leadId: string): Promise<number> {
    if (!KimmpFlags.scoreBridgeEnabled()) return 0;
    try {
      const summary = await LeadBehaviorSummaryService.forLead(leadId, 10);
      if (!summary.available) return 0;
      return Math.min(MAX_BOOST, POSTURE_BOOST[summary.salesPosture] ?? 0);
    } catch (err) {
      logger.warn(`[KIMMP:SCORE_BRIDGE] boost failed for lead ${leadId}: ${(err as Error).message}`);
      return 0;
    }
  }
}
