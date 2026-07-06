import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['customer-success']

const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Account Management',    category: 'Relationship', experts: 1, mid: 1, beginners: 0, demand: 9 },
  { id: 'sk2', name: 'Executive Engagement',  category: 'Relationship', experts: 1, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk3', name: 'Churn Prevention',       category: 'Retention',   experts: 0, mid: 1, beginners: 1, demand: 7 },
  { id: 'sk4', name: 'Product Knowledge',      category: 'Technical',   experts: 1, mid: 1, beginners: 0, demand: 6 },
  { id: 'sk5', name: 'Data Analysis',          category: 'Analytics',   experts: 0, mid: 1, beginners: 1, demand: 5 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'a1', name: 'Lena Park',  initials: 'LP', color: '#14B8A6', role: 'Senior CSM',
    skills: [
      { memberId: 'a1', name: 'Account Management',   level: 'EXPERT' },
      { memberId: 'a1', name: 'Executive Engagement', level: 'EXPERT' },
      { memberId: 'a1', name: 'Product Knowledge',    level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Top retention rate in portfolio. Consider leading a churn prevention playbook session for the team.',
  },
  {
    id: 'a2', name: 'Raj Mehta', initials: 'RM', color: '#8B5CF6', role: 'CSM',
    skills: [
      { memberId: 'a2', name: 'Executive Engagement', level: 'INTERMEDIATE' },
      { memberId: 'a2', name: 'Product Knowledge',    level: 'EXPERT' },
      { memberId: 'a2', name: 'Churn Prevention',     level: 'INTERMEDIATE' },
      { memberId: 'a2', name: 'Data Analysis',        level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Strong product depth. Data analysis skills should be developed to Expert to improve QBR quality.',
  },
]

export function CSSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CS Skills & Coverage</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Proficiency catalog, gap analysis, and KIMMP coaching recommendations.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
