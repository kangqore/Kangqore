import { useState } from 'react'
import {
  TrendingUp, AlertTriangle, Lightbulb, Zap, Target,
  ArrowRight, ChevronDown, ChevronUp, Clock, Database,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { useKIMMPStore, type Insight, type InsightCategory } from '@store/kimmp'

const CATEGORY_CONFIG: Record<InsightCategory, {
  label: string
  color: string
  bg: string
  Icon: React.FC<{ className?: string }>
}> = {
  revenue:     { label: 'Revenue',     color: 'text-[#00c875]', bg: 'bg-[#00c875]', Icon: ({ className }) => <TrendingUp    className={className ?? 'w-4 h-4'} /> },
  risk:        { label: 'Risk',        color: 'text-[#e2445c]', bg: 'bg-[#e2445c]', Icon: ({ className }) => <AlertTriangle className={className ?? 'w-4 h-4'} /> },
  opportunity: { label: 'Opportunity', color: 'text-[#0073ea]', bg: 'bg-[#0073ea]', Icon: ({ className }) => <Lightbulb     className={className ?? 'w-4 h-4'} /> },
  ops:         { label: 'Operations',  color: 'text-[#fdab3d]', bg: 'bg-[#fdab3d]', Icon: ({ className }) => <Zap           className={className ?? 'w-4 h-4'} /> },
  talent:      { label: 'Talent',      color: 'text-[#7f53f9]', bg: 'bg-[#7f53f9]', Icon: ({ className }) => <Target        className={className ?? 'w-4 h-4'} /> },
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

function ForecastCard({ insight }: { insight: Insight }) {
  const [expanded, setExpanded] = useState(false)
  const config = CATEGORY_CONFIG[insight.category]

  return (
    <div className={`bg-[#151C2F] rounded-xl border border-[#2E2854] border-l-4 shadow-sm ${PRIORITY_BORDER[insight.priority]}`}>
      {/* Forecast badge strip */}
      <div className="flex items-center gap-2 px-5 pt-3.5 pb-0">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 uppercase tracking-wider">
          <TrendingUp className="w-2.5 h-2.5" />
          Forecast
        </span>
        {insight.forecastHorizon && (
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <Clock className="w-2.5 h-2.5" />
            {insight.forecastHorizon}
          </span>
        )}
        <span className="ml-auto text-[10px] text-slate-500">{insight.confidence}% confidence</span>
      </div>

      <div className="p-5 pt-3">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg} text-white shadow-sm`}>
              <config.Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white leading-tight">{insight.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant={PRIORITY_BADGE[insight.priority]} size="sm" dot>
                  {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
                </Badge>
                <Badge variant="neutral" size="sm">{insight.module}</Badge>
              </div>
            </div>
          </div>
          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${config.bg} text-white flex-shrink-0`}>
            {insight.impact}
          </span>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed mb-3 ml-11">{insight.summary}</p>

        {expanded && (
          <div className="ml-11 space-y-3 mb-3 pt-3 border-t border-[#2E2854]">
            <p className="text-sm text-slate-300 leading-relaxed">{insight.detail}</p>
            {insight.forecastBasis && (
              <div className="flex items-start gap-2 bg-violet-50 border border-violet-100 rounded-xl p-3">
                <Database className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-0.5">Forecast basis</p>
                  <p className="text-xs text-violet-800">{insight.forecastBasis}</p>
                </div>
              </div>
            )}
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
          {expanded ? 'Show less' : 'View prediction detail & action'}
        </button>
      </div>
    </div>
  )
}

export function ForecastPage() {
  const [filter, setFilter] = useState<InsightCategory | 'all'>('all')
  const { insights } = useKIMMPStore()
  const forecasts = insights.filter(i => i.type === 'predictive')
  const filtered  = filter === 'all' ? forecasts : forecasts.filter(i => i.category === filter)

  const criticalCount = forecasts.filter(i => i.priority === 'critical').length
  const highCount     = forecasts.filter(i => i.priority === 'high').length

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">KIMMP Forecast</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Predictive intelligence — what KIMMP sees coming before it arrives.
          </p>
        </div>
        <Badge variant="neutral" size="sm">{forecasts.length} predictions active</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Forecasts', value: forecasts.length,  color: 'text-violet-600 bg-violet-50', icon: TrendingUp    },
          { label: 'Critical Risk',    value: criticalCount,     color: 'text-red-600 bg-red-50',       icon: AlertTriangle },
          { label: 'High Priority',    value: highCount,         color: 'text-orange-600 bg-orange-50', icon: Zap           },
        ].map(s => (
          <div key={s.label} className="bg-[#151C2F] border border-[#2E2854] rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'revenue', 'risk', 'opportunity', 'ops', 'talent'] as const).map(cat => {
          const count = cat === 'all' ? forecasts.length : forecasts.filter(i => i.category === cat).length
          if (cat !== 'all' && count === 0) return null
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                filter === cat
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-[#151C2F] text-slate-300 border-[#2E2854] hover:border-violet-300'
              }`}
            >
              {cat === 'all' ? 'All Forecasts' : CATEGORY_CONFIG[cat].label}
              <span className={`inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full text-[10px] font-bold ${
                filter === cat ? 'bg-[#151C2F]/20 text-white' : 'bg-[#151C2F] text-slate-300'
              }`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Forecast cards */}
      <div className="space-y-4">
        {filtered
          .sort((a, b) => {
            const o: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
            return (o[a.priority] ?? 9) - (o[b.priority] ?? 9)
          })
          .map(insight => <ForecastCard key={insight.id} insight={insight} />)
        }
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-[#151C2F] rounded-2xl border border-[#2E2854]">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-violet-300" />
            </div>
            <p className="text-sm font-semibold text-slate-300">No forecasts in this category</p>
            <p className="text-xs text-slate-500 mt-1">Try widening the filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
