import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { PlugsConnected, Plugs, Activity, Sliders } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@design-system/cn'
import { ConnectorsPage }  from './pages/ConnectorsPage'
import { SignalsPage }     from './pages/SignalsPage'
import { MappingsPage }    from './pages/MappingsPage'

const BASE = '/kangqore-view/admin/connect'

const TABS = [
  { path: '',           end: true,  label: 'Connectors',    icon: PlugsConnected },
  { path: 'signals',    end: false, label: 'Live Signals',  icon: Activity       },
  { path: 'mappings',   end: false, label: 'Mappings',      icon: Sliders        },
]

const LIVE_STATS = [
  { label: 'Active Connectors', value: '3',      color: '#10B981' },
  { label: 'Signals Today',     value: '1,847',  color: '#2564ea' },
  { label: 'KIMMP Correlations',value: '47',     color: '#7f53f9' },
  { label: 'Pending Setup',     value: '9',      color: '#F59E0B' },
]

export function ConnectModule() {
  const { pathname } = useLocation()

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-white">Kangqore Connect</h1>
          <p className="text-xs text-slate-500 mt-0.5">Signal ingestion layer — every tool becomes a KIMMP data source</p>
        </div>

        {/* Live stat pills */}
        <div className="flex-shrink-0 flex items-center gap-3">
          {LIVE_STATS.map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-end">
              <span className="text-sm font-bold tabular-nums" style={{ color }}>{value}</span>
              <span className="text-[9px] text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-white/10 mb-6 -mt-1">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? BASE : `${BASE}/${tab.path}`}
            end={tab.end}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
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
        <motion.div key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15, ease: 'easeOut' }}>
          <Routes>
            <Route index              element={<ConnectorsPage />} />
            <Route path="signals"     element={<SignalsPage />}    />
            <Route path="mappings"    element={<MappingsPage />}   />
            <Route path="*"           element={<Navigate to={BASE} replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
