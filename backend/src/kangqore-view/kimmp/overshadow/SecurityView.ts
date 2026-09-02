// ---------------------------------------------------------------------------
// AI Security View — Overshadow Roadmap P4.2.
//
// Not a SIEM/SOAR competitor — explicitly. This extends HANUMANAS's existing
// audit/risk domain into a security-team-facing view of two things that
// already exist but weren't surfaced together anywhere: AI-touched security
// events (AegisAuditLog rows the platform was already writing) and AI-
// initiated actions waiting on a human reviewer (KimmpApprovalRequest, the
// same queue the CommandCenter widget reads, given its own dedicated view).
// Nothing here is a new detection engine — it's a lens on data that was
// already real.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma'

const SECURITY_RELEVANT_EVENTS = ['POLICY_VIOLATION', 'ACCESS_DENIED', 'EGRESS']

export async function getAiSecurityView() {
  const since30d = new Date(Date.now() - 30 * 86_400_000)

  const [aiTouchedIncidents30d, pendingActionReviews, openFindings, criticalOpenFindings, recentIncidents, pendingReviewQueue] = await Promise.all([
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: { in: SECURITY_RELEVANT_EVENTS }, createdAt: { gte: since30d } } }),
    (prisma as any).kimmpApprovalRequest.count({ where: { status: 'PENDING' } }),
    (prisma as any).securityFinding.count({ where: { status: 'OPEN' } }),
    (prisma as any).securityFinding.count({ where: { status: 'OPEN', severity: 'CRITICAL' } }),
    (prisma as any).hanumanasAuditLog.findMany({
      where: { eventType: { in: SECURITY_RELEVANT_EVENTS } },
      orderBy: { createdAt: 'desc' }, take: 15,
      select: { id: true, eventType: true, system: true, actor: true, autonomous: true, endpoint: true, priority: true, createdAt: true },
    }),
    (prisma as any).kimmpApprovalRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { requestedAt: 'desc' }, take: 15,
      include: { agent: { select: { name: true } } },
    }),
  ])

  return {
    aiTouchedIncidents30d,
    pendingActionReviews,
    openSecurityFindings: openFindings,
    criticalOpenFindings,
    recentIncidents: recentIncidents.map((r: any) => ({
      id: r.id, eventType: r.eventType, system: r.system, actor: r.actor,
      autonomous: r.autonomous, endpoint: r.endpoint, priority: r.priority, createdAt: r.createdAt,
    })),
    pendingReviewQueue: pendingReviewQueue.map((r: any) => ({
      id: r.id, agentName: r.agent?.name ?? null, tool: r.tool, action: r.action,
      description: r.description, level: r.level, requestedAt: r.requestedAt, expiresAt: r.expiresAt,
    })),
    disclaimer: 'Not a SIEM/SOAR replacement — a live view of HANUMANAS audit events already being written (policy violations, access denials, egress) and the real agent-action approval queue, brought together for a security team instead of scattered across admin panels.',
    computedAt: new Date().toISOString(),
  }
}
