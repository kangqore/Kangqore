import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['legal']
const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Contract Negotiation', category: 'Legal',      experts: 2, mid: 1, beginners: 0, demand: 8 },
  { id: 'sk2', name: 'Employment Law',        category: 'Legal',      experts: 1, mid: 0, beginners: 1, demand: 4 },
  { id: 'sk3', name: 'Data Privacy / GDPR',   category: 'Compliance', experts: 1, mid: 1, beginners: 0, demand: 6 },
  { id: 'sk4', name: 'IP / Trademarks',       category: 'Legal',      experts: 0, mid: 1, beginners: 0, demand: 3 },
  { id: 'sk5', name: 'Corporate / M&A',       category: 'Legal',      experts: 1, mid: 0, beginners: 0, demand: 2 },
]
const MEMBERS: SkillMember[] = [
  { id: 'l1', name: 'General Counsel', initials: 'GC', color: '#F59E0B', role: 'General Counsel',
    skills: [{ memberId: 'l1', name: 'Contract Negotiation', level: 'EXPERT' }, { memberId: 'l1', name: 'Corporate / M&A', level: 'EXPERT' }, { memberId: 'l1', name: 'Data Privacy / GDPR', level: 'EXPERT' }],
    kimmLine: 'Broad legal expertise. IP gap at team level — recommend external specialist for trademark filing.' },
  { id: 'l2', name: 'Legal Counsel',   initials: 'LC', color: '#FBBF24', role: 'Legal Counsel',
    skills: [{ memberId: 'l2', name: 'Contract Negotiation', level: 'EXPERT' }, { memberId: 'l2', name: 'Employment Law', level: 'EXPERT' }, { memberId: 'l2', name: 'Data Privacy / GDPR', level: 'INTERMEDIATE' }],
    kimmLine: 'Contract and employment law expert. GDPR depth would make full DPO coverage possible.' },
  { id: 'l3', name: 'Paralegal',       initials: 'PL', color: '#D97706', role: 'Paralegal',
    skills: [{ memberId: 'l3', name: 'Contract Negotiation', level: 'INTERMEDIATE' }, { memberId: 'l3', name: 'IP / Trademarks', level: 'INTERMEDIATE' }],
    kimmLine: 'Strong paralegal fundamentals. IP skill is unique on team — route trademark queries to Paralegal.' },
]
export function LegalSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0"><Award className="w-6 h-6 text-amber-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Legal Skills</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Legal team proficiency and KIMMP coaching.</p></div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
