import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['sales']

const MEMBERS: ScheduleMember[] = [
  { id: 's1', name: 'Arjun Shah',   initials: 'AS', color: '#0EA5E9', role: 'Account Executive' },
  { id: 's2', name: 'Meera Nair',   initials: 'MN', color: '#8B5CF6', role: 'Account Executive' },
  { id: 's3', name: 'Dev Patel',    initials: 'DP', color: '#10B981', role: 'Account Executive' },
]

const SHIFTS: Shift[] = [
  { memberId: 's1', day: 0, shiftType: 'MORNING' }, { memberId: 's1', day: 1, shiftType: 'MORNING' },
  { memberId: 's1', day: 2, shiftType: 'MORNING' }, { memberId: 's1', day: 3, shiftType: 'MORNING' },
  { memberId: 's1', day: 4, shiftType: 'MORNING' },
  { memberId: 's2', day: 0, shiftType: 'MORNING' }, { memberId: 's2', day: 1, shiftType: 'MORNING' },
  { memberId: 's2', day: 2, shiftType: 'MORNING' }, { memberId: 's2', day: 3, shiftType: 'MORNING' },
  { memberId: 's2', day: 4, shiftType: 'MORNING' },
  { memberId: 's3', day: 0, shiftType: 'MORNING' }, { memberId: 's3', day: 1, shiftType: 'MORNING' },
  { memberId: 's3', day: 2, shiftType: 'MORNING' }, { memberId: 's3', day: 3, shiftType: 'MORNING' },
  { memberId: 's3', day: 4, shiftType: 'MORNING' },
]

export function SalesSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sales Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar with KIMMP demand forecasting.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
