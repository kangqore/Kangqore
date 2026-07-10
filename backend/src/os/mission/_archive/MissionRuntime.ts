// ARCHIVED — Gen I simulation. MissionDispatcher is the live replacement.
// All execution here is mocked (nodes always SUCCEED). Do not import from live code.
import { ExecutionGraph, RuntimeSession } from '../types';
import { RuntimeScheduler } from './RuntimeScheduler';

class RuntimeSessionManager {
  static createSession(graph: ExecutionGraph): RuntimeSession {
    return {
      sessionId: `SESS_${Date.now()}`,
      missionGraphId: graph.graphId,
      contextVersion: 1,
      twinVersions: {},
      capabilityVersions: {},
      executionBudget: 100.0,
      costIncurred: 0.0,
      startedAt: new Date(),
      status: 'RUNNING',
      executionTrace: []
    };
  }

  static completeSession(session: RuntimeSession) {
    session.endedAt = new Date();
    session.status = 'COMPLETED';
    console.log(`[RuntimeSessionManager] Session ${session.sessionId} recorded as COMPLETED.`);
  }
}

export class MissionRuntime {
  static async execute(graph: ExecutionGraph): Promise<RuntimeSession> {
    console.log(`\n=== Mission Runtime (Intent Orchestrator) ===`);
    console.log(`[MissionRuntime] Taking ownership of Execution Graph ${graph.graphId}`);
    
    const session = RuntimeSessionManager.createSession(graph);

    for (const node of graph.nodes) {
      // Simulate state machine transitions
      node.status = 'READY';
      session.executionTrace.push(`Node ${node.nodeId} transitioned to READY`);
      
      // Pass to Scheduler via Ready Queue
      RuntimeScheduler.enqueueReadyNode(graph.graphId, node);
      
      node.status = 'WAITING';
      session.executionTrace.push(`Node ${node.nodeId} transitioned to WAITING`);
    }

    // Now let the Scheduler consume its queues
    await RuntimeScheduler.consumeExecutionQueue();

    // Mark nodes as completed (mock)
    for (const node of graph.nodes) {
      node.status = 'SUCCEEDED';
      session.executionTrace.push(`Node ${node.nodeId} transitioned to SUCCEEDED`);
    }

    RuntimeSessionManager.completeSession(session);
    return session;
  }
}
