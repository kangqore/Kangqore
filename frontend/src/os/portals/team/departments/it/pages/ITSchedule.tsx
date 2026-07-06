import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['it']

const MEMBERS: ScheduleMember[] = [
  { id: 'a1', name: 'Arjun Sharma',  initials: 'AS', color: '#2564ea', role: 'Lead Engineer' },
  { id: 'a2', name: 'Rohan Mehta',   initials: 'RM', color: '#10B981', role: 'DevOps Engineer' },
  { id: 'a3', name: 'Priya Nair',    initials: 'PN', color: '#8B5CF6', role: 'DB Engineer' },
  { id: 'a4', name: 'Vikram Sharma', initials: 'VS', color: '#F59E0B', role: 'Support Engineer' },
  { id: 'a5', name: 'Kavya Reddy',   initials: 'KR', color: '#6366F1', role: 'IT Specialist' },
]

const SHIFTS: Shift[] = [
  { memberId: 'a1', day: 0, shiftType: 'MORNING' },
  { memberId: 'a1', day: 1, shiftType: 'MORNING' },
  { memberId: 'a1', day: 2, shiftType: 'MORNING' },
  { memberId: 'a1', day: 3, shiftType: 'MORNING' },
  { memberId: 'a1', day: 4, shiftType: 'MORNING' },
  { memberId: 'a2', day: 0, shiftType: 'AFTERNOON' },
  { memberId: 'a2', day: 1, shiftType: 'AFTERNOON' },
  { memberId: 'a2', day: 2, shiftType: 'AFTERNOON' },
  { memberId: 'a2', day: 3, shiftType: 'AFTERNOON' },
  { memberId: 'a2', day: 4, shiftType: 'AFTERNOON' },
  { memberId: 'a3', day: 0, shiftType: 'MORNING' },
  { memberId: 'a3', day: 2, shiftType: 'MORNING' },
  { memberId: 'a3', day: 3, shiftType: 'MORNING' },
  { memberId: 'a3', day: 4, shiftType: 'MORNING' },
  { memberId: 'a3', day: 5, shiftType: 'NIGHT' },
  { memberId: 'a4', day: 1, shiftType: 'MORNING' },
  { memberId: 'a4', day: 3, shiftType: 'AFTERNOON' },
  { memberId: 'a4', day: 5, shiftType: 'MORNING' },
  { memberId: 'a4', day: 6, shiftType: 'MORNING' },
  { memberId: 'a5', day: 0, shiftType: 'AFTERNOON' },
  { memberId: 'a5', day: 1, shiftType: 'LEAVE' },
  { memberId: 'a5', day: 2, shiftType: 'LEAVE' },
  { memberId: 'a5', day: 3, shiftType: 'LEAVE' },
  { memberId: 'a5', day: 4, shiftType: 'AFTERNOON' },
]

export function ITSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">IT Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar with KIMMP demand forecasting.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
