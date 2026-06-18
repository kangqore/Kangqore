import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
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
import { AnimatePresence, motion } from 'framer-motion'

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

  const { pathname } = useLocation()

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-[#2E2854] mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/finance' : `/kangqore-view/admin/finance/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-[#2564ea] text-[#2564ea]'
                : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-[#2E2854]'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>

        <Routes>
          <Route index           element={<FinanceOverview />} />
          <Route path="invoices" element={<InvoicesPage />}    />
          <Route path="budget"   element={<BudgetTracker />}   />
          <Route path="burn"     element={<BurnRatePage />}    />
          <Route path="*"        element={<Navigate to="/kangqore-view/admin/finance" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
