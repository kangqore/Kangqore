import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { authenticate as requireAuth } from '../../middleware/auth';

const router = Router();

// GET all webhooks for the user's event types
router.get('/', requireAuth, async (req, res) => {
  try {
    const webhooks = await prisma.webhook.findMany({
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

    res.json({ success: true, webhooks });
  } catch (error: any) {
    console.error('Failed to get webhooks:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST create a webhook
const createWebhookSchema = z.object({
  eventTypeId: z.string(),
  url: z.string().url(),
  secret: z.string().optional()
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { eventTypeId, url, secret } = createWebhookSchema.parse(req.body);

    // Verify ownership
    const eventType = await prisma.eventType.findFirst({
      where: { id: eventTypeId, hostId: req.user!.id }
    });

    if (!eventType) {
      return res.status(403).json({ success: false, error: 'Not authorized for this event type' });
    }

    const webhook = await prisma.webhook.create({
      data: {
        eventTypeId,
        url,
        secret
      }
    });

    res.json({ success: true, webhook });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: (error as any).errors });
    }
    console.error('Failed to create webhook:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET webhook deliveries
router.get('/:id/deliveries', requireAuth, async (req, res) => {
  try {
    const webhookId = req.params.id;

    // Verify ownership
    const webhook = await prisma.webhook.findFirst({
      where: {
        id: webhookId,
        eventType: { hostId: req.user!.id }
      }
    });

    if (!webhook) {
      return res.status(404).json({ success: false, error: 'Webhook not found' });
    }

    const deliveries = await prisma.webhookDelivery.findMany({
      where: { webhookId },
      orderBy: { requestTime: 'desc' },
      take: 50
    });

    res.json({ success: true, deliveries });
  } catch (error: any) {
    console.error('Failed to get webhook deliveries:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE a webhook
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const webhookId = req.params.id;

    // Verify ownership
    const webhook = await prisma.webhook.findFirst({
      where: {
        id: webhookId,
        eventType: { hostId: req.user!.id }
      }
    });

    if (!webhook) {
      return res.status(404).json({ success: false, error: 'Webhook not found' });
    }

    await prisma.webhook.delete({
      where: { id: webhookId }
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete webhook:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
