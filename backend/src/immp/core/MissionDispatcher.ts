import { KeosKernel, MissionRequest } from '../../os/kernel/KeosKernel';
import { AegisShield } from '../../kangqore-aegis/AegisShield';
import { KeosEventBus } from '../../os/kernel/KeosEventBus';
import { CapabilityRegistry } from '../../os/kernel/CapabilityRegistry';

export class MissionDispatcher {
  /**
   * The Strict Mission Execution Pipeline governed by AEGIS.
   */
  static async dispatch(request: MissionRequest, mode: 'SYNC' | 'ASYNC' | 'SIMULATION' = 'SYNC') {
    const actor = request.requester || 'SYSTEM';
    
    // 1. Authentication
    // (Mock auth step for now, but in a real flow we verify the actor's session/token)
    console.log(`[Pipeline] 1. Auth: Authenticating actor '${actor}'`);

    // 2. Capability Resolution
    // Resolve the capability *before* execution so AEGIS can evaluate policy against it.
    console.log(`[Pipeline] 2. Capability Resolution`);
    let capabilityId = undefined;
    if (request.requiredCapability) {
      const capability = await CapabilityRegistry.getCapabilityByName(request.requiredCapability);
      if (capability && capability.providers.length > 0) {
        capabilityId = capability.id;
      }
    }

    // 3 & 4. Policy & Risk Evaluation (AEGIS)
    console.log(`[Pipeline] 3 & 4. AEGIS Policy & Risk Evaluation`);
    const aegisResult = await AegisShield.evaluatePolicy(request, capabilityId);

    if (aegisResult.action === 'DENY') {
      // 8. Ledger (Blocked)
      await AegisShield.writeToLedger(request.id || 'N/A', actor, 'DISPATCH_MISSION', 'BLOCKED', {
        capabilityId,
        policyEvaluated: aegisResult.policiesEvaluated,
        riskScore: aegisResult.riskScore
      });
      throw new Error(`AEGIS BLOCKED MISSION: ${aegisResult.reason}`);
    }

    // 5. Human Approval (if required)
    if (aegisResult.action === 'REQUIRE_APPROVAL') {
      console.log(`[Pipeline] 5. Human Approval Required (Risk: ${aegisResult.riskScore})`);
      // 8. Ledger (Pending)
      await AegisShield.writeToLedger(request.id || 'N/A', actor, 'DISPATCH_MISSION', 'PENDING_APPROVAL', {
        capabilityId,
        policyEvaluated: aegisResult.policiesEvaluated,
        riskScore: aegisResult.riskScore
      });
      return {
        id: 'pending-' + Date.now(),
        currentState: 'PendingApproval',
        goal: request.goal,
        reason: aegisResult.reason
      };
    }

    // 6. Execution (KEOS Kernel)
    console.log(`[Pipeline] 6. Execution (KEOS Kernel)`);
    let executionResult;
    try {
      if (mode === 'SIMULATION') {
        executionResult = { id: 'sim-' + Date.now(), currentState: 'Simulated', goal: request.goal, result: 'Simulation successful.' };
      } else if (mode === 'ASYNC') {
        KeosKernel.executeMission(request).catch(console.error);
        executionResult = { id: 'async-' + Date.now(), currentState: 'Dispatched', goal: request.goal };
      } else {
        executionResult = await KeosKernel.executeMission(request);
      }
    } catch (error: any) {
      // Log failure to ledger
      await AegisShield.writeToLedger(executionResult?.id || 'N/A', actor, 'EXECUTE_MISSION', 'FAILED', {
        capabilityId,
        executionDetails: { error: error.message }
      });
      throw error;
    }

    const missionId = executionResult.id;

    // 7. Ledger (Success)
    console.log(`[Pipeline] 7. AEGIS Ledger`);
    await AegisShield.writeToLedger(missionId, actor, 'EXECUTE_MISSION', 'EXECUTED', {
      capabilityId,
      policyEvaluated: aegisResult.policiesEvaluated,
      riskScore: aegisResult.riskScore,
      executionDetails: { result: executionResult.result }
    });

    // 8. Event (Publish to Event Bus)
    console.log(`[Pipeline] 8. Event Bus Publish`);
    await KeosEventBus.publish('MISSION_COMPLETED', {
      missionId,
      actor,
      goal: request.goal,
      result: executionResult
    });

    return executionResult;
  }
}
