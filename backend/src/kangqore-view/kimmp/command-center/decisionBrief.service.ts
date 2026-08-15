// ---------------------------------------------------------------------------
// Phase 6.2 — Decision Brief Service
//
// Enriches a PROPOSED decision with a WAANDA narrative, historical precedent,
// expected impact, and intent alignment — before the CEO clicks Approve.
// Uses Claude Haiku (fast, cheap) as this runs inline on every approval.
// ---------------------------------------------------------------------------

import { prisma }              from '../../../lib/prisma';
import { PredictionStore }     from '../prediction/predictionStore.service';
import { IntentAlignmentService } from './intentAlignment.service';
import { haiku, textOf }       from '../llm/kimmpLLMRouter';

export interface DecisionBrief {
  decision:        unknown
  narrative:       string
  precedent:       { date: string; outcome: string; impactSummary: string } | null
  expectedImpact:  { low: string; high: string; currency: string } | null
  intentAlignment: { intentLabel: string; objectiveTitle: string | null; score: number } | null
  confidence:      number
}

// Simple positive-outcome keyword heuristic used by ETI and precedent lookup.
function isPositiveOutcome(outcome: string | null | undefined): boolean {
  if (!outcome) return false;
  const lower = outcome.toLowerCase();
  return ['converted', 'approved', 'closed', 'resolved', 'positive', 'won', 'success'].some(k => lower.includes(k));
}

export class DecisionBriefService {
  static async brief(decisionId: string): Promise<DecisionBrief | null> {
    const decision = await (prisma as any).kimmpDecision.findUnique({
      where: { id: decisionId },
    });
    if (!decision) return null;

    // ── Fan-out: impact, precedent, intent alignment in parallel ─────────────
    const [prediction, lessonMemories, pastStrategic, intentAlignment] = await Promise.all([

      // Impact estimate from prediction row (if lead-linked)
      decision.leadId
        ? PredictionStore.latestForLead(decision.leadId).catch(() => null)
        : Promise.resolve(null),

      // KimmpMemory LESSON rows mentioning the same decisionType
      (prisma as any).kimmpMemory.findMany({
        where: {
          type:    'LESSON',
          content: { contains: decision.decisionType },
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }).catch(() => []),

      // KimmpStrategicDecision with similar reasoning (simple text search)
      (prisma as any).kimmpStrategicDecision.findFirst({
        where: {
          status:    { in: ['APPROVED', 'EXECUTED'] },
          reasoning: { contains: decision.decisionType },
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true, createdAt: true, outcome: true, reasoning: true },
      }).catch(() => null),

      // Intent alignment
      IntentAlignmentService.score(
        [decision.recommendedAction ?? '', decision.targetModule ?? '', decision.decisionType ?? ''].join(' ')
      ).catch(() => null),
    ]);

    // ── Precedent ─────────────────────────────────────────────────────────────
    let precedent: DecisionBrief['precedent'] = null;

    // First try a past strategic decision with an outcome
    if (pastStrategic?.outcome) {
      precedent = {
        date:          pastStrategic.createdAt.toISOString(),
        outcome:       pastStrategic.outcome,
        impactSummary: isPositiveOutcome(pastStrategic.outcome) ? 'Positive result confirmed' : 'Mixed result',
      };
    } else if (Array.isArray(lessonMemories) && lessonMemories.length > 0) {
      // Fall back to a LESSON memory
      const lesson = lessonMemories[0];
      precedent = {
        date:          lesson.createdAt.toISOString(),
        outcome:       lesson.content.slice(0, 100),
        impactSummary: 'Based on recorded lesson',
      };
    }

    // ── Expected impact ───────────────────────────────────────────────────────
    let expectedImpact: DecisionBrief['expectedImpact'] = null;
    const acv = (prediction as any)?.acvEstimate;
    if (acv && Number(acv) > 0) {
      const low  = Math.round(Number(acv) * 0.75).toLocaleString('en-IN');
      const high = Math.round(Number(acv) * 1.25).toLocaleString('en-IN');
      expectedImpact = { low, high, currency: '₹' };
    }

    // ── WAANDA narrative (Haiku, max 80 tokens) ───────────────────────────────
    const systemPrompt =
      'You are WAANDA, the AI brain of Kangqore OS. Write a one-sentence approval recommendation for the CEO. ' +
      'Be specific. Include the why. Do not start with "I recommend". Do not use markdown.';

    const userPrompt = [
      `Decision type: ${decision.decisionType}`,
      `Recommended action: ${decision.recommendedAction ?? '(not specified)'}`,
      `Confidence: ${decision.confidence ?? 'unknown'}%`,
      precedent ? `Similar past outcome: ${precedent.outcome}` : '',
      intentAlignment ? `Aligns with intent: ${intentAlignment.intentLabel}` : '',
      expectedImpact ? `Estimated ACV impact: ${expectedImpact.currency}${expectedImpact.low} – ${expectedImpact.currency}${expectedImpact.high}` : '',
    ].filter(Boolean).join('\n');

    let narrative = 'WAANDA recommends approving this decision based on available signals.';
    try {
      const result = await haiku(systemPrompt, userPrompt, 80, { hint: 'decision-brief' });
      const text   = textOf(result).trim();
      if (text) narrative = text;
    } catch {
      // Degrade gracefully — narrative is pre-filled
    }

    return {
      decision,
      narrative,
      precedent,
      expectedImpact,
      intentAlignment: intentAlignment
        ? {
            intentLabel:    intentAlignment.intentLabel,
            objectiveTitle: intentAlignment.objectiveTitle,
            score:          intentAlignment.score,
          }
        : null,
      confidence: decision.confidence ?? 0,
    };
  }

  /**
   * Record what happened after a PROPOSED → APPROVED decision was executed.
   * Writes a KimmpMemory LESSON row so future brief() calls surface this as precedent.
   */
  static async recordOutcome(
    decisionId: string,
    outcome:    string,
    userId?:    string,
  ): Promise<boolean> {
    try {
      const decision = await (prisma as any).kimmpDecision.update({
        where: { id: decisionId },
        data:  {
          outcome,
          outcomeAt: new Date(),
          outcomeBy: userId ?? null,
        },
      });

      await (prisma as any).kimmpMemory.create({
        data: {
          type:      'LESSON',
          content:   `Decision ${decision.decisionType} on ${decision.targetModule}: ${decision.reasoning ?? ''}. Outcome: ${outcome}`,
          tags:      ['decision', 'outcome', decision.decisionType].filter(Boolean),
          decisionId: decisionId,
        },
      }).catch(() => null);

      // Close the prediction training loop if lead-linked
      if (decision.leadId) {
        await PredictionStore.recordOutcome(decision.leadId, {
        actualConverted: isPositiveOutcome(outcome),
      }).catch(() => null);
      }

      return true;
    } catch {
      return false;
    }
  }
}
