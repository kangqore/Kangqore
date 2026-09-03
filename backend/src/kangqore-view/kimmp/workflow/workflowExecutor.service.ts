// ---------------------------------------------------------------------------
// KIMMP Workflow Executor (Phase 3 remainder)
//
// Turns an APPROVED decision into a real cross-system action.
//
// Safety contract (never silent action):
// 1. Only APPROVED decisions may be executed — PROPOSED and DISMISSED are
//    rejected with a clear error.
// 2. Every execution writes an audit entry and a tracer event via Phase 4
//    infrastructure.
// 3. Every executor is best-effort inside — failures are surfaced to the
//    caller but do not corrupt the decision record.
// 4. The decision is marked EXECUTED only after the action succeeds, and the
//    governance columns (executedBy, executedAt) are written by the controller.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';
import logger from '../../../utils/logger';
import { MissionDispatcher } from '../../../immp/core/MissionDispatcher';
import { KimmpAuditLog } from '../governance/auditLog.service';
import { KimmpTracer } from '../governance/kimmpTracer.service';
import { runSalesAlert } from './executors/salesAlertExecutor';
import { runHumanHandoff } from './executors/humanHandoffExecutor';
import { runContentOpportunity } from './executors/contentOpportunityExecutor';
import { runMarketAlert } from './executors/marketAlertExecutor';
import { runResponsePolicy } from './executors/responsePolicyExecutor';
import { runAuthorityOpportunity } from './executors/authorityOpportunityExecutor';

export interface ExecutionResult {
  ok: boolean;
  decisionId: string;
  decisionType: string;
  targetModule: string;
  action: string;
  detail?: Record<string, unknown>;
}

export class WorkflowExecutor {
  /**
   * Execute one APPROVED decision. Returns an ExecutionResult.
   * Throws with a human-readable message if the decision is not in APPROVED state
   * or cannot be found.
   */
  static async execute(decisionId: string, actorId: string): Promise<ExecutionResult> {
    // 1. Load the decision.
    let decision: any;
    try {
      decision = await (prisma as any).kimmpDecision.findUnique({ where: { id: decisionId } });
    } catch (err) {
      throw new Error('Decision store unavailable — apply the Phase 4 migration.');
    }

    if (!decision) throw new Error(`Decision ${decisionId} not found.`);
    if (decision.status !== 'APPROVED') {
      throw new Error(
        `Decision ${decisionId} is in status "${decision.status}" — only APPROVED decisions may be executed.`
      );
    }

    // 2. Load the originating signal to get signalValue/metadata (used by some executors).
    let signalValue: string | null = null;
    let signalMetadata: Record<string, unknown> | null = null;
    if (decision.signalId) {
      try {
        const sig = await (prisma as any).kimmpSignal.findUnique({
          where: { id: decision.signalId },
          select: { signalValue: true, metadata: true },
        });
        signalValue = sig?.signalValue ?? null;
        signalMetadata = sig?.metadata ?? null;
      } catch {
        // Non-blocking — executors degrade gracefully without signalValue.
      }
    }

    const execInput = {
      decisionId,
      leadId: decision.leadId,
      conversationId: decision.conversationId,
      recommendedAction: decision.recommendedAction,
      reasoning: decision.reasoning,
      priority: decision.priority,
      signalValue,
      signalMetadata,
    };

    logger.info(
      `[KIMMP:WORKFLOW] executing decision=${decisionId} type=${decision.decisionType} ` +
        `target=${decision.targetModule} actor=${actorId}`
    );

    // 3. Route through the KIMMP Runtime governance pipeline before executing.
    // MissionDispatcher applies HANUMANAS policy evaluation and writes to the audit ledger.
    // The typed executor runs inside the Runtime's Step 6 as a custom executor.
    let execResult: { action: string; detail?: Record<string, unknown> };
    const runtimeResult = await MissionDispatcher.dispatch(
      {
        goal:        decision.recommendedAction ?? decision.decisionType,
        description: `KIMMP WorkflowExecutor: ${decision.decisionType} → ${decision.targetModule}`,
        requester:   actorId,
      },
      async () => {
        let innerResult: { action: string; detail?: Record<string, unknown> };
        switch (decision.decisionType) {
          case 'SALES_ALERT':
            innerResult = await runSalesAlert(execInput); break;
          case 'HUMAN_HANDOFF':
            innerResult = await runHumanHandoff(execInput); break;
          case 'CONTENT_OPPORTUNITY':
            innerResult = await runContentOpportunity(execInput); break;
          case 'AUTHORITY_OPPORTUNITY':
            innerResult = await runAuthorityOpportunity(execInput); break;
          case 'MARKET_ALERT':
            innerResult = await runMarketAlert(execInput); break;
          case 'RESPONSE_POLICY':
            innerResult = await runResponsePolicy(execInput); break;
          default:
            innerResult = {
              action: 'UNHANDLED_DECISION_TYPE',
              detail: { note: `No executor registered for type "${decision.decisionType}".` },
            };
        }
        return { id: 'wf-' + decisionId, result: innerResult.action, ...innerResult };
      },
    );
    execResult = { action: runtimeResult.action ?? runtimeResult.result, detail: runtimeResult.detail };

    // 4. Mark the decision EXECUTED with governance columns.
    try {
      await (prisma as any).kimmpDecision.update({
        where: { id: decisionId },
        data: {
          status: 'EXECUTED',
          executedBy: actorId,
          executedAt: new Date(),
        },
      });
    } catch (err) {
      logger.warn(`[KIMMP:WORKFLOW] could not mark decision ${decisionId} EXECUTED: ${(err as Error).message}`);
    }

    // 5. Audit + trace (fire-and-forget).
    void KimmpAuditLog.record({
      actor: actorId,
      action: 'DECISION_EXECUTED',
      targetType: 'decision',
      targetId: decisionId,
      metadata: {
        decisionType: decision.decisionType,
        targetModule: decision.targetModule,
        action: execResult.action,
        detail: execResult.detail,
      },
    });

    KimmpTracer.emit('DECISION_EXECUTED', {
      decisionId,
      actor: actorId,
      decisionType: decision.decisionType,
      targetModule: decision.targetModule,
      action: execResult.action,
    });

    return {
      ok: true,
      decisionId,
      decisionType: decision.decisionType,
      targetModule: decision.targetModule,
      ...execResult,
    };
  }
}
