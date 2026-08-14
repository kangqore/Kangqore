import { SimulationVariable, SimulationOutcome } from '../contracts/types'

export class MonteCarloEngine {
  run(variables: SimulationVariable[], iterations: number): SimulationOutcome[] {
    const samples: Record<string, number[]> = {}

    for (const v of variables) {
      samples[v.variableId] = []
      for (let i = 0; i < iterations; i++) {
        samples[v.variableId].push(this._sample(v))
      }
    }

    return variables.map(v => {
      const vals = samples[v.variableId].sort((a, b) => a - b)
      return {
        outcomeId: `out_${v.variableId}`,
        metric: v.name,
        mean:   this._mean(vals),
        median: vals[Math.floor(vals.length / 2)],
        p5:     vals[Math.floor(vals.length * 0.05)],
        p95:    vals[Math.floor(vals.length * 0.95)],
        stdDev: this._stdDev(vals),
        min:    vals[0],
        max:    vals[vals.length - 1],
        unit:   v.unit,
      }
    })
  }

  private _sample(v: SimulationVariable): number {
    const r = Math.random()
    switch (v.distribution) {
      case 'UNIFORM':
        return v.minValue + r * (v.maxValue - v.minValue)
      case 'NORMAL': {
        // Box-Muller transform
        const u1 = Math.random(), u2 = Math.random()
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
        const mid = (v.minValue + v.maxValue) / 2
        const sd  = (v.maxValue - v.minValue) / 6
        return Math.min(v.maxValue, Math.max(v.minValue, mid + z * sd))
      }
      case 'TRIANGULAR': {
        const mid = (v.minValue + v.maxValue) / 2
        const fc  = (mid - v.minValue) / (v.maxValue - v.minValue)
        if (r < fc) return v.minValue + Math.sqrt(r * (v.maxValue - v.minValue) * (mid - v.minValue))
        return v.maxValue - Math.sqrt((1 - r) * (v.maxValue - v.minValue) * (v.maxValue - mid))
      }
      default:
        return v.minValue + r * (v.maxValue - v.minValue)
    }
  }

  private _mean(vals: number[]): number {
    return vals.reduce((a, b) => a + b, 0) / vals.length
  }

  private _stdDev(vals: number[]): number {
    const m = this._mean(vals)
    return Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / vals.length)
  }
}
