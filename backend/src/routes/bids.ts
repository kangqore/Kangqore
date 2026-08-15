import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth'
import { BidsRoadmapAgent } from '../kangqore-immp/agents/bidsRoadmapAgent'
import { emailService } from '../kangqore-view/eaf/channels/EmailService'
import { runBidsPillarAudit } from '../kangqore-immp/services/bidsPillarAudit.service'

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
        const displacesText = Array.isArray(sp.displaces) && sp.displaces.length > 0
          ? ` Displaces: ${sp.displaces.join(', ')}.`
          : ''
        await prisma.businessObjective.create({
          data: {
            projectId:   project.id,
            description: `${sp.pillarName}: ${sp.recommendedService} — Improve from ${sp.currentScore} → ${sp.targetScore}/100.${displacesText}${sp.competitorContext ? ` ${sp.competitorContext}` : ''}`,
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

// POST /api/admin/bids/engagements/:id/activate-client — create/find Client user, set bidsActive, send login email
router.post('/engagements/:id/activate-client', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const engagement = await prisma.bidsEngagement.findUnique({ where: { id: req.params.id } })
    if (!engagement) return res.status(404).json({ error: 'Not found' })
    if (engagement.clientUserId) return res.status(409).json({ error: 'Client portal already activated for this engagement.' })

    const intakeData = engagement.intakeData as any
    const email = intakeData?.email
    if (!email) return res.status(409).json({ error: 'No email in intake data. Cannot create client account.' })

    const firstName = intakeData?.firstName || ''
    const lastName  = intakeData?.lastName  || ''
    const fullName  = `${firstName} ${lastName}`.trim() || intakeData?.company || 'Client'

    // Find existing user or create new CLIENT user (no password — they set it via Forgot Password)
    let clientUser = await prisma.user.findUnique({ where: { email } })
    if (!clientUser) {
      clientUser = await prisma.user.create({
        data: {
          email,
          name:      fullName,
          company:   intakeData?.company  || '',
          phone:     intakeData?.phone    || null,
          role:      'CLIENT' as any,
          bidsActive: true as any,
        },
      })
    } else {
      await prisma.user.update({ where: { id: clientUser.id }, data: { bidsActive: true } as any })
    }

    // Link user to engagement and move to intake stage
    const updated = await prisma.bidsEngagement.update({
      where: { id: engagement.id },
      data: {
        clientUserId: clientUser.id,
        status:       'INTAKE_IN_PROGRESS' as any,
        startedAt:    new Date(),
      },
    })

    const frontendUrl = process.env.FRONTEND_URL || 'https://kangqore.com'
    emailService.sendEmail({
      to: email,
      subject: 'Your Kangqore BIDS™ Assessment Portal is Ready',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #2564ea;">Your Diagnostic Assessment Portal is Ready</h2>
          <p>Dear ${firstName || fullName},</p>
          <p>Your BIDS™ Diagnostic Assessment portal for <strong>${engagement.clientName}</strong> has been activated.
             You can now begin your 16-pillar assessment.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}/login"
               style="display: inline-block; padding: 14px 28px; background: linear-gradient(90deg, #2564ea, #4ab6d4); color: white; border-radius: 10px; text-decoration: none; font-weight: bold;">
              Access Your Assessment Portal →
            </a>
          </div>
          <p style="font-size: 13px; color: #6b7280;">
            Sign in with: <strong>${email}</strong><br/>
            First time? Use "Forgot Password" on the login page to set your password.
          </p>
          <p>Best regards,<br/><strong>The Kangqore Team</strong></p>
        </div>
      `,
    }).catch(() => {})

    res.json({ ok: true, engagement: updated, clientUserId: clientUser.id })
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

// ─── S77: BIDS™ Pillar Audit ─────────────────────────────────────────────────

// GET /api/admin/bids/audit/latest — most recent audit run with all 16 scores
router.get('/audit/latest', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const run = await (prisma as any).bidsPillarAuditRun.findFirst({
      orderBy: { auditedAt: 'desc' },
      include: { scores: { orderBy: { pillarId: 'asc' } } },
    })
    res.json(run ?? null)
  } catch (err) { next(err) }
})

// GET /api/admin/bids/audit/history — last 30 runs (summary only)
router.get('/audit/history', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const runs = await (prisma as any).bidsPillarAuditRun.findMany({
      orderBy: { auditedAt: 'desc' },
      take: 30,
      select: { id: true, trigger: true, overallScore: true, auditedAt: true },
    })
    res.json({ runs })
  } catch (err) { next(err) }
})

// POST /api/admin/bids/audit/run — manual trigger
router.post('/audit/run', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const run = await runBidsPillarAudit('manual')
    res.status(201).json(run)
  } catch (err) { next(err) }
})

// ─── S78: WAANDA-FM corpus ────────────────────────────────────────────────────

// GET /api/admin/bids/waanda-fm/status
router.get('/waanda-fm/status', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [latestScan, totalExamples, evals] = await Promise.all([
      (prisma as any).waandaFMCorpusScan.findFirst({ orderBy: { scanAt: 'desc' } }),
      (prisma as any).waandaFMTrainingExample.count({ where: { included: true } }),
      (prisma as any).waandaFMEval.findMany({ orderBy: { evalDate: 'desc' }, take: 10 }),
    ])
    res.json({ latestScan, totalIncludedExamples: totalExamples, evals })
  } catch (err) { next(err) }
})

// POST /api/admin/bids/waanda-fm/curate — run corpus curation
router.post('/waanda-fm/curate', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { runWaandaFMCuration } = await import('../kangqore-immp/services/bidsPillarAudit.service')
    const qualityThreshold = Number(req.body.qualityThreshold ?? 0.85)
    const scan = await runWaandaFMCuration(qualityThreshold)
    res.status(201).json(scan)
  } catch (err) { next(err) }
})

// GET /api/admin/bids/waanda-fm/examples — paginated training examples
router.get('/waanda-fm/examples', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 50), 200)
    const page  = Math.max(Number(req.query.page ?? 1), 1)
    const phase = req.query.phase as string | undefined
    const where = { included: true, ...(phase ? { phase } : {}) }
    const [examples, total] = await Promise.all([
      (prisma as any).waandaFMTrainingExample.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      (prisma as any).waandaFMTrainingExample.count({ where }),
    ])
    res.json({ examples, total, page, limit })
  } catch (err) { next(err) }
})

// POST /api/admin/bids/waanda-fm/evals — record benchmark result
router.post('/waanda-fm/evals', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { modelCandidate, baseModelSize, oisPredictionAccuracy, coigRecommendQuality, enterpriseReasonScore, notes } = req.body
    const overallScore = [oisPredictionAccuracy, coigRecommendQuality, enterpriseReasonScore]
      .filter(v => v != null)
      .reduce((s, v, _, arr) => s + v / arr.length, 0)
    const ev = await (prisma as any).waandaFMEval.create({
      data: { modelCandidate, baseModelSize, oisPredictionAccuracy, coigRecommendQuality, enterpriseReasonScore, overallScore, notes },
    })
    res.status(201).json(ev)
  } catch (err) { next(err) }
})

export default router
