import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['procurement']

const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Vendor Negotiation',   category: 'Commercial', experts: 1, mid: 0, beginners: 0, demand: 8 },
  { id: 'sk2', name: 'Contract Management',  category: 'Legal',      experts: 0, mid: 1, beginners: 0, demand: 9 },
  { id: 'sk3', name: 'Spend Analysis',       category: 'Analytics',  experts: 0, mid: 1, beginners: 0, demand: 7 },
  { id: 'sk4', name: 'Category Management',  category: 'Strategy',   experts: 0, mid: 0, beginners: 0, demand: 8 },
  { id: 'sk5', name: 'Supplier Risk',        category: 'Risk',       experts: 1, mid: 0, beginners: 0, demand: 7 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'proc1', name: 'Aarav Patel', initials: 'AP', color: '#7C3AED', role: 'Senior Procurement Manager',
    skills: [
      { memberId: 'proc1', name: 'Vendor Negotiation', level: 'EXPERT' },
      { memberId: 'proc1', name: 'Supplier Risk',       level: 'EXPERT' },
      { memberId: 'proc1', name: 'Contract Management', level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Strong negotiation and risk skills. Category Management is the critical gap at team level — no coverage at any level. This is causing suboptimal category bundling and missed volume discounts. A Category Management capability build or external hire should be prioritised for Q4.',
  },
  {
    id: 'proc2', name: 'Nisha Kapoor', initials: 'NK', color: '#A78BFA', role: 'Procurement Analyst',
    skills: [
      { memberId: 'proc2', name: 'Contract Management', level: 'INTERMEDIATE' },
      { memberId: 'proc2', name: 'Spend Analysis',       level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Good analytical foundation. Contract Management needs to reach Expert level — Salesforce renewal is a high-stakes negotiation that will stretch current capability. Spend Analysis skills are directly valuable; develop towards advanced BI tooling to move from Excel-based to automated spend intelligence.',
  },
]

export function ProcSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#7C3AED20' }}>
          <Award className="w-6 h-6" style={{ color: '#7C3AED' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Procurement Skills</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Procurement proficiency catalog, skill gaps, and KIMMP coaching.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
