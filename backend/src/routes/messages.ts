import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/rbac';
import { createError } from '../middleware/errorHandler';
import { notifyNewMessage } from '../kangqore-view/awareness/notifications/NotificationService';
import { emitToUser, emitToAdmins } from '../socket';
import Joi from 'joi';

const router = Router();

const messageSchema = Joi.object({
  content: Joi.string().required(),
  receiverId: Joi.string().optional().allow(null),
  attachments: Joi.array().items(Joi.string()).optional(),
  contextType: Joi.string().optional(),
  contextId: Joi.string().optional(),
  tags: Joi.object().optional() // JSON object for tags
});

/**
 * GET /api/messages
 * Get message history for the current user
 */
router.get('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { contextType, contextId } = req.query;

    const where: any = {
      OR: [
        { senderId: userId },
        { receiverId: userId },
        { senderId: userId, receiverId: null as any }
      ]
    };

    // If context filters are provided, strict filter
    if (contextType && contextId) {
        where.contextType = contextType as string;
        where.contextId = contextId as string;
        
        // Remove the OR constraint strictly if filtering by context? 
        // Or keep it to ensure security (only my messages in that context)?
        // Keeping OR ensures I only see messages I am part of, even if I have context link.
        // Actually, for "Context View" (e.g. Risk), maybe I should see ALL messages on that Risk if I have access to the Risk?
        // For now, let's keep it scoped to User's message stream to be safe.
        // If "Team Chat" on a Risk is needed, we need broader permission logic (e.g. Project Members).
        // Let's assume standard message rules apply + Context filter.
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true, role: true }
        },
        receiver: {
          select: { id: true, name: true, avatarUrl: true, role: true }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({ messages });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/messages/admin/conversations
 * (Admin Only) Get all conversations grouped by user
 */
router.get('/admin/conversations', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (req.user!.role !== 'ADMIN') {
             throw createError('Unauthorized', 403);
        }

        // Fetch all distinct users who have participated in messages (sender or receiver)
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { receiverId: null as any }, // Message sent TO admin
                    { senderId: req.user!.userId } // Message sent BY admin
                ]
            },
            include: {
                sender: { select: { id: true, name: true, avatarUrl: true, role: true } },
                receiver: { select: { id: true, name: true, avatarUrl: true, role: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Group by the "Other User"
        const conversationsMap = new Map();
        
        messages.forEach(msg => {
             const isAdminSender = msg.senderId === req.user!.userId;
             const otherUser = isAdminSender ? msg.receiver : msg.sender;
             
             if (!otherUser) return;

             if (!conversationsMap.has(otherUser.id)) {
                 conversationsMap.set(otherUser.id, {
                     user: otherUser,
                     lastMessage: msg,
                     unreadCount: 0
                 });
             }
             
             // Count unread (only incoming messages)
             if (!isAdminSender && !msg.isRead) {
                 conversationsMap.get(otherUser.id).unreadCount++;
             }
        });

        const conversations = Array.from(conversationsMap.values());
        res.json({ conversations });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/messages/admin/:targetUserId
 * (Admin Only) Get full conversation with a specific user
 */
router.get('/admin/:targetUserId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (req.user!.role !== 'ADMIN') {
             throw createError('Unauthorized', 403);
        }
        
        const { targetUserId } = req.params;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    // Client sent to Admin (null)
                    { senderId: targetUserId, receiverId: null as any },
                    // Admin sent to Client
                    { senderId: req.user!.userId, receiverId: targetUserId },
                    // Admin sent to Client (historical check if multiple admins exist, might need adjustment)
                ]
            },
            include: {
                sender: { select: { id: true, name: true, avatarUrl: true, role: true } },
                receiver: { select: { id: true, name: true, avatarUrl: true, role: true } }
            },
            orderBy: { createdAt: 'asc' }
        });
        
        res.json({ messages });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/messages
 * Send a message
 * - Client -> Admin (receiverId: null)
 * - Admin -> Client (receiverId: valid userId)
 */
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const senderId = req.user!.userId;
    const userRole = req.user!.role;

    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { content, attachments, receiverId, contextType, contextId, tags } = value;
    
    // Determine actual receiver based on role
    let finalReceiverId: string | null = null;

    if (userRole === 'ADMIN') {
        if (!receiverId) {
             throw createError('Admin must specify a receiverId', 400);
        }
        finalReceiverId = receiverId;
    } else {
        // Clients can only send to Admin (null)
        finalReceiverId = null; 
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId: finalReceiverId as any,
        attachments: (attachments || []) as any,
        isRead: false,
        // Context Mapping
        contextType,
        contextId,
        tags
      } as any,
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true, role: true }
        },
        receiver: {
          select: { id: true, name: true, avatarUrl: true, role: true }
        }
      }
    });

    // Emit real-time message via Socket.io
    try {
      if (userRole === 'ADMIN' && finalReceiverId) {
        // Admin sending to specific user
        emitToUser(finalReceiverId, 'message:new', message);
      } else {
        // Client sending to admin (null receiver = all admins)
        emitToAdmins('message:new', message);
      }
    } catch (socketError) {
      console.warn('Could not emit real-time message:', socketError);
    }

    // Create notifications
    if (userRole === 'ADMIN' && finalReceiverId) {
      // Notify the specific user when Admin sends a message to them
      const recipient = await prisma.user.findUnique({ where: { id: finalReceiverId }, select: { role: true } });
      if (recipient) {
        await notifyNewMessage(finalReceiverId, req.user!.name || 'Admin', recipient.role.toLowerCase());
      }
    } else if (userRole !== 'ADMIN') {
      // Notify ALL admins when a client/user sends a message
      console.log('🔔 Creating notification for admins - user sent message');
      const admins = await prisma.user.findMany({ 
        where: { role: 'ADMIN' }, 
        select: { id: true, name: true } 
      });
      console.log('🔔 Found admins:', admins);
      const senderName = req.user!.name || 'A user';
      for (const admin of admins) {
        console.log(`🔔 Creating notification for admin: ${admin.name} (${admin.id})`);
        const result = await notifyNewMessage(admin.id, senderName, 'admin');
        console.log('🔔 Notification created:', result);
      }
    }

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
});

export default router;
