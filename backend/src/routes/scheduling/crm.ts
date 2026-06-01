import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import { createError } from '../../middleware/errorHandler';
import { HubspotService } from '../../services/hubspot.service';
import { SalesforceService } from '../../services/salesforce.service';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * GET /api/scheduling/crm/status
 * Return connection status for all CRM providers
 */
router.get('/status', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const integrations = await prisma.cRMIntegration.findMany({
      where: { userId: req.user.id },
      select: { provider: true, accountId: true, syncStatus: true, createdAt: true }
    });
    const statusMap = Object.fromEntries(integrations.map(i => [i.provider, i]));
    res.json({ success: true, integrations: statusMap });
  } catch (error) {
    next(error);
  }
});

// ─── HubSpot ───────────────────────────────────────────────────────────────

router.get('/hubspot/connect', authenticate, (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    if (!process.env.HUBSPOT_CLIENT_ID || !process.env.HUBSPOT_CLIENT_SECRET) {
      return next(createError('HubSpot integration is not configured', 501));
    }
    res.redirect(HubspotService.getAuthUrl(req.user.id));
  } catch (error) { next(error); }
});

router.get('/hubspot/callback', async (req, res, next) => {
  try {
    const { code, state: userId, error } = req.query as Record<string, string>;
    if (error) return res.redirect(`${FRONTEND_URL}/dashboard/calendar?error=${encodeURIComponent(error)}`);
    if (!code || !userId) return res.redirect(`${FRONTEND_URL}/dashboard/calendar?error=missing_params`);
    await HubspotService.handleCallback(code, userId);
    res.redirect(`${FRONTEND_URL}/dashboard/calendar?connected=hubspot`);
  } catch (error) { next(error); }
});

router.delete('/hubspot/disconnect', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    await prisma.cRMIntegration.deleteMany({ where: { userId: req.user.id, provider: 'hubspot' } });
    res.json({ success: true, message: 'HubSpot disconnected' });
  } catch (error) { next(error); }
});

// ─── Salesforce ────────────────────────────────────────────────────────────

router.get('/salesforce/connect', authenticate, (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
      return next(createError('Salesforce integration is not configured', 501));
    }
    res.redirect(SalesforceService.getAuthUrl(req.user.id));
  } catch (error) { next(error); }
});

router.get('/salesforce/callback', async (req, res, next) => {
  try {
    const { code, state: userId, error } = req.query as Record<string, string>;
    if (error) return res.redirect(`${FRONTEND_URL}/dashboard/calendar?error=${encodeURIComponent(error)}`);
    if (!code || !userId) return res.redirect(`${FRONTEND_URL}/dashboard/calendar?error=missing_params`);
    await SalesforceService.handleCallback(code, userId);
    res.redirect(`${FRONTEND_URL}/dashboard/calendar?connected=salesforce`);
  } catch (error) { next(error); }
});

router.delete('/salesforce/disconnect', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    await prisma.cRMIntegration.deleteMany({ where: { userId: req.user.id, provider: 'salesforce' } });
    res.json({ success: true, message: 'Salesforce disconnected' });
  } catch (error) { next(error); }
});

export default router;
