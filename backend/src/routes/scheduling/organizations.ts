import { Router, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../../lib/prisma';
import { createError } from '../../middleware/errorHandler';
import { authenticate, authorize, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import { addDays } from 'date-fns';
import { emailService } from '../../kangqore-view/eaf/channels/EmailService';

const router = Router();

/**
 * GET /api/scheduling/org
 * Get user's organization
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const membership = await prisma.orgMembership.findFirst({
      where: { userId: req.user.id },
      include: { organization: true }
    });

    if (!membership) {
      return res.json({ success: true, organization: null });
    }

    res.json({ success: true, organization: membership.organization });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/org/members
 * List organization members
 */
router.get('/members', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const membership = await prisma.orgMembership.findFirst({
      where: { userId: req.user.id }
    });

    if (!membership) throw createError('Not part of an organization', 404);

    const members = await prisma.orgMembership.findMany({
      where: { organizationId: membership.organizationId },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } }
    });

    res.json({ success: true, members });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/org/invitations
 * Invite member to organization
 */
router.post('/invitations', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { email, role } = req.body;

    const membership = await prisma.orgMembership.findFirst({
      where: { userId: req.user.id, role: { in: ['OWNER', 'ADMIN'] } }
    });

    if (!membership) throw createError('Unauthorized to invite members', 403);

    const organization = await prisma.organization.findUnique({
      where: { id: membership.organizationId }
    });

    const invitation = await prisma.orgInvitation.create({
      data: {
        organizationId: membership.organizationId,
        email,
        role: role || 'MEMBER',
        expiresAt: addDays(new Date(), 7)
      }
    });

    const frontendUrl = process.env.CORS_ORIGINS?.split(',')[0] || 'https://kangqore.com';
    const acceptUrl = `${frontendUrl}/accept-invite/${invitation.id}`;
    const orgName = organization?.name || 'Kangqore';
    const inviterName = req.user!.name || 'A team member';

    await emailService.sendEmail({
      to: email,
      subject: `You've been invited to join ${orgName} on Kangqore`,
      text: `${inviterName} has invited you to join ${orgName} on Kangqore as a ${invitation.role}.\n\nAccept your invitation: ${acceptUrl}\n\nThis invitation expires in 7 days.`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
          <h2 style="margin:0 0 16px;color:#111827;">You've been invited to ${orgName}</h2>
          <p style="color:#6b7280;margin:0 0 8px;">${inviterName} has invited you to join <strong>${orgName}</strong> on Kangqore as a <strong>${invitation.role}</strong>.</p>
          <p style="color:#6b7280;margin:0 0 24px;">This invitation expires in 7 days.</p>
          <a href="${acceptUrl}" style="display:inline-block;padding:12px 24px;background:#2564ea;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;">Accept Invitation</a>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">Or copy this link: ${acceptUrl}</p>
        </div>
      `
    }).catch(err => {
      // Log but don't fail the request if email delivery fails
      console.error('Failed to send org invitation email:', err);
    });

    res.status(201).json({ success: true, invitation });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/scheduling/org/members/:id
 * Remove member from organization
 */
router.delete('/members/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const targetMembershipId = req.params.id;

    const myMembership = await prisma.orgMembership.findFirst({
      where: { userId: req.user.id, role: { in: ['OWNER', 'ADMIN'] } }
    });

    if (!myMembership) throw createError('Unauthorized', 403);

    const targetMembership = await prisma.orgMembership.findUnique({
      where: { id: targetMembershipId }
    });

    if (!targetMembership || targetMembership.organizationId !== myMembership.organizationId) {
      throw createError('Member not found in your organization', 404);
    }

    if (targetMembership.role === 'OWNER') {
      throw createError('Cannot remove the organization owner', 400);
    }

    await prisma.orgMembership.delete({
      where: { id: targetMembershipId }
    });

    res.json({ success: true, message: 'Member removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
