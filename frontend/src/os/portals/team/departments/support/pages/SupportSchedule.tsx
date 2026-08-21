import { Calendar } from 'lucide-react'
import { SharedSchedule, type ScheduleMember, type Shift } from '../../shared/SharedSchedule'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['support']

const MEMBERS: ScheduleMember[] = [
  { id: 'b1', name: 'Meera Joshi',  initials: 'MJ', color: '#06B6D4', role: 'Senior Agent' },
  { id: 'b2', name: 'Dev Patel',    initials: 'DP', color: '#10B981', role: 'Support Engineer' },
  { id: 'b3', name: 'Raj Pillai',   initials: 'RP', color: '#8B5CF6', role: 'Support Agent' },
  { id: 'b4', name: 'Nisha Singh',  initials: 'NS', color: '#F59E0B', role: 'Integration Specialist' },
]

const SHIFTS: Shift[] = [
  { memberId: 'b1', day: 0, shiftType: 'MORNING'   }, { memberId: 'b1', day: 1, shiftType: 'MORNING' },
  { memberId: 'b1', day: 2, shiftType: 'MORNING'   }, { memberId: 'b1', day: 3, shiftType: 'MORNING' },
  { memberId: 'b1', day: 4, shiftType: 'MORNING'   },
  { memberId: 'b2', day: 0, shiftType: 'AFTERNOON' }, { memberId: 'b2', day: 1, shiftType: 'AFTERNOON' },
  { memberId: 'b2', day: 2, shiftType: 'AFTERNOON' }, { memberId: 'b2', day: 3, shiftType: 'AFTERNOON' },
  { memberId: 'b2', day: 4, shiftType: 'AFTERNOON' },
  { memberId: 'b3', day: 0, shiftType: 'MORNING'   }, { memberId: 'b3', day: 1, shiftType: 'MORNING' },
  { memberId: 'b3', day: 3, shiftType: 'MORNING'   }, { memberId: 'b3', day: 5, shiftType: 'MORNING' },
  { memberId: 'b3', day: 6, shiftType: 'MORNING'   },
  { memberId: 'b4', day: 1, shiftType: 'MORNING'   }, { memberId: 'b4', day: 2, shiftType: 'MORNING' },
  { memberId: 'b4', day: 3, shiftType: 'AFTERNOON' }, { memberId: 'b4', day: 4, shiftType: 'AFTERNOON' },
  { memberId: 'b4', day: 6, shiftType: 'AFTERNOON' },
]

export function SupportSchedule() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-[#2564ea]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Support Schedule</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly shift calendar with KIMMP demand forecasting.</p>
        </div>
      </div>
      <SharedSchedule config={cfg} members={MEMBERS} shifts={SHIFTS} />
    </div>
  )
}
