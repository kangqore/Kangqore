import { EnterpriseAgent, AgentMetadata } from '../contracts/types'

export class AgentRegistry {
  private static instance: AgentRegistry
  private agents = new Map<string, EnterpriseAgent>()

  static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) AgentRegistry.instance = new AgentRegistry()
    return AgentRegistry.instance
  }

  register(agent: EnterpriseAgent): void {
    const { agentId } = agent.getMetadata()
    this.agents.set(agentId, agent)
  }

  get(agentId: string): EnterpriseAgent | undefined {
    return this.agents.get(agentId)
  }

  getAll(): EnterpriseAgent[] {
    return Array.from(this.agents.values())
  }

  getAllMetadata(): AgentMetadata[] {
    return this.getAll().map(a => a.getMetadata())
  }

  getByDomain(domainId: string): EnterpriseAgent[] {
    return this.getAll().filter(a =>
      a.getMetadata().domainAffinity.includes(domainId)
    )
  }

  getByRole(role: AgentMetadata['role']): EnterpriseAgent[] {
    return this.getAll().filter(a => a.getMetadata().role === role)
  }

  count(): number {
    return this.agents.size
  }
}
