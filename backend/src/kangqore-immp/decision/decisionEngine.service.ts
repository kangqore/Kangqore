// ---------------------------------------------------------------------------
// KIMMP Decision Engine (Phase 3)
//
// Reads NEW signals from the Signal Ledger, applies the decision policy, and
// records PROPOSED decisions for an admin to review. KIMMP decides and
// recommends — it does NOT auto-execute. Turning a decision into a real
// cross-system action is gated on the Phase-4 governance/permission layer and
// admin approval (locked rule: never silent action).
//
// `prisma as any`: the generated client may lack the kimmpDecision /
// kimmpSignal accessors on a fresh checkout.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { KimmpTracer } from '../governance/kimmpTracer.service';
import { decide, SignalLike } from './decisionPolicy';
import { KimmpPredictionService } from '../prediction/kimmpPrediction.service';
import { PredictionStore } from '../prediction/predictionStore.service';

export interface EvaluateResult {
  signalsEvaluated: number;
  decisionsProposed: number;
  noActionNeeded: number;
}

export class DecisionEngine {
  /** Evaluate NEW signals, propose decisions, mark the signals processed. */
  static async evaluate(limit = 200): Promise<EvaluateResult> {
    let signals: any[] = [];
    try {
      signals = await (prisma as any).kimmpSignal.findMany({
        where: { status: 'NEW' },
        orderBy: { createdAt: 'asc' },
        take: Math.min(Math.max(1, limit), 1000),
      });
    } catch (error) {
      logger.warn('KIMMP decision engine: cannot read signals — ' + (error as Error).message);
      return { signalsEvaluated: 0, decisionsProposed: 0, noActionNeeded: 0 };
    }

    let proposed = 0;
    let noAction = 0;

    for (const s of signals) {
      const signal: SignalLike = {
        id: s.id,
        sourceModule: s.sourceModule,
        signalType: s.signalType,
        signalCategory: s.signalCategory,
        signalValue: s.signalValue,
        confidence: Number(s.confidence) || 0,
        severity: s.severity,
        conversationId: s.conversationId,
        leadId: s.leadId,
      };

      const proposal = decide(signal);
      try {
        if (proposal) {
          // Phase 5 — run prediction for lead-bearing signals and boost priority.
          let finalPriority = proposal.priority;
          if (signal.leadId) {
            const prediction = await KimmpPredictionService.predict(signal.leadId);
            if (prediction) {
              // High conversion probability → bump priority by up to +8.
              if (prediction.conversionProbability >= 0.7) finalPriority = Math.min(34, finalPriority + 8);
              else if (prediction.conversionProbability >= 0.5) finalPriority = Math.min(34, finalPriority + 4);
              // High delivery risk on an outward action → bump priority.
              if (prediction.deliveryRisk === 'HIGH') finalPriority = Math.min(34, finalPriority + 5);
              // Store the prediction (fire-and-forget).
              void PredictionStore.save(prediction);
            }
          }

          const row = await (prisma as any).kimmpDecision.create({
            data: {
              signalId: signal.id,
              decisionType: proposal.decisionType,
              recommendedAction: proposal.recommendedAction,
              targetModule: proposal.targetModule,
              reasoning: proposal.reasoning,
              confidence: signal.confidence,
              priority: finalPriority,
              status: 'PROPOSED',
              conversationId: signal.conversationId ?? null,
              leadId: signal.leadId ?? null,
            },
          });
          // Phase 4 — trace every proposed decision.
          KimmpTracer.decisionProposed(row.id, {
            signalId: signal.id,
            decisionType: proposal.decisionType,
            targetModule: proposal.targetModule,
            priority: proposal.priority,
            confidence: signal.confidence,
            leadId: signal.leadId ?? undefined,
          });
          proposed += 1;
        } else {
          noAction += 1;
        }
        // Mark the signal processed either way — it has been evaluated.
        await (prisma as any).kimmpSignal.update({
          where: { id: signal.id },
          data: { status: 'PROCESSED' },
        });
      } catch (error) {
        logger.warn(`KIMMP decision not recorded for signal ${signal.id}: ${(error as Error).message}`);
      }
    }

    return { signalsEvaluated: signals.length, decisionsProposed: proposed, noActionNeeded: noAction };
  }

  /** List decisions, highest-priority first. Returns null if unavailable. */
  static async list(status?: string): Promise<unknown[] | null> {
    try {
      return await (prisma as any).kimmpDecision.findMany({
        where: status ? { status } : {},
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        take: 500,
      });
    } catch {
      return null;
    }
  }

  /** Update a decision's status (APPROVED | EXECUTED | DISMISSED). */
  static async setStatus(id: string, status: string): Promise<boolean> {
    try {
      await (prisma as any).kimmpDecision.update({ where: { id }, data: { status } });
      return true;
    } catch {
      return false;
    }
  }
}
