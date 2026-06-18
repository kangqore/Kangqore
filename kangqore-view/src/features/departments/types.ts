export type DeptStatus    = 'active' | 'scaling' | 'restructuring' | 'new'
export type BudgetStatus  = 'on-track' | 'over' | 'under' | 'at-risk'
export type HeadcountTrend = 'growing' | 'stable' | 'shrinking'

export interface Department {
  id:             string
  name:           string          // e.g. "KANGQORE COGNITION™"
  shortName:      string          // e.g. "COGNITION"
  head:           string
  headTitle:      string
  headAvatar?:    string
  status:         DeptStatus
  headcount:      number
  openRoles:      number
  budget:         number          // ₹k annual
  spent:          number          // ₹k YTD
  budgetStatus:   BudgetStatus
  costCenter:     string
  parentId?:      string
  description:    string
  color:          string          // brand accent hex
  // Revenue & commercial
  revenue:        number          // ₹Cr MTD
  revenueGrowth:  string          // e.g. "+28%"
  pipeline:       number          // ₹Cr in pipeline
  activeClients:  number
  activeProjects: number
  deliveryHealth: number          // 0–100
  // KPIs
  kpis:    { metric: string; value: string; trend: 'up' | 'down' | 'neutral' }[]
  services: string[]              // key service offerings
  tags:    string[]
}

export interface OrgNode {
  id:          string
  name:        string
  title:       string
  department:  string
  reportsTo?:  string
  level:       number           // 0 = CEO, 1 = C-suite, 2 = VP, 3 = Lead, 4 = IC
  headcount?:  number
}

export interface DeptBudget {
  deptId:    string
  deptName:  string
  annual:    number
  q1: number; q1Spent: number
  q2: number; q2Spent: number
  q3: number; q3Budget: number
  q4: number; q4Budget: number
  categories: { name: string; budget: number; spent: number }[]
}
