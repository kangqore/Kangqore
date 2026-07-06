import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['hr']
const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'ER / Employment Law', category: 'People Ops', experts: 1, mid: 1, beginners: 0, demand: 4 },
  { id: 'sk2', name: 'Talent Acquisition',  category: 'People Ops', experts: 1, mid: 0, beginners: 0, demand: 6 },
  { id: 'sk3', name: 'HR Systems (BambooHR)',category:'Systems',    experts: 1, mid: 1, beginners: 0, demand: 5 },
  { id: 'sk4', name: 'Payroll',             category: 'Compliance', experts: 1, mid: 0, beginners: 1, demand: 7 },
  { id: 'sk5', name: 'TUPE / Restructure',  category: 'Compliance', experts: 0, mid: 1, beginners: 0, demand: 2 },
]
const MEMBERS: SkillMember[] = [
  { id: 'hr1', name: 'HRBP Lead',  initials: 'HL', color: '#8B5CF6', role: 'HR Business Partner',
    skills: [{ memberId: 'hr1', name: 'ER / Employment Law', level: 'EXPERT' }, { memberId: 'hr1', name: 'HR Systems (BambooHR)', level: 'EXPERT' }],
    kimmLine: 'ER expert. TUPE gap is team-wide — recommend external specialist or training before next M&A.' },
  { id: 'hr2', name: 'HR Admin',   initials: 'HA', color: '#A78BFA', role: 'HR Administrator',
    skills: [{ memberId: 'hr2', name: 'Payroll', level: 'EXPERT' }, { memberId: 'hr2', name: 'HR Systems (BambooHR)', level: 'INTERMEDIATE' }],
    kimmLine: 'Payroll accuracy 100% this year. Cross-train on talent acquisition to reduce recruiter single-point risk.' },
  { id: 'hr3', name: 'Recruiter',  initials: 'RC', color: '#7C3AED', role: 'Talent Acquisition',
    skills: [{ memberId: 'hr3', name: 'Talent Acquisition', level: 'EXPERT' }, { memberId: 'hr3', name: 'HR Systems (BambooHR)', level: 'INTERMEDIATE' }],
    kimmLine: 'Time-to-hire 5d below target. Develop ER basics to support HRBP during peak periods.' },
]
export function HRSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0"><Award className="w-6 h-6 text-violet-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">HR Skills</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">People Ops proficiency catalog and KIMMP coaching.</p></div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
