import { useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Users, CalendarDays, GitBranch, BarChart3, Layers, FlaskConical, UserPlus } from 'lucide-react'
import { cn } from '@design-system/cn'
import { SkeletonCard } from '@design-system/components/Skeleton'
import { api, isDemo } from '@lib/api'
import { useResourcesStore } from './store'
import { TeamOverview }          from './pages/TeamOverview'
import { CapacityPage }          from './pages/CapacityPage'
import { AssignmentsPage }       from './pages/AssignmentsPage'
import { UtilizationPage }       from './pages/UtilizationPage'
import { SkillsMatrixPage }      from './pages/SkillsMatrixPage'
import { ScenarioPlanningPage }  from './pages/ScenarioPlanningPage'
import { HiringCalculatorPage }  from './pages/HiringCalculatorPage'

const TABS = [
  { path: '',             label: 'Team',        icon: Users        },
  { path: 'capacity',     label: 'Capacity',    icon: CalendarDays },
  { path: 'skills',       label: 'Skills',      icon: Layers       },
  { path: 'scenarios',    label: 'Scenarios',   icon: FlaskConical },
  { path: 'hiring',       label: 'Hiring',      icon: UserPlus     },
  { path: 'assignments',  label: 'Assignments', icon: GitBranch    },
  { path: 'utilization',  label: 'Utilization', icon: BarChart3    },
]

export function ResourcesModule() {
  const { hydrate } = useResourcesStore()

  const { data, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn:  () => api.get('/resources').then(r => r.data),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (data?.team?.length) hydrate(data)
  }, [data, hydrate])

  if (isLoading && !isDemo()) {
    return (
      <div className="space-y-4">
        <SkeletonCard rows={4} />
        <SkeletonCard rows={3} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/resources' : `/kangqore-view/resources/${tab.path}`}
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
        <Route index                element={<TeamOverview />}         />
        <Route path="capacity"      element={<CapacityPage />}         />
        <Route path="skills"        element={<SkillsMatrixPage />}     />
        <Route path="scenarios"     element={<ScenarioPlanningPage />} />
        <Route path="hiring"        element={<HiringCalculatorPage />} />
        <Route path="assignments"   element={<AssignmentsPage />}      />
        <Route path="utilization"   element={<UtilizationPage />}      />
        <Route path="*"             element={<Navigate to="/kangqore-view/resources" replace />} />
      </Routes>
    </div>
  )
}
