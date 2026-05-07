
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/rbac';

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

export default router;
