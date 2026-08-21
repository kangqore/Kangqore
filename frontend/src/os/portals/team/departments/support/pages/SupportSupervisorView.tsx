import { BarChart2 } from 'lucide-react'
import { SharedSupervisorView, type SupervisedAgent, type SLAAlert } from '../../shared/SharedSupervisorView'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['support']

const AGENTS: SupervisedAgent[] = [
  { id: 'b1', name: 'Meera Joshi',  initials: 'MJ', color: '#06B6D4', status: 'ON_ITEM',  currentItemId: 'TK-1201', currentTitle: 'Payment gateway timeout on checkout', queueDepth: 2, capacity: 5, kimmCapacity: 'At 40% capacity. Handling critical Acme ticket.' },
  { id: 'b2', name: 'Dev Patel',    initials: 'DP', color: '#10B981', status: 'ON_ITEM',  currentItemId: 'TK-1198', currentTitle: 'Login 2FA email not arriving',        queueDepth: 1, capacity: 5, kimmCapacity: 'At 20% capacity. Available for 2 more P2s.' },
  { id: 'b3', name: 'Raj Pillai',   initials: 'RP', color: '#8B5CF6', status: 'IDLE',     currentItemId: null,       currentTitle: null,                                  queueDepth: 0, capacity: 4, kimmCapacity: 'Fully available — recommend assigning TK-1188.' },
  { id: 'b4', name: 'Nisha Singh',  initials: 'NS', color: '#F59E0B', status: 'ONLINE',   currentItemId: null,       currentTitle: null,                                  queueDepth: 0, capacity: 5, kimmCapacity: 'Available. Integration expert — assign TK-1188 for fastest resolution.' },
]

const ALERTS: SLAAlert[] = [
  { id: 'TK-1201', title: 'Payment gateway timeout', breachIn: '45 min', priority: 'P1', assignee: 'Meera J.' },
]

export function SupportSupervisorView() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-6 h-6 text-[#2564ea]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Supervisor View</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Real-time Support team status with SLA risk alerts.</p>
        </div>
      </div>
      <SharedSupervisorView config={cfg} agents={AGENTS} alerts={ALERTS} />
    </div>
  )
}
