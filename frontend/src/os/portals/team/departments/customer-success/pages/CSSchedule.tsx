import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['customer-success']

const MEMBERS: ScheduleMember[] = [
  { id: 'a1', name: 'Lena Park',  initials: 'LP', color: '#14B8A6', role: 'Senior CSM' },
  { id: 'a2', name: 'Raj Mehta', initials: 'RM', color: '#8B5CF6', role: 'CSM' },
]

const SHIFTS: Shift[] = [
  { memberId: 'a1', day: 0, shiftType: 'MORNING' },
  { memberId: 'a1', day: 1, shiftType: 'MORNING' },
  { memberId: 'a1', day: 2, shiftType: 'MORNING' },
  { memberId: 'a1', day: 3, shiftType: 'MORNING' },
  { memberId: 'a1', day: 4, shiftType: 'MORNING' },
  { memberId: 'a2', day: 0, shiftType: 'MORNING' },
  { memberId: 'a2', day: 1, shiftType: 'MORNING' },
  { memberId: 'a2', day: 2, shiftType: 'MORNING' },
  { memberId: 'a2', day: 3, shiftType: 'MORNING' },
  { memberId: 'a2', day: 4, shiftType: 'AFTERNOON' },
]

export function CSSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CS Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar with KIMMP account coverage forecasting.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
