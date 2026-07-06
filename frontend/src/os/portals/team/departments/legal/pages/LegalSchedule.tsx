import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['legal']
const MEMBERS: ScheduleMember[] = [
  { id: 'l1', name: 'General Counsel', initials: 'GC', color: '#F59E0B', role: 'General Counsel' },
  { id: 'l2', name: 'Legal Counsel',   initials: 'LC', color: '#FBBF24', role: 'Legal Counsel' },
  { id: 'l3', name: 'Paralegal',       initials: 'PL', color: '#D97706', role: 'Paralegal' },
]
const SHIFTS: Shift[] = [
  { memberId: 'l1', day: 0, shiftType: 'MORNING' }, { memberId: 'l1', day: 1, shiftType: 'MORNING' },
  { memberId: 'l1', day: 2, shiftType: 'MORNING' }, { memberId: 'l1', day: 3, shiftType: 'MORNING' },
  { memberId: 'l1', day: 4, shiftType: 'MORNING' },
  { memberId: 'l2', day: 0, shiftType: 'MORNING' }, { memberId: 'l2', day: 1, shiftType: 'MORNING' },
  { memberId: 'l2', day: 2, shiftType: 'MORNING' }, { memberId: 'l2', day: 3, shiftType: 'MORNING' },
  { memberId: 'l2', day: 4, shiftType: 'MORNING' },
  { memberId: 'l3', day: 0, shiftType: 'MORNING' }, { memberId: 'l3', day: 1, shiftType: 'MORNING' },
  { memberId: 'l3', day: 2, shiftType: 'MORNING' }, { memberId: 'l3', day: 3, shiftType: 'LEAVE' },
  { memberId: 'l3', day: 4, shiftType: 'LEAVE' },
]
export function LegalSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0"><Calendar className="w-6 h-6 text-amber-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Legal Schedule</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Legal team availability and compliance deadline planning.</p></div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
