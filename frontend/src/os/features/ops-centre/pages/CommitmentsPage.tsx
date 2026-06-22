import { Brain, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react'

type RagStatus = 'green' | 'amber' | 'red'
type CommitmentType = 'SLA' | 'Milestone' | 'KPI' | 'Contract'

interface Commitment {
  id: string
  title: string
  entity: string
  type: CommitmentType
  ragStatus: RagStatus
  breachProbability: number
  daysToBreach: number | null
  currentValue: string
  targetValue: string
  dueDate: string
  kimmpNote: string
  trend: 'up' | 'down' | 'flat'
}

const COMMITMENTS: Commitment[] = [
  {
    id: 'CMT-001',
    title: 'Synapse Health Sprint 14 Delivery Milestone',
    entity: 'Synapse Health',
    type: 'Milestone',
    ragStatus: 'red',
    breachProbability: 94,
    daysToBreach: 5,
    currentValue: '66% velocity',
    targetValue: '100% sprint delivery',
    dueDate: '2026-06-26',
    kimmpNote: 'Resource conflict on lead engineer is primary driver. Velocity will not recover in 5 days without intervention.',
    trend: 'down',
  },
  {
    id: 'CMT-002',
    title: 'P1 Issue SLA — 4-hour acknowledgement',
    entity: 'Ops Centre Policy',
    type: 'SLA',
    ragStatus: 'red',
    breachProbability: 100,
    daysToBreach: 0,
    currentValue: 'ISS-002 unacknowledged',
    targetValue: 'Ack within 4h of raise',
    dueDate: '2026-06-21',
    kimmpNote: 'ISS-002 was raised 4h 12m ago with no acknowledgement logged. SLA breached.',
    trend: 'down',
  },
  {
    id: 'CMT-003',
    title: 'Q2 Revenue Target — ₹48L ARR',
    entity: 'Revenue',
    type: 'KPI',
    ragStatus: 'amber',
    breachProbability: 58,
    daysToBreach: 10,
    currentValue: '₹38.4L (80% of target)',
    targetValue: '₹48L by June 30',
    dueDate: '2026-06-30',
    kimmpNote: 'At current velocity, Q2 closes at ₹42L (87.5%). Three delayed invoices could close the gap if collected.',
    trend: 'flat',
  },
  {
    id: 'CMT-004',
    title: 'AR Collection — overdue invoices',
    entity: 'Finance',
    type: 'Contract',
    ragStatus: 'red',
    breachProbability: 88,
    daysToBreach: 47,
    currentValue: '₹8.4L outstanding (30+ days)',
    targetValue: 'Zero >30-day AR',
    dueDate: '2026-07-31',
    kimmpNote: 'Three clients are >30 days overdue. Without intervention, cash position becomes critical in 47 days.',
    trend: 'down',
  },
  {
    id: 'CMT-005',
    title: 'Client NPS — quarterly target ≥70',
    entity: 'Client Success',
    type: 'KPI',
    ragStatus: 'green',
    breachProbability: 8,
    daysToBreach: null,
    currentValue: 'NPS 74',
    targetValue: '≥70 NPS',
    dueDate: '2026-06-30',
    kimmpNote: 'NPS is above target. Meridian Logistics churn risk (RCA-002) could affect score if escalated.',
    trend: 'up',
  },
  {
    id: 'CMT-006',
    title: 'SOC 2 Access Review — 90-day cycle',
    entity: 'AEGIS',
    type: 'SLA',
    ragStatus: 'red',
    breachProbability: 100,
    daysToBreach: 0,
    currentValue: '12 users at 91 days',
    targetValue: '0 users exceeding 90 days',
    dueDate: '2026-06-21',
    kimmpNote: 'Control CC6.1 is currently failing. Audit exposure exists until review is completed and documented.',
    trend: 'down',
  },
  {
    id: 'CMT-007',
    title: 'Consultation Show-Rate — weekly ≥75%',
    entity: 'Consultations',
    type: 'KPI',
    ragStatus: 'amber',
    breachProbability: 62,
    daysToBreach: 7,
    currentValue: '58% (week of June 16)',
    targetValue: '≥75% weekly show-rate',
    dueDate: '2026-06-28',
    kimmpNote: 'Show-rate is below target for the second consecutive week. Reminder automation deployment is the lowest-effort recovery path.',
    trend: 'down',
  },
  {
    id: 'CMT-008',
    title: 'Q2 Lead Volume Target — 50 inbound leads',
    entity: 'Marketing',
    type: 'KPI',
    ragStatus: 'amber',
    breachProbability: 72,
    daysToBreach: 10,
    currentValue: '31 leads (62% of target)',
    targetValue: '50 leads by June 30',
    dueDate: '2026-06-30',
    kimmpNote: 'Requires 19 leads in 10 days. Achievable with outbound activation; unlikely on inbound alone.',
    trend: 'flat',
  },
  {
    id: 'CMT-009',
    title: 'Meridian Logistics — Quarterly Business Review',
    entity: 'Meridian Logistics',
    type: 'Contract',
    ragStatus: 'amber',
    breachProbability: 45,
    daysToBreach: 14,
    currentValue: 'QBR not scheduled',
    targetValue: 'QBR completed by July 5',
    dueDate: '2026-07-05',
    kimmpNote: 'Combined with churn signals, failure to complete QBR increases churn probability by an estimated 18%.',
    trend: 'flat',
  },
]

const RAG_COLOR: Record<RagStatus, string> = {
  green: '#00c875',
  amber: '#fdab3d',
  red:   '#e2445c',
}

const RAG_BG: Record<RagStatus, string> = {
  green: 'rgba(0,200,117,0.08)',
  amber: 'rgba(253,171,61,0.08)',
  red:   'rgba(226,68,92,0.08)',
}

const TYPE_COLOR: Record<CommitmentType, string> = {
  SLA:       '#7f53f9',
  Milestone: '#2564ea',
  KPI:       '#00c875',
  Contract:  '#fdab3d',
}

function TrendIcon({ trend }: { trend: Commitment['trend'] }) {
  if (trend === 'up')   return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-400" />
  return <Minus className="w-3.5 h-3.5 text-slate-600" />
}

function BreachBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? '#e2445c' : pct >= 50 ? '#fdab3d' : '#00c875'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1f2a4a' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold tabular-nums w-9 text-right" style={{ color }}>{pct}%</span>
    </div>
  )
}

export function CommitmentsPage() {
  const breached  = COMMITMENTS.filter(c => c.ragStatus === 'red').length
  const atRisk    = COMMITMENTS.filter(c => c.ragStatus === 'amber').length
  const onTrack   = COMMITMENTS.filter(c => c.ragStatus === 'green').length

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { label: 'Breached / At Limit', count: breached, color: '#e2445c' },
          { label: 'At Risk',             count: atRisk,   color: '#fdab3d' },
          { label: 'On Track',            count: onTrack,  color: '#00c875' },
        ] as const).map(s => (
          <div key={s.label} className="rounded-xl p-3.5"
            style={{ background: '#0d1117', border: `1px solid ${s.color}20` }}>
            <span className="text-2xl font-bold text-white tabular-nums">{s.count}</span>
            <p className="text-[10px] mt-0.5" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
        <div className="px-4 py-3 border-b border-[#1f2a4a]">
          <p className="text-xs font-bold text-slate-300">All Commitments</p>
        </div>
        <div className="divide-y divide-[#1a2035]">
          {COMMITMENTS.map(c => (
            <div key={c.id} className="px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start gap-3">
                {/* RAG dot */}
                <div className="flex-shrink-0 mt-1.5 w-2.5 h-2.5 rounded-full"
                  style={{ background: RAG_COLOR[c.ragStatus], boxShadow: `0 0 6px ${RAG_COLOR[c.ragStatus]}50` }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-white leading-tight truncate">{c.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{ color: TYPE_COLOR[c.type], background: `${TYPE_COLOR[c.type]}14`, border: `1px solid ${TYPE_COLOR[c.type]}25` }}>
                          {c.type}
                        </span>
                        <span className="text-[10px] text-slate-500">{c.entity}</span>
                        <span className="text-[10px] text-slate-600">Due {c.dueDate}</span>
                        {c.daysToBreach === 0 && (
                          <span className="text-[10px] font-bold text-red-400 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" /> Breached
                          </span>
                        )}
                        {c.daysToBreach !== null && c.daysToBreach > 0 && (
                          <span className="text-[10px] font-bold flex items-center gap-0.5"
                            style={{ color: c.daysToBreach <= 7 ? '#e2445c' : '#fdab3d' }}>
                            <Clock className="w-2.5 h-2.5" /> {c.daysToBreach}d to breach
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 mt-0.5">
                      <TrendIcon trend={c.trend} />
                    </div>
                  </div>

                  {/* Current vs target */}
                  <div className="mt-2 flex items-center gap-3 text-[10px]">
                    <span className="text-slate-500">Current: <span className="text-slate-300 font-semibold">{c.currentValue}</span></span>
                    <span className="text-slate-600">→</span>
                    <span className="text-slate-500">Target: <span className="text-slate-300 font-semibold">{c.targetValue}</span></span>
                  </div>

                  {/* Breach probability bar */}
                  <div className="mt-2">
                    <p className="text-[9px] text-slate-600 mb-1 uppercase tracking-wider">Breach probability</p>
                    <BreachBar pct={c.breachProbability} />
                  </div>

                  {/* KIMMP note */}
                  <div className="mt-2 flex items-start gap-1.5 px-2.5 py-2 rounded-lg"
                    style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
                    <Brain className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-400 leading-relaxed">{c.kimmpNote}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
