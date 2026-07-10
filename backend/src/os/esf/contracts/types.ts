// ESF — Enterprise Simulation Framework contracts

export type SimulationHorizon = 'DAYS_7' | 'DAYS_30' | 'DAYS_90' | 'DAYS_180' | 'DAYS_365'
export type SimulationStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
export type SimulationType = 'MONTE_CARLO' | 'SCENARIO' | 'SENSITIVITY' | 'STRESS_TEST' | 'WHAT_IF'

export interface SimulationVariable {
  variableId: string
  name: string
  baseValue: number
  minValue: number
  maxValue: number
  distribution: 'UNIFORM' | 'NORMAL' | 'LOGNORMAL' | 'TRIANGULAR'
  unit?: string
}

export interface SimulationScenario {
  scenarioId: string
  name: string
  description: string
  type: SimulationType
  horizon: SimulationHorizon
  variables: SimulationVariable[]
  iterations: number
  domainScope: string[]
  createdAt: Date
}

export interface SimulationOutcome {
  outcomeId: string
  metric: string
  mean: number
  median: number
  p5: number
  p95: number
  stdDev: number
  min: number
  max: number
  unit?: string
}

export interface SimulationResult {
  resultId: string
  scenarioId: string
  status: SimulationStatus
  outcomes: SimulationOutcome[]
  iterations: number
  confidenceLevel: number
  durationMs: number
  completedAt: Date
  insights: string[]
  recommendations: string[]
}

export interface SimulationTemplate {
  templateId: string
  name: string
  description: string
  type: SimulationType
  defaultVariables: SimulationVariable[]
  defaultHorizon: SimulationHorizon
  defaultIterations: number
  applicableDomains: string[]
}
