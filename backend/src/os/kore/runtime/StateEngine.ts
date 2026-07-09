export interface StateTransitionRequest {
  objectType: string;
  objectId: string;
  currentState: string;
  targetState: string;
  actorId: string;
  metadata?: any;
}

export class StateEngine {
  /**
   * Validates if a state transition is legal according to the object's ontology definition.
   * In Phase 1, this acts as a stub logic controller.
   */
  static async requestTransition(request: StateTransitionRequest): Promise<boolean> {
    console.log(`[StateEngine] Evaluating transition for ${request.objectType} ${request.objectId} from ${request.currentState} to ${request.targetState}`);
    
    // Stub implementation: Assume valid unless target is "ForbiddenState"
    if (request.targetState === "ForbiddenState") {
      throw new Error(`State transition from ${request.currentState} to ${request.targetState} is invalid for ${request.objectType}.`);
    }

    return true;
  }

  /**
   * Commits the state change and emits a lifecycle event to the EventRegistry
   */
  static async commitTransition(request: StateTransitionRequest) {
    const isValid = await this.requestTransition(request);
    
    if (isValid) {
      console.log(`[StateEngine] Committed transition: ${request.objectType} is now ${request.targetState}`);
      // In a full implementation, we'd persist to the database and emit an event.
      // e.g. EventRegistry.emit('STATE_CHANGED', request)
      return { success: true, newState: request.targetState };
    }
    
    return { success: false, reason: "Invalid Transition" };
  }
}
