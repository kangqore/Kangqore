// Enterprise Experience API Contracts
// Constitution 3 (v2.0) - Generation III Frontend Architecture

import { WorkspaceCommand } from './manifest';

export interface ActionDefinition {
    id: string;
    title: string;
    type: 'MUTATION' | 'SIMULATION' | 'OPTIMIZATION' | 'EXECUTION';
    targetPlatformCapability: string; // Ref to KEOS Capability
}

export interface WorkspaceMetric {
    id: string;
    label: string;
    value: number | string;
    trend: 'UP' | 'DOWN' | 'FLAT';
    delta: number | string;
}

export interface Prediction {
    id: string;
    model: string; // Ref to EPF Model
    target: string;
    confidence: number;
    value: any;
    rationale: string;
}

export interface Simulation {
    id: string;
    branchId: string; // Ref to ESF Branch
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    results: any;
}

export interface Optimization {
    id: string;
    runId: string; // Ref to EOF Run
    objective: string;
    recommendations: any[];
}

export interface PermissionSet {
    canView: boolean;
    canEdit: boolean;
    canSimulate: boolean;
    canExecute: boolean;
    policies: string[]; // Ref to AEGIS Policies
}

export interface ActivityEvent {
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    details: string;
}

export interface EnterpriseObjectViewModel {
    object: Record<string, any>;
    summary: string;
    metrics: WorkspaceMetric[];
    predictions: Prediction[];
    simulations: Simulation[];
    optimizations: Optimization[];
    permissions: PermissionSet;
    actions: ActionDefinition[];
    timeline: ActivityEvent[];
}

/**
 * The Enterprise Experience API (EEA) acts as the facade over the backend
 * Enterprise Platform (EDF, EAF, EPF, ESF, EOF, ECF).
 */
export interface ExperienceAPI {
    getObject(id: string, lens: string): Promise<EnterpriseObjectViewModel>;
    getMission(id: string): Promise<any>; // Will expand with MissionViewModel
    executeCommand(command: WorkspaceCommand, context: any): Promise<any>;
    simulate(intent: any): Promise<Simulation>;
    optimize(intent: any): Promise<Optimization>;
}
