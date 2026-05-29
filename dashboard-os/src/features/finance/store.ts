import { create } from 'zustand'
import { INVOICES, BUDGET_LINES, CASH_FLOW, PROJECT_FINANCIALS } from './data'
import type { InvoiceStatus } from './types'

interface FinanceStore {
  invoices:          typeof INVOICES
  budgetLines:       typeof BUDGET_LINES
  cashFlow:          typeof CASH_FLOW
  projectFinancials: typeof PROJECT_FINANCIALS
  invoicesByStatus:  (status: InvoiceStatus) => typeof INVOICES
  totalInvoiced:     () => number
  totalCollected:    () => number
  totalOverdue:      () => number
  totalBudget:       () => number
  totalSpent:        () => number
}

export const useFinanceStore = create<FinanceStore>((_, get) => ({
  invoices:          INVOICES,
  budgetLines:       BUDGET_LINES,
  cashFlow:          CASH_FLOW,
  projectFinancials: PROJECT_FINANCIALS,

  invoicesByStatus: (status) => get().invoices.filter(i => i.status === status),

  totalInvoiced:  () => get().invoices.filter(i => i.status !== 'cancelled').reduce((s, i) => s + i.amount, 0),
  totalCollected: () => get().invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
  totalOverdue:   () => get().invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
  totalBudget:    () => get().budgetLines.reduce((s, b) => s + b.allocated, 0),
  totalSpent:     () => get().budgetLines.reduce((s, b) => s + b.spent, 0),
}))
