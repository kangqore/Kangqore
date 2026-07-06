import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['ai-automation']

const MEMBERS: ScheduleMember[] = [
  { id: 'ai1', name: 'Rohan Gupta',  initials: 'RG', color: '#D946EF', role: 'AI & Automation Lead' },
  { id: 'ai2', name: 'Priya Sharma', initials: 'PS', color: '#E879F9', role: 'AI Governance & ML Engineer' },
]

const SHIFTS: Shift[] = [
  // Rohan Gupta — MORNING Mon-Fri
  { memberId: 'ai1', day: 0, shiftType: 'MORNING' },
  { memberId: 'ai1', day: 1, shiftType: 'MORNING' },
  { memberId: 'ai1', day: 2, shiftType: 'MORNING' },
  { memberId: 'ai1', day: 3, shiftType: 'MORNING' },
  { memberId: 'ai1', day: 4, shiftType: 'MORNING' },
  // Priya Sharma — MORNING Mon-Thu, AFTERNOON Fri
  { memberId: 'ai2', day: 0, shiftType: 'MORNING' },
  { memberId: 'ai2', day: 1, shiftType: 'MORNING' },
  { memberId: 'ai2', day: 2, shiftType: 'MORNING' },
  { memberId: 'ai2', day: 3, shiftType: 'MORNING' },
  { memberId: 'ai2', day: 4, shiftType: 'AFTERNOON' },
]

export function AISchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#D946EF20' }}>
          <Calendar className="w-6 h-6" style={{ color: '#D946EF' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI &amp; Automation Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar for the AI &amp; Automation team.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
