import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'
import { cn } from '@design-system/cn'
import { AnalyticsOverview } from './pages/AnalyticsOverview'
import { AnimatePresence, motion } from 'framer-motion'

const TABS = [
  { path: '', label: 'Overview', icon: BarChart3 },
]

export function AnalyticsModule() {
  const { pathname } = useLocation()

  return (
    <div>
      <div className="flex items-center gap-0.5 border-b border-[var(--os-border)] mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to="/kangqore-view/admin/analytics"
            end
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
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
        <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>

        <Routes>
          <Route index  element={<AnalyticsOverview />} />
          <Route path="*" element={<Navigate to="/kangqore-view/admin/analytics" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
