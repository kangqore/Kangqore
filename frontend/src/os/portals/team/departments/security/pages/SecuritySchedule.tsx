import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['security']
const MEMBERS: ScheduleMember[] = [
  { id: 'sec1', name: 'Security Lead',    initials: 'SL', color: '#EF4444', role: 'Security Lead' },
  { id: 'sec2', name: 'Security Analyst', initials: 'SA', color: '#F87171', role: 'Sec Analyst' },
]
const SHIFTS: Shift[] = [
  { memberId: 'sec1', day: 0, shiftType: 'MORNING' }, { memberId: 'sec1', day: 1, shiftType: 'MORNING' },
  { memberId: 'sec1', day: 2, shiftType: 'MORNING' }, { memberId: 'sec1', day: 3, shiftType: 'MORNING' },
  { memberId: 'sec1', day: 4, shiftType: 'MORNING' }, { memberId: 'sec1', day: 5, shiftType: 'NIGHT' },
  { memberId: 'sec2', day: 0, shiftType: 'AFTERNOON' }, { memberId: 'sec2', day: 1, shiftType: 'AFTERNOON' },
  { memberId: 'sec2', day: 2, shiftType: 'AFTERNOON' }, { memberId: 'sec2', day: 3, shiftType: 'AFTERNOON' },
  { memberId: 'sec2', day: 4, shiftType: 'AFTERNOON' }, { memberId: 'sec2', day: 6, shiftType: 'MORNING' },
]
export function SecuritySchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0"><Calendar className="w-6 h-6 text-red-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Security Schedule</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">24/7 coverage planning for the security team.</p></div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
