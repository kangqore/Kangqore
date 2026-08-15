import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, authorize } from '../middleware/auth'
import { emailService } from '../kangqore-view/eaf/channels/EmailService'
import type { AuthenticatedRequest } from '../middleware/auth'

type Audience = 'clients' | 'partners' | 'investors' | 'careers'

interface AudienceConfig {
  fkField: 'clientId' | 'partnerId' | 'investorId' | 'jobSeekerId'
  role:    'CLIENT' | 'PARTNER' | 'INVESTOR' | 'JOB_SEEKER'
}

const AUDIENCE_MAP: Record<Audience, AudienceConfig> = {
  clients:   { fkField: 'clientId',    role: 'CLIENT'     },
  partners:  { fkField: 'partnerId',   role: 'PARTNER'    },
  investors: { fkField: 'investorId',  role: 'INVESTOR'   },
  careers:   { fkField: 'jobSeekerId', role: 'JOB_SEEKER' },
}

const AUTH = [authenticate, authorize(['ADMIN'])] as const

function makeEmailRouter(audience: Audience): Router {
  const router = Router()
  const { fkField, role } = AUDIENCE_MAP[audience]

  // GET /admin/<audience>-emails
  // Returns conversation list grouped by user
  router.get('/', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Find all distinct user IDs who have emails, then fetch those users
      const emailGroups = await prisma.emailLog.groupBy({
        by: [fkField],
        where: { [fkField]: { not: null } },
      })
      const userIds = emailGroups.map(g => g[fkField] as string).filter(Boolean)

      const users = await prisma.user.findMany({
        where: { id: { in: userIds }, role },
        select: { id: true, name: true, email: true, company: true },
      })

      const conversations = await Promise.all(users.map(async (user) => {
        const emails = await prisma.emailLog.findMany({
          where: { [fkField]: user.id },
          orderBy: { createdAt: 'asc' },
        })
        const unread = emails.filter(e => !e.isRead && e.direction !== 'outbound').length
        return {
          user,
          emails,
          lastMessage: emails[emails.length - 1] ?? null,
          unreadCount: unread,
        }
      }))

      res.json({ conversations: conversations.filter(c => c.emails.length > 0) })
    } catch (err) {
      next(err)
    }
  })

  // GET /admin/<audience>-emails/:userId
  // Returns full thread for one user
  router.get('/:userId', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, company: true },
      })
      if (!user) return res.status(404).json({ error: 'User not found' })

      const emails = await prisma.emailLog.findMany({
        where: { [fkField]: userId },
        orderBy: { createdAt: 'asc' },
      })

      // Mark inbound as read
      await prisma.emailLog.updateMany({
        where: { [fkField]: userId, isRead: false, direction: 'inbound' },
        data: { isRead: true },
      })

      res.json({ user, emails })
    } catch (err) {
      next(err)
    }
  })

  // POST /admin/<audience>-emails/reply
  // Send a reply email and persist to EmailLog
  router.post('/reply', ...AUTH, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { content, subject, replyToId, attachments } = req.body as {
        content:     string
        subject?:    string
        replyToId?:  string
        attachments?: { name: string; url: string; size: number }[]
      }
      const userId = req.body[fkField] as string

      if (!userId || !content) {
        return res.status(400).json({ error: 'userId and content required' })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      })
      if (!user) return res.status(404).json({ error: 'User not found' })

      const emailLog = await prisma.emailLog.create({
        data: {
          subject:       subject ?? 'Message from Kangqore',
          from:          process.env.EMAIL_FROM ?? 'noreply@kangqore.com',
          to:            user.email ?? '',
          body:          content,
          preview:       content.slice(0, 120),
          direction:     'outbound',
          isRead:        true,
          hasAttachment: (attachments?.length ?? 0) > 0,
          attachments:   attachments && attachments.length > 0 ? attachments : undefined,
          replyToId:     replyToId ?? null,
          [fkField]:     userId,
        },
      })

      // Fire email (non-blocking — don't await so reply doesn't fail if email fails)
      if (user.email) {
        emailService.sendEmail({
          to:      user.email,
          subject: subject ?? 'Message from Kangqore',
          text:    content,
        }).catch(() => {/* log in emailService already */})
      }

      res.status(201).json({ emailLog })
    } catch (err) {
      next(err)
    }
  })

  return router
}

export const clientEmailRouter    = makeEmailRouter('clients')
export const partnerEmailRouter   = makeEmailRouter('partners')
export const investorEmailRouter  = makeEmailRouter('investors')
export const careerEmailRouter    = makeEmailRouter('careers')
