import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Brain, TrendingUp, AlertTriangle, Lightbulb, Zap, Target,
  ArrowRight, ChevronDown, ChevronUp, BarChart3,
  Briefcase, DollarSign, Users, GraduationCap, Building2,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'
import { useKIMMPStore, toInsight, type Insight, type InsightCategory } from '@store/kimmp'

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<InsightCategory, {
  label: string
  color: string
  dot: string
  Icon: React.FC<{ className?: string }>
}> = {
  revenue:     { label: 'Revenue',     color: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-500',  Icon: ({ className }) => <TrendingUp    className={className ?? 'w-4 h-4'} /> },
  risk:        { label: 'Risk',        color: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-500',    Icon: ({ className }) => <AlertTriangle className={className ?? 'w-4 h-4'} /> },
  opportunity: { label: 'Opportunity', color: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500',   Icon: ({ className }) => <Lightbulb     className={className ?? 'w-4 h-4'} /> },
  ops:         { label: 'Operations',  color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500', Icon: ({ className }) => <Zap           className={className ?? 'w-4 h-4'} /> },
  talent:      { label: 'Talent',      color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', Icon: ({ className }) => <Target        className={className ?? 'w-4 h-4'} /> },
}

const PRIORITY_BORDER: Record<string, string> = {
  critical: 'border-l-red-500',
  high:     'border-l-orange-400',
  medium:   'border-l-blue-400',
  low:      'border-l-slate-300',
}

const PRIORITY_BADGE: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  critical: 'danger', high: 'warning', medium: 'info', low: 'neutral',
}

// ─── Module pulse grid ────────────────────────────────────────────────────────

const MODULE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Leads:     ({ className }) => <Zap           className={className} />,
  Finance:   ({ className }) => <DollarSign    className={className} />,
  Clients:   ({ className }) => <Briefcase     className={className} />,
  Careers:   ({ className }) => <GraduationCap className={className} />,
  Projects:  ({ className }) => <BarChart3     className={className} />,
  Investors: ({ className }) => <TrendingUp    className={className} />,
  Resources: ({ className }) => <Users         className={className} />,
  System:    ({ className }) => <Building2     className={className} />,
}

function ModulePulse({ module, insights }: { module: string; insights: Insight[] }) {
  const navigate = useNavigate()
  const critical = insights.filter(i => i.priority === 'critical').length
  const high     = insights.filter(i => i.priority === 'high').length
  const Icon = MODULE_ICONS[module] ?? (({ className }) => <Brain className={className} />)

  const statusColor = critical > 0 ? 'border-red-200 bg-red-50' :
                      high > 0     ? 'border-orange-200 bg-orange-50' :
                      insights.length > 0 ? 'border-blue-200 bg-blue-50' :
                      'border-slate-200 bg-white'

  const dotColor = critical > 0 ? 'bg-red-500' :
                   high > 0     ? 'bg-orange-400' :
                   insights.length > 0 ? 'bg-blue-400' : 'bg-slate-300'

  const path = `/os/${module.toLowerCase()}`

  return (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm text-left ${statusColor}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${critical > 0 ? 'bg-red-100' : high > 0 ? 'bg-orange-100' : 'bg-slate-100'}`}>
        <Icon className={`w-3.5 h-3.5 ${critical > 0 ? 'text-red-600' : high > 0 ? 'text-orange-600' : 'text-slate-500'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800">{module}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">
          {insights.length === 0 ? 'No signals' : `${insights.length} signal${insights.length > 1 ? 's' : ''}`}
        </p>
      </div>
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor} ${critical > 0 ? 'animate-pulse' : ''}`} />
    </button>
  )
}

// ─── Insight card ─────────────────────────────────────────────────────────────

function InsightCard({ insight }: { insight: Insight }) {
  const [expanded, setExpanded] = useState(false)
  const config = CATEGORY_CONFIG[insight.category]

  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 shadow-sm ${PRIORITY_BORDER[insight.priority]}`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${config.color}`}>
              <config.Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 leading-tight">{insight.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
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

        <p className="text-sm text-slate-600 mb-3 ml-11">{insight.summary}</p>

        {expanded && (
          <div className="ml-11 space-y-3 mb-3 pt-3 border-t border-slate-100">
            <p className="text-sm text-slate-700 leading-relaxed">{insight.detail}</p>
            <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
              <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-blue-800">{insight.action}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(e => !e)}
          className="ml-11 flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Show less' : 'View detail & action'}
        </button>
      </div>
    </div>
  )
}

// ─── Main command center ──────────────────────────────────────────────────────

export function KIMMMPage() {
  const [filter, setFilter] = useState<InsightCategory | 'all'>('all')
  const { insights, criticalCount, setInsights } = useKIMMPStore()

  const { data: rawInsights, isLoading } = useQuery({
    queryKey: ['kimmp-insights'],
    queryFn: () => api.get('/dashboard/insights', { params: { limit: 50 } })
      .then(r => (r.data.insights ?? r.data ?? []) as Record<string, unknown>[]),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 3,
  })

  useEffect(() => {
    if (rawInsights?.length) setInsights(rawInsights.map((r, i) => toInsight(r, i)))
  }, [rawInsights, setInsights])

  const filtered = filter === 'all' ? insights : insights.filter(i => i.category === filter)
  const criticalInsights = insights.filter(i => i.priority === 'critical')
  const highInsights     = insights.filter(i => i.priority === 'high')

  // Module pulse — group by module
  const moduleSignals = insights.reduce<Record<string, Insight[]>>((acc, insight) => {
    const m = insight.module || 'System'
    if (!acc[m]) acc[m] = []
    acc[m].push(insight)
    return acc
  }, {})
  const allModules = ['Leads', 'Finance', 'Clients', 'Careers', 'Projects', 'Investors', 'Resources']
  allModules.forEach(m => { if (!moduleSignals[m]) moduleSignals[m] = [] })

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            KIMMP Intelligence
            {isLoading && <Spinner size="sm" />}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Cross-module AI signals, risks, and opportunities — the operating brain of the OS.
          </p>
        </div>
        <Badge variant="success" size="sm" dot>Live</Badge>
      </div>

      {/* Priority Action Queue — critical items only, always visible */}
      {criticalInsights.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide">Priority Action Queue</h3>
            <span className="ml-auto text-xs text-red-600 font-semibold">{criticalInsights.length} critical</span>
          </div>
          {criticalInsights.map(insight => (
            <div key={insight.id} className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{insight.title}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{insight.summary}</p>
                  <div className="flex items-start gap-1.5 mt-2 bg-red-50 rounded-lg p-2">
                    <ArrowRight className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-red-800">{insight.action}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-red-700 flex-shrink-0">{insight.impact}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Module Pulse — all modules at a glance */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">OS Intelligence Pulse</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {allModules.map(m => (
            <ModulePulse key={m} module={m} insights={moduleSignals[m] ?? []} />
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Signals',    value: insights.length,                             icon: Brain,         color: 'text-purple-600 bg-purple-50' },
          { label: 'Critical Alerts',   value: criticalCount(),                              icon: AlertTriangle, color: 'text-red-600 bg-red-50'       },
          { label: 'High Priority',     value: highInsights.length,                          icon: Zap,           color: 'text-orange-600 bg-orange-50'  },
          { label: 'Modules Monitored', value: allModules.length,                            icon: BarChart3,     color: 'text-blue-600 bg-blue-50'      },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
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
        {(['all', 'revenue', 'risk', 'opportunity', 'ops', 'talent'] as const).map(cat => {
          const count = cat === 'all' ? insights.length : insights.filter(i => i.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                filter === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat === 'all' ? 'All Signals' : CATEGORY_CONFIG[cat].label}
              <span className="ml-1.5 text-xs opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Full signal feed */}
      <div className="space-y-4">
        {filtered
          .sort((a, b) => {
            const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
            return (order[a.priority] ?? 9) - (order[b.priority] ?? 9)
          })
          .map(insight => <InsightCard key={insight.id} insight={insight} />)
        }
      </div>
    </div>
  )
}
