import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['ai-automation']

const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Prompt Engineering',      category: 'AI',          experts: 2, mid: 0, beginners: 0, demand: 9 },
  { id: 'sk2', name: 'LLM Fine-tuning',         category: 'ML',          experts: 0, mid: 0, beginners: 0, demand: 7 },
  { id: 'sk3', name: 'Workflow Automation',      category: 'Engineering', experts: 1, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk4', name: 'AI Governance',           category: 'Governance',  experts: 0, mid: 1, beginners: 0, demand: 7 },
  { id: 'sk5', name: 'ML Ops',                  category: 'Engineering', experts: 0, mid: 1, beginners: 0, demand: 8 },
]

const MEMBERS: SkillMember[] = [
  {
    id: 'ai1', name: 'Rohan Gupta', initials: 'RG', color: '#D946EF', role: 'AI & Automation Lead',
    skills: [
      { memberId: 'ai1', name: 'Prompt Engineering', level: 'EXPERT' },
      { memberId: 'ai1', name: 'Workflow Automation', level: 'EXPERT' },
      { memberId: 'ai1', name: 'ML Ops',              level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Dual Expert in Prompt Engineering and Workflow Automation — the highest-value skill combination for the AI fleet. LLM Fine-tuning is the strategic gap with zero coverage at any level; this limits the team\'s ability to customise models for specialist use cases. Consider a LoRA fine-tuning capability build in H2.',
  },
  {
    id: 'ai2', name: 'Priya Sharma', initials: 'PS', color: '#E879F9', role: 'AI Governance & ML Engineer',
    skills: [
      { memberId: 'ai2', name: 'Prompt Engineering', level: 'EXPERT' },
      { memberId: 'ai2', name: 'AI Governance',      level: 'INTERMEDIATE' },
      { memberId: 'ai2', name: 'ML Ops',             level: 'INTERMEDIATE' },
    ],
    kimmLine: 'Strong prompt engineering skills complementing Rohan. AI Governance is critical given the AEGIS programme scale — develop towards Expert level. The Churn model conditional approval is directly linked to Priya\'s explainability work; prioritise the SHAP analysis to unblock governance approval.',
  },
]

export function AISkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#D946EF20' }}>
          <Award className="w-6 h-6" style={{ color: '#D946EF' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI &amp; Automation Skills</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">AI proficiency catalog, skill gaps, and KIMMP coaching.</p>
        </div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
