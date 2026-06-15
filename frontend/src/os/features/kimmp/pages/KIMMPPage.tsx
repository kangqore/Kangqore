import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Brain, TrendingUp, AlertTriangle, Lightbulb, Zap, Target,
  ArrowRight, ChevronDown, ChevronUp, BarChart3,
  Briefcase, DollarSign, Users, GraduationCap, Building2,
  RefreshCw,
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
  revenue:     { label: 'Revenue',     color: 'bg-[#00c875] text-white shadow-[0_2px_8px_rgba(0,200,117,0.25)]',   dot: 'bg-[#00c875]',  Icon: ({ className }) => <TrendingUp    className={className ?? 'w-4 h-4'} /> },
  risk:        { label: 'Risk',        color: 'bg-[#e2445c] text-white shadow-[0_2px_8px_rgba(226,68,92,0.25)]',    dot: 'bg-[#e2445c]',  Icon: ({ className }) => <AlertTriangle className={className ?? 'w-4 h-4'} /> },
  opportunity: { label: 'Opportunity', color: 'bg-[#0073ea] text-white shadow-[0_2px_8px_rgba(0,115,234,0.25)]',   dot: 'bg-[#0073ea]',  Icon: ({ className }) => <Lightbulb     className={className ?? 'w-4 h-4'} /> },
  ops:         { label: 'Operations',  color: 'bg-[#fdab3d] text-white shadow-[0_2px_8px_rgba(253,171,61,0.25)]',   dot: 'bg-[#fdab3d]',  Icon: ({ className }) => <Zap           className={className ?? 'w-4 h-4'} /> },
  talent:      { label: 'Talent',      color: 'bg-[#7f53f9] text-white shadow-[0_2px_8px_rgba(127,83,249,0.25)]',   dot: 'bg-[#7f53f9]',  Icon: ({ className }) => <Target        className={className ?? 'w-4 h-4'} /> },
}

const PRIORITY_BORDER: Record<string, string> = {
  critical: 'border-l-[#e2445c]',
  high:     'border-l-[#fdab3d]',
  medium:   'border-l-[#0073ea]',
  low:      'border-l-[#c4c4c4]',
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

  const cardBorder = critical > 0 ? 'border-l-4 border-l-[#e2445c] border-y border-r border-slate-200 bg-white' :
                     high > 0     ? 'border-l-4 border-l-[#fdab3d] border-y border-r border-slate-200 bg-white' :
                     insights.length > 0 ? 'border-l-4 border-l-[#0073ea] border-y border-r border-slate-200 bg-white' :
                     'border-slate-200 bg-white'

  const iconBg = critical > 0 ? 'bg-[#e2445c] text-white shadow-[0_2px_6px_rgba(226,68,92,0.2)]' :
                 high > 0     ? 'bg-[#fdab3d] text-white shadow-[0_2px_6px_rgba(253,171,61,0.2)]' :
                 insights.length > 0 ? 'bg-[#0073ea] text-white shadow-[0_2px_6px_rgba(0,115,234,0.2)]' :
                 'bg-slate-100 text-slate-400'

  const path = `/kangqore-view/${module.toLowerCase()}`

  return (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-md text-left cursor-pointer hover:border-slate-300 ${cardBorder}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800 leading-none">{module}</p>
        <p className="text-[10px] text-slate-500 mt-1.5 leading-none">
          {insights.length === 0 ? 'No signals' : `${insights.length} signal${insights.length > 1 ? 's' : ''}`}
        </p>
      </div>
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
            <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
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
                {insight.createdAt && (
                  <span className="text-xs text-slate-300">·</span>
                )}
                {insight.createdAt && (
                  <span className="text-xs text-slate-400">{formatRelative(insight.createdAt)}</span>
                )}
              </div>
            </div>
          </div>
          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${config.color} flex-shrink-0`}>
            {insight.impact}
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-4 ml-11">{insight.summary}</p>

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

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)   return 'just now'
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

// ─── Main command center ──────────────────────────────────────────────────────

function useRelativeTime(ts: number | undefined) {
  const [label, setLabel] = useState('')
  const compute = useCallback(() => {
    if (!ts) return ''
    const diff = Math.floor((Date.now() - ts) / 60000)
    if (diff < 1) return 'just now'
    if (diff === 1) return '1m ago'
    return `${diff}m ago`
  }, [ts])
  useEffect(() => {
    setLabel(compute())
    const id = setInterval(() => setLabel(compute()), 30000)
    return () => clearInterval(id)
  }, [compute])
  return label
}

export function KIMMMPage() {
  const [filter, setFilter] = useState<InsightCategory | 'all'>('all')
  const { insights, criticalCount, setInsights } = useKIMMPStore()

  const { data: rawInsights, isLoading, isFetching, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['kimmp-insights'],
    queryFn: () => api.get('/dashboard/insights', { params: { limit: 50 } })
      .then(r => (r.data.insights ?? r.data ?? []) as Record<string, unknown>[]),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 3,
    refetchInterval: 1000 * 60 * 3,
  })

  const lastUpdated = useRelativeTime(dataUpdatedAt || undefined)

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
        <div className="flex items-center gap-2 flex-shrink-0">
          {lastUpdated && (
            <span className="text-[11px] text-slate-400">Updated {lastUpdated}</span>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40"
            title="Refresh signals"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <Badge variant="success" size="sm" dot>Live</Badge>
        </div>
      </div>

      {/* Priority Action Queue — critical items only, always visible */}
      {criticalInsights.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 border-l-4 border-l-[#e2445c] shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-[#e2445c]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-[0.12em]">Priority Action Queue</h3>
            <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full bg-[#e2445c] text-white font-extrabold shadow-sm">{criticalInsights.length} critical</span>
          </div>
          {criticalInsights.map(insight => (
            <div key={insight.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#e2445c] text-white flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(226,68,92,0.3)]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{insight.title}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-normal">{insight.summary}</p>
                  <div className="flex items-start gap-2 mt-2.5 bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#e2445c] flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-slate-700">{insight.action}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#e2445c]/10 text-[#e2445c] flex-shrink-0">{insight.impact}</span>
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
        <div className="flex items-center gap-5 mt-2.5">
          {[
            { color: 'bg-[#e2445c]', label: 'Critical' },
            { color: 'bg-[#fdab3d]', label: 'High' },
            { color: 'bg-[#0073ea]', label: 'Active' },
            { color: 'bg-slate-200',  label: 'No signals' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className={`w-2 h-2 rounded-sm flex-shrink-0 ${color}`} />
              {label}
            </span>
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                filter === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat === 'all' ? 'All Signals' : CATEGORY_CONFIG[cat].label}
              <span className={`inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full text-[10px] font-bold ${
                filter === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Full signal feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              {filter === 'all'
                ? <Brain className="w-6 h-6 text-slate-400" />
                : (() => { const Ic = CATEGORY_CONFIG[filter].Icon; return <Ic className="w-6 h-6 text-slate-400" /> })()
              }
            </div>
            <p className="text-sm font-semibold text-slate-700">
              No {filter === 'all' ? '' : `${CATEGORY_CONFIG[filter].label} `}signals right now
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              All clear in this category — check back later or widen the filter.
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
              >
                View all signals →
              </button>
            )}
          </div>
        ) : (
          filtered
            .sort((a, b) => {
              const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
              return (order[a.priority] ?? 9) - (order[b.priority] ?? 9)
            })
            .map(insight => <InsightCard key={insight.id} insight={insight} />)
        )}
      </div>
    </div>
  )
}
