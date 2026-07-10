import { DomainRegistry } from '../core/DomainRegistry'
import { EnterpriseDomain, DomainKpi } from '../contracts/EnterpriseDomain'

// Simplified consumer API — wraps DomainRegistry with convenience methods.
export const DomainSDK = {
  getDomain(id: string): EnterpriseDomain | undefined {
    return DomainRegistry.getAll().find(d => d.metadata.id === id)
  },

  listDomains(): EnterpriseDomain[] {
    return DomainRegistry.getAll()
  },

  getReadyDomains(): EnterpriseDomain[] {
    return DomainRegistry.getAll().filter(d =>
      d.capabilities.length > 0 && d.goals.length > 0
    )
  },

  getBreachedKpis(domainId?: string): Array<{ domainId: string; kpi: DomainKpi }> {
    const domains = domainId
      ? DomainRegistry.getAll().filter(d => d.metadata.id === domainId)
      : DomainRegistry.getAll()

    return domains.flatMap(d =>
      d.kpis
        .filter(k => k.currentValue > k.targetValue)
        .map(k => ({ domainId: d.metadata.id, kpi: k }))
    )
  },

  getDomainCapabilityCount(domainId: string): number {
    return DomainSDK.getDomain(domainId)?.capabilities.length ?? 0
  },
}
