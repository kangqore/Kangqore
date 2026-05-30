import { Router, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import { createError } from '../../middleware/errorHandler';

const router = Router();

/**
 * GET /api/scheduling/calendar-integrations
 * List active calendar integrations for the current user
 */
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const integrations = await prisma.calendarIntegration.findMany({
      where: { userId: req.user.id }
    });
    // Don't expose tokens to the frontend
    const safeIntegrations = integrations.map(i => ({
      id: i.id,
      provider: i.provider,
      accountId: i.accountId,
      syncStatus: i.syncStatus,
      createdAt: i.createdAt
    }));
    res.json({ success: true, integrations: safeIntegrations });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/scheduling/calendar-integrations/:id
 * Remove a calendar integration
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    
    const integration = await prisma.calendarIntegration.findUnique({
      where: { id: req.params.id }
    });

    if (!integration) throw createError('Integration not found', 404);
    if (integration.userId !== req.user.id) throw createError('Unauthorized', 403);

    await prisma.calendarIntegration.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Integration removed successfully' });
  } catch (error) {
    next(error);
  }
});

// Note: OAuth connect/callback endpoints would go here
// e.g. /connect/google -> redirects to Google OAuth
//      /callback/google -> handles code, fetches tokens, saves to DB

export default router;
