import { Router, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import { createError } from '../../middleware/errorHandler';

const router = Router();

/**
 * GET /api/scheduling/accept-invite/:token/details
 * Fetch invitation details without accepting it
 */
router.get('/:token/details', async (req, res, next) => {
  try {
    const { token } = req.params;
    const invitation = await prisma.orgInvitation.findUnique({
      where: { token },
      include: { organization: true }
    });

    if (!invitation) throw createError('Invitation not found', 404);
    if (invitation.status === 'ACCEPTED') throw createError('Invitation already accepted', 400);
    if (new Date() > invitation.expiresAt) throw createError('Invitation expired', 400);

    res.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        organizationName: invitation.organization.name
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/accept-invite/:token
 * Accept the invitation and create OrgMembership
 */
router.post('/:token', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401);
    
    const { token } = req.params;
    const invitation = await prisma.orgInvitation.findUnique({
      where: { token }
    });

    if (!invitation) throw createError('Invitation not found', 404);
    if (invitation.status === 'ACCEPTED') throw createError('Invitation already accepted', 400);
    if (new Date() > invitation.expiresAt) throw createError('Invitation expired', 400);

    await prisma.$transaction([
      prisma.orgMembership.upsert({
        where: {
          organizationId_userId: {
            organizationId: invitation.organizationId,
            userId: req.user.id
          }
        },
        update: {
          role: invitation.role
        },
        create: {
          organizationId: invitation.organizationId,
          userId: req.user.id,
          role: invitation.role
        }
      }),
      prisma.orgInvitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' }
      })
    ]);

    res.json({ success: true, message: 'Invitation accepted' });
  } catch (error) {
    next(error);
  }
});

export default router;
