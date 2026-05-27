// ---------------------------------------------------------------------------
// Lead Intelligence → Signal Ledger producer (Phase 2)
//
// Emits INTENT and RISK signals when a lead's score or status changes to a
// meaningful threshold. Called from EqoreLeadScoringService.updateLeadScore
// after the lead row is updated.
//
// Best-effort: never throws, never blocks the scoring path.
// ---------------------------------------------------------------------------

import { SignalLedger } from '../../kangqore-immp/signals/signalLedger.service';

export interface ScoreChangeContext {
  leadId: string;
  conversationId?: string;
  sessionId?: string;
  previousScore: number;
  newScore: number;
  previousStatus: string;
  newStatus: string;
  confidence: number;
}

/** Status values that represent high-value sales events. */
const HIGH_VALUE_STATUSES = new Set(['GOLDEN', 'HOT']);

export class LeadSignalProducer {
  /**
   * Called after a lead score update. Emits a signal if the change is
   * significant or the lead reaches a high-value status.
   */
  static async onScoreChange(ctx: ScoreChangeContext): Promise<void> {
    try {
      const statusChanged = ctx.newStatus !== ctx.previousStatus;
      const isHighValue = HIGH_VALUE_STATUSES.has(ctx.newStatus);
      const scoreDelta = ctx.newScore - ctx.previousScore;

      // Only signal on meaningful changes (status upgrade or large score jump).
      if (!statusChanged && Math.abs(scoreDelta) < 10) return;

      await SignalLedger.record({
        sourceModule: 'lead-intelligence',
        signalType: statusChanged ? 'LEAD_STATUS_CHANGE' : 'LEAD_SCORE_JUMP',
        signalCategory: isHighValue ? 'INTENT' : 'RISK',
        signalValue: ctx.newStatus,
        confidence: Math.min(1, ctx.confidence / 100),
        severity: isHighValue ? 'HIGH' : scoreDelta > 20 ? 'MODERATE' : 'LOW',
        leadId: ctx.leadId,
        conversationId: ctx.conversationId,
        sessionId: ctx.sessionId,
        metadata: {
          previousScore: ctx.previousScore,
          newScore: ctx.newScore,
          scoreDelta,
          previousStatus: ctx.previousStatus,
          newStatus: ctx.newStatus,
        },
      });
    } catch {
      // Swallow — a signal write must never break the scoring pipeline.
    }
  }
}
