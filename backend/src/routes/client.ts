import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/rbac';
import { createError } from '../middleware/errorHandler';
import { notifyNewEmail } from '../kangqore-view/awareness/notifications/NotificationService';
import accountabilityService from '../kangqore-view/kore/AccountabilityService';
import { escapeHtml } from '../utils/sanitize';

const router = Router();

// ==========================================
// ACTION LEDGER (Governance Layer)
// ==========================================
// GET /api/client/actions
router.get('/actions', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const sevenDaysOut = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const [pendingDeliverables, pendingChanges, dueInvoices, ticketsWithAdminReply] = await Promise.all([
      // 1. Deliverables waiting for client acceptance
      prisma.deliverable.findMany({
        where: { clientId: userId, status: { in: ['SUBMITTED', 'PENDING_ACCEPTANCE'] } },
        select: { id: true, title: true, status: true, updatedAt: true },
      }),
      // 2. Change requests awaiting client decision (PROPOSED = new, UNDER_REVIEW = being reviewed)
      prisma.changeRequest.findMany({
        where: {
          clientId: userId,
          status: { in: ['PROPOSED', 'UNDER_REVIEW'] },
          acknowledgedAt: null,
        },
        select: { id: true, title: true, status: true, costImpact: true, timeImpact: true, priority: true },
      }),
      // 3. Invoices overdue or due within 7 days
      prisma.invoice.findMany({
        where: {
          clientId: userId,
          status: { notIn: ['PAID', 'CANCELLED', 'DRAFT'] },
          dueDate: { lte: sevenDaysOut },
        },
        select: { id: true, invoiceNumber: true, amount: true, dueDate: true, status: true },
        orderBy: { dueDate: 'asc' },
      }),
      // 4. Open tickets that have at least one reply from a non-client (admin reply awaiting client read)
      prisma.ticket.findMany({
        where: {
          clientId: userId,
          status: { in: ['open', 'pending'] },
          messages: { some: { sender: { role: { not: 'CLIENT' } } } },
        },
        select: { id: true, subject: true, status: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
    ]);

    const now = new Date();

    const actions = [
      ...dueInvoices.map(i => ({
        type: 'INVOICE',
        id: i.id,
        title: `Invoice ${i.invoiceNumber}`,
        subtitle: new Date(i.dueDate) < now
          ? 'Overdue — payment required'
          : `Due ${new Date(i.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
        dueDate: i.dueDate,
        urgency: new Date(i.dueDate) < now ? 'high' : 'medium',
        link: '/kangqore-view/client/invoices',
        meta: { amount: Number(i.amount), invoiceNumber: i.invoiceNumber },
      })),
      ...pendingChanges.map(c => ({
        type: 'CHANGE_REQUEST',
        id: c.id,
        title: c.title,
        subtitle: c.timeImpact ? `Timeline impact: ${c.timeImpact}` : c.costImpact ? 'Budget impact — review required' : 'Awaiting your sign-off',
        dueDate: null,
        urgency: (c.priority === 'HIGH' || c.priority === 'CRITICAL') ? 'high' : 'medium',
        link: '/kangqore-view/client/change-requests',
        meta: { cost: c.costImpact, time: c.timeImpact },
      })),
      ...pendingDeliverables.map(d => ({
        type: 'DELIVERABLE',
        id: d.id,
        title: d.title,
        subtitle: 'Review & acceptance required',
        dueDate: null,
        urgency: 'medium',
        link: '/kangqore-view/client/projects',
        meta: { updatedAt: d.updatedAt },
      })),
      ...ticketsWithAdminReply.map(t => ({
        type: 'TICKET',
        id: t.id,
        title: t.subject,
        subtitle: 'New reply from support team',
        dueDate: t.updatedAt,
        urgency: 'medium',
        link: '/kangqore-view/client/support',
        meta: { updatedAt: t.updatedAt },
      })),
    ].sort((a, b) => (a.urgency === 'high' ? -1 : b.urgency === 'high' ? 1 : 0));

    res.json({ actions });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// CLIENT PROJECTS (normalized portal view)
// ==========================================
// GET /api/client/projects
router.get('/projects', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const rows = await prisma.project.findMany({
      where: { clientId: userId },
      select: {
        id: true, title: true, description: true, status: true,
        progress: true, budget: true, spend: true,
        createdAt: true, dueDate: true, health: true, nextGate: true,
        lead: { select: { name: true } },
        deliverables: {
          select: { id: true, title: true, status: true, dueDate: true },
          orderBy: { dueDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const projects = rows.map(p => {
      const health = p.health >= 80 ? 'on-track' : p.health >= 50 ? 'at-risk' : 'behind';
      // Next incomplete deliverable becomes the milestone label
      const nextDel = p.deliverables.find(d => d.status !== 'COMPLETED' && d.status !== 'APPROVED');
      return {
        id:            p.id,
        name:          p.title,
        description:   p.description ?? '',
        progress:      p.progress ?? 0,
        health,
        budget:        Number(p.budget ?? 0),
        spent:         Number(p.spend ?? 0),
        startDate:     p.createdAt.toISOString().slice(0, 10),
        targetDate:    p.dueDate ? p.dueDate.toISOString().slice(0, 10) : '',
        nextMilestone: nextDel?.title ?? p.nextGate ?? '—',
        milestoneDate: nextDel?.dueDate
          ? nextDel.dueDate.toISOString().slice(0, 10)
          : p.dueDate ? p.dueDate.toISOString().slice(0, 10) : '',
        status:        p.status,
        lead:          p.lead?.name ?? 'Kangqore',
        deliverables:  p.deliverables.map(d => ({
          id:      d.id,
          title:   d.title,
          status:  d.status,
          dueDate: d.dueDate ? d.dueDate.toISOString().slice(0, 10) : null,
        })),
      };
    });
    res.json({ projects });
  } catch (error) { next(error); }
});

// ==========================================
// CLIENT RISKS (open, client-visible)
// ==========================================
// GET /api/client/risks
router.get('/risks', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const risks = await prisma.risk.findMany({
      where: { clientId: userId, status: 'OPEN', isClientVisible: true },
      select: { id: true, title: true, severity: true, owner: true, status: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ risks: risks.map(r => ({ ...r, due: '' })) });
  } catch (error) { next(error); }
});

// ==========================================
// NOTIFICATIONS
// ==========================================
// GET /api/client/notifications
router.get('/notifications', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    res.json({ notifications });
  } catch (error) { next(error); }
});

// PATCH /api/client/notifications/read-all — must come before /:id/read
router.patch('/notifications/read-all', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ success: true });
  } catch (error) { next(error); }
});

// PATCH /api/client/notifications/:id/read
router.patch('/notifications/:id/read', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
    res.json({ success: true });
  } catch (error) { next(error); }
});

// Governance Acknowledgement (Pillar 3 Polish)
router.post('/governance/acknowledge', requireAuth, requireRole(['CLIENT']), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });

        if (!clientProfile) return res.status(404).json({ error: 'Profile not found' });

        await prisma.clientProfile.update({
            where: { id: clientProfile.id },
            data: {
                rulesAcknowledgedAt: new Date(),
                rulesAcknowledgedBy: req.user!.email // Or name if available in token
            }
        });

        res.json({ success: true, message: 'Governance rules acknowledged' });
    } catch (error) { next(error); }
});

// ==========================================
// MVPs
// ==========================================
// GET /api/client/mvps
router.get('/mvps', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const mvps = await prisma.productVersion.findMany({
      where: { clientId: userId },
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ mvps });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// LINKS
// ==========================================
// GET /api/client/links
router.get('/links', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const links = await prisma.resourceLink.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ links });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// AUDIT STORY (Gap #5)
// ==========================================
// GET /api/client/audit-story
router.get('/audit-story', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    // 1. Fetch all Governance Artifacts
    const [risks, decisions, changes, deliverables] = await Promise.all([
        prisma.risk.findMany({ 
            where: { clientId: userId },
            select: { id: true, title: true, status: true, severity: true, createdAt: true, clientAcceptedAt: true, clientAcceptedBy: true }
        }),
        prisma.decision.findMany({ 
            where: { clientId: userId },
            select: { 
                id: true, 
                title: true, 
                status: true, 
                createdAt: true,
                approvedAt: true, // Added for proper event sequencing
                risk: { select: { title: true } }
            }
        }),
        prisma.changeRequest.findMany({ 
            where: { clientId: userId },
            select: { 
                id: true, 
                title: true, 
                status: true, 
                createdAt: true,
                approvingDecisions: { select: { title: true } }
            }
        }),
        prisma.deliverable.findMany({ 
            where: { clientId: userId, status: 'ACCEPTED' },
            select: { id: true, title: true, status: true, createdAt: true, approvedAt: true } // Added approvedAt
        })
    ]);

    // 2. Normalize into "Events"
    const events = [
        ...risks.map(r => {
            // If accepted, use acceptance date. If open, use creation date.
            // Ideally we separate "Risk Identified" from "Risk Accepted" events to show progress.
            // For now, let's show the most relevant state date.
            const isAccepted = r.status === 'ACCEPTED';
            // Note: clientAcceptedAt is not selected in the query above, need to add it.
            return {
                id: r.id,
                type: 'RISK',
                date: isAccepted ? (r.clientAcceptedAt || r.createdAt) : r.createdAt,
                title: isAccepted ? `Risk Accepted: ${r.title}` : `Risk Identified: ${r.title}`,
                details: isAccepted ? `Formally accepted by ${r.clientAcceptedBy || 'Client'}` : `Severity: ${r.severity}`,
                status: r.status,
                icon: isAccepted ? 'CheckCircle' : 'AlertTriangle',
                color: isAccepted ? 'green' : 'red'
            };
        }),
        ...decisions.map(d => ({
            id: d.id,
            type: 'DECISION',
            date: d.approvedAt || d.createdAt, // Use approvedAt for APPROVED decisions
            title: `Decision: ${d.title}`,
            details: d.risk ? `Mitigates: ${d.risk.title}` : 'Strategic Decision',
            status: d.status,
            icon: 'Gavel',
            color: 'amber'
        })),
        ...changes.map(c => ({
            id: c.id,
            type: 'CHANGE',
            date: c.createdAt,
            title: `Change Request: ${c.title}`,
            details: c.approvingDecisions?.length ? `Approved by: ${c.approvingDecisions[0].title}` : 'Pending Approval',
            status: c.status,
            icon: 'GitCommit',
            color: 'blue'
        })),
        ...deliverables.map(d => ({
            id: d.id,
            type: 'DELIVERABLE',
            date: d.approvedAt || d.createdAt, // Use approvedAt when accepted
            title: `Value Delivered: ${d.title}`,
            details: 'Formally Accepted',
            status: d.status,
            icon: 'CheckCircle',
            color: 'green'
        }))
    ];

    // 3. Sort Chronologically (Oldest First to tell a story, or Newest First for history? Story = Oldest First usually)
    // Let's do Newest First for a "Feed" style, or Oldest First for "Timeline".
    // "Audit Story" implies tracing back. Let's return sorted DESC (Newest top).
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({ events });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// EMAILS (Timeline & Full Client)
// ==========================================
// GET /api/client/emails
router.get('/emails', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { folder, starred, important, label, search } = req.query;
    
    const where: any = { clientId: userId };

    // Folder Filter
    if (folder) {
      if (folder === 'IMMUTABLE') {
        where.isImmutable = true;
      } else {
        where.clientFolder = (folder as string).toUpperCase();
      }
    } else if (!starred && !important && !label && !search) {
       // Default: show all emails except SPAM/TRASH
       where.clientFolder = { notIn: ['SPAM', 'TRASH'] };
    }

    // Flag Filters
    if (starred === 'true') where.isClientStarred = true;
    if (important === 'true') where.isClientImportant = true;
    
    // Label Filter
    // Note: JSON filtering depends on DB support. For simple array check:
    // This might require raw query or simplified logic if using specific DB. 
    // For now assuming we can filter in app if volume low, or basic contains.
    // Ideally: path: ['clientLabels'], array_contains: label

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
        client: { select: { name: true, email: true } }
      }
    });
    res.json({ emails });
  } catch (error) {
    next(error);
  }
});

// POST /api/client/emails/reply (Send New / Reply)
router.post('/emails/reply', requireAuth, requireRole(['CLIENT']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { emailId, content, body, subject, draftId, attachments } = req.body; // Accept attachments
    const userId = req.user!.userId;
    const client = await prisma.user.findUnique({ where: { id: userId } });
    if (!client) throw createError('User not found', 404);

    const rawContent = content || body; // Use either field
    if (!rawContent) throw createError('Content required', 400);
    const emailContent = escapeHtml(rawContent);

    let originalEmail = null;
    let threadId = null;
    let replySubject = subject || 'Client Message';

    if (emailId) {
      originalEmail = await prisma.emailLog.findUnique({ where: { id: emailId } });
      if (originalEmail) {
        threadId = originalEmail.threadId || originalEmail.id;
        replySubject = subject || `Re: ${originalEmail.subject}`;
      }
    }

    // Determine Folders
    // Sender (Client): SENT
    // Receiver (Admin): INBOX
    const newEmail = await prisma.emailLog.create({
      data: {
        subject: replySubject,
        from: client.email || client.name,
        to: 'admin@kangqore.com',
        body: emailContent,
        preview: emailContent.substring(0, 100),
        clientId: userId,
        threadId: threadId || undefined,
        replyToId: emailId || undefined,
        direction: 'inbound', // Client -> Admin
        hasAttachment: !!(attachments && attachments.length > 0),
        attachments: attachments || [],
        
        isRead: false,
        isUnread: true,
        
        // Folders
        clientFolder: 'SENT',
        adminFolder: 'INBOX',
        
        // Flags
        isClientStarred: false,
        isAdminStarred: false
      },
      include: {
        client: { select: { name: true, email: true } }
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

    res.status(201).json({ success: true, message: 'Sent', email: newEmail });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/client/emails/:id/folder (Move)
router.patch('/emails/:id/folder', requireAuth, requireRole(['CLIENT']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { folder } = req.body; // INBOX, TRASH, SPAM, ARCHIVE
    const userId = req.user!.userId;
    
    await prisma.emailLog.updateMany({
      where: { id, clientId: userId },
      data: { clientFolder: folder }
    });
    
    res.json({ success: true });
  } catch (error) { next(error); }
});

// PATCH /api/client/emails/:id/flags (Star/Important)
router.patch('/emails/:id/flags', requireAuth, requireRole(['CLIENT']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { starred, important, isRead } = req.body;
    const userId = req.user!.userId;
    
    const data: any = {};
    if (starred !== undefined) data.isClientStarred = starred;
    if (important !== undefined) data.isClientImportant = important;
    if (isRead !== undefined) data.isRead = isRead; // Note: isRead is shared for now? No, need per-user read state? 
    // Schema has single `isRead`. This is a flaw if both view same record. 
    // Actually, `direction` determines who reads. inbound=Admin reads, outbound=Client reads.
    // If direction=inbound (Client sent), Client doesn't "read" it, they sent it. Admin reads.
    // If direction=outbound (Admin sent), Client reads.
    // So `isRead` usually refers to the *Receiver's* read status.
    // Client can't mark their own sent email as read/unread for themselves? 
    // Let's stick to `isRead` logic for now. 
    
    await prisma.emailLog.updateMany({
      where: { id, clientId: userId },
      data
    });
    
    res.json({ success: true });
    
    res.json({ success: true });
  } catch (error) { next(error); }
});

// ==========================================
// TASKS
// ==========================================
// GET /api/client/tasks
router.get('/tasks', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    // Client sees tasks for THEIR projects
    const tasks = await prisma.task.findMany({
      where: { clientId: userId },
      include: { 
        project: { select: { title: true } },
        partner: { select: { name: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ tasks });
  } catch (error) { next(error); }
});

// PATCH /api/client/tasks/:id/status
router.patch('/tasks/:id/status', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.userId;

    const allowedStatuses = ['todo', 'in_progress', 'completed', 'blocked', 'approved'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedTask = await prisma.task.updateMany({
      where: { id, clientId: userId }, // Ensure client owns the task's project
      data: { status }
    });

    if (updatedTask.count === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.json({ success: true, status });
  } catch (error) { next(error); }
});

// ==========================================
// MESSAGES
// ==========================================
// GET /api/client/messages
router.get('/messages', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    
    // Fetch all messages where user is sender OR receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: { select: { id: true, name: true, role: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, role: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ messages });
  } catch (error) {
    next(error);
  }
});

// POST /api/client/messages
router.post('/messages', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const senderId = req.user!.userId;
    const { content, receiverId, attachments } = req.body;

    if ((!content && (!attachments || attachments.length === 0)) || !receiverId) {
      throw createError('Content (or attachment) and receiverId are required', 400);
    }

    const message = await prisma.message.create({
      data: {
        content: content || '',
        senderId,
        receiverId,
        attachments: attachments || []
      },
      include: {
        sender: { select: { id: true, name: true, role: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, role: true, avatarUrl: true } }
      }
    });

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// SETTINGS (Gap 7: Enterprise Settings)
// ==========================================
// GET /api/client/settings
router.get('/settings', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    
    // Attempt to find profile
    let profile = await prisma.clientProfile.findUnique({
      where: { userId },
      include: { authorityMatrix: true }
    });
    
    // Return empty structure if not found (UI handles creation via update)
    if (!profile) {
       return res.json({ 
           legalEntityName: '', 
           registeredAddress: '',
           taxId: '',
           billingContactName: '',
           billingContactEmail: '',
           billingContactPhone: '',
           escalationMatrix: [],
           authorityMatrix: []
       });
    }

    res.json(profile);
  } catch (error) { next(error); }
});

// PUT /api/client/settings
router.put('/settings', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { 
        legalEntityName, registeredAddress, taxId, industryDomain, jurisdiction, dataResidency,
        billingContactName, billingContactEmail, billingContactPhone,
        escalationMatrix
    } = req.body;
    
    const profile = await prisma.clientProfile.upsert({
      where: { userId },
      create: {
        userId,
        legalEntityName, registeredAddress, taxId, industryDomain, jurisdiction, dataResidency,
        billingContactName, billingContactEmail, billingContactPhone,
        escalationMatrix: escalationMatrix || [],
        interestedServices: req.body.interestedServices || []
      },
      update: {
        legalEntityName, registeredAddress, taxId, industryDomain, jurisdiction, dataResidency,
        billingContactName, billingContactEmail, billingContactPhone,
        escalationMatrix: escalationMatrix || undefined,
        interestedServices: req.body.interestedServices || undefined
      }
    });

    res.json(profile);
  } catch (error) { next(error); }
});

// ==========================================
// ACCOUNTABILITY / MY AGREEMENTS
// ==========================================
// GET /api/client/accountability
router.get('/accountability', requireAuth, requireRole(['CLIENT']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    
    // Get all accountability events for this client
    const log = await accountabilityService.getClientAccountabilityLog(userId);
    
    res.json({ log });
  } catch (error) { next(error); }
});

// GET /api/client/obligations
router.get('/obligations', requireAuth, requireRole(['CLIENT']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    // Get obligations owed BY the client
    const obligations = await accountabilityService.getClientObligations(userId);
    res.json({ obligations });
  } catch (error) { next(error); }
});

// GET /api/client/analytics/impact-distribution
router.get('/analytics/impact-distribution', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let userId = req.user!.userId;
    
    // If Admin, use clientId from query if provided
    if (req.user!.role === 'ADMIN' && req.query.clientId) {
        userId = req.query.clientId as string;
    }

    const analytics = await accountabilityService.getClientImpactAnalytics(userId);
    res.json(analytics);
  } catch (error) { next(error); }
});

// GET /api/client/analytics/impact-history
router.get('/analytics/impact-history', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let userId = req.user!.userId;

    if (req.user!.role === 'ADMIN' && req.query.clientId) {
        userId = req.query.clientId as string;
    }

    const history = await accountabilityService.getClientImpactHistory(userId);
    res.json(history);
  } catch (error) { next(error); }
});

// Get impact attribution for a project (Client Chart)
router.get('/projects/:id/impact-attribution', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: projectId } = req.params;
    const attribution = await accountabilityService.getDelayAttribution(projectId);
    res.json(attribution);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// REPORTS
// ==========================================
// GET /api/client/reports/weekly
router.get('/reports/weekly', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Accomplishments (Deliverables Accepted recently)
    const accomplishments = await prisma.deliverable.findMany({
      where: {
        clientId: userId,
        status: 'ACCEPTED',
        updatedAt: { gte: lastWeek }
      },
      select: { title: true, updatedAt: true }
    });

    // 2. Decisions (Made recently)
    const decisions = await prisma.decision.findMany({
      where: {
        clientId: userId,
        // Assuming status change timestamp isn't tracked separately, using updatedAt
        updatedAt: { gte: lastWeek },
        status: { in: ['APPROVED', 'REJECTED'] }
      },
      select: { id: true, title: true, status: true, approver: { select: { name: true } } }
    });

    // 3. Risks (Active & High Severity)
    const risks = await prisma.risk.findMany({
      where: {
        clientId: userId,
        status: 'OPEN',
        severity: { in: ['HIGH', 'CRITICAL'] }
      },
      select: { id: true, title: true, severity: true, status: true }
    });

    // 4. Planned for Next Week (Deliverables due soon)
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const planned = await prisma.deliverable.findMany({
      where: {
        clientId: userId,
        dueDate: { gte: today, lte: nextWeek },
        status: { not: 'ACCEPTED' }
      },
      select: { title: true, dueDate: true }
    });

    // 5. Context / Summary Generation (Mocked logic for now, could be AI)
    // Calculate Health Score
    // Base 100. Deduct 10 for each Critical Risk, 5 for High.
    let healthScore = 100;
    risks.forEach(r => {
      if (r.severity === 'CRITICAL') healthScore -= 10;
      if (r.severity === 'HIGH') healthScore -= 5;
    });
    healthScore = Math.max(0, healthScore);

    const reportData = {
      date: today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      period: `Week ${getWeekNumber(today)}, ${today.getFullYear()}`,
      health: {
        status: healthScore > 80 ? 'Healthy' : healthScore > 50 ? 'At Risk' : 'Critical',
        score: healthScore,
        trend: healthScore >= 90 ? 'Stable' : 'Declining'
      },
      summary: `Engagement health is ${healthScore > 80 ? 'Strong' : 'Needs Attention'}. ${accomplishments.length} items delivered this week. ${risks.length} active high-severity risks requires attention.`,
      accomplishments: accomplishments.map(a => `Delivered: ${a.title}`),
      decisions: decisions.map(d => ({
        id: d.id,
        title: d.title,
        status: d.status,
        by: d.approver?.name || 'Stakeholder'
      })),
      risks: risks.map(r => ({
        id: r.id,
        title: r.title,
        severity: r.severity
      })),
      next_week: planned.map(p => `Due: ${p.title} (${new Date(p.dueDate!).toLocaleDateString()})`)
    };

    res.json({ report: reportData });
  } catch (error) {
    next(error);
  }
});

function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return weekNo;
}

// ==========================================
// DASHBOARD SUMMARY (Team, SLA, This Week, Activity, Engagement)
// ==========================================
// Same first-response SLA targets used by the client Support tab (ClientSupport.tsx)
const SLA_RESPONSE_MINUTES: Record<string, number> = {
  CRITICAL: 60,
  HIGH: 240,
  MEDIUM: 1440,
  LOW: 4320,
};

const TEAM_ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Delivery Lead',
  TEAM: 'Team Member',
  EXECUTIVE: 'Executive Sponsor',
  PARTNER: 'Delivery Partner',
};

const TEAM_PALETTE = ['#2564ea', '#7f53f9', '#00c875', '#fdab3d', '#e2445c'];

function firstResponseMinutes(t: { createdAt: Date; messages: { createdAt: Date; sender: { role: string } }[] }): number | null {
  const reply = t.messages.find(m => m.sender.role !== 'CLIENT');
  if (!reply) return null;
  return (reply.createdAt.getTime() - t.createdAt.getTime()) / 60000;
}

function bucketSla(
  tickets: { createdAt: Date; messages: { createdAt: Date; sender: { role: string } }[] }[],
  targetMinutes: number,
  metric: string,
  targetLabel: string,
) {
  if (tickets.length === 0) {
    return { metric, target: targetLabel, current: 'No data', met: true, pct: 100 };
  }
  const responseTimes = tickets.map(firstResponseMinutes).filter((m): m is number => m != null);
  const metCount = responseTimes.filter(m => m <= targetMinutes).length;
  const pct = Math.round((metCount / tickets.length) * 100);
  const avgMin = responseTimes.length ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : null;
  const current = avgMin == null ? 'Pending' : avgMin < 60 ? `${Math.round(avgMin)}m` : `${(avgMin / 60).toFixed(1)}h`;
  return { metric, target: targetLabel, current, met: pct >= 80, pct };
}

// GET /api/client/dashboard-summary
router.get('/dashboard-summary', requireAuth, requireRole(['CLIENT', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const now = new Date();
    const weekOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [projects, tickets, milestones, meetings, tasks, acceptedDeliverables, invoices, approvedChanges] = await Promise.all([
      prisma.project.findMany({
        where: { clientId: userId },
        select: {
          id: true, title: true, progress: true, budget: true, spend: true,
          lead: { select: { id: true, name: true, role: true } },
          partner: { select: { id: true, name: true, role: true } },
        },
      }),
      prisma.ticket.findMany({
        where: { clientId: userId },
        select: {
          priority: true, status: true, createdAt: true,
          messages: { select: { createdAt: true, sender: { select: { role: true } } }, orderBy: { createdAt: 'asc' } },
        },
      }),
      prisma.projectMilestone.findMany({
        where: { project: { clientId: userId }, dueDate: { gte: now, lte: weekOut }, status: { not: 'completed' } },
        select: { title: true, dueDate: true, status: true, project: { select: { title: true } } },
        orderBy: { dueDate: 'asc' },
      }),
      prisma.meeting.findMany({
        where: { clientId: userId, startTime: { gte: now, lte: weekOut } },
        select: { title: true, startTime: true },
        orderBy: { startTime: 'asc' },
      }),
      prisma.task.findMany({
        where: { clientId: userId, dueDate: { gte: now, lte: weekOut }, status: { notIn: ['completed', 'done'] } },
        select: { title: true, dueDate: true, project: { select: { title: true } } },
        orderBy: { dueDate: 'asc' },
      }),
      prisma.deliverable.findMany({
        where: { clientId: userId, status: 'ACCEPTED' },
        select: { title: true, dueDate: true, approvedAt: true },
      }),
      prisma.invoice.findMany({
        where: { clientId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { invoiceNumber: true, amount: true, createdAt: true },
      }),
      prisma.changeRequest.findMany({
        where: { clientId: userId, status: 'APPROVED' },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { title: true, updatedAt: true },
      }),
    ]);

    // ── Team: distinct leads/partners across the client's projects ──
    const teamMap = new Map<string, { id: string; name: string; role: string; project: string; initials: string; color: string }>();
    for (const p of projects) {
      for (const person of [p.lead, p.partner]) {
        if (!person || teamMap.has(person.id)) continue;
        teamMap.set(person.id, {
          id: person.id,
          name: person.name,
          role: TEAM_ROLE_LABEL[person.role] ?? 'Team Member',
          project: p.title,
          initials: person.name.split(' ').map(n => n[0] ?? '').join('').slice(0, 2).toUpperCase(),
          color: TEAM_PALETTE[teamMap.size % TEAM_PALETTE.length],
        });
      }
    }
    const team = Array.from(teamMap.values()).slice(0, 6);

    // ── SLA: ticket first-response time + deliverable/ticket outcomes ──
    const highTickets = tickets.filter(t => ['CRITICAL', 'HIGH'].includes((t.priority || '').toUpperCase()));
    const stdTickets = tickets.filter(t => !['CRITICAL', 'HIGH'].includes((t.priority || '').toUpperCase()));
    const highSla = bucketSla(highTickets, SLA_RESPONSE_MINUTES.HIGH, 'High-Priority Response', '< 4h');
    const stdSla = bucketSla(stdTickets, SLA_RESPONSE_MINUTES.MEDIUM, 'Standard Response', '< 24h');

    const dueDeliverables = acceptedDeliverables.filter(d => d.dueDate);
    const onTimeCount = dueDeliverables.filter(d => d.approvedAt && d.dueDate && d.approvedAt <= d.dueDate).length;
    const deliveryPct = dueDeliverables.length ? Math.round((onTimeCount / dueDeliverables.length) * 100) : 100;
    const deliverySla = {
      metric: 'Deliverable On-Time', target: '90%',
      current: dueDeliverables.length ? `${deliveryPct}%` : 'No data',
      met: deliveryPct >= 90, pct: deliveryPct,
    };

    const resolvedCount = tickets.filter(t => ['RESOLVED', 'CLOSED'].includes((t.status || '').toUpperCase())).length;
    const resolutionPct = tickets.length ? Math.round((resolvedCount / tickets.length) * 100) : 100;
    const resolutionSla = {
      metric: 'Ticket Resolution', target: '95%',
      current: tickets.length ? `${resolutionPct}%` : 'No data',
      met: resolutionPct >= 95, pct: resolutionPct,
    };

    const sla = [highSla, stdSla, deliverySla, resolutionSla];

    // ── This week: milestones, meetings, and tasks due in the next 7 days ──
    const thisWeek = [
      ...milestones.map(m => ({
        type: 'milestone', title: m.title, date: m.dueDate.toISOString(),
        project: m.project.title, urgent: m.status === 'delayed', color: '#2564ea',
      })),
      ...meetings.map(m => ({
        type: 'meeting', title: m.title, date: m.startTime.toISOString(),
        project: 'Meeting', urgent: false, color: '#7f53f9',
      })),
      ...tasks.filter(t => t.dueDate).map(t => ({
        type: 'task', title: t.title, date: t.dueDate!.toISOString(),
        project: t.project.title, urgent: t.dueDate!.getTime() - now.getTime() < 2 * 24 * 60 * 60 * 1000, color: '#e2445c',
      })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 6);

    // ── Recent activity: deliverables, invoices, approved changes ──
    const activity = [
      ...acceptedDeliverables.filter(d => d.approvedAt).map(d => ({
        title: `${d.title} delivered`, date: d.approvedAt!.toISOString(), color: '#2564ea',
      })),
      ...invoices.map(i => ({
        title: `Invoice ${i.invoiceNumber} issued — ₹${Number(i.amount).toLocaleString('en-IN')}`,
        date: i.createdAt.toISOString(), color: '#fdab3d',
      })),
      ...approvedChanges.map(c => ({
        title: `Change request "${c.title}" approved`, date: c.updatedAt.toISOString(), color: '#00c875',
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    // ── Engagement ring dimensions ──
    const deliveryPace = projects.length
      ? Math.round(projects.reduce((s, p) => s + (p.progress ?? 0), 0) / projects.length)
      : 0;
    const slaPcts = [highSla, stdSla].map(s => s.pct);
    const slaCompliance = Math.round(slaPcts.reduce((a, b) => a + b, 0) / slaPcts.length);
    const respondedTickets = tickets.filter(t => t.messages.some(m => m.sender.role !== 'CLIENT')).length;
    const communication = tickets.length ? Math.round((respondedTickets / tickets.length) * 100) : 100;
    const projectsWithBudget = projects.filter(p => Number(p.budget ?? 0) > 0);
    const budgetHealth = projectsWithBudget.length
      ? Math.round(100 - projectsWithBudget.reduce((s, p) => {
          const overrun = Math.max(0, (Number(p.spend ?? 0) - Number(p.budget ?? 0)) / Number(p.budget ?? 1) * 100);
          return s + Math.min(overrun, 100);
        }, 0) / projectsWithBudget.length)
      : 100;

    res.json({
      team,
      sla,
      thisWeek,
      activity,
      engagement: {
        deliveryPace,
        slaCompliance,
        communication,
        budgetHealth,
        sprintVelocity: deliveryPct,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
