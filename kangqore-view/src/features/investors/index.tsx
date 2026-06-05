import { useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, PieChart, Send, UserCircle } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useInvestorsStore } from './store'
import type { Investor, InvestorUpdate } from './types'
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

// Map a DB User (INVESTOR role) to the frontend Investor shape.
// Fields not stored in the DB keep their mock defaults via the store initial state.
function toInvestor(u: Record<string, unknown>): Investor {
  return {
    id:             String(u.id ?? ''),
    name:           String(u.name ?? ''),
    firm:           String(u.company ?? ''),
    type:           'vc',
    status:         u.status === 'active' ? 'committed' : 'prospect',
    email:          String(u.email ?? ''),
    phone:          u.phone ? String(u.phone) : undefined,
    country:        'UK',
    checkSize:      { min: 0, max: 0 },
    preferredStage: [],
    portfolio:      0,
    leadInvestor:   false,
    committed:      0,
    lastContact:    String((u.lastLoginAt ?? u.createdAt) ?? new Date().toISOString()).slice(0, 10),
    tags:           [],
    notes:          '',
  }
}

// Map a DB InvestorUpdate to the frontend InvestorUpdate shape.
// The DB model is simpler — metrics/highlights default to empty values.
function toUpdate(u: Record<string, unknown>): InvestorUpdate {
  const validTypes = ['monthly', 'quarterly', 'milestone', 'ad-hoc'] as const
  const rawType = String(u.type ?? 'ad-hoc')
  const type = (validTypes as readonly string[]).includes(rawType)
    ? rawType as InvestorUpdate['type']
    : 'ad-hoc'

  return {
    id:         String(u.id ?? ''),
    type,
    title:      String(u.title ?? ''),
    period:     String(u.createdAt ?? '').slice(0, 7),
    sentDate:   String(u.createdAt ?? new Date().toISOString()).slice(0, 10),
    metrics:    { mrr: 0, mrrGrowth: 0, arr: 0, customers: 0, nrr: 0, runway: 0, headcount: 0, cashOnHand: 0 },
    highlights: u.content ? [String(u.content)] : [],
    challenges: [],
    askItems:   [],
  }
}

export function InvestorsModule() {
  const { hydrateInvestors, hydrateUpdates } = useInvestorsStore()

  const { data: investorsData } = useQuery({
    queryKey: ['admin', 'investors'],
    queryFn:  () => api.get('/admin/investors').then(r => r.data.investors ?? []),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: updatesData } = useQuery({
    queryKey: ['admin', 'investors', 'updates'],
    queryFn:  () => api.get('/admin/investors/updates').then(r => r.data.updates ?? []),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (investorsData?.length) {
      hydrateInvestors((investorsData as Record<string, unknown>[]).map(toInvestor))
    }
  }, [investorsData, hydrateInvestors])

  useEffect(() => {
    if (updatesData?.length) {
      hydrateUpdates((updatesData as Record<string, unknown>[]).map(toUpdate))
    }
  }, [updatesData, hydrateUpdates])

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
