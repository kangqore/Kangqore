import { Sparkles } from 'lucide-react'
import { ChartBar } from '@phosphor-icons/react'

const ACCENT = '#0284C7'

type BIStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done'
type Priority = 'High' | 'Medium' | 'Low'

interface BIRequest {
  id:        string
  title:     string
  requestor: string
  priority:  Priority
  points:    number
  status:    BIStatus
}

const REQUESTS: BIRequest[] = [
  { id: 'BI-041', title: 'Revenue attribution dashboard by campaign',      requestor: 'CMO',           priority: 'High',   points: 8,  status: 'In Progress' },
  { id: 'BI-042', title: 'Churn prediction model (Logistic Regression)',   requestor: 'CS Director',   priority: 'High',   points: 13, status: 'In Progress' },
  { id: 'BI-043', title: 'Engineering deployment frequency trend',         requestor: 'CTO',           priority: 'Medium', points: 3,  status: 'Review' },
  { id: 'BI-044', title: 'Support SLA breach drill-down by tier',          requestor: 'Support Lead',  priority: 'High',   points: 5,  status: 'Backlog' },
  { id: 'BI-045', title: 'Employee attrition risk segmentation',           requestor: 'CHRO',          priority: 'Medium', points: 8,  status: 'Backlog' },
  { id: 'BI-046', title: 'Procurement spend variance vs budget by dept',   requestor: 'CFO',           priority: 'Medium', points: 5,  status: 'Backlog' },
  { id: 'BI-047', title: 'Sales rep performance cohort analysis',          requestor: 'Sales Director', priority: 'Low',   points: 8,  status: 'Backlog' },
  { id: 'BI-040', title: 'Q2 Board KPI pack automation',                   requestor: 'MD',            priority: 'High',   points: 5,  status: 'Done' },
]

const STATUS_COLOR: Record<BIStatus, string> = {
  Backlog:     '#6B7280',
  'In Progress': '#6366F1',
  Review:      '#F59E0B',
  Done:        '#10B981',
}

const PRIORITY_COLOR: Record<Priority, string> = { High: '#EF4444', Medium: '#F59E0B', Low: '#6366F1' }

export function DABIRequests() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ChartBar size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">BI Requests</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Business intelligence request queue — priority, story points and status.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Requests', value: String(REQUESTS.filter(r => r.status !== 'Done').length), color: ACCENT },
          { label: 'In Progress',   value: String(REQUESTS.filter(r => r.status === 'In Progress').length), color: '#6366F1' },
          { label: 'High Priority', value: String(REQUESTS.filter(r => r.priority === 'High').length), color: '#EF4444' },
          { label: 'Story Points',  value: String(REQUESTS.filter(r => r.status !== 'Done').reduce((acc, r) => acc + r.points, 0)), color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          BI-042 (churn prediction model) is 13 story points — the largest item in flight. Block time with Deepa for
          feature engineering this week. BI-041 (revenue attribution) should be the priority dashboard alongside the
          Board KPI pack completion. 4 High priority items in the backlog; recommend sprint planning to prioritise
          BI-044 (SLA breach drill-down) — Support is approaching SLA risk.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Request', 'Requestor', 'Priority', 'Points', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {REQUESTS.map(r => {
                const sc = STATUS_COLOR[r.status]
                const pc = PRIORITY_COLOR[r.priority]
                return (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{r.id}</span></td>
                    <td className="px-4 py-3 text-white font-medium">{r.title}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.requestor}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${pc}22`, color: pc }}>{r.priority}</span>
                    </td>
                    <td className="px-4 py-3 text-white font-bold">{r.points}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{r.status}</span>
                    </td>
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
