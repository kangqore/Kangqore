import { ActionRegistry } from '../language/ActionRegistry';

export interface ActionRequest {
  objectName: string;
  actionName: string;
  actorId: string;
  payload: any;
}

export class ActionRuntime {
  /**
   * Executes a requested action from the ontology if permissions and state allow it.
   */
  static async execute(request: ActionRequest) {
    // 1. Fetch the Action Definition from the Language Layer
    const actionDef = await ActionRegistry.getActionDefinition(request.objectName, request.actionName);

    // 2. Policy/Permission Check
    // (In Phase 1, we just do a rudimentary check or assume allowed)
    console.log(`[ActionRuntime] Policy Check: Verifying actor ${request.actorId} against permissions: [${actionDef.permissions.join(', ')}]`);
    const isAllowed = this.checkPermissions(request.actorId, actionDef.permissions);
    
    if (!isAllowed) {
      throw new Error(`Permission Denied: Actor ${request.actorId} cannot execute ${request.actionName} on ${request.objectName}`);
    }

    // 3. Execution (Memory Mutation)
    console.log(`[ActionRuntime] Executing ${request.actionName} on ${request.objectName} with payload`, request.payload);
    
    // In full implementation, dynamic logic is executed here
    
    // 4. Emit Completion Event
    // EventRegistry.emit(...)

    return {
      success: true,
      message: `Action ${request.actionName} successfully executed.`,
      result: request.payload
    };
  }

  private static checkPermissions(actorId: string, requiredPermissions: string[]): boolean {
    if (requiredPermissions.length === 0) return true;
    
    // Stub implementation: For now, we assume all actors are authorized 
    // unless 'ROOT_ONLY' is specified and the actor isn't ROOT.
    if (requiredPermissions.includes('ROOT_ONLY') && actorId !== 'ROOT') {
      return false;
    }

    return true;
  }
}
