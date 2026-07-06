import { GitMerge } from 'lucide-react'
import { SharedRouting, type RoutingItem, type RoutingAgent } from '../../shared/SharedRouting'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['customer-success']

const ITEMS: RoutingItem[] = [
  {
    id: 'CS-0031', title: 'HealthGroup renewal — 60-day notice window opens today', priority: 'P1',
    skillRequired: 'Account Mgmt', kimmBestMatch: 'Lena Park', confidence: 95,
    kimmRationale: 'Lena: Expert in account management, owns HealthGroup relationship since onboarding. £145K ARR at stake. Renewal window closes in 45 days. Assign immediately.',
  },
  {
    id: 'CS-0032', title: 'DataCo quarterly business review — scheduling request', priority: 'P3',
    skillRequired: 'Executive Engagement', kimmBestMatch: 'Raj Mehta', confidence: 88,
    kimmRationale: 'Raj: Strong QBR track record — 28 completed this quarter. DataCo health score 74 (amber) — QBR is critical to retention. Raj has capacity this week.',
  },
]

const AGENTS: RoutingAgent[] = [
  { id: 'a1', name: 'Lena Park',  initials: 'LP', color: '#14B8A6', queue: 3, capacity: 6, skills: ['Account Mgmt', 'Churn Prevention', 'Executive Engagement'] },
  { id: 'a2', name: 'Raj Mehta', initials: 'RM', color: '#8B5CF6', queue: 2, capacity: 5, skills: ['Executive Engagement', 'QBRs', 'Data Analysis'] },
]

export function CSRouting() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
          <GitMerge className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CS Routing</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">KIMMP-powered skill-based routing — assigns unqueued items to the optimal CSM.</p>
        </div>
      </div>
      <SharedRouting config={cfg} items={ITEMS} agents={AGENTS} />
    </div>
  )
}
