// ---------------------------------------------------------------------------
// Phase 6.9c — COIG Evolution Engine
// Customer Operational Intelligence Gain tracked as a trend, not a point.
// "Is Kangqore becoming a better company?"
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import { computeGate8 } from '../../waanda/intelligence/gate8.service';

export interface CoigSnapshot {
  date:    string;
  ois:     number;
  coig:    number;
  label:   string;
}

export interface CoigTrend {
  baseline:   { date: string; ois: number } | null;
  current:    number | null;
  coig:       number | null;   // current - baseline
  snapshots:  CoigSnapshot[];
  velocity:   number | null;   // avg OIS gain per week
  projected:  { ois90d: number | null; coig90d: number | null };
}

export class CoigEvolutionService {

  static async trend(): Promise<CoigTrend> {
    const [snapshots, current] = await Promise.all([
      (prisma as any).gate8Snapshot.findMany({
        orderBy: { createdAt: 'asc' },
        select:  { id: true, oisScore: true, label: true, createdAt: true },
      }),
      computeGate8().catch(() => null),
    ]);

    if (!snapshots.length) {
      return { baseline: null, current: current?.oisScore ?? null, coig: null, snapshots: [], velocity: null, projected: { ois90d: null, coig90d: null } };
    }

    const baseSnap = snapshots.find((s: any) => s.label === 'BASELINE') ?? snapshots[0];
    const baseOIS  = baseSnap.oisScore;
    const currOIS  = current?.oisScore ?? snapshots[snapshots.length - 1].oisScore;
    const coig     = Math.round((currOIS - baseOIS) * 10) / 10;

    const formattedSnaps: CoigSnapshot[] = snapshots.map((s: any) => ({
      date:  new Date(s.createdAt).toISOString(),
      ois:   s.oisScore,
      coig:  Math.round((s.oisScore - baseOIS) * 10) / 10,
      label: s.label,
    }));

    // Weekly velocity: linear regression slope
    let velocity: number | null = null;
    if (snapshots.length >= 2) {
      const t0   = new Date(snapshots[0].createdAt).getTime();
      const pts  = snapshots.map((s: any) => ({
        x: (new Date(s.createdAt).getTime() - t0) / (7 * 24 * 3600 * 1000),
        y: s.oisScore,
      }));
      const n    = pts.length;
      const sumX = pts.reduce((s: number, p: any) => s + p.x, 0);
      const sumY = pts.reduce((s: number, p: any) => s + p.y, 0);
      const sumXY = pts.reduce((s: number, p: any) => s + p.x * p.y, 0);
      const sumX2 = pts.reduce((s: number, p: any) => s + p.x * p.x, 0);
      const denom = n * sumX2 - sumX * sumX;
      if (Math.abs(denom) > 0.001) {
        velocity = Math.round(((n * sumXY - sumX * sumY) / denom) * 100) / 100;
      }
    }

    const ois90d   = velocity != null ? Math.min(100, Math.round((currOIS + velocity * 13) * 10) / 10) : null;
    const coig90d  = ois90d != null ? Math.round((ois90d - baseOIS) * 10) / 10 : null;

    return {
      baseline:   { date: new Date(baseSnap.createdAt).toISOString(), ois: baseOIS },
      current:    Math.round(currOIS * 10) / 10,
      coig,
      snapshots:  formattedSnaps,
      velocity,
      projected:  { ois90d, coig90d },
    };
  }

  static async computeScorecard(window: 'week' | 'month' | 'quarter' = 'week'): Promise<Record<string, any>> {
    const now   = new Date();
    const since = new Date(now);
    if (window === 'week')    since.setDate(since.getDate() - 7);
    else if (window === 'month')   since.setMonth(since.getMonth() - 1);
    else                           since.setMonth(since.getMonth() - 3);

    const [decisions, decisionsWithOutcome, lessons, insights, patterns, principles,
           autopilotLogs, autopilotLogsAuto] = await Promise.all([
      (prisma as any).kimmpDecision.count({ where: { status: 'APPROVED', createdAt: { gte: since } } }),
      (prisma as any).kimmpDecision.count({ where: { outcomeAt: { gte: since } } }),
      (prisma as any).enterpriseLesson.count({ where: { createdAt: { gte: since } } }),
      (prisma as any).enterpriseInsight.count({ where: { createdAt: { gte: since } } }),
      (prisma as any).enterprisePattern.count({ where: { createdAt: { gte: since } } }),
      (prisma as any).enterprisePrinciple.count({ where: { createdAt: { gte: since } } }),
      (prisma as any).autopilotLog.count({ where: { createdAt: { gte: since } } }),
      (prisma as any).autopilotLog.count({ where: { approved: true, createdAt: { gte: since } } }),
    ]);

    const completionRate   = decisions > 0 ? Math.round((decisionsWithOutcome / decisions) * 100) : 0;
    const automationRate   = autopilotLogs > 0 ? Math.round((autopilotLogsAuto / autopilotLogs) * 100) : 0;

    return {
      period:          window,
      periodStart:     since.toISOString(),
      periodEnd:       now.toISOString(),
      decisionsMade:   decisions,
      decisionsWithOutcome,
      completionRate,
      lessonsCreated:  lessons,
      insightsSynthesised: insights,
      patternsConfirmed:   patterns,
      principlesRaised:    principles,
      automationRate,
    };
  }
}
