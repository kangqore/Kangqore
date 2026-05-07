import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const subscribeSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().max(100).optional(),
  source: Joi.string().max(50).optional()
});

// POST /api/newsletter/subscribe - Public endpoint
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { error, value } = subscribeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, name, source } = value;

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Re-subscribe
        await prisma.subscriber.update({
          where: { email },
          data: { 
            status: 'active',
            name: name || existing.name,
            source: source || existing.source,
            notifyNewContent: true
          }
        });
        return res.json({ message: 'Welcome back! You have been re-subscribed.' });
      }
      return res.json({ message: 'You are already subscribed!' });
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email,
        name,
        source: source || 'website'
      }
    });

    res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// POST /api/newsletter/unsubscribe - Unsubscribe by token (from email link)
router.post('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { token, email } = req.body;

    let subscriber;
    
    if (token) {
      subscriber = await prisma.subscriber.findUnique({
        where: { unsubscribeToken: token }
      });
    } else if (email) {
      subscriber = await prisma.subscriber.findUnique({
        where: { email }
      });
    }

    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { status: 'unsubscribed' }
    });

    res.json({ message: 'Successfully unsubscribed from the newsletter.' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// GET /api/newsletter/unsubscribe/:token - Unsubscribe via GET (for email links)
router.get('/unsubscribe/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const subscriber = await prisma.subscriber.findUnique({
      where: { unsubscribeToken: token }
    });

    if (!subscriber) {
      return res.status(404).send('<h1>Invalid unsubscribe link</h1>');
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { status: 'unsubscribed' }
    });

    res.send(`
      <html>
        <head><title>Unsubscribed</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>✅ Unsubscribed</h1>
          <p>You have been unsubscribed from Kangqore newsletter.</p>
          <p><a href="/">Return to website</a></p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).send('<h1>Error</h1><p>Failed to unsubscribe</p>');
  }
});

// ============ ADMIN ROUTES ============

// GET /api/admin/newsletter/subscribers - List all subscribers
router.get('/admin/subscribers', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { status, page = '1', limit = '50' } = req.query;
    
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string)
      }),
      prisma.subscriber.count({ where })
    ]);

    res.json({
      subscribers,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// GET /api/admin/newsletter/stats - Subscriber statistics
router.get('/admin/stats', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const [total, active, unsubscribed, thisMonth] = await Promise.all([
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { status: 'active' } }),
      prisma.subscriber.count({ where: { status: 'unsubscribed' } }),
      prisma.subscriber.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    res.json({
      total,
      active,
      unsubscribed,
      thisMonth
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// DELETE /api/admin/newsletter/subscribers/:id - Delete subscriber
router.delete('/admin/subscribers/:id', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.subscriber.delete({
      where: { id }
    });

    res.json({ message: 'Subscriber deleted' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
});

export default router;
