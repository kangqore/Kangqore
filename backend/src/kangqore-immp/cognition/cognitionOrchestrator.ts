// ---------------------------------------------------------------------------
// Cognition Orchestrator — Single entry point for the Enterprise Cognition Layer
// Constitutional Invariant 6: append-only, forward-only, event-sourced.
// No engine calls another engine. All flow is through this orchestrator.
// ---------------------------------------------------------------------------

import { prisma }                    from '../../lib/prisma';
import { EvidenceEngine, EvidenceInput } from './evidenceEngine';
import { ObservationLearningEngine } from './observationLearningEngine';
import { InsightEngine }             from './insightEngine';
import { KnowledgeEngine, PromotionResult } from './knowledgeEngine';
import { EvolutionEngine }           from './evolutionEngine';
import { TrustEngine }               from './trustEngine';

export interface CognitionInput {
  type:       'decision_outcome' | 'mission_complete' | 'simulation_result' | 'user_feedback';
  sourceId:   string;
  outcome:    string;
  userId?:    string;
  domain:     string;
  tier:       string;
  isPositive?: boolean;
  confidence?: number;
  roiValue?:  number;
}

export interface CognitionResult {
  evidence:    any;
  observation: any;
  lesson:      any;
  insight?:    any;
  pattern?:    any;
  principle?:  any;
  playbook?:   any;
  policy?:     any;
  etiImpact:          { before: number; after: number };
  promoted:           boolean;
  governanceUpgraded: boolean;
}

function isPositiveOutcome(outcome: string | null | undefined, explicit?: boolean): boolean {
  if (explicit !== undefined) return explicit;
  if (!outcome) return false;
  const lower = outcome.toLowerCase();
  return ['converted', 'approved', 'closed', 'resolved', 'positive', 'won', 'success'].some(k => lower.includes(k));
}

export class CognitionOrchestrator {
  static async process(input: CognitionInput): Promise<CognitionResult> {
    // ── 1. ETI before ────────────────────────────────────────────────────────
    const etiBefore = await TrustEngine.getETI().catch(() => null);
    const scoreBefore = etiBefore?.overall ?? 0;

    // ── 2. Evidence capture (no LLM, immutable) ───────────────────────────────
    const evidenceInput: EvidenceInput = {
      source:    input.type === 'decision_outcome' ? 'decision' :
                 input.type === 'mission_complete' ? 'mission' : 'feedback',
      sourceId:  input.sourceId,
      decisionId: input.type === 'decision_outcome' ? input.sourceId : undefined,
      domain:    input.domain,
      tier:      input.tier,
      rawData:   {
        outcome:     input.outcome,
        isPositive:  isPositiveOutcome(input.outcome, input.isPositive),
        confidence:  input.confidence ?? null,
        roiValue:    input.roiValue ?? null,
        recordedBy:  input.userId ?? 'SYSTEM',
        recordedAt:  new Date().toISOString(),
      },
    };
    const evidence = await EvidenceEngine.capture(evidenceInput);

    // ── 3. Observation + Lesson (Haiku ×2) ────────────────────────────────────
    const { observation, lesson } = await ObservationLearningEngine.process(evidence.id);

    // ── 4. Insight detection ─────────────────────────────────────────────────
    const insight = await InsightEngine.checkAndSynthesize(lesson.id).catch(() => null);

    // ── 5. Knowledge promotion (Pattern → Principle → Playbook) ──────────────
    const promotionResult = await KnowledgeEngine.checkPromotion(lesson.id).catch((): PromotionResult => ({ promoted: false }));

    // ── 6. Policy evolution ───────────────────────────────────────────────────
    const policy = lesson.policyChange
      ? await EvolutionEngine.evolveFromLesson(lesson.id).catch(() => null)
      : null;

    // Also evolve from new principle if one was created
    if (promotionResult.principle) {
      await EvolutionEngine.evolveFromPrinciple(promotionResult.principle.id).catch(() => null);
    }

    // ── 7. Trust recording ────────────────────────────────────────────────────
    if (input.type === 'decision_outcome') {
      await TrustEngine.recordDataPoint(
        input.sourceId,
        input.confidence ?? 0,
        isPositiveOutcome(input.outcome, input.isPositive),
      ).catch(() => null);
    }

    // ── 8. Update decision recommendation state ───────────────────────────────
    if (input.type === 'decision_outcome') {
      const stateUpdate: any = {
        outcome:    input.outcome,
        outcomeAt:  new Date(),
        outcomeBy:  input.userId ?? null,
        observedAt: new Date(),
        learnedAt:  promotionResult.promoted ? new Date() : undefined,
      };
      if (promotionResult.promoted) stateUpdate.recommendationState = 'LEARNED';
      else                          stateUpdate.recommendationState  = 'OBSERVED';

      await (prisma as any).kimmpDecision.update({
        where: { id: input.sourceId },
        data:  stateUpdate,
      }).catch(() => null);
    }

    // ── 9. ETI after ─────────────────────────────────────────────────────────
    const etiAfter  = await TrustEngine.getETI().catch(() => null);
    const scoreAfter = etiAfter?.overall ?? 0;

    // ── 10. WAANDA self-governance check ─────────────────────────────────────
    // After every cycle, assess whether the knowledge base is mature enough to
    // upgrade from BOOTSTRAP (auto-promote) to GOVERNED (CEO review required).
    const governanceCheck = await EvolutionEngine.assessGovernanceReadiness().catch(() => null);

    // ── 11. WAANDA ETI watch ──────────────────────────────────────────────────
    // ETI falling to/below 60: WAANDA directs KIMMP into conservative mode.
    // ETI recovering above 70: WAANDA automatically clears conservative mode.
    if (scoreAfter <= 60 && scoreAfter < scoreBefore) {
      import('../../waanda/WaandaAuthority').then(({ WaandaAuthority }) => {
        WaandaAuthority.issueDirective('KIMMP', 'CONFIGURE', {
          criticalThresholdRaised: true,
          autonomousActionsReduced: true,
          etiScore: scoreAfter,
        }, `ETI fell to ${scoreAfter} — KIMMP entering conservative mode`).catch(() => {})
      }).catch(() => {})
    } else if (scoreAfter > 70 && scoreBefore <= 60) {
      import('../../waanda/WaandaAuthority').then(({ WaandaAuthority }) => {
        WaandaAuthority.issueDirective('KIMMP', 'CONFIGURE', {
          conservativeModeCleared: true,
          etiScore: scoreAfter,
        }, `ETI recovered to ${scoreAfter} — lifting conservative mode`).catch(() => {})
      }).catch(() => {})
    }

    return {
      evidence,
      observation,
      lesson,
      insight:   insight   ?? undefined,
      pattern:   promotionResult.pattern   ?? undefined,
      principle: promotionResult.principle ?? undefined,
      playbook:  promotionResult.playbook  ?? undefined,
      policy:    policy    ?? undefined,
      etiImpact: { before: scoreBefore, after: scoreAfter },
      promoted:  promotionResult.promoted,
      governanceUpgraded: governanceCheck?.upgraded ?? false,
    };
  }
}
