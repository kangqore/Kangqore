import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['data-analytics']

const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'SQL & Data Modelling',    category: 'Engineering', experts: 2, mid: 1, beginners: 0, demand: 9 },
  { id: 'sk2', name: 'Python/R Analytics',      category: 'Analytics',  experts: 1, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk3', name: 'BI Tools (Tableau/Looker)',category: 'BI',         experts: 1, mid: 2, beginners: 0, demand: 8 },
  { id: 'sk4', name: 'Data Engineering',        category: 'Engineering', experts: 0, mid: 1, beginners: 0, demand: 9 },
  { id: 'sk5', name: 'ML & Forecasting',        category: 'ML',          experts: 0, mid: 1, beginners: 1, demand: 8 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'da1', name: 'Vikram Rao', initials: 'VR', color: '#0284C7', role: 'Head of Data & Analytics',
    skills: [
      { memberId: 'da1', name: 'SQL & Data Modelling',     level: 'EXPERT' },
      { memberId: 'da1', name: 'BI Tools (Tableau/Looker)', level: 'EXPERT' },
      { memberId: 'da1', name: 'Python/R Analytics',       level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Strong BI and SQL expertise anchoring the team. Data Engineering is the strategic gap — Cyrus covers infrastructure but no expert-level data pipeline engineering. Investment in dbt or Airflow capability would eliminate the manual Excel pipeline risk and significantly improve data reliability.',
  },
  {
    id: 'da2', name: 'Deepa Menon', initials: 'DM', color: '#38BDF8', role: 'Senior Data Analyst',
    skills: [
      { memberId: 'da2', name: 'Python/R Analytics',        level: 'EXPERT' },
      { memberId: 'da2', name: 'ML & Forecasting',          level: 'INTERMEDIATE' },
      { memberId: 'da2', name: 'SQL & Data Modelling',      level: 'EXPERT' },
      { memberId: 'da2', name: 'BI Tools (Tableau/Looker)', level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Dual expert in Python and SQL — the highest-value skill combination on the team. ML & Forecasting is growing; accelerate by taking the churn model to 88%+ accuracy. Deepa is the sole Python Expert — single-point-of-failure risk on the ML programme if leave is taken.',
  },
  {
    id: 'da3', name: 'Cyrus Irani', initials: 'CI', color: '#6366F1', role: 'Data Engineer',
    skills: [
      { memberId: 'da3', name: 'Data Engineering',       level: 'INTERMEDIATE' },
      { memberId: 'da3', name: 'SQL & Data Modelling',   level: 'EXPERT' },
      { memberId: 'da3', name: 'ML & Forecasting',       level: 'BEGINNER' },
    ],
    kimmLine: 'Data Engineering is Cyrus\'s primary value — the Kafka and streaming infrastructure is solid. Growing towards Expert in Data Engineering would make this team self-sufficient on pipeline development. ML at beginner level is not a priority to develop; focus on data reliability and orchestration instead.',
  },
]

export function DASkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#0284C720' }}>
          <Award className="w-6 h-6" style={{ color: '#0284C7' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Data &amp; Analytics Skills</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Data proficiency catalog, skill gaps, and KIMMP coaching.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
