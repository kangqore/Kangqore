import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Users, CalendarDays, GitBranch, BarChart3 } from 'lucide-react'
import { cn } from '@design-system/cn'
import { TeamOverview }     from './pages/TeamOverview'
import { CapacityPage }     from './pages/CapacityPage'
import { AssignmentsPage }  from './pages/AssignmentsPage'
import { UtilizationPage }  from './pages/UtilizationPage'

const TABS = [
  { path: '',             label: 'Team',        icon: Users        },
  { path: 'capacity',     label: 'Capacity',    icon: CalendarDays },
  { path: 'assignments',  label: 'Assignments', icon: GitBranch    },
  { path: 'utilization',  label: 'Utilization', icon: BarChart3    },
]

export function ResourcesModule() {
  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/resources' : `/os/resources/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index                element={<TeamOverview />}    />
        <Route path="capacity"      element={<CapacityPage />}    />
        <Route path="assignments"   element={<AssignmentsPage />} />
        <Route path="utilization"   element={<UtilizationPage />} />
        <Route path="*"             element={<Navigate to="/os/resources" replace />} />
      </Routes>
    </div>
  )
}
