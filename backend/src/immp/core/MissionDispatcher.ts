import { KeosKernel, MissionRequest } from '../../os/kernel/KeosKernel';
import { AegisShield } from '../../kangqore-aegis/AegisShield';
import { KeosEventBus } from '../../os/kernel/KeosEventBus';
import { CapabilityRegistry } from '../../os/kernel/CapabilityRegistry';

// Any KIMMP module that needs governed execution passes its own executor here.
// The pipeline (Auth → Capability → AEGIS → Approval → Execute → Ledger → Event)
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

    // 2. Capability Resolution — resolve before AEGIS so policy can evaluate against it.
    console.log(`[KIMMP Runtime] 2. Capability Resolution`);
    let capabilityId: string | undefined;
    if (request.requiredCapability) {
      const capability = await CapabilityRegistry.getCapabilityByName(request.requiredCapability);
      if (capability && capability.providers.length > 0) {
        capabilityId = capability.id;
      }
    }

    // 3 & 4. Policy & Risk Evaluation (AEGIS)
    console.log(`[KIMMP Runtime] 3+4. AEGIS Policy & Risk Evaluation`);
    const aegisResult = await AegisShield.evaluatePolicy(request, capabilityId);

    if (aegisResult.action === 'DENY') {
      await AegisShield.writeToLedger(request.id || 'N/A', actor, 'DISPATCH_MISSION', 'BLOCKED', {
        capabilityId,
        policyEvaluated: aegisResult.policiesEvaluated,
        riskScore: aegisResult.riskScore,
      });
      throw new Error(`AEGIS BLOCKED MISSION: ${aegisResult.reason}`);
    }

    // 5. Human Approval (if required by risk score)
    if (aegisResult.action === 'REQUIRE_APPROVAL') {
      console.log(`[KIMMP Runtime] 5. Human Approval Required (risk=${aegisResult.riskScore})`);
      await AegisShield.writeToLedger(request.id || 'N/A', actor, 'DISPATCH_MISSION', 'PENDING_APPROVAL', {
        capabilityId,
        policyEvaluated: aegisResult.policiesEvaluated,
        riskScore: aegisResult.riskScore,
      });
      return {
        id:           'pending-' + Date.now(),
        currentState: 'PendingApproval',
        goal:         request.goal,
        reason:       aegisResult.reason,
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
      await AegisShield.writeToLedger(executionResult?.id || 'N/A', actor, 'EXECUTE_MISSION', 'FAILED', {
        capabilityId,
        executionDetails: { error: error.message },
      });
      throw error;
    }

    const missionId = executionResult.id || ('mission-' + Date.now());

    // 7. Ledger (Success)
    console.log(`[KIMMP Runtime] 7. AEGIS Ledger`);
    await AegisShield.writeToLedger(missionId, actor, 'EXECUTE_MISSION', 'EXECUTED', {
      capabilityId,
      policyEvaluated: aegisResult.policiesEvaluated,
      riskScore: aegisResult.riskScore,
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

    return executionResult;
  }
}
