import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Network, Zap, ArrowLeftRight } from 'lucide-react'
import { cn } from '@design-system/cn'
import { ConnectorsPage }  from './pages/ConnectorsPage'
import { SignalFeedPage }  from './pages/SignalFeedPage'

const BASE = '/kangqore-view/admin/connect'

const TABS = [
  { path: '',        end: true,  label: 'Connectors',   icon: Network        },
  { path: 'signals', end: false, label: 'Signal Feed',  icon: Zap            },
]

// Live stats shown in the module header
const LIVE_STATS = [
  { label: 'Connected',   value: '5',  color: '#00c875' },
  { label: 'Signals / 6h', value: '131', color: '#2564ea' },
  { label: 'Promoted',    value: '3',  color: '#e2445c' },
]

export function KangqoreConnectModule() {
  const { pathname } = useLocation()

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(37,100,234,0.12)', border: '1px solid rgba(37,100,234,0.25)' }}>
              <ArrowLeftRight style={{ width: 14, height: 14, color: '#60a5fa' }} />
            </div>
            <h1 className="text-lg font-bold text-white leading-none">Kangqore Connect</h1>
          </div>
          <p className="text-xs text-slate-500">
            Signal ingestion layer — every enterprise tool becomes a KIMMP intelligence source.
            Don't rip out ServiceNow. Add Kangqore above it.
          </p>
        </div>

        {/* Live stats */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl flex-shrink-0"
          style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          {LIVE_STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              {i > 0 && <div className="w-px h-3 bg-[#2E2854]" />}
              <div className="text-center">
                <p className="text-sm font-bold tabular-nums leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[9px] text-slate-700 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
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
        <motion.div key={pathname}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}>
          <Routes>
            <Route index             element={<ConnectorsPage />} />
            <Route path="signals"    element={<SignalFeedPage />}  />
            <Route path="*"          element={<Navigate to={BASE} replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
