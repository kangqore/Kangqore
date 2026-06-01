import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { LayoutGrid, PieChart, Send, UserCircle } from 'lucide-react'
import { cn } from '@design-system/cn'
import { InvestorsOverview } from './pages/InvestorsOverview'
import { CapTablePage }      from './pages/CapTablePage'
import { UpdatesPage }       from './pages/UpdatesPage'
import { InvestorProfile }   from './pages/InvestorProfile'

const TABS = [
  { path: '',         label: 'Overview',  icon: LayoutGrid  },
  { path: 'captable', label: 'Cap Table', icon: PieChart    },
  { path: 'updates',  label: 'Updates',   icon: Send        },
  { path: 'profile',  label: 'Profiles',  icon: UserCircle  },
]

export function InvestorsModule() {
  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/investors' : `/os/investors/${tab.path}`}
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
        <Route index              element={<InvestorsOverview />} />
        <Route path="captable"    element={<CapTablePage />}      />
        <Route path="updates"     element={<UpdatesPage />}       />
        <Route path="profile"     element={<InvestorProfile />}   />
        <Route path="*"           element={<Navigate to="/os/investors" replace />} />
      </Routes>
    </div>
  )
}
