import { FileText } from 'lucide-react'

const ACCENT = '#0EA5E9'

type ProposalStatus = 'Draft' | 'Sent' | 'Under Review' | 'Won' | 'Lost'

interface Proposal {
  id:         string
  client:     string
  value:      string
  status:     ProposalStatus
  sentDate:   string
  decisionBy: string
}

const PROPOSALS: Proposal[] = [
  { id: 'PROP-001', client: 'Acme Corp',   value: '£120k', status: 'Won',          sentDate: '2026-05-10', decisionBy: '2026-05-28' },
  { id: 'PROP-002', client: 'FinServ Ltd', value: '£280k', status: 'Under Review',  sentDate: '2026-06-02', decisionBy: '2026-06-30' },
  { id: 'PROP-003', client: 'TechScale',   value: '£75k',  status: 'Sent',          sentDate: '2026-06-10', decisionBy: '2026-07-05' },
  { id: 'PROP-004', client: 'GlobalMed',   value: '£340k', status: 'Under Review',  sentDate: '2026-06-05', decisionBy: '2026-06-25' },
  { id: 'PROP-005', client: 'LogiCore',    value: '£55k',  status: 'Draft',         sentDate: '—',          decisionBy: '2026-07-15' },
  { id: 'PROP-006', client: 'EduTech',     value: '£90k',  status: 'Lost',          sentDate: '2026-05-01', decisionBy: '2026-05-20' },
]

const STATUS_COLOR: Record<ProposalStatus, string> = {
  'Draft':        '#6B7280',
  'Sent':         '#0EA5E9',
  'Under Review': '#F59E0B',
  'Won':          '#10B981',
  'Lost':         '#EF4444',
}

export function SalesProposals() {
  const active      = PROPOSALS.filter(p => p.status === 'Under Review').length
  const sent        = PROPOSALS.filter(p => p.status === 'Sent').length
  const won         = PROPOSALS.filter(p => p.status === 'Won').length
  const lost        = PROPOSALS.filter(p => p.status === 'Lost').length
  const winRate     = Math.round((won / (won + lost)) * 100)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <FileText size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Proposals</h1>
          <p className="text-sm text-[var(--os-text-2)]">Proposal register — active, sent and closed proposals</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Active',    value: String(active), color: '#F59E0B' },
          { label: 'Sent',      value: String(sent),   color: ACCENT    },
          { label: 'Won',       value: String(won),    color: '#10B981' },
          { label: 'Lost',      value: String(lost),   color: '#EF4444' },
          { label: 'Win Rate',  value: `${winRate}%`,  color: '#8B5CF6' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Proposals Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Proposal ID</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Client</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Value</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden md:table-cell">Sent Date</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden lg:table-cell">Decision By</th>
            </tr>
          </thead>
          <tbody>
            {PROPOSALS.map((p, i) => {
              const sc = STATUS_COLOR[p.status]
              return (
                <tr key={p.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                  <td className="px-5 py-3 font-mono text-xs text-[var(--os-text-2)]">{p.id}</td>
                  <td className="px-5 py-3 text-white font-semibold">{p.client}</td>
                  <td className="px-5 py-3 text-white font-bold">{p.value}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--os-text-2)] hidden md:table-cell">{p.sentDate}</td>
                  <td className="px-5 py-3 text-[var(--os-text-2)] hidden lg:table-cell">{p.decisionBy}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
