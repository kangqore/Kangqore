import { CapabilityDefinition } from '../../mission/types';
import { Goal } from '../../ecf/contracts/types';
import { BaseExecutiveCortex } from '../../ecf/BaseExecutiveCortex';
import { EnterpriseObject, DomainRelationship } from './EnterpriseObject';

export interface DomainMetadata {
  id: string;
  name: string;
  version: string;
  purpose: string;
}

export interface TwinSchema {
  type: string;
  fields: Record<string, string>;
}

export interface DomainPolicy {
  policyId: string;
  statement: string;
}

export interface DomainKpi {
  kpiId: string;
  name: string;
  targetValue: number;
  currentValue: number;
}

export interface DomainEvent {
  eventId: string;
  topic: string;
}

export interface EnterpriseDomain {
  metadata: DomainMetadata;
  objects: EnterpriseObject[];
  relationships: DomainRelationship[];
  twins: TwinSchema[];
  goals: Goal[];
  capabilities: CapabilityDefinition[];
  policies: DomainPolicy[];
  kpis: DomainKpi[];
  events: DomainEvent[];
  executive?: BaseExecutiveCortex;
  ui?: { workspaceModules: string[] };
  automation?: { externalConnectors: string[] };
}
