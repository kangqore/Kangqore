// ---------------------------------------------------------------------------
// KIMMP Phase 6 — Command Center Aggregate Service
//
// Single endpoint that fans out to all 7 intelligence sources in parallel and
// returns one unified snapshot. Never blocks on a single source — each call
// degrades gracefully to empty/null on failure so the cockpit always renders.
// ---------------------------------------------------------------------------

import { prisma }                   from '../../lib/prisma';
import { SignalLedger }             from '../signals/signalLedger.service';
import { DecisionEngine }           from '../decision/decisionEngine.service';
import { PredictionStore }          from '../prediction/predictionStore.service';
import { WaandaTrainingPipeline }   from '../../waanda-training/trainingPipeline.service';
import { KimmpCostTracker }         from '../governance/costTracker.service';
import { computeGate8 }             from '../../waanda/intelligence/gate8.service';
import { BusinessDomainsService, BusinessDomain } from './businessDomains.service';

export interface CommandCenterSnapshot {
  business: BusinessDomain[]
  signals: {
    criticalCount:    number
    highCount:        number
    newCount:         number
    totalCount:       number
    avgConfidence:    number
    recent:           unknown[]
  }
  decisions: {
    proposedCount: number
    top:           unknown[]
  }
  predictions: {
    atRisk:                  unknown[]
    highRiskCount:           number
    avgConversionProbability: number
  }
  training:    unknown
  cost:        unknown
  ois:         { score: number } | null
  generatedAt: string
}

export class CommandCenterService {
  static async aggregate(): Promise<CommandCenterSnapshot> {
    const [business, signalKpi, recentSignals, allProposedDecisions, atRiskLeads, training, cost, gate8] =
      await Promise.all([
        BusinessDomainsService.aggregate().catch(() => [] as BusinessDomain[]),

        (prisma as any).kimmpSignal
          .groupBy({ by: ['severity', 'status'], _count: { _all: true } })
          .catch(() => [] as any[]),

        SignalLedger.query({ limit: 15 }),

        DecisionEngine.list('PROPOSED').catch(() => null),

        PredictionStore.listTopAtRisk(5),

        WaandaTrainingPipeline.stats().catch(() => null),

        KimmpCostTracker.summary(30),

        computeGate8().catch(() => null),
      ]);

    // ── Signals ──────────────────────────────────────────────────────────────
    let criticalCount = 0, highCount = 0, newCount = 0, totalCount = 0;
    for (const row of (signalKpi as any[])) {
      const cnt = (row._count?._all ?? 0) as number;
      totalCount += cnt;
      if (row.severity === 'CRITICAL') criticalCount += cnt;
      if (row.severity === 'HIGH')     highCount     += cnt;
      if (row.status   === 'NEW')      newCount      += cnt;
    }

    const recentArr = Array.isArray(recentSignals) ? recentSignals : [];
    const avgConfidence = recentArr.length
      ? Math.round(
          recentArr.reduce((s: number, sig: any) => s + (Number(sig.confidence) || 0), 0) /
          recentArr.length * 100
        )
      : 0;

    // ── Decisions ─────────────────────────────────────────────────────────────
    const proposedArr = Array.isArray(allProposedDecisions) ? allProposedDecisions : [];

    // ── Predictions ───────────────────────────────────────────────────────────
    const atRiskArr = Array.isArray(atRiskLeads) ? atRiskLeads : [];
    const highRiskCount = atRiskArr.filter((p: any) => p.deliveryRisk === 'HIGH').length;
    const avgConvProb = atRiskArr.length
      ? atRiskArr.reduce((s: number, p: any) => s + (Number(p.conversionProbability) || 0), 0) /
        atRiskArr.length
      : 0;

    return {
      business,
      signals: {
        criticalCount,
        highCount,
        newCount,
        totalCount,
        avgConfidence,
        recent: recentArr,
      },
      decisions: {
        proposedCount: proposedArr.length,
        top:           proposedArr.slice(0, 5),
      },
      predictions: {
        atRisk:                   atRiskArr,
        highRiskCount,
        avgConversionProbability: Math.round(avgConvProb * 100) / 100,
      },
      training,
      cost,
      ois: gate8 ? { score: Math.round(gate8.oisScore) } : null,
      generatedAt: new Date().toISOString(),
    };
  }
}
