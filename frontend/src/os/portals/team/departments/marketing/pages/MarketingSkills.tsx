import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['marketing']

const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'SEO & SEM',          category: 'Digital',   experts: 1, mid: 1, beginners: 0, demand: 6 },
  { id: 'sk2', name: 'Content Marketing',  category: 'Content',   experts: 1, mid: 1, beginners: 0, demand: 7 },
  { id: 'sk3', name: 'Paid Media',         category: 'Digital',   experts: 0, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk4', name: 'Brand Design',       category: 'Creative',  experts: 0, mid: 1, beginners: 1, demand: 5 },
  { id: 'sk5', name: 'Marketing Analytics',category: 'Analytics', experts: 1, mid: 0, beginners: 1, demand: 7 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'mkt1', name: 'Priya Kapoor', initials: 'PK', color: '#EC4899', role: 'Marketing Manager',
    skills: [
      { memberId: 'mkt1', name: 'SEO & SEM',          level: 'INTERMEDIATE' },
      { memberId: 'mkt1', name: 'Content Marketing',  level: 'EXPERT' },
    ],
    kimmLine: 'Strong campaign strategy. Paid Media gap is a team risk — Aisha covers execution but no expert depth. Recommend an external audit or contractor for Q3 demand gen scale-up.',
  },
  {
    id: 'mkt2', name: 'Jamie Walsh', initials: 'JW', color: '#F472B6', role: 'Content Lead',
    skills: [
      { memberId: 'mkt2', name: 'Content Marketing', level: 'EXPERT' },
      { memberId: 'mkt2', name: 'SEO & SEM',         level: 'EXPERT' },
      { memberId: 'mkt2', name: 'Brand Design',       level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Dual expert in content and SEO — high strategic value. Whitepaper output is directly driving SQL attribution. Develop Marketing Analytics to reduce dependency on Aisha for reporting.',
  },
  {
    id: 'mkt3', name: 'Aisha Patel', initials: 'AP', color: '#BE185D', role: 'Performance Analyst',
    skills: [
      { memberId: 'mkt3', name: 'Paid Media',          level: 'INTERMEDIATE' },
      { memberId: 'mkt3', name: 'Marketing Analytics', level: 'EXPERT' },
    ],
    kimmLine: 'Analytics expert driving ROAS improvements. No Paid Media expert on team — Aisha is the sole owner. Cross-training or a specialist hire reduces single-point risk on the digital ads budget.',
  },
]

export function MarketingSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Marketing Skills</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Marketing proficiency catalog, skill gaps, and KIMMP coaching.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
