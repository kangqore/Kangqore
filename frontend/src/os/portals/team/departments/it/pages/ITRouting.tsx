import { GitMerge } from 'lucide-react'
import { SharedRouting, type RoutingItem, type RoutingAgent } from '../../shared/SharedRouting'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['it']

const ITEMS: RoutingItem[] = [
  {
    id: 'IT-0046', title: 'Email delivery delay >30 min (marketing campaign affected)', priority: 'P2',
    skillRequired: 'Email / Exchange', kimmBestMatch: 'Kavya Reddy', confidence: 91,
    kimmRationale: 'Kavya: Expert in Exchange/M365, 1 item open (below 4-item capacity). Last resolved identical delay in 48 min. Marketing campaign SLA breach in 5h = business impact.',
  },
  {
    id: 'IT-0040', title: 'Conference room AV system not connecting to Zoom', priority: 'P4',
    skillRequired: 'AV / Hardware', kimmBestMatch: 'Vikram Sharma', confidence: 88,
    kimmRationale: 'Vikram: Expert in hardware/AV, currently idle (0 items). Only agent with AV proficiency. Priority P4 — low urgency, safe to assign to available agent.',
  },
]

const AGENTS: RoutingAgent[] = [
  { id: 'a1', name: 'Arjun Sharma',  initials: 'AS', color: '#2564ea', queue: 2, capacity: 5, skills: ['Network', 'VPN', 'Linux'] },
  { id: 'a2', name: 'Rohan Mehta',   initials: 'RM', color: '#10B981', queue: 2, capacity: 4, skills: ['DevOps', 'AWS', 'Kubernetes'] },
  { id: 'a3', name: 'Priya Nair',    initials: 'PN', color: '#8B5CF6', queue: 3, capacity: 4, skills: ['Database', 'PostgreSQL', 'Infra'] },
  { id: 'a4', name: 'Vikram Sharma', initials: 'VS', color: '#F59E0B', queue: 0, capacity: 5, skills: ['Hardware', 'AV', 'Desktop'] },
  { id: 'a5', name: 'Kavya Reddy',   initials: 'KR', color: '#6366F1', queue: 1, capacity: 4, skills: ['Email', 'Exchange', 'M365'] },
]

export function ITRouting() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <GitMerge className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">IT Routing</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">KIMMP-powered skill-based routing — assigns unqueued items to the optimal agent.</p>
        </div>
      </div>
      <SharedRouting config={cfg} items={ITEMS} agents={AGENTS} />
    </div>
  )
}
