import { create } from 'zustand'
import type { Invoice, InvoiceStatus, BudgetLine, CashFlowPoint, ProjectFinancial } from './types'

interface FinanceStore {
  invoices:            Invoice[]
  budgetLines:         BudgetLine[]
  cashFlow:            CashFlowPoint[]
  projectFinancials:   ProjectFinancial[]
  isLoading:           boolean
  error:               string | null
  hydrateInvoices:     (invoices: Invoice[]) => void
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void
  invoicesByStatus:    (status: InvoiceStatus) => Invoice[]
  totalInvoiced:       () => number
  totalCollected:      () => number
  totalOverdue:        () => number
  totalBudget:         () => number
  totalSpent:          () => number
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  invoices:          [],
  isLoading:         true,
  error:             null,
  budgetLines:       [],
  cashFlow:          [],
  projectFinancials: [],

  hydrateInvoices: (invoices) => set({ invoices, isLoading: false, error: null }),

  updateInvoiceStatus: (id, status) =>
    set(s => ({ invoices: s.invoices.map(i => i.id === id ? { ...i, status } : i) })),

  invoicesByStatus: (status) => get().invoices.filter(i => i.status === status),

  totalInvoiced:  () => get().invoices.filter(i => i.status !== 'cancelled').reduce((s, i) => s + i.amount, 0),
  totalCollected: () => get().invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
  totalOverdue:   () => get().invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
  totalBudget:    () => get().budgetLines.reduce((s, b) => s + b.allocated, 0),
  totalSpent:     () => get().budgetLines.reduce((s, b) => s + b.spent, 0),
}))
