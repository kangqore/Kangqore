import { Sparkles } from 'lucide-react'
import { Stack } from '@phosphor-icons/react'

const ACCENT = '#7C3AED'

type Urgency = 'High' | 'Medium' | 'Low'

interface ApprovalItem {
  id:        string
  title:     string
  requestor: string
  amount:    string
  approver:  string
  submitted: string
  urgency:   Urgency
}

const APPROVALS: ApprovalItem[] = [
  { id: 'PR-2026-042', title: 'Cloud monitoring SaaS licence (annual)',  requestor: 'Nisha Kapoor', amount: '£4,800',  approver: 'Head of Engineering', submitted: '2026-06-19', urgency: 'High' },
  { id: 'PR-2026-043', title: 'Office furniture — hot-desking units',    requestor: 'Aarav Patel',  amount: '£2,100',  approver: 'Head of Facilities',  submitted: '2026-06-20', urgency: 'Medium' },
  { id: 'PR-2026-047', title: 'Conference attendance — 3 delegates',     requestor: 'Aarav Patel',  amount: '£4,500',  approver: 'CMO',                  submitted: '2026-06-22', urgency: 'Medium' },
  { id: 'PR-2026-048', title: 'Recruitment advertising budget Q3',       requestor: 'Nisha Kapoor', amount: '£8,000',  approver: 'CHRO',                 submitted: '2026-06-23', urgency: 'High' },
]

const URGENCY_COLOR: Record<Urgency, string> = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' }

export function ProcApprovals() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Stack size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Approval Queue</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Purchase requests pending authorisation — prioritised by urgency.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Pending Approvals', value: String(APPROVALS.length),                                              color: ACCENT },
          { label: 'High Urgency',      value: String(APPROVALS.filter(a => a.urgency === 'High').length),         color: '#EF4444' },
          { label: 'Total Value',       value: `£${APPROVALS.reduce((acc, a) => acc + parseInt(a.amount.replace(/[^0-9]/g, '')), 0).toLocaleString()}`, color: '#F59E0B' },
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
          PR-2026-042 (cloud monitoring) is approaching the 3-day approval SLA — this is High urgency as the Datadog
          PO cannot be confirmed without approval. PR-2026-048 (recruitment budget) at £8k is the highest-value item;
          CHRO should be nudged today. Total approval queue value is £19.4k — clearing this queue releases blocked operational spend.
        </p>
      </div>

      <div className="space-y-3">
        {APPROVALS.map(a => {
          const uc = URGENCY_COLOR[a.urgency]
          return (
            <div key={a.id} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--os-text-2)]">{a.id}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${uc}22`, color: uc }}>{a.urgency}</span>
                  </div>
                  <p className="text-white font-semibold">{a.title}</p>
                  <p className="text-[var(--os-text-2)] text-xs">Requested by {a.requestor} · Submitted {a.submitted}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{a.amount}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">Approver: {a.approver}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
