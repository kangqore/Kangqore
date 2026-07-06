import { Sparkles } from 'lucide-react'
import { Stack } from '@phosphor-icons/react'

const ACCENT = '#16A34A'

type ApprovalStatus = 'Pending' | 'Approved' | 'Escalated'
type Urgency = 'High' | 'Medium' | 'Low'

interface ApprovalItem {
  type:      string
  requestor: string
  scope:     string
  approver:  string
  submitted: string
  slaDays:   number
  status:    ApprovalStatus
  urgency:   Urgency
}

const APPROVALS: ApprovalItem[] = [
  { type: 'Headcount Request',    requestor: 'Head of Engineering', scope: '2 × Senior Engineers',    approver: 'MD',          submitted: '2026-06-20', slaDays: 5, status: 'Pending',   urgency: 'High' },
  { type: 'Contractor Onboarding',requestor: 'Head of Delivery',   scope: 'Senior PM — 3-month',     approver: 'COO',         submitted: '2026-06-22', slaDays: 3, status: 'Pending',   urgency: 'High' },
  { type: 'Policy Approval',      requestor: 'Risk & Compliance',  scope: 'DPDP Compliance Policy',  approver: 'Board',       submitted: '2026-06-18', slaDays: 7, status: 'Escalated', urgency: 'High' },
  { type: 'Budget Reforecast',    requestor: 'CFO',                scope: 'Q3 engineering budget +£40k',approver: 'MD',       submitted: '2026-06-23', slaDays: 3, status: 'Pending',   urgency: 'Medium' },
  { type: 'Vendor Change',        requestor: 'Operations',         scope: 'Replace Legacy Print Co.', approver: 'COO',        submitted: '2026-06-21', slaDays: 5, status: 'Pending',   urgency: 'Medium' },
  { type: 'System Access Request',requestor: 'IT',                 scope: 'AWS prod access — 3 engineers', approver: 'CISO', submitted: '2026-06-24', slaDays: 2, status: 'Pending',   urgency: 'Medium' },
  { type: 'Travel Approval',      requestor: 'Sales',              scope: 'Client visit NYC — £1,800',approver: 'Sales Director',submitted: '2026-06-23',slaDays: 2, status: 'Pending', urgency: 'Low' },
  { type: 'Tool Procurement',     requestor: 'Marketing',          scope: 'Semrush annual licence',   approver: 'CMO',         submitted: '2026-06-24', slaDays: 2, status: 'Approved',  urgency: 'Low' },
]

const STATUS_COLOR: Record<ApprovalStatus, string> = { Pending: '#6366F1', Approved: '#10B981', Escalated: '#EF4444' }
const URGENCY_COLOR: Record<Urgency, string> = { High: '#EF4444', Medium: '#F59E0B', Low: '#6B7280' }

export function OpsApprovals() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Stack size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Approval Queue</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Cross-functional approval requests — operational decisions pending authorisation.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending',   value: String(APPROVALS.filter(a => a.status === 'Pending').length),   color: '#6366F1' },
          { label: 'Escalated', value: String(APPROVALS.filter(a => a.status === 'Escalated').length), color: '#EF4444' },
          { label: 'Approved',  value: String(APPROVALS.filter(a => a.status === 'Approved').length),  color: '#10B981' },
          { label: 'High Urgency',value: String(APPROVALS.filter(a => a.urgency === 'High').length),   color: '#EF4444' },
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
          DPDP Compliance Policy is escalated to Board level — this is time-sensitive given Q3 enforcement. Ensure the
          Board agenda item is confirmed for the next meeting. Engineering headcount request (2 × Senior Engineers)
          should be fast-tracked given the Red capacity alert. Contractor onboarding for Delivery should be unblocked
          today — SLA is 3 days and was submitted 2 days ago.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Type', 'Requestor', 'Scope', 'Approver', 'Submitted', 'SLA', 'Urgency', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {APPROVALS.map(a => {
                const sc = STATUS_COLOR[a.status]
                const uc = URGENCY_COLOR[a.urgency]
                return (
                  <tr key={`${a.type}-${a.requestor}`} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{a.type}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.requestor}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs">{a.scope}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.approver}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.submitted}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.slaDays}d</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${uc}22`, color: uc }}>{a.urgency}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{a.status}</span>
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
