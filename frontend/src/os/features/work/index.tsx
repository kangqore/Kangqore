// Work OS — Phase 7: Build the Decision Engine
// All WorkItems are enterprise OntologyObjects.
// Decision Matrix Engine evaluates 8 enterprise inputs and outputs structured prescriptive trade-offs.

import { useLocation, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { FileStack, Sparkles as SparkleIcon, Inbox, LayoutGrid, Table2, GanttChartSquare, GitMerge, Users, Target, Briefcase, BarChart3, Zap, Layers, Sparkles, Scale, Activity } from 'lucide-react'
import { cn } from '@design-system/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { TemplatesView }      from './pages/TemplatesView'
import { FieldsView }         from './pages/FieldsView'
import { IngestionView }      from './pages/IngestionView'
import { BoardView }          from './pages/BoardView'
import { TableView }          from './pages/TableView'
import { TimelineView }       from './pages/TimelineView'
import { DependencyGraphView } from './pages/DependencyGraphView'
import { WorkloadView }       from './pages/WorkloadView'
import { GoalsView }          from './pages/GoalsView'
import { PortfolioView }      from './pages/PortfolioView'
import { ExecutiveView }      from './pages/ExecutiveView'
import { AutomationsView }    from './pages/AutomationsView'
import AgentPrimaryUxView     from './pages/AgentPrimaryUxView'
import DecisionEngineView     from './pages/DecisionEngineView'
import OutcomeIntelligenceView from './pages/OutcomeIntelligenceView'

const BASE = '/kangqore-view/admin/work'

const TABS = [
  { path: 'agent-ux',       label: 'AI Agent Workspace (Primary UX)', icon: Sparkles, primary: true },
  { path: 'decision-matrix',label: 'Decision Engine', icon: Scale },
  { path: 'templates',       label: 'Templates',       icon: FileStack          },
  { path: 'board',           label: 'Board',           icon: LayoutGrid         },
  { path: 'table',           label: 'Table',           icon: Table2             },
  { path: 'timeline',        label: 'Timeline',        icon: GanttChartSquare   },
  { path: 'graph',           label: 'Dependency',      icon: GitMerge           },
  { path: 'workload',        label: 'Workload',        icon: Users              },
  { path: 'goals',           label: 'Goals',           icon: Target             },
  { path: 'portfolio',       label: 'Portfolio',       icon: Briefcase          },
  { path: 'outcomes',        label: 'Outcomes',        icon: Activity           },
  { path: 'executive',       label: 'Command',         icon: BarChart3          },
  { path: 'automations',     label: 'Automations',     icon: Zap                },
  { path: 'fields',          label: 'Intelligence',    icon: SparkleIcon        },
  { path: 'ingest',          label: 'Ingestion',       icon: Inbox              },
]

export function WorkModule() {
  const { pathname } = useLocation()
  return (
    <div>
      <div className="mb-5 -mt-2">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-5 h-5 text-[var(--os-text-2)]" />
          <h1 className="text-xl font-semibold text-[var(--os-text-1)]">Work OS</h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20 flex items-center gap-1">
            <Scale className="w-3 h-3" />
            Decision Engine Active
          </span>
        </div>
        <div className="flex items-center gap-0 border-b border-[var(--os-border)] overflow-x-auto">
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={`${BASE}/${tab.path}`}
              className={({ isActive }) => cn(
                'flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-all',
                isActive
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]',
                tab.primary && !pathname.includes(tab.path) && 'text-blue-300 hover:text-blue-200'
              )}
            >
              <tab.icon className={cn('w-3.5 h-3.5', tab.primary && 'text-blue-400')} />
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.12}}>
          <Routes>
            <Route index element={<Navigate to="agent-ux" replace />} />
            <Route path="agent-ux"        element={<AgentPrimaryUxView />}  />
            <Route path="decision-matrix" element={<DecisionEngineView />}  />
            <Route path="templates"       element={<TemplatesView />}       />
            <Route path="board"           element={<BoardView />}           />
            <Route path="table"           element={<TableView />}           />
            <Route path="timeline"        element={<TimelineView />}        />
            <Route path="graph"           element={<DependencyGraphView />}  />
            <Route path="workload"        element={<WorkloadView />}        />
            <Route path="goals"           element={<GoalsView />}           />
            <Route path="portfolio"       element={<PortfolioView />}       />
            <Route path="outcomes"        element={<OutcomeIntelligenceView />} />
            <Route path="executive"       element={<ExecutiveView />}       />
            <Route path="automations"     element={<AutomationsView />}     />
            <Route path="fields"          element={<FieldsView />}          />
            <Route path="ingest"          element={<IngestionView />}       />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
