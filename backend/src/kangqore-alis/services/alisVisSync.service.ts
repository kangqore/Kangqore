// ---------------------------------------------------------------------------
// ALIS ↔ VIS bridge
//
// Closes the loop between demand intelligence and content intelligence:
//
//   ALIS → VIS : When ALIS detects a demand spike in a department, it tells
//                VIS to boost content priority for that service area so the
//                right pages get created faster.
//
//   VIS → ALIS : When VIS has strong content coverage for a service, ALIS
//                scoring confidence rises — a lead asking about a well-
//                documented service is easier to qualify and convert.
//
// Called from AlisSignalProducer after emitting a DEMAND_SPIKE, and from
// VisSignalProducer after emitting CONTENT_GAPs. Best-effort: never throws.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma'
import { VisContentActioner } from '../../kangqore-vis/services/visContentActioner.service'
import logger from '../../utils/logger'

export interface VisToAlicCoverage {
  department: string
  coveredSlugs: string[]
  coverageScore: number   // 0-100
}

export class AlisVisSync {
  /**
   * ALIS → VIS: demand spike detected → boost VIS content priority.
   * Called by AlisSignalProducer.scanAndEmit() after each DEMAND_SPIKE emit.
   */
  static async pushDemandToVis(department: string, hotLeads: number): Promise<void> {
    try {
      const boosted = await VisContentActioner.boostForDepartment(department, hotLeads)
      logger.info(`[ALIS→VIS] Pushed demand for "${department}" — ${boosted} VIS opportunities boosted`)
    } catch (err) {
      logger.warn(`[ALIS→VIS] pushDemandToVis failed: ${(err as Error).message}`)
    }
  }

  /**
   * VIS → ALIS: read VIS content coverage for a department and return a
   * coverage score. ALIS scoring uses this to raise confidence on leads
   * asking about well-documented services.
   */
  static async getCoverageForDepartment(department: string): Promise<VisToAlicCoverage> {
    try {
      const covered = await (prisma as any).kimmpPageOpportunity.findMany({
        where: {
          status: { in: ['ACTIONED', 'IN_PROGRESS', 'PUBLISHED'] },
          OR: [
            { title:    { contains: department, mode: 'insensitive' } },
            { slug:     { contains: department.toLowerCase().replace(/\s+/g, '-') } },
            { keywords: { has: department.toLowerCase() } },
          ],
        },
        select: { slug: true },
        take: 20,
      }).catch(() => [])

      const coveredSlugs   = (covered as any[]).map((p: any) => p.slug).filter(Boolean)
      const coverageScore  = Math.min(100, coveredSlugs.length * 10)

      return { department, coveredSlugs, coverageScore }
    } catch (err) {
      logger.warn(`[VIS→ALIS] getCoverageForDepartment failed: ${(err as Error).message}`)
      return { department, coveredSlugs: [], coverageScore: 0 }
    }
  }

  /**
   * VIS → ALIS: apply VIS coverage boost to WARM leads in a department.
   * When content coverage is strong (≥ 50), raises lead scoring confidence
   * so ALIS ranks them higher. Called by VisSignalProducer after a scan.
   */
  static async applyCoverageToLeads(department: string): Promise<number> {
    let updated = 0
    try {
      const { coverageScore } = await this.getCoverageForDepartment(department)
      if (coverageScore < 50) return 0     // not enough coverage to matter

      const confidenceBoost = Math.floor(coverageScore / 20)   // max +5

      const result = await (prisma as any).eqoreLead.updateMany({
        where: {
          primaryDepartment: department,
          status: { in: ['WARM', 'HOT'] },
        },
        data: { confidence: { increment: confidenceBoost } },
      }).catch(() => ({ count: 0 }))

      updated = result.count ?? 0
      logger.info(`[VIS→ALIS] Coverage boost applied to ${updated} leads in "${department}" (+${confidenceBoost} confidence)`)
    } catch (err) {
      logger.warn(`[VIS→ALIS] applyCoverageToLeads failed: ${(err as Error).message}`)
    }
    return updated
  }
}
