/**
 * @openapi
 * tags:
 *   - name: ITIL
 *     description: Incident, Problem, and CMDB management (Sprint 7 — defeat ServiceNow)
 */
import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { slaDeadline, slaStatus, slaRemainingLabel } from '../services/slaEngine'
import { runIncidentResponder } from '../services/incidentResponder'

export const itilRouter = Router()

// ── INCIDENTS ─────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /admin/itil/incidents:
 *   get:
 *     tags: [ITIL]
 *     summary: List incidents with filters
 */
itilRouter.get('/incidents', async (req: Request, res: Response) => {
  const { status, priority, category, assigneeId, slaBreached, limit = '50', offset = '0' } = req.query
  const where: Record<string, unknown> = {}
  if (status)      where.status      = status
  if (priority)    where.priority    = priority
  if (category)    where.category    = category
  if (assigneeId)  where.assigneeId  = assigneeId
  if (slaBreached !== undefined) where.slaBreached = slaBreached === 'true'

  const [rows, total] = await Promise.all([
    prisma.incident.findMany({
      where,
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
      take: Math.min(Number(limit), 200),
      skip: Number(offset),
      include: {
        assignee:   { select: { id: true, name: true, avatarUrl: true } },
        reportedBy: { select: { id: true, name: true } },
        configItem: { select: { id: true, name: true, ciType: true } },
      },
    }),
    prisma.incident.count({ where }),
  ])

  const enriched = rows.map(inc => ({
    ...inc,
    slaStatus:    slaStatus(inc.slaDeadline),
    slaRemaining: slaRemainingLabel(inc.slaDeadline),
  }))

  res.json({ rows: enriched, total })
})

/**
 * @openapi
 * /admin/itil/incidents/stats:
 *   get:
 *     tags: [ITIL]
 *     summary: Incident dashboard stats
 */
itilRouter.get('/incidents/stats', async (_req: Request, res: Response) => {
  const now    = new Date()
  const today  = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [total, p1Active, slaBreached, resolvedToday, openByPriority, byStatus] = await Promise.all([
    prisma.incident.count(),
    prisma.incident.count({ where: { priority: 'P1', status: { notIn: ['RESOLVED', 'CLOSED'] } } }),
    prisma.incident.count({ where: { slaBreached: true, status: { notIn: ['RESOLVED', 'CLOSED'] } } }),
    prisma.incident.count({ where: { resolvedAt: { gte: today } } }),
    prisma.incident.groupBy({ by: ['priority'], _count: { _all: true }, where: { status: { notIn: ['RESOLVED', 'CLOSED'] } } }),
    prisma.incident.groupBy({ by: ['status'],   _count: { _all: true } }),
  ])

  res.json({ total, p1Active, slaBreached, resolvedToday, openByPriority, byStatus })
})

/**
 * @openapi
 * /admin/itil/incidents:
 *   post:
 *     tags: [ITIL]
 *     summary: Create a new incident
 */
itilRouter.post('/incidents', async (req: Request, res: Response) => {
  const userId = (req.user as any)?.userId
  const { title, description, priority = 'P3', category = 'OTHER', assigneeId, configItemId } = req.body
  if (!title?.trim() || !description?.trim()) {
    res.status(400).json({ error: 'title and description are required' }); return
  }

  const count  = await prisma.incident.count()
  const number = `INC-${String(count + 1).padStart(4, '0')}`
  const deadline = slaDeadline(priority)

  const incident = await prisma.incident.create({
    data: {
      number,
      title:        title.trim(),
      description:  description.trim(),
      priority,
      category,
      reportedById: userId,
      assigneeId:   assigneeId ?? null,
      configItemId: configItemId ?? null,
      slaDeadline:  deadline,
    },
  })

  // Fire INCIDENT_RESPONDER asynchronously — don't block response
  setImmediate(() => {
    runIncidentResponder(incident.id, title, description, priority, category).catch(() => null)
  })

  res.status(201).json({ incident, slaDeadline: deadline.toISOString() })
})

/**
 * @openapi
 * /admin/itil/incidents/{id}:
 *   get:
 *     tags: [ITIL]
 *     summary: Get incident detail
 */
itilRouter.get('/incidents/:id', async (req: Request, res: Response) => {
  const inc = await prisma.incident.findUnique({
    where:   { id: req.params.id },
    include: {
      assignee:   { select: { id: true, name: true, avatarUrl: true } },
      reportedBy: { select: { id: true, name: true } },
      configItem: { select: { id: true, name: true, ciType: true } },
      problem:    { select: { id: true, number: true, title: true, status: true } },
    },
  })
  if (!inc) { res.status(404).json({ error: 'Not found' }); return }
  res.json({ ...inc, slaStatus: slaStatus(inc.slaDeadline), slaRemaining: slaRemainingLabel(inc.slaDeadline) })
})

/**
 * @openapi
 * /admin/itil/incidents/{id}:
 *   patch:
 *     tags: [ITIL]
 *     summary: Update incident (status, assignee, resolution, priority)
 */
itilRouter.patch('/incidents/:id', async (req: Request, res: Response) => {
  const { status, assigneeId, resolution, priority, problemId, configItemId } = req.body
  const data: Record<string, unknown> = {}
  if (status)       data.status       = status
  if (assigneeId !== undefined) data.assigneeId = assigneeId
  if (resolution)   data.resolution   = resolution
  if (priority)     data.priority     = priority
  if (problemId !== undefined) data.problemId = problemId
  if (configItemId !== undefined) data.configItemId = configItemId

  if (status === 'RESOLVED' && !data.resolvedAt) data.resolvedAt = new Date()
  if (status === 'CLOSED'   && !data.closedAt)   data.closedAt   = new Date()

  const inc = await prisma.incident.update({ where: { id: req.params.id }, data })
  res.json(inc)
})

// ── PROBLEMS ──────────────────────────────────────────────────────────────────

itilRouter.get('/problems', async (req: Request, res: Response) => {
  const { status, priority } = req.query
  const where: Record<string, unknown> = {}
  if (status)   where.status   = status
  if (priority) where.priority = priority

  const [rows, total] = await Promise.all([
    prisma.problem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        assignee:  { select: { id: true, name: true } },
        incidents: { select: { id: true, number: true, title: true, status: true, priority: true }, take: 10 },
      },
    }),
    prisma.problem.count({ where }),
  ])
  res.json({ rows, total })
})

itilRouter.post('/problems', async (req: Request, res: Response) => {
  const { title, description, priority = 'P3', assigneeId } = req.body
  if (!title?.trim()) { res.status(400).json({ error: 'title is required' }); return }

  const count  = await prisma.problem.count()
  const number = `PRB-${String(count + 1).padStart(4, '0')}`

  const problem = await prisma.problem.create({
    data: {
      number,
      title:       title.trim(),
      description: (description ?? '').trim(),
      priority,
      assigneeId:  assigneeId ?? null,
    },
  })
  res.status(201).json(problem)
})

itilRouter.patch('/problems/:id', async (req: Request, res: Response) => {
  const { status, rootCause, workaround, solution, assigneeId, priority } = req.body
  const data: Record<string, unknown> = {}
  if (status)     data.status     = status
  if (rootCause)  data.rootCause  = rootCause
  if (workaround) data.workaround = workaround
  if (solution)   data.solution   = solution
  if (assigneeId !== undefined) data.assigneeId = assigneeId
  if (priority)   data.priority   = priority
  if (status === 'RESOLVED') data.resolvedAt = new Date()

  const problem = await prisma.problem.update({ where: { id: req.params.id }, data })
  res.json(problem)
})

// ── CMDB ──────────────────────────────────────────────────────────────────────

itilRouter.get('/cmdb', async (req: Request, res: Response) => {
  const { ciType, status, environment } = req.query
  const where: Record<string, unknown> = {}
  if (ciType)      where.ciType      = ciType
  if (status)      where.status      = status
  if (environment) where.environment = environment

  const [rows, total] = await Promise.all([
    prisma.configItem.findMany({ where, orderBy: { name: 'asc' }, take: 200 }),
    prisma.configItem.count({ where }),
  ])
  res.json({ rows, total })
})

itilRouter.post('/cmdb', async (req: Request, res: Response) => {
  const { name, ciType, environment, owner, version, ipAddress, location, description, dependencies } = req.body
  if (!name?.trim() || !ciType?.trim()) {
    res.status(400).json({ error: 'name and ciType are required' }); return
  }
  const ci = await prisma.configItem.create({
    data: { name: name.trim(), ciType, environment, owner, version, ipAddress, location, description, dependencies: dependencies ?? [] },
  })
  res.status(201).json(ci)
})

itilRouter.patch('/cmdb/:id', async (req: Request, res: Response) => {
  const { name, ciType, status, environment, owner, version, ipAddress, location, description, dependencies, lastAuditedAt } = req.body
  const data: Record<string, unknown> = {}
  if (name)        data.name        = name
  if (ciType)      data.ciType      = ciType
  if (status)      data.status      = status
  if (environment !== undefined) data.environment = environment
  if (owner !== undefined) data.owner = owner
  if (version !== undefined) data.version = version
  if (ipAddress !== undefined) data.ipAddress = ipAddress
  if (location !== undefined) data.location = location
  if (description !== undefined) data.description = description
  if (dependencies) data.dependencies = dependencies
  if (lastAuditedAt) data.lastAuditedAt = new Date(lastAuditedAt)

  const ci = await prisma.configItem.update({ where: { id: req.params.id }, data })
  res.json(ci)
})

itilRouter.delete('/cmdb/:id', async (req: Request, res: Response) => {
  await prisma.configItem.delete({ where: { id: req.params.id } }).catch(() => null)
  res.json({ ok: true })
})
