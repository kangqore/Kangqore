// ---------------------------------------------------------------------------
// Phase 6.9g — Organizational Intelligence Index (OII)
// One composite score: "How intelligent is this enterprise today?"
// 9 dimensions, weighted sum, reproducible pure computation.
// ---------------------------------------------------------------------------

import { TrustEngine }          from './trustEngine';
import { CoigEvolutionService } from './coigEvolution.service';
import { computeGate8 }         from '../../waanda/intelligence/gate8.service';
import { prisma }               from '../../lib/prisma';

export interface OIIDimension {
  name:   string;
  score:  number;   // 0–100
  weight: number;   // fraction summing to 1.0
  raw:    string;   // human-readable label of what was measured
}

export interface OIIResult {
  score:      number;
  grade:      'A' | 'B' | 'C' | 'D' | 'F';
  dimensions: OIIDimension[];
  computedAt: string;
}

const WEIGHTS = {
  ois:              0.20,
  coig:             0.20,
  eti:              0.15,
  knowledgeCoverage: 0.10,
  learningVelocity: 0.10,
  decisionQuality:  0.10,
  predictionAccuracy: 0.05,
  automationRate:   0.05,
  executiveMaturity: 0.05,
};

function gradeOf(s: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (s >= 90) return 'A';
  if (s >= 75) return 'B';
  if (s >= 60) return 'C';
  if (s >= 40) return 'D';
  return 'F';
}

export class OIIService {

  static async compute(): Promise<OIIResult> {
    const [gate8, eti, coverage, coigTrend, scorecard] = await Promise.all([
      computeGate8().catch(() => null),
      TrustEngine.getETI().catch(() => null),
      TrustEngine.getKnowledgeCoverage().catch(() => null),
      CoigEvolutionService.trend().catch(() => null),
      CoigEvolutionService.computeScorecard('week').catch(() => null),
    ]);

    // Lessons created in last 7 days for learning velocity
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const [recentLessons, totalAutopilot, autonomousAutopilot, outcomes, correctOutcomes] = await Promise.all([
      (prisma as any).enterpriseLesson.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      (prisma as any).autopilotLog.count({}),
      (prisma as any).autopilotLog.count({ where: { approved: true } }),
      (prisma as any).kimmpDecision.count({ where: { outcomeAt: { not: null } } }),
      // Heuristic: outcome string contains positive signal
      (prisma as any).kimmpDecision.count({
        where: { outcomeAt: { not: null }, outcome: { contains: 'positive', mode: 'insensitive' } }
      }).catch(() => 0),
    ]);

    // Normalize each dimension to 0–100
    const oisScore         = Math.min(100, gate8?.oisScore ?? 0);

    // COIG normalized: if COIG >= 20, score is 100. Linear below.
    const coigRaw          = coigTrend?.coig ?? 0;
    const coigScore        = Math.min(100, Math.max(0, coigRaw < 0 ? 0 : Math.round((coigRaw / 20) * 100)));

    const etiScore         = Math.min(100, eti?.overall ?? 0);
    const coverageScore    = Math.min(100, coverage?.overall ?? 0);

    // Learning velocity: target 5 lessons/week = 100
    const velocityScore    = Math.min(100, Math.round((recentLessons / 5) * 100));

    // Decision quality: % outcomes recorded * avg accuracy
    const decisionQuality  = outcomes > 0
      ? Math.min(100, Math.round((correctOutcomes / Math.max(outcomes, 1)) * 100))
      : 0;

    // Prediction accuracy from ETI
    const predAccuracy     = Math.min(100, eti?.dimensions?.predictionAccuracy?.score ?? 0);

    // Automation rate
    const automationScore  = totalAutopilot > 0
      ? Math.min(100, Math.round((autonomousAutopilot / totalAutopilot) * 100))
      : 0;

    // Executive maturity: composite of ETI * decision quality * coverage
    const maturityScore    = Math.round((etiScore * 0.4 + decisionQuality * 0.3 + coverageScore * 0.3));

    const dims: OIIDimension[] = [
      { name: 'OIS',                 score: oisScore,       weight: WEIGHTS.ois,              raw: `${oisScore}/100 OIS` },
      { name: 'COIG',                score: coigScore,      weight: WEIGHTS.coig,             raw: `COIG ${coigRaw >= 0 ? '+' : ''}${coigRaw}` },
      { name: 'ETI',                 score: etiScore,       weight: WEIGHTS.eti,              raw: `ETI ${etiScore}/100 (${eti?.grade ?? '?'})` },
      { name: 'Knowledge Coverage',  score: coverageScore,  weight: WEIGHTS.knowledgeCoverage, raw: `${coverageScore}% avg maturity` },
      { name: 'Learning Velocity',   score: velocityScore,  weight: WEIGHTS.learningVelocity, raw: `${recentLessons} lessons/week` },
      { name: 'Decision Quality',    score: decisionQuality, weight: WEIGHTS.decisionQuality, raw: `${outcomes} outcomes recorded` },
      { name: 'Prediction Accuracy', score: predAccuracy,   weight: WEIGHTS.predictionAccuracy, raw: `${predAccuracy}% accuracy` },
      { name: 'Automation Rate',     score: automationScore, weight: WEIGHTS.automationRate,  raw: `${automationScore}% autonomous` },
      { name: 'Executive Maturity',  score: maturityScore,  weight: WEIGHTS.executiveMaturity, raw: `composite ETI+quality+coverage` },
    ];

    const composite = Math.round(
      dims.reduce((sum, d) => sum + d.score * d.weight, 0)
    );

    const result: OIIResult = {
      score:      composite,
      grade:      gradeOf(composite),
      dimensions: dims,
      computedAt: new Date().toISOString(),
    };

    // Persist snapshot asynchronously — never block the caller
    void (prisma as any).oIISnapshot.create({
      data: { score: composite, grade: result.grade, dimensions: dims as any },
    }).catch(() => null);

    return result;
  }

  static async history(limit = 30): Promise<{ score: number; grade: string; computedAt: string }[]> {
    const rows = await (prisma as any).oIISnapshot.findMany({
      orderBy: { computedAt: 'desc' },
      take:    limit,
      select:  { score: true, grade: true, computedAt: true },
    }).catch(() => []);
    return rows.map((r: any) => ({ ...r, computedAt: r.computedAt.toISOString() }));
  }
}
