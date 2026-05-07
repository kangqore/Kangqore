import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';

const router = Router();

// GET /api/reports/executive-summary
router.get('/executive-summary', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id; // Client ID
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const fourteenDaysAhead = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));

    // 1. Health Calculation (Reusing Logic from Dashboard for Consistency)
    const [criticalRisks, highRisks, overdueTasks] = await Promise.all([
        prisma.risk.count({ where: { clientId: userId, status: 'OPEN', severity: 'CRITICAL', isClientVisible: true } }),
        prisma.risk.count({ where: { clientId: userId, status: 'OPEN', severity: 'HIGH', isClientVisible: true } }),
        prisma.task.count({ where: { clientId: userId, status: { not: 'done' }, dueDate: { lt: now } } })
    ]);

    // const overdueTasks = 0; // Disabled due to schema limitation

    let healthScore = 100 - (criticalRisks * 10) - (highRisks * 5) - (overdueTasks * 5);
    if (healthScore < 0) healthScore = 0;
    
    let healthStatus = 'Healthy';
    if (healthScore < 80) healthStatus = 'Watch';
    if (healthScore < 60) healthStatus = 'At Risk';
    
    // Upcoming Milestones (What's Next?)
    // Using Deliverables as milestones for now
    const milestones = await prisma.deliverable.findMany({
        where: {
            clientId: userId,
            status: { not: 'completed' },
            dueDate: { lte: fourteenDaysAhead } 
        },
        orderBy: { dueDate: 'asc' }
    });

    // 2. Fetch Narrative Data (Accountability Events as Source of Truth)
    const events = await prisma.accountabilityEvent.findMany({
        where: {
            clientId: userId,
            eventTimestamp: { gte: sevenDaysAgo },
            eventCategory: { in: ['RISK', 'DECISION', 'DELIVERABLE', 'ALERT'] } // Focus on key categories
        },
        orderBy: { eventTimestamp: 'desc' }
    });

    // Restore: Fetch specific entities for detail sections
    const decisions = await prisma.decision.findMany({
        where: { 
            clientId: userId, 
            status: 'APPROVED',
            approvedAt: { gte: sevenDaysAgo }
        },
        include: { approver: { select: { name: true, authorityRole: true } } },
        orderBy: { approvedAt: 'desc' }
    });

    const activeRisks = await prisma.risk.findMany({
        where: { 
            clientId: userId, 
            status: 'OPEN', 
            severity: { in: ['CRITICAL', 'HIGH'] },
            isClientVisible: true
        },
        orderBy: { severity: 'asc' }
    });

    // 2a. Generate Auto-Summary from Events
    const riskEvents = events.filter(e => e.eventCategory === 'RISK');
    const decisionEvents = events.filter(e => e.eventCategory === 'DECISION');
    const alertEvents = events.filter(e => e.eventCategory === 'ALERT');

    let narrativeSummary = `Activity in the last 7 days includes ${events.length} key governance events.`;
    if (riskEvents.length > 0) {
        narrativeSummary += ` ${riskEvents.length} risk updates were recorded, with focus on mitigation.`;
    }
    if (decisionEvents.length > 0) {
        narrativeSummary += ` ${decisionEvents.length} strategic decisions were made.`;
    }
    if (alertEvents.length > 0) {
        const delays = alertEvents.filter(e => e.eventType === 'OBLIGATION_MISSED').length;
        if (delays > 0) narrativeSummary += ` NOTE: ${delays} delays occurred that may impact timeline.`;
    }

    // 3. Construct Report
    const report = {
        meta: {
            generatedAt: now,
            period: 'Weekly Executive Summary',
            client: req.user!.name || req.user!.company
        },
        health: {
            score: healthScore,
            status: healthStatus,
            factors: {
                criticalRisks,
                highRisks,
                overdueTasks
            }
        },
        narrative: {
            summary: narrativeSummary,
            timeline: events.map(e => ({
                id: e.id,
                date: e.eventTimestamp,
                type: e.eventCategory,
                title: e.summary,
                detail: e.impactSummary || e.actionTaken,
                actor: e.actorRole
            })),
            decisions: decisions.map(d => ({
                id: d.id,
                title: d.title,
                approvedBy: d.approver?.name || 'Unknown',
                role: d.approvalRole || 'Authority',
                date: d.approvedAt
            })),
            risks: activeRisks.map(r => ({
                id: r.id,
                title: r.title,
                severity: r.severity,
                impact: r.description
            })),
            lookahead: milestones.map(m => ({
                id: m.id,
                title: m.title,
                dueDate: m.createdAt // Proxy
            }))
        }
    };

    res.json(report);

  } catch (error) { next(error); }
});

export default router;
