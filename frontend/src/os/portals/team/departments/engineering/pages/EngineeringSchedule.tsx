import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['engineering']

const MEMBERS: ScheduleMember[] = [
  { id: 'a1', name: 'Siddharth R', initials: 'SR', color: '#84CC16', role: 'Lead Engineer' },
  { id: 'a2', name: 'Kavya N',     initials: 'KN', color: '#10B981', role: 'Backend Engineer' },
  { id: 'a3', name: 'Aryan M',     initials: 'AM', color: '#F59E0B', role: 'Frontend Engineer' },
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
  { memberId: 'a2', day: 4, shiftType: 'MORNING' },
  { memberId: 'a3', day: 0, shiftType: 'AFTERNOON' },
  { memberId: 'a3', day: 1, shiftType: 'AFTERNOON' },
  { memberId: 'a3', day: 2, shiftType: 'AFTERNOON' },
  { memberId: 'a3', day: 3, shiftType: 'MORNING' },
  { memberId: 'a3', day: 4, shiftType: 'MORNING' },
  { memberId: 'a1', day: 5, shiftType: 'NIGHT' },
  { memberId: 'a2', day: 6, shiftType: 'NIGHT' },
]

export function EngineeringSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-lime-500/20 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-lime-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Engineering Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar with KIMMP deployment window forecasting.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
