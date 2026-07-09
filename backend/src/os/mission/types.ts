export type MissionState = 'CREATED' | 'PLANNED' | 'COMPILED' | 'READY' | 'RUNNING' | 'WAITING' | 'RETRYING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'ROLLED_BACK' | 'ARCHIVED';
export type NodeLifecycle = 'CREATED' | 'READY' | 'WAITING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'RETRYING' | 'SKIPPED' | 'CANCELLED' | 'ROLLED_BACK';
export type NodeType = 'ACTION' | 'DECISION' | 'APPROVAL' | 'PARALLEL' | 'LOOP' | 'WAIT' | 'EVENT' | 'SUBMISSION' | 'CALL_AGENT' | 'CALL_CAPABILITY';

export interface StrategicPlan {
  planId: string;
  intent: string;
  goals: string[];
  constraints: string[];
}

export interface MissionIR {
  irId: string;
  strategyId: string;
  operations: any[];
}

export interface ExecutionPlan {
  planId: string;
  irId: string;
  resourceAllocation: Record<string, string>;
  estimatedDurationMs: number;
}

export interface ExecutionGraphNode {
  nodeId: string;
  type: NodeType;
  status: NodeLifecycle;
  capabilityId?: string;
  dependencies: string[];
  payload: any;
}

export interface ExecutionGraph {
  graphId: string;
  version: number;
  planId: string;
  nodes: ExecutionGraphNode[];
  state: MissionState;
}

export interface CapabilityDefinition {
  id: string;
  version: number;
  owner: string;
  category: string;
  permissions: string[];
  health: 'UP' | 'DOWN' | 'DEGRADED';
  sla: string;
  estimatedCost: number;
  estimatedLatencyMs: number;
  inputSchema: any;
  outputSchema: any;
  fallbackCapability?: string;
}

export interface ExecutionToken {
  tokenId: string;
  missionId: string;
  nodeId: string;
  capabilityId: string;
  contextVersion: number;
  policyVersion: number;
  budget: number;
  deadline: Date;
  permissions: string[];
}

export interface RuntimeSession {
  sessionId: string;
  decisionId?: string;
  missionGraphId: string;
  contextVersion: number;
  twinVersions: Record<string, number>;
  capabilityVersions: Record<string, number>;
  executionBudget: number;
  costIncurred: number;
  startedAt: Date;
  endedAt?: Date;
  status: MissionState;
  executionTrace: string[];
}
