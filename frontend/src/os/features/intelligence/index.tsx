// Intelligence OS — 4-layer Enterprise Brain dashboard
// Layer 1: Descriptive — "What is happening?"
// Layer 2: Predictive  — "What will happen?"
// Layer 3: Prescriptive — "What should happen?"
// Layer 4: Autonomous  — "Execute it."

import { useLocation, Routes, Route, NavLink } from 'react-router-dom'
import { Eye, TrendingUp, Lightbulb, Zap } from 'lucide-react'
import { cn } from '@design-system/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { DescriptivePage } from './pages/DescriptivePage'
import { PredictivePage } from './pages/PredictivePage'
import { PrescriptivePage } from './pages/PrescriptivePage'
import { AutonomousPage } from './pages/AutonomousPage'

const BASE = '/kangqore-view/admin/intelligence'

const TABS = [
  { path: '',           label: 'What is happening?',  icon: Eye,        sub: 'Descriptive'  },
  { path: 'predictive', label: 'What will happen?',   icon: TrendingUp, sub: 'Predictive'   },
  { path: 'prescriptive',label: 'What should happen?',icon: Lightbulb,  sub: 'Prescriptive' },
  { path: 'autonomous', label: 'Execute it.',          icon: Zap,        sub: 'Autonomous'   },
]

export function IntelligenceModule() {
  const { pathname } = useLocation()

  return (
    <div>
      <div className="mb-6 -mt-2">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl font-semibold text-[var(--os-text-1)]">Intelligence OS</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#579bfc]/10 text-[#579bfc] font-medium">Enterprise Brain</span>
        </div>
        <div className="flex items-center gap-0.5 border-b border-[var(--os-border)]">
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path === '' ? BASE : `${BASE}/${tab.path}`}
              end={tab.path === ''}
              className={({ isActive }) => cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
                isActive
                  ? 'border-[#579bfc] text-[#579bfc]'
                  : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.sub}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>
          <Routes>
            <Route index               element={<DescriptivePage />}  />
            <Route path="predictive"   element={<PredictivePage />}   />
            <Route path="prescriptive" element={<PrescriptivePage />} />
            <Route path="autonomous"   element={<AutonomousPage />}   />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
