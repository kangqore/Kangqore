import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { LayoutGrid, GitBranch } from 'lucide-react'
import { cn } from '@design-system/cn'
import { WorkflowsOverview } from './pages/WorkflowsOverview'
import { WorkflowBuilder }   from './pages/WorkflowBuilder'

const TABS = [
  { path: '',        label: 'Overview', icon: LayoutGrid },
  { path: 'builder', label: 'Builder',  icon: GitBranch  },
]

export function WorkflowsModule() {
  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/workflows' : `/os/workflows/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-[#2564ea] text-[#2564ea]'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index          element={<WorkflowsOverview />} />
        <Route path="builder" element={<WorkflowBuilder />}  />
        <Route path="*"       element={<Navigate to="/os/workflows" replace />} />
      </Routes>
    </div>
  )
}
