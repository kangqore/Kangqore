import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['support']

const SKILLS: SkillEntry[] = [
  { id: 'ss1', name: 'Enterprise Escalation', category: 'Customer',     experts: 1, mid: 2, beginners: 1, demand: 5 },
  { id: 'ss2', name: 'Billing / Payments',    category: 'Customer',     experts: 2, mid: 1, beginners: 0, demand: 8 },
  { id: 'ss3', name: 'Auth / SSO',            category: 'Technical',    experts: 1, mid: 2, beginners: 0, demand: 6 },
  { id: 'ss4', name: 'Product Bug Repro',     category: 'Technical',    experts: 2, mid: 1, beginners: 1, demand: 7 },
  { id: 'ss5', name: 'OAuth / Integrations',  category: 'Technical',    experts: 1, mid: 0, beginners: 1, demand: 5 },
  { id: 'ss6', name: 'Churn Risk Detection',  category: 'Customer',     experts: 0, mid: 2, beginners: 1, demand: 3 },
]

const MEMBERS: SkillMember[] = [
  { id: 'b1', name: 'Meera Joshi',  initials: 'MJ', color: '#06B6D4', role: 'Senior Agent',
    skills: [{ memberId: 'b1', name: 'Enterprise Escalation', level: 'EXPERT' }, { memberId: 'b1', name: 'Billing / Payments', level: 'EXPERT' }],
    kimmLine: 'Top enterprise escalation handler. Has capacity to mentor on churn detection.' },
  { id: 'b2', name: 'Dev Patel',    initials: 'DP', color: '#10B981', role: 'Support Engineer',
    skills: [{ memberId: 'b2', name: 'Auth / SSO', level: 'EXPERT' }, { memberId: 'b2', name: 'Product Bug Repro', level: 'EXPERT' }],
    kimmLine: 'Best auth and bug reproducer. Develop enterprise escalation to reduce Meera dependency.' },
  { id: 'b3', name: 'Raj Pillai',   initials: 'RP', color: '#8B5CF6', role: 'Support Agent',
    skills: [{ memberId: 'b3', name: 'Billing / Payments', level: 'INTERMEDIATE' }, { memberId: 'b3', name: 'Churn Risk Detection', level: 'INTERMEDIATE' }],
    kimmLine: 'Developing well. Churn detection is underutilised — create structured process for Raj to own.' },
  { id: 'b4', name: 'Nisha Singh',  initials: 'NS', color: '#F59E0B', role: 'Integration Specialist',
    skills: [{ memberId: 'b4', name: 'OAuth / Integrations', level: 'EXPERT' }, { memberId: 'b4', name: 'Auth / SSO', level: 'INTERMEDIATE' }],
    kimmLine: 'Integration expert. Gap: no other agent has OAuth expertise — bus-factor risk.' },
]

export function SupportSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-[#2564ea]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Support Skills & Coverage</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Proficiency catalog and KIMMP coaching for the support team.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
