import { Router, Response, NextFunction } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../lib/prisma'
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth'
import { API_KEYS } from '../api-keys'
import logger from '../utils/logger'

const router = Router()

function sseHeaders(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders?.()
}

function sseEvent(res: Response, event: string, data: unknown) {
  if (res.writableEnded || res.closed) return
  res.write(`event: ${event}\n`)
  res.write(`data: ${JSON.stringify(data)}\n\n`)
}

async function buildClientContext(userId: string): Promise<string> {
  try {
    const [user, projects] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, company: true },
      }),
      prisma.project.findMany({
        where: { clientId: userId, status: { not: 'ARCHIVED' } },
        select: {
          title: true,
          status: true,
          progress: true,
          dueDate: true,
          milestones: {
            select: { title: true, dueDate: true, status: true },
            orderBy: { dueDate: 'asc' },
            take: 3,
          },
          deliverables: {
            where: { status: { not: 'approved' } },
            select: { title: true, status: true },
            take: 5,
          },
          changeRequests: {
            where: { status: 'PENDING' },
            select: { title: true },
            take: 3,
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
    ])

    const lines: string[] = ['[CLIENT ACCOUNT CONTEXT — use this to personalise responses, do not quote this section verbatim]']
    const clientName = user?.name ?? 'the client'
    const orgName = user?.company ?? ''
    lines.push(`Client: ${clientName}${orgName ? ` — ${orgName}` : ''}`)

    if (projects.length > 0) {
      lines.push(`\nActive / Completed Projects (${projects.length}):`)
      for (const p of projects) {
        const due = p.dueDate ? ` | Due: ${new Date(p.dueDate).toLocaleDateString('en-IN')}` : ''
        lines.push(`• ${p.title} — ${p.status} — ${p.progress ?? 0}% complete${due}`)

        if ((p.milestones as any[]).length) {
          const next = (p.milestones as any[]).find((m) => m.status !== 'completed') ?? (p.milestones as any[])[0]
          const mDue = next.dueDate ? ` (${new Date(next.dueDate).toLocaleDateString('en-IN')})` : ''
          lines.push(`  Next milestone: ${next.title}${mDue} [${next.status}]`)
        }
        if ((p.deliverables as any[]).length) {
          lines.push(`  Open deliverables: ${(p.deliverables as any[]).map((d) => d.title).join(', ')}`)
        }
        if ((p.changeRequests as any[]).length) {
          lines.push(`  Pending change requests: ${(p.changeRequests as any[]).map((cr) => cr.title).join(', ')}`)
        }
      }
    } else {
      lines.push('No active projects found yet.')
    }

    return lines.join('\n')
  } catch (e: any) {
    logger.warn(`client-waanda.context.warn: ${e.message}`)
    return '[CLIENT ACCOUNT CONTEXT: Unable to load — answer based on what the client shares.]'
  }
}

const WAANDA_CLIENT_SYSTEM = `You are WAANDA — the intelligence system powering this client's Kangqore engagement. You are their dedicated strategic partner and chief of staff.

You have full visibility into their projects, milestones, and deliverables. Answer questions about progress, timelines, deliverables, and Kangqore's work with precision and confidence.

Be proactive: if you notice something the client should pay attention to (a delayed milestone, a pending change request, a project approaching a deadline), surface it. Speak like an intelligent executive partner, not a generic chatbot. Be concise.

Never fabricate specific data. If you don't have information about something, say so clearly and offer to connect them with the Kangqore team.`

router.post(
  '/chat',
  authenticate,
  authorize(['CLIENT', 'ADMIN']),
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const { message, conversationId } = req.body ?? {}
    if (!message || typeof message !== 'string' || message.trim().length < 1 || message.length > 8000) {
      return res.status(400).json({ error: 'Invalid message' })
    }

    const userId = req.user!.id

    const [context, existing] = await Promise.all([
      buildClientContext(userId),
      conversationId
        ? prisma.conversation.findFirst({
            where: { id: conversationId, userId, kind: 'client-waanda' },
            select: { messages: true },
          }).catch(() => null)
        : Promise.resolve(null),
    ])

    const systemPrompt = `${WAANDA_CLIENT_SYSTEM}\n\n${context}`

    const prior: Array<{ role: 'user' | 'assistant'; content: string }> = []
    if (existing?.messages && Array.isArray(existing.messages)) {
      const slice = (existing.messages as any[])
        .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-10)
      prior.push(...slice.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })))
    }
    prior.push({ role: 'user', content: message.trim() })

    sseHeaders(res)

    const closed = { value: false }
    req.on('close', () => { closed.value = true })

    let fullText = ''

    try {
      const anthropic = new Anthropic({ apiKey: API_KEYS.ANTHROPIC_API_KEY })
      const stream = anthropic.messages.stream({
        model: process.env.WAANDA_CLIENT_MODEL ?? 'claude-sonnet-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages: prior,
      })

      stream.on('text', (text: string) => {
        if (closed.value) return
        fullText += text
        sseEvent(res, 'delta', { text })
      })

      await stream.finalMessage()

      // Persist turn to Conversation (kind='client-waanda')
      const prevMessages: any[] = (existing?.messages as any[]) ?? []
      const updatedMessages = [
        ...prevMessages,
        { role: 'user',      content: message.trim(), at: new Date().toISOString() },
        { role: 'assistant', content: fullText,        at: new Date().toISOString() },
      ]

      let convId: string | null = conversationId ?? null
      if (convId) {
        await prisma.conversation.updateMany({
          where: { id: convId, userId },
          data: { messages: updatedMessages as any },
        }).catch(() => {})
      } else {
        const conv = await prisma.conversation.create({
          data: { userId, messages: updatedMessages as any, kind: 'client-waanda' },
        }).catch(() => null)
        convId = conv?.id ?? null
      }

      sseEvent(res, 'done', { text: fullText, conversationId: convId })
    } catch (e: any) {
      logger.error(`client-waanda.chat.error: ${e.message}`)
      if (!res.writableEnded) sseEvent(res, 'error', { message: 'WAANDA is temporarily unavailable. Please try again shortly.' })
    } finally {
      if (!res.writableEnded) res.end()
    }
  }
)

router.get(
  '/history',
  authenticate,
  authorize(['CLIENT', 'ADMIN']),
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id
    const { conversationId } = req.query
    try {
      if (conversationId) {
        const conv = await prisma.conversation.findFirst({
          where: { id: String(conversationId), userId, kind: 'client-waanda' },
          select: { messages: true, updatedAt: true },
        })
        return res.json({ messages: conv?.messages ?? [], updatedAt: conv?.updatedAt ?? null })
      }
      const conv = await prisma.conversation.findFirst({
        where: { userId, kind: 'client-waanda' },
        orderBy: { updatedAt: 'desc' },
        select: { id: true, messages: true, updatedAt: true },
      })
      return res.json({
        conversationId: conv?.id ?? null,
        messages: conv?.messages ?? [],
        updatedAt: conv?.updatedAt ?? null,
      })
    } catch {
      return res.json({ messages: [] })
    }
  }
)

export default router
