import { CapabilityDefinition, ExecutionToken } from './types';

export class ExecutorResolver {
  static resolveExecutor(capability: CapabilityDefinition): string {
    console.log(`[ExecutorResolver] Resolving executor for Capability ${capability.id}...`);
    // Example: based on the category or SLA, it routes to WAANDA, a human, an API, etc.
    if (capability.category === 'HUMAN_APPROVAL') {
      return 'EXECUTOR_HUMAN_PORTAL';
    } else if (capability.category === 'COGNITIVE') {
      return 'EXECUTOR_WAANDA';
    } else {
      return 'EXECUTOR_AGENT_INFRASTRUCTURE';
    }
  }

  static async execute(executorId: string, token: ExecutionToken): Promise<boolean> {
    console.log(`[ExecutionRuntime] Executor ${executorId} processing Token ${token.tokenId}`);
    return true; // Mock success
  }
}

export class CapabilityRuntime {
  private static registry: Map<string, CapabilityDefinition> = new Map();

  static register(cap: CapabilityDefinition) {
    this.registry.set(cap.id, cap);
  }

  static get(id: string) {
    return this.registry.get(id);
  }

  static async invoke(token: ExecutionToken): Promise<boolean> {
    console.log(`[CapabilityRuntime] Intercepting System Call for ${token.capabilityId}`);
    
    let capability = this.registry.get(token.capabilityId);
    if (!capability) {
      console.error(`[CapabilityRuntime] Capability ${token.capabilityId} not found`);
      return false;
    }

    if (capability.health === 'DOWN') {
      console.warn(`[CapabilityRuntime] Capability ${capability.id} is DOWN!`);
      if (capability.fallbackCapability) {
        console.log(`[CapabilityRuntime] Routing to fallback capability: ${capability.fallbackCapability}`);
        capability = this.registry.get(capability.fallbackCapability);
        if (!capability) return false;
      } else {
        return false;
      }
    }

    // Pass to executor resolver
    const executorId = ExecutorResolver.resolveExecutor(capability);
    const result = await ExecutorResolver.execute(executorId, token);
    
    return result;
  }
}
