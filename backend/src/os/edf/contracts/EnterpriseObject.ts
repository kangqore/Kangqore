export type PrimitiveObject = 
  | 'Person' | 'Organization' | 'Asset' | 'Product' | 'Service'
  | 'Document' | 'Agreement' | 'FinancialAccount' | 'Location'
  | 'Mission' | 'Capability' | 'Goal' | 'Policy' | 'Event'
  | 'Decision' | 'Knowledge' | 'Risk' | 'Relationship';

export interface EnterpriseObject {
  objectId: string;
  name: string;
  inheritsFrom: PrimitiveObject;
  description: string;
}

export interface DomainRelationship {
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: string;
}
