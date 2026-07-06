import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['risk-compliance']

const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Risk Assessment',         category: 'Risk',       experts: 1, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk2', name: 'Compliance Management',   category: 'Compliance', experts: 0, mid: 1, beginners: 0, demand: 9 },
  { id: 'sk3', name: 'Audit & Assurance',       category: 'Audit',      experts: 1, mid: 0, beginners: 0, demand: 7 },
  { id: 'sk4', name: 'Data Privacy',            category: 'Privacy',    experts: 0, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk5', name: 'Vendor Governance',       category: 'Risk',       experts: 1, mid: 0, beginners: 0, demand: 6 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'rc1', name: 'Maya Nair', initials: 'MN', color: '#B91C1C', role: 'Risk & Compliance Manager',
    skills: [
      { memberId: 'rc1', name: 'Risk Assessment',       level: 'EXPERT' },
      { memberId: 'rc1', name: 'Audit & Assurance',     level: 'EXPERT' },
      { memberId: 'rc1', name: 'Vendor Governance',     level: 'EXPERT' },
      { memberId: 'rc1', name: 'Compliance Management', level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Strong risk and audit expertise. Compliance Management is the team gap — at Expert demand-level with no Expert coverage. The DPDP programme requires regulatory expertise beyond current team capacity; recommend a specialist contractor or upskill programme for Arjun.',
  },
  {
    id: 'rc2', name: 'Arjun Singh', initials: 'AS', color: '#EF4444', role: 'Compliance Analyst',
    skills: [
      { memberId: 'rc2', name: 'Compliance Management', level: 'INTERMEDIATE' },
      { memberId: 'rc2', name: 'Data Privacy',          level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Data Privacy and Compliance skills aligned to the GDPR and DPDP programmes. No Audit expertise — single-point risk on Maya for all audit work. Cross-training on ISO 27001 audit methodology would reduce key-person dependency ahead of the Stage 2 audit.',
  },
]

export function RCSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#B91C1C20' }}>
          <Award className="w-6 h-6" style={{ color: '#B91C1C' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Risk &amp; Compliance Skills</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Compliance proficiency catalog, skill gaps, and KIMMP coaching.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
