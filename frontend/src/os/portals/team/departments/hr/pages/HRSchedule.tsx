import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['hr']
const MEMBERS: ScheduleMember[] = [
  { id: 'hr1', name: 'HRBP Lead',    initials: 'HL', color: '#8B5CF6', role: 'HR Business Partner' },
  { id: 'hr2', name: 'HR Admin',     initials: 'HA', color: '#A78BFA', role: 'HR Administrator' },
  { id: 'hr3', name: 'Recruiter',    initials: 'RC', color: '#7C3AED', role: 'Talent Acquisition' },
]
const SHIFTS: Shift[] = [
  { memberId: 'hr1', day: 0, shiftType: 'MORNING' }, { memberId: 'hr1', day: 1, shiftType: 'MORNING' },
  { memberId: 'hr1', day: 2, shiftType: 'MORNING' }, { memberId: 'hr1', day: 3, shiftType: 'MORNING' },
  { memberId: 'hr1', day: 4, shiftType: 'MORNING' },
  { memberId: 'hr2', day: 0, shiftType: 'MORNING' }, { memberId: 'hr2', day: 1, shiftType: 'MORNING' },
  { memberId: 'hr2', day: 2, shiftType: 'MORNING' }, { memberId: 'hr2', day: 3, shiftType: 'MORNING' },
  { memberId: 'hr2', day: 4, shiftType: 'MORNING' },
  { memberId: 'hr3', day: 0, shiftType: 'MORNING' }, { memberId: 'hr3', day: 1, shiftType: 'MORNING' },
  { memberId: 'hr3', day: 2, shiftType: 'MORNING' }, { memberId: 'hr3', day: 3, shiftType: 'LEAVE' },
  { memberId: 'hr3', day: 4, shiftType: 'LEAVE' },
]
export function HRSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0"><Calendar className="w-6 h-6 text-violet-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">HR Schedule</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar for the People Ops team.</p></div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
