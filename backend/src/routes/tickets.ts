import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { notifyTicketUpdate } from '../kangqore-view/awareness/notifications/NotificationService';
import { notifyClient } from '../kangqore-view/eaf/channels/ClientEmailService';

const router = Router();

// GET /api/tickets (List own tickets)
router.get('/', authenticate, authorize(['CLIENT', 'ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const where: any = {};
    
    // Admins see all (filtered by query), Clients see only theirs
    if (req.user!.role === 'CLIENT') {
      where.clientId = req.user!.id;
    }
    
    if (status) {
      where.status = status;
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        client: { select: { name: true, email: true, company: true } },
        messages: {
          include: { sender: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ tickets });
  } catch (error) {
    next(error);
  }
});

// GET /api/tickets/:id (Detail view)
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
            client: { select: { id: true, name: true, company: true, avatarUrl: true } },
            messages: {
                include: {
                    sender: { select: { id: true, name: true, role: true, avatarUrl: true } }
                },
                orderBy: { createdAt: 'asc' }
            }
        }
      });
  
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      // Access Control
      if (req.user!.role !== 'ADMIN' && ticket.clientId !== req.user!.id) {
          return res.status(403).json({ message: 'Access denied' });
      }
  
      res.json(ticket);
    } catch (error) {
      next(error);
    }
});

// POST /api/tickets (Create ticket)
router.post('/', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { subject, category, priority, content, attachments } = req.body;

        if (!subject || !content) {
            throw createError('Subject and content are required', 400);
        }

        const ticket = await prisma.ticket.create({
            data: {
                subject,
                category,
                priority: priority || 'medium',
                clientId: req.user!.id,
                messages: {
                    create: {
                        content,
                        senderId: req.user!.id,
                        attachments
                    }
                }
            }
        });

        res.status(201).json(ticket);
    } catch (error) {
        next(error);
    }
});

// POST /api/tickets/:id/reply (Add message)
router.post('/:id/reply', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { content, attachments } = req.body;

        const ticket = await prisma.ticket.findUnique({ where: { id } });
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        // Access Check
        if (req.user!.role !== 'ADMIN' && ticket.clientId !== req.user!.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const message = await prisma.ticketMessage.create({
            data: {
                ticketId: id,
                senderId: req.user!.id,
                content,
                attachments
            },
            include: {
                sender: { select: { id: true, name: true, role: true, avatarUrl: true } }
            }
        });

        // Update ticket updated_at
        await prisma.ticket.update({
            where: { id },
            data: { updatedAt: new Date(), status: req.user!.role === 'ADMIN' ? 'in_progress' : 'open' }
        });

        // Notify client when admin replies
        if (req.user!.role === 'ADMIN' && ticket.clientId) {
            await notifyTicketUpdate(ticket.clientId, ticket.subject, 'reply');
            await notifyClient(ticket.clientId, {
                type: 'TICKET_REPLY',
                ticketSubject: ticket.subject,
                replyPreview: content ? String(content).slice(0, 200) : undefined,
            });
        }

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/tickets/:id/escalate (Client escalates own ticket to CRITICAL)
router.patch('/:id/escalate', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.clientId !== req.user!.id) return res.status(403).json({ message: 'Access denied' });
    const updated = await prisma.ticket.update({
      where: { id },
      data: { priority: 'CRITICAL', updatedAt: new Date() },
    });
    await notifyTicketUpdate(ticket.clientId, ticket.subject, 'ESCALATED');
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tickets/:id/status (Admin only)
router.patch('/:id/status', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const ticket = await prisma.ticket.update({
            where: { id },
            data: { status }
        });

        // Notify client of ticket status change
        await notifyTicketUpdate(ticket.clientId, ticket.subject, status);

        res.json(ticket);
    } catch (error) {
        next(error);
    }
});

export default router;
