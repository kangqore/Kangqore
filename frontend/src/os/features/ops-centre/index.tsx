import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { AlertTriangle, Link2, Target, Share2, GitCommit, Brain, Siren, Bug, Server, GitMerge } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@design-system/cn'
import { IssuesFeedPage }   from './pages/IssuesFeedPage'
import { RootCausePage }    from './pages/RootCausePage'
import { CommitmentsPage }  from './pages/CommitmentsPage'
import { EntityGraphPage }  from './pages/EntityGraphPage'
import { ChangeLogPage }    from './pages/ChangeLogPage'
import { IncidentLog }      from './pages/IncidentLog'
import { ProblemRegistry }  from './pages/ProblemRegistry'
import { CMDBPage }         from './pages/CMDBPage'
import { ChangePipeline }   from './pages/ChangePipeline'

const BASE = '/kangqore-view/admin/ops-centre'

const TABS = [
  { path: '',            end: true,  label: 'Issues',       icon: AlertTriangle },
  { path: 'root-cause',  end: false, label: 'Root Cause',   icon: Link2         },
  { path: 'commitments', end: false, label: 'Commitments',  icon: Target        },
  { path: 'entities',    end: false, label: 'Entity Graph', icon: Share2        },
  { path: 'changes',     end: false, label: 'Change Log',   icon: GitCommit     },
  { path: 'incidents',   end: false, label: 'Incidents',    icon: Siren         },
  { path: 'problems',    end: false, label: 'Problems',     icon: Bug           },
  { path: 'cmdb',        end: false, label: 'CMDB',         icon: Server        },
  { path: 'change-pipeline', end: false, label: 'Changes',  icon: GitMerge      },
]

const SIGNAL_PYRAMID = [
  { level: 'L5', label: 'Decisions',    count: 3,   color: '#e2445c' },
  { level: 'L4', label: 'Intelligence', count: 12,  color: '#fdab3d' },
  { level: 'L3', label: 'Correlations', count: 4,   color: '#7c3aed' },
  { level: 'L2', label: 'Signals',      count: 47,  color: '#579bfc' },
  { level: 'L1', label: 'Raw Events',   count: 312, color: 'var(--os-text-2)' },
]

export function OpsCentreModule() {
  const { pathname } = useLocation()

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Operations Centre</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-3)' }}>Business Operations Intelligence — powered by KIMMP</p>
        </div>

        {/* Signal Pyramid widget */}
        <div className="flex-shrink-0 flex items-end gap-1 px-4 py-2.5 rounded-xl"
          style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
          <Brain className="w-3.5 h-3.5 mb-1 mr-1" style={{ color: '#7c3aed' }} />
          {SIGNAL_PYRAMID.map((lvl, i) => (
            <div key={lvl.level} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold tabular-nums" style={{ color: lvl.color }}>{lvl.count}</span>
              <div className="rounded-sm" style={{
                width: 20 + i * 6,
                height: 6,
                background: lvl.color,
                opacity: 0.7 + i * 0.06,
              }} />
              <span className="text-[8px]" style={{ color: 'var(--os-text-3)' }}>{lvl.level}</span>
            </div>
          ))}
          <span className="text-[9px] mb-1 ml-1" style={{ color: 'var(--os-text-3)' }}>KIMMP Signal Pyramid</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-[var(--os-border)] mb-6 -mt-1">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? BASE : `${BASE}/${tab.path}`}
            end={tab.end}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap',
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
        <motion.div key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15, ease: 'easeOut' }}>
          <Routes>
            <Route index                    element={<IssuesFeedPage />}   />
            <Route path="root-cause"        element={<RootCausePage />}    />
            <Route path="commitments"       element={<CommitmentsPage />}   />
            <Route path="entities"          element={<EntityGraphPage />}   />
            <Route path="changes"           element={<ChangeLogPage />}     />
            <Route path="incidents"         element={<IncidentLog />}       />
            <Route path="problems"          element={<ProblemRegistry />}   />
            <Route path="cmdb"              element={<CMDBPage />}          />
            <Route path="change-pipeline"   element={<ChangePipeline />}    />
            <Route path="*"                 element={<Navigate to={BASE} replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
