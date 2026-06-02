export type DecisionStatus   = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'DEFERRED' | 'WITHDRAWN'
export type ChangeStatus     = 'PENDING_APPROVAL' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED' | 'DEFERRED'
export type Priority         = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Decision {
  id:            string
  title:         string
  description?:  string
  status:        DecisionStatus
  priority:      Priority
  dueDate?:      string
  rationale?:    string
  tradeoffs?:    string
  impactTime?:   string
  impactCost?:   number
  impactRisk?:   string
  projectId?:    string
  clientId?:     string
  project?:      { title: string }
  client?:       { name: string; company: string }
  approver?:     { name: string; authorityRole?: string }
  risk?:         { id: string; title: string }
  changeRequest?:{ id: string; title: string }
  createdAt:     string
  updatedAt:     string
}

export interface ChangeRequest {
  id:               string
  title:            string
  description?:     string
  priority:         Priority
  status:           ChangeStatus
  costImpact?:      number
  timeImpact?:      string
  rejectionImpact?: string
  requestedBy?:     string
  decisionType?:    string
  projectId?:       string
  clientId?:        string
  project?:         { title: string }
  client?:          { name: string; company: string }
  invoice?:         { amount: number }
  approvingDecisions?: { id: string; title: string; status: string }[]
  createdAt:        string
  updatedAt:        string
}

export interface AuditLog {
  id:         string
  action:     string
  resource:   string
  details?:   Record<string, unknown>
  ipAddress?: string
  userId?:    string
  user?:      { name: string; email: string; role: string; company?: string }
  createdAt:  string
}
