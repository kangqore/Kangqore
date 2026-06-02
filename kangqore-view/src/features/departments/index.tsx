import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Building2, GitBranch, DollarSign } from 'lucide-react'
import { cn } from '@design-system/cn'
import { DepartmentsOverview } from './pages/DepartmentsOverview'
import { OrgChartPage }        from './pages/OrgChartPage'
import { DeptBudgetPage }      from './pages/DeptBudgetPage'

const TABS = [
  { path: '',        label: 'Overview',  icon: Building2  },
  { path: 'org',     label: 'Org Chart', icon: GitBranch  },
  { path: 'budget',  label: 'Budgets',   icon: DollarSign },
]

export function DepartmentsModule() {
  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/departments' : `/os/departments/${tab.path}`}
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
        <Route index         element={<DepartmentsOverview />} />
        <Route path="org"    element={<OrgChartPage />}        />
        <Route path="budget" element={<DeptBudgetPage />}      />
        <Route path="*"      element={<Navigate to="/os/departments" replace />} />
      </Routes>
    </div>
  )
}
