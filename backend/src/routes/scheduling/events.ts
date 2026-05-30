import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../../lib/prisma';
import { createError } from '../../middleware/errorHandler';
import { authenticate, authorize, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import { SchedulingService } from '../../services/scheduling.service';

const router = Router();

const bookingSchema = Joi.object({
  eventTypeId: Joi.string().required(),
  startTime: Joi.string().isoDate().required(),
  invitee: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional().allow(''),
    company: Joi.string().optional().allow(''),
    timezone: Joi.string().optional().default('UTC'),
    responses: Joi.object().optional()
  }).required(),
  schedulingLinkId: Joi.string().optional()
});

/**
 * POST /api/scheduling/events
 * Public endpoint to book a new event
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = bookingSchema.validate(req.body);
    if (error) throw createError(error.details[0].message, 400);

    const event = await SchedulingService.bookEvent(value);
    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/events/cancel-by-token
 * Public endpoint — cancel a booking using the cancel token from confirmation email
 */
router.post('/cancel-by-token', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, reason } = req.body;
    if (!token) throw createError('Cancel token is required', 400);

    const event = await SchedulingService.cancelByToken(token, reason);
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/events/reschedule/:token
 * Public — get event details to display in the reschedule UI
 */
router.get('/reschedule/:token', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await SchedulingService.getEventByRescheduleToken(req.params.token);
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/events/reschedule/:token
 * Public — reschedule a booking to a new time slot
 */
router.post('/reschedule/:token', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newStartTime } = req.body;
    if (!newStartTime) throw createError('newStartTime is required', 400);

    const event = await SchedulingService.rescheduleByToken(req.params.token, newStartTime);
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/events/public/:id
 * Public — get event details by ID for the confirmation page
 */
router.get('/public/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await prisma.scheduledEvent.findUnique({
      where: { id: req.params.id },
      include: {
        eventType: { select: { name: true, duration: true } },
        host: { select: { name: true, email: true } },
        invitees: { select: { name: true, email: true, timezone: true } }
      }
    });

    if (!event) throw createError('Event not found', 404);

    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/events
 * List events for current user
 */
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const events = await prisma.scheduledEvent.findMany({
      where: { hostId: req.user.id },
      include: { invitees: true, eventType: true },
      orderBy: { startTime: 'asc' }
    });
    res.json({ success: true, events });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/events/:id
 * Get event details
 */
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const event = await prisma.scheduledEvent.findUnique({
      where: { id: req.params.id },
      include: {
        invitees: true,
        eventType: true,
        host: { select: { id: true, name: true, email: true } }
      }
    });

    if (!event) throw createError('Event not found', 404);
    if (event.hostId !== req.user.id && req.user.role !== 'ADMIN') {
      throw createError('Unauthorized', 403);
    }

    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/events/:id/cancel
 * Cancel event (authenticated — host/admin)
 */
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { reason } = req.body;
    const event = await prisma.scheduledEvent.findUnique({ where: { id: req.params.id } });

    if (!event) throw createError('Event not found', 404);
    if (event.hostId !== req.user.id && req.user.role !== 'ADMIN') {
      throw createError('Unauthorized', 403);
    }

    const updated = await SchedulingService.cancelEvent(req.params.id, reason, 'host');
    res.json({ success: true, event: updated });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/events/:id/invitees
 * List event invitees
 */
router.get('/:id/invitees', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const event = await prisma.scheduledEvent.findUnique({ where: { id: req.params.id } });

    if (!event || (event.hostId !== req.user.id && req.user.role !== 'ADMIN')) {
      throw createError('Unauthorized', 403);
    }

    const invitees = await prisma.eventInvitee.findMany({ where: { eventId: req.params.id } });
    res.json({ success: true, invitees });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/events/:id/no-show
 * Mark invitee as no-show
 */
router.post('/:id/no-show', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { inviteeId } = req.body;
    const event = await prisma.scheduledEvent.findUnique({ where: { id: req.params.id } });

    if (!event || (event.hostId !== req.user.id && req.user.role !== 'ADMIN')) {
      throw createError('Unauthorized', 403);
    }

    const noShow = await prisma.inviteeNoShow.create({
      data: { eventId: req.params.id, inviteeId, createdBy: req.user.id }
    });

    await prisma.scheduledEvent.update({
      where: { id: req.params.id },
      data: { status: 'NO_SHOW' }
    });

    res.json({ success: true, noShow });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/scheduling/events/:id/no-show
 * Undo no-show
 */
router.delete('/:id/no-show', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const event = await prisma.scheduledEvent.findUnique({ where: { id: req.params.id } });

    if (!event || (event.hostId !== req.user.id && req.user.role !== 'ADMIN')) {
      throw createError('Unauthorized', 403);
    }

    await prisma.inviteeNoShow.deleteMany({ where: { eventId: req.params.id } });
    await prisma.scheduledEvent.update({ where: { id: req.params.id }, data: { status: 'ACTIVE' } });
    res.json({ success: true, message: 'No-show removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
