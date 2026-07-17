import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { BarChart3, TrendingUp, Radio, Layers, Cpu, Bot } from 'lucide-react'
import { cn } from '@design-system/cn'
import { AnalyticsOverview } from './pages/AnalyticsOverview'
import { OISTrendPage } from './pages/OISTrendPage'
import { WANDAActivityPage } from './pages/WANDAActivityPage'
import { ModulePerformancePage } from './pages/ModulePerformancePage'
import { DigitalTwinPage } from './pages/DigitalTwinPage'
import { AgentPerformancePage } from './pages/AgentPerformancePage'
import { AnimatePresence, motion } from 'framer-motion'

const BASE = '/kangqore-view/admin/analytics'

const TABS = [
  { path: '',         label: 'Overview',           icon: BarChart3  },
  { path: 'ois',      label: 'OIS Trend',          icon: TrendingUp },
  { path: 'waanda',   label: 'WAANDA Activity',    icon: Radio      },
  { path: 'modules',  label: 'Module Performance', icon: Layers     },
  { path: 'twin',     label: 'Digital Twin™',      icon: Cpu        },
  { path: 'agents',   label: 'Agent Performance',  icon: Bot        },
]

export function AnalyticsModule() {
  const { pathname } = useLocation()

  return (
    <div>
      <div className="flex items-center gap-0.5 border-b border-[var(--os-border)] mb-6 -mt-2">
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
            {tab.label}
          </NavLink>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>

        <Routes>
          <Route index                 element={<AnalyticsOverview />}  />
          <Route path="ois"            element={<OISTrendPage />}        />
          <Route path="waanda"         element={<WANDAActivityPage />}    />
          <Route path="modules"        element={<ModulePerformancePage />} />
          <Route path="twin"           element={<DigitalTwinPage />}       />
          <Route path="agents"         element={<AgentPerformancePage />}  />
          <Route path="*"              element={<Navigate to={BASE} replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
