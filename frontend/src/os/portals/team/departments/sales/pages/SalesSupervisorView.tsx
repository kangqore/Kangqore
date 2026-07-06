import { BarChart2 } from 'lucide-react'
import { SharedSupervisorView, type SupervisedAgent, type SLAAlert } from '../../shared/SharedSupervisorView'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['sales']

const AGENTS: SupervisedAgent[] = [
  { id: 's1', name: 'Arjun Shah',  initials: 'AS', color: '#0EA5E9', status: 'ON_ITEM',  currentItemId: 'DEAL-001', currentTitle: 'GlobalMed Negotiation — exec sponsor call', queueDepth: 1, capacity: 4, kimmCapacity: 'At 25% capacity. Handling highest-value deal in pipeline. Do not add non-urgent items.' },
  { id: 's2', name: 'Meera Nair',  initials: 'MN', color: '#8B5CF6', status: 'ON_ITEM',  currentItemId: 'PROP-008', currentTitle: 'FinServ Ltd proposal revision',              queueDepth: 2, capacity: 4, kimmCapacity: 'At 50% capacity. 2 proposals in queue. Can accept one more lead qualification.' },
  { id: 's3', name: 'Dev Patel',   initials: 'DP', color: '#10B981', status: 'ONLINE',   currentItemId: null,        currentTitle: null,                                         queueDepth: 1, capacity: 4, kimmCapacity: 'Available. Recommend assigning LEAD-042 (TechScale) — matches Dev\'s SaaS expertise.' },
]

const ALERTS: SLAAlert[] = [
  { id: 'DEAL-001', title: 'GlobalMed Negotiation — exec sponsor call', breachIn: '45 min', priority: 'P1', assignee: 'Arjun Shah' },
]

export function SalesSupervisorView() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-6 h-6 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Supervisor View</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Real-time Sales team status with deal SLA risk alerts.</p>
        </div>
      </div>
      <SharedSupervisorView config={cfg} agents={AGENTS} alerts={ALERTS} />
    </div>
  )
}
