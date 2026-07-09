export type PredictionHorizon = 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
export type PredictionTarget = 'CUSTOMER_CHURN' | 'REVENUE' | 'CASH_FLOW' | 'INVENTORY' | 'CAPACITY' | 'FRAUD' | 'RISK';
export type PredictionLifecycleState = 'REQUESTED' | 'FEATURE_COLLECTION' | 'MODEL_SELECTION' | 'INFERENCE' | 'POLICY_VALIDATION' | 'PUBLISHED' | 'EVALUATED' | 'ARCHIVED' | 'REJECTED';

export interface EnterpriseFeature {
  featureId: string;
  version: string;
  name: string;
  source: 'ANALYTICS' | 'ENTERPRISE_MEMORY' | 'TWIN_RUNTIME' | 'DECISION_LEDGER' | 'EXTERNAL';
  datatype: 'NUMBER' | 'BOOLEAN' | 'CATEGORY' | 'TEXT';
  value: any;
  lineage: string[]; // List of IDs (e.g. Metric IDs, Kpi IDs)
  freshness: Date;
  qualityScore: number; // 0.0 - 1.0
  generatedAt: Date;
}

export interface PredictionExplanation {
  topDrivers: Array<{
    featureId: string;
    featureName: string;
    impactWeight: number; // -1.0 to 1.0
  }>;
  description: string;
}

export interface UncertaintyMetrics {
  variance: number;
  confidenceInterval: {
    lowerBound: number;
    upperBound: number;
  };
  sensitivity: number; // 0.0 to 1.0, how volatile is the prediction?
}

export interface PredictionOutcome {
  forecastedValue: number | string | boolean;
  unit?: string;
  isAnomaly?: boolean;
}

export interface EnterprisePrediction {
  predictionId: string;
  target: PredictionTarget;
  horizon: PredictionHorizon;
  outcome: PredictionOutcome;
  confidence: number; // 0.0 - 1.0
  uncertainty: UncertaintyMetrics;
  explanation: PredictionExplanation;
  state: PredictionLifecycleState;
  generatedByModelId: string;
  generatedByModelVersion: string;
  featuresUsed: EnterpriseFeature[];
  policyValidations: string[]; // List of policies it passed or failed
  generatedAt: Date;
}

export interface PredictionRequest {
  requestId: string;
  target: PredictionTarget;
  horizon: PredictionHorizon;
  context: Record<string, any>;
  requestedAt: Date;
}

export interface PredictionModelMetadata {
  id: string;
  version: string;
  target: PredictionTarget;
  owner: string;
  supportedHorizons: PredictionHorizon[];
  expectedLatencyMs: number;
  accuracy: number; // 0.0 - 1.0 historical accuracy
  lastEvaluation: Date;
  status: 'ACTIVE' | 'DEPRECATED' | 'TRAINING';
  requiredFeatures: string[]; // List of required feature names or types
}

export interface PredictionPolicy {
  policyId: string;
  name: string;
  description: string;
  evaluate: (prediction: EnterprisePrediction) => { passed: boolean; reason?: string };
}

export interface PredictionLedgerEntry {
  entryId: string;
  predictionId: string;
  request: PredictionRequest;
  featuresUsed: EnterpriseFeature[];
  modelVersion: string;
  prediction: EnterprisePrediction;
  actualOutcome?: any;
  errorMargin?: number;
  driftDetected?: boolean;
  loggedAt: Date;
}

export interface IPredictionModelPlugin {
  getMetadata(): PredictionModelMetadata;
  infer(request: PredictionRequest, features: EnterpriseFeature[]): Promise<EnterprisePrediction>;
}
