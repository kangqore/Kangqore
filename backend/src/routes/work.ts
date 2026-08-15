// Phase 3 — Work OS routes
// Mounts at /api/admin/work
// All endpoints require ADMIN JWT.

import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import { WorkItemService, seedWorkOntologyTypes } from '../kangqore-view/kore/WorkItemService'
import { DependencyGraphService } from '../kangqore-view/kore/DependencyGraph'
import { WorkAutomationService } from '../services/workAutomation.service'

const router = Router()
const guard = [authenticate, authorize(['ADMIN'])]

// Seed canonical OntologyObjectTypes on first route use
let seeded = false
router.use(async (_req, _res, next) => {
  if (!seeded) { seeded = true; seedWorkOntologyTypes().catch(() => {}) }
  next()
})

// ── Work Items ─────────────────────────────────────────────────────────────

router.get('/items', ...guard, async (req, res) => {
  try {
    const { projectId, portfolioId, assigneeId, teamId, status, priority, type, parentId, search, limit, offset } = req.query as any
    const items = await WorkItemService.list({
      projectId, portfolioId, assigneeId, teamId, priority, type,
      status: status ? (status.includes(',') ? status.split(',') : status) : undefined,
      parentId: parentId === 'null' ? null : parentId,
      search,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    })
    res.json(items)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

router.post('/items', ...guard, async (req, res) => {
  try {
    const item = await WorkItemService.create(req.body)
    res.status(201).json(item)
  } catch (err: any) {
    res.status(400).json({ error: err?.message })
  }
})

router.get('/items/:id', ...guard, async (req, res) => {
  try {
    const item = await WorkItemService.get(req.params.id)
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

router.put('/items/:id', ...guard, async (req, res) => {
  try {
    const item = await WorkItemService.update(req.params.id, req.body)
    res.json(item)
  } catch (err: any) {
    res.status(400).json({ error: err?.message })
  }
})

router.delete('/items/:id', ...guard, async (req, res) => {
  try {
    await WorkItemService.delete(req.params.id)
    res.json({ ok: true })
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

router.post('/items/:id/move', ...guard, async (req, res) => {
  try {
    const { status, sortOrder } = req.body
    if (!status) return res.status(400).json({ error: 'status required' })
    const item = await WorkItemService.move(req.params.id, status, sortOrder)
    res.json(item)
  } catch (err: any) {
    res.status(400).json({ error: err?.message })
  }
})

// ── Item relationships ─────────────────────────────────────────────────────

router.post('/items/:id/relationships', ...guard, async (req, res) => {
  try {
    const { targetWorkItemId, type } = req.body
    if (!targetWorkItemId || !type) return res.status(400).json({ error: 'targetWorkItemId + type required' })
    const result = await WorkItemService.addRelationship({
      sourceWorkItemId: req.params.id,
      targetWorkItemId,
      type,
    })
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ error: err?.message })
  }
})

router.delete('/items/:id/relationships', ...guard, async (req, res) => {
  try {
    const { targetWorkItemId, type } = req.body
    await WorkItemService.removeRelationship(req.params.id, targetWorkItemId, type)
    res.json({ ok: true })
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// ── Views ──────────────────────────────────────────────────────────────────

router.get('/board', ...guard, async (req, res) => {
  try {
    const { projectId, portfolioId } = req.query as any
    const data = await WorkItemService.getBoardData(projectId, portfolioId)
    res.json(data)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

router.get('/timeline', ...guard, async (req, res) => {
  try {
    const { projectId, portfolioId, assigneeId, dateFrom, dateTo } = req.query as any
    const items = await WorkItemService.getTimelineData({
      projectId, portfolioId, assigneeId,
      dateFrom: dateFrom ? new Date(dateFrom) : new Date(Date.now() - 86_400_000 * 30),
      dateTo:   dateTo   ? new Date(dateTo)   : new Date(Date.now() + 86_400_000 * 90),
    })
    res.json(items)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

router.get('/workload', ...guard, async (req, res) => {
  try {
    const data = await WorkItemService.getWorkloadData()
    res.json(data)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

router.get('/dependency-graph', ...guard, async (req, res) => {
  try {
    const { projectId, portfolioId } = req.query as any
    const data = await DependencyGraphService.compute({ projectId, portfolioId })
    res.json(data)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// ── Executive summary ──────────────────────────────────────────────────────

router.get('/executive', ...guard, async (_req, res) => {
  try {
    const now = new Date()
    const [statusCounts, priorityCounts, typeCounts, totalCount, doneCount, inProgressCount, blockedCount, overdueCount,
           blockedItems, recentlyCompleted, portfolioHealth] = await Promise.all([
      (prisma as any).workItem.groupBy({ by: ['status'],   _count: { id: true } }),
      (prisma as any).workItem.groupBy({ by: ['priority'], _count: { id: true } }),
      (prisma as any).workItem.groupBy({ by: ['type'],     _count: { id: true } }),
      (prisma as any).workItem.count(),
      (prisma as any).workItem.count({ where: { status: 'DONE' } }),
      (prisma as any).workItem.count({ where: { status: 'IN_PROGRESS' } }),
      (prisma as any).workItem.count({ where: { status: 'BLOCKED' } }),
      (prisma as any).workItem.count({ where: { dueDate: { lt: now }, status: { notIn: ['DONE', 'CANCELLED'] } } }),
      (prisma as any).workItem.findMany({
        where: { status: 'BLOCKED' },
        orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }],
        take: 10,
        select: { id: true, title: true, priority: true, assigneeId: true, dueDate: true },
      }),
      (prisma as any).workItem.findMany({
        where: { status: 'DONE', completedAt: { not: null } },
        orderBy: { completedAt: 'desc' },
        take: 8,
        select: { id: true, title: true, type: true, completedAt: true },
      }),
      (prisma as any).workPortfolio.findMany({
        orderBy: { createdAt: 'desc' },
        take: 12,
        select: { id: true, name: true, progress: true, status: true },
      }),
    ])
    const total = totalCount as number
    res.json({
      summary: {
        total, done: doneCount, inProgress: inProgressCount, blocked: blockedCount,
        overdue: overdueCount, completionRate: total > 0 ? Math.round((doneCount / total) * 100) : 0,
      },
      byStatus:   Object.fromEntries(statusCounts.map((r: any)   => [r.status,   r._count.id])),
      byPriority: Object.fromEntries(priorityCounts.map((r: any) => [r.priority, r._count.id])),
      byType:     Object.fromEntries(typeCounts.map((r: any)     => [r.type,     r._count.id])),
      blockedItems: blockedItems.map((i: any) => ({ ...i, assigneeName: null })),
      recentlyCompleted,
      portfolioHealth: (portfolioHealth as any[]).map(p => ({ ...p, itemCount: 0 })),
    })
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// ── Portfolios ─────────────────────────────────────────────────────────────

router.get('/portfolios', ...guard, async (req, res) => {
  try {
    const portfolios = await (prisma as any).workPortfolio.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(portfolios)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

router.post('/portfolios', ...guard, async (req, res) => {
  try {
    const p = await (prisma as any).workPortfolio.create({ data: req.body })
    res.status(201).json(p)
  } catch (err: any) {
    res.status(400).json({ error: err?.message })
  }
})

router.put('/portfolios/:id', ...guard, async (req, res) => {
  try {
    const p = await (prisma as any).workPortfolio.update({ where: { id: req.params.id }, data: req.body })
    res.json(p)
  } catch (err: any) {
    res.status(400).json({ error: err?.message })
  }
})

// ── Goals ──────────────────────────────────────────────────────────────────

router.get('/goals', ...guard, async (req, res) => {
  try {
    const { portfolioId, projectId, ownerId, type } = req.query as any
    const where: any = {}
    if (portfolioId) where.portfolioId = portfolioId
    if (projectId)   where.projectId   = projectId
    if (ownerId)     where.ownerId     = ownerId
    if (type)        where.type        = type
    const goals = await (prisma as any).workGoal.findMany({ where, orderBy: { createdAt: 'desc' } })
    res.json(goals)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

router.post('/goals', ...guard, async (req, res) => {
  try {
    const g = await (prisma as any).workGoal.create({ data: req.body })
    res.status(201).json(g)
  } catch (err: any) {
    res.status(400).json({ error: err?.message })
  }
})

router.put('/goals/:id', ...guard, async (req, res) => {
  try {
    const g = await (prisma as any).workGoal.update({ where: { id: req.params.id }, data: req.body })
    res.json(g)
  } catch (err: any) {
    res.status(400).json({ error: err?.message })
  }
})

// ── Documents ──────────────────────────────────────────────────────────────

router.get('/documents', ...guard, async (req, res) => {
  try {
    const { entityType, entityId } = req.query as any
    const where: any = {}
    if (entityType) where.entityType = entityType
    if (entityId)   where.entityId   = entityId
    const docs = await (prisma as any).workDocument.findMany({ where, orderBy: { updatedAt: 'desc' } })
    res.json(docs)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

router.post('/documents', ...guard, async (req, res) => {
  try {
    const d = await (prisma as any).workDocument.create({ data: { ...req.body, authorId: (req as any).user?.id } })
    res.status(201).json(d)
  } catch (err: any) {
    res.status(400).json({ error: err?.message })
  }
})

router.put('/documents/:id', ...guard, async (req, res) => {
  try {
    const d = await (prisma as any).workDocument.update({ where: { id: req.params.id }, data: req.body })
    res.json(d)
  } catch (err: any) {
    res.status(400).json({ error: err?.message })
  }
})

// ── Automations ────────────────────────────────────────────────────────────

router.get('/automations', ...guard, async (_req, res) => {
  try { res.json(await WorkAutomationService.list()) } catch (err: any) { res.status(500).json({ error: err?.message }) }
})

router.post('/automations', ...guard, async (req, res) => {
  try { res.status(201).json(await WorkAutomationService.create(req.body)) } catch (err: any) { res.status(400).json({ error: err?.message }) }
})

router.post('/automations/:id/toggle', ...guard, async (req, res) => {
  try { res.json(await WorkAutomationService.toggle(req.params.id)) } catch (err: any) { res.status(500).json({ error: err?.message }) }
})

router.delete('/automations/:id', ...guard, async (req, res) => {
  try { await WorkAutomationService.delete(req.params.id); res.json({ ok: true }) } catch (err: any) { res.status(500).json({ error: err?.message }) }
})

export default router
