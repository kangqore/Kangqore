import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import { createError } from '../../middleware/errorHandler';
import { ZoomService } from '../../services/zoom.service';
import { sanitizeRedirectUrl } from '../../utils/security';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * GET /api/scheduling/zoom/status
 * Check if the current user has a connected Zoom account
 */
router.get('/status', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const integration = await prisma.zoomIntegration.findUnique({
      where: { userId: req.user.id },
      select: { id: true, accountId: true, syncStatus: true, createdAt: true }
    });
    res.json({ success: true, connected: !!integration && integration.syncStatus === 'ACTIVE', integration });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/zoom/connect
 * Redirect user to Zoom OAuth consent screen
 */
router.get('/connect', authenticate, (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    if (!process.env.ZOOM_CLIENT_ID || !process.env.ZOOM_CLIENT_SECRET) {
      return next(createError('Zoom integration is not configured', 501));
    }
    res.redirect(ZoomService.getAuthUrl(req.user.id));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/zoom/callback
 * Zoom OAuth callback
 */
router.get('/callback', async (req, res, next) => {
  try {
    const { code, state: userId, error } = req.query as Record<string, string>;

    if (error) {
      return res.redirect(sanitizeRedirectUrl(`${FRONTEND_URL}/kangqore-view/admin/settings/calendar?error=${encodeURIComponent(error)}`));
    }
    if (!code || !userId) {
      return res.redirect(sanitizeRedirectUrl(`${FRONTEND_URL}/kangqore-view/admin/settings/calendar?error=missing_params`));
    }

    await ZoomService.handleCallback(code, userId);
    res.redirect(sanitizeRedirectUrl(`${FRONTEND_URL}/kangqore-view/admin/settings/calendar?connected=zoom`));
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/scheduling/zoom/disconnect
 * Disconnect Zoom integration
 */
router.delete('/disconnect', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    await prisma.zoomIntegration.deleteMany({ where: { userId: req.user.id } });
    res.json({ success: true, message: 'Zoom disconnected' });
  } catch (error) {
    next(error);
  }
});

export default router;
