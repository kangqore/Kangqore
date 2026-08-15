/**
 * Kangqore URGI™ - Core Relationship Intelligence Models
 */

// ============================================================================
// 1. RUNTIME MODES & HEALTH
// ============================================================================

export type UrgiRuntimeMode = 'DEVELOPMENT' | 'SHADOW' | 'ASSISTED' | 'PRODUCTION' | 'LEARNING';

export interface DigitalTwinMaturity {
  overallCompletion: number; // e.g., 0.63 for 63%
  identity: number;
  goals: number;
  trust: number;
}

export interface PlatformHealthScore {
  relationshipHealth: number;
  trustHealth: number;
  memoryHealth: number;
  evidenceHealth: number;
}

// ============================================================================
// 2. EVIDENCE & IDENTITY MODELS
// ============================================================================

export type EvidenceType = 'OBSERVATION' | 'INFERENCE' | 'HYPOTHESIS' | 'VERIFIED';

export interface EvidenceRecord {
  id: string;
  factKey: string;
  factValue: string;
  source: string;
  confidenceScore: number; // 0.0 to 1.0
  evidenceType: EvidenceType;
  timestamp: Date;
}

export interface UnifiedRelationshipProfile {
  id: string;
  visitorId?: string;
  userId?: string;
  
  // Mutable State
  currentCompany?: string;
  currentRole?: string;
  industry?: string;
  preferredChannel?: string;
  communicationStyle?: string;
  
  // Relationship & Trust
  relationshipScore: number;
  trustScore: number;
  engagementScore: number;
  
  // Linked Records
  evidenceLedger: EvidenceRecord[];
}

// ============================================================================
// 2. ORCHESTRATION MODELS
// ============================================================================

export interface RelationshipStrategyObject {
  visitorId: string;
  relationshipStage: 'UNKNOWN' | 'KNOWN' | 'VERIFIED' | 'CUSTOMER' | 'ADVOCATE';
  intent: string[];
  goals: string[];
  emotion: 'CURIOUS' | 'FRUSTRATED' | 'EXCITED' | 'CONFUSED' | 'NEUTRAL';
  trustScore: number;
  activeHypotheses: EvidenceRecord[]; // Things eROOT thinks it knows
  suggestedTone: string;
}

export interface InteractionExecutionPlan {
  visitorId: string;
  runtimeMode: UrgiRuntimeMode;
  primaryGoal: string;
  participatingSystems: ('KVIS' | 'ALIS' | 'CRM' | 'SENTINEL')[];
  adaptivePersonality: {
    tone: string;
    formality: string;
    verbosity: 'SHORT' | 'LONG';
  };
  verificationTargets: string[]; // Keys that need Invisible Verification (e.g., "company")
  memoryRules: string[];
}

export interface ConfirmedIdentityProfile {
  visitorId: string;
  verifiedFacts: {
    factKey: string;
    factValue: string;
    source: string; // usually "USER_CONFIRMED"
  }[];
}

// ============================================================================
// 3. EVENT MODELS
// ============================================================================

export enum UrgiEvent {
  VISITOR_INTERACTION_RECEIVED = 'URGI:VISITOR_INTERACTION_RECEIVED',
  RELATIONSHIP_STRATEGY_READY = 'URGI:RELATIONSHIP_STRATEGY_READY',
  INTERACTION_PLAN_READY = 'URGI:INTERACTION_PLAN_READY',
  IDENTITY_VERIFIED = 'URGI:IDENTITY_VERIFIED',
  GOVERNANCE_CHECK_PASSED = 'URGI:GOVERNANCE_CHECK_PASSED',
  RELATIONSHIP_MEMORY_UPDATED = 'URGI:RELATIONSHIP_MEMORY_UPDATED'
}
