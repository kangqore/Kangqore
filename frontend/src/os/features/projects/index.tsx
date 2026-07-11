import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, Kanban, BarChart2, Zap, Bug } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { toProjects } from '@lib/transforms'
import { useProjectsStore } from './store'
import { PROJECTS, TASKS, SPRINTS, ISSUES } from './data'
import { ProjectsOverview } from './pages/ProjectsOverview'
import { KanbanBoard }      from './pages/KanbanBoard'
import { GanttPage }        from './pages/GanttPage'
import { SprintBoard }      from './pages/SprintBoard'
import { IssueTracker }     from './pages/IssueTracker'
import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore }  from '@store/ui'
import { usePageViews } from '@hooks/usePageViews'

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
    queryFn: () => api.get('/projects').then(r => r.data.projects ?? []),
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
