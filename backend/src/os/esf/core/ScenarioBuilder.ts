import { SimulationScenario, SimulationVariable, SimulationType, SimulationHorizon } from '../contracts/types'

export class ScenarioBuilder {
  private scenario: Partial<SimulationScenario> = {
    variables:  [],
    iterations: 1000,
    domainScope: [],
    createdAt:  new Date(),
  }

  id(id: string): this          { this.scenario.scenarioId = id;    return this }
  name(n: string): this         { this.scenario.name = n;           return this }
  description(d: string): this  { this.scenario.description = d;    return this }
  type(t: SimulationType): this { this.scenario.type = t;           return this }
  horizon(h: SimulationHorizon): this { this.scenario.horizon = h; return this }
  iterations(n: number): this   { this.scenario.iterations = n;     return this }
  domains(ids: string[]): this  { this.scenario.domainScope = ids;  return this }

  variable(v: SimulationVariable): this {
    this.scenario.variables!.push(v)
    return this
  }

  build(): SimulationScenario {
    const required: Array<keyof SimulationScenario> = ['scenarioId', 'name', 'type', 'horizon']
    for (const field of required) {
      if (!this.scenario[field]) throw new Error(`ScenarioBuilder: missing required field '${field}'`)
    }
    return this.scenario as SimulationScenario
  }
}
