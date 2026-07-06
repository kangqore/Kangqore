import { BarChart2 } from 'lucide-react'
import { SharedSupervisorView, type SupervisedAgent, type SLAAlert } from '../../shared/SharedSupervisorView'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['customer-success']

const AGENTS: SupervisedAgent[] = [
  { id: 'a1', name: 'Lena Park',  initials: 'LP', color: '#14B8A6', status: 'ON_ITEM', currentItemId: 'CS-0031', currentTitle: 'HealthGroup renewal — 60-day notice window', queueDepth: 3, capacity: 6, kimmCapacity: 'At 50% capacity. Owns highest-ARR renewal this quarter.' },
  { id: 'a2', name: 'Raj Mehta', initials: 'RM', color: '#8B5CF6', status: 'ON_ITEM', currentItemId: 'CS-0028', currentTitle: 'FinServ health score declined — at-risk review', queueDepth: 2, capacity: 5, kimmCapacity: '⚠ FinServ is At-Risk. Raj is the right owner — escalate SLA if no progress by EOD.' },
]

const ALERTS: SLAAlert[] = [
  { id: 'CS-0028', title: 'FinServ At-Risk — health score 62, no contact in 14d', breachIn: '4 hours', priority: 'P1', assignee: 'Raj M.' },
]

export function CSSupervisorView() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CS Supervisor View</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Real-time CSM status, account queue depths, and churn risk alerts.</p>
        </div>
      </div>
      <SharedSupervisorView config={cfg} agents={AGENTS} alerts={ALERTS} />
    </div>
  )
}
