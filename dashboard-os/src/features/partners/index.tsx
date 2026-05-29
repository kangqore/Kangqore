import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { LayoutGrid, UserCircle, CheckSquare, DollarSign } from 'lucide-react'
import { cn } from '@design-system/cn'
import { PartnersOverview } from './pages/PartnersOverview'
import { PartnerProfile }   from './pages/PartnerProfile'
import { TasksPage }        from './pages/TasksPage'
import { EarningsPage }     from './pages/EarningsPage'

const TABS = [
  { path: '',         label: 'Overview', icon: LayoutGrid  },
  { path: 'profile',  label: 'Profile',  icon: UserCircle  },
  { path: 'tasks',    label: 'Tasks',    icon: CheckSquare },
  { path: 'earnings', label: 'Earnings', icon: DollarSign  },
]

export function PartnersModule() {
  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/partners' : `/os/partners/${tab.path}`}
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
        <Route index             element={<PartnersOverview />} />
        <Route path="profile"    element={<PartnerProfile />}   />
        <Route path="tasks"      element={<TasksPage />}        />
        <Route path="earnings"   element={<EarningsPage />}     />
        <Route path="*"          element={<Navigate to="/os/partners" replace />} />
      </Routes>
    </div>
  )
}
