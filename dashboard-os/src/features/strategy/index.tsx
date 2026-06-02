import { useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Target, LayoutDashboard, TrendingUp, Map } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useStrategyStore } from './store'
import { StrategyOverview } from './pages/StrategyOverview'
import { PillarsPage } from './pages/PillarsPage'
import { OKRsPage } from './pages/OKRsPage'
import { PortfolioMap } from './pages/PortfolioMap'

const TABS = [
  { path: '',          label: 'Overview',  icon: Target          },
  { path: 'pillars',   label: 'Pillars',   icon: LayoutDashboard },
  { path: 'okrs',      label: 'OKRs',      icon: TrendingUp      },
  { path: 'portfolio', label: 'Portfolio', icon: Map             },
]

export function StrategyModule() {
  const { hydrate } = useStrategyStore()

  const { data } = useQuery({
    queryKey: ['strategy'],
    queryFn:  () => api.get('/strategy').then(r => r.data),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (data?.pillars?.length) hydrate(data)
  }, [data, hydrate])

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-2 border-b border-slate-200 mb-8 mt-1">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/strategy' : `/os/strategy/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2.5 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all',
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
        <Route index                element={<StrategyOverview />} />
        <Route path="pillars"       element={<PillarsPage />}      />
        <Route path="pillars/:id"   element={<PillarsPage />}      />
        <Route path="okrs"          element={<OKRsPage />}         />
        <Route path="portfolio"     element={<PortfolioMap />}     />
        <Route path="*"             element={<Navigate to="/os/strategy" replace />} />
      </Routes>
    </div>
  )
}
