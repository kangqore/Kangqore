export type RiskSeverity    = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type RiskProbability = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type RiskImpact      = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type RiskStatus      = 'OPEN' | 'ESCALATED' | 'MITIGATED' | 'ACCEPTED' | 'CANCELLED'
export type RiskTrend       = 'STABLE' | 'INCREASING' | 'DECREASING'

export interface Risk {
  id:                  string
  title:               string
  description?:        string
  severity:            RiskSeverity
  status:              RiskStatus
  probability?:        RiskProbability
  impact?:             RiskImpact
  owner?:              string
  riskOwner?:          string
  trend?:              RiskTrend
  mitigationPlan?:     string
  contingencyPlan?:    string
  clientAcceptedBy?:   string
  clientAcceptedAt?:   string
  clientResponse?:     string
  isClientVisible?:    boolean
  projectId?:          string
  clientId?:           string
  project?:            { title: string }
  client?:             { name: string; company: string }
  createdAt:           string
  updatedAt:           string
}

export interface HealthDimensions {
  schedule: number  // 0-100
  budget:   number
  quality:  number
  team:     number
  client:   number
  tech:     number
}
