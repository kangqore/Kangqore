import { Brain, Clock, User, ChevronDown, ChevronUp, Database } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

interface AuditLogEntry {
  id: string
  action: string
  resource: string
  createdAt: string
  user?: { name: string; role: string }
}

interface AuditLogsResponse {
  logs: AuditLogEntry[]
  pagination: { total: number; totalPages: number }
}

function useLiveAuditCount() {
  return useQuery<AuditLogsResponse>({
    queryKey: ['audit-logs'],
    queryFn: () => api.get('/admin/audit-logs').then(r => r.data),
    staleTime: 60_000,
  })
}

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
    raisedBy: 'C.O.D.E.',
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
    raisedBy: 'C.O.D.E.',
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
  IT:         '#579bfc',
  Product:    '#7c3aed',
  Process:    '#fdab3d',
  Commercial: '#00c875',
  Org:        '#e2445c',
}

const STATUS_COLOR: Record<ChangeStatus, string> = {
  pending:       'var(--os-text-2)',
  approved:      '#00c875',
  'in-progress': '#579bfc',
  completed:     '#00c875',
  rejected:      '#e2445c',
}

function riskAccent(score: number) {
  return score >= 60 ? '#e2445c' : score >= 30 ? '#fdab3d' : '#00c875'
}

function ChangeRow({ change }: { change: Change }) {
  const [open, setOpen] = useState(false)
  const typeColor   = TYPE_COLOR[change.type]
  const statusColor = STATUS_COLOR[change.status]
  const rColor      = riskAccent(change.riskScore)

  return (
    <div className="os-card overflow-hidden" style={{ borderLeft: `4px solid ${rColor}` }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Risk score */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center"
            style={{ background: rColor + '18', border: `1px solid ${rColor}30` }}>
            <span className="text-[11px] font-black tabular-nums" style={{ color: rColor }}>{change.riskScore}</span>
            <span className="text-[8px]" style={{ color: 'var(--os-text-3)' }}>risk</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {change.emergencyChange && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide"
                      style={{ background: '#e2445c12', color: '#e2445c', border: '1px solid #e2445c30' }}>
                      Emergency
                    </span>
                  )}
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: typeColor, background: typeColor + '14', border: `1px solid ${typeColor}25` }}>
                    {change.type}
                  </span>
                  <span className="text-[9px]" style={{ color: 'var(--os-text-3)' }}>{change.id}</span>
                </div>
                <p className="text-[13px] font-semibold leading-tight" style={{ color: 'var(--os-text-1)' }}>{change.title}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg capitalize flex-shrink-0"
                style={{ color: statusColor, background: statusColor + '12', border: `1px solid ${statusColor}30` }}>
                {change.status}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--os-text-3)' }}>
                <User className="w-2.5 h-2.5" />
                {change.raisedBy}
              </span>
              <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--os-text-3)' }}>
                <Clock className="w-2.5 h-2.5" />
                Review by {change.reviewDeadline}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--os-text-3)' }}>Proposed: {change.proposedDate}</span>
            </div>

            {/* Risk bar */}
            <div className="mt-2 flex items-center gap-2">
              <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
                <div className="h-full rounded-full" style={{ width: `${change.riskScore}%`, background: rColor }} />
              </div>
              <span className="text-[10px] font-bold" style={{ color: rColor }}>
                {change.riskScore} · {change.riskScore >= 60 ? 'High' : change.riskScore >= 30 ? 'Medium' : 'Low'}
              </span>
            </div>

            {/* KIMMP risk reason */}
            <div className="mt-2.5 flex items-start gap-2 px-3 py-2 rounded-lg"
              style={{ background: '#7c3aed08', border: '1px solid #7c3aed20' }}>
              <Brain className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#7c3aed' }} />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>KIMMP Risk Assessment</span>
                <p className="text-[11px] mt-0.5 leading-relaxed line-clamp-2" style={{ color: 'var(--os-text-2)' }}>{change.kimmpRiskReason}</p>
              </div>
            </div>

            {open && (
              <div className="mt-3 pt-3 space-y-2 border-t border-[var(--os-border)]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--os-text-3)' }}>Change Summary</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--os-text-2)' }}>{change.summary}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--os-text-3)' }}>Affected Entities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {change.affectedEntities.map(e => (
                      <span key={e} className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-2)' }}>
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => setOpen(o => !o)}
              className="mt-2 flex items-center gap-1 text-xs font-medium transition-colors hover:text-[#579bfc]"
              style={{ color: 'var(--os-text-3)' }}>
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
  const { data: auditData, isLoading: auditLoading } = useLiveAuditCount()
  const auditTotal = auditData?.pagination?.total ?? 0

  return (
    <div className="space-y-5">
      {/* Live governance count */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ background: '#579bfc08', border: '1px solid #579bfc20' }}>
        <Database className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#579bfc' }} />
        <p className="text-[11px]" style={{ color: 'var(--os-text-2)' }}>
          {auditLoading ? (
            <span style={{ color: 'var(--os-text-3)' }}>Loading governance log…</span>
          ) : auditTotal > 0 ? (
            <><span className="font-semibold" style={{ color: 'var(--os-text-1)' }}>{auditTotal}</span> governance events recorded in the audit log (risks, decisions, change requests, deliverables)</>
          ) : (
            <span style={{ color: 'var(--os-text-3)' }}>No governance events in audit log yet</span>
          )}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending CAB Review', count: pending,   color: '#fdab3d' },
          { label: 'Emergency Changes',  count: emergency, color: '#e2445c' },
          { label: 'Avg KIMMP Risk',     count: avgRisk,   color: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="os-card p-3.5">
            <span className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.count}</span>
            <p className="text-[10px] mt-0.5 font-semibold" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', ...Object.keys(TYPE_COLOR)] as const).map(t => {
          const isActive = filter === t
          const color = t === 'all' ? '#7c3aed' : TYPE_COLOR[t as ChangeType]
          return (
            <button key={t} onClick={() => setFilter(t as ChangeType | 'all')}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: isActive ? color + '14' : 'var(--os-surface-0)',
                border: `1px solid ${isActive ? color + '35' : 'var(--os-border)'}`,
                color: isActive ? color : 'var(--os-text-2)',
              }}>
              {t === 'all' ? 'All Types' : t}
            </button>
          )
        })}
      </div>

      {/* Change list */}
      <div className="space-y-3">
        {filtered.map(c => <ChangeRow key={c.id} change={c} />)}
      </div>
    </div>
  )
}
