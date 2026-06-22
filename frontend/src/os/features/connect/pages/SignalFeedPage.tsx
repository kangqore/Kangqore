import { useState } from 'react'
import { Zap, Brain, Clock, ArrowRight } from 'lucide-react'

type SignalDomain = 'Revenue' | 'Delivery' | 'Finance' | 'People' | 'Operations' | 'Compliance'
type SignalLevel = 'L1' | 'L2' | 'L3' | 'L4'

interface IngestedSignal {
  id: string
  source: string
  sourceLogo: string
  rawEvent: string
  kimmpSignal: string
  domain: SignalDomain
  level: SignalLevel
  weight: number
  entity: string
  ts: string
  promoted: boolean   // promoted to a KIMMP intelligence signal (L3+)
  promotedTo?: string // what KIMMP generated from this
}

const DOMAIN_COLOR: Record<SignalDomain, string> = {
  Revenue:     '#00c875',
  Delivery:    '#2564ea',
  Finance:     '#fdab3d',
  People:      '#7f53f9',
  Operations:  '#64748b',
  Compliance:  '#e2445c',
}

const LEVEL_CONFIG: Record<SignalLevel, { label: string; color: string }> = {
  L1: { label: 'Raw Event',    color: '#334155' },
  L2: { label: 'Signal',      color: '#2564ea' },
  L3: { label: 'Correlation', color: '#7f53f9' },
  L4: { label: 'Intelligence', color: '#fdab3d' },
}

const SIGNALS: IngestedSignal[] = [
  {
    id: 'SIG-001',
    source: 'Salesforce', sourceLogo: '☁️',
    rawEvent: 'opportunity.marked_at_risk',
    kimmpSignal: 'Revenue · churn early warning',
    domain: 'Revenue', level: 'L2', weight: 95,
    entity: 'Meridian Logistics',
    ts: '2026-06-22T03:14:00Z',
    promoted: true,
    promotedTo: 'ISS-002: Client churn risk elevated — Meridian Logistics',
  },
  {
    id: 'SIG-002',
    source: 'Jira', sourceLogo: '🔵',
    rawEvent: 'sprint.velocity_drop',
    kimmpSignal: 'Delivery · velocity degraded',
    domain: 'Delivery', level: 'L2', weight: 90,
    entity: 'Project Phoenix',
    ts: '2026-06-22T03:01:00Z',
    promoted: true,
    promotedTo: 'ISS-001: Synapse Health delivery milestone missed',
  },
  {
    id: 'SIG-003',
    source: 'Stripe', sourceLogo: '💳',
    rawEvent: 'invoice.payment_overdue_30d',
    kimmpSignal: 'Finance · payment at risk',
    domain: 'Finance', level: 'L2', weight: 88,
    entity: 'Meridian Logistics',
    ts: '2026-06-22T02:47:00Z',
    promoted: true,
    promotedTo: 'ISS-003: Finance AR overdue threshold exceeded',
  },
  {
    id: 'SIG-004',
    source: 'Salesforce', sourceLogo: '☁️',
    rawEvent: 'account.activity_gap_22d',
    kimmpSignal: 'Revenue · engagement cold',
    domain: 'Revenue', level: 'L2', weight: 78,
    entity: 'Meridian Logistics',
    ts: '2026-06-22T02:30:00Z',
    promoted: false,
  },
  {
    id: 'SIG-005',
    source: 'GitHub', sourceLogo: '⬛',
    rawEvent: 'pr.review_overdue_48h',
    kimmpSignal: 'Delivery · review bottleneck',
    domain: 'Delivery', level: 'L2', weight: 72,
    entity: 'Project Atlas',
    ts: '2026-06-22T02:18:00Z',
    promoted: false,
  },
  {
    id: 'SIG-006',
    source: 'Jira', sourceLogo: '🔵',
    rawEvent: 'blocker.created',
    kimmpSignal: 'Delivery · blocker raised',
    domain: 'Delivery', level: 'L1', weight: 88,
    entity: 'Project Phoenix',
    ts: '2026-06-22T02:05:00Z',
    promoted: false,
  },
  {
    id: 'SIG-007',
    source: 'Slack', sourceLogo: '💬',
    rawEvent: 'channel.incident_opened',
    kimmpSignal: 'Operations · incident signal',
    domain: 'Operations', level: 'L1', weight: 85,
    entity: 'Engineering',
    ts: '2026-06-22T01:54:00Z',
    promoted: false,
  },
  {
    id: 'SIG-008',
    source: 'Microsoft 365', sourceLogo: '🟦',
    rawEvent: 'email.unanswered_client_thread',
    kimmpSignal: 'Revenue · engagement gap',
    domain: 'Revenue', level: 'L1', weight: 70,
    entity: 'Synapse Health',
    ts: '2026-06-22T01:41:00Z',
    promoted: false,
  },
  {
    id: 'SIG-009',
    source: 'Salesforce', sourceLogo: '☁️',
    rawEvent: 'contract.renewal_approaching_47d',
    kimmpSignal: 'Finance · contract expiry',
    domain: 'Finance', level: 'L2', weight: 80,
    entity: 'Meridian MSA',
    ts: '2026-06-22T01:30:00Z',
    promoted: false,
  },
  {
    id: 'SIG-010',
    source: 'GitHub', sourceLogo: '⬛',
    rawEvent: 'deployment.succeeded',
    kimmpSignal: 'Delivery · deployment health',
    domain: 'Delivery', level: 'L1', weight: 40,
    entity: 'Project Atlas',
    ts: '2026-06-22T01:15:00Z',
    promoted: false,
  },
  {
    id: 'SIG-011',
    source: 'Jira', sourceLogo: '🔵',
    rawEvent: 'sprint.completed',
    kimmpSignal: 'Delivery · sprint closed',
    domain: 'Delivery', level: 'L1', weight: 35,
    entity: 'Project Atlas',
    ts: '2026-06-22T01:00:00Z',
    promoted: false,
  },
  {
    id: 'SIG-012',
    source: 'Slack', sourceLogo: '💬',
    rawEvent: 'channel.client_sentiment_neg',
    kimmpSignal: 'Revenue · client sentiment',
    domain: 'Revenue', level: 'L2', weight: 68,
    entity: 'Meridian Logistics',
    ts: '2026-06-22T00:45:00Z',
    promoted: false,
  },
]

function relTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export function SignalFeedPage() {
  const [domainFilter, setDomainFilter] = useState<SignalDomain | 'all'>('all')
  const [levelFilter, setLevelFilter]   = useState<SignalLevel | 'all'>('all')
  const [promotedOnly, setPromotedOnly] = useState(false)

  const filtered = SIGNALS
    .filter(s => domainFilter === 'all' || s.domain === domainFilter)
    .filter(s => levelFilter === 'all' || s.level === levelFilter)
    .filter(s => !promotedOnly || s.promoted)

  const promoted = SIGNALS.filter(s => s.promoted).length

  return (
    <div className="space-y-5">

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Signals (last 6h)',  value: SIGNALS.length,                              color: '#2564ea' },
          { label: 'Promoted to Issues', value: promoted,                                     color: '#e2445c' },
          { label: 'Sources Active',     value: new Set(SIGNALS.map(s => s.source)).size,     color: '#00c875' },
          { label: 'High Weight (≥80)',  value: SIGNALS.filter(s => s.weight >= 80).length,   color: '#fdab3d' },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: '#0d1117', border: `1px solid ${s.color}18` }}>
            <p className="text-xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'Revenue', 'Delivery', 'Finance', 'People', 'Operations', 'Compliance'] as const).map(d => (
          <button key={d} onClick={() => setDomainFilter(d)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: domainFilter === d ? `${d === 'all' ? 'rgba(37,100,234,0.1)' : DOMAIN_COLOR[d as SignalDomain] + '10'}` : '#0d1117',
              border: `1px solid ${domainFilter === d ? (d === 'all' ? 'rgba(37,100,234,0.3)' : DOMAIN_COLOR[d as SignalDomain] + '35') : '#2E2854'}`,
              color: domainFilter === d ? (d === 'all' ? '#60a5fa' : DOMAIN_COLOR[d as SignalDomain]) : '#64748b',
            }}>
            {d}
          </button>
        ))}
        <div className="w-px h-4 bg-[#2E2854]" />
        <button onClick={() => setPromotedOnly(p => !p)}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
          style={{
            background: promotedOnly ? 'rgba(226,68,92,0.08)' : '#0d1117',
            border: `1px solid ${promotedOnly ? 'rgba(226,68,92,0.3)' : '#2E2854'}`,
            color: promotedOnly ? '#f87171' : '#64748b',
          }}>
          <Brain style={{ width: 10, height: 10 }} />
          Promoted to Issues only
        </button>
      </div>

      {/* Feed */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1f2a4a' }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] font-bold text-slate-400">Live Signal Ingestion Feed</p>
          </div>
          <p className="text-[10px] text-slate-600">{filtered.length} signals</p>
        </div>

        <div className="divide-y divide-[#1a2035]">
          {filtered.map(sig => {
            const domainColor = DOMAIN_COLOR[sig.domain]
            const levelCfg = LEVEL_CONFIG[sig.level]

            return (
              <div key={sig.id} className="px-4 py-3 hover:bg-white/[0.015] transition-colors">
                <div className="flex items-start gap-3">
                  {/* Source */}
                  <div className="flex-shrink-0 text-lg leading-none mt-0.5">{sig.sourceLogo}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{ color: levelCfg.color, background: `${levelCfg.color}12`, border: `1px solid ${levelCfg.color}25` }}>
                            {levelCfg.label}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ color: domainColor, background: `${domainColor}10`, border: `1px solid ${domainColor}20` }}>
                            {sig.domain}
                          </span>
                          <span className="text-[10px] text-slate-500">{sig.source}</span>
                          <span className="text-[10px] text-slate-600">· {sig.entity}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-600">{sig.rawEvent}</span>
                          <ArrowRight style={{ width: 10, height: 10, color: '#334155' }} />
                          <span className="text-[11px] font-semibold text-slate-300">{sig.kimmpSignal}</span>
                        </div>

                        {sig.promoted && sig.promotedTo && (
                          <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                            <Brain style={{ width: 10, height: 10, color: '#a78bfa' }} />
                            <span className="text-[10px] font-bold text-purple-400">Promoted → </span>
                            <span className="text-[10px] text-slate-400">{sig.promotedTo}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0 flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-[10px] text-slate-600">
                          <Clock style={{ width: 9, height: 9 }} />
                          {relTime(sig.ts)}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-slate-700">weight</span>
                          <span className="text-[10px] font-bold tabular-nums"
                            style={{ color: sig.weight >= 85 ? '#e2445c' : sig.weight >= 70 ? '#fdab3d' : '#64748b' }}>
                            {sig.weight}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pyramid note */}
      <div className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
        <Brain style={{ width: 14, height: 14, color: '#a78bfa' }} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-purple-300 mb-1">KIMMP Signal Processing — 5-Level Pyramid</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            L1 raw events → L2 typed signals → L3 correlations (same entity, timing window) → L4 intelligence (KIMMP synthesis) → L5 decisions (admin approval required).
            Only high-weight signals (≥70) and correlated clusters are promoted to Issues in the Ops Centre.
          </p>
        </div>
      </div>
    </div>
  )
}
