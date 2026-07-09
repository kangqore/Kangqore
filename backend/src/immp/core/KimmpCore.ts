import { ExecutiveContext } from './ExecutiveContext';
import { MissionDispatcher } from './MissionDispatcher';
import { CognitiveMemoryManager } from './CognitiveMemoryManager';

export class KimmpCore {
  /**
   * Generates and dispatches a mission based on WAANDA's strategic intent.
   * This represents the cognitive reasoning step before KEOS takes over for operational execution.
   */
  static async executeStrategicReasoning(intent: string, requester: string = 'WAANDA') {
    // 1. Load Executive Context
    const context = await ExecutiveContext.getCurrentContext();

    // 2. Load Cognitive Memory (Lessons)
    // E.g., What have we learned about similar intents?
    const lessons = await CognitiveMemoryManager.getProvider().getLessonsByContext(intent);
    
    // 3. Formulate Mission (Simplified logic for now)
    const goal = intent;
    const reasoningSteps = [
      "Analyzed intent against executive context.",
      `Applied ${lessons.length} cognitive lessons.`
    ];

    // 4. Log Reasoning Trace to Cognitive Memory
    const trace = await CognitiveMemoryManager.logReasoning(
      goal,
      reasoningSteps,
      "Proceed with mission dispatch."
    );

    // 5. Dispatch Mission to Operating Layer (KEOS)
    const result = await MissionDispatcher.dispatch({
      goal: goal,
      description: `Dispatched from KIMMP Core. Reasoning Trace: ${trace.id}`,
      requester: requester
    });

    // Link trace to mission
    if (trace.id && result.id) {
      await CognitiveMemoryManager.getProvider().storeReasoningTrace({
        ...trace,
        missionId: result.id
      });
    }

    return result;
  }
}
