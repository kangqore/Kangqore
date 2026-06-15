import { create } from 'zustand'
import { DEPARTMENTS, ORG_NODES, DEPT_BUDGETS } from './data'
import type { Department, OrgNode, DeptBudget } from './types'

interface DepartmentsStore {
  departments: Department[]
  orgNodes:    OrgNode[]
  budgets:     DeptBudget[]
  selectedId:  string
  hydrate:        (data: { departments: Department[]; orgNodes: OrgNode[]; budgets: DeptBudget[] }) => void
  setSelected:    (id: string) => void
  totalHeadcount: () => number
  totalBudget:    () => number
  totalSpent:     () => number
}

export const useDepartmentsStore = create<DepartmentsStore>((set, get) => ({
  departments: DEPARTMENTS,
  orgNodes:    ORG_NODES,
  budgets:     DEPT_BUDGETS,
  selectedId:  'd1',

  hydrate:     (data) => set({ departments: data.departments, orgNodes: data.orgNodes, budgets: data.budgets }),
  setSelected: (id) => set({ selectedId: id }),

  totalHeadcount: () => get().departments.reduce((s, d) => s + d.headcount, 0),
  totalBudget:    () => get().departments.reduce((s, d) => s + d.budget, 0),
  totalSpent:     () => get().departments.reduce((s, d) => s + d.spent, 0),
}))
