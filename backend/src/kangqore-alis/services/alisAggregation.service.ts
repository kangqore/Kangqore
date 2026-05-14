import { prisma } from '../../lib/prisma';
import { TimeRange, whereCreatedAt } from './alisUtils';

// ---------------------------------------------------------------------------
// Kangqore ALIS — Core Aggregation Service
// Overview, Revenue Forecasts, Department Demand, Service Popularity,
// Sales Performance, Buyer Intent
// ---------------------------------------------------------------------------

// ======================== Executive Overview ========================

export async function getOverview(range: TimeRange = '30d') {
  const dateFilter = whereCreatedAt(range);

  const [totalLeads, hotLeads, bookedLeads, allLeads] = await Promise.all([
    prisma.eqoreLead.count({ where: dateFilter }),
    prisma.eqoreLead.count({ where: { ...dateFilter, status: 'HOT' } }),
    prisma.eqoreLead.count({ where: { ...dateFilter, schedulingStatus: 'BOOKED' } }),
    prisma.eqoreLead.findMany({
      where: dateFilter,
      select: { leadScore: true, leadConfidence: true, projectedValue: true, pipelineWeight: true },
    }),
  ]);

  const totalPipeline = allLeads.reduce((s, l) => s + Number(l.projectedValue || 0), 0);
  const weightedPipeline = allLeads.reduce((s, l) => s + Number(l.projectedValue || 0) * Number(l.pipelineWeight || 0), 0);
  const avgScore = totalLeads > 0 ? Math.round(allLeads.reduce((s, l) => s + l.leadScore, 0) / totalLeads) : 0;
  const bookingRate = totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0;

  return { totalLeads, hotLeads, bookedLeads, totalPipeline, weightedPipeline, avgScore, bookingRate };
}

// ======================== Revenue Forecasts ========================

export async function getRevenue(range: TimeRange = '30d') {
  const dateFilter = whereCreatedAt(range);

  const leads = await prisma.eqoreLead.findMany({
    where: dateFilter,
    select: {
      projectedValue: true, pipelineWeight: true, valueTier: true,
      salesStage: true, status: true, createdAt: true,
    },
  });

  const opportunities = await prisma.eqoreSalesOpportunity.findMany({
    where: dateFilter,
    select: { stage: true, estimatedValue: true, priority: true, closedAt: true, wonReason: true, lostReason: true },
  });

  const stageMap: Record<string, { count: number; value: number }> = {};
  for (const opp of opportunities) {
    if (!stageMap[opp.stage]) stageMap[opp.stage] = { count: 0, value: 0 };
    stageMap[opp.stage].count++;
    stageMap[opp.stage].value += Number(opp.estimatedValue || 0);
  }

  const won = opportunities.filter(o => o.stage === 'WON');
  const lost = opportunities.filter(o => o.stage === 'LOST');

  const tierMap: Record<string, number> = {};
  for (const l of leads) {
    const tier = l.valueTier || 'UNQUALIFIED';
    tierMap[tier] = (tierMap[tier] || 0) + 1;
  }

  const topOpps = await prisma.eqoreSalesOpportunity.findMany({
    where: { ...dateFilter, stage: { notIn: ['WON', 'LOST', 'DISQUALIFIED'] } },
    orderBy: { estimatedValue: 'desc' },
    take: 5,
    include: { lead: { select: { email: true, companyName: true, primaryDepartment: true } } },
  });

  return {
    totalPipeline: leads.reduce((s, l) => s + Number(l.projectedValue || 0), 0),
    weightedPipeline: leads.reduce((s, l) => s + Number(l.projectedValue || 0) * Number(l.pipelineWeight || 0), 0),
    stageBreakdown: stageMap,
    winCount: won.length,
    lossCount: lost.length,
    winRate: (won.length + lost.length) > 0 ? Math.round((won.length / (won.length + lost.length)) * 100) : 0,
    valueTiers: tierMap,
    topOpportunities: topOpps,
  };
}

// ======================== Sales Performance ========================

export async function getSalesPerformance(range: TimeRange = '30d') {
  const dateFilter = whereCreatedAt(range);

  const [openTasks, overdueTasks, activities] = await Promise.all([
    prisma.eqoreSalesTask.count({ where: { ...dateFilter, status: 'OPEN' } }),
    prisma.eqoreSalesTask.count({ where: { ...dateFilter, status: 'OPEN', dueAt: { lt: new Date() } } }),
    prisma.eqoreSalesActivity.findMany({ where: dateFilter, select: { activityType: true, createdAt: true } }),
  ]);

  const activityMap: Record<string, number> = {};
  for (const a of activities) {
    activityMap[a.activityType] = (activityMap[a.activityType] || 0) + 1;
  }

  return { openTasks, overdueTasks, totalActivities: activities.length, activityBreakdown: activityMap };
}

// ======================== Buyer Intent Heatmap ========================

export async function getBuyerIntent(range: TimeRange = '30d') {
  const dateFilter = whereCreatedAt(range);

  const leads = await prisma.eqoreLead.findMany({
    where: dateFilter,
    select: { visitorType: true, sourcePage: true, urgency: true, leadScore: true, projectedValue: true },
  });

  const visitorMap: Record<string, { count: number; avgScore: number; scores: number[] }> = {};
  for (const l of leads) {
    const vt = l.visitorType || 'Unknown';
    if (!visitorMap[vt]) visitorMap[vt] = { count: 0, avgScore: 0, scores: [] };
    visitorMap[vt].count++;
    visitorMap[vt].scores.push(l.leadScore);
  }

  const visitorSegments = Object.entries(visitorMap).map(([type, d]) => ({
    type,
    count: d.count,
    avgScore: Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length),
  })).sort((a, b) => b.count - a.count);

  const sourceMap: Record<string, number> = {};
  for (const l of leads) {
    const src = l.sourcePage || '/';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  }
  const topSources = Object.entries(sourceMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([page, count]) => ({ page, count }));

  const urgencyMap: Record<string, number> = {};
  for (const l of leads) {
    const u = l.urgency || 'Unknown';
    urgencyMap[u] = (urgencyMap[u] || 0) + 1;
  }

  return { visitorSegments, topSources, urgencyBreakdown: urgencyMap };
}
