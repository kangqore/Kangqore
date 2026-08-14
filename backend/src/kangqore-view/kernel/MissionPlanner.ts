import { MissionRepository } from './MissionRepository';

export interface PlanStep {
  name: string;
  requiredCapability: string;
}

export class MissionPlanner {
  /**
   * Plans a mission by breaking the goal down into executable steps.
   * If it's a simple goal, it maps it directly to a single step.
   * In the future, this will delegate to KIMMP or WAANDA for complex reasoning.
   */
  static async plan(missionId: string, goal: string, requiredCapability?: string): Promise<PlanStep[]> {
    // For Phase 2.5, if a capability is provided, we map it directly.
    // If not, we could theoretically invoke an LLM to generate steps.
    const steps: PlanStep[] = [];
    
    if (requiredCapability) {
      steps.push({
        name: goal,
        requiredCapability
      });
    } else {
      // Fallback: Assume it's a WAANDA generative task by default if no capability is specified
      steps.push({
        name: goal,
        requiredCapability: 'GenerativeAnalysis'
      });
    }

    await MissionRepository.updateMission(missionId, {
      executionPlan: steps as any,
      currentState: 'Planning'
    });

    return steps;
  }
}
