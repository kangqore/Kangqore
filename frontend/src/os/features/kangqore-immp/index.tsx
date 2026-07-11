import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import {
  Brain, TrendingUp, BookOpen, Satellite, Bell, Activity,
  Search, Target, FileText, UserCheck, CheckSquare, Newspaper, Cpu, Scale, Zap, GitBranch, LayoutDashboard, Shield, Gauge, Rocket, Radio, LineChart, Building2, Award, Lightbulb, FlaskConical, Globe2, FileJson, Command,
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
import { TrainingPage }        from './pages/TrainingPage'
import { DecisionsPage }      from './pages/DecisionsPage'
import { OperationsPage }     from './pages/OperationsPage'
import { WorkflowsPage }      from './pages/WorkflowsPage'
import { MissionControlPage } from './pages/MissionControlPage'
import { AIGovernancePage }   from './pages/AIGovernancePage'
import { QEFPage }             from './pages/QEFPage'
import { G7Page }              from './pages/G7Page'
import { G8Page }                    from './pages/G8Page'
import { FlightRecorderPage }        from './pages/FlightRecorderPage'
import { EnterpriseDefinitionPage }  from './pages/EnterpriseDefinitionPage'
import { CustomerZeroPage }          from './pages/CustomerZeroPage'
import { EnterpriseCoachPage }       from './pages/EnterpriseCoachPage'
import { DecisionEnginePage }        from './pages/DecisionEnginePage'
import { DeploymentsPage }           from './pages/DeploymentsPage'
import { BlueprintPage }             from './pages/BlueprintPage'
import { CommandCenterPage }          from './pages/CommandCenterPage'
import { AnimatePresence, motion } from 'framer-motion'

const BASE = '/kangqore-view/admin/kangqore-immp'

const TABS = [
  { path: 'command-center',  end: false, label: 'Command Center', icon: Command },
  { path: 'mission-control', end: false, label: 'Mission Control', icon: LayoutDashboard },
  { path: 'briefing',        end: false, label: 'Briefing',        icon: Newspaper       },
  { path: '',                end: true,  label: 'Intelligence',    icon: Brain           },
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
  { path: 'training',    end: false, label: 'Gen 2',       icon: Cpu        },
  { path: 'decisions',   end: false, label: 'Decisions',   icon: Scale      },
  { path: 'operations',  end: false, label: 'Operations',  icon: Zap        },
  { path: 'workflows',   end: false, label: 'Workflows',   icon: GitBranch  },
  { path: 'ai-governance',       end: false, label: 'AI Health',  icon: Shield },
  { path: 'quality-engineering', end: false, label: 'QEF',            icon: Gauge  },
  { path: 'release-governance',  end: false, label: 'G7 Release',     icon: Rocket   },
  { path: 'operational-intel',   end: false, label: 'Gate 8 — OIS',   icon: LineChart  },
  { path: 'flight-recorder',     end: false, label: 'Flight Recorder', icon: Radio      },
  { path: 'enterprise',          end: false, label: 'Enterprise',      icon: Building2  },
  { path: 'customer-zero',       end: false, label: 'Customer Zero',   icon: Award         },
  { path: 'coach',               end: false, label: 'Coach',           icon: Lightbulb     },
  { path: 'decision-engine',     end: false, label: 'Decision Engine', icon: FlaskConical  },
  { path: 'deployments',         end: false, label: 'Deployments',     icon: Globe2         },
  { path: 'blueprint',           end: false, label: 'Blueprint',        icon: FileJson       },
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
      <div className="flex items-center gap-0.5 border-b border-[var(--os-border)] mb-6 -mt-2 overflow-x-auto scrollbar-none">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? BASE : `${BASE}/${tab.path}`}
            end={tab.end}
            className={({ isActive }) => cn(
              'flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap flex-shrink-0',
              isActive
                ? 'border-os-blue text-os-blue'
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
          <Route path="command-center"  element={<CommandCenterPage />} />
          <Route path="briefing"        element={<BriefingPage />} />
          <Route index                  element={<KIMMMPage />}    />
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
          <Route path="training"      element={<TrainingPage />}   />
          <Route path="mission-control" element={<MissionControlPage />} />
          <Route path="decisions"       element={<DecisionsPage />}    />
          <Route path="operations"      element={<OperationsPage />}   />
          <Route path="workflows"        element={<WorkflowsPage />}    />
          <Route path="ai-governance"       element={<AIGovernancePage />} />
          <Route path="quality-engineering" element={<QEFPage />}            />
          <Route path="release-governance"  element={<G7Page />}             />
          <Route path="operational-intel"   element={<G8Page />}                   />
          <Route path="flight-recorder"     element={<FlightRecorderPage />}       />
          <Route path="enterprise"          element={<EnterpriseDefinitionPage />} />
          <Route path="customer-zero"       element={<CustomerZeroPage />}          />
          <Route path="coach"               element={<EnterpriseCoachPage />}       />
          <Route path="decision-engine"     element={<DecisionEnginePage />}        />
          <Route path="deployments"         element={<DeploymentsPage />}           />
          <Route path="blueprint"           element={<BlueprintPage />}             />
          <Route path="*"                   element={<Navigate to={BASE} replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
