import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, Kanban, BarChart2, Zap, Bug, Brain, AlertTriangle } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { toProjects } from '@lib/transforms'
import { useProjectsStore } from './store'
import { PROJECTS, TASKS, SPRINTS, ISSUES } from './data'
import { useOperationsProjection } from './useOperationsProjection'
import { ProjectsOverview } from './pages/ProjectsOverview'
import { KanbanBoard }      from './pages/KanbanBoard'
import { GanttPage }        from './pages/GanttPage'
import { SprintBoard }      from './pages/SprintBoard'
import { IssueTracker }     from './pages/IssueTracker'
import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore }  from '@store/ui'
import { usePageViews } from '@hooks/usePageViews'

// ── Gen III: WEE intelligence banner ────────────────────────────────────────
// Projects workspace is the first organic page promoted through WAANDA→WEE composition.
// The banner projects WAANDA's cognitive state into the OPERATIONS scope.
// It never fetches independently — only reads from the WEE ExperienceModel.
function WANDAProjectIntelligence() {
  const model = useOperationsProjection()
  if (!model || model.confidence < 0.1) return null

  const payload    = model.payload as Record<string, any>
  const phase      = model.cognitivePhase
  const atRisk     = (payload.atRiskCount ?? 0) as number
  const briefing   = (payload.waandaSuggestions as any[])?.[0]
  const synthesis  = payload.kimmSynthesis as string | null

  const PHASE_COLOR: Record<string, string> = {
    OBSERVE: '#3b82f6', UNDERSTAND: '#7c3aed', DECIDE: '#f59e0b',
    ACT: '#10b981', LEARN: '#0d9488',
  }
  const col = PHASE_COLOR[phase] ?? '#3b82f6'
  const insight = synthesis
    ? synthesis.slice(0, 120) + (synthesis.length > 120 ? '…' : '')
    : briefing?.text
      ? (briefing.text as string).slice(0, 120) + ((briefing.text as string).length > 120 ? '…' : '')
      : null

  if (!insight && atRisk === 0) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 14px', marginBottom: 10,
      background: col + '08', border: `1px solid ${col}20`, borderRadius: 8,
    }}>
      <Brain size={12} style={{ color: col, flexShrink: 0 }} />
      <span style={{
        fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em',
        color: col, background: col + '15', padding: '2px 7px', borderRadius: 4,
        flexShrink: 0,
      }}>
        WAANDA · {phase}
      </span>
      {insight && (
        <span style={{ fontSize: 11, color: 'var(--os-text-3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {insight}
        </span>
      )}
      {atRisk > 0 && (
        <span style={{
          display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
          fontSize: 10, fontWeight: 700, color: '#f59e0b',
          background: '#f59e0b10', border: '1px solid #f59e0b25',
          padding: '2px 8px', borderRadius: 4,
        }}>
          <AlertTriangle size={9} />
          {atRisk} at-risk
        </span>
      )}
    </div>
  )
}

// Tabs that map to the 4 global view modes (Sprints + Issues are extras, not view modes)
const VIEW_TABS = [
  { path: '',       label: 'Overview', icon: LayoutGrid, viewMode: 'list'   as const },
  { path: 'kanban', label: 'Kanban',   icon: Kanban,    viewMode: 'kanban' as const },
  { path: 'gantt',  label: 'Gantt',    icon: BarChart2, viewMode: 'gantt'  as const },
]

const EXTRA_TABS = [
  { path: 'sprints', label: 'Sprints', icon: Zap },
  { path: 'issues',  label: 'Issues',  icon: Bug },
]

const BASE = '/kangqore-view/admin/projects'

export function ProjectsModule() {
  const { hydrate } = useProjectsStore()
  const { data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects?limit=50').then(r => r.data.projects ?? []),
    staleTime: 1000 * 60 * 5,
    enabled: !isDemo(),
  })
  useEffect(() => {
    if (isDemo()) {
      hydrate(PROJECTS, TASKS, SPRINTS, ISSUES)
    } else if (data) {
      hydrate(toProjects(data))
    }
  }, [data, hydrate])

  // Register all 4 global views for the Projects module
  usePageViews(['list', 'board', 'kanban', 'gantt'])

  const { viewMode, setViewMode } = useUIStore()
  const navigate   = useNavigate()
  const { pathname } = useLocation()

  // When the Topbar toggle changes, navigate to the right route
  useEffect(() => {
    if (viewMode === 'kanban' && !pathname.endsWith('/kanban')) {
      navigate(`${BASE}/kanban`, { replace: true })
    } else if (viewMode === 'gantt' && !pathname.endsWith('/gantt')) {
      navigate(`${BASE}/gantt`, { replace: true })
    } else if ((viewMode === 'list' || viewMode === 'board') && (pathname.endsWith('/kanban') || pathname.endsWith('/gantt'))) {
      navigate(BASE, { replace: true })
    }
  }, [viewMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // When a view-mode tab is clicked, also update the global toggle
  function onViewTabClick(mode: 'list' | 'kanban' | 'gantt') {
    setViewMode(mode)
  }

  return (
    <div>
      <WANDAProjectIntelligence />
      <div className="flex items-center gap-1 border-b border-[var(--os-border)] mb-6 -mt-2">
        {/* View-mode tabs — sync with global toggle */}
        {VIEW_TABS.map(tab => {
          const isActive = tab.viewMode === 'kanban'
            ? pathname.endsWith('/kanban')
            : tab.viewMode === 'gantt'
              ? pathname.endsWith('/gantt')
              : !pathname.endsWith('/kanban') && !pathname.endsWith('/gantt')
                && !pathname.endsWith('/sprints') && !pathname.endsWith('/issues')
          return (
            <NavLink
              key={tab.path}
              to={tab.path === '' ? BASE : `${BASE}/${tab.path}`}
              end={tab.path === ''}
              onClick={() => onViewTabClick(tab.viewMode)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
                isActive
                  ? 'border-[#579bfc] text-[#579bfc]'
                  : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </NavLink>
          )
        })}

        <div className="w-px h-5 mx-1" style={{ background: 'var(--os-border)' }} />

        {/* Extra tabs — not in global toggle */}
        {EXTRA_TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={`${BASE}/${tab.path}`}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-[#579bfc] text-[#579bfc]'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
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
            <Route index           element={<ProjectsOverview />} />
            <Route path="kanban"   element={<KanbanBoard />}      />
            <Route path="gantt"    element={<GanttPage />}        />
            <Route path="sprints"  element={<SprintBoard />}      />
            <Route path="issues"   element={<IssueTracker />}     />
            <Route path="*"        element={<Navigate to={BASE} replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
