import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth'

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

export default router
