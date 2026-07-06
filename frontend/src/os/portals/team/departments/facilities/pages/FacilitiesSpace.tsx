import { MapPin } from 'lucide-react'

const ACCENT = '#F97316'

interface LocationData {
  name: string
  floors: number
  desks: number
  occupied: number
}

const LOCATIONS: LocationData[] = [
  { name: 'London HQ (Canary Wharf)', floors: 4, desks: 94,  occupied: 73 },
  { name: 'Manchester Office',         floors: 2, desks: 24,  occupied: 18 },
]

interface MeetingRoom {
  name: string
  location: string
  capacity: number
  avgBookings: number
  utilisation: string
  status: 'ACTIVE' | 'UNDERUTILISED' | 'UNDER_MAINTENANCE'
}

const MEETING_ROOMS: MeetingRoom[] = [
  { name: 'Atlas',      location: 'Floor 1, LHQ',  capacity: 12, avgBookings: 8.1, utilisation: '82%', status: 'ACTIVE'           },
  { name: 'Voyager',    location: 'Floor 2, LHQ',  capacity: 8,  avgBookings: 6.4, utilisation: '68%', status: 'ACTIVE'           },
  { name: 'Meridian',   location: 'Floor 2, LHQ',  capacity: 6,  avgBookings: 4.2, utilisation: '51%', status: 'UNDERUTILISED'    },
  { name: 'Pinnacle',   location: 'Floor 3, LHQ',  capacity: 20, avgBookings: 7.8, utilisation: '79%', status: 'ACTIVE'           },
  { name: 'Zenith',     location: 'Floor 3, LHQ',  capacity: 4,  avgBookings: 2.1, utilisation: '28%', status: 'UNDERUTILISED'    },
  { name: 'Apex',       location: 'Floor 4, LHQ',  capacity: 10, avgBookings: 6.9, utilisation: '70%', status: 'ACTIVE'           },
  { name: 'Summit',     location: 'MCR Office',     capacity: 8,  avgBookings: 5.8, utilisation: '61%', status: 'ACTIVE'           },
  { name: 'Cascade',    location: 'MCR Office',     capacity: 4,  avgBookings: 1.8, utilisation: '24%', status: 'UNDERUTILISED'    },
]

interface SpaceRequest {
  id: string
  requestor: string
  description: string
  status: string
  submitted: string
}

const SPACE_REQUESTS: SpaceRequest[] = [
  { id: 'SR-0041', requestor: 'Marketing Dept',    description: 'Additional 6 desks for Q3 campaign headcount uplift — Floor 3',  status: 'PENDING',     submitted: '18 Jun 2026' },
  { id: 'SR-0040', requestor: 'Supply Chain Dept', description: 'Dedicated pod (4 desks) for new MfG ops team — Floor 1',         status: 'IN_REVIEW',   submitted: '14 Jun 2026' },
]

const ROOM_STATUS_COLOR: Record<MeetingRoom['status'], string> = {
  ACTIVE:             '#10B981',
  UNDERUTILISED:      '#F59E0B',
  UNDER_MAINTENANCE:  '#EF4444',
}

export function FacilitiesSpace() {
  const totalCapacity = LOCATIONS.reduce((a, l) => a + l.desks, 0) + 17 // incl. remote
  const occupied      = LOCATIONS.reduce((a, l) => a + l.occupied, 0)
  const meetingRooms  = MEETING_ROOMS.length
  const underUtilised = MEETING_ROOMS.filter(r => r.status === 'UNDERUTILISED').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <MapPin size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Space Management</h1>
          <p className="text-sm text-[var(--os-text-2)]">Desk occupancy, meeting rooms, and space requests across all sites</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Capacity',   value: String(totalCapacity), color: ACCENT    },
          { label: 'Occupied',         value: `${occupied} (77%)`,   color: '#10B981' },
          { label: 'Meeting Rooms',    value: String(meetingRooms),  color: '#8B5CF6' },
          { label: 'Parking Spaces',   value: '24',                  color: '#06B6D4' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Location Breakdown */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Site Occupancy</p>
        {LOCATIONS.map(loc => {
          const pct = Math.round((loc.occupied / loc.desks) * 100)
          return (
            <div key={loc.name} className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">{loc.name}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">{loc.floors} floors · {loc.desks} desks</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: pct > 85 ? '#EF4444' : pct > 70 ? '#F59E0B' : '#10B981' }}>{pct}%</p>
                  <p className="text-xs text-[var(--os-text-2)]">{loc.occupied} / {loc.desks} occupied</p>
                </div>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: pct > 85 ? '#EF4444' : pct > 70 ? '#F59E0B' : '#10B981' }}
                />
              </div>
            </div>
          )
        })}
        <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Remote Workers</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">Fully remote employees (no desk assigned)</p>
          </div>
          <p className="text-2xl font-bold text-[var(--os-text-1)]">17</p>
        </div>
      </div>

      {/* Meeting Rooms */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Meeting Rooms</p>
          <p className="text-xs text-[var(--os-text-2)]">{underUtilised} under-utilised · Avg 6.2 bookings/day</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MEETING_ROOMS.map(room => {
            const sc = ROOM_STATUS_COLOR[room.status]
            return (
              <div
                key={room.name}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{room.name}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">{room.location} · Cap: {room.capacity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{room.avgBookings}/day</p>
                  <p className="text-xs" style={{ color: sc }}>{room.utilisation}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Space Requests */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Pending Space Requests</p>
        {SPACE_REQUESTS.map(req => (
          <div key={req.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-xs font-mono text-[var(--os-text-2)]">{req.id}</p>
              </div>
              <p className="text-sm font-semibold text-white">{req.requestor}</p>
              <p className="text-xs text-[var(--os-text-2)] mt-0.5">{req.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-[var(--os-text-2)]">{req.submitted}</p>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 mt-1 inline-block">
                {req.status === 'IN_REVIEW' ? 'In Review' : req.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
