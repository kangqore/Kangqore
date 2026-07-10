import { MonteCarloEngine } from './MonteCarloEngine'
import { ScenarioRegistry } from './ScenarioRegistry'
import { SimulationScenario, SimulationResult } from '../contracts/types'

export class SimulationEngine {
  private monte = new MonteCarloEngine()

  constructor(private registry: ScenarioRegistry = ScenarioRegistry.getInstance()) {}

  async run(scenario: SimulationScenario): Promise<SimulationResult> {
    const start = Date.now()

    try {
      const outcomes = this.monte.run(scenario.variables, scenario.iterations)

      const insights: string[] = []
      const recommendations: string[] = []

      for (const o of outcomes) {
        const spread = ((o.p95 - o.p5) / Math.abs(o.mean || 1)) * 100
        if (spread > 50) {
          insights.push(`${o.metric} shows high uncertainty (${spread.toFixed(0)}% spread between P5–P95)`)
          recommendations.push(`Reduce variability in ${o.metric} to improve forecast reliability`)
        }
      }

      return {
        resultId:        `res_${Date.now()}`,
        scenarioId:      scenario.scenarioId,
        status:          'COMPLETED',
        outcomes,
        iterations:      scenario.iterations,
        confidenceLevel: 0.9,
        durationMs:      Date.now() - start,
        completedAt:     new Date(),
        insights,
        recommendations,
      }
    } catch (err: any) {
      return {
        resultId:        `res_${Date.now()}`,
        scenarioId:      scenario.scenarioId,
        status:          'FAILED',
        outcomes:        [],
        iterations:      scenario.iterations,
        confidenceLevel: 0,
        durationMs:      Date.now() - start,
        completedAt:     new Date(),
        insights:        [],
        recommendations: [err?.message ?? 'Simulation failed'],
      }
    }
  }
}
