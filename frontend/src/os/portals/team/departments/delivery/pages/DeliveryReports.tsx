import { useState } from 'react'
import { FileText, Sparkles, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

const ACCENT = '#F43F5E'

type ReportStatus = 'Sent' | 'Due Today' | 'Overdue' | 'In Draft'

interface StatusReport {
  id:        string
  client:    string
  project:   string
  period:    string
  dueDate:   string
  pm:        string
  status:    ReportStatus
  lastSent?: string
}

const REPORTS: StatusReport[] = [
  { id: 'RPT-001', client: 'Acme Corp',     project: 'Kangqore OS',       period: 'Jun 16–22', dueDate: '2026-06-24', pm: 'Riya Desai',   status: 'In Draft',   lastSent: '2026-06-17' },
  { id: 'RPT-002', client: 'GlobalMed',     project: 'BIDS™ Rollout',     period: 'Jun 16–22', dueDate: '2026-06-24', pm: 'Sanjay Verma', status: 'Overdue',    lastSent: '2026-06-10' },
  { id: 'RPT-003', client: 'DataCo',        project: 'Cognition Platform', period: 'Jun 16–22', dueDate: '2026-06-25', pm: 'Riya Desai',   status: 'In Draft' },
  { id: 'RPT-004', client: 'FinServ',       project: 'Shield Security',    period: 'Jun 16–22', dueDate: '2026-06-24', pm: 'Sanjay Verma', status: 'Due Today',  lastSent: '2026-06-17' },
  { id: 'RPT-005', client: 'RetailCo',      project: 'Analytics v2',       period: 'Jun 9–15',  dueDate: '2026-06-17', pm: 'Riya Desai',   status: 'Sent',       lastSent: '2026-06-17' },
  { id: 'RPT-006', client: 'HealthGroup',   project: 'Data Migration',     period: 'Jun 16–22', dueDate: '2026-06-25', pm: 'Sanjay Verma', status: 'In Draft' },
  { id: 'RPT-007', client: 'LegalFirst',    project: 'Compliance Auto',    period: 'Jun 16–22', dueDate: '2026-06-26', pm: 'Riya Desai',   status: 'In Draft' },
  { id: 'RPT-008', client: 'ManufactureCo', project: 'Cloud Infra Lift',   period: 'Jun 9–15',  dueDate: '2026-06-17', pm: 'Sanjay Verma', status: 'Sent',       lastSent: '2026-06-17' },
]

const STATUS_COLOR: Record<ReportStatus, string> = {
  'Sent':      '#10B981',
  'Due Today': '#F59E0B',
  'Overdue':   '#EF4444',
  'In Draft':  '#6366F1',
}

const STATUS_ICON: Record<ReportStatus, React.ReactNode> = {
  'Sent':      <CheckCircle size={12} />,
  'Due Today': <Clock size={12} />,
  'Overdue':   <AlertTriangle size={12} />,
  'In Draft':  <FileText size={12} />,
}

export function DeliveryReports() {
  const [filter, setFilter] = useState<'ALL' | ReportStatus>('ALL')

  const visible = filter === 'ALL' ? REPORTS : REPORTS.filter(r => r.status === filter)
  const overdue  = REPORTS.filter(r => r.status === 'Overdue').length
  const dueToday = REPORTS.filter(r => r.status === 'Due Today').length
  const sent     = REPORTS.filter(r => r.status === 'Sent').length
  const draft    = REPORTS.filter(r => r.status === 'In Draft').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <FileText size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Client Status Reports</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Weekly client status report tracker — draft, review, and send</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sent',       value: String(sent),     color: '#10B981' },
          { label: 'Due Today',  value: String(dueToday), color: '#F59E0B' },
          { label: 'Overdue',    value: String(overdue),  color: '#EF4444' },
          { label: 'In Draft',   value: String(draft),    color: '#6366F1' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {overdue > 0 && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 flex gap-4">
          <Sparkles size={18} className="text-rose-400 mt-0.5 shrink-0" />
          <p className="text-sm text-[var(--os-text-1)]">
            <span className="font-semibold text-rose-400">KIMMP: </span>
            GlobalMed report is overdue — last sent 14 days ago. GlobalMed has active delivery risks and a high NPS dependency.
            A delayed status report increases churn risk. Sanjay to prioritise draft within 2 hours.
          </p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'Overdue', 'Due Today', 'In Draft', 'Sent'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f ? 'text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
            style={filter === f ? { background: f === 'ALL' ? ACCENT : STATUS_COLOR[f as ReportStatus] } : {}}
          >
            {f === 'ALL' ? 'All Reports' : f}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Client', 'Project', 'Period', 'Due', 'PM', 'Status', 'Last Sent'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {visible.map(r => {
                const sc = STATUS_COLOR[r.status]
                return (
                  <tr key={r.id} className={`transition-colors ${r.status === 'Overdue' ? 'bg-red-500/5' : 'hover:bg-slate-800/30'}`}>
                    <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs font-mono text-[var(--os-text-2)]">{r.id}</span></td>
                    <td className="px-4 py-3 text-[var(--os-text-1)] whitespace-nowrap font-medium">{r.client}</td>
                    <td className="px-4 py-3 text-[var(--os-text-1)] whitespace-nowrap">{r.project}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.period}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.dueDate}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.pm}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${sc}18`, color: sc }}>
                        {STATUS_ICON[r.status]}
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap text-xs">{r.lastSent ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
