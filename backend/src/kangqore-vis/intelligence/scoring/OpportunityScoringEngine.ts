// ---------------------------------------------------------------------------
// VIS 3.1 — Opportunity Scoring Engine
//
// Turns a detected AUTHORITY_OPPORTUNITY correlation pattern into a scored,
// explainable KangqoreVisOpportunity. Evidence, Confidence and Visibility
// Potential are computed from real signals. Strategic Alignment, Business
// Value, Conversion Potential and Effort are explicitly stubbed until
// VIS 3.2/3.3/3.4 exist — see scoring/dimensions/*.ts. Missing dimensions
// reduce `certainty`; they never silently change `priorityScore`.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';
import logger from '../../../utils/logger';
import type { CorrelationPattern } from '../../../kangqore-immp/correlation/kimmpCorrelation.service';
import type { OpportunityDimensions, PriorityTier } from './types';
import { DIMENSION_WEIGHTS, TOTAL_WEIGHT, EFFORT_MULTIPLIERS } from './weights';
import { scoreEvidence } from './dimensions/evidence';
import { scoreConfidence } from './dimensions/confidence';
import { scoreVisibilityPotential } from './dimensions/visibilityPotential';
import { scoreStrategicAlignment } from './dimensions/strategicAlignment';
import { scoreBusinessValue } from './dimensions/businessValue';
import { scoreConversionPotential } from './dimensions/conversionPotential';
import { scoreEffort } from './dimensions/effort';

function priorityTierFor(priorityScore: number, certainty: number): PriorityTier {
  let tier: PriorityTier = 'LOW';
  if (priorityScore >= 80) tier = 'CRITICAL';
  else if (priorityScore >= 60) tier = 'HIGH';
  else if (priorityScore >= 35) tier = 'MODERATE';

  // Missing data reduces certainty, not the score itself — but it must cap
  // the *claim* we make about priority. Can't call something CRITICAL
  // without strategic/business context.
  if (tier === 'CRITICAL' && certainty < 0.8) tier = 'HIGH';
  return tier;
}

export class OpportunityScoringEngine {
  static async scoreAndPersist(pattern: CorrelationPattern): Promise<string | null> {
    if (pattern.name !== 'AUTHORITY_OPPORTUNITY' || pattern.signalIds.length === 0) return null;

    try {
      const signals: any[] = await (prisma as any).kimmpSignal.findMany({
        where: { id: { in: pattern.signalIds } },
      });
      if (signals.length === 0) return null;

      const entitySlugs = [
        ...new Set(signals.flatMap((s) => (s.metadata?.entitySlugs as string[]) ?? [])),
      ].sort();
      const contributingCapabilities = [...new Set(signals.map((s) => s.sourceModule))];

      const entities = entitySlugs.length
        ? await prisma.kangqoreVisEntity.findMany({ where: { slug: { in: entitySlugs } } })
        : [];
      const title = entitySlugs
        .map((slug) => entities.find((e) => e.slug === slug)?.name ?? slug)
        .join(' + ');

      const dimensions: OpportunityDimensions = {
        evidence: scoreEvidence(signals),
        confidence: scoreConfidence(pattern.confidence, signals),
        visibilityPotential: scoreVisibilityPotential(pattern.severity),
        strategicAlignment: scoreStrategicAlignment(),
        businessValue: scoreBusinessValue(),
        conversionPotential: scoreConversionPotential(),
        effort: scoreEffort(),
      };

      // Weighted average over whatever's actually scored (excludes effort —
      // it's a multiplier, not part of the additive sum).
      const additive = [
        dimensions.evidence,
        dimensions.confidence,
        dimensions.visibilityPotential,
        dimensions.strategicAlignment,
        dimensions.businessValue,
        dimensions.conversionPotential,
      ];
      const scored = additive.filter((d) => d.score !== undefined);
      const scoredWeight = scored.reduce((sum, d) => sum + d.weight, 0);
      const baseOpportunityScore = scoredWeight
        ? scored.reduce((sum, d) => sum + d.score! * d.weight, 0) / scoredWeight
        : 0;
      const certainty = scoredWeight / TOTAL_WEIGHT;

      const effortMultiplier =
        dimensions.effort.status === 'UNAVAILABLE'
          ? EFFORT_MULTIPLIERS.UNAVAILABLE
          : dimensions.effort.score! >= 70
            ? EFFORT_MULTIPLIERS.LOW
            : dimensions.effort.score! >= 40
              ? EFFORT_MULTIPLIERS.MEDIUM
              : EFFORT_MULTIPLIERS.HIGH;

      const priorityScore = Math.min(100, Math.round(baseOpportunityScore * effortMultiplier));
      const priorityTier = priorityTierFor(priorityScore, certainty);

      const unavailable = additive.filter((d) => d.status === 'UNAVAILABLE').length;
      const recommendation =
        `Create an industry/service intersection page for ${title}. ` +
        `Evidence: ${contributingCapabilities.length} independent VIS capabilities ` +
        `(${contributingCapabilities.join(', ')}) surfaced related gaps. ` +
        `Priority: ${priorityTier} at ${Math.round(certainty * 100)}% certainty — ` +
        `${unavailable} of 6 scoring dimensions are not yet available ` +
        `(${additive.filter((d) => d.status === 'UNAVAILABLE').length ? 'strategic alignment, business value and/or conversion potential were not assessed' : 'all available dimensions were assessed'}). ` +
        `Do not treat this priority as final until those are configured.`;

      const created = await prisma.kangqoreVisOpportunity.create({
        data: {
          title,
          entitySlugs,
          contributingCapabilities,
          evidenceSignalIds: pattern.signalIds,
          dimensions: dimensions as any,
          baseOpportunityScore,
          priorityScore,
          priorityTier,
          certainty,
          recommendation,
          status: 'DETECTED',
        },
      });

      logger.info(`[VIS:SCORING] ${title} → priority=${priorityTier} score=${priorityScore} certainty=${Math.round(certainty * 100)}%`);
      return created.id;
    } catch (err) {
      logger.warn(`[VIS:SCORING] scoreAndPersist failed: ${(err as Error).message}`);
      return null;
    }
  }

  /** Best-effort: link the most recently proposed matching KimmpDecision. Never throws. */
  static async linkRecentDecision(opportunityId: string, afterMs = 5000): Promise<void> {
    try {
      const opp = await prisma.kangqoreVisOpportunity.findUnique({ where: { id: opportunityId } });
      if (!opp) return;
      const decision = await (prisma as any).kimmpDecision.findFirst({
        where: {
          decisionType: 'AUTHORITY_OPPORTUNITY',
          targetModule: 'vis',
          createdAt: { gte: new Date(opp.createdAt.getTime() - afterMs) },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (decision) {
        await prisma.kangqoreVisOpportunity.update({
          where: { id: opportunityId },
          data: { decisionId: decision.id },
        });
      }
    } catch {
      // best-effort — a missing link doesn't invalidate the opportunity record.
    }
  }
}
