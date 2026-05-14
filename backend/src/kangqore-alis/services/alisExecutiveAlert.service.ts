import { prisma } from '../../lib/prisma';

// ---------------------------------------------------------------------------
// Kangqore ALIS — Executive Alert Service
// Detects stale leads, overdue tasks, lost deals, and anomalies
// ---------------------------------------------------------------------------

export async function getAlerts() {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const [staleHighValue, overdueTasks, recentLost] = await Promise.all([
    prisma.eqoreLead.findMany({
      where: { leadScore: { gte: 75 }, status: { notIn: ['DISCARDED', 'CONVERTED'] }, lastSalesActivityAt: { lt: twoDaysAgo } },
      select: { id: true, email: true, companyName: true, leadScore: true, projectedValue: true, lastSalesActivityAt: true },
      take: 10,
    }),
    prisma.eqoreSalesTask.findMany({
      where: { status: 'OPEN', dueAt: { lt: now }, priority: { in: ['CRISIS', 'HIGH'] } },
      select: { id: true, title: true, priority: true, dueAt: true, leadId: true },
      take: 10,
    }),
    prisma.eqoreSalesOpportunity.findMany({
      where: { stage: 'LOST', closedAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
      select: { id: true, lostReason: true, estimatedValue: true, lead: { select: { companyName: true } } },
      take: 5,
    }),
  ]);

  const alerts: { severity: string; type: string; message: string; data?: any }[] = [];

  for (const lead of staleHighValue) {
    alerts.push({
      severity: 'HIGH',
      type: 'STALE_HIGH_VALUE',
      message: `${lead.companyName || lead.email || 'Unknown'} (Score: ${lead.leadScore}) has no sales activity for 48+ hours`,
      data: lead,
    });
  }
  for (const task of overdueTasks) {
    alerts.push({
      severity: task.priority === 'CRISIS' ? 'CRITICAL' : 'HIGH',
      type: 'OVERDUE_TASK',
      message: `Task "${task.title}" is overdue (${task.priority})`,
      data: task,
    });
  }
  for (const opp of recentLost) {
    alerts.push({
      severity: 'MEDIUM',
      type: 'DEAL_LOST',
      message: `Lost deal: ${opp.lead?.companyName || 'Unknown'} ($${Number(opp.estimatedValue || 0).toLocaleString()}) — ${opp.lostReason || 'No reason provided'}`,
      data: opp,
    });
  }

  const sevOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  return { alerts: alerts.sort((a, b) => (sevOrder[a.severity] ?? 3) - (sevOrder[b.severity] ?? 3)) };
}
