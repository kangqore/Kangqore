import { EnterpriseProposal } from '../../ecf/contracts/types';
import { EnterprisePrediction } from '../../epf/contracts/types';

export interface EnterpriseTwinSnapshot {
  snapshotId: string;
  runtimeVersion: string;
  analyticsVersion: string;
  memoryVersion: string;
  policyVersion: string;
  capturedAt: Date;
  twinStates: Record<string, any>; // Keyed by Twin Network ID, storing their baseline state
}

export interface SimulationBranch {
  branchId: string;
  parentSnapshotId: string;
  proposal?: EnterpriseProposal;
  hypothesis?: string;
  assumptions: string[];
  constraints: string[];
  currentSimulatedDate: Date;
  twinNetworks: Map<string, ITwinNetwork>; // Deep clone of the Twin Networks for this branch
  executionStatus: 'INITIALIZED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
  simulationMetrics: Record<string, any>;
}

export interface ITwinNetwork {
  networkId: string;
  name: string;
  
  // Hydrates the network from the snapshot
  hydrate(snapshot: EnterpriseTwinSnapshot): void;
  
  // Clones the network for a new branch
  clone(): ITwinNetwork;
  
  // Applies a verified mutation to the twin's state
  applyMutation(mutation: TwinMutation): void;
  
  // Gets current aggregate state
  getState(): Record<string, any>;
}

export interface TwinMutation {
  mutationId: string;
  targetNetworkId: string;
  appliedAtSimulatedDate: Date;
  changes: Record<string, any>;
  sourcePredictionId?: string; // If this mutation was driven by EPF
  reason: string;
}

export interface TwinEvolutionPolicy {
  policyId: string;
  name: string;
  evaluate: (network: ITwinNetwork, pendingMutation: TwinMutation) => { passed: boolean; reason?: string };
}

export interface SimulationLedgerEntry {
  entryId: string;
  simulationId: string; // Typically the branchId
  parentSnapshotId: string;
  branch: string;
  proposalId?: string;
  timeHorizonDays: number;
  predictionsUsed: string[]; // List of prediction IDs
  evolutionRulesApplied: string[];
  policiesValidated: string[];
  events: any[];
  metrics: Record<string, any>;
  outcome: string;
  durationMs: number;
  confidence: number;
  status: 'SUCCESS' | 'FAILURE' | 'ERROR';
  loggedAt: Date;
}
