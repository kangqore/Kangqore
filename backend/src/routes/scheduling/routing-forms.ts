import { Router, Response, NextFunction, Request } from 'express';
import Joi from 'joi';
import { prisma } from '../../lib/prisma';
import { createError } from '../../middleware/errorHandler';
import { authenticate, authorize, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';

const router = Router();

// Validation schemas
const routingFormSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  slug: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(1000).optional().allow(''),
  questions: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      label: Joi.string().required(),
      type: Joi.string().valid('text', 'select', 'radio').required(),
      options: Joi.array().items(Joi.string()).optional(),
      required: Joi.boolean().default(false)
    })
  ).required(),
  routingRules: Joi.array().items(
    Joi.object({
      conditions: Joi.array().items(
        Joi.object({
          questionId: Joi.string().required(),
          operator: Joi.string().valid('eq', 'contains').required(),
          value: Joi.any().required()
        })
      ).required(),
      eventTypeId: Joi.string().required()
    })
  ).required(),
  fallbackEventTypeId: Joi.string().optional().allow(null),
  isActive: Joi.boolean().default(true)
});

/**
 * GET /api/scheduling/routing-forms
 * List all routing forms for current user
 */
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const forms = await prisma.routingForm.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, forms });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/routing-forms/:slug
 * Public endpoint to get form details
 */
router.get('/:slug', async (req: Request, res, next) => {
  try {
    const form = await prisma.routingForm.findUnique({
      where: { slug: req.params.slug, isActive: true }
    });

    if (!form) throw createError('Form not found', 404);

    res.json({ success: true, form });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/routing-forms/:slug/submit
 * Public endpoint to submit form and get routed event type
 */
router.post('/:slug/submit', async (req: Request, res, next) => {
  try {
    const { answers, name, email } = req.body;
    const form = await prisma.routingForm.findUnique({
      where: { slug: req.params.slug, isActive: true }
    });

    if (!form) throw createError('Form not found', 404);

    // Evaluate routing rules
    let routedEventTypeId = form.fallbackEventTypeId;
    const rules = form.routingRules as any[];

    for (const rule of rules) {
      const match = rule.conditions.every((cond: any) => {
        const answer = answers[cond.questionId];
        if (cond.operator === 'eq') return answer === cond.value;
        if (cond.operator === 'contains') return Array.isArray(answer) && answer.includes(cond.value);
        return false;
      });

      if (match) {
        routedEventTypeId = rule.eventTypeId;
        break;
      }
    }

    // Save submission
    const submission = await prisma.routingFormSubmission.create({
      data: {
        routingFormId: form.id,
        answers,
        submitterName: name,
        submitterEmail: email,
        routedToEventTypeId: routedEventTypeId
      }
    });

    // Get routed event type slug for redirect
    let targetSlug = null;
    if (routedEventTypeId) {
      const et = await prisma.eventType.findUnique({ where: { id: routedEventTypeId } });
      targetSlug = et?.slug;
    }

    res.json({ success: true, targetSlug, submissionId: submission.id });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/routing-forms
 * Create new routing form
 */
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { error, value } = routingFormSchema.validate(req.body);
    if (error) throw createError(error.details[0].message, 400);

    const form = await prisma.routingForm.create({
      data: {
        ...value,
        ownerId: req.user.id
      }
    });

    res.status(201).json({ success: true, form });
  } catch (error) {
    next(error);
  }
});

export default router;
