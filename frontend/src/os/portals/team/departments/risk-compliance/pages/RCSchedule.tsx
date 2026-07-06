import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['risk-compliance']

const MEMBERS: ScheduleMember[] = [
  { id: 'rc1', name: 'Maya Nair',   initials: 'MN', color: '#B91C1C', role: 'Risk & Compliance Manager' },
  { id: 'rc2', name: 'Arjun Singh', initials: 'AS', color: '#EF4444', role: 'Compliance Analyst' },
]

const SHIFTS: Shift[] = [
  // Maya Nair — MORNING Mon-Fri
  { memberId: 'rc1', day: 0, shiftType: 'MORNING' },
  { memberId: 'rc1', day: 1, shiftType: 'MORNING' },
  { memberId: 'rc1', day: 2, shiftType: 'MORNING' },
  { memberId: 'rc1', day: 3, shiftType: 'MORNING' },
  { memberId: 'rc1', day: 4, shiftType: 'MORNING' },
  // Arjun Singh — MORNING Mon-Thu, AFTERNOON Fri
  { memberId: 'rc2', day: 0, shiftType: 'MORNING' },
  { memberId: 'rc2', day: 1, shiftType: 'MORNING' },
  { memberId: 'rc2', day: 2, shiftType: 'MORNING' },
  { memberId: 'rc2', day: 3, shiftType: 'MORNING' },
  { memberId: 'rc2', day: 4, shiftType: 'AFTERNOON' },
]

export function RCSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#B91C1C20' }}>
          <Calendar className="w-6 h-6" style={{ color: '#B91C1C' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Risk &amp; Compliance Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar for the Risk &amp; Compliance team.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
