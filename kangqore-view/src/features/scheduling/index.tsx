import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import {
  CalendarDays, Clock, Layers, Users, BarChart2, GitBranch, ScrollText,
} from 'lucide-react'
import { cn } from '@design-system/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { BookingsPage }       from './pages/BookingsPage'
import { AvailabilityPage }   from './pages/AvailabilityPage'
import { EventTypesPage }     from './pages/EventTypesPage'
import { TeamSchedulingPage } from './pages/TeamSchedulingPage'
import { AnalyticsPage }      from './pages/AnalyticsPage'
import { WorkflowsPage }      from './pages/WorkflowsPage'
import { AuditLogPage }       from './pages/AuditLogPage'

const BASE = '/kangqore-view/admin/scheduling'

const TABS = [
  { path: '',           label: 'Bookings',    icon: CalendarDays, end: true },
  { path: 'availability', label: 'Availability', icon: Clock       },
  { path: 'event-types',  label: 'Event Types',  icon: Layers      },
  { path: 'team',          label: 'Team',          icon: Users       },
  { path: 'analytics',     label: 'Analytics',     icon: BarChart2   },
  { path: 'workflows',     label: 'Workflows',     icon: GitBranch   },
  { path: 'audit-log',     label: 'Audit Log',     icon: ScrollText  },
]

export function SchedulingModule() {
  const { pathname } = useLocation()

  return (
    <div>
      <div className="mb-6 -mt-2">
        <h1 className="text-lg font-bold text-white mb-4">Scheduling</h1>
        <div className="flex items-center gap-1 border-b border-os-border overflow-x-auto pb-px">
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path ? `${BASE}/${tab.path}` : BASE}
              end={tab.end}
              className={({ isActive }) => cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap',
                isActive
                  ? 'border-os-blue text-os-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-os-border'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </NavLink>
          ))}
        </div>
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
            <Route index                     element={<BookingsPage />}       />
            <Route path="availability"       element={<AvailabilityPage />}   />
            <Route path="event-types"        element={<EventTypesPage />}     />
            <Route path="team"               element={<TeamSchedulingPage />} />
            <Route path="analytics"          element={<AnalyticsPage />}      />
            <Route path="workflows"          element={<WorkflowsPage />}      />
            <Route path="audit-log"          element={<AuditLogPage />}       />
            <Route path="*"                  element={<Navigate to={BASE} replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
