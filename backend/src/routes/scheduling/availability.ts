import { Router, Response, NextFunction, Request } from 'express';
import Joi from 'joi';
import { prisma } from '../../lib/prisma';
import { createError } from '../../middleware/errorHandler';
import { authenticate, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import { AvailabilityService } from '../../services/availability.service';
import { startOfDay, endOfDay, addDays, parseISO } from 'date-fns';

const router = Router();

const scheduleSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  timezone: Joi.string().required(),
  isDefault: Joi.boolean().default(false),
  rules: Joi.array().items(
    Joi.object({
      day: Joi.number().integer().min(0).max(6).required(),
      startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
      endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required()
    })
  ).required(),
  overrides: Joi.array().items(
    Joi.object({
      date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
      available: Joi.boolean().required(),
      startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
      endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional()
    })
  ).optional().default([])
});

/**
 * GET /api/scheduling/availability/slots/:slug
 * Public — available time slots for a single day (used by booking widget)
 */
router.get('/slots/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { date, timezone, duration, hostId } = req.query;

    const eventType = await prisma.eventType.findUnique({
      where: { slug, isActive: true, isPublic: true }
    });

    if (!eventType) throw createError('Event type not found', 404);

    const startDate = date ? startOfDay(parseISO(date as string)) : startOfDay(new Date());

    const slots = await AvailabilityService.getAvailableSlots(
      eventType.id,
      startDate,
      addDays(startDate, 1),
      (timezone as string) || 'UTC',
      duration ? parseInt(duration as string) : undefined,
      hostId as string
    );

    res.json({ success: true, slots });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/availability/dates/:slug
 * Public — per-day availability summary for date picker.
 * Returns availableCount per day so frontend can show which days have slots.
 * Query params: days (default 30), timezone
 */
router.get('/dates/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { timezone, days, duration, hostId } = req.query;

    const eventType = await prisma.eventType.findUnique({
      where: { slug, isActive: true, isPublic: true }
    });

    if (!eventType) throw createError('Event type not found', 404);

    const rangeDays = Math.min(parseInt(days as string) || 30, eventType.maxAdvanceDays);
    const rangeStart = startOfDay(new Date());

    const dateAvailability = await AvailabilityService.getDateAvailability(
      eventType.id,
      rangeStart,
      rangeDays,
      (timezone as string) || 'UTC',
      duration ? parseInt(duration as string) : undefined,
      hostId as string
    );

    res.json({ success: true, dates: dateAvailability, maxAdvanceDays: eventType.maxAdvanceDays });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/availability/summary/:slug
 * Public — real-time availability pulse (used by InlineSchedulingCard)
 */
router.get('/summary/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { timezone } = req.query;

    const eventType = await prisma.eventType.findUnique({
      where: { slug, isActive: true, isPublic: true }
    });

    if (!eventType) throw createError('Event type not found', 404);

    const now = new Date();
    const weekStart = startOfDay(now);
    const weekEnd = addDays(weekStart, 7);

    const slots = await AvailabilityService.getAvailableSlots(
      eventType.id,
      weekStart,
      weekEnd,
      (timezone as string) || 'UTC'
    );

    const availableSlots = slots.filter(s => s.isAvailable);
    const futureSlots = availableSlots.filter(s => new Date(s.startTime) > now);
    const nextSlot = futureSlots.length > 0 ? futureSlots[0] : null;

    let nextAvailable = null;
    if (nextSlot) {
      const slotDate = new Date(nextSlot.startTime);
      const isToday = startOfDay(slotDate).getTime() === startOfDay(now).getTime();
      const isTomorrow = startOfDay(slotDate).getTime() === startOfDay(addDays(now, 1)).getTime();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : dayNames[slotDate.getDay()];
      const hours = slotDate.getHours();
      const mins = slotDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayH = hours > 12 ? hours - 12 : hours || 12;
      nextAvailable = {
        date: slotDate.toISOString(),
        time: `${displayH}:${String(mins).padStart(2, '0')} ${ampm}`,
        dayLabel
      };
    }

    res.json({
      success: true,
      slotsThisWeek: availableSlots.length,
      nextAvailable,
      refreshedAt: now.toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/availability
 * List current user's availability schedules (authenticated)
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const schedules = await prisma.availabilitySchedule.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' }
    });
    res.json({ success: true, schedules });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/availability
 * Create new availability schedule
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { error, value } = scheduleSchema.validate(req.body);
    if (error) throw createError(error.details[0].message, 400);

    if (value.isDefault) {
      await prisma.availabilitySchedule.updateMany({
        where: { userId: req.user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    const schedule = await prisma.availabilitySchedule.create({
      data: { ...value, userId: req.user.id }
    });

    res.status(201).json({ success: true, schedule });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/scheduling/availability/:id
 * Update availability schedule
 */
router.put('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { error, value } = scheduleSchema.validate(req.body);
    if (error) throw createError(error.details[0].message, 400);

    const existing = await prisma.availabilitySchedule.findUnique({ where: { id: req.params.id } });

    if (!existing || existing.userId !== req.user.id) {
      throw createError('Schedule not found', 404);
    }

    if (value.isDefault && !existing.isDefault) {
      await prisma.availabilitySchedule.updateMany({
        where: { userId: req.user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    const schedule = await prisma.availabilitySchedule.update({
      where: { id: req.params.id },
      data: value
    });

    res.json({ success: true, schedule });
  } catch (error) {
    next(error);
  }
});

export default router;
