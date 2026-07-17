import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, Megaphone, Calendar, BarChart2 } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useMarketingStore } from './store'
import { MarketingOverview } from './pages/MarketingOverview'
import { CampaignsPage }    from './pages/CampaignsPage'
import { ContentCalendar }  from './pages/ContentCalendar'
import { LeadAttribution }  from './pages/LeadAttribution'
import { CAMPAIGNS, CONTENT_PIECES, MONTHLY_METRICS } from './data'
import { AnimatePresence, motion } from 'framer-motion'

const TABS = [
  { path: '',            label: 'Overview',    icon: LayoutGrid },
  { path: 'campaigns',   label: 'Campaigns',   icon: Megaphone  },
  { path: 'content',     label: 'Content',     icon: Calendar   },
  { path: 'attribution', label: 'Attribution', icon: BarChart2  },
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
    if (isDemo()) {
      hydrate({ campaigns: CAMPAIGNS, content: CONTENT_PIECES, metrics: MONTHLY_METRICS })
    } else if (data !== undefined) {
      hydrate(data)
    } else {
      hydrate({ campaigns: CAMPAIGNS, content: CONTENT_PIECES, metrics: MONTHLY_METRICS })
    }
  }, [data, hydrate])

  const { pathname } = useLocation()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--os-border)', marginBottom: 24, marginTop: -8, overflowX: 'auto' }}>
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/marketing' : `/kangqore-view/admin/marketing/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap',
              isActive
                ? 'border-[#579bfc] text-[#579bfc]'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15, ease: 'easeOut' }}>
          <Routes>
            <Route index                   element={<MarketingOverview />} />
            <Route path="campaigns"        element={<CampaignsPage />}    />
            <Route path="content"          element={<ContentCalendar />}  />
            <Route path="attribution"      element={<LeadAttribution />}  />
            <Route path="*"                element={<Navigate to="/kangqore-view/admin/marketing" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
