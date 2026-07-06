import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['procurement']

const MEMBERS: ScheduleMember[] = [
  { id: 'proc1', name: 'Aarav Patel',  initials: 'AP', color: '#7C3AED', role: 'Senior Procurement Manager' },
  { id: 'proc2', name: 'Nisha Kapoor', initials: 'NK', color: '#A78BFA', role: 'Procurement Analyst' },
]

const SHIFTS: Shift[] = [
  // Aarav Patel — MORNING Mon-Fri
  { memberId: 'proc1', day: 0, shiftType: 'MORNING' },
  { memberId: 'proc1', day: 1, shiftType: 'MORNING' },
  { memberId: 'proc1', day: 2, shiftType: 'MORNING' },
  { memberId: 'proc1', day: 3, shiftType: 'MORNING' },
  { memberId: 'proc1', day: 4, shiftType: 'MORNING' },
  // Nisha Kapoor — AFTERNOON Mon-Fri
  { memberId: 'proc2', day: 0, shiftType: 'AFTERNOON' },
  { memberId: 'proc2', day: 1, shiftType: 'AFTERNOON' },
  { memberId: 'proc2', day: 2, shiftType: 'AFTERNOON' },
  { memberId: 'proc2', day: 3, shiftType: 'AFTERNOON' },
  { memberId: 'proc2', day: 4, shiftType: 'AFTERNOON' },
]

export function ProcSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#7C3AED20' }}>
          <Calendar className="w-6 h-6" style={{ color: '#7C3AED' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Procurement Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar for the Procurement team.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
