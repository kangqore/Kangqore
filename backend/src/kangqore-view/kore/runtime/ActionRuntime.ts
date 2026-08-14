import { ActionRegistry } from '../language/ActionRegistry';
import { prisma } from '../../../lib/prisma';

export interface ActionRequest {
  objectName: string;
  actionName: string;
  actorId: string;
  payload: any;
}

export class ActionRuntime {
  static async execute(request: ActionRequest) {
    // 1. Fetch action definition from language layer (DB-backed)
    const actionDef = await ActionRegistry.getActionDefinition(request.objectName, request.actionName);

    // 2. Resolve actor's role from DB and check against action permissions
    const allowed = await this.checkPermissions(request.actorId, actionDef.permissions as string[]);
    if (!allowed) {
      throw new Error(`Permission denied: actor '${request.actorId}' cannot execute '${request.actionName}' on '${request.objectName}'`);
    }

    console.log(`[ActionRuntime] Executing ${request.actionName} on ${request.objectName} for actor ${request.actorId}`);

    return {
      success: true,
      message: `Action ${request.actionName} executed on ${request.objectName}`,
      result:  request.payload,
    };
  }

  private static async checkPermissions(actorId: string, requiredPermissions: string[]): Promise<boolean> {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    // System actors bypass permission check
    if (actorId === 'ROOT' || actorId === 'SYSTEM' || actorId === 'KEOS') return true;

    // ROOT_ONLY actions reject all non-root actors immediately
    if (requiredPermissions.includes('ROOT_ONLY')) return false;

    // Wildcard permission — anyone authenticated can execute
    if (requiredPermissions.includes('*')) return true;

    // Resolve actor role from DB
    const user = await prisma.user.findUnique({
      where:  { id: actorId },
      select: { role: true },
    });
    if (!user) return false;

    const actorRole = user.role.toUpperCase();

    // Check if the actor's role appears in the action's permission list
    return requiredPermissions.some(p => p.toUpperCase() === actorRole);
  }
}
