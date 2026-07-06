import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['facilities']
const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'HVAC / Mechanical',     category: 'Maintenance', experts: 1, mid: 0, beginners: 0, demand: 6 },
  { id: 'sk2', name: 'Electrical Safety',     category: 'Maintenance', experts: 1, mid: 1, beginners: 0, demand: 5 },
  { id: 'sk3', name: 'Space Planning',        category: 'Operations',  experts: 1, mid: 0, beginners: 0, demand: 4 },
  { id: 'sk4', name: 'Lease Management',      category: 'Operations',  experts: 1, mid: 0, beginners: 0, demand: 3 },
  { id: 'sk5', name: 'Health & Safety',       category: 'Compliance',  experts: 1, mid: 1, beginners: 0, demand: 5 },
  { id: 'sk6', name: 'Energy Management',     category: 'Sustainability',experts: 0, mid: 1, beginners: 1, demand: 4 },
]
const MEMBERS: SkillMember[] = [
  { id: 'fac1', name: 'Facilities Manager', initials: 'FM', color: '#F97316', role: 'Facilities Manager',
    skills: [{ memberId: 'fac1', name: 'Lease Management', level: 'EXPERT' }, { memberId: 'fac1', name: 'Health & Safety', level: 'EXPERT' }, { memberId: 'fac1', name: 'Space Planning', level: 'EXPERT' }],
    kimmLine: 'Strong compliance and management. Energy Management gap — develop or hire for ESG reporting.' },
  { id: 'fac2', name: 'Maintenance Lead',   initials: 'ML', color: '#FB923C', role: 'Maintenance Technician',
    skills: [{ memberId: 'fac2', name: 'HVAC / Mechanical', level: 'EXPERT' }, { memberId: 'fac2', name: 'Electrical Safety', level: 'EXPERT' }, { memberId: 'fac2', name: 'Health & Safety', level: 'INTERMEDIATE' }],
    kimmLine: 'Critical mechanical expertise. Sole HVAC expert — bus-factor risk. Cross-train backup.' },
  { id: 'fac3', name: 'Space Coordinator',  initials: 'SC', color: '#EA580C', role: 'Space Coordinator',
    skills: [{ memberId: 'fac3', name: 'Space Planning', level: 'EXPERT' }, { memberId: 'fac3', name: 'Energy Management', level: 'INTERMEDIATE' }],
    kimmLine: 'Space analytics expert. Energy Management developing — position as ESG data lead.' },
]
export function FacilitiesSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0"><Award className="w-6 h-6 text-orange-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Facilities Skills</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Facilities team proficiency and KIMMP coaching.</p></div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
