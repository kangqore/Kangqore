import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['engineering']

const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'TypeScript / React', category: 'Frontend',     experts: 2, mid: 1, beginners: 0, demand: 9 },
  { id: 'sk2', name: 'Node.js / API',      category: 'Backend',      experts: 2, mid: 1, beginners: 0, demand: 9 },
  { id: 'sk3', name: 'AI / ML Eng',        category: 'Intelligence', experts: 0, mid: 1, beginners: 1, demand: 8 },
  { id: 'sk4', name: 'Cloud Architecture', category: 'Infrastructure',experts: 1, mid: 2, beginners: 0, demand: 7 },
  { id: 'sk5', name: 'Security Eng',       category: 'Security',     experts: 1, mid: 1, beginners: 1, demand: 6 },
  { id: 'sk6', name: 'DevOps / CI-CD',     category: 'Infrastructure',experts: 1, mid: 1, beginners: 1, demand: 6 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'a1', name: 'Siddharth R', initials: 'SR', color: '#84CC16', role: 'Lead Engineer',
    skills: [
      { memberId: 'a1', name: 'Node.js / API',      level: 'EXPERT' },
      { memberId: 'a1', name: 'Security Eng',       level: 'EXPERT' },
      { memberId: 'a1', name: 'Cloud Architecture', level: 'INTERMEDIATE' },
      { memberId: 'a1', name: 'TypeScript / React', level: 'INTERMEDIATE' },
    ],
    kimmLine: 'API and security ownership is exceptional. AI/ML gap is strategic — upskilling Siddharth here would enable KIMMP v4 architecture independently.',
  },
  {
    id: 'a2', name: 'Kavya N', initials: 'KN', color: '#10B981', role: 'Backend Engineer',
    skills: [
      { memberId: 'a2', name: 'Node.js / API',      level: 'EXPERT' },
      { memberId: 'a2', name: 'Cloud Architecture', level: 'EXPERT' },
      { memberId: 'a2', name: 'DevOps / CI-CD',     level: 'INTERMEDIATE' },
      { memberId: 'a2', name: 'AI / ML Eng',        level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Cloud architecture expertise is critical for AEGIS scale-out. KIMMP integration work qualifies as ML exposure — formalise with a certification.',
  },
  {
    id: 'a3', name: 'Aryan M', initials: 'AM', color: '#F59E0B', role: 'Frontend Engineer',
    skills: [
      { memberId: 'a3', name: 'TypeScript / React', level: 'EXPERT' },
      { memberId: 'a3', name: 'DevOps / CI-CD',     level: 'BEGINNER' },
      { memberId: 'a3', name: 'AI / ML Eng',        level: 'BEGINNER' },
      { memberId: 'a3', name: 'Security Eng',       level: 'BEGINNER' },
    ],
    kimmLine: 'Frontend ownership is strong. Invest in DevOps basics — understanding the deployment pipeline will reduce handoff friction on every PR.',
  },
]

export function EngineeringSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-lime-500/20 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-lime-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Engineering Skills & Coverage</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Proficiency catalog, gap analysis, and KIMMP coaching recommendations.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
