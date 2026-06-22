import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import {
  Brain, TrendingUp, BookOpen, Satellite, Bell, Activity,
  Search, Target, FileText, UserCheck, CheckSquare, Newspaper,
} from 'lucide-react'
import { cn } from '@design-system/cn'
import { getSocket } from '@lib/socket'
import { isDemo } from '@lib/api'
import { useKIMMPStore, toInsight } from '@store/kimmp'
import { BriefingPage }  from './pages/BriefingPage'
import { KIMMMPage }    from './pages/KIMMPPage'
import { ForecastPage } from './pages/ForecastPage'
import { MemoryPage }   from './pages/MemoryPage'
import { ScoutPage }    from './pages/ScoutPage'
import { AlertsPage }   from './pages/AlertsPage'
import { SignalsPage }  from './pages/SignalsPage'
import { ResearchPage } from './pages/ResearchPage'
import { GoalsPage }    from './pages/GoalsPage'
import { ReportsPage }  from './pages/ReportsPage'
import { BehaviorPage } from './pages/BehaviorPage'
import { ActionsPage }   from './pages/ActionsPage'
import { AnimatePresence, motion } from 'framer-motion'

const BASE = '/kangqore-view/admin/kangqore-immp'

const TABS = [
  { path: 'briefing',  end: false, label: 'Briefing',     icon: Newspaper   },
  { path: '',          end: true,  label: 'Intelligence', icon: Brain       },
  { path: 'forecast',  end: false, label: 'Forecast',     icon: TrendingUp  },
  { path: 'memory',    end: false, label: 'Memory',       icon: BookOpen    },
  { path: 'goals',     end: false, label: 'Goals',        icon: Target      },
  { path: 'alerts',    end: false, label: 'Alerts',       icon: Bell        },
  { path: 'signals',   end: false, label: 'Signals',      icon: Activity    },
  { path: 'scout',     end: false, label: 'Scout',        icon: Satellite   },
  { path: 'research',  end: false, label: 'Research',     icon: Search      },
  { path: 'reports',   end: false, label: 'Reports',      icon: FileText    },
  { path: 'behavior',  end: false, label: 'Behavior',     icon: UserCheck   },
  { path: 'actions',    end: false, label: 'Actions',     icon: CheckSquare },
]

function useKIMMPSocket() {
  const { addLiveSignal, insights } = useKIMMPStore()

  useEffect(() => {
    if (isDemo()) return

    const socket = getSocket()

    const onSignal = (data: Record<string, unknown>) => {
      const idx = insights.length
      addLiveSignal(toInsight(data, idx))
    }

    const onUpdate = (data: { insights?: Record<string, unknown>[] }) => {
      if (Array.isArray(data.insights)) {
        data.insights.forEach((raw, i) => addLiveSignal(toInsight(raw, i)))
      }
    }

    const onLeadUpdated = () => {
      addLiveSignal({
        id:         `live-lead-${Date.now()}`,
        type:       'reactive',
        category:   'revenue',
        priority:   'medium',
        title:      'Lead pipeline updated',
        summary:    'A lead stage changed. KIMMP is re-evaluating pipeline signals.',
        detail:     '',
        action:     'Check the Leads module for updated pipeline status.',
        module:     'Leads',
        confidence: 90,
        impact:     '—',
        createdAt:  new Date().toISOString(),
      })
    }

    const onInvoiceOverdue = (data: Record<string, unknown>) => {
      addLiveSignal({
        id:         `live-invoice-${Date.now()}`,
        type:       'reactive',
        category:   'ops',
        priority:   'high',
        title:      `Invoice overdue: ${data.ref ?? 'unknown'}`,
        summary:    `Invoice ${data.ref ?? ''} has exceeded the payment threshold. Escalation required.`,
        detail:     '',
        action:     'Review the overdue invoice in Finance and initiate contact.',
        module:     'Finance',
        confidence: 99,
        impact:     data.amount ? `₹${data.amount}` : '—',
        createdAt:  new Date().toISOString(),
      })
    }

    socket.on('kimmp:signal',    onSignal)
    socket.on('kimmp:update',    onUpdate)
    socket.on('lead:updated',    onLeadUpdated)
    socket.on('invoice:overdue', onInvoiceOverdue)

    return () => {
      socket.off('kimmp:signal',    onSignal)
      socket.off('kimmp:update',    onUpdate)
      socket.off('lead:updated',    onLeadUpdated)
      socket.off('invoice:overdue', onInvoiceOverdue)
    }
  }, [addLiveSignal, insights.length])
}

export function KIMMMModule() {
  useKIMMPSocket()

  const { pathname } = useLocation()

  return (
    <div>
      {/* Scrollable tab bar */}
      <div className="flex items-center gap-0.5 border-b border-white/10 border-t-white/20 mb-6 -mt-2 overflow-x-auto scrollbar-none">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? BASE : `${BASE}/${tab.path}`}
            end={tab.end}
            className={({ isActive }) => cn(
              'flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap flex-shrink-0',
              isActive
                ? 'border-os-blue text-os-blue'
                : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-white/10 border-t-white/20'
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
          <Route path="briefing"      element={<BriefingPage />} />
          <Route index                element={<KIMMMPage />}    />
          <Route path="forecast"      element={<ForecastPage />} />
          <Route path="memory"        element={<MemoryPage />}   />
          <Route path="goals"         element={<GoalsPage />}    />
          <Route path="alerts"        element={<AlertsPage />}   />
          <Route path="signals"       element={<SignalsPage />}  />
          <Route path="scout"         element={<ScoutPage />}    />
          <Route path="research"      element={<ResearchPage />} />
          <Route path="reports"       element={<ReportsPage />}  />
          <Route path="behavior"      element={<BehaviorPage />} />
          <Route path="actions"       element={<ActionsPage />}    />
          <Route path="*"             element={<Navigate to={BASE} replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
