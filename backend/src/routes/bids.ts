import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth'
import { BidsRoadmapAgent } from '../kangqore-immp/agents/bidsRoadmapAgent'

const router = Router()

const DEFAULT_DELIVERABLES = [
  { n: 1,  name: 'Diagnostic Scorecard™',          status: 'PENDING', completedAt: null },
  { n: 2,  name: 'Executive Intelligence Report™', status: 'PENDING', completedAt: null },
  { n: 3,  name: 'Transformation Blueprint™',      status: 'PENDING', completedAt: null },
  { n: 4,  name: 'Risk Register™',                 status: 'PENDING', completedAt: null },
  { n: 5,  name: 'Opportunity Register™',          status: 'PENDING', completedAt: null },
  { n: 6,  name: 'Service Prescription Matrix™',   status: 'PENDING', completedAt: null },
  { n: 7,  name: '30/60/90/180-Day Roadmap™',      status: 'PENDING', completedAt: null },
  { n: 8,  name: 'Executive Board Presentation™',  status: 'PENDING', completedAt: null },
  { n: 9,  name: 'Executive Workshop™',            status: 'PENDING', completedAt: null },
  { n: 10, name: 'ROI Projection Report™',         status: 'PENDING', completedAt: null },
]

// GET /api/admin/bids/engagements
router.get('/engagements', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query
    const where: any = {}
    if (status) where.status = status

    const engagements = await prisma.bidsEngagement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.bidsEngagement.count()
    const byStatus = await prisma.bidsEngagement.groupBy({
      by: ['status'],
      _count: { _all: true },
    })

    res.json({
      engagements,
      stats: {
        total,
        byStatus: Object.fromEntries(byStatus.map(r => [r.status, r._count._all])),
      },
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/bids/engagements
router.post('/engagements', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientName, industry, leadConsultant, contactId, notes, startedAt } = req.body
    if (!clientName || !industry) {
      return res.status(400).json({ error: 'clientName and industry are required' })
    }

    const engagement = await prisma.bidsEngagement.create({
      data: {
        clientName,
        industry,
        leadConsultant: leadConsultant || null,
        contactId: contactId || null,
        notes: notes || null,
        startedAt: startedAt ? new Date(startedAt) : null,
        status: startedAt ? 'ACTIVE' : 'DRAFT',
        deliverables: DEFAULT_DELIVERABLES,
      },
    })

    res.status(201).json({ engagement })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/bids/engagements/:id
router.get('/engagements/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const engagement = await prisma.bidsEngagement.findUnique({ where: { id: req.params.id } })
    if (!engagement) return res.status(404).json({ error: 'Not found' })
    res.json({ engagement })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/admin/bids/engagements/:id
router.patch('/engagements/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientName, industry, leadConsultant, notes, status, startedAt, completedAt, deliverables } = req.body

    const data: any = {}
    if (clientName     !== undefined) data.clientName     = clientName
    if (industry       !== undefined) data.industry       = industry
    if (leadConsultant !== undefined) data.leadConsultant = leadConsultant
    if (notes          !== undefined) data.notes          = notes
    if (status         !== undefined) data.status         = status
    if (startedAt      !== undefined) data.startedAt      = startedAt ? new Date(startedAt) : null
    if (completedAt    !== undefined) data.completedAt    = completedAt ? new Date(completedAt) : null
    if (deliverables   !== undefined) data.deliverables   = deliverables

    const engagement = await prisma.bidsEngagement.update({ where: { id: req.params.id }, data })
    res.json({ engagement })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/admin/bids/engagements/:id/deliverables/:n
router.patch('/engagements/:id/deliverables/:n', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const n = parseInt(req.params.n, 10)
    const { status: dlStatus } = req.body

    const existing = await prisma.bidsEngagement.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Not found' })

    const deliverables = (existing.deliverables as any[]).map(d =>
      d.n === n
        ? { ...d, status: dlStatus, completedAt: dlStatus === 'COMPLETE' ? new Date().toISOString() : null }
        : d
    )

    const engagement = await prisma.bidsEngagement.update({
      where: { id: req.params.id },
      data:  { deliverables },
    })

    res.json({ engagement })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/admin/bids/engagements/:id
router.delete('/engagements/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.bidsEngagement.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// ── Consultant review routes ──────────────────────────────────────────────────

// GET /api/admin/bids/engagements/:id/diagnostic — full WAANDA output for consultant review
router.get('/engagements/:id/diagnostic', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const engagement = await prisma.bidsEngagement.findUnique({
      where:   { id: req.params.id },
      include: { clientUser: { select: { id: true, email: true, name: true } } },
    })
    if (!engagement) return res.status(404).json({ error: 'Not found' })
    res.json({
      engagement: {
        id:                  engagement.id,
        clientName:          engagement.clientName,
        industry:            engagement.industry,
        status:              engagement.status,
        notes:               engagement.notes,
        leadConsultant:      engagement.leadConsultant,
        intakeData:          engagement.intakeData,
        pillarScores:        engagement.pillarScores,
        engineScores:        engagement.engineScores,
        waandaDraftAt:       engagement.waandaDraftAt,
        consultantApprovedAt: engagement.consultantApprovedAt,
        publishedToClientAt: engagement.publishedToClientAt,
        deliverables:        engagement.deliverables,
        clientUser:          (engagement as any).clientUser ?? null,
        // Roadmap / execution fields
        roadmap:             (engagement as any).roadmap ?? {},
        roadmapGeneratedAt:  (engagement as any).roadmapGeneratedAt ?? null,
        roadmapActivatedAt:  (engagement as any).roadmapActivatedAt ?? null,
        coigBaseline:        (engagement as any).coigBaseline ?? {},
        seededProjectId:     (engagement as any).seededProjectId ?? null,
      },
    })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/admin/bids/engagements/:id/consultant-notes — save report edits without publishing
router.patch('/engagements/:id/consultant-notes', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { notes, pillarScores } = req.body
    const data: any = { status: 'CONSULTANT_REVIEW' }
    if (notes        !== undefined) data.notes        = notes
    if (pillarScores !== undefined) data.pillarScores = pillarScores
    const engagement = await prisma.bidsEngagement.update({ where: { id: req.params.id }, data })
    res.json({ engagement })
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/bids/engagements/:id/approve — publish diagnostic to the client
router.post('/engagements/:id/approve', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { notes } = req.body
    const now = new Date()
    const data: any = {
      status:              'ACTIVE',
      consultantApprovedAt: now,
      publishedToClientAt:  now,
    }
    if (notes !== undefined) data.notes = notes

    const engagement = await prisma.bidsEngagement.update({ where: { id: req.params.id }, data })
    res.json({ engagement })
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/bids/engagements/:id/assign-client — link engagement to a client user
router.post('/engagements/:id/assign-client', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientUserId } = req.body
    if (!clientUserId) return res.status(400).json({ error: 'clientUserId required' })

    // Activate bidsActive on the user and link the engagement
    await prisma.user.update({ where: { id: clientUserId }, data: { bidsActive: true } as any })
    const engagement = await prisma.bidsEngagement.update({
      where: { id: req.params.id },
      data:  { clientUserId },
    })
    res.json({ engagement })
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/bids/engagements/:id/generate-roadmap — WAANDA generates Transformation Roadmap
router.post('/engagements/:id/generate-roadmap', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const engagement = await prisma.bidsEngagement.findUnique({ where: { id: req.params.id } })
    if (!engagement) return res.status(404).json({ error: 'Not found' })

    const pillarScores = Array.isArray(engagement.pillarScores) ? engagement.pillarScores : []
    if ((pillarScores as any[]).length < 16) {
      return res.status(409).json({ error: 'Diagnostic scores not yet available. Run BIDS™ diagnostic first.' })
    }

    // Run roadmap generation (synchronous — takes ~10s, acceptable for admin)
    const roadmap = await BidsRoadmapAgent.run({
      engagementId: engagement.id,
      clientName:   engagement.clientName,
      industry:     engagement.industry,
      pillarScores: pillarScores as any[],
    })

    res.json({ roadmap, generatedAt: new Date().toISOString() })
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/bids/engagements/:id/activate — seed Project + Deliverables + Objectives from roadmap
router.post('/engagements/:id/activate', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const engagement = await prisma.bidsEngagement.findUnique({ where: { id: req.params.id } })
    if (!engagement) return res.status(404).json({ error: 'Not found' })
    if (!engagement.clientUserId) return res.status(409).json({ error: 'No client user assigned. Assign a client before activating.' })
    if ((engagement as any).roadmapActivatedAt) return res.status(409).json({ error: 'Engagement already activated.' })

    const roadmap   = (engagement as any).roadmap as any
    const pillars   = Array.isArray(engagement.pillarScores) ? (engagement.pillarScores as any[]) : []
    const overallScore = pillars.length > 0
      ? Math.round(pillars.reduce((s: number, p: any) => s + (p.score ?? 0), 0) / pillars.length)
      : 0

    // ── 1. Create master Project ──────────────────────────────────────────────
    const project = await prisma.project.create({
      data: {
        title:       `${engagement.clientName} — BIDS™ Transformation Programme`,
        description: `WAANDA-generated transformation programme from BIDS™ diagnostic. Overall score: ${overallScore}/100. Industry: ${engagement.industry}.`,
        status:      'ACTIVE',
        clientId:    engagement.clientUserId,
        category:    'Transformation',
        services:    ['BIDS™ Transformation'],
        dueDate:     new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
      } as any,
    })

    // ── 2. Create Deliverables from roadmap phases ────────────────────────────
    if (roadmap?.phases && Array.isArray(roadmap.phases)) {
      for (const phase of roadmap.phases) {
        const horizonMs: Record<string, number> = {
          '30-day':  30, '60-day':  60, '90-day':  90, '180-day': 180,
        }
        const daysOut   = horizonMs[phase.horizon] ?? 90
        const phaseDate = new Date(Date.now() + daysOut * 24 * 60 * 60 * 1000)

        for (const proj of (phase.projects ?? [])) {
          await prisma.deliverable.create({
            data: {
              title:       `[${phase.horizon}] ${proj.title}`,
              description: `${proj.description} — Phase: ${phase.label}`,
              projectId:   project.id,
              clientId:    engagement.clientUserId!,
              status:      'pending',
              dueDate:     phaseDate,
            },
          })
        }
      }
    }

    // ── 3. Create BusinessObjectives from service prescriptions ───────────────
    if (roadmap?.servicePrescriptions && Array.isArray(roadmap.servicePrescriptions)) {
      for (const sp of roadmap.servicePrescriptions) {
        await prisma.businessObjective.create({
          data: {
            projectId:   project.id,
            description: `${sp.pillarName}: ${sp.recommendedService} — Improve from ${sp.currentScore} → ${sp.targetScore}/100`,
            type:        'TRANSFORMATION',
            kpiMetric:   `BIDS™ Pillar ${sp.pillarId} score`,
            status:      'ON_TRACK',
          },
        })
      }
    }

    // ── 4. Snapshot COIG baseline + mark activated ────────────────────────────
    const now = new Date()
    await prisma.bidsEngagement.update({
      where: { id: engagement.id },
      data: {
        roadmapActivatedAt: now,
        seededProjectId:    project.id,
        coigBaseline: {
          overallScore,
          pillarScores: pillars.map((p: any) => ({ pillarId: p.pillarId, score: p.score })),
          capturedAt:   now.toISOString(),
        },
      } as any,
    })

    res.json({
      ok:        true,
      projectId: project.id,
      activatedAt: now.toISOString(),
      deliverablesCreated: roadmap?.phases
        ? roadmap.phases.reduce((n: number, ph: any) => n + (ph.projects?.length ?? 0), 0)
        : 0,
      objectivesCreated: roadmap?.servicePrescriptions?.length ?? 0,
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/bids/clients — all CLIENT users, for the assign-client dropdown
router.get('/clients', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const clients = await prisma.user.findMany({
      where:   { role: 'CLIENT' },
      select:  { id: true, email: true, name: true, bidsActive: true } as any,
      orderBy: { name: 'asc' },
    })
    res.json({ clients })
  } catch (err) {
    next(err)
  }
})

export default router
