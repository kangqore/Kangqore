import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutDashboard, FileText, PieChart, TrendingDown, Receipt, AlertOctagon, RefreshCw, Brain, AlertTriangle } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { toInvoices } from '@lib/transforms'
import { useFinanceStore } from './store'
import { useFinanceProjection } from './useFinanceProjection'
import { FinanceOverview }  from './pages/FinanceOverview'
import { InvoicesPage }     from './pages/InvoicesPage'
import { BudgetTracker }    from './pages/BudgetTracker'
import { BurnRatePage }     from './pages/BurnRatePage'
import { ExpensesPage }     from './pages/ExpensesPage'
import { CollectionsPage }  from './pages/CollectionsPage'
import { RecurringBilling } from './pages/RecurringBilling'
import { AnimatePresence, motion } from 'framer-motion'

// ── Gen III: WAANDA Finance Intelligence banner ──────────────────────────────
// Constitutional Law 3: reads only from WEE ExperienceModel — never fetches directly.
function WANDAFinanceIntelligence() {
  const model = useFinanceProjection()
  if (!model || model.confidence < 0.1) return null

  const payload     = model.payload as Record<string, any>
  const phase       = model.cognitivePhase
  const cashSignal  = payload.cashSignal as string | null
  const overdueCount = (payload.overdueInvoices ?? 0) as number
  const burnPct     = (payload.burnPct ?? 0) as number
  const atRisk      = (payload.atRiskCount ?? 0) as number

  const PHASE_COLOR: Record<string, string> = {
    OBSERVE: '#3b82f6', UNDERSTAND: '#7c3aed', DECIDE: '#f59e0b',
    ACT: '#10b981', LEARN: '#0d9488',
  }
  const col = PHASE_COLOR[phase] ?? '#3b82f6'

  const insight = cashSignal
    ?? model.payload.kimmSynthesis as string | null

  const showBanner = !!insight || overdueCount > 0 || burnPct > 80
  if (!showBanner) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 14px', marginBottom: 10,
      background: col + '08', border: `1px solid ${col}20`, borderRadius: 8,
    }}>
      <Brain size={12} style={{ color: col, flexShrink: 0 }} />
      <span style={{
        fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em',
        color: col, background: col + '15', padding: '2px 7px', borderRadius: 4, flexShrink: 0,
      }}>
        WAANDA · {phase}
      </span>
      {insight && (
        <span style={{ fontSize: 11, color: 'var(--os-text-3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {(insight as string).slice(0, 130)}{(insight as string).length > 130 ? '…' : ''}
        </span>
      )}
      {overdueCount > 0 && (
        <span style={{
          display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
          fontSize: 10, fontWeight: 700, color: '#ef4444',
          background: '#ef444410', border: '1px solid #ef444425',
          padding: '2px 8px', borderRadius: 4,
        }}>
          <AlertTriangle size={9} />
          {overdueCount} overdue
        </span>
      )}
      {burnPct > 80 && (
        <span style={{
          display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
          fontSize: 10, fontWeight: 700, color: '#f59e0b',
          background: '#f59e0b10', border: '1px solid #f59e0b25',
          padding: '2px 8px', borderRadius: 4,
        }}>
          {burnPct}% burn
        </span>
      )}
      {atRisk > 0 && (
        <span style={{
          display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
          fontSize: 10, fontWeight: 700, color: '#f59e0b',
          background: '#f59e0b10', border: '1px solid #f59e0b25',
          padding: '2px 8px', borderRadius: 4,
        }}>
          {atRisk} at-risk projects
        </span>
      )}
    </div>
  )
}

const TABS = [
  { path: '',           label: 'Overview',    icon: LayoutDashboard },
  { path: 'invoices',   label: 'Invoices',    icon: FileText        },
  { path: 'expenses',   label: 'Expenses',    icon: Receipt         },
  { path: 'collections',label: 'Collections', icon: AlertOctagon    },
  { path: 'recurring',  label: 'Recurring',   icon: RefreshCw       },
  { path: 'budget',     label: 'Budget',      icon: PieChart        },
  { path: 'burn',       label: 'Burn Rate',   icon: TrendingDown    },
]

export function FinanceModule() {
  const { hydrateInvoices } = useFinanceStore()
  const { data } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get('/invoices').then(r => r.data.invoices ?? []),
    staleTime: 1000 * 60 * 5,
    enabled: !isDemo(),
  })
  useEffect(() => { if (data !== undefined) hydrateInvoices(toInvoices(data)) }, [data, hydrateInvoices])

  const { pathname } = useLocation()

  return (
    <div>
      <WANDAFinanceIntelligence />
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--os-border)', marginBottom: 24, marginTop: -8, overflowX: 'auto' }}>
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/finance' : `/kangqore-view/admin/finance/${tab.path}`}
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
            <Route index               element={<FinanceOverview />}  />
            <Route path="invoices"     element={<InvoicesPage />}     />
            <Route path="expenses"     element={<ExpensesPage />}     />
            <Route path="collections"  element={<CollectionsPage />}  />
            <Route path="recurring"    element={<RecurringBilling />} />
            <Route path="budget"       element={<BudgetTracker />}    />
            <Route path="burn"         element={<BurnRatePage />}     />
            <Route path="*"            element={<Navigate to="/kangqore-view/admin/finance" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
