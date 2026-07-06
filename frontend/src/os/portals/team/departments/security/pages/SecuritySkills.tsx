import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['security']
const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Threat Intelligence',   category: 'Detection',    experts: 1, mid: 1, beginners: 0, demand: 5 },
  { id: 'sk2', name: 'SIEM / Splunk',          category: 'Detection',    experts: 1, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk3', name: 'Vulnerability Mgmt',     category: 'Assessment',   experts: 1, mid: 1, beginners: 0, demand: 6 },
  { id: 'sk4', name: 'Penetration Testing',    category: 'Assessment',   experts: 1, mid: 0, beginners: 0, demand: 4 },
  { id: 'sk5', name: 'GDPR / Compliance',      category: 'Compliance',   experts: 1, mid: 1, beginners: 0, demand: 5 },
  { id: 'sk6', name: 'Cloud Security (AWS)',   category: 'Cloud',        experts: 0, mid: 1, beginners: 0, demand: 6 },
]
const MEMBERS: SkillMember[] = [
  { id: 'sec1', name: 'Security Lead',    initials: 'SL', color: '#EF4444', role: 'Security Lead',
    skills: [{ memberId: 'sec1', name: 'GDPR / Compliance', level: 'EXPERT' }, { memberId: 'sec1', name: 'Threat Intelligence', level: 'EXPERT' }, { memberId: 'sec1', name: 'SIEM / Splunk', level: 'EXPERT' }],
    kimmLine: 'Breadth expert. Cloud security gap — recommend AWS Security Specialty certification.' },
  { id: 'sec2', name: 'Security Analyst', initials: 'SA', color: '#F87171', role: 'Sec Analyst',
    skills: [{ memberId: 'sec2', name: 'Vulnerability Mgmt', level: 'EXPERT' }, { memberId: 'sec2', name: 'Penetration Testing', level: 'EXPERT' }, { memberId: 'sec2', name: 'SIEM / Splunk', level: 'INTERMEDIATE' }],
    kimmLine: 'Strong assessment profile. Cloud Security gap is team-wide risk — prioritise upskilling.' },
]
export function SecuritySkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0"><Award className="w-6 h-6 text-red-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Security Skills</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Proficiency catalog, gap analysis, and KIMMP coaching for the security team.</p></div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
