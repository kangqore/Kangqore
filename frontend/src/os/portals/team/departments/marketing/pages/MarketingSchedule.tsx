import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['marketing']

const MEMBERS: ScheduleMember[] = [
  { id: 'mkt1', name: 'Priya Kapoor', initials: 'PK', color: '#EC4899', role: 'Marketing Manager' },
  { id: 'mkt2', name: 'Jamie Walsh',  initials: 'JW', color: '#F472B6', role: 'Content Lead' },
  { id: 'mkt3', name: 'Aisha Patel',  initials: 'AP', color: '#BE185D', role: 'Performance Analyst' },
]

const SHIFTS: Shift[] = [
  // Priya — MORNING Mon-Fri
  { memberId: 'mkt1', day: 0, shiftType: 'MORNING' },
  { memberId: 'mkt1', day: 1, shiftType: 'MORNING' },
  { memberId: 'mkt1', day: 2, shiftType: 'MORNING' },
  { memberId: 'mkt1', day: 3, shiftType: 'MORNING' },
  { memberId: 'mkt1', day: 4, shiftType: 'MORNING' },
  // Jamie — MORNING Mon-Thu, AFTERNOON Friday
  { memberId: 'mkt2', day: 0, shiftType: 'MORNING' },
  { memberId: 'mkt2', day: 1, shiftType: 'MORNING' },
  { memberId: 'mkt2', day: 2, shiftType: 'MORNING' },
  { memberId: 'mkt2', day: 3, shiftType: 'MORNING' },
  { memberId: 'mkt2', day: 4, shiftType: 'AFTERNOON' },
  // Aisha — AFTERNOON Mon-Fri
  { memberId: 'mkt3', day: 0, shiftType: 'AFTERNOON' },
  { memberId: 'mkt3', day: 1, shiftType: 'AFTERNOON' },
  { memberId: 'mkt3', day: 2, shiftType: 'AFTERNOON' },
  { memberId: 'mkt3', day: 3, shiftType: 'AFTERNOON' },
  { memberId: 'mkt3', day: 4, shiftType: 'AFTERNOON' },
]

export function MarketingSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Marketing Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar for the Marketing team.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
