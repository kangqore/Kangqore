export interface StateTransitionRequest {
  objectType: string;
  objectId: string;
  currentState: string;
  targetState: string;
  actorId: string;
  metadata?: any;
}

// Canonical state machines per KORE object type.
// Any transition not listed here is rejected. Unknown object types are open-world (allowed).
const ALLOWED_TRANSITIONS: Record<string, Record<string, string[]>> = {
  Invoice:      { draft: ['sent'], sent: ['paid', 'overdue', 'voided'], paid: [], overdue: ['paid', 'voided'], voided: [] },
  Task:         { todo: ['in_progress'], in_progress: ['completed', 'blocked', 'todo'], blocked: ['in_progress', 'todo'], completed: [] },
  Project:      { planning: ['active'], active: ['paused', 'completed', 'cancelled'], paused: ['active', 'cancelled'], completed: [], cancelled: [] },
  Lead:         { new: ['contacted', 'qualified', 'disqualified'], contacted: ['qualified', 'disqualified'], qualified: ['converted', 'disqualified'], converted: [], disqualified: [] },
  Deliverable:  { pending: ['in_progress'], in_progress: ['review', 'blocked'], review: ['approved', 'in_progress'], approved: [], blocked: ['in_progress'] },
  Consultation: { pending: ['confirmed', 'cancelled'], confirmed: ['completed', 'cancelled', 'no_show'], completed: [], cancelled: [], no_show: [] },
  Contract:     { draft: ['review'], review: ['signed', 'rejected', 'draft'], signed: ['active'], active: ['expired', 'terminated'], expired: [], terminated: [] },
}

export class StateEngine {
  static async requestTransition(request: StateTransitionRequest): Promise<boolean> {
    const machine = ALLOWED_TRANSITIONS[request.objectType];

    if (!machine) {
      // Unknown object type — open-world assumption, allow but log
      console.log(`[StateEngine] Unknown objectType '${request.objectType}' — allowing transition ${request.currentState} → ${request.targetState}`);
      return true;
    }

    const allowedTargets = machine[request.currentState];
    if (allowedTargets === undefined) {
      throw new Error(`[StateEngine] Unknown state '${request.currentState}' for ${request.objectType}`);
    }
    if (allowedTargets.length === 0) {
      throw new Error(`[StateEngine] ${request.objectType} in state '${request.currentState}' is terminal — no transitions allowed`);
    }
    if (!allowedTargets.includes(request.targetState)) {
      throw new Error(
        `[StateEngine] Invalid transition for ${request.objectType}: '${request.currentState}' → '${request.targetState}'. ` +
        `Allowed: [${allowedTargets.join(', ')}]`
      );
    }

    console.log(`[StateEngine] Validated: ${request.objectType} ${request.objectId} ${request.currentState} → ${request.targetState}`);
    return true;
  }

  static async commitTransition(request: StateTransitionRequest) {
    await this.requestTransition(request);
    console.log(`[StateEngine] Committed: ${request.objectType} is now '${request.targetState}'`);
    return { success: true, newState: request.targetState };
  }
}
