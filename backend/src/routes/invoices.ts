import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
import { createNotification } from '../services/notificationService';
import { notifyClient } from '../services/clientEmail.service';

const router = Router();

// GET /api/invoices
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, projectId } = req.query;
    const user = req.user!;

    const where: any = {};
    if (user.role === 'CLIENT') {
        where.clientId = user.id;
    } else if (user.role === 'ADMIN') {
        if (clientId) where.clientId = clientId as string;
    }

    if (projectId) where.projectId = projectId as string;

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        project: { select: { title: true } },
        linkedDeliverables: { select: { id: true, title: true, status: true } } // Gap 4
      },
      orderBy: { issueDate: 'desc' }
    });

    res.json({ invoices });
  } catch (error) { next(error); }
});

// POST /api/invoices (Admin creates)
router.post('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { invoiceNumber, amount, currency, dueDate, projectId, clientId, fileUrl, notes } = req.body;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        amount,
        currency: currency || 'USD',
        status: 'SENT',
        dueDate: new Date(dueDate),
        projectId,
        clientId,
        fileUrl,
        notes
      }
    });

    await createNotification({
      userId: clientId,
      title: `Invoice ${invoiceNumber} ready`,
      message: `A new invoice for ${currency || 'USD'} ${Number(amount).toLocaleString()} is ready for your review.`,
      type: 'INFO',
      link: '/kangqore-view/client/invoices',
    });
    await notifyClient(clientId, {
      type: 'INVOICE_READY',
      invoiceNumber,
      amount: Number(amount),
      currency: currency || 'USD',
      dueDate: new Date(dueDate),
    });

    res.status(201).json(invoice);
  } catch (error) { next(error); }
});

// PATCH /api/invoices/:id/status (Mark as Paid)
router.patch('/:id/status', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PAID, OVERDUE

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { 
          status,
          paidAt: status === 'PAID' ? new Date() : null
      }
    });

    res.json(invoice);
  } catch (error) { next(error); }
});

export default router;
