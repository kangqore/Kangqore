export interface AwarenessCapability {
  id: string; // e.g., 'market.intelligence'
  category: string; // 'market', 'regulation', 'visibility', 'economics', 'threats', 'opportunities'
  version: string;
}

export interface ProviderHealth {
  healthy: boolean;
  lastSync: Date;
  averageLatencyMs: number;
  version: string;
}

export interface IntelligenceProvider {
  name: string;
  priority: number; // Higher is preferred
  capabilities: AwarenessCapability[];
  health: ProviderHealth;
  gatherIntelligence(capabilityId: string): Promise<any>;
}

export interface AwarenessFragment {
  capabilityId: string;
  provider: string;
  timestamp: Date;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'VERIFIED';
  freshness: string;
  provenance: string;
  payload: any;
}

export interface AwarenessMetadata {
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'VERIFIED';
  freshness: string;
  validUntil: Date;
  sourceProvider: string;
  version: string;
}

export interface EnterpriseAwarenessContext {
  // Raw Domains
  visibility?: { metadata: AwarenessMetadata; data: any };
  market?: { metadata: AwarenessMetadata; data: any };
  regulation?: { metadata: AwarenessMetadata; data: any };
  economics?: { metadata: AwarenessMetadata; data: any };
  environment?: { metadata: AwarenessMetadata; data: any };
  supplyChain?: { metadata: AwarenessMetadata; data: any };
  
  // Synthesized Intelligence
  threats?: { metadata: AwarenessMetadata; data: any };
  opportunities?: { metadata: AwarenessMetadata; data: any };
  emergingSignals?: { metadata: AwarenessMetadata; data: any };
}
