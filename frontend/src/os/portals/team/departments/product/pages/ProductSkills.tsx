import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['product']

const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Product Strategy',  category: 'Strategy',  experts: 1, mid: 1, beginners: 0, demand: 9 },
  { id: 'sk2', name: 'User Research',     category: 'Research',  experts: 0, mid: 1, beginners: 1, demand: 8 },
  { id: 'sk3', name: 'Agile / Scrum',     category: 'Process',   experts: 2, mid: 1, beginners: 0, demand: 7 },
  { id: 'sk4', name: 'Data Analysis',     category: 'Analytics', experts: 1, mid: 1, beginners: 1, demand: 6 },
  { id: 'sk5', name: 'UX Writing',        category: 'Design',    experts: 0, mid: 1, beginners: 0, demand: 4 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'a1', name: 'Ananya Rao',   initials: 'AR', color: '#A855F7', role: 'Head of Product',
    skills: [
      { memberId: 'a1', name: 'Product Strategy', level: 'EXPERT' },
      { memberId: 'a1', name: 'Agile / Scrum',    level: 'EXPERT' },
      { memberId: 'a1', name: 'Data Analysis',    level: 'EXPERT' },
    ],
    kimmLine: 'Strategic and analytical depth is exceptional. Formalise user research process to close the team gap.',
  },
  {
    id: 'a2', name: 'Priya Mistry', initials: 'PM', color: '#EC4899', role: 'Product Manager',
    skills: [
      { memberId: 'a2', name: 'User Research',  level: 'INTERMEDIATE' },
      { memberId: 'a2', name: 'Agile / Scrum',  level: 'EXPERT' },
      { memberId: 'a2', name: 'UX Writing',     level: 'INTERMEDIATE' },
      { memberId: 'a2', name: 'Data Analysis',  level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Strong execution PM. Elevate user research to Expert — only team member with any proficiency in this gap area.',
  },
  {
    id: 'a3', name: 'Omar Shah',    initials: 'OS', color: '#F59E0B', role: 'Associate PM',
    skills: [
      { memberId: 'a3', name: 'Product Strategy', level: 'INTERMEDIATE' },
      { memberId: 'a3', name: 'User Research',    level: 'BEGINNER' },
      { memberId: 'a3', name: 'Agile / Scrum',    level: 'INTERMEDIATE' },
      { memberId: 'a3', name: 'Data Analysis',    level: 'BEGINNER' },
    ],
    kimmLine: 'High potential. Pairing with Ananya on discovery work will accelerate growth across all skill areas.',
  },
]

export function ProductSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Product Skills & Coverage</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Proficiency catalog, gap analysis, and KIMMP coaching recommendations.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
