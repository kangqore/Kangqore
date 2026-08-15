// Personal OS Routes — BFF for the Gen III Personal Workspace
// Mounted at /api/os/personal (authenticate only — any logged-in user)
// Polled by WaandaCognitiveMirror every 30s to populate the Personal workspace.

import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// GET /api/os/personal/summary — tasks + today's meetings for the logged-in user
router.get('/summary', authenticate, async (req: any, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Not authenticated' })

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)
  const now = new Date()
  const tomorrow = new Date(todayStart)
  tomorrow.setDate(tomorrow.getDate() + 1)

  try {
    const [tasks, meetings] = await Promise.all([
      prisma.task.findMany({
        where:   { clientId: userId, status: { not: 'completed' } },
        select:  { id: true, title: true, status: true, dueDate: true },
        orderBy: { dueDate: 'asc' },
        take:    30,
      }),
      prisma.meeting.findMany({
        where: {
          startTime: { gte: todayStart, lte: todayEnd },
          OR: [
            { createdBy: userId },
            { clientId: userId },
            { investorId: userId },
            { partnerId: userId },
          ],
        },
        select:  { id: true, title: true, type: true, startTime: true, endTime: true, status: true, joinLink: true },
        orderBy: { startTime: 'asc' },
        take:    20,
      }),
    ])

    const enrichedTasks = tasks.map(t => ({
      ...t,
      dueDate:  t.dueDate ? t.dueDate.toISOString() : null,
      overdue:  t.dueDate ? new Date(t.dueDate) < now : false,
      dueToday: t.dueDate ? new Date(t.dueDate) >= todayStart && new Date(t.dueDate) < tomorrow : false,
    }))

    const calendarEvents = meetings.map(m => ({
      id:       m.id,
      title:    m.title,
      type:     m.type,
      time:     new Date(m.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      startsAt: m.startTime,
      endsAt:   m.endTime,
      status:   m.status,
      joinLink: m.joinLink ?? null,
    }))

    res.json({ tasks: enrichedTasks, calendarEvents })
  } catch {
    res.status(500).json({ error: 'Personal summary unavailable' })
  }
})

export default router
