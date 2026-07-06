import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['sales']

const SKILLS: SkillEntry[] = [
  { id: 'sl1', name: 'Enterprise Sales',       category: 'Sales',    experts: 1, mid: 1, beginners: 1, demand: 9 },
  { id: 'sl2', name: 'Solution Selling',       category: 'Sales',    experts: 2, mid: 1, beginners: 0, demand: 7 },
  { id: 'sl3', name: 'CRM & Pipeline Mgmt',   category: 'Process',  experts: 1, mid: 2, beginners: 0, demand: 6 },
  { id: 'sl4', name: 'Negotiation',            category: 'Sales',    experts: 1, mid: 0, beginners: 2, demand: 8 },
  { id: 'sl5', name: 'Proposal Writing',       category: 'Process',  experts: 1, mid: 1, beginners: 1, demand: 6 },
]

const MEMBERS: SkillMember[] = [
  { id: 's1', name: 'Arjun Shah',  initials: 'AS', color: '#0EA5E9', role: 'Account Executive',
    skills: [
      { memberId: 's1', name: 'Enterprise Sales', level: 'EXPERT' },
      { memberId: 's1', name: 'Negotiation',       level: 'EXPERT' },
      { memberId: 's1', name: 'Solution Selling',  level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Top enterprise closer. Only expert negotiator in team — bus-factor risk. Recommend Meera shadows next 2 enterprise deals.',
  },
  { id: 's2', name: 'Meera Nair',  initials: 'MN', color: '#8B5CF6', role: 'Account Executive',
    skills: [
      { memberId: 's2', name: 'Solution Selling',  level: 'EXPERT'       },
      { memberId: 's2', name: 'Proposal Writing',  level: 'EXPERT'       },
      { memberId: 's2', name: 'CRM & Pipeline Mgmt', level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Strongest proposal writer — 3 wins directly correlated to proposal quality. Develop negotiation to Expert to reduce Arjun dependency.',
  },
  { id: 's3', name: 'Dev Patel',   initials: 'DP', color: '#10B981', role: 'Account Executive',
    skills: [
      { memberId: 's3', name: 'CRM & Pipeline Mgmt', level: 'EXPERT'       },
      { memberId: 's3', name: 'Solution Selling',     level: 'INTERMEDIATE' },
      { memberId: 's3', name: 'Negotiation',          level: 'BEGINNER'     },
    ],
    kimmLine: 'Best CRM discipline in the team — data quality enables KIMMP accuracy. Priority gap: Negotiation is a beginner — directly linked to 3 lost deals on pricing.',
  },
]

export function SalesSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sales Skills & Coverage</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Proficiency catalog and KIMMP coaching for the sales team.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
