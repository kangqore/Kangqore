import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { AlertTriangle, Link2, Target, Share2, GitCommit, Brain } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@design-system/cn'
import { IssuesFeedPage }   from './pages/IssuesFeedPage'
import { RootCausePage }    from './pages/RootCausePage'
import { CommitmentsPage }  from './pages/CommitmentsPage'
import { EntityGraphPage }  from './pages/EntityGraphPage'
import { ChangeLogPage }    from './pages/ChangeLogPage'

const BASE = '/kangqore-view/admin/ops-centre'

const TABS = [
  { path: '',            end: true,  label: 'Issues',       icon: AlertTriangle },
  { path: 'root-cause',  end: false, label: 'Root Cause',   icon: Link2         },
  { path: 'commitments', end: false, label: 'Commitments',  icon: Target        },
  { path: 'entities',    end: false, label: 'Entity Graph', icon: Share2        },
  { path: 'changes',     end: false, label: 'Change Log',   icon: GitCommit     },
]

const SIGNAL_PYRAMID = [
  { level: 'L5', label: 'Decisions',    count: 3,   color: '#e2445c' },
  { level: 'L4', label: 'Intelligence', count: 12,  color: '#fdab3d' },
  { level: 'L3', label: 'Correlations', count: 4,   color: '#7f53f9' },
  { level: 'L2', label: 'Signals',      count: 47,  color: '#2564ea' },
  { level: 'L1', label: 'Raw Events',   count: 312, color: '#475569' },
]

export function OpsCentreModule() {
  const { pathname } = useLocation()

  return (
    <div>
      {/* Header with Signal Pyramid */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-white">Operations Centre</h1>
          <p className="text-xs text-slate-500 mt-0.5">Business Operations Intelligence — powered by KIMMP</p>
        </div>

        {/* Signal Pyramid widget */}
        <div className="flex-shrink-0 flex items-end gap-1 px-4 py-2.5 rounded-xl"
          style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
          <Brain className="w-3.5 h-3.5 text-purple-400 mb-1 mr-1" />
          {SIGNAL_PYRAMID.map((lvl, i) => (
            <div key={lvl.level} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold tabular-nums" style={{ color: lvl.color }}>{lvl.count}</span>
              <div className="rounded-sm" style={{
                width: 20 + i * 6,
                height: 6,
                background: lvl.color,
                opacity: 0.7 + i * 0.06,
              }} />
              <span className="text-[8px] text-slate-700">{lvl.level}</span>
            </div>
          ))}
          <span className="text-[9px] text-slate-600 mb-1 ml-1">KIMMP Signal Pyramid</span>
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
            <Route index               element={<IssuesFeedPage />}  />
            <Route path="root-cause"   element={<RootCausePage />}   />
            <Route path="commitments"  element={<CommitmentsPage />}  />
            <Route path="entities"     element={<EntityGraphPage />}  />
            <Route path="changes"      element={<ChangeLogPage />}    />
            <Route path="*"            element={<Navigate to={BASE} replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
