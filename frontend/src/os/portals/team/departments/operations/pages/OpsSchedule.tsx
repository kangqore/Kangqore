import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['operations']

const MEMBERS: ScheduleMember[] = [
  { id: 'ops1', name: 'Suresh Nambiar', initials: 'SN', color: '#16A34A', role: 'Head of Operations' },
  { id: 'ops2', name: 'Leela Krishnan', initials: 'LK', color: '#4ADE80', role: 'Operations Manager' },
]

const SHIFTS: Shift[] = [
  // Suresh Nambiar — MORNING Mon-Fri
  { memberId: 'ops1', day: 0, shiftType: 'MORNING' },
  { memberId: 'ops1', day: 1, shiftType: 'MORNING' },
  { memberId: 'ops1', day: 2, shiftType: 'MORNING' },
  { memberId: 'ops1', day: 3, shiftType: 'MORNING' },
  { memberId: 'ops1', day: 4, shiftType: 'MORNING' },
  // Leela Krishnan — MORNING Mon-Thu, AFTERNOON Fri
  { memberId: 'ops2', day: 0, shiftType: 'MORNING' },
  { memberId: 'ops2', day: 1, shiftType: 'MORNING' },
  { memberId: 'ops2', day: 2, shiftType: 'MORNING' },
  { memberId: 'ops2', day: 3, shiftType: 'MORNING' },
  { memberId: 'ops2', day: 4, shiftType: 'AFTERNOON' },
]

export function OpsSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#16A34A20' }}>
          <Calendar className="w-6 h-6" style={{ color: '#16A34A' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operations Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar for the Operations team.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
