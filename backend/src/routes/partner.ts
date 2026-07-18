
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/rbac';
import { escapeHtml } from '../utils/sanitize';

const router = Router();
const prisma = new PrismaClient();

// Middleware to ensure user is a partner
const requirePartner = requireRole(['PARTNER', 'ADMIN']);

// GET /api/partner/stats
router.get('/stats', requireAuth, requirePartner, async (req, res) => {
  try {
    const userId = req.user!.userId;
    
    // Get projects assigned to this partner
    const projects = await prisma.project.findMany({
      where: { partnerId: userId },
      include: {
        invoices: true,
        deliverables: true
      }
    });

    // Calculate stats
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    
    // Calculate earnings (sum of paid invoices)
    const totalEarnings = projects.reduce((sum, project) => {
      const paidInvoices = project.invoices.filter(inv => inv.status === 'PAID');
      return sum + paidInvoices.reduce((invSum, inv) => invSum + Number(inv.amount), 0);
    }, 0);

    // Calculate pending (sent but not paid)
    const pendingEarnings = projects.reduce((sum, project) => {
        const pendingInvoices = project.invoices.filter(inv => inv.status === 'SENT' || inv.status === 'OVERDUE');
        return sum + pendingInvoices.reduce((invSum, inv) => invSum + Number(inv.amount), 0);
    }, 0);

    res.json({
      stats: {
        active_projects: activeProjects,
        completed_projects: completedProjects,
        total_earnings: totalEarnings,
        pending_earnings: pendingEarnings,
        rating: 4.8 // Placeholder or calculated from reviews
      }
    });
  } catch (error) {
    console.error('Error fetching partner stats:', error);
    res.status(500).json({ error: 'Failed to fetch partner stats' });
  }
});

// GET /api/partner/projects
router.get('/projects', requireAuth, requirePartner, async (req, res) => {
    try {
        const userId = req.user!.userId;
        const projects = await prisma.project.findMany({
            where: { partnerId: userId },
            include: { client: { select: { name: true, company: true, avatarUrl: true } } },
            orderBy: { updatedAt: 'desc' }
        });
        res.json({ projects });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// GET /api/partner/deliverables
router.get('/deliverables', requireAuth, requirePartner, async (req, res) => {
    try {
        const userId = req.user!.userId;
        
        // Find deliverables for projects assigned to this partner
        const deliverables = await prisma.deliverable.findMany({
            where: {
                project: {
                    partnerId: userId
                }
            },
            include: {
                project: {
                    select: { title: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json({ deliverables });
    } catch (error) {
        console.error('Error fetching deliverables:', error);
        res.status(500).json({ error: 'Failed to fetch deliverables' });
    }
});

// GET /api/partner/earnings
router.get('/earnings', requireAuth, requirePartner, async (req, res) => {
    try {
        const userId = req.user!.userId;

        const invoices = await prisma.invoice.findMany({
            where: {
                project: {
                     partnerId: userId
                }
            },
            include: {
                project: { select: { title: true } }
            },
            orderBy: { issueDate: 'desc' }
        });

        const earningsData = {
            available_balance: 0, // Mock for now
            pending_clearance: invoices.filter(i => i.status === 'SENT').reduce((acc, i) => acc + Number(i.amount), 0),
            total_earned: invoices.filter(i => i.status === 'PAID').reduce((acc, i) => acc + Number(i.amount), 0),
            next_payout: 'Feb 15, 2026', // Mock
            currency: 'USD',
            transactions: invoices.map(inv => ({
                id: inv.id,
                date: inv.issueDate.toISOString().split('T')[0],
                description: `Invoice for ${inv.project ? inv.project.title : 'Project'}`,
                amount: Number(inv.amount),
                status: inv.status, // PAID, SENT, DRAFT
                type: 'Credit'
            }))
        };

        res.json({ earnings: earningsData });

    } catch (error) {
        console.error('Partner earnings error:', error);
        res.status(500).json({ error: 'Failed to fetch earnings' });
    }
});

// GET /api/partner/emails
router.get('/emails', requireAuth, requirePartner, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { folder, search } = req.query;
    const where: any = { partnerId: userId };
    if (folder) where.partnerFolder = (folder as string).toUpperCase();
    if (search) {
      where.OR = [
        { subject: { contains: search as string, mode: 'insensitive' } },
        { body:    { contains: search as string, mode: 'insensitive' } },
      ];
    }
    const emails = await (prisma as any).emailLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ emails });
  } catch (error) {
    console.error('Partner emails error:', error);
    res.json({ emails: [] });
  }
});

// POST /api/partner/emails/reply
router.post('/emails/reply', requireAuth, requirePartner, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { emailId, content: rawContent, subject } = req.body;
    if (!rawContent) return res.status(400).json({ error: 'Content required' });
    const content = escapeHtml(rawContent);
    const partner = await prisma.user.findUnique({ where: { id: userId } });
    if (!partner) return res.status(404).json({ error: 'User not found' });
    let threadId: string | undefined;
    let replySubject = subject || 'Partner Message';
    if (emailId) {
      const orig = await (prisma as any).emailLog.findUnique({ where: { id: emailId } });
      if (orig) { threadId = orig.threadId || orig.id; replySubject = `Re: ${orig.subject}`; }
    }
    const email = await (prisma as any).emailLog.create({
      data: {
        subject: replySubject,
        from: partner.email || partner.name,
        to: 'admin@kangqore.com',
        body: content,
        preview: content.substring(0, 100),
        partnerId: userId,
        threadId: threadId || undefined,
        replyToId: emailId || undefined,
        direction: 'inbound',
        isRead: false,
        isUnread: true,
        partnerFolder: 'SENT',
        adminFolder: 'INBOX',
      },
    });
    res.status(201).json({ success: true, email });
  } catch (error) {
    console.error('Partner reply error:', error);
    res.status(500).json({ error: 'Failed to send' });
  }
});

export default router;
