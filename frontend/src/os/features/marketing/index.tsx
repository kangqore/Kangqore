import { useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useMarketingStore } from './store'
import { MarketingOverview } from './pages/MarketingOverview'

const TABS = [
  { path: '', label: 'Overview', icon: LayoutGrid },
]

export function MarketingModule() {
  const hydrate = useMarketingStore(s => s.hydrate)

  const { data } = useQuery({
    queryKey: ['marketing'],
    queryFn: () => api.get('/marketing').then(r => r.data),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (data?.campaigns?.length) hydrate(data)
  }, [data, hydrate])

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to="/kangqore-view/marketing"
            end
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
        <Route index  element={<MarketingOverview />} />
        <Route path="*" element={<Navigate to="/kangqore-view/marketing" replace />} />
      </Routes>
    </div>
  )
}
