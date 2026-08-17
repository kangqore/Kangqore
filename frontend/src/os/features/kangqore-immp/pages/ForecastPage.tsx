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

const PRIORITY_COLOR: Record<string, string> = {
  critical: '#e2445c',
  high:     '#fdab3d',
  medium:   '#0073ea',
  low:      '#c4c4c4',
}

const PRIORITY_BADGE: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  critical: 'danger', high: 'warning', medium: 'info', low: 'neutral',
}

function ForecastCard({ insight }: { insight: Insight }) {
  const [expanded, setExpanded] = useState(false)
  const config = CATEGORY_CONFIG[insight.category]

  const c = PRIORITY_COLOR[insight.priority]

  return (
    <div className="rounded-[32px] overflow-hidden transition-all" style={{ background: `${c}10`, boxShadow: `0 24px 48px ${c}20` }}>
      {/* Forecast badge strip */}
      <div className="flex items-center gap-2 px-8 pt-6 pb-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-2xl bg-[#7c3aed20] text-[#7c3aed] uppercase tracking-widest">
          <TrendingUp className="w-2.5 h-2.5" />
          Forecast
        </span>
        {insight.forecastHorizon && (
          <span className="flex items-center gap-1 text-[10px] text-[var(--os-text-2)]">
            <Clock className="w-2.5 h-2.5" />
            {insight.forecastHorizon}
          </span>
        )}
        <span className="ml-auto text-[10px] text-[var(--os-text-2)]">{insight.confidence}% confidence</span>
      </div>

      <div className="p-8 pt-3">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${config.bg} text-white shadow-sm`}>
              <config.Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-[var(--os-text-1)] leading-tight">{insight.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant={PRIORITY_BADGE[insight.priority]} size="sm" dot>
                  {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
                </Badge>
                <Badge variant="neutral" size="sm">{insight.module}</Badge>
              </div>
            </div>
          </div>
          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-2xl uppercase tracking-wider ${config.bg} text-white flex-shrink-0`}>
            {insight.impact}
          </span>
        </div>

        <p className="text-sm text-[var(--os-text-2)] leading-relaxed mb-3 ml-11">{insight.summary}</p>

        {expanded && (
          <div className="ml-11 space-y-3 mb-3 pt-3 border-t border-[var(--os-border)]">
            <p className="text-sm text-[var(--os-text-1)] leading-relaxed">{insight.detail}</p>
            {insight.forecastBasis && (
              <div className="flex items-start gap-2 bg-[#7c3aed10] border border-[var(--os-border)] rounded-2xl p-3">
                <Database className="w-4 h-4 text-[#7c3aed] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest mb-0.5">Forecast basis</p>
                  <p className="text-xs text-[var(--os-text-1)]">{insight.forecastBasis}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2 bg-[#579bfc10] border border-[var(--os-border)] rounded-2xl p-3">
              <ArrowRight className="w-4 h-4 text-[#579bfc] flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-[var(--os-text-1)]">{insight.action}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(e => !e)}
          className="ml-11 flex items-center gap-1 text-xs text-[#579bfc] font-medium hover:text-[#3d85e8] transition-colors"
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
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 mb-1 border-b border-[var(--os-border)]">
        <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[var(--os-text-1)]">KIMMP Forecast</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">
            Predictive intelligence — what KIMMP sees coming before it arrives.
          </p>
        </div>
        <Badge variant="neutral" size="sm">{forecasts.length} predictions active</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Forecasts', value: forecasts.length, accent: '#7c3aed', icon: TrendingUp    },
          { label: 'Critical Risk',    value: criticalCount,    accent: '#e2445c', icon: AlertTriangle },
          { label: 'High Priority',    value: highCount,        accent: '#fdab3d', icon: Zap           },
        ].map(s => (
          <div key={s.label} className="relative overflow-hidden flex flex-col p-5 transition-all duration-300"
            style={{
              background: s.accent,
              color: '#ffffff',
              borderRadius: 'var(--os-radius-xl)',
              boxShadow: `0 12px 32px ${s.accent}60`,
              border: 'none',
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: '50%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15))', pointerEvents: 'none' }} />
            
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-3xl font-black tracking-tight leading-none mb-1.5" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {s.value}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {s.label}
            </p>
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-sm font-medium border transition-all ${
                filter === cat
                  ? 'bg-[#7c3aed] text-white border-[#7c3aed]'
                  : 'bg-[var(--os-card)] text-[var(--os-text-2)] border-[var(--os-border)] hover:border-[#7c3aed] hover:text-[#7c3aed]'
              }`}
            >
              {cat === 'all' ? 'All Forecasts' : CATEGORY_CONFIG[cat].label}
              <span className={`inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full text-[10px] font-bold ${
                filter === cat ? 'bg-white/20 text-white' : 'bg-[var(--os-surface-0)] text-[var(--os-text-2)]'
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
          <div className="flex flex-col items-center justify-center py-20 text-center" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#7c3aed20', color: '#7c3aed' }}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-[var(--os-text-1)]">No forecasts in this category</p>
            <p className="text-sm text-[var(--os-text-2)] mt-1.5">Try widening the filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
