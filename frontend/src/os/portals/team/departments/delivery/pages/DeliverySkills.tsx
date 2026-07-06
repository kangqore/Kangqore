import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['delivery']

const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Project Management',    category: 'Delivery',    experts: 2, mid: 0, beginners: 0, demand: 9 },
  { id: 'sk2', name: 'Client Management',     category: 'Relationship',experts: 1, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk3', name: 'Risk & Governance',     category: 'Governance',  experts: 1, mid: 1, beginners: 0, demand: 7 },
  { id: 'sk4', name: 'Technical Delivery',    category: 'Technical',   experts: 0, mid: 1, beginners: 1, demand: 6 },
  { id: 'sk5', name: 'Change Management',     category: 'Delivery',    experts: 0, mid: 1, beginners: 1, demand: 5 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'a1', name: 'Riya Desai',   initials: 'RD', color: '#F43F5E', role: 'Senior PM',
    skills: [
      { memberId: 'a1', name: 'Project Management', level: 'EXPERT' },
      { memberId: 'a1', name: 'Client Management',  level: 'EXPERT' },
      { memberId: 'a1', name: 'Risk & Governance',  level: 'EXPERT' },
      { memberId: 'a1', name: 'Change Management',  level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Highest CSAT and OTD rate in portfolio. Technical delivery gap — embedding in Engineering sprint reviews would close this.',
  },
  {
    id: 'a2', name: 'Sanjay Verma', initials: 'SV', color: '#F97316', role: 'PM',
    skills: [
      { memberId: 'a2', name: 'Project Management',  level: 'EXPERT' },
      { memberId: 'a2', name: 'Risk & Governance',   level: 'INTERMEDIATE' },
      { memberId: 'a2', name: 'Technical Delivery',  level: 'INTERMEDIATE' },
      { memberId: 'a2', name: 'Client Management',   level: 'INTERMEDIATE' },
      { memberId: 'a2', name: 'Change Management',   level: 'BEGINNER' },
    ],
    kimmLine: 'Strong technical delivery instinct — leverage this on FinServ and GlobalMed recoveries. Client management development will improve CSAT score.',
  },
]

export function DeliverySkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Delivery Skills & Coverage</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Proficiency catalog, gap analysis, and KIMMP coaching recommendations.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
