import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { LayoutGrid, KanbanSquare, Mail, Brain } from 'lucide-react'
import { cn } from '@design-system/cn'
import { LeadsPipeline } from './pages/LeadsPipeline'
import { LeadProfile }   from './pages/LeadProfile'
import { NurturePage }   from './pages/NurturePage'
import { ScoringPage }   from './pages/ScoringPage'

const TABS = [
  { path: '',        label: 'Pipeline', icon: KanbanSquare },
  { path: 'profile', label: 'Profile',  icon: LayoutGrid   },
  { path: 'nurture', label: 'Nurture',  icon: Mail         },
  { path: 'scoring', label: 'Scoring',  icon: Brain        },
]

export function LeadsModule() {
  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/leads' : `/os/leads/${tab.path}`}
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
        <Route index            element={<LeadsPipeline />} />
        <Route path="profile"   element={<LeadProfile />}   />
        <Route path="nurture"   element={<NurturePage />}   />
        <Route path="scoring"   element={<ScoringPage />}   />
        <Route path="*"         element={<Navigate to="/os/leads" replace />} />
      </Routes>
    </div>
  )
}
