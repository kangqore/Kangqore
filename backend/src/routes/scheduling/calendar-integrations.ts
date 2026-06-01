import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import { createError } from '../../middleware/errorHandler';
import { CalendarSyncService } from '../../services/calendarSync.service';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * GET /api/scheduling/calendar-integrations
 * List calendar integrations for the current user (tokens omitted)
 */
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const integrations = await prisma.calendarIntegration.findMany({
      where: { userId: req.user.id }
    });
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
 * GET /api/scheduling/calendar-integrations/connect/google
 * Redirect user to Google OAuth consent screen
 */
router.get('/connect/google', authenticate, (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return next(createError('Google Calendar integration is not configured', 501));
    }
    const url = CalendarSyncService.getGoogleAuthUrl(req.user.id);
    res.redirect(url);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/calendar-integrations/callback/google
 * Google OAuth callback — exchanges code for tokens and saves integration
 */
router.get('/callback/google', async (req, res, next) => {
  try {
    const { code, state: userId, error } = req.query as Record<string, string>;

    if (error) {
      return res.redirect(`${FRONTEND_URL}/dashboard/calendar?error=${encodeURIComponent(error)}`);
    }
    if (!code || !userId) {
      return res.redirect(`${FRONTEND_URL}/dashboard/calendar?error=missing_params`);
    }

    await CalendarSyncService.handleGoogleCallback(code, userId);
    res.redirect(`${FRONTEND_URL}/dashboard/calendar?connected=google`);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/calendar-integrations/connect/outlook
 * Redirect user to Microsoft OAuth consent screen
 */
router.get('/connect/outlook', authenticate, (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_CLIENT_SECRET) {
      return next(createError('Outlook Calendar integration is not configured', 501));
    }
    const url = CalendarSyncService.getOutlookAuthUrl(req.user.id);
    res.redirect(url);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/calendar-integrations/callback/outlook
 * Outlook OAuth callback — exchanges code for tokens and saves integration
 */
router.get('/callback/outlook', async (req, res, next) => {
  try {
    const { code, state: userId, error } = req.query as Record<string, string>;

    if (error) {
      return res.redirect(`${FRONTEND_URL}/dashboard/calendar?error=${encodeURIComponent(error)}`);
    }
    if (!code || !userId) {
      return res.redirect(`${FRONTEND_URL}/dashboard/calendar?error=missing_params`);
    }

    await CalendarSyncService.handleOutlookCallback(code, userId);
    res.redirect(`${FRONTEND_URL}/dashboard/calendar?connected=outlook`);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/scheduling/calendar-integrations/:id
 * Disconnect a calendar integration
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);

    const integration = await prisma.calendarIntegration.findUnique({
      where: { id: req.params.id }
    });

    if (!integration) throw createError('Integration not found', 404);
    if (integration.userId !== req.user.id) throw createError('Unauthorized', 403);

    await prisma.calendarIntegration.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Calendar disconnected' });
  } catch (error) {
    next(error);
  }
});

export default router;
