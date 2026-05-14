import { prisma } from '../../lib/prisma';
import { TimeRange, whereCreatedAt } from './alisUtils';

// ---------------------------------------------------------------------------
// Kangqore ALIS — Demand Trend Service
// Department demand analysis + Service popularity tracking
// ---------------------------------------------------------------------------

export async function getDepartments(range: TimeRange = '30d') {
  const dateFilter = whereCreatedAt(range);

  const leads = await prisma.eqoreLead.findMany({
    where: { ...dateFilter, primaryDepartment: { not: null } },
    select: { primaryDepartment: true, projectedValue: true, leadScore: true, schedulingStatus: true, status: true },
  });

  const deptMap: Record<string, { count: number; revenue: number; scores: number[]; booked: number; hot: number }> = {};
  for (const l of leads) {
    const dept = l.primaryDepartment!;
    if (!deptMap[dept]) deptMap[dept] = { count: 0, revenue: 0, scores: [], booked: 0, hot: 0 };
    deptMap[dept].count++;
    deptMap[dept].revenue += Number(l.projectedValue || 0);
    deptMap[dept].scores.push(l.leadScore);
    if (l.schedulingStatus === 'BOOKED') deptMap[dept].booked++;
    if (l.status === 'HOT') deptMap[dept].hot++;
  }

  const departments = Object.entries(deptMap)
    .map(([name, d]) => ({
      name,
      leadCount: d.count,
      totalRevenue: d.revenue,
      avgScore: Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length),
      bookedCount: d.booked,
      hotCount: d.hot,
      conversionRate: d.count > 0 ? Math.round((d.booked / d.count) * 100) : 0,
    }))
    .sort((a, b) => b.leadCount - a.leadCount);

  return { departments };
}

export async function getServices(range: TimeRange = '30d') {
  const dateFilter = whereCreatedAt(range);

  const leads = await prisma.eqoreLead.findMany({
    where: { ...dateFilter, matchedServices: { not: undefined } },
    select: { matchedServices: true, projectedValue: true },
  });

  const svcMap: Record<string, { mentions: number; totalAcv: number; fitScores: number[] }> = {};
  for (const l of leads) {
    const services = (l.matchedServices as any[]) || [];
    for (const s of services) {
      const key = s.service || s.name || 'Unknown';
      if (!svcMap[key]) svcMap[key] = { mentions: 0, totalAcv: 0, fitScores: [] };
      svcMap[key].mentions++;
      svcMap[key].totalAcv += Number(l.projectedValue || 0);
      if (s.fitScore) svcMap[key].fitScores.push(s.fitScore);
    }
  }

  const services = Object.entries(svcMap)
    .map(([name, d]) => ({
      name,
      mentions: d.mentions,
      totalAcv: d.totalAcv,
      avgFitScore: d.fitScores.length > 0 ? Math.round(d.fitScores.reduce((a, b) => a + b, 0) / d.fitScores.length) : 0,
    }))
    .sort((a, b) => b.mentions - a.mentions);

  return { services: services.slice(0, 20) };
}
