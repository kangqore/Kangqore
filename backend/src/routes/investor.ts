import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/rbac';
import { notifyNewEmail } from '../kangqore-view/awareness/notifications/NotificationService';
import { escapeHtml } from '../utils/sanitize';

const router = Router();

// Middleware to ensure user is INVESTOR
const requireInvestor = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'INVESTOR') {
    return res.status(403).json({ 
      error: `Access denied. Investor role required. Current Role: ${req.user?.role}, ID: ${req.user?.userId}` 
    });
  }
  next();
};

/**
 * GET /api/investor/stats
 * Return aggregated KPIs for Dashboard
 */
router.get('/stats', requireAuth, requireInvestor, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // In a real app, calculate these from actual data. 
    // For now, we return "Curated" (Mocked) data as per spec.
    const stats = {
      revenue: '$5.2M', // Example from spec
      growthRate: '15.2%',
      activeClients: 85,
      pipelineValue: '$1.2M',
      growthTrend: [
        { name: 'Q1', value: 4000 },
        { name: 'Q2', value: 3000 },
        { name: 'Q3', value: 5000 },
        { name: 'Q4', value: 2780 },
        { name: 'Q5', value: 1890 },
        { name: 'Q6', value: 2390 },
        { name: 'Q7', value: 3490 },
      ],
      allocation: [
        { name: 'Technology', value: 45, color: '#4F46E5' },
        { name: 'Services', value: 30, color: '#10B981' },
        { name: 'Healthcare', value: 15, color: '#F59E0B' },
        { name: 'Other', value: 10, color: '#6B7280' },
      ],
      upcomingMeeting: null 
    };

    // Check for next upcoming meeting
    const upcomingMeeting = await prisma.meeting.findFirst({
        where: {
            investorId: req.user!.userId,
            startTime: { gt: new Date() }
        },
        orderBy: { startTime: 'asc' }
    });
    
    if (upcomingMeeting) {
        stats.upcomingMeeting = upcomingMeeting as any;
    }

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/investor/updates
 * Company Announcements
 */
router.get('/updates', requireAuth, requireInvestor, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const updates = await prisma.investorUpdate.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        res.json({ updates });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/investor/meetings
 * Meetings for this investor
 */
router.get('/meetings', requireAuth, requireInvestor, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const meetings = await prisma.meeting.findMany({
            where: { investorId: req.user!.userId },
            orderBy: { startTime: 'desc' }
        });

        const consultations = await prisma.consultation.findMany({
            where: { 
                email: req.user!.email,
                OR: [
                    { service: { contains: 'Invest', mode: 'insensitive' } },
                    { service: { contains: 'Fund', mode: 'insensitive' } },
                    { service: { contains: 'Equity', mode: 'insensitive' } },
                    { service: { contains: 'Capital', mode: 'insensitive' } },
                    { service: { contains: 'Board', mode: 'insensitive' } },
                    { topic: { contains: 'Invest', mode: 'insensitive' } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ meetings, consultations });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/investor/emails
 * Email logs for this investor
 */
/**
 * GET /api/investor/emails
 * Email logs for this investor
 */
/**
 * GET /api/investor/emails
 * Email logs for this investor
 */
router.get('/emails', requireAuth, requireInvestor, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { folder, starred, important, search } = req.query;
        const userId = req.user!.userId;
        const where: any = { investorId: userId };

        if (folder) {
            where.investorFolder = (folder as string).toUpperCase();
        } else if (!starred && !important && !search) {
            where.investorFolder = { notIn: ['SPAM', 'TRASH'] };
        }

        if (starred === 'true') where.isInvestorStarred = true;
        if (important === 'true') where.isInvestorImportant = true;
        if (search) {
            where.OR = [
                { subject: { contains: search as string, mode: 'insensitive' } },
                { body: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        const emails = await prisma.emailLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                investor: { select: { name: true, email: true } }
            }
        });
        res.json({ emails });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/investor/emails/reply
 * Investor reply to admin
 */
router.post('/emails/reply', requireAuth, requireInvestor, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { emailId, content: rawContent, subject } = req.body;
        const userId = req.user!.userId;

        // Fetch full user details to get email/name
        const investor = await prisma.user.findUnique({ where: { id: userId } });
        if (!investor) return res.status(404).json({ error: 'User not found' });

        if (!rawContent) {
            return res.status(400).json({ error: 'Reply content is required' });
        }
        const content = escapeHtml(rawContent);

        // Get original email if replying to one
        let originalEmail = null;
        let threadId = null;
        let replySubject = subject || 'Investor Message';

        if (emailId) {
            originalEmail = await prisma.emailLog.findUnique({
                where: { id: emailId }
            });
            if (originalEmail) {
                threadId = originalEmail.threadId || originalEmail.id;
                replySubject = subject || `Re: ${originalEmail.subject}`;
            }
        }

        // Create new email log entry
        const newEmail = await prisma.emailLog.create({
            data: {
                subject: replySubject,
                from: investor.email || investor.name,
                to: 'admin@kangqore.com',
                body: content,
                preview: content.substring(0, 100),
                investorId: userId,
                threadId: threadId || undefined,
                replyToId: emailId || undefined,
                direction: 'inbound', // Investor -> Admin
                hasAttachment: !!(req.body.attachments && req.body.attachments.length > 0),
                attachments: req.body.attachments || [],
                isRead: false,
                isUnread: true,
                investorFolder: 'SENT',
                adminFolder: 'INBOX'
            },
            include: {
                investor: { select: { name: true, email: true } }
            }
        });

        // Notify all admins about the new email
        try {
          const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true }
          });
          for (const admin of admins) {
            await notifyNewEmail(admin.id, 'admin', replySubject);
          }
        } catch (notifyError) {
          console.warn('Could not send email notification:', notifyError);
        }

        res.status(201).json({ 
            success: true, 
            message: 'Sent successfully',
            email: newEmail 
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /api/investor/emails/:id/folder
router.patch('/emails/:id/folder', requireAuth, requireInvestor, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { folder } = req.body;
    const userId = req.user!.userId;
    await prisma.emailLog.updateMany({
      where: { id, investorId: userId },
      data: { investorFolder: folder }
    });
    res.json({ success: true });
  } catch (error) { next(error); }
});

// PATCH /api/investor/emails/:id/flags
router.patch('/emails/:id/flags', requireAuth, requireInvestor, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { starred, important, isRead } = req.body;
    const userId = req.user!.userId;
    const data: any = {};
    if (starred !== undefined) data.isInvestorStarred = starred;
    if (important !== undefined) data.isInvestorImportant = important;
    if (isRead !== undefined) data.isRead = isRead;
    
    await prisma.emailLog.updateMany({
      where: { id, investorId: userId },
      data
    });
    res.json({ success: true });
  } catch (error) { next(error); }
});

export default router;
