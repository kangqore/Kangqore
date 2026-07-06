import { Award } from 'lucide-react'
import { SharedSkills, type SkillEntry, type SkillMember } from '../../shared/SharedSkills'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['finance']
const SKILLS: SkillEntry[] = [
  { id: 'sk1', name: 'Management Accounts', category: 'Accounting',  experts: 1, mid: 1, beginners: 0, demand: 5 },
  { id: 'sk2', name: 'Financial Forecasting',category: 'Accounting', experts: 1, mid: 0, beginners: 1, demand: 4 },
  { id: 'sk3', name: 'Accounts Payable',    category: 'Operations',  experts: 1, mid: 0, beginners: 0, demand: 8 },
  { id: 'sk4', name: 'Xero / ERP Systems', category: 'Systems',     experts: 2, mid: 1, beginners: 0, demand: 7 },
  { id: 'sk5', name: 'Tax / VAT',           category: 'Compliance',  experts: 0, mid: 1, beginners: 1, demand: 4 },
]
const MEMBERS: SkillMember[] = [
  { id: 'f1', name: 'Finance Lead',  initials: 'FL', color: '#10B981', role: 'Finance Director',
    skills: [{ memberId: 'f1', name: 'Management Accounts', level: 'EXPERT' }, { memberId: 'f1', name: 'Financial Forecasting', level: 'EXPERT' }, { memberId: 'f1', name: 'Xero / ERP Systems', level: 'EXPERT' }],
    kimmLine: 'Forecasting expert. Tax/VAT gap — consider external adviser or train Accountant.' },
  { id: 'f2', name: 'Accountant',   initials: 'AC', color: '#34D399', role: 'Management Accountant',
    skills: [{ memberId: 'f2', name: 'Management Accounts', level: 'INTERMEDIATE' }, { memberId: 'f2', name: 'Xero / ERP Systems', level: 'EXPERT' }, { memberId: 'f2', name: 'Tax / VAT', level: 'INTERMEDIATE' }],
    kimmLine: 'Strong ERP and accounts skills. Grow tax competency to reduce single-point risk.' },
  { id: 'f3', name: 'AP Specialist', initials: 'AP', color: '#6EE7B7', role: 'Accounts Payable',
    skills: [{ memberId: 'f3', name: 'Accounts Payable', level: 'EXPERT' }],
    kimmLine: 'AP expert handling 312 invoices/period. ERP upskill would enable month-end support.' },
]
export function FinanceSkills() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0"><Award className="w-6 h-6 text-emerald-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Finance Skills</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Finance team proficiency and KIMMP coaching.</p></div>
      </div>
      <SharedSkills config={cfg} skills={SKILLS} members={MEMBERS} />
    </div>
  )
}
