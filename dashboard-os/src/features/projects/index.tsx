import { useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, Kanban, BarChart2, Zap, Bug } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { toProjects } from '@lib/transforms'
import { useProjectsStore } from './store'
import { ProjectsOverview } from './pages/ProjectsOverview'
import { KanbanBoard }      from './pages/KanbanBoard'
import { GanttPage }        from './pages/GanttPage'
import { SprintBoard }      from './pages/SprintBoard'
import { IssueTracker }     from './pages/IssueTracker'

const TABS = [
  { path: '',        label: 'Overview', icon: LayoutGrid },
  { path: 'kanban',  label: 'Kanban',   icon: Kanban    },
  { path: 'gantt',   label: 'Gantt',    icon: BarChart2 },
  { path: 'sprints', label: 'Sprints',  icon: Zap       },
  { path: 'issues',  label: 'Issues',   icon: Bug       },
]

export function ProjectsModule() {
  const { hydrate } = useProjectsStore()
  const { data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data.projects ?? []),
    staleTime: 1000 * 60 * 5,
    enabled: !isDemo(),
  })
  useEffect(() => { if (data) hydrate(toProjects(data)) }, [data, hydrate])

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/projects' : `/os/projects/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index           element={<ProjectsOverview />} />
        <Route path="kanban"   element={<KanbanBoard />}      />
        <Route path="gantt"    element={<GanttPage />}        />
        <Route path="sprints"  element={<SprintBoard />}      />
        <Route path="issues"   element={<IssueTracker />}     />
        <Route path="*"        element={<Navigate to="/os/projects" replace />} />
      </Routes>
    </div>
  )
}
