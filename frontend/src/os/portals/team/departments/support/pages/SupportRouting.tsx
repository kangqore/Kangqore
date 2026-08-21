import { GitMerge } from 'lucide-react'
import { SharedRouting, type RoutingItem, type RoutingAgent } from '../../shared/SharedRouting'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['support']

const ITEMS: RoutingItem[] = [
  {
    id: 'TK-1195', title: 'Export to CSV producing corrupted file — Firefox only', priority: 'P2',
    skillRequired: 'Product Bugs / Frontend', kimmBestMatch: 'Dev Patel', confidence: 89,
    kimmRationale: 'Dev: Expert in product bug reproduction, 1 item open. Firefox-specific bugs resolved avg 52 min. Client is mid-tier (£45K ARR) — SLA in 5h, safe to standard-route.',
  },
  {
    id: 'TK-1188', title: 'Onboarding call not showing in Google Calendar integration', priority: 'P3',
    skillRequired: 'Integrations / OAuth', kimmBestMatch: 'Nisha Singh', confidence: 82,
    kimmRationale: 'Nisha: Expert in OAuth/Google integrations, currently available. This pattern matches KB-067 (Google Cal OAuth scope issue). Estimated resolution: 25 min.',
  },
]

const AGENTS: RoutingAgent[] = [
  { id: 'b1', name: 'Meera Joshi',  initials: 'MJ', color: '#06B6D4', queue: 2, capacity: 5, skills: ['Billing', 'Enterprise', 'Escalations'] },
  { id: 'b2', name: 'Dev Patel',    initials: 'DP', color: '#10B981', queue: 1, capacity: 5, skills: ['Product Bugs', 'Frontend', 'Auth'] },
  { id: 'b3', name: 'Raj Pillai',   initials: 'RP', color: '#8B5CF6', queue: 0, capacity: 4, skills: ['How-To', 'Onboarding', 'Docs'] },
  { id: 'b4', name: 'Nisha Singh',  initials: 'NS', color: '#F59E0B', queue: 0, capacity: 5, skills: ['Integrations', 'OAuth', 'API'] },
]

export function SupportRouting() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <GitMerge className="w-6 h-6 text-[#2564ea]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Support Routing</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">KIMMP-powered skill-based routing with client ARR context.</p>
        </div>
      </div>
      <SharedRouting config={cfg} items={ITEMS} agents={AGENTS} />
    </div>
  )
}
