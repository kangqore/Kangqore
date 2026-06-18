// ---------------------------------------------------------------------------
// KIMMP → VIS return channel
//
// Called by the KIMMP Action Engine when it decides to act on a CONTENT_GAP
// signal. Marks the VIS opportunity as actioned, records the decision, and
// emits a confirmation signal so the loop is visible in the ledger.
//
// Best-effort: never throws, never blocks the calling action.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma'
import { SignalLedger } from '../../kangqore-immp/signals/signalLedger.service'
import logger from '../../utils/logger'

export type ContentAction = 'ACTIONED' | 'IN_PROGRESS' | 'DEPRIORITISED' | 'ASSIGNED'

export interface VisActionerResult {
  opportunityId?: string
  slug?: string
  previousStatus?: string
  newStatus: ContentAction
  signalEmitted: boolean
}

export class VisContentActioner {
  /**
   * KIMMP calls this after deciding to act on a CONTENT_GAP.
   * Updates the opportunity status in VIS and emits a CONTENT_ACTIONED
   * signal back into the ledger to close the loop.
   */
  static async action(
    params: {
      opportunityId?: string
      slug?: string
      action: ContentAction
      notes?: string
      assignedTo?: string
    }
  ): Promise<VisActionerResult> {
    let signalEmitted = false
    let previousStatus: string | undefined
    let resolvedId = params.opportunityId

    try {
      // Resolve by slug if ID not provided
      if (!resolvedId && params.slug) {
        const opp = await (prisma as any).kimmpPageOpportunity.findFirst({
          where: { slug: params.slug },
          select: { id: true, status: true },
        }).catch(() => null)
        if (opp) { resolvedId = opp.id; previousStatus = opp.status }
      } else if (resolvedId) {
        const opp = await (prisma as any).kimmpPageOpportunity.findUnique({
          where: { id: resolvedId }, select: { status: true },
        }).catch(() => null)
        previousStatus = opp?.status
      }

      if (resolvedId) {
        await (prisma as any).kimmpPageOpportunity.update({
          where: { id: resolvedId },
          data: {
            status: params.action,
            ...(params.notes      ? { notes: params.notes }           : {}),
            ...(params.assignedTo ? { assignedTo: params.assignedTo } : {}),
            actionedAt: new Date(),
            actionedBy: 'KIMMP',
          },
        }).catch(() => {})
      }

      // Emit confirmation signal
      await SignalLedger.record({
        sourceModule:   'vis-actioner',
        signalType:     'CONTENT_ACTIONED',
        signalCategory: 'CONTENT',
        signalValue:    params.slug ?? resolvedId ?? 'unknown',
        confidence:     0.95,
        severity:       'LOW',
        metadata: {
          opportunityId:  resolvedId,
          slug:           params.slug,
          previousStatus,
          newStatus:      params.action,
          notes:          params.notes,
          triggeredBy:    'KIMMP_ACTION_ENGINE',
        },
      })
      signalEmitted = true

      logger.info(`[VIS:ACTIONER] Opportunity "${params.slug ?? resolvedId}" → ${params.action}`)
    } catch (err) {
      logger.warn(`[VIS:ACTIONER] Failed: ${(err as Error).message}`)
    }

    return { opportunityId: resolvedId, slug: params.slug, previousStatus, newStatus: params.action, signalEmitted }
  }

  /**
   * ALIS calls this to boost content priority for a high-demand department.
   * Increases priority score on OPEN opportunities matching the department's
   * service keywords so VIS surfaces them in the next scan.
   */
  static async boostForDepartment(department: string, hotLeads: number): Promise<number> {
    let boosted = 0
    try {
      const boost = Math.min(8, Math.floor(hotLeads / 2))
      const result = await (prisma as any).kimmpPageOpportunity.updateMany({
        where: {
          status: { in: ['OPEN', 'PENDING'] },
          OR: [
            { title:   { contains: department, mode: 'insensitive' } },
            { slug:    { contains: department.toLowerCase().replace(/\s+/g, '-') } },
            { keywords: { has: department.toLowerCase() } },
          ],
        },
        data: { priority: { increment: boost } },
      }).catch(() => ({ count: 0 }))
      boosted = result.count ?? 0
      logger.info(`[VIS:ACTIONER] Boosted ${boosted} opportunities for department "${department}" by ${boost}pts`)
    } catch (err) {
      logger.warn(`[VIS:ACTIONER] boostForDepartment failed: ${(err as Error).message}`)
    }
    return boosted
  }
}
