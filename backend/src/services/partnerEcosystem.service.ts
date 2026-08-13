// ---------------------------------------------------------------------------
// Partner Ecosystem — Overshadow Roadmap P6.
//
// PartnerTier is real program structure, but ships with zero seeded rows —
// certification requirements and revenue-share percentages are business
// terms only Kangqore's leadership sets, not something inferred or guessed
// here. PartnerRelationship tracks real SI conversations once a tier
// structure exists to place them in. Same discipline as P5's GTM pipeline:
// this is tooling for a real process, not a stand-in for it.
// ---------------------------------------------------------------------------

import { prisma } from '../lib/prisma'

const REL_STAGES = ['IDENTIFIED', 'OUTREACH', 'NDA_SENT', 'TERMS_AGREED', 'CERTIFIED', 'ACTIVE', 'DECLINED']
const TIER_STATUSES = ['DRAFT', 'ACTIVE', 'RETIRED']

export function isValidRelationshipStage(stage: string) { return REL_STAGES.includes(stage) }
export function isValidTierStatus(status: string) { return TIER_STATUSES.includes(status) }

export async function getPartnerEcosystemSummary() {
  const [tiers, relationships, byStage] = await Promise.all([
    (prisma as any).partnerTier.findMany({ orderBy: { createdAt: 'asc' }, include: { _count: { select: { relationships: true } } } }),
    (prisma as any).partnerRelationship.findMany({ orderBy: { updatedAt: 'desc' }, include: { tier: { select: { name: true } } } }),
    (prisma as any).partnerRelationship.groupBy({ by: ['stage'], _count: { _all: true } }),
  ])

  return {
    tiers,
    relationships,
    byStage: Object.fromEntries(REL_STAGES.map(s => [s, byStage.find((r: any) => r.stage === s)?._count._all ?? 0])),
    activeRelationships: relationships.filter((r: any) => r.stage === 'ACTIVE').length,
    disclaimer: 'Real tracking infrastructure for a real business-development process. Zero seeded tiers or relationships — revenue-share terms and SI conversations are real facts only Kangqore leadership can set or report, never inferred here.',
    computedAt: new Date().toISOString(),
  }
}
