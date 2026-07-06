import { BarChart2 } from 'lucide-react'
import { SharedSupervisorView, type SupervisedAgent, type SLAAlert } from '../../shared/SharedSupervisorView'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['security']

const AGENTS: SupervisedAgent[] = [
  { id: 'sec1', name: 'Security Lead',    initials: 'SL', color: '#EF4444', status: 'ON_ITEM',  currentItemId: 'VUL-042', currentTitle: 'Critical CVE-2026-1182 in nginx',  queueDepth: 3, capacity: 4, kimmCapacity: '⚠ At 75% capacity. 1 more P1 will breach SLA.' },
  { id: 'sec2', name: 'Security Analyst', initials: 'SA', color: '#F87171', status: 'ONLINE',   currentItemId: null,       currentTitle: null,                                queueDepth: 2, capacity: 5, kimmCapacity: 'At 40% capacity. Available for routing.' },
]

const ALERTS: SLAAlert[] = [
  { id: 'VUL-042', title: 'Critical CVE nginx patch', breachIn: '1h', priority: 'P1', assignee: 'Security Lead' },
]

export function SecuritySupervisorView() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Security Supervisor View</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Real-time security team status with SLA and breach risk alerts.</p>
        </div>
      </div>
      <SharedSupervisorView config={cfg} agents={AGENTS} alerts={ALERTS} />
    </div>
  )
}
