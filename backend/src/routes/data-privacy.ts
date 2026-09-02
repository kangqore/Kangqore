import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const dataPrivacyRouter = Router()

// GET /export — returns authenticated user's core data as JSON download
dataPrivacyRouter.get('/export', async (req: Request, res: Response) => {
  const userId = (req.user as any)?.userId
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  const [user, projects, tasks, notifications] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true,
        phone: true, location: true, profession: true, gender: true, age: true,
        avatarUrl: true, linkedin: true, github: true, status: true,
      },
    }),
    (prisma as any).project?.findMany({ where: { managerId: userId }, select: { id: true, name: true, status: true, createdAt: true } }).catch(() => []),
    (prisma as any).task?.findMany({ where: { assigneeId: userId }, select: { id: true, title: true, status: true, createdAt: true } }).catch(() => []),
    (prisma as any).notification?.findMany({ where: { userId }, select: { id: true, type: true, message: true, createdAt: true } }).catch(() => []),
  ])

  const payload = {
    exportedAt: new Date().toISOString(),
    user,
    projects,
    tasks,
    notifications,
  }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Disposition', `attachment; filename="kangqore-export-${userId}-${Date.now()}.json"`)
  res.json(payload)
})

// GET /audit-log — paginated AEGIS audit log for the current user
dataPrivacyRouter.get('/audit-log', async (req: Request, res: Response) => {
  const userId = (req.user as any)?.userId
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  const page   = Math.max(0, Number(req.query.page ?? 0))
  const limit  = Math.min(50, Number(req.query.limit ?? 20))
  const search = String(req.query.search ?? '').trim()

  const where: Record<string, unknown> = { userId }
  if (search) {
    where.OR = [
      { eventType: { contains: search, mode: 'insensitive' } },
      { system:    { contains: search, mode: 'insensitive' } },
      { trigger:   { contains: search, mode: 'insensitive' } },
    ]
  }

  const [rows, total] = await Promise.all([
    (prisma as any).hanumanasAuditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: page * limit,
      select: {
        id: true, eventType: true, system: true, trigger: true,
        actor: true, autonomous: true, priority: true, durationMs: true, createdAt: true,
      },
    }),
    (prisma as any).hanumanasAuditLog.count({ where }),
  ])

  res.json({ rows, total, page, limit })
})

// POST /delete-request — records a GDPR account deletion request
dataPrivacyRouter.post('/delete-request', async (req: Request, res: Response) => {
  const userId = (req.user as any)?.userId
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  const { reason } = req.body

  await (prisma as any).hanumanasAuditLog.create({
    data: {
      eventType: 'GDPR_DELETE_REQUEST',
      actor:     userId,
      userId,
      trigger:   'user:delete-request',
      metadata:  { reason: reason ?? null, requestedAt: new Date().toISOString() },
    },
  })

  res.json({ ok: true, message: 'Your deletion request has been received. Our team will process it within 30 days.' })
})
