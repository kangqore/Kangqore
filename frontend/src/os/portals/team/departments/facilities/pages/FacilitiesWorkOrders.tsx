import { useState } from 'react'
import { Wrench } from 'lucide-react'

const ACCENT = '#F97316'

type WOStatus = 'OPEN' | 'IN_PROGRESS' | 'OVERDUE' | 'COMPLETED'

interface WorkOrder {
  id: string
  title: string
  type: string
  location: string
  priority: string
  priorityColor: string
  status: WOStatus
  assignedTo: string
  raised: string
  due: string
}

const WORK_ORDERS: WorkOrder[] = [
  { id: 'WO-0214', title: 'HVAC Unit A — filter replacement',         type: 'HVAC',       location: 'Floor 1, LHQ',       priority: 'HIGH',   priorityColor: '#EF4444', status: 'OVERDUE',     assignedTo: 'AirTech',      raised: '10 Jun', due: '17 Jun' },
  { id: 'WO-0213', title: 'Electrical fault — server room lighting',  type: 'Electrical', location: 'Server Room, LHQ',   priority: 'HIGH',   priorityColor: '#EF4444', status: 'IN_PROGRESS', assignedTo: 'PrimeFix',     raised: '18 Jun', due: '24 Jun' },
  { id: 'WO-0212', title: 'Plumbing leak — 3rd floor kitchen',        type: 'Plumbing',   location: 'Floor 3, LHQ',       priority: 'HIGH',   priorityColor: '#EF4444', status: 'OVERDUE',     assignedTo: 'PrimeFix',     raised: '12 Jun', due: '15 Jun' },
  { id: 'WO-0211', title: 'Security camera offline — entrance gate',  type: 'Security',   location: 'Main Entrance, LHQ', priority: 'MEDIUM', priorityColor: '#F59E0B', status: 'IN_PROGRESS', assignedTo: 'SecureGuard',  raised: '20 Jun', due: '27 Jun' },
  { id: 'WO-0210', title: 'Deep clean — Manchester office, Q2',       type: 'Cleaning',   location: 'MCR Office',         priority: 'LOW',    priorityColor: '#6B7280', status: 'OPEN',        assignedTo: 'CleanPro',     raised: '21 Jun', due: '30 Jun' },
  { id: 'WO-0209', title: 'Desk repair — pod B, warped surface',      type: 'Repair',     location: 'Floor 2, LHQ',       priority: 'LOW',    priorityColor: '#6B7280', status: 'OPEN',        assignedTo: 'PrimeFix',     raised: '19 Jun', due: '03 Jul' },
  { id: 'WO-0207', title: 'IT cabling tidy-up — new desk setup ×4',   type: 'IT',         location: 'Floor 4, LHQ',       priority: 'MEDIUM', priorityColor: '#F59E0B', status: 'OVERDUE',     assignedTo: 'IT Dept',      raised: '08 Jun', due: '20 Jun' },
  { id: 'WO-0204', title: 'Boiler service — annual maintenance',      type: 'HVAC',       location: 'Basement, LHQ',      priority: 'MEDIUM', priorityColor: '#F59E0B', status: 'COMPLETED',   assignedTo: 'AirTech',      raised: '01 Jun', due: '15 Jun' },
]

const STATUS_COLOR: Record<WOStatus, string> = {
  OPEN:        '#2564ea',
  IN_PROGRESS: '#8B5CF6',
  OVERDUE:     '#EF4444',
  COMPLETED:   '#10B981',
}

const TYPE_COLOR: Record<string, string> = {
  HVAC:       '#06B6D4',
  Electrical: '#F59E0B',
  Plumbing:   '#3B82F6',
  Cleaning:   '#10B981',
  Repair:     '#F97316',
  Security:   '#EF4444',
  IT:         '#8B5CF6',
}

export function FacilitiesWorkOrders() {
  const [filter, setFilter] = useState<'ALL' | WOStatus>('ALL')

  const open      = WORK_ORDERS.filter(w => w.status === 'OPEN').length
  const overdue   = WORK_ORDERS.filter(w => w.status === 'OVERDUE').length
  const completed = WORK_ORDERS.filter(w => w.status === 'COMPLETED').length

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',        label: 'All' },
    { key: 'OPEN',       label: 'Open' },
    { key: 'OVERDUE',    label: 'Overdue' },
    { key: 'COMPLETED',  label: 'Completed' },
  ]

  const visible = filter === 'ALL' ? WORK_ORDERS : WORK_ORDERS.filter(w => w.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Wrench size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Work Orders</h1>
          <p className="text-sm text-[var(--os-text-2)]">Maintenance, repairs, and facilities tasks across all sites</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open',           value: String(open),       color: '#2564ea' },
          { label: 'Overdue',        value: String(overdue),    color: '#EF4444' },
          { label: 'Completed MTD',  value: String(completed + 7), color: '#10B981' },
          { label: 'Avg Resolution', value: '2.3d',             color: ACCENT    },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === t.key
                ? 'bg-orange-600 text-white'
                : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Work Order List */}
      <div className="space-y-2">
        {visible.map(w => {
          const sc = STATUS_COLOR[w.status]
          const tc = TYPE_COLOR[w.type] ?? '#94A3B8'
          return (
            <div
              key={w.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-mono text-[var(--os-text-2)]">{w.id}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>
                    {w.type}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${w.priorityColor}22`, color: w.priorityColor }}>
                    {w.priority}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white truncate">{w.title}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{w.location} · {w.assignedTo}</p>
              </div>
              <div className="text-right w-20 shrink-0 hidden sm:block">
                <p className="text-xs text-[var(--os-text-2)]">Raised</p>
                <p className="text-xs text-[var(--os-text-1)]">{w.raised}</p>
              </div>
              <div className="text-right w-20 shrink-0 hidden md:block">
                <p className="text-xs text-[var(--os-text-2)]">Due</p>
                <p className="text-xs font-semibold" style={{ color: w.status === 'OVERDUE' ? '#EF4444' : '#94A3B8' }}>{w.due}</p>
              </div>
              <div className="w-28 text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                  {w.status === 'IN_PROGRESS' ? 'In Progress' : w.status.charAt(0) + w.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
