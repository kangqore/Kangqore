import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['finance']
const MEMBERS: ScheduleMember[] = [
  { id: 'f1', name: 'Finance Lead',   initials: 'FL', color: '#10B981', role: 'Finance Director' },
  { id: 'f2', name: 'Accountant',     initials: 'AC', color: '#34D399', role: 'Management Accountant' },
  { id: 'f3', name: 'AP Specialist',  initials: 'AP', color: '#6EE7B7', role: 'Accounts Payable' },
]
const SHIFTS: Shift[] = [
  { memberId: 'f1', day: 0, shiftType: 'MORNING' }, { memberId: 'f1', day: 1, shiftType: 'MORNING' },
  { memberId: 'f1', day: 2, shiftType: 'MORNING' }, { memberId: 'f1', day: 3, shiftType: 'MORNING' },
  { memberId: 'f1', day: 4, shiftType: 'MORNING' },
  { memberId: 'f2', day: 0, shiftType: 'MORNING' }, { memberId: 'f2', day: 1, shiftType: 'MORNING' },
  { memberId: 'f2', day: 2, shiftType: 'MORNING' }, { memberId: 'f2', day: 3, shiftType: 'MORNING' },
  { memberId: 'f2', day: 4, shiftType: 'MORNING' },
  { memberId: 'f3', day: 0, shiftType: 'MORNING' }, { memberId: 'f3', day: 1, shiftType: 'MORNING' },
  { memberId: 'f3', day: 2, shiftType: 'MORNING' }, { memberId: 'f3', day: 3, shiftType: 'MORNING' },
  { memberId: 'f3', day: 4, shiftType: 'MORNING' },
]
export function FinanceSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0"><Calendar className="w-6 h-6 text-emerald-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Finance Schedule</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Finance team availability and month-end coverage planning.</p></div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
