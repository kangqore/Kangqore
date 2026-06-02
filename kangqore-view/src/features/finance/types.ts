export type InvoiceStatus  = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
export type Currency       = 'GBP' | 'USD' | 'EUR'
export type BudgetCategory = 'Personnel' | 'Software' | 'Infrastructure' | 'Marketing' | 'Travel' | 'Legal' | 'Other'

export interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Invoice {
  id: string
  number: string
  client: string
  projectId: string
  projectName: string
  amount: number
  currency: Currency
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  paidDate?: string
  items: InvoiceItem[]
}

export interface BudgetLine {
  id: string
  category: BudgetCategory
  department: string
  description: string
  allocated: number
  spent: number
  committed: number
}

export interface CashFlowPoint {
  month: string
  inflow: number
  outflow: number
  net: number
  runningBalance: number
}

export interface ProjectFinancial {
  projectId: string
  projectName: string
  projectColor: string
  client: string
  budget: number
  invoiced: number
  collected: number
  spent: number
  margin: number
}
