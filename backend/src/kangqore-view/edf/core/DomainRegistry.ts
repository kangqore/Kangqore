import { EnterpriseDomain } from '../contracts/EnterpriseDomain';

export class DomainRegistry {
  private static domains: Map<string, EnterpriseDomain> = new Map();

  static register(domain: EnterpriseDomain): void {
    if (this.domains.has(domain.metadata.id)) {
      throw new Error(`[EDF] Domain ${domain.metadata.id} is already registered.`);
    }
    this.domains.set(domain.metadata.id, domain);
    console.log(`[EDF Registry] Domain Registered: ${domain.metadata.name} (v${domain.metadata.version})`);
  }

  static get(domainId: string): EnterpriseDomain | undefined {
    return this.domains.get(domainId);
  }

  static getAll(): EnterpriseDomain[] {
    return Array.from(this.domains.values());
  }

  static isDomainReady(domainId: string): boolean {
    const domain = this.get(domainId);
    if (!domain) return false;
    
    // L7 Maturity Check
    const hasTwins = domain.twins.length > 0;
    const hasCapabilities = domain.capabilities.length > 0;
    const hasGoals = domain.goals.length > 0;
    
    return hasTwins && hasCapabilities && hasGoals;
  }
}
