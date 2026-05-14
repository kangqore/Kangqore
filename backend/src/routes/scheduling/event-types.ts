import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../../lib/prisma';
import { createError } from '../../middleware/errorHandler';
import { authenticate, authorize, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import logger from '../../utils/logger';

const router = Router();

// Validation schemas
const eventTypeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  slug: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(1000).optional().allow(''),
  duration: Joi.number().integer().min(5).max(480).required(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#2564ea'),
  bufferBefore: Joi.number().integer().min(0).max(120).default(0),
  bufferAfter: Joi.number().integer().min(0).max(120).default(0),
  maxPerDay: Joi.number().integer().min(1).optional().allow(null),
  minNotice: Joi.number().integer().min(0).default(60),
  maxAdvanceDays: Joi.number().integer().min(1).default(30),
  isActive: Joi.boolean().default(true),
  isPublic: Joi.boolean().default(true),
  location: Joi.string().max(500).optional().allow(''),
  locationType: Joi.string().valid('VIDEO', 'IN_PERSON', 'PHONE', 'CUSTOM').default('VIDEO'),
  requirePhone: Joi.boolean().default(false),
  requireCompany: Joi.boolean().default(false),
  customQuestions: Joi.array().items(
    Joi.object({
      label: Joi.string().required(),
      type: Joi.string().valid('text', 'textarea', 'select', 'checkbox').required(),
      required: Joi.boolean().default(false),
      options: Joi.array().items(Joi.string()).optional()
    })
  ).optional().default([])
});

/**
 * GET /api/scheduling/event-types
 * List all event types for current user
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const eventTypes = await prisma.eventType.findMany({
      where: { hostId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, eventTypes });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/event-types/:slug
 * Get single event type by slug (public)
 */
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventType = await prisma.eventType.findUnique({
      where: { slug: req.params.slug, isActive: true, isPublic: true },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    if (!eventType) {
      throw createError('Event type not found or inactive', 404);
    }

    res.json({ success: true, eventType });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/event-types
 * Create new event type
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { error, value } = eventTypeSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    // Check if slug is unique
    const existing = await prisma.eventType.findUnique({
      where: { slug: value.slug }
    });

    if (existing) {
      throw createError('A scheduling link with this slug already exists', 400);
    }

    const eventType = await prisma.eventType.create({
      data: {
        ...value,
        hostId: req.user.id
      }
    });

    logger.info(`Event type created: ${eventType.id} by user ${req.user.id}`);
    res.status(201).json({ success: true, eventType });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/scheduling/event-types/:id
 * Update event type
 */
router.put('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { error, value } = eventTypeSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const eventType = await prisma.eventType.findUnique({
      where: { id: req.params.id }
    });

    if (!eventType) {
      throw createError('Event type not found', 404);
    }

    if (eventType.hostId !== req.user.id && req.user.role !== 'ADMIN') {
      throw createError('Unauthorized', 403);
    }

    // Check if new slug is unique (if changed)
    if (value.slug !== eventType.slug) {
      const existing = await prisma.eventType.findUnique({
        where: { slug: value.slug }
      });
      if (existing) {
        throw createError('A scheduling link with this slug already exists', 400);
      }
    }

    const updated = await prisma.eventType.update({
      where: { id: req.params.id },
      data: value
    });

    res.json({ success: true, eventType: updated });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/scheduling/event-types/:id
 * Soft delete event type
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const eventType = await prisma.eventType.findUnique({
      where: { id: req.params.id }
    });

    if (!eventType) {
      throw createError('Event type not found', 404);
    }

    if (eventType.hostId !== req.user.id && req.user.role !== 'ADMIN') {
      throw createError('Unauthorized', 403);
    }

    await prisma.eventType.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({ success: true, message: 'Event type deactivated' });
  } catch (error) {
    next(error);
  }
});

export default router;
