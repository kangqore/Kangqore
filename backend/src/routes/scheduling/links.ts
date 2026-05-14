import { Router, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../../lib/prisma';
import { createError } from '../../middleware/errorHandler';
import { authenticate, authorize, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Validation schemas
const linkSchema = Joi.object({
  eventTypeId: Joi.string().required(),
  slug: Joi.string().min(3).max(100).optional(),
  maxUses: Joi.number().integer().min(1).optional().allow(null),
  expiresAt: Joi.string().isoDate().optional().allow(null),
  prefillName: Joi.string().optional().allow(''),
  prefillEmail: Joi.string().email().optional().allow(''),
  prefillCompany: Joi.string().optional().allow('')
});

/**
 * GET /api/scheduling/links
 * List all scheduling links for current user
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const links = await prisma.schedulingLink.findMany({
      where: { ownerId: req.user.id },
      include: { eventType: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, links });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/links
 * Create new scheduling link
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = linkSchema.validate(req.body);
    if (error) throw createError(error.details[0].message, 400);

    const slug = value.slug || uuidv4().slice(0, 8);

    // Verify slug uniqueness
    const existing = await prisma.schedulingLink.findUnique({
      where: { slug }
    });
    if (existing) throw createError('This slug is already in use', 400);

    const link = await prisma.schedulingLink.create({
      data: {
        ...value,
        slug,
        ownerId: req.user.id
      },
      include: { eventType: true }
    });

    res.status(201).json({ success: true, link });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/scheduling/links/:id
 * Delete scheduling link
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const link = await prisma.schedulingLink.findUnique({
      where: { id: req.params.id }
    });

    if (!link || link.ownerId !== req.user.id) {
      throw createError('Link not found', 404);
    }

    await prisma.schedulingLink.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Link deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
