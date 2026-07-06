import { Sparkles } from 'lucide-react'
import { Receipt } from '@phosphor-icons/react'

const ACCENT = '#7C3AED'

type PRStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected'

interface PurchaseRequest {
  id:        string
  title:     string
  requestor: string
  dept:      string
  amount:    string
  status:    PRStatus
  date:      string
}

const REQUESTS: PurchaseRequest[] = [
  { id: 'PR-2026-041', title: 'Laptop refresh — 5 units',               requestor: 'Aarav Patel', dept: 'IT',          amount: '£6,250',  status: 'Approved',        date: '2026-06-18' },
  { id: 'PR-2026-042', title: 'Cloud monitoring SaaS licence (annual)',  requestor: 'Nisha Kapoor', dept: 'Engineering', amount: '£4,800',  status: 'Pending Approval',date: '2026-06-19' },
  { id: 'PR-2026-043', title: 'Office furniture — hot-desking units',    requestor: 'Aarav Patel', dept: 'Facilities',  amount: '£2,100',  status: 'Pending Approval',date: '2026-06-20' },
  { id: 'PR-2026-044', title: 'Security awareness training platform',    requestor: 'Nisha Kapoor', dept: 'Security',   amount: '£3,600',  status: 'Approved',        date: '2026-06-17' },
  { id: 'PR-2026-045', title: 'Data enrichment API credits',             requestor: 'Aarav Patel', dept: 'Sales',       amount: '£1,200',  status: 'Rejected',        date: '2026-06-15' },
  { id: 'PR-2026-046', title: 'Legal research subscription renewal',     requestor: 'Nisha Kapoor', dept: 'Legal',      amount: '£5,400',  status: 'Draft',           date: '2026-06-21' },
  { id: 'PR-2026-047', title: 'Conference attendance — 3 delegates',    requestor: 'Aarav Patel', dept: 'Marketing',   amount: '£4,500',  status: 'Pending Approval',date: '2026-06-22' },
  { id: 'PR-2026-048', title: 'Recruitment advertising budget Q3',       requestor: 'Nisha Kapoor', dept: 'HR',         amount: '£8,000',  status: 'Pending Approval',date: '2026-06-23' },
]

const STATUS_COLOR: Record<PRStatus, string> = {
  'Draft':            '#6B7280',
  'Pending Approval': '#F59E0B',
  'Approved':         '#10B981',
  'Rejected':         '#EF4444',
}

export function ProcRequests() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Receipt size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Purchase Requests</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Live purchase request tracker — all departments.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total PRs',    value: String(REQUESTS.length),                                               color: ACCENT },
          { label: 'Pending',      value: String(REQUESTS.filter(r => r.status === 'Pending Approval').length), color: '#F59E0B' },
          { label: 'Approved',     value: String(REQUESTS.filter(r => r.status === 'Approved').length),         color: '#10B981' },
          { label: 'Rejected',     value: String(REQUESTS.filter(r => r.status === 'Rejected').length),         color: '#EF4444' },
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
          4 PRs pending approval — HR recruitment budget (PR-2026-048 at £8k) and conference spend (PR-2026-047 at £4.5k)
          are the highest value items. Approval SLA is 3 business days; PR-2026-042 (cloud monitoring) is approaching SLA.
          PR-2026-045 rejection (data enrichment) should be documented with reason — requestor needs to resubmit with
          business case approval from Sales Director.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['PR ID', 'Title', 'Requestor', 'Dept', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {REQUESTS.map(r => {
                const sc = STATUS_COLOR[r.status]
                return (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{r.id}</span></td>
                    <td className="px-4 py-3 text-white font-medium">{r.title}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.requestor}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.dept}</td>
                    <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{r.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.date}</td>
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
