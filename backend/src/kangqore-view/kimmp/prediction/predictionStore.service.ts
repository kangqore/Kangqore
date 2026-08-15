// ---------------------------------------------------------------------------
// KIMMP Phase 5 — Prediction Store
//
// Persists prediction outputs to kimmp_predictions. Every stored row is a
// (features, prediction) pair that becomes a training sample once outcome
// labels (actualConverted, actualAcv, actualDeliveryIssue) are filled in
// post-conversion.
//
// `save()` is best-effort — never throws so a write failure cannot break the
// caller. `recordOutcome()` is called retroactively when a lead converts or
// churns to close the training loop.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';
import logger from '../../../utils/logger';
import { PredictionOutput } from './kimmpPrediction.service';

export class PredictionStore {
  /** Persist one prediction run. Returns the new id or null on failure. */
  static async save(prediction: PredictionOutput): Promise<string | null> {
    try {
      const row = await (prisma as any).kimmpPrediction.create({
        data: {
          id: crypto.randomUUID(),
          leadId: prediction.leadId,
          conversionProbability: prediction.conversionProbability,
          acvEstimate: prediction.acvEstimate,
          deliveryRisk: prediction.deliveryRisk,
          modelVersion: prediction.modelVersion,
          features: prediction.features as any,
        },
      });
      return row.id as string;
    } catch (err) {
      logger.warn('KIMMP prediction not stored: ' + (err as Error).message);
      return null;
    }
  }

  /** Fetch the most recent prediction for a lead (or null if none / unavailable). */
  static async latestForLead(leadId: string): Promise<unknown | null> {
    try {
      return await (prisma as any).kimmpPrediction.findFirst({
        where: { leadId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return null;
    }
  }

  /** Fetch all predictions for a lead, newest first. */
  static async historyForLead(leadId: string, limit = 20): Promise<unknown[]> {
    try {
      return await (prisma as any).kimmpPrediction.findMany({
        where: { leadId },
        orderBy: { createdAt: 'desc' },
        take: Math.min(Math.max(1, limit), 100),
      });
    } catch {
      return [];
    }
  }

  /** Global list of top at-risk leads — highest deliveryRisk, lowest conversion first. */
  static async listTopAtRisk(limit = 5): Promise<unknown[]> {
    try {
      return await (prisma as any).kimmpPrediction.findMany({
        orderBy: [
          { deliveryRisk: 'desc' },
          { conversionProbability: 'asc' },
        ],
        take: Math.min(Math.max(1, limit), 20),
        select: {
          id: true, leadId: true, conversionProbability: true,
          acvEstimate: true, deliveryRisk: true, modelVersion: true, createdAt: true,
        },
      });
    } catch { return []; }
  }

  /**
   * Record actual outcomes retroactively — closes the training loop.
   * Called when a lead converts (CONVERTED status) or a delivery issue is flagged.
   */
  static async recordOutcome(
    predictionId: string,
    outcome: { actualConverted?: boolean; actualAcv?: number; actualDeliveryIssue?: boolean }
  ): Promise<boolean> {
    try {
      await (prisma as any).kimmpPrediction.update({
        where: { id: predictionId },
        data: outcome,
      });
      return true;
    } catch {
      return false;
    }
  }
}
