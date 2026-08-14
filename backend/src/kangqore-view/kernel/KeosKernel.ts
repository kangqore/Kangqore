import { MissionRepository } from './MissionRepository';
import { ContextManager } from './ContextManager';
import { MissionPlanner } from './MissionPlanner';
import { CapabilityResolver } from './CapabilityResolver';
import { EnterpriseMemoryManager } from './EnterpriseMemoryManager';

export interface MissionRequest {
  id?: string;
  goal: string;
  requester: string;
  description?: string;
  context?: any;
  requiredCapability?: string;
}

export class KeosKernel {
  /**
   * The unified entry point for all operations in KEOS.
   * Every request (human, AI, API) becomes a Mission.
   */
  static async executeMission(request: MissionRequest) {
    // 1. Create Mission
    const mission = await MissionRepository.createMission({
      goal: request.goal,
      description: request.description,
      requester: request.requester,
      currentState: 'Created',
    });

    try {
      // 2. Build Context
      const context = await ContextManager.buildMissionContext(request.requester, request.context);
      await MissionRepository.updateMission(mission.id, { missionContext: context as any });

      // 3. Plan Mission
      const plan = await MissionPlanner.plan(mission.id, request.goal, request.requiredCapability);

      // 4. Resolve & Execute
      await MissionRepository.updateMission(mission.id, { currentState: 'Executing' });
      
      const results = [];

      for (const step of plan) {
        // Resolve capability
        const provider = await CapabilityResolver.resolveBestProvider(step.requiredCapability);

        // Execute via Provider
        const startTime = Date.now();
        let stepResult: any;
        let stepError: any;

        try {
          stepResult = await this.executeProvider(provider.providerName, step.name, context);
        } catch (e: any) {
          stepError = e;
        }

        const durationMs = Date.now() - startTime;

        // 5. Update Enterprise Memory
        await EnterpriseMemoryManager.commitMemory({
          missionId: mission.id,
          actor: provider.providerName,
          capability: step.requiredCapability,
          context: context as any,
          evidence: { goal: step.name },
          reasoning: 'Provider selected via CapabilityResolver priority routing.',
          outcome: stepError ? `Error: ${stepError.message}` : 'Success',
          actionsExecuted: stepResult ? [stepResult] : [],
          durationMs,
          confidence: 1.0,
        });

        if (stepError) {
          throw stepError;
        }

        results.push(stepResult);
      }

      // 6. Complete Mission
      const finalMission = await MissionRepository.updateMission(mission.id, {
        currentState: 'Completed',
        result: results as any,
        completedAt: new Date(),
      });

      return finalMission;
    } catch (error: any) {
      // Handle Failure
      await MissionRepository.updateMission(mission.id, {
        currentState: 'Failed',
        result: { error: error.message } as any,
        completedAt: new Date(),
      });
      throw error;
    }
  }

  private static async executeProvider(providerName: string, actionGoal: string, context: any) {
    switch (providerName) {
      case 'KoreRuntime': {
        const { ActionRuntime } = await import('../kore/runtime/ActionRuntime');
        return await ActionRuntime.execute({
          objectName: context?.domainId ?? 'Enterprise',
          actionName: actionGoal,
          actorId:    context?.requester ?? 'KEOS',
          payload:    context ?? {},
        });
      }

      case 'WAANDA': {
        const { MissionDispatcher } = await import('../../immp/core/MissionDispatcher');
        const result = await MissionDispatcher.dispatch({
          goal:               actionGoal,
          requester:          context?.requester ?? 'KEOS',
          description:        `KEOS delegated: ${actionGoal}`,
          context:            context,
          requiredCapability: actionGoal,
        }, 'SYNC');
        return { executed: true, provider: 'WAANDA', missionId: result.id, result };
      }

      default:
        // Generic provider — log and return structured result
        console.log(`[KeosKernel] Unknown provider '${providerName}' for goal '${actionGoal}'`);
        return { executed: true, provider: providerName, actionGoal };
    }
  }
}
