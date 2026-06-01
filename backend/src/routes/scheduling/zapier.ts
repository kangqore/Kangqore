import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import { createError } from '../../middleware/errorHandler';
import crypto from 'crypto';

const router = Router();

/**
 * Zapier REST Hook integration.
 *
 * Zapier's "REST Hooks" pattern:
 *   - POST /subscribe   → Zapier sends a target URL; we store it as a webhook
 *   - DELETE /subscribe → Zapier deregisters the hook
 *   - GET  /sample      → Zapier fetches example payload to map fields
 *
 * Auth: Zapier passes the user's API key in `X-Api-Key` header.
 * We resolve the user from that key and scope all hooks to them.
 *
 * Supported triggers (maps to our existing webhook event system):
 *   booking.created | booking.cancelled | booking.rescheduled | booking.no_show
 */

const ALLOWED_EVENTS = ['booking.created', 'booking.cancelled', 'booking.rescheduled', 'booking.no_show'];

async function resolveUserFromApiKey(req: AuthRequest): Promise<string | null> {
  // Support both Bearer token (dashboard) and X-Api-Key header (Zapier)
  const apiKey = req.headers['x-api-key'] as string;
  if (apiKey) {
    const user = await prisma.user.findFirst({ where: { customId: apiKey } });
    return user?.id || null;
  }
  return req.user?.id || null;
}

/**
 * POST /api/scheduling/zapier/subscribe
 * Body: { hookUrl, event }
 * Zapier calls this when a user turns on a Zap.
 */
router.post('/subscribe', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = await resolveUserFromApiKey(req);
    if (!userId) throw createError('Unauthorized', 401);

    const { hookUrl, event } = req.body;

    if (!hookUrl || !hookUrl.startsWith('https://')) {
      throw createError('hookUrl must be a valid HTTPS URL', 400);
    }
    if (!event || !ALLOWED_EVENTS.includes(event)) {
      throw createError(`event must be one of: ${ALLOWED_EVENTS.join(', ')}`, 400);
    }

    // Reuse our existing Webhook model — Zapier hooks are just webhooks with a zapier flag
    const secret = crypto.randomBytes(20).toString('hex');

    const webhook = await prisma.webhook.create({
      data: {
        userId,
        url: hookUrl,
        secret,
        events: [event],
        isActive: true,
        description: `Zapier: ${event}`
      }
    });

    res.status(201).json({ id: webhook.id, hookUrl, event });
  } catch (error) { next(error); }
});

/**
 * DELETE /api/scheduling/zapier/subscribe
 * Body: { id }  (the webhook ID we returned at subscribe time)
 * Zapier calls this when a user turns off a Zap.
 */
router.delete('/subscribe', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = await resolveUserFromApiKey(req);
    if (!userId) throw createError('Unauthorized', 401);

    const { id } = req.body;
    if (!id) throw createError('id is required', 400);

    const webhook = await prisma.webhook.findUnique({ where: { id } });
    if (!webhook || webhook.userId !== userId) throw createError('Webhook not found', 404);

    await prisma.webhook.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) { next(error); }
});

/**
 * GET /api/scheduling/zapier/sample/:event
 * Zapier fetches this to get an example payload for field mapping.
 */
router.get('/sample/:event', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { event } = req.params;
    if (!ALLOWED_EVENTS.includes(event)) throw createError('Unknown event', 400);

    const samples: Record<string, object> = {
      'booking.created': {
        id: 'evt_example123',
        title: 'Strategy Consultation with Jane Smith',
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime:   new Date(Date.now() + 86400000 + 1800000).toISOString(),
        timezone: 'America/New_York',
        joinUrl: 'https://meet.jit.si/kangqore-example',
        invitee: { name: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-0100', company: 'Acme Corp' }
      },
      'booking.cancelled': {
        id: 'evt_example123',
        title: 'Strategy Consultation with Jane Smith',
        cancelledAt: new Date().toISOString(),
        cancelReason: 'Schedule conflict',
        cancelledBy: 'invitee',
        invitee: { name: 'Jane Smith', email: 'jane@example.com' }
      },
      'booking.rescheduled': {
        id: 'evt_example456',
        title: 'Strategy Consultation with Jane Smith',
        startTime: new Date(Date.now() + 172800000).toISOString(),
        endTime:   new Date(Date.now() + 172800000 + 1800000).toISOString(),
        previousEventId: 'evt_example123',
        invitee: { name: 'Jane Smith', email: 'jane@example.com' }
      },
      'booking.no_show': {
        id: 'evt_example123',
        title: 'Strategy Consultation with Jane Smith',
        startTime: new Date(Date.now() - 3600000).toISOString(),
        markedAt: new Date().toISOString(),
        invitee: { name: 'Jane Smith', email: 'jane@example.com' }
      }
    };

    res.json([samples[event]]);
  } catch (error) { next(error); }
});

/**
 * GET /api/scheduling/zapier/events
 * Returns the list of supported trigger events (used by Zapier app config).
 */
router.get('/events', (_req, res) => {
  res.json({
    events: ALLOWED_EVENTS.map(e => ({
      key: e,
      label: e.split('.').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    }))
  });
});

export default router;
