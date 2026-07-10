// ARCHIVED — Gen I simulation. MissionDispatcher is the live replacement.
import { ExecutionGraphNode, ExecutionToken } from '../types';
import { CapabilityRuntime } from './CapabilityRuntime';

export class RuntimeScheduler {
  private static readyQueue: ExecutionGraphNode[] = [];
  private static executionQueue: ExecutionToken[] = [];

  static enqueueReadyNode(missionId: string, node: ExecutionGraphNode) {
    console.log(`[RuntimeScheduler] Node ${node.nodeId} entered Ready Queue`);
    this.readyQueue.push(node);
    
    // In a real OS, scheduler evaluates priorities, limits, budgets before tokenizing.
    // For this simulation, we immediately issue an Execution Token.
    const token: ExecutionToken = {
      tokenId: `TOKEN_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      missionId,
      nodeId: node.nodeId,
      capabilityId: node.capabilityId!,
      contextVersion: 1,
      policyVersion: 1,
      budget: 10.0,
      deadline: new Date(Date.now() + 60000),
      permissions: ['EXECUTE']
    };

    console.log(`[RuntimeScheduler] Issued Execution Token ${token.tokenId} for Node ${node.nodeId}`);
    this.executionQueue.push(token);
  }

  static async consumeExecutionQueue(): Promise<void> {
    while (this.executionQueue.length > 0) {
      const token = this.executionQueue.shift()!;
      console.log(`[RuntimeScheduler] Dispatching Token ${token.tokenId} to Capability Runtime...`);
      const success = await CapabilityRuntime.invoke(token);
      if (!success) {
        console.error(`[RuntimeScheduler] Token ${token.tokenId} FAILED execution.`);
      }
    }
  }
}
