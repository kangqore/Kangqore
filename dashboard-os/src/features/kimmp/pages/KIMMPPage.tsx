import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Brain, TrendingUp, AlertTriangle, Lightbulb, ArrowRight, Zap, Target, BarChart3 } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

type InsightCategory = 'revenue' | 'risk' | 'opportunity' | 'ops' | 'talent'

interface Insight {
  id: string
  category: InsightCategory
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  summary: string
  detail: string
  action: string
  module: string
  confidence: number   // 0-100
  impact: string
}

const INSIGHTS: Insight[] = [
  {
    id: 'k1', category: 'revenue', priority: 'critical',
    title: 'Synapse Health contract — close this week',
    summary: 'Negotiation has stalled at payment milestone split. 75% win probability. Delay risk identified.',
    detail: 'Synapse Health has been in negotiation for 8 days. KIMMP detects pattern: deals at this stage that run >10 days close at 52% vs 81% for <10 days. Dev Patel and contact last spoke 3 days ago. Recommend a milestone concession on payment 3 to unlock.',
    action: 'Offer 5-milestone payment structure instead of 4. Unlock £320k contract.',
    module: 'Leads', confidence: 84, impact: '£320k ARR',
  },
  {
    id: 'k2', category: 'risk', priority: 'critical',
    title: 'Sales & GTM budget overspend trajectory',
    summary: 'H1 spend at 103% — budget at-risk. Q3 events and travel spend unplanned.',
    detail: 'Sales dept has exceeded H1 budget by £3.2k due to unplanned travel costs for HealthTech Europe. No Q3 budget headroom has been flagged yet. Recommend reviewing Q3 spend plan with Sofia.',
    action: 'Review Q3 sales budget with Sofia Mendez. Reallocate £8k from travel to paid ads.',
    module: 'Finance', confidence: 91, impact: 'Budget risk £18k',
  },
  {
    id: 'k3', category: 'opportunity', priority: 'high',
    title: 'GreenSpark Energy upsell window',
    summary: 'GreenSpark (£130k, 6 weeks live) has shown 3× usage spike on Analytics module.',
    detail: 'KIMMP detected that GreenSpark team has accessed the analytics module 48× in the last 2 weeks — 3× their normal usage. This behavioural signal in similar accounts preceded an upsell conversation in 71% of cases. Ravi Nair is the account owner.',
    action: 'Ravi to schedule QBR with GreenSpark CDO. Propose analytics platform expansion.',
    module: 'Clients', confidence: 71, impact: '£45k–85k upsell',
  },
  {
    id: 'k4', category: 'talent', priority: 'high',
    title: 'Backend Engineer offer — Raj Mehta at risk',
    summary: 'Offer sent 2 days ago to top candidate (score 92). No response. Typical accept window is 48h.',
    detail: 'Raj Mehta received an offer at £95k on 2026-05-30. His LinkedIn profile was updated yesterday (signal). KIMMP cross-references: offers not accepted within 48h close at 58% vs 94% for <24h. Recommend a follow-up call from Dev Patel today.',
    action: 'Dev Patel to call Raj Mehta today. Address any concerns. Counter-offer ceiling £98k.',
    module: 'Careers', confidence: 77, impact: '8-week hiring delay if lost',
  },
  {
    id: 'k5', category: 'ops', priority: 'medium',
    title: 'Invoice AR: Orion Financial 14-day overdue',
    summary: 'Invoice INV-2024 (£42k) for Orion Financial is 14 days overdue. Escalation threshold reached.',
    detail: 'The automated workflow escalated this yesterday, but no human action has been logged. Sofia Mendez owns the Orion account. Given Orion is also in the leads pipeline as a prospect (Ben Hartley), this needs to be handled delicately.',
    action: 'Sofia to contact Ben Hartley directly — frame as administrative, not a chaser.',
    module: 'Finance', confidence: 98, impact: '£42k cash at risk',
  },
  {
    id: 'k6', category: 'opportunity', priority: 'medium',
    title: 'TechForward Partners — Series A momentum',
    summary: 'Sophia Müller has not received the updated financial model requested 6 days ago.',
    detail: 'TechForward Partners (Series A lead prospect) requested an updated ARR bridge model on 2026-05-25. No file has been shared as of today. KIMMP flags this as a silent deal-blocker. Sophia\'s next follow-up is 2026-06-05 — the model must be ready before that.',
    action: 'Mahesh to send updated ARR bridge model to Sophia Müller by 2026-06-04.',
    module: 'Investors', confidence: 88, impact: '£5M Series A risk',
  },
]

const CATEGORY_CONFIG: Record<InsightCategory, { label: string; color: string; Icon: React.FC<{ className?: string }> }> = {
  revenue:     { label: 'Revenue',     color: 'bg-green-50 text-green-700 border-green-200',   Icon: ({ className }) => <TrendingUp    className={className ?? 'w-4 h-4'} /> },
  risk:        { label: 'Risk',        color: 'bg-red-50 text-red-700 border-red-200',          Icon: ({ className }) => <AlertTriangle className={className ?? 'w-4 h-4'} /> },
  opportunity: { label: 'Opportunity', color: 'bg-blue-50 text-blue-700 border-blue-200',       Icon: ({ className }) => <Lightbulb     className={className ?? 'w-4 h-4'} /> },
  ops:         { label: 'Operations',  color: 'bg-orange-50 text-orange-700 border-orange-200', Icon: ({ className }) => <Zap           className={className ?? 'w-4 h-4'} /> },
  talent:      { label: 'Talent',      color: 'bg-purple-50 text-purple-700 border-purple-200', Icon: ({ className }) => <Target        className={className ?? 'w-4 h-4'} /> },
}

const PRIORITY_BADGE: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  critical: 'danger', high: 'warning', medium: 'info', low: 'neutral',
}

function InsightCard({ insight }: { insight: Insight }) {
  const [expanded, setExpanded] = useState(false)
  const config = CATEGORY_CONFIG[insight.category]

  return (
    <Card className={`border-l-4 ${insight.priority === 'critical' ? 'border-l-red-500' : insight.priority === 'high' ? 'border-l-orange-400' : 'border-l-blue-400'}`}>
      <CardBody className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${config.color}`}>
              <config.Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="font-semibold text-slate-900 leading-tight">{insight.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={PRIORITY_BADGE[insight.priority]} size="sm" dot>
                  {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
                </Badge>
                <Badge variant="neutral" size="sm">{insight.module}</Badge>
                <span className="text-xs text-slate-400">{insight.confidence}% confidence</span>
              </div>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg border ${config.color} flex-shrink-0`}>
            {insight.impact}
          </span>
        </div>

        <p className="text-sm text-slate-600 mb-3">{insight.summary}</p>

        {expanded && (
          <div className="space-y-3 mb-3 pt-3 border-t border-slate-100">
            <p className="text-sm text-slate-700 leading-relaxed">{insight.detail}</p>
            <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
              <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-blue-800">{insight.action}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          {expanded ? 'Show less' : 'View detail & action →'}
        </button>
      </CardBody>
    </Card>
  )
}

const KIMMP_STAT_DEFS = [
  { label: 'Active Insights',       icon: Brain,         color: 'text-purple-600 bg-purple-50' },
  { label: 'Critical Alerts',       icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
  { label: 'Revenue Opportunities', icon: TrendingUp,    color: 'text-green-600 bg-green-50' },
  { label: 'Modules Monitored',     icon: BarChart3,     color: 'text-blue-600 bg-blue-50' },
]

// Map API insight → dashboard-os Insight shape
function toInsight(raw: Record<string, unknown>, i: number): Insight {
  const cats: InsightCategory[] = ['revenue', 'risk', 'opportunity', 'ops', 'talent']
  const pris = ['critical', 'high', 'medium', 'low'] as const

  const rawCat = String(raw.category ?? '').toLowerCase()
  const category: InsightCategory = cats.includes(rawCat as InsightCategory)
    ? (rawCat as InsightCategory)
    : 'opportunity'

  const rawPri = String(raw.priority ?? 'medium').toLowerCase()
  const priority = pris.includes(rawPri as typeof pris[number])
    ? (rawPri as Insight['priority'])
    : 'medium'

  return {
    id:         String(raw.id ?? `k${i}`),
    category,
    priority,
    title:      String(raw.title ?? 'Untitled insight'),
    summary:    String(raw.summary ?? raw.content ?? '').slice(0, 200),
    detail:     String(raw.content ?? raw.detail ?? ''),
    action:     String(raw.action ?? raw.recommendation ?? ''),
    module:     String(raw.module ?? raw.tags ?? 'System'),
    confidence: Number(raw.confidence ?? raw.score ?? 80),
    impact:     String(raw.impact ?? raw.value ?? '—'),
  }
}

export function KIMMMPage() {
  const [filter, setFilter] = useState<InsightCategory | 'all'>('all')
  const [insights, setInsights] = useState<Insight[]>(INSIGHTS)

  const { data: apiData, isLoading: apiLoading } = useQuery({
    queryKey: ['kimmp-insights', filter],
    queryFn: () => api.get('/dashboard/insights', {
      params: { category: filter === 'all' ? undefined : filter, limit: 20 }
    }).then(r => (r.data.insights ?? r.data ?? []) as Record<string, unknown>[]),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 3,
  })

  useEffect(() => {
    if (apiData?.length) setInsights(apiData.map((r, i) => toInsight(r, i)))
    else setInsights(INSIGHTS)
  }, [apiData])

  const filtered = filter === 'all' ? insights : insights.filter(i => i.category === filter)

  const kimmStats = [
    { ...KIMMP_STAT_DEFS[0], value: insights.length },
    { ...KIMMP_STAT_DEFS[1], value: insights.filter(i => i.priority === 'critical').length },
    { ...KIMMP_STAT_DEFS[2], value: `£${Math.round((320000 + 45000 + 5000000) / 1000)}k+` },
    { ...KIMMP_STAT_DEFS[3], value: 14 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            KIMMP Intelligence
            {apiLoading && <Spinner size="sm" />}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            AI-powered operating intelligence. Surfaces cross-module signals, risks, and opportunities across the entire Kangqore OS.
          </p>
        </div>
        <div className="ml-auto flex-shrink-0">
          <Badge variant="success" size="sm" dot>Live · Updated 2 min ago</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kimmStats.map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'revenue', 'risk', 'opportunity', 'ops', 'talent'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              filter === cat
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {cat === 'all' ? 'All Insights' : CATEGORY_CONFIG[cat].label}
            {cat !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                {insights.filter(i => i.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Insights */}
      <div className="space-y-4">
        {filtered
          .sort((a, b) => {
            const order = { critical: 0, high: 1, medium: 2, low: 3 }
            return order[a.priority] - order[b.priority]
          })
          .map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))
        }
      </div>
    </div>
  )
}
