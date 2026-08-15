import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { notifyGovernanceRole, createNotification } from '../kangqore-view/awareness/notifications/NotificationService';
import { notifyClient } from '../kangqore-view/eaf/channels/ClientEmailService';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
import accountabilityService from '../kangqore-view/kore/AccountabilityService';
import { createAuditLog, AUDIT_ACTIONS, extractRequestMetadata } from '../kangqore-view/kernel/audit/AuditService';

const router = Router();

// GET /api/change-requests
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, clientId } = req.query;
    const user = req.user!;

    const where: any = {};
    if (user.role === 'CLIENT') {
        where.clientId = user.id;
    } else if (user.role === 'ADMIN') {
        if (clientId) where.clientId = clientId as string;
    }
    
    if (projectId) where.projectId = projectId as string;

    const changeRequests = await prisma.changeRequest.findMany({
      where,
      include: {
        project: { select: { title: true } },
        approvingDecisions: { // Gap 3: Context Linking
            select: { id: true, title: true, status: true }
        },
        invoice: { select: { id: true, invoiceNumber: true, amount: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ changeRequests });
  } catch (error) { next(error); }
});

// POST /api/change-requests (Client or Admin proposes change)
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, priority, projectId, costImpact, timeImpact, rejectionImpact } = req.body as any;
    const userId = req.user!.id;

    // Logic to ensure projectId is valid and user has access
    // For now, assume validated or add check

    const cr = await prisma.changeRequest.create({
      data: {
        title,
        description,
        decisionType: req.body.decisionType || 'Operational', // Required field
        priority: priority || 'MEDIUM',
        projectId,
        clientId: req.user!.role === 'CLIENT' ? userId : req.body.clientId, // If Admin, must supply clientId
        requestedBy: req.user!.name || 'Client', // Improved
        costImpact: costImpact ? Number(costImpact) : null,
        timeImpact,
        rejectionImpact
      }
    });

    // Gap 7: Budget Authority Trigger
    if (costImpact && Number(costImpact) > 0) {
        // Notify the 'SPONSOR' (or equivalent budget holder)
        const targetClient = req.user!.role === 'CLIENT' ? userId : req.body.clientId;
        await notifyGovernanceRole(targetClient, { type: 'AUTHORITY', levelOrRole: 'SPONSOR' }, `Cost Impacting Change Request: ${title}`, `/kangqore-view/client/change-requests`);
    }

    // Gap 2: Auto-Create Obligation
    // Create Event first
    const event = await accountabilityService.createAccountabilityEvent({
        eventType: 'CHANGE_REQUESTED',
        eventCategory: 'REQUEST',
        projectId,
        clientId: req.user!.role === 'CLIENT' ? userId : req.body.clientId,
        userId: req.user!.id,
        changeRequestId: cr.id,
        actionTaken: 'Requested',
        impactSummary: `Cost: ${costImpact || 0}`,
        eventSource: 'DASHBOARD',
        actorRole: req.user!.role === 'ADMIN' ? 'ADMIN' : 'CLIENT',
        relatedEntityType: 'CHANGE_REQUEST',
        relatedEntityId: cr.id,
        summary: `Change request submitted: ${title}`
    });

    // Create System Audit Log
    const metadata = extractRequestMetadata(req);
    await createAuditLog({
      userId: req.user!.id,
      action: AUDIT_ACTIONS.CHANGE_REQUEST_SUBMITTED,
      resource: `ChangeRequest:${cr.id}`,
      newValue: {
        title,
        priority,
        costImpact,
        timeImpact
      },
      ...metadata
    });

    // If Admin requested, Client owes approval. If Client requested, Admin owes approval.
    const owedByRole: any = req.user!.role === 'ADMIN' ? 'CLIENT' : 'ADMIN';

    await accountabilityService.createObligation({
        clientId: req.user!.role === 'CLIENT' ? userId : req.body.clientId,
        projectId,
        obligationType: 'APPROVAL_REQUIRED' as any,
        owedByRole: owedByRole,
        description: `Authorize Change Request: ${title}`,
        dueDate: undefined, // CRs usually don't have due dates immediately?
        linkedEventId: event.id
    });

    res.status(201).json(cr);
  } catch (error) { next(error); }
});

// PATCH /api/change-requests/:id/status (Client/Admin Authorizes Change)
router.patch('/:id/status', authenticate, authorize(['ADMIN', 'CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body; // APPROVED, REJECTED

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const where: any = { id };
    // Security: Only allow Client to update their own change requests
    if (req.user!.role === 'CLIENT') {
      where.clientId = req.user!.id;
    }

    const existingCR = await prisma.changeRequest.findFirst({ where }); // Get BEFORE update for Audit

    const changeRequest = await prisma.changeRequest.updateMany({
      where,
      data: { status }
    });

    if (changeRequest.count === 0) {
      return res.status(404).json({ error: 'Change request not found' });
    }

    // Get full change request for accountability event
    const updatedCR = await prisma.changeRequest.findFirst({ where });

    // Create System Audit Log
    if (updatedCR) {
        const metadata = extractRequestMetadata(req);
        await createAuditLog({
            userId: req.user!.id,
            action: status === 'APPROVED' ? AUDIT_ACTIONS.CHANGE_REQUEST_APPROVED : AUDIT_ACTIONS.CHANGE_REQUEST_REJECTED,
            resource: `ChangeRequest:${updatedCR.id}`,
            oldValue: { status: existingCR?.status },
            newValue: { status, note },
            ...metadata
        });
    }

    // Create Accountability Event (Canonical)
    if (updatedCR && (status === 'APPROVED' || status === 'REJECTED')) {
      const event = await accountabilityService.createAccountabilityEvent({
        eventType: status === 'APPROVED' ? 'CHANGE_AUTHORIZED' : 'CHANGE_REJECTED',
        eventCategory: status === 'APPROVED' ? 'COMMITMENT' : 'WITHDRAWAL',
        projectId: updatedCR.projectId,
        clientId: updatedCR.clientId,
        userId: req.user!.id,
        // Legacy
        changeRequestId: updatedCR.id,
        actionTaken: status === 'APPROVED' ? 'Authorized' : 'Rejected',
        impactSummary: `Cost: $${updatedCR.costImpact || 0}, Time: ${updatedCR.timeImpact || 'N/A'}`,
        commitmentNote: note || null,
        ipAddress: req.ip, // Use req.ip directly since we are in router
        // Canonical
        eventSource: 'DASHBOARD',
        actorRole: 'CLIENT',
        relatedEntityType: 'CHANGE_REQUEST',
        relatedEntityId: updatedCR.id,
        summary: `Client authorized change request: ${updatedCR.title}`
      });

      // Record Cost Impact
      if (status === 'APPROVED' && updatedCR.costImpact) {
        await accountabilityService.recordImpact({
            eventId: event.id,
            impactType: 'COST_INCREASE',
            impactValue: Number(updatedCR.costImpact),
            impactUnit: 'USD',
            appliedTo: 'BUDGET'
        });
      }

      // Record Timeline Impact
      if (status === 'APPROVED' && updatedCR.timeImpact) {
         // Parse "2 weeks" -> 14 days
         const days = parseInt(updatedCR.timeImpact) * (updatedCR.timeImpact.includes('week') ? 7 : 1);
         if (!isNaN(days)) {
            await accountabilityService.recordImpact({
                eventId: event.id,
                impactType: 'DELAY_DAYS',
                impactValue: days,
                impactUnit: 'DAYS',
                appliedTo: 'TIMELINE'
            });
         }
      }
    }

    // Notify client when admin approves or rejects their change request
    if (updatedCR && req.user!.role === 'ADMIN' && (status === 'APPROVED' || status === 'REJECTED')) {
      await createNotification({
        userId: updatedCR.clientId,
        title: status === 'APPROVED' ? 'Change request approved' : 'Change request declined',
        message: status === 'APPROVED'
          ? `Your change request "${updatedCR.title}" has been approved.`
          : `Your change request "${updatedCR.title}" was not approved. Please contact your account manager.`,
        type: status === 'APPROVED' ? 'SUCCESS' : 'WARNING',
        link: '/kangqore-view/client/change-requests',
      });
      await notifyClient(updatedCR.clientId, {
        type: 'CHANGE_REQUEST_UPDATE',
        crTitle: updatedCR.title,
        crStatus: status as 'APPROVED' | 'REJECTED',
      });
    }

    res.json({ success: true, status });
  } catch (error) { next(error); }
});

// ── Two-way messaging ─────────────────────────────────────────────────────────

// GET /api/change-requests/:id/messages
router.get('/:id/messages', authenticate, authorize(['CLIENT', 'ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId  = req.user!.id;
    const role    = req.user!.role;

    // Verify access: client can only see their own CR messages
    const cr = await prisma.changeRequest.findUnique({ where: { id }, select: { clientId: true } });
    if (!cr) return res.status(404).json({ error: 'Change request not found' });
    if (role === 'CLIENT' && cr.clientId !== userId) return res.status(403).json({ error: 'Access denied' });

    const messages = await prisma.changeRequestMessage.findMany({
      where: { changeRequestId: id },
      include: { sender: { select: { id: true, name: true, role: true, avatarUrl: true } } },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ messages });
  } catch (error) { next(error); }
});

// POST /api/change-requests/:id/messages
router.post('/:id/messages', authenticate, authorize(['CLIENT', 'ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id }      = req.params;
    const { content } = req.body;
    const userId      = req.user!.id;
    const role        = req.user!.role;

    if (!content?.trim()) return res.status(400).json({ error: 'Content required' });

    const cr = await prisma.changeRequest.findUnique({ where: { id }, select: { clientId: true, title: true } });
    if (!cr) return res.status(404).json({ error: 'Change request not found' });
    if (role === 'CLIENT' && cr.clientId !== userId) return res.status(403).json({ error: 'Access denied' });

    const message = await prisma.changeRequestMessage.create({
      data: { changeRequestId: id, senderId: userId, content: content.trim() },
      include: { sender: { select: { id: true, name: true, role: true, avatarUrl: true } } },
    });

    // Notify the other party
    if (role === 'ADMIN') {
      await createNotification({
        userId: cr.clientId,
        title: 'New message on your change request',
        message: `Reply on "${cr.title}"`,
        type: 'INFO',
        link: '/kangqore-view/client/change-requests',
      });
    }

    res.status(201).json({ message });
  } catch (error) { next(error); }
});

export default router;
