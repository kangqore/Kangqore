import { useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutDashboard, FileText, PieChart, TrendingDown } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { toInvoices } from '@lib/transforms'
import { useFinanceStore } from './store'
import { FinanceOverview } from './pages/FinanceOverview'
import { InvoicesPage }   from './pages/InvoicesPage'
import { BudgetTracker }  from './pages/BudgetTracker'
import { BurnRatePage }   from './pages/BurnRatePage'

const TABS = [
  { path: '',        label: 'Overview', icon: LayoutDashboard },
  { path: 'invoices',label: 'Invoices', icon: FileText        },
  { path: 'budget',  label: 'Budget',   icon: PieChart        },
  { path: 'burn',    label: 'Burn Rate',icon: TrendingDown    },
]

export function FinanceModule() {
  const { hydrateInvoices } = useFinanceStore()
  const { data } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get('/invoices').then(r => r.data.invoices ?? []),
    staleTime: 1000 * 60 * 5,
    enabled: !isDemo(),
  })
  useEffect(() => { if (data) hydrateInvoices(toInvoices(data)) }, [data, hydrateInvoices])

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/finance' : `/kangqore-view/finance/${tab.path}`}
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
        <Route index           element={<FinanceOverview />} />
        <Route path="invoices" element={<InvoicesPage />}    />
        <Route path="budget"   element={<BudgetTracker />}   />
        <Route path="burn"     element={<BurnRatePage />}    />
        <Route path="*"        element={<Navigate to="/kangqore-view/finance" replace />} />
      </Routes>
    </div>
  )
}
