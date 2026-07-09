export type TwinType = 
  | 'PERSON' 
  | 'ORGANIZATION' 
  | 'PROJECT' 
  | 'PRODUCT' 
  | 'SERVICE' 
  | 'COMPETITOR' 
  | 'MARKET' 
  | 'MISSION' 
  | 'CAPABILITY' 
  | 'POLICY' 
  | 'ASSET' 
  | 'SUPPLIER' 
  | 'AGENT' 
  | 'WORKSPACE' 
  | 'RELATIONSHIP';

export type TwinLifecycle = 'CREATED' | 'ACTIVE' | 'MERGED' | 'ARCHIVED' | 'DELETED';

export interface TwinIdentity {
  twinId: string;
  type: TwinType;
  createdAt: Date;
  namespace: string;
}

export interface EnterpriseDigitalTwin {
  identity: TwinIdentity;
  version: number;
  lifecycle: TwinLifecycle;
  state: Record<string, unknown>;
  capabilities: string[]; // Bound executable behaviors
}

export interface TwinMutationProposal {
  twinId: string;
  twinVersion: number;
  proposedBy: string; // e.g., 'URGI', 'EnterpriseAwareness'
  reason: string;
  changes: Record<string, unknown>;
  supportingKnowledge: string[];
  confidence: number;
  timestamp: Date;
}

export interface TwinTransaction {
  transactionId: string;
  proposals: TwinMutationProposal[];
  status: 'PENDING' | 'COMMITTED' | 'ROLLED_BACK';
}

export interface KoreQuery {
  type?: TwinType;
  where?: Record<string, any>;
  return?: string[];
}
