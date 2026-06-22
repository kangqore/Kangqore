import { Brain, Clock, User, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

type ChangeType = 'IT' | 'Product' | 'Process' | 'Commercial' | 'Org'
type ChangeStatus = 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected'

interface Change {
  id: string
  title: string
  type: ChangeType
  status: ChangeStatus
  riskScore: number
  raisedBy: string
  affectedEntities: string[]
  summary: string
  kimmpRiskReason: string
  proposedDate: string
  reviewDeadline: string
  emergencyChange: boolean
}

const CHANGES: Change[] = [
  {
    id: 'CHG-041',
    title: 'Reallocate Aarav Shah from Project Atlas to Project Phoenix weeks 26–28',
    type: 'Org',
    status: 'pending',
    riskScore: 71,
    raisedBy: 'Mahesh Kumar',
    affectedEntities: ['Aarav Shah', 'Project Phoenix', 'Project Atlas'],
    summary: 'Temporary reallocation to resolve P1 delivery dependency on Synapse Health milestone. Atlas timeline will extend by approximately 2 weeks.',
    kimmpRiskReason: 'High risk: Project Atlas also has contractual commitments in this window. Reallocation resolves Phoenix P1 but creates Atlas amber risk. Recommend explicit stakeholder sign-off from Atlas client before proceeding.',
    proposedDate: '2026-06-23',
    reviewDeadline: '2026-06-22',
    emergencyChange: true,
  },
  {
    id: 'CHG-042',
    title: 'Deploy reminder automation for consultation bookings (2h pre-call)',
    type: 'Product',
    status: 'approved',
    riskScore: 12,
    raisedBy: 'Priya Mehta',
    affectedEntities: ['Consultations', 'CRM'],
    summary: 'Automated 2-hour pre-call SMS and email reminder for all scheduled consultations. Expected to improve show-rate from 58% to ~72% based on historical data from comparable clients.',
    kimmpRiskReason: 'Low risk: configuration-only change with no data migration. Rollback is instant. Timing is favourable — no peak consultation window this week.',
    proposedDate: '2026-06-22',
    reviewDeadline: '2026-06-22',
    emergencyChange: false,
  },
  {
    id: 'CHG-043',
    title: 'Meridian Logistics — invoice escalation to senior contact',
    type: 'Commercial',
    status: 'pending',
    riskScore: 58,
    raisedBy: 'Arjun Nair',
    affectedEntities: ['Meridian Logistics', 'Finance', 'Account Management'],
    summary: 'Escalate overdue invoice (₹4.2L, 18 days) directly to CFO contact rather than accounts payable. Standard escalation path has had no response for 12 days.',
    kimmpRiskReason: 'Medium risk: escalation to senior contact may accelerate payment but could also be perceived as aggressive given existing churn signals. Recommend pairing with retention call to frame as relationship management rather than collections.',
    proposedDate: '2026-06-22',
    reviewDeadline: '2026-06-21',
    emergencyChange: false,
  },
  {
    id: 'CHG-044',
    title: 'AEGIS: implement automated 85-day access review reminder',
    type: 'IT',
    status: 'in-progress',
    riskScore: 6,
    raisedBy: 'System Auto-raised',
    affectedEntities: ['AEGIS', 'IT Admin'],
    summary: 'Automated reminder workflow that triggers 5 days before any user access review is due. Prevents recurrence of the SOC 2 control breach in ISS-005.',
    kimmpRiskReason: 'Minimal risk: additive automation with no existing system changes. Directly addresses active compliance control failure.',
    proposedDate: '2026-06-21',
    reviewDeadline: '2026-06-21',
    emergencyChange: false,
  },
  {
    id: 'CHG-045',
    title: 'Q2 marketing: activate backup outbound email sequence',
    type: 'Process',
    status: 'pending',
    riskScore: 22,
    raisedBy: 'Kavya Sharma',
    affectedEntities: ['Marketing', 'Sales Pipeline'],
    summary: 'Activate pre-written 3-email outbound sequence to 45 warm leads from Q1 who did not convert. Targeting 8–12 inbound-equivalent leads in 10 days.',
    kimmpRiskReason: 'Low risk: no product or infrastructure change. Main risk is brand perception if sequence cadence is too aggressive. Recommend 3-day gap between emails.',
    proposedDate: '2026-06-22',
    reviewDeadline: '2026-06-22',
    emergencyChange: false,
  },
  {
    id: 'CHG-046',
    title: 'Synapse Health: propose Sprint 14 milestone extension with SLA compensation',
    type: 'Commercial',
    status: 'pending',
    riskScore: 68,
    raisedBy: 'Mahesh Kumar',
    affectedEntities: ['Synapse Health', 'Project Phoenix', 'Synapse Retainer'],
    summary: 'Formal proposal to extend Sprint 14 milestone by 8 calendar days. Compensation: one additional sprint of free support. Requires client sign-off before breach triggers penalty clause in Synapse Retainer (CMT-009 review in 5 days).',
    kimmpRiskReason: 'High risk: client relationship and contract are both at stake. However, proactive proposal with compensation offer is significantly better than breach without notice. KIMMP recommends acting within 24 hours to preserve relationship capital.',
    proposedDate: '2026-06-22',
    reviewDeadline: '2026-06-21',
    emergencyChange: true,
  },
  {
    id: 'CHG-047',
    title: 'Infrastructure: patch all nodes to latest security baseline',
    type: 'IT',
    status: 'completed',
    riskScore: 24,
    raisedBy: 'Ravi Kumar',
    affectedEntities: ['Infrastructure', 'AEGIS'],
    summary: 'Security patching cycle completed on schedule. All 12 nodes updated. AEGIS patch compliance control now passing.',
    kimmpRiskReason: 'Standard change. Completed within maintenance window with zero downtime. No residual risk.',
    proposedDate: '2026-06-20',
    reviewDeadline: '2026-06-20',
    emergencyChange: false,
  },
]

const TYPE_COLOR: Record<ChangeType, string> = {
  IT:         '#2564ea',
  Product:    '#7f53f9',
  Process:    '#fdab3d',
  Commercial: '#00c875',
  Org:        '#e2445c',
}

const STATUS_COLOR: Record<ChangeStatus, string> = {
  pending:     '#64748b',
  approved:    '#00c875',
  'in-progress': '#2564ea',
  completed:   '#00c875',
  rejected:    '#e2445c',
}

function RiskBadge({ score }: { score: number }) {
  const color = score >= 60 ? '#e2445c' : score >= 30 ? '#fdab3d' : '#00c875'
  const label = score >= 60 ? 'High' : score >= 30 ? 'Medium' : 'Low'
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: '#1f2a4a' }}>
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold" style={{ color }}>{score} · {label}</span>
    </div>
  )
}

function ChangeRow({ change }: { change: Change }) {
  const [open, setOpen] = useState(false)
  const typeColor   = TYPE_COLOR[change.type]
  const statusColor = STATUS_COLOR[change.status]

  return (
    <div className="rounded-xl overflow-hidden transition-all"
      style={{ background: '#0d1117', border: `1px solid #2E2854` }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Risk dial */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center"
            style={{
              background: change.riskScore >= 60 ? 'rgba(226,68,92,0.1)' : change.riskScore >= 30 ? 'rgba(253,171,61,0.1)' : 'rgba(0,200,117,0.1)',
              border: `1px solid ${change.riskScore >= 60 ? 'rgba(226,68,92,0.3)' : change.riskScore >= 30 ? 'rgba(253,171,61,0.3)' : 'rgba(0,200,117,0.3)'}`,
            }}>
            <span className="text-[11px] font-black tabular-nums"
              style={{ color: change.riskScore >= 60 ? '#e2445c' : change.riskScore >= 30 ? '#fdab3d' : '#00c875' }}>
              {change.riskScore}
            </span>
            <span className="text-[8px] text-slate-600">risk</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {change.emergencyChange && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide"
                      style={{ background: 'rgba(226,68,92,0.12)', color: '#e2445c', border: '1px solid rgba(226,68,92,0.3)' }}>
                      Emergency
                    </span>
                  )}
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: typeColor, background: `${typeColor}14`, border: `1px solid ${typeColor}25` }}>
                    {change.type}
                  </span>
                  <span className="text-[9px] text-slate-600">{change.id}</span>
                </div>
                <p className="text-[13px] font-semibold text-white leading-tight">{change.title}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg capitalize flex-shrink-0"
                style={{
                  color: statusColor,
                  background: `${statusColor}12`,
                  border: `1px solid ${statusColor}30`,
                }}>
                {change.status}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                <User className="w-2.5 h-2.5" />
                {change.raisedBy}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                <Clock className="w-2.5 h-2.5" />
                Review by {change.reviewDeadline}
              </span>
              <span className="text-[10px] text-slate-600">Proposed: {change.proposedDate}</span>
            </div>

            <div className="mt-2">
              <RiskBadge score={change.riskScore} />
            </div>

            {/* KIMMP risk reason */}
            <div className="mt-2.5 flex items-start gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <Brain className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">KIMMP Risk Assessment</span>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed line-clamp-2">{change.kimmpRiskReason}</p>
              </div>
            </div>

            {open && (
              <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid #1f2a4a' }}>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Change Summary</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{change.summary}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Affected Entities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {change.affectedEntities.map(e => (
                      <span key={e} className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: '#1a2035', border: '1px solid #2E2854', color: '#94a3b8' }}>
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => setOpen(o => !o)}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-os-blue transition-colors">
              {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {open ? 'Collapse' : 'Full detail + affected entities'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ChangeLogPage() {
  const [filter, setFilter] = useState<ChangeType | 'all'>('all')
  const pending   = CHANGES.filter(c => c.status === 'pending').length
  const emergency = CHANGES.filter(c => c.emergencyChange).length
  const avgRisk   = Math.round(CHANGES.reduce((s, c) => s + c.riskScore, 0) / CHANGES.length)

  const filtered = CHANGES.filter(c => filter === 'all' || c.type === filter)

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { label: 'Pending CAB Review', count: pending,   color: '#fdab3d' },
          { label: 'Emergency Changes',  count: emergency, color: '#e2445c' },
          { label: 'Avg KIMMP Risk',     count: avgRisk,   color: '#7f53f9', suffix: '' },
        ] as const).map(s => (
          <div key={s.label} className="rounded-xl p-3.5"
            style={{ background: '#0d1117', border: `1px solid ${s.color}20` }}>
            <span className="text-2xl font-bold text-white tabular-nums">{s.count}</span>
            <p className="text-[10px] mt-0.5" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', ...Object.keys(TYPE_COLOR)] as const).map(t => (
          <button key={t} onClick={() => setFilter(t as ChangeType | 'all')}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: filter === t ? (t === 'all' ? 'rgba(124,58,237,0.12)' : `${TYPE_COLOR[t as ChangeType]}14`) : '#0d1117',
              border: `1px solid ${filter === t ? (t === 'all' ? 'rgba(124,58,237,0.35)' : `${TYPE_COLOR[t as ChangeType]}35`) : '#2E2854'}`,
              color: filter === t ? (t === 'all' ? '#a78bfa' : TYPE_COLOR[t as ChangeType]) : '#64748b',
            }}>
            {t === 'all' ? 'All Types' : t}
          </button>
        ))}
      </div>

      {/* Change list */}
      <div className="space-y-3">
        {filtered.map(c => <ChangeRow key={c.id} change={c} />)}
      </div>
    </div>
  )
}
