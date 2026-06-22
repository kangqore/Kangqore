import { useQuery } from '@tanstack/react-query'
import {
  Brain, TrendingUp, TrendingDown, Minus, AlertTriangle,
  CheckCircle, Clock, Shield, Activity, ChevronRight,
  Zap, RefreshCw, Flag,
} from 'lucide-react'
import { api, isDemo } from '@lib/api'

// ── Domain health grid ────────────────────────────────────────────────────────

type RAG = 'PASS' | 'WARN' | 'FAIL'

interface Domain {
  id: string
  label: string
  status: RAG
  signal: string
  trend: number
}

const DOMAINS: Domain[] = [
  { id: 'revenue',    label: 'Revenue',    status: 'WARN', signal: '2 churn risks detected. Pipeline velocity −8% WoW.',      trend: -8  },
  { id: 'delivery',   label: 'Delivery',   status: 'FAIL', signal: 'Project Phoenix milestone missed. Sprint velocity −14%.',  trend: -14 },
  { id: 'finance',    label: 'Finance',    status: 'WARN', signal: 'AR overdue $47K. Contract renewal due in 47 days.',        trend: -3  },
  { id: 'people',     label: 'People',     status: 'PASS', signal: 'All capacity targets met. No attrition signals.',          trend: +2  },
  { id: 'operations', label: 'Operations', status: 'WARN', signal: '2 active P2 issues. CHG-041 pending CAB sign-off.',        trend: -5  },
  { id: 'compliance', label: 'Compliance', status: 'WARN', signal: 'Score 73%. 3 controls failing. SOC 2 Type II in 47 days.', trend:  0  },
]

const RAG_COLOR: Record<RAG, string> = {
  PASS: '#00c875',
  WARN: '#fdab3d',
  FAIL: '#e2445c',
}

const RAG_LABEL: Record<RAG, string> = {
  PASS: 'Healthy',
  WARN: 'At Risk',
  FAIL: 'Critical',
}

function TrendIcon({ v }: { v: number }) {
  if (v > 0) return <TrendingUp  style={{ width: 12, height: 12, color: '#00c875' }} />
  if (v < 0) return <TrendingDown style={{ width: 12, height: 12, color: '#e2445c' }} />
  return <Minus style={{ width: 12, height: 12, color: '#64748b' }} />
}

function DomainCard({ d }: { d: Domain }) {
  const c = RAG_COLOR[d.status]
  return (
    <div className="rounded-xl p-4 flex flex-col gap-2.5"
      style={{ background: '#0d1117', border: `1px solid ${c}20`, borderLeft: `3px solid ${c}` }}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-black text-slate-300 uppercase tracking-wider">{d.label}</p>
        <div className="flex items-center gap-1.5">
          <TrendIcon v={d.trend} />
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ color: c, background: `${c}10`, border: `1px solid ${c}25` }}>
            {RAG_LABEL[d.status]}
          </span>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">{d.signal}</p>
    </div>
  )
}

// ── Top KIMMP Insights ────────────────────────────────────────────────────────

interface KIMMPInsight {
  id: string
  priority: 'critical' | 'high' | 'medium'
  domain: string
  title: string
  summary: string
  action: string
  confidence: number
  entity?: string
}

const MOCK_INSIGHTS: KIMMPInsight[] = [
  {
    id: 'KI-001',
    priority: 'critical',
    domain: 'Revenue',
    title: 'Meridian Logistics — multi-signal churn pattern',
    summary: 'KIMMP correlated 4 signals across Salesforce + Finance + Delivery over 72h: opportunity at risk, 30d overdue invoice, delivery delay, engagement gap 22 days. Combined churn probability: 87%.',
    action: 'Assign executive sponsor. Initiate retention workflow. Schedule call within 24h.',
    confidence: 87,
    entity: 'Meridian Logistics',
  },
  {
    id: 'KI-002',
    priority: 'high',
    domain: 'Delivery',
    title: 'Project Phoenix — systemic velocity degradation',
    summary: 'Sprint velocity dropped 14% over 2 sprints. Jira blocker raised. Sprint review overdue 48h. Root Cause Engine links to single team bottleneck — 2 PRs stalled on one reviewer for 5 days.',
    action: 'Reassign PR reviews. Unblock Project Phoenix sprint. Escalate if velocity <target after 1 sprint.',
    confidence: 92,
    entity: 'Project Phoenix',
  },
  {
    id: 'KI-003',
    priority: 'high',
    domain: 'Compliance',
    title: 'ISS-005 — 3-framework control failure',
    summary: '12 user accounts exceed the 90-day access review SLA. This single issue is causing simultaneous FAIL in SOC 2 CC6.3, ISO A.9.4.1, and NIST PR.AC-1. Audit in 47 days.',
    action: 'Initiate access review immediately. 2h task, resolves 3 compliance failures, adds +16% to compliance score.',
    confidence: 99,
    entity: 'Compliance',
  },
]

const PRIORITY_COLOR = {
  critical: '#e2445c',
  high:     '#fdab3d',
  medium:   '#2564ea',
} as const

function InsightCard({ insight }: { insight: KIMMPInsight }) {
  const c = PRIORITY_COLOR[insight.priority]
  return (
    <div className="rounded-xl p-4" style={{ background: '#0d1117', border: `1px solid ${c}15`, borderLeft: `3px solid ${c}` }}>
      <div className="flex items-start gap-3">
        <Brain style={{ width: 14, height: 14, color: '#a78bfa', flexShrink: 0, marginTop: 2 }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-[12px] font-bold text-white leading-tight">{insight.title}</p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{ color: c, background: `${c}10`, border: `1px solid ${c}25` }}>
                {insight.priority.toUpperCase()}
              </span>
              <span className="text-[9px] text-slate-600">{insight.confidence}%</span>
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{insight.domain}</span>
          {insight.entity && <span className="text-[9px] text-slate-600"> · {insight.entity}</span>}
          <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5">{insight.summary}</p>
          <div className="mt-2 flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg"
            style={{ background: 'rgba(37,100,234,0.06)', border: '1px solid rgba(37,100,234,0.15)' }}>
            <ChevronRight style={{ width: 10, height: 10, color: '#60a5fa', flexShrink: 0, marginTop: 2 }} />
            <p className="text-[10px] text-blue-300 leading-relaxed">{insight.action}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Action Required ───────────────────────────────────────────────────────────

const PENDING_DECISIONS = [
  { id: 'DEC-047', title: 'Approve Meridian retention budget ($12K)',  module: 'Finance',    urgency: 'high'   },
  { id: 'DEC-048', title: 'Sign off CHG-041 emergency change',          module: 'Governance', urgency: 'high'   },
  { id: 'DEC-049', title: 'Approve Project Atlas sprint re-scope',       module: 'Delivery',   urgency: 'medium' },
]

const P1_ISSUES = [
  { id: 'ISS-001', title: 'Synapse Health delivery milestone missed',    slaRemaining: '2h 14m', color: '#e2445c' },
  { id: 'ISS-002', title: 'Meridian Logistics client churn risk elevated', slaRemaining: '6h',    color: '#fdab3d' },
]

function ActionPanel() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #1f2a4a' }}>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Flag style={{ width: 12, height: 12, color: '#e2445c' }} />
          Action Required
        </p>
      </div>

      <div className="p-3 space-y-2">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider px-1 mb-2">Decisions Pending ({PENDING_DECISIONS.length})</p>
        {PENDING_DECISIONS.map(d => (
          <div key={d.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1f2a4a' }}>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-white truncate">{d.title}</p>
              <p className="text-[9px] text-slate-600 font-mono">{d.id} · {d.module}</p>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
              style={{
                color:      d.urgency === 'high' ? '#fdab3d' : '#64748b',
                background: d.urgency === 'high' ? 'rgba(253,171,61,0.08)' : 'rgba(100,116,139,0.08)',
                border:     `1px solid ${d.urgency === 'high' ? 'rgba(253,171,61,0.2)' : '#2E2854'}`,
              }}>
              {d.urgency.toUpperCase()}
            </span>
          </div>
        ))}

        <div className="pt-2" style={{ borderTop: '1px solid #1f2a4a' }}>
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider px-1 mb-2">P1/P2 Issues — SLA Clock</p>
          {P1_ISSUES.map(issue => (
            <div key={issue.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg mb-1.5"
              style={{ background: `${issue.color}06`, border: `1px solid ${issue.color}20` }}>
              <p className="text-[11px] font-semibold text-white truncate flex-1">{issue.title}</p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Clock style={{ width: 9, height: 9, color: issue.color }} />
                <span className="text-[10px] font-bold tabular-nums" style={{ color: issue.color }}>{issue.slaRemaining}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Ops Centre Snapshot ───────────────────────────────────────────────────────

function OpsSnapshot() {
  const rows = [
    { label: 'Active P1/P2 Issues',   value: '2',    color: '#e2445c', icon: AlertTriangle },
    { label: 'Commitments at risk',   value: '3',    color: '#fdab3d', icon: Clock         },
    { label: 'Changes pending CAB',   value: '1',    color: '#fdab3d', icon: RefreshCw     },
    { label: 'Issues resolved today', value: '4',    color: '#00c875', icon: CheckCircle   },
  ]
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #1f2a4a' }}>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Activity style={{ width: 12, height: 12, color: '#e2445c' }} />
          Ops Centre Snapshot
        </p>
      </div>
      <div className="divide-y divide-[#1a2035]">
        {rows.map(r => (
          <div key={r.label} className="px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <r.icon style={{ width: 12, height: 12, color: r.color }} />
              {r.label}
            </div>
            <span className="text-sm font-bold tabular-nums" style={{ color: r.color }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── AEGIS Posture Mini ────────────────────────────────────────────────────────

function AegisPosture() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #1f2a4a' }}>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Shield style={{ width: 12, height: 12, color: '#7f53f9' }} />
          AEGIS Posture
        </p>
      </div>
      <div className="p-4 space-y-3">
        {[
          { label: 'Compliance score',    value: '73%',  sub: '3 controls failing',          color: '#fdab3d' },
          { label: 'Breach readiness',    value: '73',   sub: 'DR test overdue',              color: '#fdab3d' },
          { label: 'AEGIS corps',         value: '80',   sub: 'agents active, PASS overall',  color: '#00c875' },
          { label: 'Days to audit',       value: '47',   sub: 'SOC 2 Type II',                color: '#7f53f9' },
        ].map(r => (
          <div key={r.label} className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500">{r.label}</p>
              <p className="text-[10px] text-slate-700">{r.sub}</p>
            </div>
            <p className="text-base font-black tabular-nums" style={{ color: r.color }}>{r.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Signal Pyramid ────────────────────────────────────────────────────────────

const PYRAMID = [
  { level: 'L5', label: 'Decisions',     count: 3,   color: '#e2445c' },
  { level: 'L4', label: 'Intelligence',  count: 12,  color: '#7f53f9' },
  { level: 'L3', label: 'Correlations',  count: 38,  color: '#2564ea' },
  { level: 'L2', label: 'Signals',       count: 131, color: '#60a5fa' },
  { level: 'L1', label: 'Raw Events',    count: 847, color: '#334155' },
]

function SignalPyramid() {
  const max = Math.max(...PYRAMID.map(p => p.count))
  return (
    <div className="rounded-xl p-4" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Zap style={{ width: 12, height: 12, color: '#60a5fa' }} />
        Signal Pyramid — today
      </p>
      <div className="space-y-1.5">
        {PYRAMID.map(p => (
          <div key={p.level} className="flex items-center gap-3">
            <span className="text-[9px] font-mono text-slate-600 w-4 flex-shrink-0">{p.level}</span>
            <div className="flex-1 h-5 rounded" style={{ background: '#111827' }}>
              <div className="h-full rounded flex items-center justify-end pr-2 transition-all duration-700"
                style={{ width: `${Math.max(5, (p.count / max) * 100)}%`, background: `${p.color}20`, border: `1px solid ${p.color}25` }}>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 w-28">
              <span className="text-[11px] font-bold tabular-nums" style={{ color: p.color }}>{p.count.toLocaleString()}</span>
              <span className="text-[10px] text-slate-600">{p.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── One Signal ────────────────────────────────────────────────────────────────

function OneSignal() {
  return (
    <div className="rounded-2xl p-6"
      style={{ background: 'linear-gradient(135deg, rgba(127,83,249,0.08) 0%, rgba(37,100,234,0.05) 100%)', border: '1px solid rgba(127,83,249,0.2)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Brain style={{ width: 14, height: 14, color: '#a78bfa' }} />
        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">KIMMP One Signal</p>
        <span className="text-[9px] text-slate-600 ml-auto">The single most important thing today</span>
      </div>
      <p className="text-xl font-bold text-white leading-snug">
        Meridian Logistics is showing 87% churn probability across 4 correlated signals.{' '}
        <span style={{ color: '#fdab3d' }}>
          Without executive intervention in the next 24 hours, this becomes an active client loss.
        </span>
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Revenue · Meridian Logistics
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#e2445c' }} />
          Confidence: 87%
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Clock style={{ width: 10, height: 10 }} />
          Escalated 3h ago
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function timeStr() {
  return new Date().toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function BriefingPage() {
  const { data: routerStats } = useQuery({
    queryKey: ['kimmp-router-stats'],
    queryFn:  () => api.get('/admin/kangqore-immp/learning/router/stats').then(r => r.data),
    enabled:  !isDemo(),
    staleTime: 60_000,
    refetchInterval: 60_000,
  })

  const autonomy = Math.round((routerStats?.autonomyRatio ?? 0) * 100)

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">{greeting()}, Mahesh</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">{timeStr()}</p>
          <p className="text-[11px] text-slate-600 mt-1">
            KIMMP has processed{' '}
            <span className="text-purple-400 font-bold">{PYRAMID[1].count} signals</span>{' '}
            and synthesised{' '}
            <span className="text-violet-400 font-bold">{PYRAMID[0].count} intelligence reports</span>{' '}
            since midnight. Your attention is needed on{' '}
            <span className="text-red-400 font-bold">{PYRAMID[4].count} items</span>.
          </p>
        </div>
        <div className="flex-shrink-0 px-4 py-2.5 rounded-xl flex items-center gap-3"
          style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
          <div className="text-center">
            <p className="text-base font-black text-purple-400 tabular-nums">{autonomy}%</p>
            <p className="text-[9px] text-slate-600">KIMMP<br />autonomy</p>
          </div>
          <div className="w-px h-8 bg-[#2E2854]" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] text-slate-500">Live</p>
          </div>
        </div>
      </div>

      {/* Domain health grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {DOMAINS.map(d => <DomainCard key={d.id} d={d} />)}
      </div>

      {/* Insights + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Top KIMMP Insights</p>
          {MOCK_INSIGHTS.map(i => <InsightCard key={i.id} insight={i} />)}
        </div>
        <ActionPanel />
      </div>

      {/* Ops + AEGIS + Pyramid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <OpsSnapshot />
        <AegisPosture />
        <SignalPyramid />
      </div>

      {/* One Signal */}
      <OneSignal />

    </div>
  )
}
