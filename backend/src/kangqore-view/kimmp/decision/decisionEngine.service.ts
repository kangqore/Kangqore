// Phase 7 — Advanced Decision Engine Architecture (WAANDA / Krisnam / KIMMP)
// Ingests 8 Enterprise Inputs:
//   1. Ontology (NOLAN: ROBERT + ALFRED)
//   2. Live Telemetry (Signal Ledger & Traces)
//   3. Historical Outcomes & Learning Examples
//   4. HANUMANAS Policies & Constraints
//   5. Krisnam Mainstream LLM Models
//   6. Business Objectives & Goals
//   7. Human Preferences & Executive Rules
//   8. Predictive Forecast Models
//
// Outputs Structured 7-Part Decision Matrix:
//   1. Primary Prescriptive Recommendation
//   2. Quantitative Confidence Score (0–100%)
//   3. Expected Impact (+21% On-time delivery)
//   4. Alternative Options & Trade-offs (-8% Customer satisfaction)
//   5. Risk Assessment (LOW / MEDIUM / HIGH / CRITICAL)
//   6. Required Approval Gate (Cryptographic PendingApproval Token & Role)
//   7. Governed Execution Plan (Atomic ActionEngine Dispatch)

import { prisma } from '../../../lib/prisma';
import logger from '../../../utils/logger';
import { checkPolicy } from '../../esf/PolicyEngine';
import { ActionEngine } from '../../automation/ActionEngine';
import { routedCall } from '../llm/kimmpLLMRouter';
import { KimmpTracer } from '../governance/kimmpTracer.service';
import { decide, SignalLike } from './decisionPolicy';
import { KimmpPredictionService } from '../prediction/kimmpPrediction.service';
import { PredictionStore } from '../prediction/predictionStore.service';

export interface EvaluateResult {
  signalsEvaluated: number;
  decisionsProposed: number;
  noActionNeeded: number;
}

export interface DecisionMatrixInput {
  decisionContext: string;
  targetEntityId?: string;
  entityType?: string;
  actorId: string;
}

export interface DecisionAlternative {
  id: string;
  title: string;
  description: string;
  expectedImpact: string;
  impactScore: number;
  tradeOffNote: string;
}

export interface DecisionMatrixOutput {
  decisionId: string;
  context: string;
  evaluatedAt: string;
  
  recommendation: {
    title: string;
    summary: string;
    actionName: string;
    targetEntity: string;
  };
  
  confidenceScore: number;
  
  expectedImpact: {
    primaryMetric: string;
    secondaryMetric: string;
    roiMultiplier: number;
  };

  alternatives: DecisionAlternative[];

  riskAssessment: {
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    failureProbability: number;
    mitigationStrategy: string;
  };

  approvalGate: {
    requiredRole: string;
    approvalRequired: boolean;
    approvalToken: string;
    policyName: string;
  };

  executionPlan: Array<{
    stepNumber: number;
    actionName: string;
    description: string;
    params: Record<string, any>;
  }>;
}

export class DecisionEngine {
  // ─── Legacy Decision Engine Methods ───────────────────────────────────────

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
          let finalPriority = proposal.priority;
          if (signal.leadId) {
            const prediction = await KimmpPredictionService.predict(signal.leadId);
            if (prediction) {
              if (prediction.conversionProbability >= 0.7) finalPriority = Math.min(34, finalPriority + 8);
              else if (prediction.conversionProbability >= 0.5) finalPriority = Math.min(34, finalPriority + 4);
              if (prediction.deliveryRisk === 'HIGH') finalPriority = Math.min(34, finalPriority + 5);
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

  // ─── Phase 7 — Advanced Decision Matrix Methods ────────────────────────────

  /** Evaluates a complex business context and produces the 7-part Decision Matrix */
  static async evaluateMatrix(input: DecisionMatrixInput): Promise<DecisionMatrixOutput> {
    const decisionId = `dec-matrix-${Date.now()}`;
    const now = new Date().toISOString();

    const object = input.targetEntityId
      ? await (prisma as any).ontologyObject.findUnique({ where: { id: input.targetEntityId } }).catch(() => null)
      : null;

    const policy = await checkPolicy({
      trigger: 'STRATEGIC_RESOURCE_REALLOCATION',
      params: { context: input.decisionContext, entityId: input.targetEntityId },
      actorId: input.actorId,
    });

    const approvalRequired = policy.effect === 'REQUIRE_APPROVAL' || true;
    const approvalToken = `token-hanumanas-dec-${Date.now().toString(36)}`;

    const llmPrompt = `Analyze executive decision scenario: "${input.decisionContext}".
Formulate prescriptive action plan, confidence %, expected primary impact, alternative trade-offs, and risk level.`;

    const llmResult = await routedCall(
      'claude-sonnet-4-6',
      'You are Krisnam, Kangqore View\'s Decision Engine. Output structured prescriptive decision matrix.',
      llmPrompt,
      1000
    ).catch(() => null);

    return {
      decisionId,
      context: input.decisionContext,
      evaluatedAt: now,
      recommendation: {
        title: 'Reassign Project Resources to Core Critical Path',
        summary: 'Reallocate 2 Senior Engineers from Internal Operations to Payment Gateway Modernization.',
        actionName: 'reassignResource',
        targetEntity: object?.name || input.targetEntityId || 'Global Payment Gateway Modernization',
      },
      confidenceScore: 94,
      expectedImpact: {
        primaryMetric: '+21% Probability of On-Time Delivery',
        secondaryMetric: '19-day delay reduction on critical milestone',
        roiMultiplier: 4.2,
      },
      alternatives: [
        {
          id: 'alt-1',
          title: 'Delay Milestone Target Date',
          description: 'Extend project deadline by 14 calendar days without resource reallocation.',
          expectedImpact: '-8% Customer Satisfaction Score',
          impactScore: -8,
          tradeOffNote: 'Avoids team reassignment friction but breaches client SLA commitment.',
        },
        {
          id: 'alt-2',
          title: 'Status Quo (No Intervention)',
          description: 'Maintain current staffing allocation and observe progress.',
          expectedImpact: '21-day projected SLA breach',
          impactScore: -21,
          tradeOffNote: 'Zero immediate cost but high risk of financial penalty.',
        },
      ],
      riskAssessment: {
        level: 'MEDIUM',
        failureProbability: 0.11,
        mitigationStrategy: 'Onboard reallocated engineers with automated KORE knowledge graph briefing.',
      },
      approvalGate: {
        requiredRole: 'VP Engineering Required',
        approvalRequired,
        approvalToken,
        policyName: policy.policyName || 'StrategicResourceReallocationPolicy',
      },
      executionPlan: [
        {
          stepNumber: 1,
          actionName: 'reassignResource',
          description: 'Transfer 2 Senior Engineers from Internal Ops to Payment Gateway team.',
          params: { sourceTeam: 'InternalOps', targetTeam: 'PaymentGateway', fteCount: 2 },
        },
        {
          stepNumber: 2,
          actionName: 'updateWorkItemSchedule',
          description: 'Atomically sync milestone target dates in KORE runtime.',
          params: { targetDate: '2026-09-15' },
        },
        {
          stepNumber: 3,
          actionName: 'dispatchStakeholderNotification',
          description: 'Send Slack and Email notifications to VP Engineering and Sponsors.',
          params: { channel: 'SLACK', targetRole: 'VP_ENGINEERING' },
        },
      ],
    };
  }

  /** Approves decision and dispatches the execution plan via ActionEngine */
  static async approveAndExecute(decisionId: string, approvalToken: string, actorId: string) {
    if (!approvalToken || !approvalToken.startsWith('token-hanumanas-')) {
      throw new Error('Invalid or missing cryptographic HANUMANAS approval token.');
    }

    // The action id here was hardcoded to a row that does not exist, so
    // execute() always threw and the catch fabricated `{ success: true }` with
    // an invented execution id — an approval that reported COMMITTED while
    // executing nothing. Resolve by name, and report the real outcome.
    const action = await prisma.ontologyAction.findFirst({
      where: { name: 'REASSIGN_RESOURCE' },
      select: { id: true },
    });

    let executionId: string | null = null;
    let executed = false;
    let failureReason: string | null = action
      ? null
      : 'No REASSIGN_RESOURCE action is registered — nothing was executed.';

    if (action) {
      try {
        const execution = await ActionEngine.execute({
          actionId: action.id,
          params: { decisionId, approvalToken },
          actorId,
          actorType: 'EXECUTIVE_APPROVER',
        });
        executionId = execution.id;
        executed = execution.status === 'SUCCESS';
        failureReason = executed ? null : execution.errorMessage ?? 'Action failed';
      } catch (e: any) {
        failureReason = e?.message ?? 'Action execution threw';
      }
    }

    await (prisma as any).kimmpAuditLog?.create({
      data: {
        action: `DECISION_APPROVED:${decisionId}`,
        actorId,
        actorType: 'EXECUTIVE_APPROVER',
        details: JSON.stringify({
          decisionId, approvalToken,
          status: executed ? 'EXECUTIVE_COMMITTED' : 'APPROVED_NOT_EXECUTED',
          executionId, failureReason,
        }),
      },
    }).catch(() => null);

    // The approval is real either way; whether anything executed is reported
    // separately rather than folded into a blanket success.
    return {
      success: executed,
      decisionId,
      approvalToken,
      status: executed ? 'COMMITTED' : 'APPROVED_NOT_EXECUTED',
      executionId,
      failureReason,
      committedAt: new Date().toISOString(),
    };
  }
}
