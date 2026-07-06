import { useState } from 'react'
import { CalendarDays } from 'lucide-react'

type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
type LeaveType   = 'Annual' | 'Sick' | 'WFH' | 'Compassionate' | 'Unpaid'

const REQUESTS = [
  { id: 'LV-0041', name: 'Sneha Gupta',   type: 'Annual'       as LeaveType, from: '1 Jul',  to: '5 Jul',   days: 5, status: 'APPROVED'  as LeaveStatus, reason: 'Family holiday' },
  { id: 'LV-0040', name: 'Kavya Reddy',   type: 'WFH'          as LeaveType, from: '26 Jun', to: '30 Jun',  days: 5, status: 'APPROVED'  as LeaveStatus, reason: 'Client work from Bangalore' },
  { id: 'LV-0039', name: 'Rohan Mehta',   type: 'Sick'         as LeaveType, from: '24 Jun', to: '24 Jun',  days: 1, status: 'APPROVED'  as LeaveStatus, reason: 'Sick leave' },
  { id: 'LV-0038', name: 'Arjun Sharma',  type: 'Annual'       as LeaveType, from: '14 Jul', to: '18 Jul',  days: 5, status: 'PENDING'   as LeaveStatus, reason: 'Wedding anniversary' },
  { id: 'LV-0037', name: 'Priya Nair',    type: 'Annual'       as LeaveType, from: '4 Aug',  to: '15 Aug',  days: 10,status: 'PENDING'   as LeaveStatus, reason: 'India travel' },
  { id: 'LV-0036', name: 'Sneha Gupta',   type: 'Compassionate'as LeaveType, from: '2 Jun',  to: '5 Jun',   days: 4, status: 'APPROVED'  as LeaveStatus, reason: 'Bereavement' },
]

const S_COLOR: Record<LeaveStatus, string> = { PENDING: '#F59E0B', APPROVED: '#10B981', REJECTED: '#EF4444' }
const T_COLOR: Record<LeaveType,   string> = { Annual: '#8B5CF6', Sick: '#EF4444', WFH: '#06B6D4', Compassionate: '#F97316', Unpaid: '#6B7280' }

export function HRLeave() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  const visible = REQUESTS.filter(r =>
    filter === 'all' ? true : filter === 'pending' ? r.status === 'PENDING' : r.status === 'APPROVED'
  )

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <CalendarDays className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Leave Management</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Leave requests, approval queue, and calendar view.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Approval', value: REQUESTS.filter(r => r.status === 'PENDING').length.toString(), color: '#F59E0B' },
          { label: 'Approved (MTD)',   value: REQUESTS.filter(r => r.status === 'APPROVED').length.toString(),color: '#10B981' },
          { label: 'Days Out (Jul)',   value: '15',  color: '#8B5CF6' },
          { label: 'Coverage Gaps',   value: '1',   color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-purple-600 text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Requests */}
      <div className="space-y-2">
        {visible.map(r => (
          <div key={r.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: `${T_COLOR[r.type]}22`, color: T_COLOR[r.type] }}>
              {r.type}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{r.name}</p>
              <p className="text-xs text-[var(--os-text-2)] mt-0.5">{r.id} · {r.from} – {r.to} ({r.days} days) · {r.reason}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${S_COLOR[r.status]}22`, color: S_COLOR[r.status] }}>
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
