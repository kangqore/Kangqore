import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';

const router = Router();

/**
 * GET /api/admin/clients/:clientId/strategy
 * Aggregates Strategic Metrics for the Admin Client 360 View
 */
router.get('/:clientId/strategy', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { clientId } = req.params;

        // 1. TRUST METRICS
        // ----------------
        // A. Decision Latency: Avg time from Creation to Approval
        const decisions = await prisma.decision.findMany({
            where: { clientId, status: 'APPROVED', approvedAt: { not: null } },
            select: { createdAt: true, approvedAt: true }
        });

        let totalLatencyHours = 0;
        decisions.forEach(d => {
            if (d.approvedAt) {
                const diff = new Date(d.approvedAt).getTime() - new Date(d.createdAt).getTime();
                totalLatencyHours += diff / (1000 * 60 * 60);
            }
        });
        const avgDecisionLatency = decisions.length > 0 ? (totalLatencyHours / decisions.length / 24).toFixed(1) : 0; // In Days

        // B. Payment Hygiene: Avg time from Issue to Payment
        const invoices = await prisma.invoice.findMany({
            where: { clientId, status: 'PAID', paidAt: { not: null } },
            select: { issueDate: true, paidAt: true, amount: true }
        });

        let totalPaymentLatencyDays = 0;
        invoices.forEach(inv => {
            if (inv.paidAt) {
                const diff = new Date(inv.paidAt).getTime() - new Date(inv.issueDate).getTime();
                totalPaymentLatencyDays += diff / (1000 * 60 * 60 * 24);
            }
        });
        const avgPaymentDays = invoices.length > 0 ? (totalPaymentLatencyDays / invoices.length).toFixed(0) : 0;

        // C. Engagement Pulse: Last Login
        const clientUser = await prisma.user.findUnique({
            where: { id: clientId },
            select: { lastLoginAt: true }
        });


        // 2. COMMERCIAL 360
        // -----------------
        // A. Lifetime Value (Sum of Budget of all Projects)
        const projects = await prisma.project.findMany({
            where: { clientId },
            select: { budget: true, status: true, changeRequests: { where: { status: 'APPROVED' }, select: { costImpact: true } } }
        });

        const lifetimeValue = projects.reduce((sum, p) => sum + Number(p.budget || 0), 0);

        // B. Realized Revenue (Paid Invoices)
        const realizedRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

        // C. Pipeline (Draft/Proposed - simplified as 20% of active budget for now if no CRM deals model)
        // Or if we had a proper pipeline model. For now, let's use 'Draft' projects if they existed, or just estimate.
        // Let's use Open Change Requests as "Expansion Pipeline"
        const pipelineCRs = await prisma.changeRequest.findMany({
            where: { clientId, status: 'NEW' },
            select: { costImpact: true }
        });
        const pipelineValue = pipelineCRs.reduce((sum, cr) => sum + Number(cr.costImpact || 0), 0);
        
        // 3. RISK APPETITE
        // ----------------
        // Ratio of Accepted Risks vs Mitigated Risks
        const risks = await prisma.risk.findMany({
            where: { clientId },
            select: { status: true, clientAcceptedAt: true }
        });
        const acceptedRisks = risks.filter(r => r.clientAcceptedAt).length;
        const riskAppetiteScore = risks.length > 0 ? (acceptedRisks / risks.length) * 100 : 0;


        res.json({
            trust: {
                avgDecisionDays: avgDecisionLatency,
                avgPaymentDays: avgPaymentDays,
                lastLoginAt: clientUser?.lastLoginAt,
                engagementScore: 85 // Placeholder logic or derived from login freq
            },
            commercials: {
                lifetimeValue,
                realizedRevenue,
                pipelineValue,
                activeProjects: projects.filter(p => p.status === 'ACTIVE').length
            },
            risk: {
                totalRisks: risks.length,
                acceptedRisks,
                appetiteScore: riskAppetiteScore
            }
        });

    } catch (error) { next(error); }
});

export default router;
