import { useState } from 'react'
import { Headphones, Clock } from 'lucide-react'

type SRStatus = 'PENDING' | 'IN_PROGRESS' | 'FULFILLED' | 'REJECTED'
type SRType   = 'Hardware' | 'Software' | 'Access' | 'Network' | 'Other'

const REQUESTS = [
  { id: 'SR-0218', title: 'MacBook Pro 14" M3 — replacement',     type: 'Hardware' as SRType, requester: 'Kavya R.',  status: 'IN_PROGRESS' as SRStatus, submitted: '1 day ago',  priority: 'HIGH'   },
  { id: 'SR-0217', title: 'GitHub Copilot seat — 3 engineers',    type: 'Software' as SRType, requester: 'Arjun S.', status: 'PENDING'     as SRStatus, submitted: '2 days ago', priority: 'MEDIUM' },
  { id: 'SR-0216', title: 'VPN access — new contractor (Ravi P.)',type: 'Access'   as SRType, requester: 'HR',       status: 'FULFILLED'   as SRStatus, submitted: '3 days ago', priority: 'HIGH'   },
  { id: 'SR-0215', title: 'Datadog dashboard access',             type: 'Access'   as SRType, requester: 'Sneha G.', status: 'FULFILLED'   as SRStatus, submitted: '4 days ago', priority: 'LOW'    },
  { id: 'SR-0214', title: 'Network port open — port 8443 prod',  type: 'Network'  as SRType, requester: 'Rohan M.', status: 'PENDING'     as SRStatus, submitted: '4 days ago', priority: 'MEDIUM' },
  { id: 'SR-0213', title: 'Figma Professional license renewal',  type: 'Software' as SRType, requester: 'Kavya R.', status: 'IN_PROGRESS' as SRStatus, submitted: '5 days ago', priority: 'LOW'    },
  { id: 'SR-0212', title: 'USB-C docking station × 2',           type: 'Hardware' as SRType, requester: 'Priya N.', status: 'REJECTED'    as SRStatus, submitted: '6 days ago', priority: 'LOW'    },
]

const S_COLOR: Record<SRStatus, string> = { PENDING: '#F59E0B', IN_PROGRESS: '#2564ea', FULFILLED: '#10B981', REJECTED: '#EF4444' }
const T_COLOR: Record<SRType,   string> = { Hardware: '#8B5CF6', Software: '#06B6D4', Access: '#F97316', Network: '#10B981', Other: '#6B7280' }

type Filter = 'all' | 'pending' | 'in_progress' | 'fulfilled'

export function ITServiceRequests() {
  const [filter, setFilter] = useState<Filter>('all')
  const [type,   setType]   = useState<SRType | 'all'>('all')

  const visible = REQUESTS.filter(r => {
    const statusOk = filter === 'all' || r.status.toLowerCase().replace('_', '') === filter.replace('_', '')
    const typeOk   = type === 'all' || r.type === type
    return statusOk && typeOk
  })

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Headphones className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Service Requests</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Hardware, software, access, and network requests from across the organisation.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Open',  value: REQUESTS.filter(r => r.status !== 'FULFILLED' && r.status !== 'REJECTED').length.toString(), color: '#F59E0B' },
          { label: 'Pending',     value: REQUESTS.filter(r => r.status === 'PENDING').length.toString(), color: '#F97316' },
          { label: 'Fulfilled (7d)', value: REQUESTS.filter(r => r.status === 'FULFILLED').length.toString(), color: '#10B981' },
          { label: 'Avg Fulfil Time', value: '1.8d', color: '#2564ea' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'in_progress', 'fulfilled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'}`}>
            {f.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
          </button>
        ))}
        <div className="w-px bg-white/10 mx-1" />
        {(['all', 'Hardware', 'Software', 'Access', 'Network'] as const).map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${type === t ? 'bg-slate-600 text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {visible.map(r => (
          <div key={r.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: `${T_COLOR[r.type]}22`, color: T_COLOR[r.type] }}>
              {r.type}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{r.title}</p>
              <p className="text-xs text-[var(--os-text-2)] mt-0.5">{r.id} · {r.requester} · {r.submitted}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${S_COLOR[r.status]}22`, color: S_COLOR[r.status] }}>
                {r.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
        {visible.length === 0 && <p className="text-center text-[var(--os-text-2)] py-10 text-sm">No requests in this view.</p>}
      </div>
    </div>
  )
}
