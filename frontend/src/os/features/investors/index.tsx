import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, PieChart, Send, UserCircle } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useInvestorsStore } from './store'
import type { Investor, InvestorUpdate, CapTable, FundraisingRound } from './types'
import { InvestorsOverview } from './pages/InvestorsOverview'
import { CapTablePage }      from './pages/CapTablePage'
import { UpdatesPage }       from './pages/UpdatesPage'
import { InvestorProfile }   from './pages/InvestorProfile'
import { AnimatePresence, motion } from 'framer-motion'

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

function toCapTable(r: Record<string, unknown>): CapTable {
  return {
    id:           String(r.id ?? ''),
    investorId:   String(r.id ?? ''),   // no FK — use record id as stable ref
    investorName: String(r.investorName ?? ''),
    firm:         String(r.firm ?? ''),
    round:        (r.round as CapTable['round']) ?? 'seed',
    amount:       Number(r.amount ?? 0),
    ownership:    Number(r.ownership ?? 0),
    shareClass:   String(r.shareClass ?? 'Ordinary'),
    date:         String(r.date ?? '').slice(0, 10),
    proRataRights: Boolean(r.proRataRights),
    boardSeat:     Boolean(r.boardSeat),
  }
}

function toRound(r: Record<string, unknown>): FundraisingRound {
  return {
    id:              String(r.id ?? ''),
    name:            String(r.name ?? ''),
    stage:           (r.stage as FundraisingRound['stage']) ?? 'seed',
    targetAmount:    Number(r.targetAmount ?? 0),
    raisedAmount:    Number(r.raisedAmount ?? 0),
    status:          (r.status as FundraisingRound['status']) ?? 'planning',
    openDate:        String(r.openDate  ?? '').slice(0, 10),
    closeDate:       r.closeDate ? String(r.closeDate).slice(0, 10) : undefined,
    leadInvestorId:  r.leadInvestorName ? String(r.leadInvestorName) : undefined,
    investors:       Array.isArray(r.investorNames) ? r.investorNames as string[] : [],
    useOfFunds:      Array.isArray(r.useOfFunds)    ? r.useOfFunds    as FundraisingRound['useOfFunds'] : [],
    valuation:       Number(r.valuation ?? 0),
  }
}

export function InvestorsModule() {
  const { hydrateInvestors, hydrateUpdates, hydrateCapTable, hydrateRounds } = useInvestorsStore()

  const { data: investorsData } = useQuery({ queryKey: ['admin','investors'],         queryFn: () => api.get('/admin/investors').then(r => r.data.investors ?? []),                enabled: !isDemo(), staleTime: 1000*60*5 })
  const { data: updatesData }   = useQuery({ queryKey: ['admin','investors','updates'],queryFn: () => api.get('/admin/investors/updates').then(r => r.data.updates ?? []),          enabled: !isDemo(), staleTime: 1000*60*5 })
  const { data: ctData }        = useQuery({ queryKey: ['admin','crm','cap-table'],    queryFn: () => api.get('/admin/crm/cap-table').then(r => r.data.capTable ?? []),              enabled: !isDemo(), staleTime: 1000*60*10 })
  const { data: rnData }        = useQuery({ queryKey: ['admin','crm','rounds'],       queryFn: () => api.get('/admin/crm/fundraising-rounds').then(r => r.data.rounds ?? []),      enabled: !isDemo(), staleTime: 1000*60*10 })

  useEffect(() => { if (investorsData?.length) hydrateInvestors((investorsData as Record<string,unknown>[]).map(toInvestor)) }, [investorsData, hydrateInvestors])
  useEffect(() => { if (updatesData?.length)   hydrateUpdates((updatesData as Record<string,unknown>[]).map(toUpdate))       }, [updatesData,   hydrateUpdates])
  useEffect(() => { if (ctData?.length)        hydrateCapTable((ctData as Record<string,unknown>[]).map(toCapTable))         }, [ctData,         hydrateCapTable])
  useEffect(() => { if (rnData?.length)        hydrateRounds((rnData as Record<string,unknown>[]).map(toRound))              }, [rnData,         hydrateRounds])

  const { pathname } = useLocation()

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-os-border mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/investors' : `/kangqore-view/admin/investors/${tab.path}`}
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
          <Route index              element={<InvestorsOverview />} />
          <Route path="captable"    element={<CapTablePage />}      />
          <Route path="updates"     element={<UpdatesPage />}       />
          <Route path="profile"     element={<InvestorProfile />}   />
          <Route path="*"           element={<Navigate to="/kangqore-view/admin/investors" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
