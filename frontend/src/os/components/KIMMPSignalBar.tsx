import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, AlertTriangle, TrendingUp, Lightbulb, Zap, Target, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { cn } from '@design-system/cn'
import { useKIMMPStore, type Insight, type InsightCategory } from '@store/kimmp'

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

interface KIMMPSignalBarProps {
  module: string
  className?: string
}

const CATEGORY_ICON: Record<InsightCategory, React.FC<{ className?: string }>> = {
  revenue:     ({ className }) => <TrendingUp    className={className} />,
  risk:        ({ className }) => <AlertTriangle className={className} />,
  opportunity: ({ className }) => <Lightbulb     className={className} />,
  ops:         ({ className }) => <Zap           className={className} />,
  talent:      ({ className }) => <Target        className={className} />,
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'border-l-4 border-l-[#e2445c] bg-[#151C2F] border-y border-r border-[#2E2854] shadow-[0_2px_12px_rgba(0,0,0,0.3)]',
  high:     'border-l-4 border-l-[#fdab3d] bg-[#151C2F] border-y border-r border-[#2E2854] shadow-[0_2px_12px_rgba(0,0,0,0.3)]',
  medium:   'border-l-4 border-l-[#0073ea] bg-[#151C2F] border-y border-r border-[#2E2854] shadow-[0_2px_12px_rgba(0,0,0,0.3)]',
  low:      'border-l-4 border-l-slate-500 bg-[#151C2F] border-y border-r border-[#2E2854] shadow-[0_2px_12px_rgba(0,0,0,0.3)]',
}

const PRIORITY_ICON_COLOR: Record<string, string> = {
  critical: 'text-[#e2445c]',
  high:     'text-[#fdab3d]',
  medium:   'text-[#0073ea]',
  low:      'text-slate-500',
}

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'bg-[#e2445c] text-white font-extrabold shadow-sm',
  high:     'bg-[#fdab3d] text-white font-extrabold shadow-sm',
  medium:   'bg-[#0073ea] text-white font-extrabold shadow-sm',
  low:      'bg-[#0F172A] text-slate-300 font-extrabold shadow-sm border border-[#2E2854]',
}

function SignalRow({ insight, expanded }: { insight: Insight; expanded: boolean }) {
  const CategoryIcon = CATEGORY_ICON[insight.category]
  return (
    <div className={cn(
      'rounded-xl border px-4 py-3 transition-all duration-200',
      PRIORITY_STYLES[insight.priority]
    )}>
      <div className="flex items-start gap-3">
        <CategoryIcon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', PRIORITY_ICON_COLOR[insight.priority])} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white leading-tight">{insight.title}</span>
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide', PRIORITY_BADGE[insight.priority])}>
              {insight.priority}
            </span>
            <span className="text-xs text-slate-500">{insight.confidence}% confidence</span>
            <span className="text-xs font-semibold text-slate-500 ml-auto">{insight.impact}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{insight.summary}</p>
          {expanded && (
            <div className="mt-2 pt-2 border-t border-[#2E2854] space-y-1.5">
              <p className="text-xs text-slate-300 leading-relaxed">{insight.detail}</p>
              <div className="flex items-start gap-2 mt-2.5 bg-[#0F172A] border border-[#2E2854] rounded-xl p-2.5">
                <ArrowRight className="w-3.5 h-3.5 text-[#4ab6d4] flex-shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-slate-200">{insight.action}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function KIMMPSignalBar({ module, className }: KIMMPSignalBarProps) {
  const [expanded, setExpanded] = useState(false)
  const [detailExpanded, setDetailExpanded] = useState(false)
  const navigate = useNavigate()
  const allInsights = useKIMMPStore(s => s.insights)
  const signals = useMemo(
    () => allInsights
      .filter(i => i.module.toLowerCase() === module.toLowerCase())
      .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9)),
    [allInsights, module]
  )

  if (signals.length === 0) return null

  const topSignal = signals[0]
  const hasCritical = signals.some(s => s.priority === 'critical')
  const rest = signals.slice(1)

  return (
    <div className={cn('mb-6', className)}>
      {/* Header bar */}
      <div className={cn(
        'flex items-center gap-2.5 px-4 py-2.5 rounded-t-xl border-b-0',
        hasCritical
          ? 'bg-gradient-to-r from-red-950/80 to-purple-950/80 border border-red-800/40'
          : 'bg-gradient-to-r from-purple-950/80 to-[#151C2F]/80 border border-purple-800/40',
        expanded ? 'rounded-t-xl' : 'rounded-xl'
      )}>
        <div className="flex items-center gap-2 flex-1">
          <Brain className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-purple-200">KIMMP</span>
          {hasCritical && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          )}
          <span className="text-xs text-slate-500">
            {signals.length} signal{signals.length !== 1 ? 's' : ''} for {module}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/kangqore-view/admin/kangqore-immp')}
            className="text-[10px] text-purple-300 hover:text-purple-100 font-medium transition-colors"
          >
            View all →
          </button>
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-slate-500 hover:text-slate-200 transition-colors"
          >
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5" />
              : <ChevronDown className="w-3.5 h-3.5" />
            }
          </button>
        </div>
      </div>

      {/* Signal content */}
      {expanded && (
        <div className="border border-t-0 border-[#2E2854] bg-[#0F172A] rounded-b-xl p-3 space-y-2">
          <SignalRow insight={topSignal} expanded={detailExpanded} />
          {rest.length > 0 && detailExpanded && rest.map(s => (
            <SignalRow key={s.id} insight={s} expanded={false} />
          ))}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => setDetailExpanded(d => !d)}
              className="text-xs text-purple-300 hover:text-purple-100 font-medium transition-colors"
            >
              {detailExpanded ? 'Show less' : `Show detail${rest.length > 0 ? ` + ${rest.length} more` : ''}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
