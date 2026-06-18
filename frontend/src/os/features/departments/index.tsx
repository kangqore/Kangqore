import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Building2, GitBranch, DollarSign } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useDepartmentsStore } from './store'
import { DepartmentsOverview } from './pages/DepartmentsOverview'
import { OrgChartPage }        from './pages/OrgChartPage'
import { DeptBudgetPage }      from './pages/DeptBudgetPage'
import { AnimatePresence, motion } from 'framer-motion'

const TABS = [
  { path: '',        label: 'Overview',  icon: Building2  },
  { path: 'org',     label: 'Org Chart', icon: GitBranch  },
  { path: 'budget',  label: 'Budgets',   icon: DollarSign },
]

export function DepartmentsModule() {
  const hydrate = useDepartmentsStore(s => s.hydrate)

  const { data } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/departments').then(r => r.data),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (data?.departments?.length) hydrate(data)
  }, [data, hydrate])

  const { pathname } = useLocation()

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-os-border mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/departments' : `/kangqore-view/admin/departments/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-os-blue text-os-blue'
                : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-os-border'
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
          <Route index         element={<DepartmentsOverview />} />
          <Route path="org"    element={<OrgChartPage />}        />
          <Route path="budget" element={<DeptBudgetPage />}      />
          <Route path="*"      element={<Navigate to="/kangqore-view/admin/departments" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
