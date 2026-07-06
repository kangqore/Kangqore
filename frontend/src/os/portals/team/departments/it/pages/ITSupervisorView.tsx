import { BarChart2 } from 'lucide-react'
import { SharedSupervisorView, type SupervisedAgent, type SLAAlert } from '../../shared/SharedSupervisorView'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['it']

const AGENTS: SupervisedAgent[] = [
  { id: 'a1', name: 'Arjun Sharma',  initials: 'AS', color: '#2564ea', status: 'ON_ITEM',  currentItemId: 'IT-0051', currentTitle: 'VPN certificate renewal failure',        queueDepth: 2, capacity: 5, kimmCapacity: 'At 40% capacity. Available for 1 more P1.' },
  { id: 'a2', name: 'Rohan Mehta',   initials: 'RM', color: '#10B981', status: 'ON_ITEM',  currentItemId: 'IT-0042', currentTitle: 'CPU spike >95% on api-gateway-prod',       queueDepth: 2, capacity: 4, kimmCapacity: 'At 50% capacity. Rohan owns 2 unresolved P2s.' },
  { id: 'a3', name: 'Priya Nair',    initials: 'PN', color: '#8B5CF6', status: 'ON_ITEM',  currentItemId: 'IT-0048', currentTitle: 'Production DB disk at 94%',                queueDepth: 3, capacity: 4, kimmCapacity: '⚠ At 75% capacity. SLA breach risk if 1 more P1 arrives.' },
  { id: 'a4', name: 'Vikram Sharma', initials: 'VS', color: '#F59E0B', status: 'IDLE',     currentItemId: null,       currentTitle: null,                                       queueDepth: 0, capacity: 5, kimmCapacity: 'Fully available — recommend assigning unqueued items.' },
  { id: 'a5', name: 'Kavya Reddy',   initials: 'KR', color: '#6366F1', status: 'OFFLINE',  currentItemId: null,       currentTitle: null,                                       queueDepth: 1, capacity: 4, kimmCapacity: 'Offline until 09:00 tomorrow.' },
]

const ALERTS: SLAAlert[] = [
  { id: 'IT-0048', title: 'Production DB disk at 94%', breachIn: '20 min', priority: 'P1', assignee: 'Priya N.' },
]

export function ITSupervisorView() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Supervisor View</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Real-time IT team status, queue depths, and SLA risk alerts.</p>
        </div>
      </div>
      <SharedSupervisorView config={cfg} agents={AGENTS} alerts={ALERTS} />
    </div>
  )
}
