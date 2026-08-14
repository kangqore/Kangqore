export type ExecutivePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ExecutiveUrgency = 'IMMEDIATE' | 'TODAY' | 'THIS_WEEK' | 'THIS_QUARTER';

export interface Goal {
  goalId: string;
  owner: string;
  priority: ExecutivePriority;
  kpi: string;
  successCriteria: string[];
  constraints: string[];
  progress: number;
  dependencies: string[];
  status: 'PROPOSED' | 'ACTIVE' | 'AT_RISK' | 'ACHIEVED' | 'ABANDONED';
}

export interface DecisionAlternative {
  optionId: string;
  description: string;
  status: 'SELECTED' | 'REJECTED';
  reasoning: string;
}

export interface RiskAssessment {
  riskScore: number; // 0-100
  identifiedRisks: string[];
  mitigationStrategies: string[];
}

export interface SituationReport {
  situationId: string;
  summary: string;
  keyFacts: string[];
  contextVersion: string;
}

export interface OpportunityAssessment {
  opportunityId: string;
  description: string;
  potentialValue: number;
  timeframe: ExecutiveUrgency;
}

export interface ThreatAssessment {
  threatId: string;
  description: string;
  riskAssessment: RiskAssessment;
}

export interface KnowledgeGapReport {
  gapId: string;
  missingInformation: string[];
  reason: string;
  impactOnDecision: string;
}

export interface ExecutiveDecision {
  decisionId: string;
  objective: string;
  priority: ExecutivePriority;
  urgency: ExecutiveUrgency;
  rationale: string;
  alternatives: DecisionAlternative[];
  selectedStrategy: string;
  expectedOutcome: string;
  successCriteria: string[];
  riskAssessment: RiskAssessment;
  evidenceConfidence: number; // Based on KEOS Truth
  decisionConfidence: number; // Based on Strategic Ambiguity
  policyReferences: string[];
  supportingKnowledge: string[];
  contextVersion: string;
  generatedAt: Date;
}

export interface EnterpriseProposal {
  proposalId: string;
  title: string;
  description: string;
  strategicObjective: string;
  proposedAction: string;
  contextVersion: string;
}

export interface ExecutiveOpinion {
  domainId: string;
  executiveId: string;
  stance: 'SUPPORT' | 'OPPOSE' | 'NEUTRAL' | 'ABSTAIN';
  confidence: number; // 0.0 - 1.0
  domainRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impactAssessment: string;
  supportingEvidence: string[];
  assumptions: string[];
  recommendedAlternatives: string[];
  requiredMitigations: string[];
  escalationLevel: 'NONE' | 'ATTENTION_REQUIRED' | 'BLOCKER';
}

export interface ExecutiveDeliberationReport {
  reportId: string;
  proposalId: string;
  opinions: ExecutiveOpinion[];
  consensusScore: number; // 0.0 - 1.0
  primaryConflicts: string[];
  recommendedAction: 'PROCEED' | 'REJECT' | 'REQUIRE_MODIFICATION' | 'REQUEST_EVIDENCE';
}
