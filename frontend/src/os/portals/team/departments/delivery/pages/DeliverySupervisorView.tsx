import { BarChart2 } from 'lucide-react'
import { SharedSupervisorView, type SupervisedAgent, type SLAAlert } from '../../shared/SharedSupervisorView'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['delivery']

const AGENTS: SupervisedAgent[] = [
  { id: 'a1', name: 'Riya Desai',   initials: 'RD', color: '#F43F5E', status: 'ON_ITEM', currentItemId: 'RPT-001', currentTitle: 'Acme Corp — weekly status report draft',    queueDepth: 4, capacity: 6, kimmCapacity: 'At 67% capacity. 2 reports due today — prioritise Acme first.' },
  { id: 'a2', name: 'Sanjay Verma', initials: 'SV', color: '#F97316', status: 'ON_ITEM', currentItemId: 'RPT-002', currentTitle: 'GlobalMed report — overdue 7 days',         queueDepth: 3, capacity: 5, kimmCapacity: '⚠ GlobalMed report overdue. This is highest-priority item — must be sent today.' },
]

const ALERTS: SLAAlert[] = [
  { id: 'RPT-002', title: 'GlobalMed weekly status report — overdue 7 days', breachIn: '2 hours', priority: 'P1', assignee: 'Sanjay V.' },
]

export function DeliverySupervisorView() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Delivery Supervisor View</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Real-time PM status, project queue depths, and overdue report alerts.</p>
        </div>
      </div>
      <SharedSupervisorView config={cfg} agents={AGENTS} alerts={ALERTS} />
    </div>
  )
}
