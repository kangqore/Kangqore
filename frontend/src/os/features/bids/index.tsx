import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { LayoutDashboard, Layers, Cpu, Briefcase, FileText, ShieldCheck } from 'lucide-react'
import { cn } from '@design-system/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { BidsOverviewPage }      from './pages/BidsOverviewPage'
import { PillarsPage }            from './pages/PillarsPage'
import { EnginesPage }            from './pages/EnginesPage'
import { EngagementsPage }        from './pages/EngagementsPage'
import { DeliverablesPage }       from './pages/DeliverablesPage'
import { BidsConsultantPage }     from './pages/BidsConsultantPage'
import { BidsCompletenessPage }   from './pages/BidsCompletenessPage'

const BASE = '/kangqore-view/admin/bids'

const TABS = [
  { path: '',               label: 'Overview',      icon: LayoutDashboard, end: true  },
  { path: 'pillars',        label: 'Pillars (16)',  icon: Layers,          end: false },
  { path: 'engines',        label: 'Engines (6)',   icon: Cpu,             end: false },
  { path: 'engagements',    label: 'Engagements',   icon: Briefcase,       end: false },
  { path: 'deliverables',   label: 'Deliverables',  icon: FileText,        end: false },
  { path: 'completeness',   label: 'Completeness',  icon: ShieldCheck,     end: false },
]

export function BidsModule() {
  const { pathname } = useLocation()
  const isDetail = /\/engagements\/[^/]+/.test(pathname)

  return (
    <div className="space-y-0">
      {/* Tab bar — hidden on engagement detail page */}
      <div className={`flex items-center gap-0 border-b border-[var(--os-border)] mb-8 mt-1 overflow-x-auto${isDetail ? ' hidden' : ''}`}>
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? BASE : `${BASE}/${tab.path}`}
            end={tab.end}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap',
              isActive
                ? 'border-[#579bfc] text-[#579bfc]'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:border-[var(--os-border)]'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <Routes>
            <Route index                          element={<BidsOverviewPage />}     />
            <Route path="pillars"                 element={<PillarsPage />}          />
            <Route path="engines"                 element={<EnginesPage />}          />
            <Route path="engagements"             element={<EngagementsPage />}      />
            <Route path="engagements/:id"         element={<BidsConsultantPage />}   />
            <Route path="deliverables"            element={<DeliverablesPage />}     />
            <Route path="completeness"            element={<BidsCompletenessPage />}  />
            <Route path="*"                       element={<Navigate to={BASE} replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
