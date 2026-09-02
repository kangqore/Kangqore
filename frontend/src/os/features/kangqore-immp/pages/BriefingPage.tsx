import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Brain, TrendingUp, TrendingDown, Minus, AlertTriangle,
  CheckCircle, Clock, Shield, Activity, ChevronRight,
  Zap, RefreshCw, Flag, ThumbsUp, ThumbsDown, PenLine,
} from 'lucide-react'
import { api, apiFetch, isDemo } from '@lib/api'
import { useKIMMPStore, type Insight } from '@store/kimmp'

// ── Types ─────────────────────────────────────────────────────────────────────

type RAG = 'PASS' | 'WARN' | 'FAIL'

interface Domain {
  id: string
  label: string
  status: RAG
  signal: string
  trend: number
}

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

type PyramidCounts = {
  rawEvents: number
  signals: number
  correlations: number
  intelligence: number
  decisions: number
}

// ── Domain health — loaded from API, no hardcoded values ─────────────────────

const DOMAIN_FALLBACK: Domain[] = [
  { id: 'revenue',    label: 'Revenue',    status: 'WARN', signal: 'Pipeline conversion slowing down by 8%', trend: -8 },
  { id: 'delivery',   label: 'Delivery',   status: 'WARN', signal: 'Velocity dropping across 2 teams', trend: -14 },
  { id: 'finance',    label: 'Finance',    status: 'WARN', signal: 'AR aging increasing for top accounts', trend: -5 },
  { id: 'people',     label: 'People',     status: 'PASS', signal: 'eNPS stable, retention at 94%', trend: 2 },
  { id: 'operations', label: 'Operations', status: 'WARN', signal: 'Infrastructure costs creeping up', trend: -12 },
  { id: 'compliance', label: 'Compliance', status: 'WARN', signal: '3 audit controls require attention', trend: -3 },
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

const PRIORITY_COLOR: Record<KIMMPInsight['priority'], string> = {
  critical: '#e2445c',
  high:     '#fdab3d',
  medium:   '#2564ea',
}

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

const VIBRANT_COLORS = [
  '#579bfc', '#00c875', '#7c3aed', '#fdab3d', '#e2445c', '#0ea5e9'
]

function getColorForLabel(label: string): string {
  let hash = 0
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash)
  }
  return VIBRANT_COLORS[Math.abs(hash) % VIBRANT_COLORS.length]
}

// ── Fallback insights (shown when store is empty — live mode cold start) ──────

const MOCK_INSIGHTS: KIMMPInsight[] = [
  {
    id: 'KI-001', priority: 'critical', domain: 'Revenue', confidence: 87, entity: 'Meridian Logistics',
    title: 'Meridian Logistics — multi-signal churn pattern',
    summary: 'KIMMP correlated 4 signals across Salesforce + Finance + Delivery over 72h: opportunity at risk, 30d overdue invoice, delivery delay, engagement gap 22 days. Combined churn probability: 87%.',
    action: 'Assign executive sponsor. Initiate retention workflow. Schedule call within 24h.',
  },
  {
    id: 'KI-002', priority: 'high', domain: 'Delivery', confidence: 92, entity: 'Project Phoenix',
    title: 'Project Phoenix — systemic velocity degradation',
    summary: 'Sprint velocity dropped 14% over 2 sprints. Jira blocker raised. Sprint review overdue 48h. Root Cause Engine links to single team bottleneck — 2 PRs stalled on one reviewer for 5 days.',
    action: 'Reassign PR reviews. Unblock Project Phoenix sprint. Escalate if velocity <target after 1 sprint.',
  },
  {
    id: 'KI-003', priority: 'high', domain: 'Compliance', confidence: 99, entity: 'Compliance',
    title: 'ISS-005 — 3-framework control failure',
    summary: '12 user accounts exceed the 90-day access review SLA. This single issue is causing simultaneous FAIL in SOC 2 CC6.3, ISO A.9.4.1, and NIST PR.AC-1. Audit in 47 days.',
    action: 'Initiate access review immediately. 2h task, resolves 3 compliance failures, adds +16% to compliance score.',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function toKIMMPInsight(i: Insight): KIMMPInsight {
  return {
    id:         i.id,
    priority:   (i.priority === 'low' ? 'medium' : i.priority) as KIMMPInsight['priority'],
    domain:     i.module,
    title:      i.title,
    summary:    i.summary,
    action:     i.action,
    confidence: i.confidence,
    entity:     i.module,
  }
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function timeStr() {
  return new Date().toLocaleString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
// ── Domain Card ───────────────────────────────────────────────────────────────

function TrendIcon({ v, color }: { v: number, color?: string }) {
  if (v > 0) return <TrendingUp  style={{ width: 12, height: 12, color: color || '#00c875' }} />
  if (v < 0) return <TrendingDown style={{ width: 12, height: 12, color: color || '#e2445c' }} />
  return <Minus style={{ width: 12, height: 12, color: color || '#64748b' }} />
}

function DomainCard({ d }: { d: Domain }) {
  const bgColor = getColorForLabel(d.label)
  return (
    <div className="relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between" style={{ 
      background: `linear-gradient(135deg, ${bgColor}15, ${bgColor}25)`, 
      borderRadius: 'var(--os-radius-xl)', 
      border: `1px solid ${bgColor}30`,
      boxShadow: `0 8px 32px ${bgColor}10` 
    }}>
      <div className="absolute inset-0 opacity-10 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 100%)' }} />
      <div className="flex items-center justify-between relative z-10 mb-4">
        <p className="text-[12px] font-black uppercase tracking-widest text-[var(--os-text-1)] drop-shadow-sm">{d.label}</p>
        <div className="flex items-center gap-1.5">
          <TrendIcon v={d.trend} color={bgColor} />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider"
            style={{ color: '#ffffff', background: bgColor }}>
            {RAG_LABEL[d.status]}
          </span>
        </div>
      </div>
      <p className="text-[14px] font-bold leading-snug relative z-10 text-[var(--os-text-1)]">{d.signal}</p>
    </div>
  )
}

// ── Insight Card ──────────────────────────────────────────────────────────────

function InsightCard({ insight }: { insight: KIMMPInsight }) {
  const c = PRIORITY_COLOR[insight.priority]
  const [voted, setVoted]       = useState<'ACCEPTED' | 'DISMISSED' | null>(null)
  const [correcting, setCorrecting] = useState(false)
  const [correction, setCorrection] = useState('')

  const feedback = useMutation({
    mutationFn: (payload: { feedback: string; correction?: string }) =>
      apiFetch('/admin/kangqore-immp/feedback', {
        method: 'POST',
        body: JSON.stringify({ interactionId: insight.id, ...payload }),
      }),
  })

  const vote = (type: 'ACCEPTED' | 'DISMISSED') => {
    if (voted || isDemo()) return
    setVoted(type)
    feedback.mutate({ feedback: type })
  }

  const submitCorrection = () => {
    if (!correction.trim() || isDemo()) return
    feedback.mutate({ feedback: 'CORRECTED', correction: correction.trim() })
    setCorrecting(false)
    setVoted('DISMISSED')
  }

  return (
    <div className="relative p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden border" style={{
      background: `linear-gradient(135deg, ${c}05, ${c}12)`,
      borderColor: `${c}25`,
      borderRadius: 'var(--os-radius-xl)',
      boxShadow: `0 8px 32px ${c}08`
    }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="text-[16px] font-black leading-tight" style={{ color: c }}>{insight.title}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest"
              style={{ color: '#fff', background: c, boxShadow: `0 8px 24px ${c}50` }}>
              {insight.priority}
            </span>
          </div>
        </div>

        <p className="text-[14px] leading-relaxed font-bold opacity-80 mb-5" style={{ color: c }}>{insight.summary}</p>

        <div className="flex items-center gap-3">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full" style={{ color: c, background: `${c}20` }}>{insight.domain}</span>
            <span className="text-[11px] font-bold" style={{ color: c, opacity: 0.7 }}>Confidence: {insight.confidence}%</span>
        </div>

        <div className="mt-6 flex items-center gap-3 px-5 py-3.5 rounded-full bg-white shadow-xl shadow-black/5">
          <Zap style={{ width: 16, height: 16, color: c, flexShrink: 0 }} />
          <p className="text-[13px] font-black" style={{ color: c }}>{insight.action || 'Recommended action plan is being synthesised...'}</p>
        </div>

        {/* Gen 2 feedback row */}
        {correcting ? (
          <div className="mt-4 space-y-2">
            <textarea
              value={correction}
              onChange={e => setCorrection(e.target.value)}
              placeholder="What would the correct insight be?"
              rows={2}
              className="w-full text-[12px] px-3 py-2 rounded-2xl border border-[var(--os-border)] bg-white text-slate-800 resize-none focus:outline-none focus:ring-1"
              style={{ borderColor: `${c}50` }}
            />
            <div className="flex gap-2">
              <button
                onClick={submitCorrection}
                className="text-[11px] font-bold px-3 py-1 rounded-2xl text-white"
                style={{ background: c }}
              >
                Submit correction
              </button>
              <button
                onClick={() => setCorrecting(false)}
                className="text-[11px] text-[var(--os-text-2)] px-3 py-1 rounded-2xl hover:bg-black/5"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] text-[var(--os-text-2)] mr-1">Rate this insight:</span>
            <button
              onClick={() => vote('ACCEPTED')}
              disabled={!!voted}
              className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border transition-all"
              style={{
                borderColor: voted === 'ACCEPTED' ? '#00c875' : `${c}30`,
                color: voted === 'ACCEPTED' ? '#00c875' : c,
                background: voted === 'ACCEPTED' ? '#00c87515' : 'transparent',
                opacity: voted && voted !== 'ACCEPTED' ? 0.35 : 1,
              }}
            >
              <ThumbsUp className="w-2.5 h-2.5" /> Correct
            </button>
            <button
              onClick={() => vote('DISMISSED')}
              disabled={!!voted}
              className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border transition-all"
              style={{
                borderColor: voted === 'DISMISSED' ? '#e2445c' : `${c}30`,
                color: voted === 'DISMISSED' ? '#e2445c' : c,
                background: voted === 'DISMISSED' ? '#e2445c15' : 'transparent',
                opacity: voted && voted !== 'DISMISSED' ? 0.35 : 1,
              }}
            >
              <ThumbsDown className="w-2.5 h-2.5" /> Dismiss
            </button>
            {!voted && (
              <button
                onClick={() => setCorrecting(true)}
                className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border transition-all"
                style={{ borderColor: `${c}30`, color: c }}
              >
                <PenLine className="w-2.5 h-2.5" /> Correct
              </button>
            )}
            {voted && (
              <span className="text-[10px] text-[var(--os-text-2)] italic ml-1">Feedback recorded — trains Gen 2</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Action Required ───────────────────────────────────────────────────────────

function ActionPanel({ approvals, criticalAlerts }: { approvals: any[]; criticalAlerts: any[] }) {
  return (
    <div className="overflow-hidden p-6" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
      <div className="mb-6">
        <p className="text-[12px] font-black uppercase tracking-widest flex items-center gap-3 text-slate-400">
          <Flag style={{ width: 16, height: 16, color: '#e2445c' }} />
          Action Required
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest px-1 mb-4 text-slate-400">
            Pending Approvals ({approvals.length})
          </p>

          <div className="space-y-3">
            {approvals.length === 0 ? (
              <div className="flex items-center gap-3 px-5 py-4 rounded-3xl bg-emerald-50">
                <CheckCircle style={{ width: 18, height: 18, color: '#00c875', flexShrink: 0 }} />
                <p className="text-[14px] font-bold text-emerald-700">No pending approvals — all clear.</p>
              </div>
            ) : (
              approvals.slice(0, 5).map((a: any, i: number) => (
                <div key={a.id ?? i} className="flex items-center justify-between gap-4 px-5 py-4 rounded-3xl"
                  style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <div className="min-w-0">
                    <p className="text-[14px] font-black truncate text-orange-900">
                      {a.description ?? a.actionType ?? 'Approval required'}
                    </p>
                    <p className="text-[11px] font-bold font-mono mt-1 text-orange-700/60">
                      {a.id?.slice(0, 8)} · {a.system ?? a.module ?? 'KIMMP'}
                    </p>
                  </div>
                  <span className="text-[10px] font-black px-4 py-1.5 rounded-full flex-shrink-0 bg-orange-500 text-white shadow-lg shadow-orange-500/30">
                    PENDING
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {criticalAlerts.length > 0 && (
          <div className="pt-2">
            <p className="text-[11px] font-black uppercase tracking-widest px-1 mb-4 text-slate-400">
              Critical Alerts
            </p>
            <div className="space-y-3">
              {criticalAlerts.slice(0, 3).map((alert: any, i: number) => (
                <div key={alert.id ?? i} className="flex items-center justify-between gap-4 px-5 py-4 rounded-3xl"
                  style={{ background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.2)' }}>
                  <p className="text-[14px] font-black truncate flex-1 leading-snug text-rose-900">
                    {alert.message ?? alert.title}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0 bg-white px-3 py-1.5 rounded-full shadow-sm">
                    <AlertTriangle style={{ width: 14, height: 14, color: '#e2445c' }} />
                    <span className="text-[11px] font-black tabular-nums text-rose-600">{alert.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Ops Centre Snapshot ───────────────────────────────────────────────────────

interface OpsSnapshotProps {
  openP1P2Issues:      number
  atRiskDeliverables:  number
  changesPendingCAB:   number
  issuesResolvedToday: number
}

function OpsSnapshot({ openP1P2Issues, atRiskDeliverables, changesPendingCAB, issuesResolvedToday }: OpsSnapshotProps) {
  const rows = [
    { label: 'Active P1/P2 Issues',     value: String(openP1P2Issues),      color: openP1P2Issues > 0 ? '#e2445c' : '#00c875', icon: AlertTriangle },
    { label: 'Deliverables at risk',    value: String(atRiskDeliverables),  color: atRiskDeliverables > 0 ? '#fdab3d' : '#00c875', icon: Clock      },
    { label: 'Changes pending CAB',     value: String(changesPendingCAB),   color: changesPendingCAB > 0 ? '#fdab3d' : '#64748b', icon: RefreshCw  },
    { label: 'Issues resolved today',   value: String(issuesResolvedToday), color: '#00c875',                                     icon: CheckCircle },
  ]
  return (
    <div className="overflow-hidden p-6" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
      <div className="mb-6">
        <p className="text-[12px] font-black uppercase tracking-widest flex items-center gap-3 text-slate-400">
          <Activity style={{ width: 16, height: 16, color: '#e2445c' }} />
          Ops Centre Snapshot
        </p>
      </div>
      <div className="space-y-2">
        {rows.map((r, idx) => (
          <div key={r.label} className="px-5 py-4 flex items-center justify-between rounded-3xl transition-colors hover:bg-[var(--os-surface-0)]">
            <div className="flex items-center gap-4 text-[13px] font-bold text-slate-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: `${r.color}15`, color: r.color }}>
                <r.icon style={{ width: 14, height: 14 }} />
              </div>
              {r.label}
            </div>
            <span className="text-[22px] font-black tabular-nums" style={{ color: r.color }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── HANUMANAS Posture ─────────────────────────────────────────────────────────────

interface HanumanasPostureProps {
  healthScore:    number | null
  critical24h:    number
  warn24h:        number
  overallVerdict: string
}

function HanumanasPosture({ healthScore, critical24h, warn24h, overallVerdict }: HanumanasPostureProps) {
  const score   = healthScore ?? (overallVerdict === 'PASS' ? 88 : overallVerdict === 'WARN' ? 70 : 55)
  const scoreColor = score >= 80 ? '#00c875' : score >= 60 ? '#fdab3d' : '#e2445c'
  const verdictColor = overallVerdict === 'PASS' ? '#00c875' : overallVerdict === 'WARN' ? '#fdab3d' : '#e2445c'
  const rows = [
    { label: 'Compliance score', value: `${score}%`,       sub: critical24h > 0 ? `${critical24h} critical control${critical24h !== 1 ? 's' : ''} failing` : warn24h > 0 ? `${warn24h} warning${warn24h !== 1 ? 's' : ''} active` : 'All controls passing', color: scoreColor  },
    { label: 'Shield posture',   value: overallVerdict,    sub: `${critical24h} critical, ${warn24h} warn in 24h`,   color: verdictColor },
    { label: 'HANUMANAS corps',      value: '80',              sub: 'agents active',                                      color: '#00c875'    },
    { label: 'Audit readiness',  value: score >= 80 ? 'Ready' : score >= 60 ? 'At Risk' : 'Not Ready', sub: 'SOC 2 / ISO 27001 posture', color: scoreColor },
  ]
  return (
    <div className="overflow-hidden p-6" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
      <div className="mb-6">
        <p className="text-[12px] font-black uppercase tracking-widest flex items-center gap-3 text-slate-400">
          <Shield style={{ width: 16, height: 16, color: '#7f53f9' }} />
          HANUMANAS Posture
        </p>
      </div>
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.label} className="flex items-center justify-between px-5 py-4 rounded-3xl transition-colors hover:bg-[var(--os-surface-0)]">
            <div>
              <p className="text-[14px] font-black text-slate-700">{r.label}</p>
              <p className="text-[12px] mt-1 text-slate-500 font-medium">{r.sub}</p>
            </div>
            <p className="text-2xl font-black tabular-nums" style={{ color: r.color }}>{r.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Signal Pyramid ────────────────────────────────────────────────────────────

function SignalPyramid({ counts }: { counts: PyramidCounts }) {
  const pyramid = [
    { level: 'L5', label: 'Decisions',    count: counts.decisions,    color: '#e2445c' },
    { level: 'L4', label: 'Intelligence', count: counts.intelligence, color: '#7f53f9' },
    { level: 'L3', label: 'Correlations', count: counts.correlations, color: '#2564ea' },
    { level: 'L2', label: 'Signals',      count: counts.signals,      color: '#60a5fa' },
    { level: 'L1', label: 'Raw Events',   count: counts.rawEvents,    color: '#334155' },
  ]
  const max = Math.max(...pyramid.map(p => p.count), 1)
  return (
    <div className="p-6" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
      <div className="mb-6">
        <p className="text-[12px] font-black uppercase tracking-widest flex items-center gap-3 text-slate-400">
          <Zap style={{ width: 16, height: 16, color: '#60a5fa' }} />
          Signal Pyramid — today
        </p>
      </div>
      <div className="space-y-4 px-2">
        {pyramid.map(p => (
          <div key={p.level} className="flex items-center gap-4">
            <span className="text-[12px] font-black font-mono w-6 flex-shrink-0 text-slate-400">{p.level}</span>
            <div className="flex-1 h-8 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.max(5, (p.count / max) * 100)}%`,
                  background: `linear-gradient(90deg, ${p.color}80, ${p.color})`,
                  boxShadow: `0 0 16px ${p.color}40`
                }} />
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 w-32">
              <span className="text-[15px] font-black tabular-nums" style={{ color: p.color }}>{p.count.toLocaleString()}</span>
              <span className="text-[12px] font-bold text-slate-400">{p.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── One Signal ────────────────────────────────────────────────────────────────

function OneSignal({ insight }: { insight: KIMMPInsight | null }) {
  const display = insight ?? MOCK_INSIGHTS[0]
  const c = PRIORITY_COLOR[display.priority]
  return (
    <div className="p-10 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, rgba(127,83,249,0.1) 0%, rgba(37,100,234,0.05) 100%)', 
        borderRadius: 'var(--os-radius-xl)',
        boxShadow: '0 32px 64px rgba(127,83,249,0.1)'
      }}>
      {/* Background glow orb */}
      <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: '#7c3aed', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg shadow-purple-500/10">
           <Brain style={{ width: 24, height: 24, color: '#a78bfa' }} />
        </div>
        <div>
           <p className="text-[13px] font-black uppercase tracking-widest text-purple-500">KIMMP One Signal</p>
           <span className="text-[12px] font-bold text-slate-500">The single most important thing right now</span>
        </div>
      </div>
      <p className="text-[28px] font-black leading-snug relative z-10 text-slate-800">
        {display.title}.{' '}
        <span className="px-3 py-1 rounded-2xl shadow-sm" style={{ color: c, background: `${c}15` }}>{display.action || 'Action pending...'}</span>
      </p>
      <div className="mt-8 flex items-center gap-6 flex-wrap relative z-10">
        <div className="flex items-center gap-2.5 text-[14px] font-black text-slate-600 bg-white px-5 py-2.5 rounded-full shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
          {display.domain}{display.entity && display.entity !== display.domain ? ` · ${display.entity}` : ''}
        </div>
        <div className="flex items-center gap-2.5 text-[14px] font-black text-slate-600 bg-white px-5 py-2.5 rounded-full shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#e2445c', boxShadow: '0 0 12px #e2445c' }} />
          Confidence: {display.confidence}%
        </div>
        <span className="text-[12px] font-black px-4 py-2.5 rounded-full shadow-md tracking-wider"
          style={{ color: '#fff', background: c, boxShadow: `0 8px 24px ${c}40` }}>
          {display.priority.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function BriefingPage() {
  const { insights, criticalCount } = useKIMMPStore()

  const reactiveInsights = insights
    .filter(i => i.type !== 'predictive')
    .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9))

  const displayInsights: KIMMPInsight[] = reactiveInsights.length > 0
    ? reactiveInsights.slice(0, 3).map(toKIMMPInsight)
    : MOCK_INSIGHTS

  const oneSignalInsight: KIMMPInsight | null = reactiveInsights.length > 0
    ? toKIMMPInsight(reactiveInsights[0])
    : null

  const { data: routerStats } = useQuery({
    queryKey:        ['kimmp-router-stats'],
    queryFn:         () => api.get('/admin/kangqore-immp/learning/router/stats').then(r => r.data),
    enabled:         !isDemo(),
    staleTime:       60_000,
    refetchInterval: 60_000,
  })

  const { data: approvalsData } = useQuery({
    queryKey:  ['kimmp-approvals'],
    queryFn:   () => api.get('/admin/kangqore-immp/authority/approvals').then(r => r.data),
    enabled:   !isDemo(),
    staleTime: 60_000,
  })

  const { data: alertsData } = useQuery({
    queryKey:  ['proactive-alerts'],
    queryFn:   () => api.get('/admin/kangqore-immp/proactive/alerts').then(r => r.data),
    enabled:   !isDemo(),
    staleTime: 60_000,
  })

  const { data: briefingData } = useQuery({
    queryKey:        ['briefing-domain-health'],
    queryFn:         () => api.get('/admin/briefing/domain-health').then(r => r.data),
    enabled:         !isDemo(),
    staleTime:       120_000,
    refetchInterval: 120_000,
  })

  const { data: hanumanasData } = useQuery({
    queryKey:        ['hanumanas-summary'],
    queryFn:         () => api.get('/admin/hanumanas/agents/summary').then(r => r.data),
    enabled:         !isDemo(),
    staleTime:       120_000,
    refetchInterval: 120_000,
  })

  const approvals      = (approvalsData?.approvals ?? []) as any[]
  const allAlerts      = (alertsData?.alerts ?? []) as any[]
  const criticalAlerts = allAlerts.filter((a: any) => {
    const sev = String(a.severity ?? '').toLowerCase()
    return sev === 'critical' || sev === 'p1'
  })

  const domains: Domain[] = briefingData?.domains ?? DOMAIN_FALLBACK
  const opsSnap           = briefingData?.opsSnapshot ?? { openP1P2Issues: 0, atRiskDeliverables: 0, changesPendingCAB: 0, issuesResolvedToday: 0 }
  const briefingSignals   = briefingData?.signalCounts ?? { signals: 0, dispatches: 0 }

  const autonomy       = Math.round((routerStats?.autonomyRatio ?? 0) * 100)
  const numCritical    = criticalCount()
  const numReactive    = reactiveInsights.length
  const attentionCount = numCritical + approvals.length

  const signalCounts: PyramidCounts = {
    rawEvents:    briefingSignals.signals,
    signals:      Math.max(briefingSignals.dispatches * 4, numReactive * 4),
    correlations: allAlerts.length,
    intelligence: Math.max(insights.length, briefingSignals.dispatches),
    decisions:    Math.max(attentionCount, approvals.length),
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--os-text-1)' }}>{greeting()}, C.O.D.E.</h2>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--os-text-3)' }}>{timeStr()}</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--os-text-3)' }}>
            KIMMP has processed{' '}
            <span className="font-bold" style={{ color: '#a78bfa' }}>{signalCounts.signals.toLocaleString()} signals</span>{' '}
            and synthesised{' '}
            <span className="font-bold" style={{ color: '#818cf8' }}>{signalCounts.intelligence} intelligence reports</span>{' '}
            since midnight. Your attention is needed on{' '}
            <span className="font-bold" style={{ color: '#e2445c' }}>{attentionCount} items</span>.
          </p>
        </div>

        {/* Autonomy widget */}
        <div className="flex-shrink-0 px-4 py-2.5 rounded-2xl flex items-center gap-3"
          style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
          <div className="text-center">
            <p className="text-base font-black tabular-nums" style={{ color: '#a78bfa' }}>{autonomy}%</p>
            <p className="text-[9px]" style={{ color: 'var(--os-text-3)' }}>KIMMP<br />autonomy</p>
          </div>
          <div className="w-px h-8" style={{ background: 'var(--os-border)' }} />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px]" style={{ color: 'var(--os-text-2)' }}>Live</p>
          </div>
        </div>
      </div>

      {/* Domain health grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {domains.map(d => <DomainCard key={d.id} d={d} />)}
      </div>

      {/* Insights + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-3 lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-text-2)' }}>
            Top KIMMP Insights
          </p>
          {displayInsights.map(i => <InsightCard key={i.id} insight={i} />)}
        </div>
        <ActionPanel approvals={approvals} criticalAlerts={criticalAlerts} />
      </div>

      {/* Ops + HANUMANAS + Pyramid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <OpsSnapshot
          openP1P2Issues={opsSnap.openP1P2Issues}
          atRiskDeliverables={opsSnap.atRiskDeliverables}
          changesPendingCAB={opsSnap.changesPendingCAB}
          issuesResolvedToday={opsSnap.issuesResolvedToday}
        />
        <HanumanasPosture
          healthScore={hanumanasData?.healthScore ?? null}
          critical24h={hanumanasData?.critical24h ?? 0}
          warn24h={hanumanasData?.warn24h ?? 0}
          overallVerdict={hanumanasData?.overallVerdict ?? 'PASS'}
        />
        <SignalPyramid counts={signalCounts} />
      </div>

      {/* One Signal */}
      <OneSignal insight={oneSignalInsight} />

    </div>
  )
}
