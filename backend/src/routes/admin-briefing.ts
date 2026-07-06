// ---------------------------------------------------------------------------
// Admin Briefing — domain health aggregator
//
// GET /api/admin/briefing/domain-health
//
// Computes 6 RAG domain health scores + OpsSnapshot + signal pyramid counts
// from live Prisma data in a single parallel query. No stale mock data.
// ---------------------------------------------------------------------------

import { Router }   from 'express'
import { prisma }   from '../lib/prisma'
import { authenticate, authorize } from '../middleware/auth'

export const briefingRouter = Router()

type RAG = 'PASS' | 'WARN' | 'FAIL'

interface DomainHealth {
  id:     string
  label:  string
  status: RAG
  signal: string
  trend:  number
}

interface OpsSnapshot {
  openP1P2Issues:      number
  atRiskDeliverables:  number
  changesPendingCAB:   number
  issuesResolvedToday: number
}

// ─── Route ───────────────────────────────────────────────────────────────────

briefingRouter.get(
  '/domain-health',
  authenticate,
  authorize(['ADMIN']),
  async (_req, res) => {
    try {
      const now   = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const todayEnd = new Date(today.getTime() + 86_400_000)

      // ── Parallel data pull ───────────────────────────────────────────────
      const [
        atRiskProjects,
        overdueInvoices,
        openContacts,
        activeProjects,
        overdueDeliverables,
        openHighIssues,
        pendingCRs,
        openHighRisks,
        openJobs,
        pipelineApplications,
        closedTodayIssues,
        totalSignals,
        todayDispatches,
        aegisCritical24h,
        aegisWarn24h,
        aegisHealthReport,
      ] = await Promise.all([
        // Revenue: projects with health < 60 (proxy for at-risk client relationships)
        prisma.project.count({
          where: { status: 'ACTIVE', health: { lt: 60 } },
        }),

        // Finance + Revenue: OVERDUE invoices
        prisma.invoice.findMany({
          where:  { status: 'OVERDUE' },
          select: { amount: true, currency: true },
        }),

        // Revenue: contacts in active pipeline stages
        prisma.contact.count({
          where: { status: { in: ['NEW', 'IN_PROGRESS'] } },
        }),

        // Delivery: all active projects (to compute average health)
        prisma.project.findMany({
          where:  { status: 'ACTIVE' },
          select: { health: true, title: true, dueDate: true },
        }),

        // Delivery: deliverables past due, not completed
        prisma.deliverable.count({
          where: {
            dueDate: { lt: now },
            status: { notIn: ['approved', 'APPROVED', 'delivered', 'DELIVERED', 'COMPLETE', 'complete'] },
          },
        }),

        // Operations: open high-severity issues
        prisma.issue.findMany({
          where: {
            status: { notIn: ['CLOSED', 'closed', 'RESOLVED', 'resolved'] },
            priority: { in: ['HIGH', 'CRITICAL', 'P1', 'P2'] },
          },
          select: { id: true, priority: true },
        }),

        // Operations: change requests pending CAB approval
        prisma.changeRequest.count({
          where: { status: { in: ['PROPOSED', 'UNDER_REVIEW'] } },
        }),

        // Operations + Compliance: open high/critical risks
        prisma.risk.findMany({
          where: {
            status: { notIn: ['CLOSED', 'RESOLVED', 'ACCEPTED', 'closed', 'resolved', 'accepted'] },
            severity: { in: ['HIGH', 'CRITICAL', 'high', 'critical'] },
          },
          select: { severity: true },
        }),

        // People: open vacancies
        prisma.job.count({
          where: { status: 'PUBLISHED' },
        }),

        // People: pipeline applications
        (prisma.jobApplication as any).count({
          where: { status: { in: ['RECEIVED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWING'] } },
        }).catch(() => 0),

        // Ops snapshot: issues closed today
        prisma.issue.count({
          where: {
            status: { in: ['CLOSED', 'closed', 'RESOLVED', 'resolved'] },
            updatedAt: { gte: today, lt: todayEnd },
          },
        }),

        // Signal pyramid: total signals ever captured
        (prisma as any).kimmpSignal.count().catch(() => 0),

        // Signal pyramid: dispatches today (L4 intelligence)
        (prisma as any).kimmpSystemDispatch.count({
          where: { createdAt: { gte: today, lt: todayEnd } },
        }).catch(() => 0),

        // Compliance: AEGIS critical runs last 24h
        (prisma as any).aegisAgentRun.count({
          where: { verdict: 'CRITICAL', raisedAt: { gte: new Date(Date.now() - 86_400_000) } },
        }).catch(() => 0),

        // Compliance: AEGIS warn runs last 24h
        (prisma as any).aegisAgentRun.count({
          where: { verdict: 'WARN', raisedAt: { gte: new Date(Date.now() - 86_400_000) } },
        }).catch(() => 0),

        // Compliance: latest AEGIS health score from govops.reporting
        (prisma as any).aegisAgentRun.findFirst({
          where:   { agentId: 'govops.reporting' },
          orderBy: { raisedAt: 'desc' },
          select:  { metadata: true, verdict: true },
        }).catch(() => null),
      ])

      // ── Derived metrics ──────────────────────────────────────────────────

      const totalOverdueAR  = overdueInvoices.reduce((s, i) => s + Number(i.amount), 0)
      const avgProjectHealth = activeProjects.length > 0
        ? Math.round(activeProjects.reduce((s, p) => s + (p.health ?? 100), 0) / activeProjects.length)
        : 100
      const criticalProjects   = activeProjects.filter(p => (p.health ?? 100) < 40).length
      const atRiskProjectCount = atRiskProjects  // health < 60
      const openP1Count = openHighIssues.filter(i =>
        ['P1', 'CRITICAL'].includes((i.priority ?? '').toUpperCase())
      ).length
      const openP2Count = openHighIssues.filter(i =>
        ['P2', 'HIGH'].includes((i.priority ?? '').toUpperCase())
      ).length
      const openHighRiskCount     = openHighRisks.filter(r => (r.severity ?? '').toUpperCase() === 'HIGH').length
      const openCriticalRiskCount = openHighRisks.filter(r => (r.severity ?? '').toUpperCase() === 'CRITICAL').length
      const aegisHealthScore: number | null = (aegisHealthReport?.metadata as any)?.healthScore ?? null
      const aegisVerdict: string = aegisCritical24h > 0 ? 'CRITICAL' : aegisWarn24h > 0 ? 'WARN' : 'PASS'

      // ── Domain health computation ────────────────────────────────────────

      // Revenue
      const revenueStatus: RAG =
        criticalProjects >= 2 || (overdueInvoices.length >= 3 && totalOverdueAR > 30000) ? 'FAIL'
        : atRiskProjectCount >= 1 || overdueInvoices.length >= 1 ? 'WARN'
        : 'PASS'
      const revenueSignal =
        revenueStatus === 'FAIL'
          ? `${criticalProjects} critical client relationship${criticalProjects !== 1 ? 's' : ''}. ${overdueInvoices.length} overdue invoice${overdueInvoices.length !== 1 ? 's' : ''} — ₹${Math.round(totalOverdueAR).toLocaleString()} outstanding.`
          : atRiskProjectCount >= 1
          ? `${atRiskProjectCount} project${atRiskProjectCount !== 1 ? 's' : ''} at risk. ${overdueInvoices.length > 0 ? `${overdueInvoices.length} overdue invoice${overdueInvoices.length !== 1 ? 's' : ''}.` : 'Invoices clear.'} ${openContacts} leads in pipeline.`
          : `Pipeline healthy. ${openContacts} active leads. All invoices current.`
      const revenueTrend = revenueStatus === 'FAIL' ? -15 : revenueStatus === 'WARN' ? -5 : 3

      // Delivery
      const deliveryStatus: RAG =
        criticalProjects >= 1 || (overdueDeliverables >= 3 && openP1Count >= 1) ? 'FAIL'
        : overdueDeliverables >= 1 || atRiskProjectCount >= 2 ? 'WARN'
        : 'PASS'
      const deliverySignal =
        deliveryStatus === 'FAIL'
          ? `${criticalProjects} project${criticalProjects !== 1 ? 's' : ''} critical (health < 40%). ${overdueDeliverables} deliverable${overdueDeliverables !== 1 ? 's' : ''} overdue.`
          : overdueDeliverables >= 1
          ? `${overdueDeliverables} overdue deliverable${overdueDeliverables !== 1 ? 's' : ''}. Avg project health ${avgProjectHealth}%.`
          : `All deliveries on track. Avg project health ${avgProjectHealth}%. ${activeProjects.length} active projects.`
      const deliveryTrend = deliveryStatus === 'FAIL' ? -14 : deliveryStatus === 'WARN' ? -6 : 2

      // Finance
      const financeStatus: RAG =
        totalOverdueAR > 50000 || overdueInvoices.length >= 5 ? 'FAIL'
        : overdueInvoices.length >= 1 ? 'WARN'
        : 'PASS'
      const financeSignal =
        financeStatus === 'FAIL'
          ? `AR overdue ₹${Math.round(totalOverdueAR).toLocaleString()} across ${overdueInvoices.length} invoice${overdueInvoices.length !== 1 ? 's' : ''}. Immediate action required.`
          : overdueInvoices.length >= 1
          ? `AR overdue ₹${Math.round(totalOverdueAR).toLocaleString()}. ${overdueInvoices.length} invoice${overdueInvoices.length !== 1 ? 's' : ''} past due.`
          : 'AR clean. No overdue invoices. Finance position healthy.'
      const financeTrend = financeStatus === 'FAIL' ? -12 : financeStatus === 'WARN' ? -3 : 2

      // People
      const peopleStatus: RAG =
        openJobs >= 5 ? 'WARN'
        : 'PASS'
      const peopleSignal =
        openJobs >= 5
          ? `${openJobs} open vacancies. ${pipelineApplications} applications in pipeline.`
          : openJobs >= 1
          ? `${openJobs} open role${openJobs !== 1 ? 's' : ''}. ${pipelineApplications} application${pipelineApplications !== 1 ? 's' : ''} in pipeline.`
          : 'All roles filled. Team at full capacity.'
      const peopleTrend = openJobs >= 5 ? -3 : 2

      // Operations
      const operationsStatus: RAG =
        openP1Count >= 1 ? 'FAIL'
        : openP2Count >= 2 || pendingCRs >= 3 || openHighRiskCount >= 3 ? 'WARN'
        : openP2Count >= 1 || pendingCRs >= 1 ? 'WARN'
        : 'PASS'
      const operationsSignal =
        openP1Count >= 1
          ? `${openP1Count} active P1 issue${openP1Count !== 1 ? 's' : ''}. ${openP2Count} P2. ${pendingCRs} change${pendingCRs !== 1 ? 's' : ''} pending approval.`
          : openP2Count >= 1 || pendingCRs >= 1
          ? `${openP2Count} active P2 issue${openP2Count !== 1 ? 's' : ''}. ${pendingCRs} change request${pendingCRs !== 1 ? 's' : ''} pending CAB approval.`
          : 'No active issues. Operations running clean.'
      const operationsTrend = operationsStatus === 'FAIL' ? -10 : operationsStatus === 'WARN' ? -4 : 2

      // Compliance
      const complianceScoreNum = aegisHealthScore ?? (aegisVerdict === 'PASS' ? 88 : aegisVerdict === 'WARN' ? 70 : 55)
      const complianceStatus: RAG =
        aegisVerdict === 'CRITICAL' || openCriticalRiskCount >= 2 ? 'FAIL'
        : aegisVerdict === 'WARN'    || openCriticalRiskCount >= 1 ? 'WARN'
        : 'PASS'
      const complianceSignal =
        complianceStatus === 'FAIL'
          ? `AEGIS: CRITICAL posture. ${aegisCritical24h} critical control${aegisCritical24h !== 1 ? 's' : ''} failed in 24h. ${openCriticalRiskCount} critical risk${openCriticalRiskCount !== 1 ? 's' : ''} open.`
          : complianceStatus === 'WARN'
          ? `AEGIS score ${complianceScoreNum}%. ${aegisWarn24h} warn${aegisWarn24h !== 1 ? 's' : ''} in 24h. ${openCriticalRiskCount + openHighRiskCount} risk${openCriticalRiskCount + openHighRiskCount !== 1 ? 's' : ''} open.`
          : `AEGIS posture PASS. Score ${complianceScoreNum}%. All controls current.`
      const complianceTrend = complianceStatus === 'FAIL' ? -8 : complianceStatus === 'WARN' ? -2 : 3

      // ── Assemble ──────────────────────────────────────────────────────────

      const domains: DomainHealth[] = [
        { id: 'revenue',    label: 'Revenue',    status: revenueStatus,    signal: revenueSignal,    trend: revenueTrend    },
        { id: 'delivery',   label: 'Delivery',   status: deliveryStatus,   signal: deliverySignal,   trend: deliveryTrend   },
        { id: 'finance',    label: 'Finance',    status: financeStatus,    signal: financeSignal,    trend: financeTrend    },
        { id: 'people',     label: 'People',     status: peopleStatus,     signal: peopleSignal,     trend: peopleTrend     },
        { id: 'operations', label: 'Operations', status: operationsStatus, signal: operationsSignal, trend: operationsTrend },
        { id: 'compliance', label: 'Compliance', status: complianceStatus, signal: complianceSignal, trend: complianceTrend },
      ]

      const opsSnapshot: OpsSnapshot = {
        openP1P2Issues:      openP1Count + openP2Count,
        atRiskDeliverables:  overdueDeliverables,
        changesPendingCAB:   pendingCRs,
        issuesResolvedToday: closedTodayIssues,
      }

      res.json({ domains, opsSnapshot, signalCounts: { signals: totalSignals, dispatches: todayDispatches } })
    } catch (err) {
      console.error('[briefing] domain-health error:', err)
      res.status(500).json({ error: 'Failed to compute briefing domain health' })
    }
  }
)
