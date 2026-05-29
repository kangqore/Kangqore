export type HealthStatus = 'on-track' | 'at-risk' | 'behind' | 'completed'
export type ProgramStatus = 'active' | 'planned' | 'completed' | 'on-hold'
export type Quarter = 'Q1 2026' | 'Q2 2026' | 'Q3 2026' | 'Q4 2026'

export interface Pillar {
  id: string
  name: string
  description: string
  color: string
  owner: string
  health: HealthStatus
  programCount: number
  okrCount: number
  budget: number
  spent: number
}

export interface Program {
  id: string
  pillarId: string
  pillarName: string
  pillarColor: string
  name: string
  description: string
  status: ProgramStatus
  health: HealthStatus
  owner: string
  budget: number
  spent: number
  progress: number
  startDate: string
  endDate: string
  teamSize: number
}

export interface KeyResult {
  id: string
  objectiveId: string
  title: string
  current: number
  target: number
  unit: string
  progress: number
  status: HealthStatus
}

export interface Objective {
  id: string
  pillarId: string
  pillarName: string
  pillarColor: string
  quarter: Quarter
  title: string
  description: string
  owner: string
  status: HealthStatus
  progress: number
  keyResults: KeyResult[]
}
