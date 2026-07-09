import { SimulationBranch } from '../../edtp/contracts/types';

export interface ObjectiveRegistryItem {
  id: string;
  name: string;
  type: 'MAXIMIZE' | 'MINIMIZE' | 'TARGET';
  targetValue?: number;
}

export const ObjectiveRegistry: Record<string, ObjectiveRegistryItem> = {
  REVENUE_GROWTH: { id: 'OBJ_REV', name: 'Revenue Growth', type: 'MAXIMIZE' },
  CUSTOMER_TRUST: { id: 'OBJ_TRUST', name: 'Customer Trust', type: 'MAXIMIZE' },
  NET_REVENUE_RETENTION: { id: 'OBJ_NRR', name: 'Net Revenue Retention', type: 'MAXIMIZE' },
  CASH_FLOW: { id: 'OBJ_CASH', name: 'Cash Flow', type: 'MAXIMIZE' },
  MARKET_SHARE: { id: 'OBJ_MARKET', name: 'Market Share', type: 'MAXIMIZE' },
  EMPLOYEE_SATISFACTION: { id: 'OBJ_ESAT', name: 'Employee Satisfaction', type: 'MAXIMIZE' },
  INNOVATION_INDEX: { id: 'OBJ_INNOV', name: 'Innovation Index', type: 'MAXIMIZE' },
  RISK_EXPOSURE: { id: 'OBJ_RISK', name: 'Risk Exposure', type: 'MINIMIZE' }
};

export interface OptimizationProblem {
  problemId: string;
  objectives: { objectiveId: string; weight: number }[];
  constraints: OptimizationConstraint[];
  variables: DecisionVariable[];
  environment: string; // E.g., 'MARKET_SLOWDOWN'
}

export interface OptimizationConstraint {
  metric: string; // e.g., 'cashReserves'
  operator: '>' | '<' | '>=' | '<=' | '==';
  value: number;
}

export interface DecisionVariable {
  id: string;
  name: string;
  type: 'CONTINUOUS' | 'DISCRETE' | 'BOOLEAN';
  min?: number;
  max?: number;
  step?: number;
  allowedValues?: any[];
}

export interface CandidateStrategy {
  strategyId: string;
  variables: Record<string, any>;
  expectedEffects?: string[];
  generatedBy: string;
  searchIteration: number;
}

export interface OptimizationExecution {
  algorithm: 'GRID_SEARCH' | 'RANDOM_SEARCH' | 'GENETIC_ALGORITHM';
  iterations: number;
  parallelism: number;
}

export interface OptimizationPolicyLayer {
  maxRuntimeMs: number;
  maxBudget: number;
  minConfidence: number;
  maxSearchSpace: number;
  mandatoryConstraints: OptimizationConstraint[];
  explainabilityRequired: boolean;
}

export interface ScoredBranch {
  strategy: CandidateStrategy;
  branch: SimulationBranch;
  objectiveScores: Record<string, number>; // Normalized score per objective
  aggregateScore: number;
  constraintsPassed: boolean;
  confidence: number;
}

export interface Recommendation {
  strategy: CandidateStrategy;
  score: number;
  confidence: number;
  expectedBusinessImpact: Record<string, number | string>;
  tradeoffs: string[];
  reasoning: string;
}
