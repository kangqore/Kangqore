import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/rbac'
import { createError } from '../middleware/errorHandler'
import { emailService } from '../kangqore-view/eaf/channels/EmailService'
import crypto from 'crypto'

const router = Router()

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 48)
}

async function uniqueSlug(base: string) {
  let slug = base
  let n = 1
  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`
  }
  return slug
}

async function requireOrgAdmin(userId: string, orgId: string) {
  const m = await prisma.orgMembership.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId } },
  })
  if (!m || (m.role !== 'OWNER' && m.role !== 'ADMIN')) {
    throw createError('Forbidden — org admin required', 403)
  }
  return m
}

// ── List orgs for current user ────────────────────────────────────────────────
router.get('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const memberships = await prisma.orgMembership.findMany({
      where: { userId },
      include: { organization: true },
      orderBy: { createdAt: 'asc' },
    })
    res.json({ orgs: memberships.map(m => ({ ...m.organization, role: m.role })) })
  } catch (e) { next(e) }
})

// ── Create org ────────────────────────────────────────────────────────────────
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const { name, logoUrl } = req.body
    if (!name?.trim()) throw createError('name is required', 400)

    const slug = await uniqueSlug(slugify(name.trim()))
    const org  = await prisma.organization.create({
      data: { name: name.trim(), slug, logoUrl: logoUrl ?? null },
    })
    await prisma.orgMembership.create({
      data: { organizationId: org.id, userId, role: 'OWNER' },
    })
    res.status(201).json({ org })
  } catch (e) { next(e) }
})

// ── Get single org ────────────────────────────────────────────────────────────
router.get('/:orgId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const { orgId } = req.params

    const membership = await prisma.orgMembership.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    })
    if (!membership) throw createError('Not a member of this org', 403)

    const [org, members] = await Promise.all([
      prisma.organization.findUniqueOrThrow({ where: { id: orgId } }),
      prisma.orgMembership.findMany({
        where: { organizationId: orgId },
        include: { user: { select: { id: true, name: true, email: true, avatarUrl: true, role: true } } },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    const invitations = await prisma.orgInvitation.findMany({
      where: { organizationId: orgId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      org,
      myRole: membership.role,
      members: members.map(m => ({ ...m.user, orgRole: m.role, membershipId: m.id })),
      invitations,
    })
  } catch (e) { next(e) }
})

// ── Update org (OWNER / ADMIN only) ──────────────────────────────────────────
router.patch('/:orgId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const { orgId } = req.params
    await requireOrgAdmin(userId, orgId)

    const { name, logoUrl } = req.body
    const data: Record<string, unknown> = {}
    if (name?.trim()) {
      data.name = name.trim()
      data.slug = await uniqueSlug(slugify(name.trim()))
    }
    if (logoUrl !== undefined) data.logoUrl = logoUrl

    const org = await prisma.organization.update({ where: { id: orgId }, data })
    res.json({ org })
  } catch (e) { next(e) }
})

// ── Invite member ─────────────────────────────────────────────────────────────
router.post('/:orgId/invitations', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const { orgId } = req.params
    await requireOrgAdmin(userId, orgId)

    const { email, role = 'MEMBER' } = req.body
    if (!email) throw createError('email is required', 400)

    const org = await prisma.organization.findUniqueOrThrow({ where: { id: orgId } })

    // Check if already a member
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      const existing = await prisma.orgMembership.findUnique({
        where: { organizationId_userId: { organizationId: orgId, userId: existingUser.id } },
      })
      if (existing) throw createError('User is already a member', 409)
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const token = crypto.randomBytes(24).toString('base64url')

    const inv = await prisma.orgInvitation.create({
      data: { organizationId: orgId, email, role, token, expiresAt },
    })

    // Fire-and-forget email
    emailService.sendEmail({
      to: email,
      subject: `You've been invited to ${org.name} on Kangqore`,
      html: `<p>You've been invited to join <strong>${org.name}</strong>.
             <a href="${process.env.FRONTEND_URL ?? 'http://localhost:3001'}/invite/${token}">Accept invitation</a></p>`,
    }).catch(() => {})

    res.status(201).json({ invitation: inv })
  } catch (e) { next(e) }
})

// ── Accept invitation (public — token in URL) ─────────────────────────────────
router.post('/invitations/:token/accept', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const { token } = req.params

    const inv = await prisma.orgInvitation.findUnique({ where: { token } })
    if (!inv || inv.status !== 'PENDING') throw createError('Invalid or expired invitation', 400)
    if (new Date() > inv.expiresAt) {
      await prisma.orgInvitation.update({ where: { id: inv.id }, data: { status: 'EXPIRED' } })
      throw createError('Invitation has expired', 400)
    }

    // Add membership
    await prisma.orgMembership.upsert({
      where: { organizationId_userId: { organizationId: inv.organizationId, userId } },
      create: { organizationId: inv.organizationId, userId, role: inv.role },
      update: {},
    })

    await prisma.orgInvitation.update({ where: { id: inv.id }, data: { status: 'ACCEPTED' } })

    const org = await prisma.organization.findUniqueOrThrow({ where: { id: inv.organizationId } })
    res.json({ org, message: `Joined ${org.name}` })
  } catch (e) { next(e) }
})

// ── Remove member (OWNER / ADMIN only) ───────────────────────────────────────
router.delete('/:orgId/members/:memberId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const { orgId, memberId } = req.params
    await requireOrgAdmin(userId, orgId)

    const m = await prisma.orgMembership.findFirst({ where: { id: memberId, organizationId: orgId } })
    if (!m) throw createError('Member not found', 404)
    if (m.role === 'OWNER') throw createError('Cannot remove the owner', 400)
    if (m.userId === userId) throw createError('Cannot remove yourself', 400)

    await prisma.orgMembership.delete({ where: { id: memberId } })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

// ── Update member role ────────────────────────────────────────────────────────
router.patch('/:orgId/members/:memberId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const { orgId, memberId } = req.params
    await requireOrgAdmin(userId, orgId)

    const { role } = req.body
    if (!['MEMBER', 'ADMIN'].includes(role)) throw createError('Invalid role', 400)

    const m = await prisma.orgMembership.findFirst({ where: { id: memberId, organizationId: orgId } })
    if (!m) throw createError('Member not found', 404)
    if (m.role === 'OWNER') throw createError('Cannot change owner role', 400)

    const updated = await prisma.orgMembership.update({ where: { id: memberId }, data: { role } })
    res.json({ membership: updated })
  } catch (e) { next(e) }
})

// ── Cancel invitation ─────────────────────────────────────────────────────────
router.delete('/:orgId/invitations/:invId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const { orgId, invId } = req.params
    await requireOrgAdmin(userId, orgId)

    await prisma.orgInvitation.deleteMany({ where: { id: invId, organizationId: orgId } })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

// ── Delete org (OWNER only) ───────────────────────────────────────────────────
router.delete('/:orgId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const { orgId } = req.params

    const m = await prisma.orgMembership.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    })
    if (!m || m.role !== 'OWNER') throw createError('Only the owner can delete an org', 403)

    // Cascade delete memberships + invitations first
    await prisma.orgInvitation.deleteMany({ where: { organizationId: orgId } })
    await prisma.orgMembership.deleteMany({ where: { organizationId: orgId } })
    await prisma.organization.delete({ where: { id: orgId } })

    res.json({ ok: true })
  } catch (e) { next(e) }
})

export default router
