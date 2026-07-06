import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['innovation-rd']

const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Design Thinking',        category: 'Innovation', experts: 1, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk2', name: 'Rapid Prototyping',      category: 'Innovation', experts: 0, mid: 1, beginners: 0, demand: 9 },
  { id: 'sk3', name: 'Research Methods',       category: 'Research',   experts: 1, mid: 0, beginners: 0, demand: 7 },
  { id: 'sk4', name: 'Technology Scouting',    category: 'Strategy',   experts: 0, mid: 1, beginners: 0, demand: 7 },
  { id: 'sk5', name: 'Patent Writing',         category: 'IP',         experts: 1, mid: 0, beginners: 0, demand: 6 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'innov1', name: 'Kiran Mehta', initials: 'KM', color: '#CA8A04', role: 'Head of Innovation',
    skills: [
      { memberId: 'innov1', name: 'Design Thinking',     level: 'EXPERT' },
      { memberId: 'innov1', name: 'Technology Scouting', level: 'INTERMEDIATE' },
      { memberId: 'innov1', name: 'Patent Writing',      level: 'EXPERT' },
      { memberId: 'innov1', name: 'Rapid Prototyping',   level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Strong design thinking and IP skills — ideal for idea evaluation and patent strategy. Rapid Prototyping is the team gap at Expert level; Kiran is at Intermediate but the demand is highest here given the pipeline volume. A dedicated prototyping sprint approach (PoC in 2 weeks) would accelerate throughput significantly.',
  },
  {
    id: 'innov2', name: 'Ananya Das', initials: 'AD', color: '#F59E0B', role: 'R&D Engineer',
    skills: [
      { memberId: 'innov2', name: 'Research Methods',  level: 'EXPERT' },
      { memberId: 'innov2', name: 'Rapid Prototyping', level: 'INTERMEDIATE' },
      { memberId: 'innov2', name: 'Design Thinking',   level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Research Methods Expert — anchors the academic partnership programme. Rapid Prototyping skill is improving; the Compliance Evidence PoC will develop this further. No Patent Writing coverage — Kiran is the sole IP expert. Cross-training Ananya on provisional patent drafting would reduce IP risk if Kiran is unavailable.',
  },
]

export function InnovSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#CA8A0420' }}>
          <Award className="w-6 h-6" style={{ color: '#CA8A04' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Innovation Skills</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">R&amp;D proficiency catalog, skill gaps, and KIMMP coaching.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
