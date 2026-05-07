import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';

const router = Router();

/**
 * GET /api/client/metrics/health
 * Aggregates high-level health scores for the Executive Dashboard
 */
router.get('/health', authenticate, authorize(['CLIENT', 'ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { clientId } = req.query; // Admin can view specific client

    const targetClientId = req.user!.role === 'CLIENT' ? userId : (clientId as string);
    if (!targetClientId) return res.status(400).json({ error: 'Client ID required' });

    // 1. Fetch Active Projects
    const projects = await prisma.project.findMany({
        where: { clientId: targetClientId, status: 'ACTIVE' },
        include: {
            deliverables: true,
            risks: true
        }
    });

    // 2. Calculate Health Dimensions
    let totalProjects = projects.length;
    let scheduleHealthString = 'GREEN';
    let budgetHealthString = 'GREEN';
    let riskHealthString = 'GREEN';

    let overdueDeliverables = 0;
    let totalDeliverables = 0;
    let highRisks = 0;
    let totalBudget = 0; // Sum of project budgets (Gap 3)
    let totalSpend = 0;  // Sum of invoiced amounts (Gap 3/4)

    // Parallelize Invoice fetch for budget calc?
    // Let's actually do a separate aggregation for invoices to get Total Spend
    const invoices = await prisma.invoice.findMany({
        where: { clientId: targetClientId, status: { not: 'CANCELLED' } }
    });
    totalSpend = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

    for (const p of projects) {
        // Schedule: Check overdue deliverables
        totalDeliverables += p.deliverables.length;
        const overdue = p.deliverables.filter(d => d.status !== 'completed' && d.qualityGateStatus !== 'PASSED'); 
        // Logic for "Overdue": We need a dueDate on Deliverable? 
        // Schema check: Deliverable doesn't have explicit dueDate? 
        // Task has dueDate. Deliverable might rely on Project dueDate.
        // For MVP: Let's use "Pending Deliverables created > 30 days ago" as a heuristic for "Stale/Overdue" 
        // or check if Project is overdue.
        // Let's rely on Project Due Date (Gap 3).
        if (p.dueDate && new Date() > p.dueDate && p.status === 'ACTIVE') {
            overdueDeliverables += 1; // Count the project as drifting
        }

        // Budget: Sum Cost
        if (p.budget) {
            totalBudget += Number(p.budget);
        }

        // Risks
        const criticals = p.risks.filter(r => r.status === 'OPEN' && (r.severity === 'HIGH' || r.severity === 'CRITICAL'));
        highRisks += criticals.length;
    }

    // 3. Stale Decisions (Gap 8)
    const staleDecisions = await prisma.decision.count({
        where: { 
            clientId: targetClientId, 
            status: 'PENDING_APPROVAL',
            createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
    });

    // 4. Determine status colors
    if (highRisks > 0) riskHealthString = highRisks > 3 ? 'RED' : 'AMBER';
    
    // Budget Health: If Spend > 90% of Budget -> Amber, > 100% -> Red
    if (totalBudget > 0) {
        const ratio = totalSpend / totalBudget;
        if (ratio > 1.0) budgetHealthString = 'RED';
        else if (ratio > 0.9) budgetHealthString = 'AMBER';
    }

    // Schedule Health: If any project is overdue -> Red
    // OR if client is blocking decisions (Sanitized Translation)
    if (overdueDeliverables > 0) scheduleHealthString = 'RED';
    if (staleDecisions > 0 && scheduleHealthString !== 'RED') scheduleHealthString = 'AMBER';

    // Generate Sanitized Narrative (The Translation Layer)
    const narrative = {
        schedule: {
            status: scheduleHealthString === 'RED' ? 'Action Required' : (scheduleHealthString === 'AMBER' ? 'Needs Attention' : 'On Track'),
            message: overdueDeliverables > 0 
                ? `${overdueDeliverables} Milestone(s) Overdue` 
                : (staleDecisions > 0 ? `${staleDecisions} Decision(s) Pending Review` : 'Delivery behaving as expected')
        },
        budget: {
            status: budgetHealthString === 'RED' ? 'Review Needed' : (budgetHealthString === 'AMBER' ? 'Approaching Limit' : 'Stable'),
            message: budgetHealthString === 'RED' ? 'Spend exceeds budget' : (budgetHealthString === 'AMBER' ? '>90% Budget Utilized' : 'Spend within approved limits')
        },
        risk: {
            status: riskHealthString === 'RED' ? 'Critical Attention' : (riskHealthString === 'AMBER' ? 'Monitoring' : 'Controlled'),
            message: riskHealthString === 'RED' ? `${highRisks} Critical Item(s)` : (riskHealthString === 'AMBER' ? 'Risk Acknowledged & Managed' : 'No critical blockers')
        }
    };

    res.json({
        schedule: scheduleHealthString,
        budget: budgetHealthString,
        risk: riskHealthString,
        narrative,
        details: {
            activeProjects: totalProjects,
            overdueProjects: overdueDeliverables,
            highRisks,
            totalBudget,
            totalSpend,
            staleDecisions
        }
    });

  } catch (error) { next(error); }
});

/**
 * GET /api/client/metrics/roi
 * Calculates Investment (Spend) vs Value Realized
 */
router.get('/roi', authenticate, authorize(['CLIENT', 'ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { clientId } = req.query;
        const targetClientId = req.user!.role === 'CLIENT' ? userId : (clientId as string);
    
        // Investment = Total Paid/Sent Invoices
        const invoices = await prisma.invoice.findMany({
            where: { clientId: targetClientId, status: { not: 'CANCELLED' } }
        });
        const investment = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

        // Value Realized = (Percentage of Deliverables Completed) * (Total Budget)
        // This is a proxy for "Earned Value Management" (EVM)
        const projects = await prisma.project.findMany({
            where: { clientId: targetClientId },
            include: { deliverables: true }
        });

        let totalProjectBudget = 0;
        let totalEarnedValue = 0;

        for (const p of projects) {
            const pBudget = Number(p.budget || 0);
            if (pBudget > 0) {
                totalProjectBudget += pBudget;
                const totalDels = p.deliverables.length;
                if (totalDels > 0) {
                    // Count completed
                    const completed = p.deliverables.filter(d => 
                        d.status === 'completed' || d.qualityGateStatus === 'PASSED'
                    ).length;
                    const completionRatio = completed / totalDels;
                    totalEarnedValue += (pBudget * completionRatio);
                }
            }
        }

        res.json({
            investment, // Logic: Actual Spend
            valueRealized: totalEarnedValue, // Logic: Budget * %Complete
            roiPercentage: investment > 0 ? ((totalEarnedValue - investment) / investment) * 100 : 0
        });

    } catch (error) { next(error); }
});


/**
 * GET /api/client/metrics/velocity
 * Returns number of completed deliverables per month for the last 6 months
 */
router.get('/velocity', authenticate, authorize(['CLIENT', 'ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { clientId } = req.query;
        const targetClientId = req.user!.role === 'CLIENT' ? userId : (clientId as string);

        // Get deliverables completed in last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Aggregate by month using Prisma (or raw query if necessary, but manual agg is safer for DB compat)
        // Find deliverables where status is 'completed'
        // Need to check specific Projects or just all deliverables for client?
        // Let's go through projects -> deliverables
        const deliverables = await prisma.deliverable.findMany({
            where: {
                project: { clientId: targetClientId },
                status: 'completed',
                updatedAt: { gte: sixMonthsAgo } 
            },
            select: { updatedAt: true }
        });

        // Group by Month (YYYY-MM)
        const groups: Record<string, number> = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Initialize last 6 months with 0
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${months[d.getMonth()]} ${d.getFullYear().toString().substr(2)}`; // e.g. "Jan 26"
            groups[key] = 0;
        }

        deliverables.forEach(d => {
            const date = new Date(d.updatedAt);
            const key = `${months[date.getMonth()]} ${date.getFullYear().toString().substr(2)}`;
            if (groups[key] !== undefined) groups[key]++;
        });

        const chart = Object.keys(groups).map(month => ({
            month,
            delivered: groups[month]
        }));

        const totalItems = Object.values(groups).reduce((a, b) => a + b, 0);
        const average = parseFloat((totalItems / 6).toFixed(1));

        res.json({ chart, average });

    } catch (error) { next(error); }
});

/**
 * GET /api/client/metrics/perception
 * Internal Admin Metric: Calculates "Engagement Confidence" & Risk
 * Logic: Soft metrics like silence duration, pending approvals, and active risks.
 */
router.get('/perception', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { clientId } = req.query;
        if (!clientId) return res.status(400).json({ error: 'Client ID required for perception metrics' });

        const targetId = clientId as string;

        // 1. Fetch Key Data Points
        const [user, openRisks, pendingActions, approvedDecisions, staleDecisions] = await Promise.all([
            prisma.user.findUnique({
                where: { id: targetId },
                select: { lastLoginAt: true, name: true }
            }),
            prisma.risk.count({
                where: { clientId: targetId, status: 'OPEN', severity: { in: ['HIGH', 'CRITICAL'] } }
            }),
            prisma.task.count({
                where: { clientId: targetId, status: { not: 'done' }, title: { contains: '[ACTION]' } } 
            }),
            // Fetch last 10 approved decisions for latency Calc
            prisma.decision.findMany({
                where: { clientId: targetId, status: 'APPROVED' },
                select: { createdAt: true, approvedAt: true },
                take: 10,
                orderBy: { approvedAt: 'desc' }
            }),
            // Count decisions pending > 7 days
            prisma.decision.count({
                where: { 
                    clientId: targetId, 
                    status: 'PENDING_APPROVAL', 
                    createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
                }
            })
        ]);

        if (!user) return res.status(404).json({ error: 'Client not found' });

        // 2. Calculate Silence Duration
        const now = new Date();
        const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt) : new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // Default 30 days if never
        const silenceHours = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60));
        const silenceDays = Math.floor(silenceHours / 24);

        // Calculate Approval Latency & Trend (Gap 11)
        let totalLatencyMs = 0;
        let avgLatencyHours = 0;
        let latencyTrend = 'STABLE'; // Default
        
        if (approvedDecisions.length > 0) {
            const latencies = approvedDecisions.map(d => {
                if (d.approvedAt && d.createdAt) {
                    return (new Date(d.approvedAt).getTime() - new Date(d.createdAt).getTime());
                }
                return 0;
            }).filter(l => l > 0);

            if (latencies.length > 0) {
                totalLatencyMs = latencies.reduce((a, b) => a + b, 0);
                avgLatencyHours = Math.round((totalLatencyMs / latencies.length) / (1000 * 60 * 60));

                // Trend Logic: Compare most recent 3 vs previous
                if (latencies.length >= 4) {
                    const recentParams = latencies.slice(0, 2); // newest 2 (index 0 is newest due to desc sort)
                    const olderParams = latencies.slice(2); 
                    const recentAvg = recentParams.reduce((a,b)=>a+b,0) / recentParams.length;
                    const olderAvg = olderParams.reduce((a,b)=>a+b,0) / olderParams.length;

                    // 20% deviation threshold
                    if (recentAvg > olderAvg * 1.2) latencyTrend = 'SLOWING_DOWN';
                    else if (recentAvg < olderAvg * 0.8) latencyTrend = 'ACCELERATING';
                }
            }
        }

        // Calculate Heatmap (Active Days)
        const dayCounts = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 }; // Sun-Sat
        approvedDecisions.forEach(d => {
             if (d.approvedAt) {
                 const day = new Date(d.approvedAt).getDay();
                 // @ts-ignore
                 dayCounts[day]++;
             }
        });
        // Determine "Active" days (threshold: > 1 action)
        // @ts-ignore
        const activeDays = Object.keys(dayCounts).filter(d => dayCounts[d] > 0).map(d => parseInt(d));
        // Simple heuristic: If active on Mon(1)/Tue(2) vs Thu(4)/Fri(5)
        const earlyWeekActivity = (dayCounts[1] + dayCounts[2]);
        const lateWeekActivity = (dayCounts[4] + dayCounts[5]);
        const workPattern = earlyWeekActivity > lateWeekActivity ? 'EARLY_WEEK' : lateWeekActivity > earlyWeekActivity ? 'LATE_WEEK' : 'BALANCED';

        // 3. Calculate Confidence Score (Base 100)
        let score = 100;

        // Penalty: Silence (Disengagement)
        if (silenceDays > 3) score -= (silenceDays - 3) * 2; // -2 pts per day after 3 days
        if (silenceDays > 14) score -= 10; // Major penalty for 2 weeks ghosting

        // Penalty: Pending Dependencies (Bottleneck)
        score -= (pendingActions * 5);

        // Penalty: Open Risks (Frustration)
        score -= (openRisks * 10);
        
        // Penalty: Stale Decisions (Avoidance)
        score -= (staleDecisions * 15);

        // Cap score
        if (score < 0) score = 0;
        if (score > 100) score = 100;

        // 4. Determine Escalation Probability
        let escalationProb = 'Low';
        if (score < 75) escalationProb = 'Medium';
        if (score < 50) escalationProb = 'High';
        if (silenceDays > 7 && openRisks > 0) escalationProb = 'High'; // Ghosting + Risk = Churn Danger
        if (staleDecisions > 2) escalationProb = 'High'; // Avoidance pattern

        res.json({
            confidenceScore: score,
            escalationProbability: escalationProb,
            metrics: {
                silenceDays,
                pendingDependencies: pendingActions,
                criticalRisks: openRisks
            },
            engagementSignals: {
                avgApprovalHours: avgLatencyHours,
                staleDecisionsCount: staleDecisions,
                lastLogin: user.lastLoginAt
            }
        });

    } catch (error) { next(error); }
});

export default router;
