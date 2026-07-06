import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['supply-chain']
const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Supplier Negotiation', category: 'Procurement',   experts: 1, mid: 1, beginners: 0, demand: 7 },
  { id: 'sk2', name: 'ERP / SAP',            category: 'Systems',       experts: 2, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk3', name: 'Demand Forecasting',   category: 'Planning',      experts: 1, mid: 1, beginners: 0, demand: 6 },
  { id: 'sk4', name: 'Customs / Trade',      category: 'Logistics',     experts: 0, mid: 1, beginners: 1, demand: 4 },
  { id: 'sk5', name: 'Quality Management',   category: 'Operations',    experts: 1, mid: 1, beginners: 0, demand: 5 },
  { id: 'sk6', name: 'Logistics / 3PL',      category: 'Logistics',     experts: 1, mid: 1, beginners: 0, demand: 6 },
]
const MEMBERS: SkillMember[] = [
  { id: 'sc1', name: 'Supply Chain Lead', initials: 'SL', color: '#6366F1', role: 'Supply Chain Director',
    skills: [{ memberId: 'sc1', name: 'Demand Forecasting', level: 'EXPERT' }, { memberId: 'sc1', name: 'Supplier Negotiation', level: 'EXPERT' }, { memberId: 'sc1', name: 'ERP / SAP', level: 'EXPERT' }],
    kimmLine: 'Forecasting and negotiation lead. Customs gap — critical for cross-border expansion plans.' },
  { id: 'sc2', name: 'Procurement Mgr',  initials: 'PM', color: '#818CF8', role: 'Procurement Manager',
    skills: [{ memberId: 'sc2', name: 'Supplier Negotiation', level: 'INTERMEDIATE' }, { memberId: 'sc2', name: 'ERP / SAP', level: 'EXPERT' }, { memberId: 'sc2', name: 'Quality Management', level: 'EXPERT' }],
    kimmLine: 'Quality and ERP strength. Develop negotiation to Expert — £42K savings shows commercial aptitude.' },
  { id: 'sc3', name: 'Logistics Coord',  initials: 'LC', color: '#4F46E5', role: 'Logistics Coordinator',
    skills: [{ memberId: 'sc3', name: 'Logistics / 3PL', level: 'EXPERT' }, { memberId: 'sc3', name: 'Customs / Trade', level: 'INTERMEDIATE' }],
    kimmLine: 'Strong logistics execution. Customs skill is the only coverage — prioritise growing this capability.' },
]
export function SupplyChainSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0"><Award className="w-6 h-6 text-indigo-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Supply Chain Skills</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Team proficiency catalog and KIMMP coaching.</p></div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
