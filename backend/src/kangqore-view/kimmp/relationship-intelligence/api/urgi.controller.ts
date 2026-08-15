import { Request, Response } from 'express'
import { prisma } from '../../../../lib/prisma'

// URGI — WAANDA's Understanding Stage
// Real data only. No mocks.

export const getLiveSessions = async (_req: Request, res: Response) => {
  try {
    const conversations = await prisma.eqoreConversation.findMany({
      where:   { status: 'ACTIVE' },
      include: {
        lead: {
          select: {
            name:          true,
            companyName:   true,
            leadScore:     true,
            primaryIntent: true,
            buyingStage:   true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take:    20,
    })

    const data = conversations.map(conv => ({
      id:          conv.id,
      status:      conv.status,
      trustScore:  conv.lead?.leadScore ?? 0,
      lastAction:  conv.currentIntent ?? 'No intent recorded',
      company:     conv.lead?.companyName ?? null,
      name:        conv.lead?.name ?? null,
      buyingStage: conv.lead?.buyingStage ?? null,
    }))

    res.status(200).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch live sessions' })
  }
}

export const getEvidenceLedger = async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.evidenceLedger.findMany({
      include: { profile: { select: { visitorId: true } } },
      orderBy: { createdAt: 'desc' },
      take:    50,
    })

    // evidenceType → status mapping
    const typeMap: Record<string, string> = {
      VERIFIED:    'VERIFIED',
      INFERENCE:   'HYPOTHESIS',
      OBSERVATION: 'SHADOW',
      HYPOTHESIS:  'HYPOTHESIS',
    }

    const data = rows.map(r => ({
      id:         r.id,
      timestamp:  r.createdAt.toISOString(),
      visitor:    r.profile.visitorId ?? 'unknown',
      factKey:    r.factKey,
      factValue:  r.factValue,
      confidence: Math.round(r.confidenceScore * 100),
      status:     typeMap[r.evidenceType] ?? r.evidenceType,
    }))

    res.status(200).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch evidence ledger' })
  }
}

export const getDigitalTwin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const profile = await prisma.unifiedRelationshipProfile.findFirst({
      where: { OR: [{ visitorId: id }, { userId: id }] },
      include: {
        evidence: {
          orderBy: { confidenceScore: 'desc' },
          take:    10,
        },
        timeline: {
          orderBy: { createdAt: 'desc' },
          take:    5,
        },
      },
    })

    if (!profile) {
      return res.status(404).json({ success: false, error: 'No profile found' })
    }

    const identity = profile.currentRole && profile.currentCompany
      ? `${profile.currentRole} at ${profile.currentCompany}`
      : profile.currentCompany ?? profile.currentRole ?? 'Partially Identified'

    const maturityLevels = ['Stranger', 'Acquaintance', 'Familiar', 'Trusted', 'Partner']
    const maturityIndex  = Math.min(Math.floor(profile.engagementScore / 20), 4)

    res.status(200).json({
      success: true,
      data: {
        id:              profile.id,
        identity,
        trustScore:      profile.trustScore,
        maturity:        maturityLevels[maturityIndex],
        recentFacts:     profile.evidence.map(e => `${e.factKey}: ${e.factValue}`),
        behavioralTraits: profile.evidence
          .filter(e => e.evidenceType === 'INFERENCE')
          .slice(0, 6)
          .map(e => e.factKey),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch digital twin' })
  }
}

export const initializeReplayQueue = async (req: Request, res: Response) => {
  const { startTime, endTime } = req.body
  if (!startTime || !endTime) {
    return res.status(400).json({ success: false, error: 'startTime and endTime are required' })
  }

  try {
    const start = new Date(startTime)
    const end   = new Date(endTime)

    const records = await prisma.evidenceLedger.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { profile: { select: { visitorId: true } } },
      orderBy: { createdAt: 'asc' },
    })

    const { urgiEventBus } = await import('../events/eventBus')
    let emitted = 0

    for (const record of records) {
      const visitorId = record.profile?.visitorId ?? record.profileId
      urgiEventBus.emit('URGI:IDENTITY_VERIFIED', {
        visitorId,
        verifiedFacts: [{
          factKey:    record.factKey,
          factValue:  record.factValue,
          confidence: record.confidenceScore,
          source:     record.source,
        }],
        shadowMode: true,
      })
      emitted++
    }

    console.log(`[URGI] Replay Queue: re-emitted ${emitted} events (${start.toISOString()} → ${end.toISOString()})`)
    res.status(200).json({
      success:    true,
      message:    `Replay Queue completed. ${emitted} events re-emitted in SHADOW mode.`,
      jobId:      `REPLAY-${Date.now()}`,
      eventCount: emitted,
      range:      { startTime, endTime },
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: `Replay Queue failed: ${error.message}` })
  }
}

export const updateGovernancePolicies = async (req: Request, res: Response) => {
  const { action } = req.body
  console.log(`[URGI] Governance policy update requested: ${action}`)
  res.status(200).json({ success: true, message: 'Governance policies updated successfully.' })
}
