import { useState } from 'react'
import {
  Brain, TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  Lightbulb, ChevronRight, Zap, BarChart2, Users, RefreshCw,
} from 'lucide-react'

// ─── tokens ───────────────────────────────────────────────────────────────────

const CARD = 'rgba(15,23,42,0.5)'
const EDGE = 'rgba(30,41,59,0.6)'
const EASE = 'cubic-bezier(0.16,1,0.3,1)'

// ─── types ────────────────────────────────────────────────────────────────────

type SignalStatus = 'PASS' | 'WARN' | 'FAIL'
type Domain = 'Delivery' | 'Finance' | 'Relationship' | 'Compliance'

interface Insight {
  id: string
  domain: Domain
  status: SignalStatus
  title: string
  body: string
  confidence: number
  trend: 'up' | 'down' | 'stable'
  trendLabel: string
}

// ─── mock data ────────────────────────────────────────────────────────────────

const INSIGHTS: Insight[] = [
  {
    id: 'i1',
    domain: 'Delivery',
    status: 'PASS',
    title: 'Delivery velocity is 12% above target',
    body: 'Your delivery velocity is running 12% above target for Q2 2026. Based on the current sprint cadence and team availability, WAANDA projects Phase 3 completion by 14 July — 6 days ahead of your contractual commitment. This creates a buffer for UAT cycles.',
    confidence: 91,
    trend: 'up',
    trendLabel: '+12% vs. Q2 target',
  },
  {
    id: 'i2',
    domain: 'Finance',
    status: 'WARN',
    title: 'Accounts receivable aging approaching threshold',
    body: 'INV-2026-038 has been outstanding for 31 days. Historical patterns across your account show that AR items exceeding 30 days have a 40% higher probability of escalating to a dispute. A follow-up communication within the next 48 hours reduces resolution time by 67% on average.',
    confidence: 84,
    trend: 'down',
    trendLabel: '+18% AR aging month-on-month',
  },
  {
    id: 'i3',
    domain: 'Relationship',
    status: 'PASS',
    title: 'Contract renewal probability at 94%',
    body: 'Satisfaction signals across your last 4 interactions are strongly positive. Your NPS trajectory is trending upward (+8 points since March 2026). WAANDA has correlated engagement frequency, milestone completion rate, and support ticket resolution time to forecast a 94% renewal probability for your March 2027 contract.',
    confidence: 88,
    trend: 'up',
    trendLabel: '+8 NPS points since March',
  },
]

const RECOMMENDATION = {
  title: 'Recommended action this week',
  body: 'Schedule a mid-quarter review before 30 June 2026 to address the AR item before it impacts your Q3 relationship score. Your account manager has availability on 26–27 June.',
  cta: 'Schedule a meeting',
  ctaPath: '/kangqore-view/client/meetings',
}

const DOMAIN_META: Record<Domain, { icon: React.ElementType; color: string }> = {
  Delivery:     { icon: Zap,       color: '#2564ea' },
  Finance:      { icon: BarChart2, color: '#fdab3d' },
  Relationship: { icon: Users,     color: '#00c875' },
  Compliance:   { icon: Brain,     color: '#7f53f9' },
}

const STATUS_CONFIG: Record<SignalStatus, { color: string; bg: string; border: string; label: string; icon: React.ElementType }> = {
  PASS: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',   border: 'rgba(74,222,128,0.2)',  label: 'Positive signal', icon: CheckCircle2  },
  WARN: { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.2)',  label: 'Watch signal',    icon: AlertCircle   },
  FAIL: { color: '#f87171', bg: 'rgba(248,113,113,0.08)',  border: 'rgba(248,113,113,0.2)', label: 'Risk signal',     icon: AlertCircle   },
}

// ─── overall health ───────────────────────────────────────────────────────────

function OverallHealth({ insights }: { insights: Insight[] }) {
  const pass = insights.filter(i => i.status === 'PASS').length
  const warn = insights.filter(i => i.status === 'WARN').length
  const fail = insights.filter(i => i.status === 'FAIL').length
  const overallStatus = fail > 0 ? 'FAIL' : warn > 0 ? 'WARN' : 'PASS'
  const label = fail > 0 ? 'Risks detected — action required' : warn > 0 ? 'Watch signals active — review recommended' : 'All signals healthy'

  const cfg = STATUS_CONFIG[overallStatus]

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}
        >
          <Brain className="w-4 h-4" style={{ color: cfg.color }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>
              WAANDA · Engagement Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{label}</p>
        </div>
        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
          {pass > 0 && (
            <div className="text-center">
              <p className="text-lg font-black text-emerald-400 leading-none">{pass}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">Pass</p>
            </div>
          )}
          {warn > 0 && (
            <div className="text-center">
              <p className="text-lg font-black text-amber-400 leading-none">{warn}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">Warn</p>
            </div>
          )}
          {fail > 0 && (
            <div className="text-center">
              <p className="text-lg font-black text-red-400 leading-none">{fail}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">Fail</p>
            </div>
          )}
        </div>
      </div>

      {/* Signal rail */}
      <div className="flex gap-1.5">
        {insights.map(ins => (
          <div
            key={ins.id}
            className="flex-1 h-1.5 rounded-full"
            style={{ background: STATUS_CONFIG[ins.status].color }}
            title={ins.domain}
          />
        ))}
      </div>
    </div>
  )
}

// ─── insight card ─────────────────────────────────────────────────────────────

function InsightCard({ insight, expanded, onToggle }: {
  insight: Insight
  expanded: boolean
  onToggle: () => void
}) {
  const status = STATUS_CONFIG[insight.status]
  const domain = DOMAIN_META[insight.domain]
  const StatusIcon = status.icon
  const DomainIcon = domain.icon
  const TrendIcon  = insight.trend === 'up' ? TrendingUp : insight.trend === 'down' ? TrendingDown : RefreshCw

  return (
    <div
      className="rounded-2xl transition-all duration-300"
      style={{
        background: CARD,
        border: `1px solid ${expanded ? status.border : EDGE}`,
        transition: `border-color 0.2s ${EASE}`,
      }}
    >
      {/* Header row */}
      <button className="w-full text-left p-5" onClick={onToggle}>
        <div className="flex items-start gap-3">
          {/* Domain icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${domain.color}15`, border: `1px solid ${domain.color}25` }}
          >
            <DomainIcon className="w-4.5 h-4.5" style={{ color: domain.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${domain.color}18`, color: domain.color, border: `1px solid ${domain.color}25` }}
              >
                {insight.domain}
              </span>
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
              >
                <StatusIcon className="w-2.5 h-2.5" />
                {status.label}
              </span>
            </div>
            <p className="text-sm font-semibold text-white leading-snug">{insight.title}</p>
          </div>

          <ChevronRight
            className="w-4 h-4 text-slate-600 flex-shrink-0 mt-1 transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          />
        </div>

        {/* Confidence + trend */}
        <div className="flex items-center gap-4 mt-3 pl-12">
          <div className="flex items-center gap-1.5">
            <div className="w-24 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: `${insight.confidence}%`, background: status.color }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: status.color }}>{insight.confidence}% confidence</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <TrendIcon className="w-3 h-3" />
            {insight.trendLabel}
          </div>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div
          className="px-5 pb-5 pt-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-sm text-slate-400 leading-relaxed pt-4">{insight.body}</p>
        </div>
      )}
    </div>
  )
}

// ─── recommendation ───────────────────────────────────────────────────────────

function RecommendationCard() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(127,83,249,0.06)',
        border: '1px solid rgba(127,83,249,0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(127,83,249,0.12)', border: '1px solid rgba(127,83,249,0.25)' }}>
          <Lightbulb className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-violet-500 mb-1">WAANDA Recommends</p>
          <p className="text-sm font-semibold text-white mb-2">{RECOMMENDATION.title}</p>
          <p className="text-sm text-slate-400 leading-relaxed">{RECOMMENDATION.body}</p>
        </div>
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function ClientWaanda() {
  const [expandedId, setExpandedId] = useState<string | null>('i1')

  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">WAANDA Insights</h2>
            <span
              className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
              style={{ background: 'rgba(127,83,249,0.12)', color: '#a78bfa', border: '1px solid rgba(127,83,249,0.25)' }}
            >
              AI · Live
            </span>
          </div>
          <p className="text-sm text-slate-500">
            WAANDA analyses your engagement in real time and surfaces the signals that matter most.
          </p>
        </div>
      </div>

      {/* Overall health */}
      <OverallHealth insights={INSIGHTS} />

      {/* Insights */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Signal breakdown</p>
        {INSIGHTS.map(ins => (
          <InsightCard
            key={ins.id}
            insight={ins}
            expanded={expandedId === ins.id}
            onToggle={() => toggle(ins.id)}
          />
        ))}
      </div>

      {/* Recommendation */}
      <RecommendationCard />

      {/* Footer */}
      <p className="text-[11px] text-slate-600 text-center">
        Insights are generated by WAANDA and updated continuously. Last refresh: just now.
      </p>
    </div>
  )
}
