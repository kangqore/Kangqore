export interface ContextManifest {
  generatedBy: string[];
  sourceSystems: string[];
  builderVersions: Record<string, string>;
  assemblyTimeMs: number;
  packageVersion: string;
}

export interface ContextMetadata {
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  freshness: string;
  sourceReference: string;
}

export interface RelationshipContext {
  metadata: ContextMetadata;
  profileId: string;
  trustScore: number;
  relationshipScore: number;
  stages: string[];
}

export interface OrganizationContext {
  metadata: ContextMetadata;
  internalTier: string;
  activeContracts: number;
}

export interface PolicyContext {
  metadata: ContextMetadata;
  activePolicies: string[];
}

export interface CapabilityContext {
  metadata: ContextMetadata;
  availableCapabilities: string[];
}

export interface ExecutiveContextPackage {
  manifest: ContextManifest;
  completenessScore: number; // 0.0 to 1.0
  overallConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  relationship?: RelationshipContext;
  organization?: OrganizationContext;
  policy?: PolicyContext;
  capability?: CapabilityContext;
  awareness?: any; // Represents EnterpriseAwarenessContext from Awareness Engine
}
