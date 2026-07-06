import { useState } from 'react'
import {
  Brain, TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  Lightbulb, ChevronRight, BarChart2, Shield, Zap, RefreshCw,
} from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

// ─── tokens ───────────────────────────────────────────────────────────────────

const CARD = 'var(--os-card)'
const EDGE = 'var(--os-border)'
const EASE = 'cubic-bezier(0.16,1,0.3,1)'

// ─── types ────────────────────────────────────────────────────────────────────

type SignalStatus = 'PASS' | 'WARN' | 'FAIL'
type Domain = 'Revenue' | 'Risk' | 'Capital' | 'Strategy'

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
    id: 'iv1',
    domain: 'Revenue',
    status: 'PASS',
    title: 'MRR trajectory on track for £600k ARR by August',
    body: 'Current MRR is £48.5k with a 14.2% month-on-month growth rate sustained over 4 consecutive months. WAANDA projects reaching £50k MRR by August 7, implying £600k ARR — 8 weeks ahead of the original forecast timeline. Enterprise cohort (3 clients) is the primary driver, contributing 61% of revenue at 97% retention.',
    confidence: 91,
    trend: 'up',
    trendLabel: '+14.2% MoM, 4-month streak',
  },
  {
    id: 'iv2',
    domain: 'Risk',
    status: 'PASS',
    title: 'Enterprise cohort retention at 97% — top decile',
    body: 'Net Revenue Retention (NRR) stands at 118%, driven by two enterprise clients expanding scope in Q2. Churn risk across the portfolio is at its lowest since inception — no client has an active churn signal in WAANDA. The Meridian Logistics account (flagged in Ops Centre) represents the only elevated watch signal, but its contract is not renewal-eligible until March 2027.',
    confidence: 88,
    trend: 'up',
    trendLabel: 'NRR 118%, churn risk minimal',
  },
  {
    id: 'iv3',
    domain: 'Capital',
    status: 'WARN',
    title: 'Accelerated Q3 hiring will compress runway to 11 months',
    body: 'The approved Q3 hiring plan (4 senior hires) will increase monthly burn by approximately £18k from July 15. At current cash position (£920k) and MRR trajectory, WAANDA projects runway compression from 16 months to 11 months by September 30. The risk is manageable if MRR reaches £52k by October (WAANDA: 74% probability), but the Series A timeline becomes critical if hiring slips or MRR growth decelerates.',
    confidence: 84,
    trend: 'down',
    trendLabel: '16 → 11 months runway, Q3 hire impact',
  },
]

const RECOMMENDATION = {
  title: 'Review Series A timeline before Q3 hiring starts',
  body: 'WAANDA recommends a board-level review of the Series A timeline before the first Q3 hire commences on July 15. If the raise is targeted for H1 2027, runway remains comfortable. If H2 2026 is preferred, opening conversations with lead investors before September is optimal based on current traction metrics.',
  cta: 'Schedule a board call',
  ctaPath: '/kangqore-view/investor/meetings',
}

const DOMAIN_META: Record<Domain, { icon: React.ElementType; color: string }> = {
  Revenue:  { icon: BarChart2, color: '#2564ea' },
  Risk:     { icon: Shield,    color: '#00c875' },
  Capital:  { icon: Zap,       color: '#fdab3d' },
  Strategy: { icon: Brain,     color: '#7f53f9' },
}

const STATUS_CONFIG: Record<SignalStatus, { color: string; bg: string; border: string; label: string; icon: React.ElementType }> = {
  PASS: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)',  label: 'Positive signal', icon: CheckCircle2 },
  WARN: { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)',  label: 'Watch signal',    icon: AlertCircle  },
  FAIL: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', label: 'Risk signal',     icon: AlertCircle  },
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
    <div className="rounded-2xl p-5" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
          <Brain className="w-4 h-4" style={{ color: cfg.color }} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>
            WAANDA · Investor Intelligence
          </span>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">{label}</p>
        </div>
        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
          {pass > 0 && <div className="text-center"><p className="text-lg font-black text-emerald-400 leading-none">{pass}</p><p className="text-[9px] text-[var(--os-text-2)] uppercase tracking-wider">Pass</p></div>}
          {warn > 0 && <div className="text-center"><p className="text-lg font-black text-amber-400 leading-none">{warn}</p><p className="text-[9px] text-[var(--os-text-2)] uppercase tracking-wider">Warn</p></div>}
          {fail > 0 && <div className="text-center"><p className="text-lg font-black text-red-400 leading-none">{fail}</p><p className="text-[9px] text-[var(--os-text-2)] uppercase tracking-wider">Fail</p></div>}
        </div>
      </div>
      <div className="flex gap-1.5">
        {insights.map(ins => (
          <div key={ins.id} className="flex-1 h-1.5 rounded-full"
            style={{ background: STATUS_CONFIG[ins.status].color }} title={ins.domain} />
        ))}
      </div>
    </div>
  )
}

// ─── insight card ─────────────────────────────────────────────────────────────

function InsightCard({ insight, expanded, onToggle }: { insight: Insight; expanded: boolean; onToggle: () => void }) {
  const status = STATUS_CONFIG[insight.status]
  const domain = DOMAIN_META[insight.domain]
  const StatusIcon = status.icon
  const DomainIcon = domain.icon
  const TrendIcon  = insight.trend === 'up' ? TrendingUp : insight.trend === 'down' ? TrendingDown : RefreshCw

  return (
    <div className="rounded-2xl transition-all duration-300"
      style={{ background: CARD, border: `1px solid ${expanded ? status.border : EDGE}`, transition: `border-color 0.2s ${EASE}` }}>
      <button className="w-full text-left p-5" onClick={onToggle}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${domain.color}15`, border: `1px solid ${domain.color}25` }}>
            <DomainIcon className="w-4.5 h-4.5" style={{ color: domain.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${domain.color}18`, color: domain.color, border: `1px solid ${domain.color}25` }}>
                {insight.domain}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                <StatusIcon className="w-2.5 h-2.5" />
                {status.label}
              </span>
            </div>
            <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--os-text-1)' }}>{insight.title}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--os-text-2)] flex-shrink-0 mt-1 transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }} />
        </div>
        <div className="flex items-center gap-4 mt-3 pl-12">
          <div className="flex items-center gap-1.5">
            <div className="w-24 h-1 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
              <div className="h-full rounded-full" style={{ width: `${insight.confidence}%`, background: status.color }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: status.color }}>{insight.confidence}% confidence</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[var(--os-text-2)]">
            <TrendIcon className="w-3 h-3" />{insight.trendLabel}
          </div>
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-5 pt-0" style={{ borderTop: '1px solid var(--os-surface-0)' }}>
          <p className="text-sm text-[var(--os-text-2)] leading-relaxed pt-4">{insight.body}</p>
        </div>
      )}
    </div>
  )
}

// ─── recommendation ───────────────────────────────────────────────────────────

function RecommendationCard() {
  return (
    <div className="rounded-2xl p-5"
      style={{ background: 'rgba(127,83,249,0.06)', border: '1px solid rgba(127,83,249,0.2)' }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(127,83,249,0.12)', border: '1px solid rgba(127,83,249,0.25)' }}>
          <Lightbulb className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-violet-500 mb-1">WAANDA Recommends</p>
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--os-text-1)' }}>{RECOMMENDATION.title}</p>
          <p className="text-sm text-[var(--os-text-2)] leading-relaxed">{RECOMMENDATION.body}</p>
        </div>
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function InvestorWaanda() {
  const [expandedId, setExpandedId] = useState<string | null>('iv1')
  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="WAANDA Investor Insights" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>WAANDA Investor Insights</h2>
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
              style={{ background: 'rgba(127,83,249,0.12)', color: '#a78bfa', border: '1px solid rgba(127,83,249,0.25)' }}>
              AI · Live
            </span>
          </div>
          <p className="text-sm text-[var(--os-text-2)]">
            WAANDA synthesises company signals and surfaces what matters most to your investment.
          </p>
        </div>
      </div>

      <OverallHealth insights={INSIGHTS} />

      <div className="space-y-3">
        <p className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-wider">Signal breakdown</p>
        {INSIGHTS.map(ins => (
          <InsightCard key={ins.id} insight={ins} expanded={expandedId === ins.id} onToggle={() => toggle(ins.id)} />
        ))}
      </div>

      <RecommendationCard />

      <p className="text-[11px] text-[var(--os-text-2)] text-center">
        Insights are generated by WAANDA and updated continuously. Last refresh: just now.
      </p>
    </div>
  )
}
