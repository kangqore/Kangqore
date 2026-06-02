import { create } from 'zustand'
import { DEPARTMENTS, ORG_NODES, DEPT_BUDGETS } from './data'

interface DepartmentsStore {
  departments: typeof DEPARTMENTS
  orgNodes:    typeof ORG_NODES
  budgets:     typeof DEPT_BUDGETS
  selectedId:  string
  setSelected: (id: string) => void
  totalHeadcount: () => number
  totalBudget:    () => number
  totalSpent:     () => number
}

export const useDepartmentsStore = create<DepartmentsStore>((set, get) => ({
  departments: DEPARTMENTS,
  orgNodes:    ORG_NODES,
  budgets:     DEPT_BUDGETS,
  selectedId:  'd1',

  setSelected: (id) => set({ selectedId: id }),

  totalHeadcount: () => get().departments.reduce((s, d) => s + d.headcount, 0),
  totalBudget:    () => get().departments.reduce((s, d) => s + d.budget, 0),
  totalSpent:     () => get().departments.reduce((s, d) => s + d.spent, 0),
}))
