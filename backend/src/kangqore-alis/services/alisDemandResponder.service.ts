// ---------------------------------------------------------------------------
// KIMMP → ALIS return channel
//
// Called by the KIMMP Action Engine when it decides to act on a DEMAND_SPIKE
// signal. Tells ALIS to reprioritise scoring for that department — boosting
// lead weights, flagging the spike as acknowledged, and recording the loop
// close in KIMMP memory so the Signal Ledger doesn't re-fire blind.
//
// Best-effort: never throws, never blocks the calling action.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma'
import { SignalLedger } from '../../kangqore-immp/signals/signalLedger.service'
import logger from '../../utils/logger'

export interface AlisResponderResult {
  department: string
  leadsUpdated: number
  signalEmitted: boolean
}

export class AlisDemandResponder {
  /**
   * KIMMP calls this after deciding to act on a DEMAND_SPIKE.
   * Boosts `scoringPriority` on WARM/HOT leads in the department so ALIS
   * surfaces them higher in the next pipeline scan. Emits a confirmation
   * signal back into the ledger to close the loop visibly.
   */
  static async respond(
    department: string,
    severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL',
    metadata?: Record<string, any>
  ): Promise<AlisResponderResult> {
    let leadsUpdated = 0
    let signalEmitted = false

    try {
      // Boost factor based on severity
      const boost = severity === 'CRITICAL' ? 15
        : severity === 'HIGH'     ? 10
        : severity === 'MODERATE' ?  5
        :                            2

      // Bump scoring priority on warm/hot leads in this department
      const updated = await (prisma as any).eqoreLead.updateMany({
        where: {
          primaryDepartment: department,
          status: { in: ['WARM', 'HOT', 'GOLDEN'] },
        },
        data: {
          scoringPriority: { increment: boost },
        },
      }).catch(() => ({ count: 0 }))

      leadsUpdated = updated.count ?? 0

      // Acknowledge the spike so ALIS doesn't re-emit immediately
      await (prisma as any).alisSpike.upsert({
        where:  { department },
        update: { acknowledgedAt: new Date(), kimmpAction: 'PRIORITISE', severity },
        create: { department, acknowledgedAt: new Date(), kimmpAction: 'PRIORITISE', severity },
      }).catch(() => {})

      // Emit a confirmation signal back into the ledger
      await SignalLedger.record({
        sourceModule:    'alis-responder',
        signalType:      'DEMAND_ACTIONED',
        signalCategory:  'MARKET',
        signalValue:     department,
        confidence:      0.9,
        severity:        'LOW',
        metadata: {
          department,
          leadsReprioritised: leadsUpdated,
          boost,
          originalSeverity: severity,
          triggeredBy: 'KIMMP_ACTION_ENGINE',
          ...metadata,
        },
      })
      signalEmitted = true

      logger.info(`[ALIS:RESPONDER] Department "${department}" reprioritised — ${leadsUpdated} leads boosted by ${boost}pts`)
    } catch (err) {
      logger.warn(`[ALIS:RESPONDER] Failed for "${department}": ${(err as Error).message}`)
    }

    return { department, leadsUpdated, signalEmitted }
  }
}
