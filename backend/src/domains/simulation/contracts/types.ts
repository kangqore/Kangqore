export type SimulationType =
  | 'FINANCIAL'
  | 'MARKET'
  | 'CUSTOMER'
  | 'CAPACITY'
  | 'SUPPLY_CHAIN'
  | 'PROJECT'
  | 'PRODUCT'
  | 'WORKFORCE'
  | 'CUSTOM';

export interface SimulationScenario {
  scenarioId: string;
  name: string;
  assumptions: string[];
  constraints: string[];
  modifiedObjects: string[];
  modifiedPolicies: string[];
  simulationType: SimulationType;
}

export interface SimulationOutcome {
  scenarioId: string;
  probability: number; // 0.0 - 1.0
  confidence: number;  // 0.0 - 1.0
  projectedKPIs: Record<string, number>; // e.g., { Revenue: +10, Churn: -2 }
  risks: string[];
  opportunities: string[];
  sideEffects: string[];
}

export interface EnterpriseSimulationReport {
  reportId: string;
  scenarios: {
    scenario: SimulationScenario;
    outcome: SimulationOutcome;
  }[];
  recommendedScenarioId?: string;
  rejectedScenarioIds: string[];
  confidence: number;
  generatedAt: Date;
}
