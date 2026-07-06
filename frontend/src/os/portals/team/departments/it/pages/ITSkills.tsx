import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['it']

const SKILLS: SkillEntry[] = [
  { id: 'sk1',  name: 'Network / VPN',       category: 'Infrastructure', experts: 2, mid: 1, beginners: 1, demand: 8 },
  { id: 'sk2',  name: 'Linux / Shell',        category: 'Infrastructure', experts: 3, mid: 1, beginners: 0, demand: 7 },
  { id: 'sk3',  name: 'Kubernetes / Docker',  category: 'DevOps',         experts: 1, mid: 2, beginners: 1, demand: 6 },
  { id: 'sk4',  name: 'AWS / Cloud',          category: 'DevOps',         experts: 2, mid: 1, beginners: 0, demand: 5 },
  { id: 'sk5',  name: 'PostgreSQL / DB',      category: 'Data',           experts: 1, mid: 2, beginners: 1, demand: 7 },
  { id: 'sk6',  name: 'Okta / IAM',           category: 'Identity',       experts: 1, mid: 1, beginners: 2, demand: 5 },
  { id: 'sk7',  name: 'Exchange / M365',      category: 'Email',          experts: 1, mid: 0, beginners: 1, demand: 4 },
  { id: 'sk8',  name: 'AV / Hardware',        category: 'Hardware',       experts: 1, mid: 1, beginners: 1, demand: 2 },
  { id: 'sk9',  name: 'Security / SIEM',      category: 'Security',       experts: 0, mid: 2, beginners: 1, demand: 6 },
  { id: 'sk10', name: 'Python / Automation',  category: 'DevOps',         experts: 2, mid: 2, beginners: 0, demand: 4 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'a1', name: 'Arjun Sharma',  initials: 'AS', color: '#2564ea', role: 'Lead Engineer',
    skills: [
      { memberId: 'a1', name: 'Network / VPN',      level: 'EXPERT' },
      { memberId: 'a1', name: 'Linux / Shell',       level: 'EXPERT' },
      { memberId: 'a1', name: 'Python / Automation', level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Top skill match for VPN and network incidents. Consider leading a Linux mentoring session for the team.',
  },
  {
    id: 'a2', name: 'Rohan Mehta',   initials: 'RM', color: '#10B981', role: 'DevOps Engineer',
    skills: [
      { memberId: 'a2', name: 'Kubernetes / Docker', level: 'EXPERT' },
      { memberId: 'a2', name: 'AWS / Cloud',          level: 'EXPERT' },
      { memberId: 'a2', name: 'Python / Automation',  level: 'EXPERT' },
    ],
    kimmLine: 'DevOps coverage is excellent. 8 Kubernetes tickets assigned this quarter — highest on team.',
  },
  {
    id: 'a3', name: 'Priya Nair',    initials: 'PN', color: '#8B5CF6', role: 'DB Engineer',
    skills: [
      { memberId: 'a3', name: 'PostgreSQL / DB', level: 'EXPERT' },
      { memberId: 'a3', name: 'Linux / Shell',   level: 'INTERMEDIATE' },
      { memberId: 'a3', name: 'AWS / Cloud',     level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Only expert in DB. Bus-factor risk — recommend cross-training Vikram on PostgreSQL basics.',
  },
  {
    id: 'a4', name: 'Vikram Sharma', initials: 'VS', color: '#F59E0B', role: 'Support Engineer',
    skills: [
      { memberId: 'a4', name: 'AV / Hardware',  level: 'EXPERT' },
      { memberId: 'a4', name: 'Linux / Shell',  level: 'BEGINNER' },
      { memberId: 'a4', name: 'Okta / IAM',     level: 'BEGINNER' },
    ],
    kimmLine: 'Sole AV expert — valuable. Develop Linux to Intermediate to handle more incident types.',
  },
  {
    id: 'a5', name: 'Kavya Reddy',   initials: 'KR', color: '#6366F1', role: 'IT Specialist',
    skills: [
      { memberId: 'a5', name: 'Exchange / M365', level: 'EXPERT' },
      { memberId: 'a5', name: 'Okta / IAM',      level: 'INTERMEDIATE' },
    ],
    kimmLine: 'M365 coverage strong. Security/SIEM gap on team — consider Splunk fundamentals training.',
  },
]

export function ITSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">IT Skills & Coverage</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Proficiency catalog, gap analysis, and KIMMP coaching recommendations.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
