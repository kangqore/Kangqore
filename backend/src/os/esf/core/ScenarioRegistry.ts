import { SimulationTemplate } from '../contracts/types'

export class ScenarioRegistry {
  private static instance: ScenarioRegistry
  private templates = new Map<string, SimulationTemplate>()

  static getInstance(): ScenarioRegistry {
    if (!ScenarioRegistry.instance) ScenarioRegistry.instance = new ScenarioRegistry()
    return ScenarioRegistry.instance
  }

  register(template: SimulationTemplate): void {
    this.templates.set(template.templateId, template)
  }

  get(templateId: string): SimulationTemplate | undefined {
    return this.templates.get(templateId)
  }

  getAll(): SimulationTemplate[] {
    return Array.from(this.templates.values())
  }

  getByDomain(domainId: string): SimulationTemplate[] {
    return this.getAll().filter(t => t.applicableDomains.includes(domainId))
  }

  count(): number {
    return this.templates.size
  }
}
