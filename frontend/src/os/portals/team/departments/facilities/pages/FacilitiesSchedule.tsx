import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['facilities']
const MEMBERS: ScheduleMember[] = [
  { id: 'fac1', name: 'Facilities Manager', initials: 'FM', color: '#F97316', role: 'Facilities Manager' },
  { id: 'fac2', name: 'Maintenance Lead',   initials: 'ML', color: '#FB923C', role: 'Maintenance Technician' },
  { id: 'fac3', name: 'Space Coordinator',  initials: 'SC', color: '#EA580C', role: 'Space Coordinator' },
]
const SHIFTS: Shift[] = [
  { memberId: 'fac1', day: 0, shiftType: 'MORNING' }, { memberId: 'fac1', day: 1, shiftType: 'MORNING' },
  { memberId: 'fac1', day: 2, shiftType: 'MORNING' }, { memberId: 'fac1', day: 3, shiftType: 'MORNING' },
  { memberId: 'fac1', day: 4, shiftType: 'MORNING' },
  { memberId: 'fac2', day: 0, shiftType: 'MORNING' }, { memberId: 'fac2', day: 1, shiftType: 'MORNING' },
  { memberId: 'fac2', day: 2, shiftType: 'MORNING' }, { memberId: 'fac2', day: 3, shiftType: 'MORNING' },
  { memberId: 'fac2', day: 4, shiftType: 'MORNING' }, { memberId: 'fac2', day: 5, shiftType: 'MORNING' },
  { memberId: 'fac3', day: 0, shiftType: 'MORNING' }, { memberId: 'fac3', day: 1, shiftType: 'MORNING' },
  { memberId: 'fac3', day: 2, shiftType: 'MORNING' }, { memberId: 'fac3', day: 3, shiftType: 'MORNING' },
  { memberId: 'fac3', day: 4, shiftType: 'MORNING' },
]
export function FacilitiesSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0"><Calendar className="w-6 h-6 text-orange-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Facilities Schedule</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Maintenance coverage, inspections, and space management shifts.</p></div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
