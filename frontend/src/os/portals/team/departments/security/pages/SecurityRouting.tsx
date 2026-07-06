import { GitMerge } from 'lucide-react'
import { SharedRouting, type RoutingItem, type RoutingAgent } from '../../shared/SharedRouting'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['security']

const ITEMS: RoutingItem[] = [
  { id: 'VUL-042', title: 'Critical CVE-2026-1182 in nginx — affecting 4 prod servers', priority: 'P1',
    skillRequired: 'Vulnerability Management / nginx', kimmBestMatch: 'Arjun Sharma (IT)', confidence: 92,
    kimmRationale: 'Cross-dept assignment: Arjun has Expert nginx + network security proficiency, available capacity. Fastest resolution path vs waiting for Security team availability.' },
  { id: 'ACL-019', title: 'Access review: Finance team AWS production permissions', priority: 'P3',
    skillRequired: 'IAM / Cloud Access Review', kimmBestMatch: 'Rohan Mehta (IT)', confidence: 85,
    kimmRationale: 'Rohan: Expert in AWS IAM, low queue depth. Access review is low urgency — safe to cross-team route.' },
]

const AGENTS: RoutingAgent[] = [
  { id: 'sec1', name: 'Security Lead',    initials: 'SL', color: '#EF4444', queue: 3, capacity: 4, skills: ['Threat Intelligence', 'SIEM', 'GDPR'] },
  { id: 'sec2', name: 'Sec Analyst',      initials: 'SA', color: '#F87171', queue: 2, capacity: 5, skills: ['Vulnerability Mgmt', 'Pen Testing', 'IAM'] },
  { id: 'it1',  name: 'Arjun Sharma',     initials: 'AS', color: '#2564ea', queue: 2, capacity: 5, skills: ['Network', 'Linux', 'nginx'] },
  { id: 'it2',  name: 'Rohan Mehta',      initials: 'RM', color: '#10B981', queue: 1, capacity: 4, skills: ['AWS IAM', 'Kubernetes', 'DevOps'] },
]

export function SecurityRouting() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <GitMerge className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Security Routing</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Cross-team KIMMP routing for security incidents and vulnerability assignments.</p>
        </div>
      </div>
      <SharedRouting config={cfg} items={ITEMS} agents={AGENTS} />
    </div>
  )
}
