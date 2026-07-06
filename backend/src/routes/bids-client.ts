import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth'

const router = Router()

// Middleware: ensure the requesting user has bidsActive = true
async function requireBidsActive(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { bidsActive: true },
    })
    if (!user?.bidsActive) {
      return res.status(403).json({ error: 'BIDS™ access not activated for this account.' })
    }
    next()
  } catch (err) {
    next(err)
  }
}

// GET /api/client/bids/engagement
// Returns the client's linked BidsEngagement + current intake state
router.get('/engagement', authenticate, authorize(['CLIENT']), requireBidsActive, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const raw = await prisma.bidsEngagement.findUnique({
      where: { clientUserId: req.user!.id },
    })
    if (!raw) {
      return res.status(404).json({ error: 'No BIDS™ engagement found for this account.' })
    }
    // Surface all fields the client portal needs (including execution fields)
    const engagement = {
      id:                  raw.id,
      clientName:          raw.clientName,
      industry:            raw.industry,
      status:              raw.status,
      notes:               raw.notes,
      intakeData:          raw.intakeData,
      pillarScores:        raw.pillarScores,
      engineScores:        raw.engineScores,
      deliverables:        raw.deliverables,
      waandaDraftAt:       raw.waandaDraftAt,
      consultantApprovedAt: raw.consultantApprovedAt,
      publishedToClientAt: raw.publishedToClientAt,
      roadmap:             (raw as any).roadmap ?? null,
      roadmapGeneratedAt:  (raw as any).roadmapGeneratedAt ?? null,
      roadmapActivatedAt:  (raw as any).roadmapActivatedAt ?? null,
      coigBaseline:        (raw as any).coigBaseline ?? null,
      seededProjectId:     (raw as any).seededProjectId ?? null,
    }
    return res.json({ engagement })
  } catch (err) {
    next(err)
  }
})

// GET /api/client/bids/intake/status
// Poll WAANDA processing status
router.get('/intake/status', authenticate, authorize(['CLIENT']), requireBidsActive, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const engagement = await prisma.bidsEngagement.findUnique({
      where: { clientUserId: req.user!.id },
      select: { status: true, waandaDraftAt: true },
    })
    if (!engagement) return res.status(404).json({ error: 'Engagement not found.' })
    return res.json({ status: engagement.status, waandaDraftAt: engagement.waandaDraftAt })
  } catch (err) {
    next(err)
  }
})

// POST /api/client/bids/intake/save
// Auto-save partial intake draft (does not trigger WAANDA)
router.post('/intake/save', authenticate, authorize(['CLIENT']), requireBidsActive, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { intakeData } = req.body
    if (!intakeData || typeof intakeData !== 'object') {
      return res.status(400).json({ error: 'intakeData is required.' })
    }

    const engagement = await prisma.bidsEngagement.findUnique({
      where: { clientUserId: req.user!.id },
    })
    if (!engagement) return res.status(404).json({ error: 'Engagement not found.' })

    // Only allow saving if not already submitted to WAANDA
    const locked = ['WAANDA_PROCESSING', 'WAANDA_DRAFT', 'CONSULTANT_REVIEW', 'ACTIVE', 'COMPLETED']
    if (locked.includes(engagement.status)) {
      return res.status(409).json({ error: 'Intake already submitted. Cannot overwrite.' })
    }

    const updated = await prisma.bidsEngagement.update({
      where: { id: engagement.id },
      data: {
        intakeData,
        status: 'INTAKE_IN_PROGRESS',
      },
    })
    return res.json({ ok: true, savedAt: updated.updatedAt })
  } catch (err) {
    next(err)
  }
})

// POST /api/client/bids/intake/submit
// Final submit — saves intake and triggers WAANDA diagnostic agent async
router.post('/intake/submit', authenticate, authorize(['CLIENT']), requireBidsActive, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { intakeData } = req.body
    if (!intakeData || typeof intakeData !== 'object') {
      return res.status(400).json({ error: 'intakeData is required.' })
    }

    const engagement = await prisma.bidsEngagement.findUnique({
      where: { clientUserId: req.user!.id },
    })
    if (!engagement) return res.status(404).json({ error: 'Engagement not found.' })

    const locked = ['WAANDA_PROCESSING', 'WAANDA_DRAFT', 'CONSULTANT_REVIEW', 'ACTIVE', 'COMPLETED']
    if (locked.includes(engagement.status)) {
      return res.status(409).json({ error: 'Intake already submitted.' })
    }

    // Persist intake and flip to WAANDA_PROCESSING immediately
    await prisma.bidsEngagement.update({
      where: { id: engagement.id },
      data: { intakeData, status: 'WAANDA_PROCESSING' },
    })

    // Fire WAANDA diagnostic agent async (do not await — client polls /intake/status)
    import('../kangqore-immp/agents/bidsDiagnosticAgent')
      .then(({ BidsDiagnosticAgent }) =>
        BidsDiagnosticAgent.run({
          engagementId: engagement.id,
          clientName:   engagement.clientName,
          industry:     engagement.industry,
          intakeData,
        })
      )
      .catch((err: Error) => {
        console.error('[BIDS:SUBMIT] Diagnostic agent error:', err.message)
      })

    return res.json({ ok: true, status: 'WAANDA_PROCESSING' })
  } catch (err) {
    next(err)
  }
})

export default router
