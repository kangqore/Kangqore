// ---------------------------------------------------------------------------
// GTM Pipeline — Overshadow Roadmap P5 tracking infrastructure.
//
// Reference-customer permission, BIDS proof-point publishing, and analyst
// relationships all require a real human relationship this code cannot
// create. What this file provides is honest: a place to log where each real
// conversation actually stands, and — for BIDS proof points specifically —
// a lookup of real completed engagements eligible to be turned into one.
// Every summary function returns real counts only; nothing is seeded.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma'

const REF_STAGES = ['IDENTIFIED', 'OUTREACH', 'PERMISSION_REQUESTED', 'PERMISSION_GRANTED', 'PUBLISHED', 'DECLINED']
const ANALYST_STATUSES = ['NOT_CONTACTED', 'OUTREACH_SENT', 'BRIEFED', 'ONGOING']

export function isValidReferenceStage(stage: string) { return REF_STAGES.includes(stage) }
export function isValidAnalystStatus(status: string) { return ANALYST_STATUSES.includes(status) }

export async function getGtmPipelineSummary() {
  const [
    referenceCandidates, referenceByStage,
    analystRelationships, analystByStatus,
    proofPointPublications, eligibleEngagements,
  ] = await Promise.all([
    (prisma as any).referenceCustomerCandidate.findMany({ orderBy: { updatedAt: 'desc' } }),
    (prisma as any).referenceCustomerCandidate.groupBy({ by: ['stage'], _count: { _all: true } }),
    (prisma as any).analystRelationship.findMany({ orderBy: { updatedAt: 'desc' } }),
    (prisma as any).analystRelationship.groupBy({ by: ['status'], _count: { _all: true } }),
    (prisma as any).bidsProofPointPublication.findMany({ orderBy: { updatedAt: 'desc' } }),
    // Real completed BIDS engagements not yet turned into a proof-point draft —
    // the only "eligible" pool; nothing here is invented.
    (prisma as any).bidsScoringEngagement.findMany({
      where: { status: 'COMPLETED', overallScore: { not: null } },
      select: { id: true, customerName: true, title: true, verticalPack: true, overallScore: true, scoreGrade: true, completedAt: true },
      orderBy: { completedAt: 'desc' },
      take: 25,
    }),
  ])

  const publishedEngagementIds = new Set(proofPointPublications.map((p: any) => p.engagementId))

  return {
    referenceCustomers: {
      candidates: referenceCandidates,
      byStage: Object.fromEntries(REF_STAGES.map(s => [s, referenceByStage.find((r: any) => r.stage === s)?._count._all ?? 0])),
      total: referenceCandidates.length,
    },
    analystRelationships: {
      relationships: analystRelationships,
      byStatus: Object.fromEntries(ANALYST_STATUSES.map(s => [s, analystByStatus.find((r: any) => r.status === s)?._count._all ?? 0])),
      total: analystRelationships.length,
    },
    bidsProofPoints: {
      publications: proofPointPublications,
      eligibleEngagements: eligibleEngagements.filter((e: any) => !publishedEngagementIds.has(e.id)),
      publishedCount: proofPointPublications.filter((p: any) => p.status === 'PUBLISHED').length,
      draftCount: proofPointPublications.filter((p: any) => p.status === 'DRAFT').length,
    },
    disclaimer: 'Tracking infrastructure for real-world processes — not a substitute for them. A row moving to PERMISSION_GRANTED, BRIEFED, or PUBLISHED means that conversation actually happened, not that this page ran a script.',
    computedAt: new Date().toISOString(),
  }
}
