import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['innovation-rd']

const MEMBERS: ScheduleMember[] = [
  { id: 'innov1', name: 'Kiran Mehta', initials: 'KM', color: '#CA8A04', role: 'Head of Innovation' },
  { id: 'innov2', name: 'Ananya Das',  initials: 'AD', color: '#F59E0B', role: 'R&D Engineer' },
]

const SHIFTS: Shift[] = [
  // Kiran Mehta — MORNING Mon-Fri
  { memberId: 'innov1', day: 0, shiftType: 'MORNING' },
  { memberId: 'innov1', day: 1, shiftType: 'MORNING' },
  { memberId: 'innov1', day: 2, shiftType: 'MORNING' },
  { memberId: 'innov1', day: 3, shiftType: 'MORNING' },
  { memberId: 'innov1', day: 4, shiftType: 'MORNING' },
  // Ananya Das — MORNING Mon-Fri
  { memberId: 'innov2', day: 0, shiftType: 'MORNING' },
  { memberId: 'innov2', day: 1, shiftType: 'MORNING' },
  { memberId: 'innov2', day: 2, shiftType: 'MORNING' },
  { memberId: 'innov2', day: 3, shiftType: 'MORNING' },
  { memberId: 'innov2', day: 4, shiftType: 'MORNING' },
]

export function InnovSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#CA8A0420' }}>
          <Calendar className="w-6 h-6" style={{ color: '#CA8A04' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Innovation Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar for the Innovation / R&amp;D team.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
