import { create } from 'zustand'
import { WORKFLOWS, WORKFLOW_RUNS } from './data'
import type { Workflow, WorkflowRun } from './types'

interface WorkflowsStore {
  workflows:  typeof WORKFLOWS
  runs:       typeof WORKFLOW_RUNS
  selectedId: string
  setSelected:       (id: string)          => void
  hydrateWorkflows:  (wf: Workflow[])      => void
  hydrateRuns:       (runs: WorkflowRun[]) => void
  totalRuns:    () => number
  successRate:  () => number
  activeCount:  () => number
}

export const useWorkflowsStore = create<WorkflowsStore>((set, get) => ({
  workflows:  WORKFLOWS,
  runs:       WORKFLOW_RUNS,
  selectedId: 'wf1',

  setSelected:      (id)    => set({ selectedId: id }),
  hydrateWorkflows: (wf)    => set({ workflows: wf, selectedId: wf[0]?.id ?? 'wf1' }),
  hydrateRuns:      (runs)  => set({ runs }),

  totalRuns:   () => get().workflows.reduce((s, w) => s + w.runsTotal, 0),
  successRate: () => {
    const total   = get().workflows.reduce((s, w) => s + w.runsTotal, 0)
    const success = get().workflows.reduce((s, w) => s + w.runsSuccess, 0)
    return total > 0 ? Math.round((success / total) * 100) : 0
  },
  activeCount: () => get().workflows.filter(w => w.status === 'active').length,
}))
