import { GitMerge } from 'lucide-react'
import { SharedRouting, type RoutingItem, type RoutingAgent } from '../../shared/SharedRouting'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['sales']

const ITEMS: RoutingItem[] = [
  {
    id: 'LEAD-042', title: 'TechScale Inbound — SaaS company, 200 employees, budget confirmed £75k', priority: 'P2',
    skillRequired: 'SaaS / Mid-Market', kimmBestMatch: 'Dev Patel', confidence: 87,
    kimmRationale: 'Dev: 3 closed SaaS deals this quarter, 1 item open in queue. TechScale profile matches Dev\'s top-performing segment. Estimated time-to-qualify: 2 days.',
  },
  {
    id: 'LEAD-043', title: 'HealthCo Referral — Healthcare sector, compliance-sensitive, CFO intro', priority: 'P3',
    skillRequired: 'Healthcare / Enterprise', kimmBestMatch: 'Arjun Shah', confidence: 93,
    kimmRationale: 'Arjun: Expert in healthcare compliance deals — closed GlobalMed and NovaBio. CFO-level intro requires senior AE. Referral from GlobalMed contact strengthens trust. High close probability if engaged within 48h.',
  },
]

const AGENTS: RoutingAgent[] = [
  { id: 's1', name: 'Arjun Shah',   initials: 'AS', color: '#0EA5E9', queue: 1, capacity: 4, skills: ['Enterprise', 'Healthcare', 'Negotiation'] },
  { id: 's2', name: 'Meera Nair',   initials: 'MN', color: '#8B5CF6', queue: 2, capacity: 4, skills: ['Financial Services', 'Proposals', 'Mid-Market'] },
  { id: 's3', name: 'Dev Patel',    initials: 'DP', color: '#10B981', queue: 1, capacity: 4, skills: ['SaaS', 'SMB', 'Technology'] },
]

export function SalesRouting() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
          <GitMerge className="w-6 h-6 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sales Routing</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">KIMMP-powered routing based on industry expertise and queue depth.</p>
        </div>
      </div>
      <SharedRouting config={cfg} items={ITEMS} agents={AGENTS} />
    </div>
  )
}
