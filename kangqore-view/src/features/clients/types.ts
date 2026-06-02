export type ClientHealth    = 'excellent' | 'good' | 'at-risk' | 'critical'
export type ClientStatus    = 'active' | 'onboarding' | 'paused' | 'churned'
export type RelationshipTier = 'strategic' | 'enterprise' | 'standard' | 'starter'
export type SLAStatus       = 'met' | 'at-risk' | 'breached'
export type GovernanceType  = 'decision' | 'change-request' | 'steering' | 'escalation'
export type GovernanceStatus = 'open' | 'approved' | 'rejected' | 'pending' | 'closed'
export type InteractionType = 'call' | 'email' | 'meeting' | 'note' | 'milestone'
export type MilestoneStatus = 'completed' | 'in-progress' | 'upcoming' | 'delayed'

export interface Contact {
  id: string
  clientId: string
  name: string
  role: string
  email: string
  phone?: string
  isPrimary: boolean
}

export interface Client {
  id: string
  name: string
  industry: string
  country: string
  tier: RelationshipTier
  status: ClientStatus
  health: ClientHealth
  arr: number
  contractStart: string
  contractEnd: string
  owner: string
  contacts: Contact[]
  projectIds: string[]
  satisfactionScore: number
  lastActivity: string
  description: string
  logo: string
}

export interface Interaction {
  id: string
  clientId: string
  type: InteractionType
  title: string
  summary: string
  date: string
  owner: string
}

export interface SLAMetric {
  id: string
  clientId: string
  metric: string
  target: number
  current: number
  unit: string
  period: string
  status: SLAStatus
  trend: 'up' | 'down' | 'stable'
}

export interface Milestone {
  id: string
  clientId: string
  projectId: string
  title: string
  description: string
  dueDate: string
  completedDate?: string
  status: MilestoneStatus
  owner: string
}

export interface GovernanceItem {
  id: string
  clientId: string
  type: GovernanceType
  title: string
  description: string
  status: GovernanceStatus
  owner: string
  date: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  resolution?: string
}
