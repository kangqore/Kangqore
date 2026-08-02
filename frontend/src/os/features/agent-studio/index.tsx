import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Bot, Gauge } from 'lucide-react'
import { cn } from '@design-system/cn'
import { AgentStudioPage } from './pages/AgentStudioPage'
import { AgentPerformancePage } from './pages/AgentPerformancePage'

const TABS = [
  { path: 'builder',     label: 'Builder',     icon: Bot },
  { path: 'performance', label: 'Performance', icon: Gauge },
]

export function AgentStudioModule() {
  return (
    <div>
      <div className="flex items-center gap-0.5 border-b border-[var(--os-border)] mb-6">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={`/kangqore-view/admin/agent-studio/${tab.path}`}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap',
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

      <Routes>
        <Route index            element={<Navigate to="builder" replace />} />
        <Route path="builder"     element={<AgentStudioPage />}       />
        <Route path="performance" element={<AgentPerformancePage />}  />
        <Route path="*"          element={<Navigate to="builder" replace />} />
      </Routes>
    </div>
  )
}
