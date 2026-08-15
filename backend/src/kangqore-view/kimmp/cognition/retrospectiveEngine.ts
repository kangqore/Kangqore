// ---------------------------------------------------------------------------
// Phase 6.9a — Enterprise Retrospective Engine
// Auto-creates retrospectives for completed missions, goals, and weekly cadence.
// Reflection is the loop that closes: Execute → Reflect → Learn → Evolve.
// ---------------------------------------------------------------------------

import { prisma }        from '../../../lib/prisma';
import { haiku, textOf } from '../llm/kimmpLLMRouter';
import { TrustEngine }   from './trustEngine';

const SYSTEM_REFLECT =
  'You are WAANDA. Given an enterprise execution summary, write a concise retrospective reflection. ' +
  'Cover: what was accomplished, what was not, what the organization learned. ' +
  'One paragraph, max 80 words. Plain text, no markdown, no bullet points.';

async function getOIS(date: Date): Promise<number | null> {
  const snap = await (prisma as any).gate8Snapshot.findFirst({
    where:   { createdAt: { lte: date } },
    orderBy: { createdAt: 'desc' },
    select:  { oisScore: true },
  });
  return snap?.oisScore ?? null;
}

export class RetrospectiveEngine {

  static async createForWeek(weekStart: Date): Promise<any> {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const [decisions, outcomes, lessons, patterns, plans] = await Promise.all([
      (prisma as any).kimmpDecision.count({ where: { status: 'APPROVED', createdAt: { gte: weekStart, lt: weekEnd } } }),
      (prisma as any).kimmpDecision.count({ where: { outcomeAt: { gte: weekStart, lt: weekEnd } } }),
      (prisma as any).enterpriseLesson.count({ where: { createdAt: { gte: weekStart, lt: weekEnd } } }),
      (prisma as any).enterprisePattern.count({ where: { createdAt: { gte: weekStart, lt: weekEnd } } }),
      (prisma as any).dailyOperatingPlan.findMany({ where: { date: { gte: weekStart, lt: weekEnd } } }),
    ]);

    const missionsPlanned   = plans.length;
    const missionsCompleted = plans.filter((p: any) =>
      Array.isArray(p.actions) && p.actions.every((a: any) => a.done)
    ).length;

    const [oisStart, oisEnd, eti] = await Promise.all([
      getOIS(weekStart),
      getOIS(weekEnd),
      TrustEngine.getETI().catch(() => null),
    ]);

    const coigDelta = oisStart != null && oisEnd != null ? oisEnd - oisStart : null;

    const userPrompt = [
      `Week of ${weekStart.toDateString()}.`,
      `Decisions approved: ${decisions}. Outcomes recorded: ${outcomes}.`,
      `Lessons created: ${lessons}. Patterns confirmed: ${patterns}.`,
      `Operating plans completed: ${missionsCompleted} of ${missionsPlanned}.`,
      `OIS movement: ${oisStart ?? '?'} → ${oisEnd ?? '?'}. ETI: ${eti?.overall ?? '?'}/100.`,
    ].join(' ');

    let reflection = `This week ${decisions} decisions were approved and ${outcomes} outcomes recorded. ` +
      `${lessons} new lessons entered the knowledge base.`;
    try {
      const res = await haiku(SYSTEM_REFLECT, userPrompt, 120, { hint: 'retrospective-weekly' });
      const text = textOf(res).trim();
      if (text) reflection = text;
    } catch { /* degrade */ }

    // Collect lesson and pattern IDs created this week
    const lessonRows = await (prisma as any).enterpriseLesson.findMany({
      where:  { createdAt: { gte: weekStart, lt: weekEnd } },
      select: { id: true },
    });
    const patternRows = await (prisma as any).enterprisePattern.findMany({
      where:  { createdAt: { gte: weekStart, lt: weekEnd } },
      select: { id: true },
    });

    return (prisma as any).enterpriseRetrospective.create({
      data: {
        scope:    'WEEKLY',
        dateFrom: weekStart,
        dateTo:   weekEnd,
        planned:  { missions: missionsPlanned, decisions, objectives: [] },
        executed: { missionsCompleted, decisionsApproved: decisions, outcomesRecorded: outcomes },
        delta:    { oisStart, oisEnd, coigDelta },
        reflection,
        lessonsRaised:     lessonRows.map((l: any) => l.id),
        patternsConfirmed: patternRows.map((p: any) => p.id),
      },
    });
  }

  static async createForGoal(goalId: string): Promise<any> {
    const goal = await (prisma as any).kimmpGoal.findUnique({
      where:   { id: goalId },
      include: { tasks: true },
    });
    if (!goal) return null;

    const now      = new Date();
    const created  = new Date(goal.createdAt);
    const oisStart = await getOIS(created);
    const oisEnd   = await getOIS(now);

    const completedTasks = (goal.tasks ?? []).filter((t: any) => t.status === 'DONE').length;
    const totalTasks     = (goal.tasks ?? []).length;

    const userPrompt = `Goal: "${goal.title}". Tasks completed: ${completedTasks}/${totalTasks}. Status: ${goal.status}. Duration: ${Math.round((now.getTime() - created.getTime()) / 86400000)} days.`;

    let reflection = `Goal "${goal.title}" concluded with ${completedTasks} of ${totalTasks} tasks completed.`;
    try {
      const res = await haiku(SYSTEM_REFLECT, userPrompt, 120, { hint: 'retrospective-goal' });
      const text = textOf(res).trim();
      if (text) reflection = text;
    } catch { /* degrade */ }

    return (prisma as any).enterpriseRetrospective.create({
      data: {
        scope:    'GOAL',
        scopeId:  goalId,
        dateFrom: created,
        dateTo:   now,
        planned:  { missions: 0, decisions: 0, objectives: [goal.title] },
        executed: { missionsCompleted: 0, decisionsApproved: 0, outcomesRecorded: completedTasks },
        delta:    { oisStart, oisEnd, coigDelta: oisStart != null && oisEnd != null ? oisEnd - oisStart : null },
        reflection,
        lessonsRaised:     [],
        patternsConfirmed: [],
      },
    });
  }

  static async list(limit = 10): Promise<any[]> {
    return (prisma as any).enterpriseRetrospective.findMany({
      orderBy: { createdAt: 'desc' },
      take:    limit,
    });
  }
}
