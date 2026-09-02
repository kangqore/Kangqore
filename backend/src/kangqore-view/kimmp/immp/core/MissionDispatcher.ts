import { KeosKernel, MissionRequest } from '../../../kernel/KeosKernel';
import { HanumanasShield } from '../../../esf/hanumanas/HanumanasShield';
import { KeosEventBus } from '../../../kernel/KeosEventBus';
import { CapabilityRegistry } from '../../../kernel/CapabilityRegistry';
import { ActionEngine } from '../../../automation/ActionEngine';

// S298 — "AI Through Actions": every mission this dispatcher runs also writes
// an ActionExecution row (actorType KIMMP) through the same engine humans and
// HANUMANAS write to, so "what did KIMMP do to Client X this week?" is one filtered
// Action log query. Best-effort and fire-and-forget — must never affect the
// mission itself if the write fails (e.g. system Actions not yet seeded).
function mapMissionToSystemAction(request: MissionRequest): string {
  const text = `${request.requiredCapability ?? ''} ${request.goal ?? ''}`.toUpperCase();
  if (text.includes('ANALYZE'))  return 'ANALYZE_CLIENT';
  if (text.includes('INSIGHT'))  return 'GENERATE_INSIGHT';
  if (text.includes('DECISION')) return 'STRATEGIC_DECISION';
  return 'RUN_AGENT';
}

async function recordMissionAsAction(request: MissionRequest, missionId: string, hanumanasResult: { riskScore: number; policiesEvaluated: any[] }, executionResult: any): Promise<void> {
  const actionName = mapMissionToSystemAction(request);
  const actionId = await ActionEngine.getSystemActionId(actionName);
  if (!actionId) return; // system Actions not seeded yet — audit-only write, safe to skip
  await ActionEngine.execute({
    actionId,
    params: { goal: request.goal, missionId, riskScore: hanumanasResult.riskScore },
    objectId: request.context?.objectId ?? null,
    actorId: request.requester,
    actorType: 'KIMMP',
    sourceModule: 'MissionDispatcher',
    reasoning: typeof executionResult?.result === 'string' ? executionResult.result : request.description,
  });
}

// Any KIMMP module that needs governed execution passes its own executor here.
// The pipeline (Auth → Capability → HANUMANAS → Approval → Execute → Ledger → Event)
// is always the same. Only the execution logic in Step 6 varies by caller.
export type MissionExecutor = (request: MissionRequest) => Promise<{ id: string; result?: any; [key: string]: any }>;

export class MissionDispatcher {
  /**
   * KIMMP Runtime Governance Pipeline — the motherboard for all mission execution.
   *
   * Every KIMMP module (WAOE, Goals, WorkflowExecutor, DecisionEngine, WAANDA) routes
   * through here. Modules supply their own `executor` for Step 6; if omitted, the
   * default KeosKernel path runs. The eight governance steps are always enforced.
   */
  static async dispatch(
    request: MissionRequest,
    executorOrMode?: MissionExecutor | 'SYNC' | 'ASYNC' | 'SIMULATION',
    mode: 'SYNC' | 'ASYNC' | 'SIMULATION' = 'SYNC',
  ) {
    // Backwards-compatible overload: original callers pass (request, mode).
    let customExecutor: MissionExecutor | undefined;
    let resolvedMode = mode;
    if (typeof executorOrMode === 'function') {
      customExecutor  = executorOrMode;
    } else if (typeof executorOrMode === 'string') {
      resolvedMode = executorOrMode;
    }

    const actor = request.requester || 'SYSTEM';

    // 1. Authentication
    console.log(`[KIMMP Runtime] 1. Auth: actor='${actor}'`);

    // 2. Capability Resolution — resolve before HANUMANAS so policy can evaluate against it.
    console.log(`[KIMMP Runtime] 2. Capability Resolution`);
    let capabilityId: string | undefined;
    if (request.requiredCapability) {
      const capability = await CapabilityRegistry.getCapabilityByName(request.requiredCapability);
      if (capability && capability.providers.length > 0) {
        capabilityId = capability.id;
      }
    }

    // 3 & 4. Policy & Risk Evaluation (HANUMANAS)
    console.log(`[KIMMP Runtime] 3+4. HANUMANAS Policy & Risk Evaluation`);
    const hanumanasResult = await HanumanasShield.evaluatePolicy(request, capabilityId);

    if (hanumanasResult.action === 'DENY') {
      await HanumanasShield.writeToLedger(request.id || 'N/A', actor, 'DISPATCH_MISSION', 'BLOCKED', {
        capabilityId,
        policyEvaluated: hanumanasResult.policiesEvaluated,
        riskScore: hanumanasResult.riskScore,
      });
      // S298 — an HANUMANAS DENY is a governance block; mirror it into the unified Action log
      ActionEngine.getSystemActionId('GOVERNANCE_BLOCK').then(actionId => {
        if (!actionId) return;
        return ActionEngine.execute({
          actionId, params: { goal: request.goal, riskScore: hanumanasResult.riskScore, reason: hanumanasResult.reason },
          actorId: actor, actorType: 'HANUMANAS', sourceModule: 'MissionDispatcher',
          reasoning: `DENY: ${hanumanasResult.reason}`,
        });
      }).catch(() => {});
      throw new Error(`HANUMANAS BLOCKED MISSION: ${hanumanasResult.reason}`);
    }

    // 5. Human Approval (if required by risk score)
    if (hanumanasResult.action === 'REQUIRE_APPROVAL') {
      console.log(`[KIMMP Runtime] 5. Human Approval Required (risk=${hanumanasResult.riskScore})`);
      await HanumanasShield.writeToLedger(request.id || 'N/A', actor, 'DISPATCH_MISSION', 'PENDING_APPROVAL', {
        capabilityId,
        policyEvaluated: hanumanasResult.policiesEvaluated,
        riskScore: hanumanasResult.riskScore,
      });
      return {
        id:           'pending-' + Date.now(),
        currentState: 'PendingApproval',
        goal:         request.goal,
        reason:       hanumanasResult.reason,
      };
    }

    // 6. Execution — use module-provided executor or fall back to KeosKernel.
    console.log(`[KIMMP Runtime] 6. Execution (${customExecutor ? 'module executor' : 'KeosKernel'})`);
    let executionResult: any;
    try {
      if (resolvedMode === 'SIMULATION') {
        executionResult = { id: 'sim-' + Date.now(), currentState: 'Simulated', goal: request.goal, result: 'Simulation successful.' };
      } else if (resolvedMode === 'ASYNC' && !customExecutor) {
        KeosKernel.executeMission(request).catch(console.error);
        executionResult = { id: 'async-' + Date.now(), currentState: 'Dispatched', goal: request.goal };
      } else if (customExecutor) {
        executionResult = await customExecutor(request);
      } else {
        executionResult = await KeosKernel.executeMission(request);
      }
    } catch (error: any) {
      await HanumanasShield.writeToLedger(executionResult?.id || 'N/A', actor, 'EXECUTE_MISSION', 'FAILED', {
        capabilityId,
        executionDetails: { error: error.message },
      });
      throw error;
    }

    const missionId = executionResult.id || ('mission-' + Date.now());

    // 7. Ledger (Success)
    console.log(`[KIMMP Runtime] 7. HANUMANAS Ledger`);
    await HanumanasShield.writeToLedger(missionId, actor, 'EXECUTE_MISSION', 'EXECUTED', {
      capabilityId,
      policyEvaluated: hanumanasResult.policiesEvaluated,
      riskScore: hanumanasResult.riskScore,
      executionDetails: { result: executionResult.result },
    });

    // 8. Event Bus
    console.log(`[KIMMP Runtime] 8. Event Bus Publish`);
    await KeosEventBus.publish('MISSION_COMPLETED', {
      missionId,
      actor,
      goal: request.goal,
      result: executionResult,
    });

    // S298 — unified Action audit trail (fire-and-forget; never blocks the mission)
    recordMissionAsAction(request, missionId, hanumanasResult, executionResult).catch(() => {});

    // Notify WAANDA that KEOS ran a mission (keeps lastActive timestamp real)
    import('../../../waanda/adapters/KeosAdapter').then(({ notifyKeosMissionRun }) => notifyKeosMissionRun()).catch(() => {})

    return executionResult;
  }
}
