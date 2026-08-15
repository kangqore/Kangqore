import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
import accountabilityService from '../services/AccountabilityService';
import { createAuditLog } from '../services/audit.service';

const router = Router();

// GET /api/decisions
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, clientId } = req.query;
    const user = req.user!;

    const where: any = {};
    if (user.role === 'CLIENT') {
        where.clientId = user.id;
        // Clients shouldn't see DRAFT decisions? Maybe pending ones.
        // where.status = { not: 'DRAFT' };  <-- Optional rule
    } else if (user.role === 'ADMIN') {
        if (clientId) where.clientId = clientId as string;
    }
    
    if (projectId) where.projectId = projectId as string;

    const decisions = await prisma.decision.findMany({
      where,
      include: {
        project: { select: { title: true } },
        approver: { select: { name: true, authorityRole: true } },


        risk: { select: { id: true, title: true } }, // Gap 3
        changeRequest: { select: { id: true, title: true } } // Gap 3
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ decisions });
  } catch (error) { next(error); }
});

// POST /api/decisions (Admin proposes decision)
router.post('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, priority, dueDate, projectId, clientId, impactTime, impactCost, impactRisk, rationale, tradeoffs } = req.body as any;

    const decision = await prisma.decision.create({
      data: {
        title,
        description,
        status: 'PENDING_APPROVAL', // Default to pending so client sees it
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        projectId,
        clientId,
        impactTime,
        impactCost,
        impactRisk,
        rationale, 
        tradeoffs
      } as any // Bypass strict typing until Prisma client updates fully
    });

    // Gap 2: Auto-Create Obligation
    // 1. Create Accountability Event FIRST (Canonical)
    const event = await accountabilityService.createAccountabilityEvent({
        eventType: 'DECISION_PROPOSED',
        eventCategory: 'REQUEST',
        projectId,
        clientId,
        userId: req.user!.id,
        // Legacy
        decisionId: decision.id,
        actionTaken: 'Proposed',
        impactSummary: 'Pending Approval',
        // Canonical
        eventSource: 'DASHBOARD',
        actorRole: 'ADMIN',
        relatedEntityType: 'DECISION',
        relatedEntityId: decision.id,
        summary: `Decision proposed: ${title}`
    });

    // 2. Create Obligation for Client linked to Event
    await accountabilityService.createObligation({
        clientId,
        projectId,
        obligationType: 'APPROVAL_REQUIRED' as any,
        owedByRole: 'CLIENT',
        description: `Approve Decision: ${title}`,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        linkedEventId: event.id
    });

    res.status(201).json(decision);
  } catch (error) { next(error); }

});

// PUT /api/decisions/:id (Admin updates details - IMMUTABLE CHECK)
router.put('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, impactTime, impactCost, impactRisk } = req.body;

    // Check Immutability
    const current = await prisma.decision.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'Decision not found' });
    
    if (current.status === 'APPROVED') {
        return res.status(403).json({ 
            error: 'Immutable Record: Cannot edit a Decision after it has been formally approved.' 
        });
    }

    const decision = await prisma.decision.update({
        where: { id },
        data: { 
            title, 
            description, 
            priority, 
            dueDate: dueDate ? new Date(dueDate) : undefined,
            impactTime, 
            impactCost, 
            impactRisk 
        }
    });

    res.json(decision);
  } catch (error) { next(error); }
});

// PATCH /api/decisions/:id/status (Client Approves/Rejects)
router.patch('/:id/status', authenticate, authorize(['ADMIN', 'CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, approvalRole } = req.body; // APPROVED, REJECTED + Role

    if (!['APPROVED', 'REJECTED', 'PENDING_APPROVAL'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const where: any = { id };
    // Security: Only allow Client to update their own decisions
    if (req.user!.role === 'CLIENT') {
        where.clientId = req.user!.id;
    }

    const updateData: any = { status };
    if (status === 'APPROVED') {
        updateData.approverId = req.user!.id; // Link to user
        updateData.approvedAt = new Date();
        
        // Gap 1: Authority Context
        // Try to get explicit role from body, else fallback to user's profile authorityRole
        if (approvalRole) {
            updateData.approvalRole = approvalRole;
        } else {
            // Fetch user to get their authorityRole
            const ApproverUser = await prisma.user.findUnique({
                 where: { id: req.user!.id },
                 select: { authorityRole: true } 
            });
            updateData.approvalRole = ApproverUser?.authorityRole || "Authorized Signatory";
        }
    }

    const decision = await prisma.decision.updateMany({
      where,
      data: updateData
    });

    if (decision.count === 0) return res.status(404).json({ error: 'Decision not found' });
    
    // Get the full decision details for accountability event
    const updatedDecision = await prisma.decision.findFirst({ where });

    // Create Accountability Event (Canonical)
    if (updatedDecision && (status === 'APPROVED' || status === 'REJECTED')) {
      const eventType = status === 'APPROVED' ? 'DECISION_MADE' : 'DECISION_DELAYED'; // Or DECISION_REJECTED if available? User listed DECISION_MADE only. 
      // Actually, if rejected, it might be DECISION_MADE (outcome=Rejected) or just no event? 
      // User list has: DECISION_MADE, DECISION_DELAYED. 
      // Let's use DECISION_MADE for both, with summary clarifying.
      
      // System Audit Log
      await createAuditLog({
        userId: req.user!.id,
        action: status === 'APPROVED' ? 'DECISION_APPROVED' : 'DECISION_REJECTED',
        resource: `Decision: ${updatedDecision.title}`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { decisionId: id, status, note: req.body.note }
      } as any);

      const event = await accountabilityService.createAccountabilityEvent({
        eventType: 'DECISION_MADE',
        eventCategory: status === 'APPROVED' ? 'COMMITMENT' : 'WITHDRAWAL',
        projectId: updatedDecision.projectId,
        clientId: updatedDecision.clientId,
        userId: req.user!.id,
        // Legacy
        decisionId: updatedDecision.id,
        actionTaken: status === 'APPROVED' ? 'Approved' : 'Rejected',
        impactSummary: `Time: ${updatedDecision.impactTime || 'N/A'}, Cost: ${updatedDecision.impactCost || 'N/A'}, Risk: ${updatedDecision.impactRisk || 'N/A'}`,
        commitmentNote: req.body.note || null,
        ipAddress: req.ip,
        // Canonical
        eventSource: 'DASHBOARD', // Assuming UI trigger
        actorRole: 'CLIENT', // Assuming Client approves
        relatedEntityType: 'DECISION',
        relatedEntityId: updatedDecision.id,
        summary: `Client ${status.toLowerCase()} decision: ${updatedDecision.title}`
      });

      // Record Impacts (Quantified) if Approved
      if (status === 'APPROVED' && updatedDecision.impactTime) {
         // Parse "2 weeks" -> 14 days
         const days = parseInt(updatedDecision.impactTime) * (updatedDecision.impactTime.includes('week') ? 7 : 1);
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
      
      if (status === 'APPROVED' && updatedDecision.impactCost) {
         // Parse "$5000" -> 5000
         const cost = parseInt(updatedDecision.impactCost.replace(/[^0-9]/g, ''));
         if (!isNaN(cost)) {
            await accountabilityService.recordImpact({
                eventId: event.id,
                impactType: 'COST_INCREASE',
                impactValue: cost,
                impactUnit: 'USD', // Defaulting to USD for MVP parsing
                appliedTo: 'BUDGET'
            });
         }
      }

      // Resolve the original obligation
      const obligations = await accountabilityService.getProjectObligations(updatedDecision.projectId, 'OPEN');
      const pendingObligation = obligations.find((o: any) => 
          o.obligationType === 'APPROVAL_REQUIRED' && 
          o.description.includes(updatedDecision.title)
      );
      
      if (pendingObligation) {
          await accountabilityService.resolveObligation(pendingObligation.id);
      }
    }

    res.json({ success: true, status });

    // Gap 3: Auto-Update Logic (Post-Response Async)
    if (status === 'APPROVED') {
        const approvedDecisions = await prisma.decision.findMany({ 
            where: { id: { in: (where as any).id ? [(where as any).id] : (decision as any).map((d: any) => d.id) } }, // Handle updateMany result vs ID
            include: { changeRequest: true }
        });

        for (const d of approvedDecisions) {
            if (d.changeRequestId && d.changeRequest) {
                // 1. Auto-Approve Change Request
                const cr = await prisma.changeRequest.update({
                    where: { id: d.changeRequestId },
                    data: { status: 'APPROVED' }
                });

                // 2. Auto-Update Project Budget/Timeline
                if (cr.projectId) {
                    const project = await prisma.project.findUnique({ where: { id: cr.projectId } });
                    
                    const updates: any = {};
                    let hasUpdates = false;

                    // Update Budget
                    if (cr.costImpact && Number(cr.costImpact) > 0) {
                        const currentBudget = project?.budget ? Number(project.budget) : 0;
                        updates.budget = currentBudget + Number(cr.costImpact);
                        hasUpdates = true;
                    }

                    // Update Timeline (Heuristic: Only if timeImpact describes an extension)
                    // For MVP, we won't try to parse natural language like "2 weeks" into value.
                    // Instead, we might just append a note to constraints if we could, but let's stick to budget for now as it is deterministic.
                    
                    if (hasUpdates) {
                        await prisma.project.update({
                            where: { id: cr.projectId },
                            data: updates
                        });
                        console.log(`[GAP 3] Auto-updated Project ${cr.projectId} budget via CR ${cr.id}`);
                    }
                }
            }
        }
    }
  } catch (error) { next(error); }
});

// POST /api/decisions/:id/view (Track Client Viewing Decision)
router.post('/:id/view', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { duration } = req.body; // Optional: Duration in seconds

    await prisma.decisionView.create({
        data: {
            decisionId: id,
            userId,
            duration: duration || 0
        }
    });

    res.status(200).json({ success: true });
  } catch (error) { next(error); }
});

// POST /api/decisions/:id/acknowledge (Client Acknowledges Transparency)
router.post('/:id/acknowledge', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        
        // Use user's name or email as signature
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const signature = user?.name || user?.email || "Client User";

        const decision = await prisma.decision.update({
            where: { id, clientId: userId }, // Security: ensure client owns it
            data: {
                acknowledgedAt: new Date(),
                acknowledgedBy: signature
            } as any
        });

        res.json({ success: true, decision });
    } catch (error) { next(error); }
});

export default router;
