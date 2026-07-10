import { EnterpriseDomain, DomainMetadata, DomainKpi, DomainPolicy } from '../contracts/EnterpriseDomain'
import { EnterpriseObject } from '../contracts/EnterpriseObject'
import { CapabilityDefinition } from '../../mission/types'
import { Goal } from '../../ecf/contracts/types'

export class DomainBuilder {
  private domain: Partial<EnterpriseDomain> = {
    objects:       [],
    relationships: [],
    twins:         [],
    goals:         [],
    capabilities:  [],
    policies:      [],
    kpis:          [],
    events:        [],
  }

  metadata(m: DomainMetadata): this  { this.domain.metadata = m;                 return this }
  object(o: EnterpriseObject): this  { this.domain.objects!.push(o);             return this }
  goal(g: Goal): this                { this.domain.goals!.push(g);               return this }
  capability(c: CapabilityDefinition): this { this.domain.capabilities!.push(c); return this }
  policy(p: DomainPolicy): this      { this.domain.policies!.push(p);            return this }
  kpi(k: DomainKpi): this            { this.domain.kpis!.push(k);               return this }
  workspaceModules(modules: string[]): this {
    this.domain.ui = { workspaceModules: modules }
    return this
  }

  build(): EnterpriseDomain {
    if (!this.domain.metadata) throw new Error('DomainBuilder: metadata is required')
    return this.domain as EnterpriseDomain
  }
}
