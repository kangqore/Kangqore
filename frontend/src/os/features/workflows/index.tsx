import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery }   from '@tanstack/react-query'
import { LayoutGrid, GitBranch, Sparkles } from 'lucide-react'
import { cn }         from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useWorkflowsStore } from './store'
import type { Workflow, WorkflowRun } from './types'
import { WorkflowsOverview }       from './pages/WorkflowsOverview'
import { WorkflowBuilder }         from './pages/WorkflowBuilder'
import { KIMMLWorkflowGenerator }  from './pages/KIMMLWorkflowGenerator'
import { AnimatePresence, motion } from 'framer-motion'

const TABS = [
  { path: '',          label: 'Overview',      icon: LayoutGrid },
  { path: 'builder',   label: 'Builder',       icon: GitBranch  },
  { path: 'kimmp',     label: 'KIMMP Build',   icon: Sparkles   },
]

// Map DB row → frontend Workflow type.
// steps is stored as Json in the DB so cast it through.
function toWorkflow(r: Record<string, unknown>): Workflow {
  return {
    id:            String(r.id ?? ''),
    name:          String(r.name ?? ''),
    description:   String(r.description ?? ''),
    category:      (r.category as Workflow['category']) ?? 'ops',
    status:        (r.status   as Workflow['status'])   ?? 'draft',
    triggerType:   (r.triggerType as Workflow['triggerType']) ?? 'manual',
    triggerConfig: String(r.triggerConfig ?? ''),
    steps:         Array.isArray(r.steps) ? r.steps as Workflow['steps'] : [],
    lastRun:       r.lastRun ? String(r.lastRun).slice(0, 19).replace('T', ' ') : undefined,
    nextRun:       r.nextRun ? String(r.nextRun).slice(0, 19).replace('T', ' ') : undefined,
    runsTotal:     Number(r.runsTotal   ?? 0),
    runsSuccess:   Number(r.runsSuccess ?? 0),
    runsFailed:    Number(r.runsFailed  ?? 0),
    avgDuration:   Number(r.avgDuration ?? 0),
    owner:         String(r.owner ?? ''),
    createdAt:     String(r.createdAt ?? '').slice(0, 10),
    tags:          Array.isArray(r.tags) ? r.tags as string[] : [],
  }
}

function toRun(r: Record<string, unknown>): WorkflowRun {
  return {
    id:             String(r.id ?? ''),
    workflowId:     String(r.workflowId ?? ''),
    workflowName:   String(r.workflowName ?? ''),
    status:         (r.status as WorkflowRun['status']) ?? 'completed',
    startedAt:      String(r.startedAt ?? '').slice(0, 19).replace('T', ' '),
    completedAt:    r.completedAt ? String(r.completedAt).slice(0, 19).replace('T', ' ') : undefined,
    duration:       r.duration ? Number(r.duration) : undefined,
    triggeredBy:    String(r.triggeredBy ?? ''),
    stepsCompleted: Number(r.stepsCompleted ?? 0),
    stepsTotal:     Number(r.stepsTotal ?? 0),
    errorMessage:   r.errorMessage ? String(r.errorMessage) : undefined,
  }
}

export function WorkflowsModule() {
  const { hydrateWorkflows, hydrateRuns } = useWorkflowsStore()

  const { data: wfData } = useQuery({
    queryKey:  ['os-workflows'],
    queryFn:   () => api.get('/os-workflows').then(r => r.data.workflows ?? []),
    enabled:   !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: runsData } = useQuery({
    queryKey:  ['os-workflows', 'runs'],
    queryFn:   () => api.get('/os-workflows/runs?limit=20').then(r => r.data.runs ?? []),
    enabled:   !isDemo(),
    staleTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (wfData   !== undefined) hydrateWorkflows((wfData   as Record<string, unknown>[]).map(toWorkflow))
  }, [wfData,   hydrateWorkflows])

  useEffect(() => {
    if (runsData !== undefined) hydrateRuns((runsData as Record<string, unknown>[]).map(toRun))
  }, [runsData, hydrateRuns])

  const { pathname } = useLocation()

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-white/10 border-t-white/20 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/workflows' : `/kangqore-view/admin/workflows/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-os-blue text-os-blue'
                : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-white/10 border-t-white/20'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>

        <Routes>
          <Route index          element={<WorkflowsOverview />}       />
          <Route path="builder" element={<WorkflowBuilder />}         />
          <Route path="kimmp"   element={<KIMMLWorkflowGenerator />}  />
          <Route path="*"       element={<Navigate to="/kangqore-view/admin/workflows" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
