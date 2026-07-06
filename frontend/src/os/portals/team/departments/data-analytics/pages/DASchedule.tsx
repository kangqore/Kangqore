import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['data-analytics']

const MEMBERS: ScheduleMember[] = [
  { id: 'da1', name: 'Vikram Rao',   initials: 'VR', color: '#0284C7', role: 'Head of Data & Analytics' },
  { id: 'da2', name: 'Deepa Menon', initials: 'DM', color: '#38BDF8', role: 'Senior Data Analyst' },
  { id: 'da3', name: 'Cyrus Irani', initials: 'CI', color: '#6366F1', role: 'Data Engineer' },
]

const SHIFTS: Shift[] = [
  // Vikram Rao — MORNING Mon-Fri
  { memberId: 'da1', day: 0, shiftType: 'MORNING' },
  { memberId: 'da1', day: 1, shiftType: 'MORNING' },
  { memberId: 'da1', day: 2, shiftType: 'MORNING' },
  { memberId: 'da1', day: 3, shiftType: 'MORNING' },
  { memberId: 'da1', day: 4, shiftType: 'MORNING' },
  // Deepa Menon — MORNING Mon-Thu, LEAVE Fri
  { memberId: 'da2', day: 0, shiftType: 'MORNING' },
  { memberId: 'da2', day: 1, shiftType: 'MORNING' },
  { memberId: 'da2', day: 2, shiftType: 'MORNING' },
  { memberId: 'da2', day: 3, shiftType: 'MORNING' },
  { memberId: 'da2', day: 4, shiftType: 'LEAVE' },
  // Cyrus Irani — AFTERNOON Mon-Fri
  { memberId: 'da3', day: 0, shiftType: 'AFTERNOON' },
  { memberId: 'da3', day: 1, shiftType: 'AFTERNOON' },
  { memberId: 'da3', day: 2, shiftType: 'AFTERNOON' },
  { memberId: 'da3', day: 3, shiftType: 'AFTERNOON' },
  { memberId: 'da3', day: 4, shiftType: 'AFTERNOON' },
]

export function DASchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#0284C720' }}>
          <Calendar className="w-6 h-6" style={{ color: '#0284C7' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Data &amp; Analytics Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar for the Data &amp; Analytics team.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
