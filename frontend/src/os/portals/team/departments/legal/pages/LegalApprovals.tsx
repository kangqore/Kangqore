import { useState } from 'react'
import { CheckSquare } from 'lucide-react'

const ACCENT = '#F59E0B'

type ApprovalStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED'

interface LegalApproval {
  id: string
  title: string
  requestor: string
  submitted: string
  slaTarget: number
  daysElapsed: number
  status: ApprovalStatus
  category: string
}

const APPROVALS: LegalApproval[] = [
  { id: 'LAP-0042', title: 'Renewal: Vertex Technologies MSA amendment',    requestor: 'Tom Walsh',    submitted: '10 Jun 2026', slaTarget: 5, daysElapsed: 13, status: 'PENDING',   category: 'Contract'      },
  { id: 'LAP-0041', title: 'New vendor NDA — CloudBase Inc',                requestor: 'James Okafor', submitted: '14 Jun 2026', slaTarget: 5, daysElapsed: 9,  status: 'PENDING',   category: 'NDA'           },
  { id: 'LAP-0040', title: 'Remote work policy update v2.4',                requestor: 'Priya Nair',   submitted: '15 Jun 2026', slaTarget: 5, daysElapsed: 8,  status: 'IN_REVIEW', category: 'Policy'        },
  { id: 'LAP-0039', title: 'Employment contract — Senior Engineer offer',   requestor: 'Lucy Brennan', submitted: '16 Jun 2026', slaTarget: 5, daysElapsed: 7,  status: 'IN_REVIEW', category: 'Employment'    },
  { id: 'LAP-0038', title: 'Data processing addendum — MailStream Ltd',     requestor: 'Sarah Chen',   submitted: '18 Jun 2026', slaTarget: 5, daysElapsed: 5,  status: 'PENDING',   category: 'DPA'           },
  { id: 'LAP-0037', title: 'IP assignment agreement — contractor J. Ali',   requestor: 'Raj Patel',    submitted: '19 Jun 2026', slaTarget: 5, daysElapsed: 4,  status: 'PENDING',   category: 'IP'            },
  { id: 'LAP-0036', title: 'SLA amendment: CloudBase penalty clause',       requestor: 'Tom Walsh',    submitted: '04 Jun 2026', slaTarget: 5, daysElapsed: 2,  status: 'APPROVED',  category: 'Contract'      },
  { id: 'LAP-0035', title: 'Marketing consent language — homepage update',  requestor: 'Aisha Malik',  submitted: '02 Jun 2026', slaTarget: 5, daysElapsed: 1,  status: 'APPROVED',  category: 'Compliance'    },
]

const STATUS_COLOR: Record<ApprovalStatus, string> = {
  PENDING:   '#F59E0B',
  IN_REVIEW: '#2564ea',
  APPROVED:  '#10B981',
  REJECTED:  '#EF4444',
}

const CAT_COLOR: Record<string, string> = {
  Contract:   '#8B5CF6',
  NDA:        '#06B6D4',
  Policy:     '#F97316',
  Employment: '#EC4899',
  DPA:        '#14B8A6',
  IP:         '#3B82F6',
  Compliance: '#10B981',
}

export function LegalApprovals() {
  const [filter, setFilter] = useState<'ALL' | ApprovalStatus>('ALL')

  const pending     = APPROVALS.filter(a => a.status === 'PENDING').length
  const inReview    = APPROVALS.filter(a => a.status === 'IN_REVIEW').length
  const approvedMTD = APPROVALS.filter(a => a.status === 'APPROVED').length + 10
  const slaBreached = APPROVALS.filter(a => a.daysElapsed > a.slaTarget).length
  const avgTime     = (APPROVALS.reduce((s, a) => s + a.daysElapsed, 0) / APPROVALS.length).toFixed(1)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',       label: 'All' },
    { key: 'PENDING',   label: 'Pending' },
    { key: 'IN_REVIEW', label: 'In Review' },
    { key: 'APPROVED',  label: 'Approved' },
  ]

  const visible = filter === 'ALL' ? APPROVALS : APPROVALS.filter(a => a.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <CheckSquare size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Legal Approval Queue</h1>
          <p className="text-sm text-[var(--os-text-2)]">Contracts, NDAs, policies & legal documents awaiting review</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending',           value: String(pending + inReview), color: '#F59E0B' },
          { label: 'Avg Review Time',   value: `${avgTime}d`,              color: avgTime > '5' ? '#EF4444' : '#10B981', sub: 'vs 5d SLA' },
          { label: 'Approved MTD',      value: String(approvedMTD),        color: '#10B981' },
          { label: 'SLA Breached',      value: String(slaBreached),        color: slaBreached > 0 ? '#EF4444' : '#10B981' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
            {'sub' in k && <p className="text-xs text-[var(--os-text-2)] mt-0.5">{(k as any).sub}</p>}
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
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {visible.map(a => {
          const sc       = STATUS_COLOR[a.status]
          const cc       = CAT_COLOR[a.category] ?? '#94A3B8'
          const breached = a.daysElapsed > a.slaTarget
          return (
            <div
              key={a.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-mono text-[var(--os-text-2)]">{a.id}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${cc}22`, color: cc }}>
                    {a.category}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white truncate">{a.title}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">Requestor: {a.requestor} · Submitted {a.submitted}</p>
              </div>
              <div className="text-right w-28 shrink-0 hidden md:block">
                <p className="text-xs text-[var(--os-text-2)]">Days Elapsed</p>
                <p className="text-sm font-semibold" style={{ color: breached ? '#EF4444' : '#10B981' }}>
                  {a.daysElapsed}d {breached && '⚠'}
                </p>
              </div>
              <div className="w-28 text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                  {a.status === 'IN_REVIEW' ? 'In Review' : a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
