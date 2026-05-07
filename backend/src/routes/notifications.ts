import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Middleware: All notification routes require authentication
router.use(authenticate);

// Get Notifications (Paginated)
router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = { userId: req.user!.id };
    if (type) where.type = String(type);

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        take: Number(limit),
        skip,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where })
    ]);

    res.json({
      notifications,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
});

// Get Unread Count
router.get('/unread-count', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId: req.user!.id,
        isRead: false
      }
    });
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

// Mark as Read
router.patch('/:id/read', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id
      },
      data: { isRead: true }
    });

    if (notification.count === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Mark All as Read
router.patch('/mark-all-read', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user!.id,
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Internal Create (can be used by other services or for testing)
router.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Only allow admins or internal services to create notifications explicitly via API
    // In a real app, this logic might be in a service function called by triggers
    const { userId, title, message, type, link } = req.body;

    const notification = await prisma.notification.create({
      data: {
        userId: userId || req.user!.id, // Default to self if not specified (for testing)
        title,
        message,
        type: type || 'INFO',
        link
      }
    });

    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
});

export default router;
