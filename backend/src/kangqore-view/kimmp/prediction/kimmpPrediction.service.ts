// ---------------------------------------------------------------------------
// KIMMP Phase 5 — v0 Prediction Service
//
// Three rule-based predictors that will be replaced by trained ML models once
// real conversion outcome data accumulates post-launch. Every prediction is
// stored in kimmp_predictions so the features+outcome pairs become training
// labels for the v1 models.
//
// Rules are explicit and documented so the team can see exactly what drives
// each score and override a rule as they learn more from real traffic.
//
// Predictors:
//   conversionProbability — 0.0–1.0 likelihood this lead converts
//   acvEstimate           — USD value of the deal if converted
//   deliveryRisk          — LOW | MODERATE | HIGH risk of post-sale issues
//
// The `features` snapshot is stored alongside each prediction so future models
// can be trained on historical inputs without a separate feature pipeline.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';
import logger from '../../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { LeadBehaviorSummaryService } from '../lead-intelligence-bridge/leadBehaviorSummary.service';

export type DeliveryRisk = 'LOW' | 'MODERATE' | 'HIGH';

export interface PredictionOutput {
  leadId: string;
  conversionProbability: number;
  acvEstimate: number;
  deliveryRisk: DeliveryRisk;
  modelVersion: string;
  features: Record<string, unknown>;
}

const VALUE_TIER_ACV: Record<string, number> = {
  ENTERPRISE: 120_000,
  HIGH:        50_000,
  MODERATE:    18_000,
  LOW:          5_000,
};

export class KimmpPredictionService {
  /** Run all three predictors for a lead and return the combined output. */
  static async predict(leadId: string): Promise<PredictionOutput | null> {
    if (!KimmpFlags.predictionsEnabled()) return null;

    let lead: any;
    try {
      lead = await prisma.eqoreLead.findUnique({
        where: { id: leadId },
        select: {
          id: true,
          leadScore: true,
          leadConfidence: true,
          status: true,
          projectedValue: true,
          valueTier: true,
          urgency: true,
          buyingStage: true,
          matchedServices: true,
          schedulingStatus: true,
        },
      });
    } catch {
      return null;
    }
    if (!lead) return null;

    // Fetch KIMMP behavior summary (best-effort).
    let behavior: Awaited<ReturnType<typeof LeadBehaviorSummaryService.forLead>> | null = null;
    try {
      behavior = await LeadBehaviorSummaryService.forLead(leadId, 5);
    } catch {
      behavior = null;
    }

    const features = KimmpPredictionService.buildFeatures(lead, behavior);
    const conversionProbability = KimmpPredictionService.scoreConversion(features);
    const acvEstimate = KimmpPredictionService.estimateAcv(lead, features);
    const deliveryRisk = KimmpPredictionService.assessDeliveryRisk(features);

    return {
      leadId,
      conversionProbability,
      acvEstimate,
      deliveryRisk,
      modelVersion: 'v0-rules',
      features,
    };
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private static buildFeatures(lead: any, behavior: any): Record<string, unknown> {
    return {
      leadScore: lead.leadScore,
      leadConfidence: lead.leadConfidence,
      status: lead.status,
      urgency: lead.urgency,
      buyingStage: lead.buyingStage,
      schedulingStatus: lead.schedulingStatus,
      hasMatchedServices: Array.isArray(lead.matchedServices) && lead.matchedServices.length > 0,
      valueTier: lead.valueTier,
      projectedValue: Number(lead.projectedValue ?? 0),
      behaviorPosture: behavior?.salesPosture ?? 'NEUTRAL',
      behaviorAvailable: behavior?.available ?? false,
    };
  }

  private static scoreConversion(f: Record<string, unknown>): number {
    let p = 0.05; // base — random visitor
    const score = Number(f.leadScore ?? 0);
    const confidence = Number(f.leadConfidence ?? 0);

    // Score tiers
    if (score >= 90) p += 0.40;
    else if (score >= 80) p += 0.28;
    else if (score >= 70) p += 0.18;
    else if (score >= 55) p += 0.08;

    // Confidence weight
    if (confidence >= 75) p += 0.10;
    else if (confidence >= 55) p += 0.05;

    // Status
    if (f.status === 'GOLDEN') p += 0.20;
    else if (f.status === 'HOT') p += 0.12;
    else if (f.status === 'ESCALATED') p += 0.06;

    // Scheduling boosts conversion strongly
    if (f.schedulingStatus === 'BOOKED') p += 0.15;

    // Behavior signals
    if (f.behaviorPosture === 'HIGH_INTENT') p += 0.08;
    else if (f.behaviorPosture === 'NEEDS_REASSURANCE') p += 0.02;

    // Matched services = knows what they want
    if (f.hasMatchedServices) p += 0.05;

    return Math.min(0.95, Number(p.toFixed(3)));
  }

  private static estimateAcv(lead: any, f: Record<string, unknown>): number {
    // Use projectedValue if already calculated by Lead Intelligence.
    const projected = Number(lead.projectedValue ?? 0);
    if (projected > 0) {
      // Adjust by behavior posture.
      const multiplier =
        f.behaviorPosture === 'HIGH_INTENT' ? 1.15
        : f.behaviorPosture === 'NEEDS_REASSURANCE' ? 0.90
        : 1.0;
      return Math.round(projected * multiplier);
    }

    // Fall back to valueTier defaults.
    const base = VALUE_TIER_ACV[String(lead.valueTier ?? 'LOW')] ?? 5_000;
    const multiplier =
      f.behaviorPosture === 'HIGH_INTENT' ? 1.15
      : f.behaviorPosture === 'NEEDS_REASSURANCE' ? 0.88
      : 1.0;
    return Math.round(base * multiplier);
  }

  private static assessDeliveryRisk(f: Record<string, unknown>): DeliveryRisk {
    // High urgency + stress signals = unrealistic timeline expectations.
    if (f.urgency === 'Immediate' || f.urgency === 'High') {
      if (f.behaviorPosture === 'NEEDS_REASSURANCE') return 'HIGH';
      return 'MODERATE';
    }
    // Skeptical leads may disengage early if expectations aren't met.
    if (f.behaviorPosture === 'NEEDS_REASSURANCE') return 'MODERATE';
    // Vague requirements (no matched services) → scope creep risk.
    if (!f.hasMatchedServices && Number(f.leadScore ?? 0) >= 60) return 'MODERATE';
    return 'LOW';
  }
}
