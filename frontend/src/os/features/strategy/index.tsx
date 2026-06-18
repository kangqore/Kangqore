import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Target, LayoutDashboard, TrendingUp, Map } from 'lucide-react'
import { cn } from '@design-system/cn'
import { SkeletonStatCard } from '@design-system/components/Skeleton'
import { api, isDemo } from '@lib/api'
import { useStrategyStore } from './store'
import { StrategyOverview } from './pages/StrategyOverview'
import { PillarsPage } from './pages/PillarsPage'
import { OKRsPage } from './pages/OKRsPage'
import { PortfolioMap } from './pages/PortfolioMap'
import { AnimatePresence, motion } from 'framer-motion'

const TABS = [
  { path: '',          label: 'Overview',  icon: Target          },
  { path: 'pillars',   label: 'Pillars',   icon: LayoutDashboard },
  { path: 'okrs',      label: 'OKRs',      icon: TrendingUp      },
  { path: 'portfolio', label: 'Portfolio', icon: Map             },
]

export function StrategyModule() {
  const { hydrate } = useStrategyStore()

  const { data, isLoading } = useQuery({
    queryKey: ['strategy'],
    queryFn:  () => api.get('/strategy').then(r => r.data),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (data?.pillars?.length) hydrate(data)
  }, [data, hydrate])

  if (isLoading && !isDemo()) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      </div>
    )
  }

  const { pathname } = useLocation()

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-2 border-b border-[#2E2854] mb-8 mt-1">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/strategy' : `/kangqore-view/admin/strategy/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2.5 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all',
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
          <Route index                element={<StrategyOverview />} />
          <Route path="pillars"       element={<PillarsPage />}      />
          <Route path="pillars/:id"   element={<PillarsPage />}      />
          <Route path="okrs"          element={<OKRsPage />}         />
          <Route path="portfolio"     element={<PortfolioMap />}     />
          <Route path="*"             element={<Navigate to="/kangqore-view/admin/strategy" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
