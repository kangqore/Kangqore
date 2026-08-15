// ---------------------------------------------------------------------------
// Trust Engine — ETI + 8 trust dimensions + Knowledge Coverage
// ETI is one output. Trust is contextual and multi-dimensional.
// Simulation Trust is RESERVED (Phase 6.7) — always returns null.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';

export interface TrustScore {
  score:         number;
  evidenceCount: number;
  lastValidated: Date | null;
  trend:         'IMPROVING' | 'STABLE' | 'DRIFTING';
}

export interface ETIDimensions {
  predictionAccuracy:      TrustScore;
  decisionAccuracy:        TrustScore;
  outcomeSuccess:          TrustScore;
  recommendationAcceptance: TrustScore;
  calibrationDrift:        TrustScore;
  coverage:                TrustScore;
  stability:               TrustScore;
  reliability:             TrustScore;
  simulationTrust:         null; // RESERVED — Phase 6.7
}

export interface ETIResult {
  overall:    number;
  grade:      'A' | 'B' | 'C' | 'D' | 'F';
  dimensions: ETIDimensions;
  snapshotAt: Date;
}

export interface KnowledgeCoverageEntry {
  domain:        string;
  coverage:      number;
  evidenceCount:  number;
  lessonCount:   number;
  insightCount:  number;
  principleCount: number;
  playbookCount: number;
  maturityLevel: 'NASCENT' | 'DEVELOPING' | 'ESTABLISHED' | 'MATURE';
}

export interface KnowledgeCoverage {
  overall: number;
  domains: KnowledgeCoverageEntry[];
}

function grade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function toTrustScore(score: number, count: number, prev: number | null, last: Date | null): TrustScore {
  const trend: TrustScore['trend'] =
    prev === null ? 'STABLE' :
    score > prev + 2 ? 'IMPROVING' :
    score < prev - 2 ? 'DRIFTING' :
    'STABLE';
  return { score, evidenceCount: count, lastValidated: last, trend };
}

export class TrustEngine {
  static async recordDataPoint(
    decisionId: string,
    confidence: number,
    isPositive: boolean,
  ): Promise<void> {
    // Update the decision recommendation state
    try {
      await (prisma as any).kimmpDecision.update({
        where: { id: decisionId },
        data:  {
          recommendationState: 'VALIDATED',
          validatedAt:         new Date(),
        },
      });
    } catch { /* decision may not exist */ }

    // Write a fresh ETISnapshot after every data point
    await this._writeSnapshot();
  }

  static async getETI(): Promise<ETIResult> {
    const latest = await (prisma as any).eTISnapshot.findFirst({
      orderBy: { snapshotAt: 'desc' },
    });

    if (!latest) return this._emptyETI();

    const prev = await (prisma as any).eTISnapshot.findFirst({
      where:   { snapshotAt: { lt: latest.snapshotAt } },
      orderBy: { snapshotAt: 'desc' },
    });

    const dim: ETIDimensions = {
      predictionAccuracy:       toTrustScore(latest.predictionAccuracy,       0, prev?.predictionAccuracy ?? null,       latest.snapshotAt),
      decisionAccuracy:         toTrustScore(latest.decisionAccuracy,         0, prev?.decisionAccuracy ?? null,         latest.snapshotAt),
      outcomeSuccess:           toTrustScore(latest.outcomeSuccess,           0, prev?.outcomeSuccess ?? null,           latest.snapshotAt),
      recommendationAcceptance: toTrustScore(latest.recommendationAcceptance, 0, prev?.recommendationAcceptance ?? null, latest.snapshotAt),
      calibrationDrift:         toTrustScore(latest.calibrationDrift,         0, prev?.calibrationDrift ?? null,         latest.snapshotAt),
      coverage:                 toTrustScore(latest.coverage,                 0, prev?.coverage ?? null,                 latest.snapshotAt),
      stability:                toTrustScore(latest.stability,                0, prev?.stability ?? null,                latest.snapshotAt),
      reliability:              toTrustScore(latest.reliability,              0, prev?.reliability ?? null,              latest.snapshotAt),
      simulationTrust:          null,
    };

    return {
      overall:    latest.overallScore,
      grade:      grade(latest.overallScore),
      dimensions: dim,
      snapshotAt: latest.snapshotAt,
    };
  }

  static async getTrend(window: 'week' | 'month' | 'quarter'): Promise<any[]> {
    const from = new Date();
    if (window === 'week')    from.setDate(from.getDate() - 7);
    else if (window === 'month') from.setMonth(from.getMonth() - 1);
    else                     from.setMonth(from.getMonth() - 3);

    const snapshots = await (prisma as any).eTISnapshot.findMany({
      where:   { snapshotAt: { gte: from } },
      orderBy: { snapshotAt: 'asc' },
    });

    return snapshots.map((s: any) => ({
      date:  s.snapshotAt,
      score: s.overallScore,
      grade: grade(s.overallScore),
    }));
  }

  static async getPredictionTrust(): Promise<TrustScore> {
    const s = await (prisma as any).eTISnapshot.findFirst({ orderBy: { snapshotAt: 'desc' } });
    const prev = s ? await (prisma as any).eTISnapshot.findFirst({ where: { snapshotAt: { lt: s.snapshotAt } }, orderBy: { snapshotAt: 'desc' } }) : null;
    return toTrustScore(s?.predictionAccuracy ?? 0, 0, prev?.predictionAccuracy ?? null, s?.snapshotAt ?? null);
  }

  static async getRecommendationTrust(): Promise<TrustScore> {
    const s = await (prisma as any).eTISnapshot.findFirst({ orderBy: { snapshotAt: 'desc' } });
    const prev = s ? await (prisma as any).eTISnapshot.findFirst({ where: { snapshotAt: { lt: s.snapshotAt } }, orderBy: { snapshotAt: 'desc' } }) : null;
    return toTrustScore(s?.recommendationAcceptance ?? 0, 0, prev?.recommendationAcceptance ?? null, s?.snapshotAt ?? null);
  }

  // Simulation Trust is reserved until Phase 6.7
  static getSimulationTrust(): null { return null; }

  static async getKnowledgeCoverage(): Promise<KnowledgeCoverage> {
    const DOMAINS = ['sales', 'delivery', 'finance', 'market', 'operations', 'people', 'product', 'risk'];

    const entries = await Promise.all(DOMAINS.map(async domain => {
      const [ev, ls, ins, prin, pb] = await Promise.all([
        (prisma as any).enterpriseEvidence.count({ where: { domain } }),
        (prisma as any).enterpriseLesson.count({ where: { domain } }),
        (prisma as any).enterpriseInsight.count({ where: { domain } }),
        (prisma as any).enterprisePrinciple.count({ where: { domain, status: 'ACTIVE' } }),
        (prisma as any).enterprisePlaybook.count({ where: { domain, status: 'ACTIVE' } }),
      ]);

      let coverage = 0;
      if (ev > 0)   coverage += 10;
      if (ls >= 3)  coverage += 20;
      if (ls >= 10) coverage += 15;
      if (ins >= 1) coverage += 20;
      if (prin >= 1) coverage += 20;
      if (pb >= 1)  coverage += 15;

      const maturityLevel: KnowledgeCoverageEntry['maturityLevel'] =
        pb >= 1   ? 'MATURE' :
        prin >= 1 ? 'ESTABLISHED' :
        ls >= 1   ? 'DEVELOPING' :
        'NASCENT';

      return {
        domain, coverage, evidenceCount: ev,
        lessonCount: ls, insightCount: ins, principleCount: prin, playbookCount: pb,
        maturityLevel,
      } as KnowledgeCoverageEntry;
    }));

    const overall = entries.reduce((s, e) => s + e.coverage, 0) / DOMAINS.length;
    return { overall: Math.round(overall), domains: entries.sort((a, b) => b.coverage - a.coverage) };
  }

  // ── Private ──────────────────────────────────────────────────────────────────

  private static async _writeSnapshot(): Promise<void> {
    const scores = await this._computeScores();
    const overall = Math.round(
      (scores.predictionAccuracy + scores.decisionAccuracy + scores.outcomeSuccess +
       scores.recommendationAcceptance + scores.calibrationDrift + scores.coverage +
       scores.stability + scores.reliability) / 8
    );

    await (prisma as any).eTISnapshot.create({
      data: { ...scores, overallScore: overall, snapshotAt: new Date() },
    });
  }

  private static async _computeScores() {
    const [total, withOutcome, approved, dismissed] = await Promise.all([
      (prisma as any).kimmpDecision.count(),
      (prisma as any).kimmpDecision.count({ where: { outcome: { not: null } } }),
      (prisma as any).kimmpDecision.count({ where: { status: 'APPROVED' } }),
      (prisma as any).kimmpDecision.count({ where: { status: 'DISMISSED' } }),
    ]);

    const positiveOutcomes = withOutcome > 0
      ? await (prisma as any).kimmpDecision.count({
          where: { outcome: { contains: 'positive', mode: 'insensitive' } },
        }).catch(() => 0)
      : 0;

    const decisionAccuracy         = withOutcome > 0 ? Math.round((positiveOutcomes / withOutcome) * 100) : 50;
    const recommendationAcceptance = (approved + dismissed) > 0 ? Math.round((approved / (approved + dismissed)) * 100) : 50;
    const coverage                 = total > 0 ? Math.round((withOutcome / total) * 100) : 0;

    // Prediction accuracy from PredictionStore data
    let predictionAccuracy = 50;
    try {
      const preds = await (prisma as any).kimmpPrediction.findMany({
        where:   { actualConverted: { not: null } },
        take:    100,
        orderBy: { createdAt: 'desc' },
      });
      if (preds.length > 0) {
        const correct = preds.filter((p: any) => {
          const predicted = p.conversionProbability > 0.5;
          return predicted === p.actualConverted;
        }).length;
        predictionAccuracy = Math.round((correct / preds.length) * 100);
      }
    } catch { /* no prediction data yet */ }

    const outcomeSuccess      = decisionAccuracy;
    const calibrationDrift    = Math.max(0, 100 - Math.abs(predictionAccuracy - decisionAccuracy) * 2);
    const stability           = total >= 5 ? Math.min(100, 60 + coverage) : 50;
    const reliability         = Math.round((predictionAccuracy + decisionAccuracy + recommendationAcceptance) / 3);

    return {
      predictionAccuracy, decisionAccuracy, outcomeSuccess,
      recommendationAcceptance, calibrationDrift, coverage, stability, reliability,
    };
  }

  private static _emptyETI(): ETIResult {
    const empty: TrustScore = { score: 0, evidenceCount: 0, lastValidated: null, trend: 'STABLE' };
    return {
      overall: 0, grade: 'F',
      dimensions: {
        predictionAccuracy: empty, decisionAccuracy: empty, outcomeSuccess: empty,
        recommendationAcceptance: empty, calibrationDrift: empty, coverage: empty,
        stability: empty, reliability: empty, simulationTrust: null,
      },
      snapshotAt: new Date(),
    };
  }
}
