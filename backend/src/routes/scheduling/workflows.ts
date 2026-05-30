import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { authenticate as requireAuth } from '../../middleware/auth';

const router = Router();

// GET all workflows for the user's event types
router.get('/', requireAuth, async (req, res) => {
  try {
    const workflows = await prisma.workflow.findMany({
      where: {
        eventType: {
          hostId: req.user!.id
        }
      },
      include: {
        eventType: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, workflows });
  } catch (error: any) {
    console.error('Failed to get workflows:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST create a workflow
const createWorkflowSchema = z.object({
  eventTypeId: z.string(),
  trigger: z.enum(['ON_BOOKED', 'BEFORE_EVENT', 'AFTER_EVENT']),
  offsetMinutes: z.number().nullable(),
  action: z.enum(['SEND_EMAIL', 'SEND_SMS', 'CALL_WEBHOOK']),
  actionConfig: z.any().optional()
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { eventTypeId, trigger, offsetMinutes, action, actionConfig } = createWorkflowSchema.parse(req.body);

    // Verify ownership
    const eventType = await prisma.eventType.findFirst({
      where: { id: eventTypeId, hostId: req.user!.id }
    });

    if (!eventType) {
      return res.status(403).json({ success: false, error: 'Not authorized for this event type' });
    }

    const workflow = await prisma.workflow.create({
      data: {
        eventTypeId,
        trigger,
        offsetMinutes,
        action,
        actionConfig: actionConfig || {}
      }
    });

    res.json({ success: true, workflow });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: (error as any).errors });
    }
    console.error('Failed to create workflow:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE a workflow
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const workflowId = req.params.id;

    // Verify ownership
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        eventType: { hostId: req.user!.id }
      }
    });

    if (!workflow) {
      return res.status(404).json({ success: false, error: 'Workflow not found' });
    }

    await prisma.workflow.delete({
      where: { id: workflowId }
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete workflow:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
