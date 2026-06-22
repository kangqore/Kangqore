import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { LayoutDashboard, Layers, Cpu, Briefcase, FileText } from 'lucide-react'
import { cn } from '@design-system/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { BidsOverviewPage }  from './pages/BidsOverviewPage'
import { PillarsPage }       from './pages/PillarsPage'
import { EnginesPage }       from './pages/EnginesPage'
import { EngagementsPage }   from './pages/EngagementsPage'
import { DeliverablesPage }  from './pages/DeliverablesPage'

const BASE = '/kangqore-view/admin/bids'

const TABS = [
  { path: '',              label: 'Overview',     icon: LayoutDashboard, end: true  },
  { path: 'pillars',       label: 'Pillars (16)', icon: Layers,          end: false },
  { path: 'engines',       label: 'Engines (6)',  icon: Cpu,             end: false },
  { path: 'engagements',   label: 'Engagements',  icon: Briefcase,       end: false },
  { path: 'deliverables',  label: 'Deliverables', icon: FileText,        end: false },
]

export function BidsModule() {
  const { pathname } = useLocation()

  return (
    <div className="space-y-0">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-white/10 mb-8 mt-1 overflow-x-auto">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? BASE : `${BASE}/${tab.path}`}
            end={tab.end}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap',
              isActive
                ? 'border-os-blue text-os-blue'
                : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-white/10'
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
            <Route index                  element={<BidsOverviewPage />}  />
            <Route path="pillars"         element={<PillarsPage />}       />
            <Route path="engines"         element={<EnginesPage />}       />
            <Route path="engagements"     element={<EngagementsPage />}   />
            <Route path="deliverables"    element={<DeliverablesPage />}  />
            <Route path="*"               element={<Navigate to={BASE} replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
