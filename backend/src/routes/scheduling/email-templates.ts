import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate } from '../../middleware/auth';
import { createError } from '../../middleware/errorHandler';

const router = Router();

// Get templates for a specific event type (or global)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { eventTypeId } = req.query;
    
    // If eventTypeId is provided, ensure user has access to it
    if (eventTypeId) {
      const eventType = await prisma.eventType.findUnique({ where: { id: String(eventTypeId) } });
      if (!eventType || (eventType.hostId !== req.user?.id && req.user?.role !== 'ADMIN')) {
        throw createError('Unauthorized', 403);
      }
    }

    const templates = await prisma.emailTemplate.findMany({
      where: {
        eventTypeId: eventTypeId ? String(eventTypeId) : null
      }
    });

    res.json({ success: true, templates });
  } catch (error) {
    next(error);
  }
});

// Create or update a template
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { eventTypeId, type, subject, bodyHtml } = req.body;
    
    if (eventTypeId) {
      const eventType = await prisma.eventType.findUnique({ where: { id: String(eventTypeId) } });
      if (!eventType || (eventType.hostId !== req.user?.id && req.user?.role !== 'ADMIN')) {
        throw createError('Unauthorized', 403);
      }
    } else if (req.user?.role !== 'ADMIN') {
       throw createError('Only admins can create global templates', 403);
    }

    const template = await prisma.emailTemplate.upsert({
      where: {
        eventTypeId_type: {
          eventTypeId: eventTypeId || null,
          type
        }
      },
      update: {
        subject,
        bodyHtml
      },
      create: {
        eventTypeId: eventTypeId || null,
        type,
        subject,
        bodyHtml
      }
    });

    res.json({ success: true, template });
  } catch (error) {
    next(error);
  }
});

// Update a template (subject + bodyHtml)
router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const { subject, bodyHtml } = req.body as { subject?: string; bodyHtml?: string }
    const existing = await prisma.emailTemplate.findUnique({ where: { id: req.params.id } })
    if (!existing) throw createError('Template not found', 404)
    if (existing.eventTypeId) {
      const et = await prisma.eventType.findUnique({ where: { id: existing.eventTypeId } })
      if (!et || (et.hostId !== req.user?.id && req.user?.role !== 'ADMIN')) throw createError('Unauthorized', 403)
    } else if (req.user?.role !== 'ADMIN') {
      throw createError('Only admins can edit global templates', 403)
    }
    const updated = await prisma.emailTemplate.update({
      where: { id: req.params.id },
      data: {
        ...(subject   !== undefined && { subject }),
        ...(bodyHtml  !== undefined && { bodyHtml }),
      },
    })
    res.json({ success: true, template: updated })
  } catch (error) { next(error) }
})

// Delete a template
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const template = await prisma.emailTemplate.findUnique({ where: { id: req.params.id } });
    if (!template) {
      throw createError('Template not found', 404);
    }

    if (template.eventTypeId) {
      const eventType = await prisma.eventType.findUnique({ where: { id: template.eventTypeId } });
      if (!eventType || (eventType.hostId !== req.user?.id && req.user?.role !== 'ADMIN')) {
        throw createError('Unauthorized', 403);
      }
    } else if (req.user?.role !== 'ADMIN') {
       throw createError('Only admins can delete global templates', 403);
    }

    await prisma.emailTemplate.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
