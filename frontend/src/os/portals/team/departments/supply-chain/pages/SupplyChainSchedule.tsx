import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['supply-chain']
const MEMBERS: ScheduleMember[] = [
  { id: 'sc1', name: 'Supply Chain Lead', initials: 'SL', color: '#6366F1', role: 'Supply Chain Director' },
  { id: 'sc2', name: 'Procurement Mgr',  initials: 'PM', color: '#818CF8', role: 'Procurement Manager' },
  { id: 'sc3', name: 'Logistics Coord',  initials: 'LC', color: '#4F46E5', role: 'Logistics Coordinator' },
]
const SHIFTS: Shift[] = [
  { memberId: 'sc1', day: 0, shiftType: 'MORNING' }, { memberId: 'sc1', day: 1, shiftType: 'MORNING' },
  { memberId: 'sc1', day: 2, shiftType: 'MORNING' }, { memberId: 'sc1', day: 3, shiftType: 'MORNING' },
  { memberId: 'sc1', day: 4, shiftType: 'MORNING' },
  { memberId: 'sc2', day: 0, shiftType: 'MORNING' }, { memberId: 'sc2', day: 1, shiftType: 'MORNING' },
  { memberId: 'sc2', day: 2, shiftType: 'MORNING' }, { memberId: 'sc2', day: 3, shiftType: 'MORNING' },
  { memberId: 'sc2', day: 4, shiftType: 'MORNING' },
  { memberId: 'sc3', day: 0, shiftType: 'MORNING' }, { memberId: 'sc3', day: 1, shiftType: 'MORNING' },
  { memberId: 'sc3', day: 2, shiftType: 'MORNING' }, { memberId: 'sc3', day: 3, shiftType: 'AFTERNOON' },
  { memberId: 'sc3', day: 4, shiftType: 'AFTERNOON' },{ memberId: 'sc3', day: 5, shiftType: 'MORNING' },
]
export function SupplyChainSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0"><Calendar className="w-6 h-6 text-indigo-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Supply Chain Schedule</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Production and logistics shift planning.</p></div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
