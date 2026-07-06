/**
 * CRM sub-entity routes — flat arrays so the frontend stores can filter client-side.
 *
 * Client sub-entities:   /api/admin/crm/interactions|slas|milestones|governance
 * Partner sub-entities:  /api/admin/crm/partner-tasks|partner-deliverables|partner-payments|partner-notes
 * Investor financials:   /api/admin/crm/cap-table|fundraising-rounds
 */
import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth'
import { createNotification } from '../services/notificationService'
import { notifyClient } from '../services/clientEmail.service'

const router = Router()
const AUTH = [authenticate, authorize(['ADMIN'])] as const

// ── Interactions ──────────────────────────────────────────────────────────────

router.get('/interactions', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.clientInteraction.findMany({ orderBy: { date: 'desc' } })
    res.json({ interactions: rows })
  } catch (err) { next(err) }
})

router.post('/interactions', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, type, title, summary, date, owner } = req.body ?? {}
    if (!clientId || !title) return res.status(400).json({ error: 'clientId and title are required' })
    const row = await prisma.clientInteraction.create({
      data: { clientId, type: type ?? 'note', title, summary: summary ?? '', date: date ? new Date(date) : new Date(), owner: owner ?? '' },
    })
    res.status(201).json(row)
  } catch (err) { next(err) }
})

// ── SLA metrics ───────────────────────────────────────────────────────────────

router.get('/slas', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.clientSLA.findMany()
    res.json({ slas: rows })
  } catch (err) { next(err) }
})

router.post('/slas', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, metric, target, current, unit, period, status, trend } = req.body ?? {}
    if (!clientId || !metric) return res.status(400).json({ error: 'clientId and metric are required' })
    const row = await prisma.clientSLA.create({
      data: {
        clientId,
        metric,
        target:  Number(target  ?? 0),
        current: Number(current ?? 0),
        unit:    unit    ?? '',
        period:  period  ?? '',
        status:  status  ?? 'met',
        trend:   trend   ?? 'stable',
      },
    })
    res.status(201).json(row)
  } catch (err) { next(err) }
})

router.patch('/slas/:id', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { metric, target, current, unit, period, status, trend } = req.body ?? {}
    const row = await prisma.clientSLA.update({
      where: { id: req.params.id },
      data: {
        ...(metric  !== undefined && { metric }),
        ...(target  !== undefined && { target:  Number(target)  }),
        ...(current !== undefined && { current: Number(current) }),
        ...(unit    !== undefined && { unit }),
        ...(period  !== undefined && { period }),
        ...(status  !== undefined && { status }),
        ...(trend   !== undefined && { trend }),
      },
    })
    res.json(row)
  } catch (err) { next(err) }
})

router.delete('/slas/:id', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.clientSLA.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// ── Milestones ────────────────────────────────────────────────────────────────

router.get('/milestones', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.clientMilestone.findMany({ orderBy: { dueDate: 'asc' } })
    res.json({ milestones: rows })
  } catch (err) { next(err) }
})

router.post('/milestones', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, projectId, title, description, dueDate, status, owner } = req.body ?? {}
    if (!clientId || !title || !dueDate) return res.status(400).json({ error: 'clientId, title, and dueDate are required' })
    const row = await prisma.clientMilestone.create({
      data: {
        clientId,
        projectId:   projectId   ?? '',
        title,
        description: description ?? '',
        dueDate:     new Date(dueDate),
        status:      status ?? 'upcoming',
        owner:       owner  ?? '',
      },
    })
    res.status(201).json(row)
  } catch (err) { next(err) }
})

router.patch('/milestones/:id', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, dueDate, completedDate, status, owner } = req.body ?? {}

    // Read before update so we can detect a transition to 'completed'
    const existing = status === 'completed'
      ? await prisma.clientMilestone.findUnique({
          where: { id: req.params.id },
          include: { client: { include: { contacts: { where: { isPrimary: true }, take: 1 } } } },
        })
      : null

    const row = await prisma.clientMilestone.update({
      where: { id: req.params.id },
      data: {
        ...(title         !== undefined && { title }),
        ...(description   !== undefined && { description }),
        ...(dueDate       !== undefined && { dueDate:       new Date(dueDate) }),
        ...(completedDate !== undefined && { completedDate: completedDate ? new Date(completedDate) : null }),
        ...(status        !== undefined && { status }),
        ...(owner         !== undefined && { owner }),
      },
    })

    // Notify client when milestone is marked complete (only on transition)
    if (status === 'completed' && existing && existing.status !== 'completed') {
      const primaryEmail = existing.client?.contacts[0]?.email
      if (primaryEmail) {
        const user = await prisma.user.findUnique({ where: { email: primaryEmail } })
        if (user) {
          await createNotification({
            userId: user.id,
            title: 'Milestone completed',
            message: `"${existing.title}" has been marked complete — please review.`,
            type: 'SUCCESS',
            link: '/kangqore-view/client/projects',
          })
          await notifyClient(user.id, {
            type: 'MILESTONE_COMPLETE',
            milestoneTitle: existing.title,
          })
        }
      }
    }

    res.json(row)
  } catch (err) { next(err) }
})

router.delete('/milestones/:id', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.clientMilestone.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// ── Governance ────────────────────────────────────────────────────────────────

router.get('/governance', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.clientGovernanceItem.findMany({ orderBy: { date: 'desc' } })
    res.json({ governance: rows })
  } catch (err) { next(err) }
})

router.post('/governance', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, type, title, description, status, owner, date, priority, resolution } = req.body ?? {}
    if (!clientId || !title) return res.status(400).json({ error: 'clientId and title are required' })
    const row = await prisma.clientGovernanceItem.create({
      data: {
        clientId,
        type:        type        ?? 'decision',
        title,
        description: description ?? '',
        status:      status      ?? 'open',
        owner:       owner       ?? '',
        date:        date ? new Date(date) : new Date(),
        priority:    priority    ?? 'medium',
        resolution:  resolution  ?? null,
      },
    })
    res.status(201).json(row)
  } catch (err) { next(err) }
})

router.patch('/governance/:id', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { type, title, description, status, owner, date, priority, resolution } = req.body ?? {}
    const row = await prisma.clientGovernanceItem.update({
      where: { id: req.params.id },
      data: {
        ...(type        !== undefined && { type }),
        ...(title       !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status      !== undefined && { status }),
        ...(owner       !== undefined && { owner }),
        ...(date        !== undefined && { date: new Date(date) }),
        ...(priority    !== undefined && { priority }),
        ...(resolution  !== undefined && { resolution }),
      },
    })
    res.json(row)
  } catch (err) { next(err) }
})

router.delete('/governance/:id', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.clientGovernanceItem.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// ── Partner sub-entities ──────────────────────────────────────────────────────

router.get('/partner-tasks', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.crmPartnerTask.findMany({ orderBy: { assignedDate: 'desc' } })
    res.json({ tasks: rows })
  } catch (err) { next(err) }
})

router.get('/partner-deliverables', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.crmPartnerDeliverable.findMany({ orderBy: { dueDate: 'desc' } })
    res.json({ deliverables: rows })
  } catch (err) { next(err) }
})

router.get('/partner-payments', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.crmPartnerPayment.findMany({ orderBy: { issuedDate: 'desc' } })
    res.json({ payments: rows })
  } catch (err) { next(err) }
})

router.get('/partner-notes', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.crmPartnerNote.findMany({ orderBy: { date: 'desc' } })
    res.json({ notes: rows })
  } catch (err) { next(err) }
})

// ── Investor financials ───────────────────────────────────────────────────────

router.get('/cap-table', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.capTableEntry.findMany({ orderBy: { ownership: 'desc' } })
    res.json({ capTable: rows })
  } catch (err) { next(err) }
})

router.get('/fundraising-rounds', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.fundraisingRound.findMany({ orderBy: { openDate: 'desc' } })
    res.json({ rounds: rows })
  } catch (err) { next(err) }
})

export default router
