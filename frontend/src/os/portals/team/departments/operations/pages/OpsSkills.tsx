import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['operations']

const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Business Process Management', category: 'Operations', experts: 1, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk2', name: 'Capacity Planning',           category: 'Planning',  experts: 1, mid: 0, beginners: 0, demand: 8 },
  { id: 'sk3', name: 'Vendor Management',           category: 'Commercial',experts: 0, mid: 1, beginners: 0, demand: 7 },
  { id: 'sk4', name: 'BCP & Resilience',            category: 'Risk',      experts: 0, mid: 0, beginners: 1, demand: 8 },
  { id: 'sk5', name: 'Operational Analytics',       category: 'Analytics', experts: 0, mid: 1, beginners: 0, demand: 7 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'ops1', name: 'Suresh Nambiar', initials: 'SN', color: '#16A34A', role: 'Head of Operations',
    skills: [
      { memberId: 'ops1', name: 'Business Process Management', level: 'EXPERT' },
      { memberId: 'ops1', name: 'Capacity Planning',           level: 'EXPERT' },
      { memberId: 'ops1', name: 'Operational Analytics',       level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Strong process and capacity expertise — the two highest-demand skills. BCP & Resilience is the critical gap at beginner level only; a failed Production DB test and 3 untested systems require someone with BCP Expert skills. Consider a CBCI certification for Leela to build this capability in-house.',
  },
  {
    id: 'ops2', name: 'Leela Krishnan', initials: 'LK', color: '#4ADE80', role: 'Operations Manager',
    skills: [
      { memberId: 'ops2', name: 'Business Process Management', level: 'INTERMEDIATE' },
      { memberId: 'ops2', name: 'Vendor Management',           level: 'INTERMEDIATE' },
      { memberId: 'ops2', name: 'BCP & Resilience',            level: 'BEGINNER' },
    ],
    kimmLine: 'Good all-round operational coverage. Vendor Management is actively being applied — the Print Co. breach is a real-world development opportunity. BCP & Resilience at beginner level is the priority to develop given the 3 untested systems; pair with Suresh on the July BCP exercise to accelerate.',
  },
]

export function OpsSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#16A34A20' }}>
          <Award className="w-6 h-6" style={{ color: '#16A34A' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operations Skills</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Operations proficiency catalog, skill gaps, and KIMMP coaching.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
