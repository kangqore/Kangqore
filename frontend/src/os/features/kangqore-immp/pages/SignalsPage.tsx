import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Activity, RefreshCw, GitMerge, Filter, ChevronDown,
  AlertTriangle, TrendingUp, Lightbulb, Zap, Shield,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Signal {
  id: string
  sourceModule: string
  signalType: string
  signalCategory: string
  signalValue: string
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  confidence: number
  createdAt: string
  metadata?: Record<string, any>
}

interface CorrelationPattern {
  pattern: string
  signals: string[]
  confidence: number
  recommendation: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SEV_CONFIG: Record<string, { badge: 'danger' | 'warning' | 'info' | 'neutral'; dot: string }> = {
  CRITICAL: { badge: 'danger',  dot: 'bg-red-500'    },
  HIGH:     { badge: 'warning', dot: 'bg-amber-400'  },
  MODERATE: { badge: 'info',    dot: 'bg-blue-400'   },
  LOW:      { badge: 'neutral', dot: 'bg-slate-300'  },
}

const CAT_CONFIG: Record<string, { icon: React.FC<{ className?: string }>; color: string }> = {
  COMPETITOR:  { icon: ({ className }) => <AlertTriangle className={className} />, color: '#ef4444' },
  OPPORTUNITY: { icon: ({ className }) => <Lightbulb    className={className} />, color: '#16a34a' },
  MARKET:      { icon: ({ className }) => <TrendingUp   className={className} />, color: '#3b82f6' },
  RISK:        { icon: ({ className }) => <Shield       className={className} />, color: '#f59e0b' },
  SYSTEM:      { icon: ({ className }) => <Zap          className={className} />, color: '#a855f7' },
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ─── Signal row ───────────────────────────────────────────────────────────────

function SignalRow({ signal }: { signal: Signal }) {
  const [expanded, setExpanded] = useState(false)
  const sev = SEV_CONFIG[signal.severity] ?? SEV_CONFIG.LOW
  const cat = CAT_CONFIG[signal.signalCategory] ?? CAT_CONFIG.SYSTEM
  const Icon = cat.icon
  const meta = signal.metadata ?? {}
  const hasDetail = Object.keys(meta).length > 0

  return (
    <div className={`border-b border-[var(--os-border)] last:border-0 transition-colors ${expanded ? 'bg-[var(--os-surface-0)]' : 'hover:bg-[var(--os-surface-0)]'}`}>
      <div
        className="flex items-start gap-4 py-4 px-6 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}20`, color: cat.color }}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold text-[var(--os-text-1)] leading-snug ${expanded ? '' : 'line-clamp-2'}`}>{signal.signalValue}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant={sev.badge} size="sm" dot>{signal.severity}</Badge>
            <span className="text-[11px] font-bold text-[var(--os-text-2)]">{signal.signalType.replace(/_/g, ' ')}</span>
            <span className="text-[11px] font-bold text-[var(--os-text-2)] border-l border-[var(--os-border)] pl-2">{signal.sourceModule}</span>
            <span className="text-[11px] font-bold text-blue-600 ml-auto bg-blue-50 px-2 py-0.5 rounded-md">{signal.confidence}% conf</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          <span className="text-[11px] font-bold text-[var(--os-text-2)]">{formatRelative(signal.createdAt)}</span>
          <ChevronDown className={`w-4 h-4 text-[var(--os-text-2)] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-5">
          <div className="ml-14 rounded-xl border border-[var(--os-border)] overflow-hidden" style={{ background: 'var(--os-card)' }}>
            <div className="px-4 py-2.5 border-b border-[var(--os-border)]" style={{ background: 'var(--os-surface-0)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)]">Signal Detail</p>
            </div>
            {hasDetail ? (
              <div className="divide-y divide-[var(--os-border)]">
                {Object.entries(meta).map(([k, v]) => (
                  <div key={k} className="flex gap-4 px-4 py-2.5">
                    <span className="text-[11px] font-bold text-[var(--os-text-2)] w-36 flex-shrink-0 pt-px">{k.replace(/_/g, ' ')}</span>
                    <span className="text-[11px] text-[var(--os-text-1)] break-all whitespace-pre-wrap font-mono leading-relaxed">
                      {typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-4 py-4 text-[11px] font-bold text-[var(--os-text-2)] italic">No additional metadata for this signal.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Correlation pattern card ─────────────────────────────────────────────────

function PatternCard({ pattern }: { pattern: CorrelationPattern }) {
  return (
    <div
      className="rounded-[32px] p-6 space-y-3 transition-transform hover:-translate-y-1"
      style={{ background: '#7c3aed0A', boxShadow: '0 16px 32px rgba(124,58,237,0.1)' }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-purple-100/50">
          <GitMerge className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <p className="text-base font-bold text-[var(--os-text-1)]">{pattern.pattern}</p>
            <span className="ml-auto text-[11px] font-bold px-2 py-1 rounded-md flex-shrink-0 text-purple-600 bg-purple-100">
              {pattern.confidence}%
            </span>
          </div>
          <p className="text-sm font-semibold text-[var(--os-text-2)] leading-relaxed mt-1.5">{pattern.recommendation}</p>
          {pattern.signals?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {pattern.signals.map((s, i) => (
                <span key={i} className="text-[10px] font-bold px-2 py-1 rounded-md text-purple-600 bg-purple-50">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const SEVERITY_FILTERS = ['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const
const CATEGORY_FILTERS = ['ALL', 'COMPETITOR', 'OPPORTUNITY', 'MARKET', 'RISK', 'SYSTEM'] as const

export function SignalsPage() {
  const [sevFilter, setSevFilter] = useState<typeof SEVERITY_FILTERS[number]>('ALL')
  const [catFilter, setCatFilter] = useState<typeof CATEGORY_FILTERS[number]>('ALL')
  const [patterns,  setPatterns]  = useState<CorrelationPattern[]>([])
  const [analyzing, setAnalyzing] = useState(false)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['signals', sevFilter, catFilter],
    queryFn: () => {
      const params: Record<string, string> = { limit: '100' }
      if (sevFilter !== 'ALL') params.severity = sevFilter
      if (catFilter !== 'ALL') params.category  = catFilter
      return api.get('/admin/kangqore-immp/signals', { params }).then(r => r.data)
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const signals: Signal[] = data?.signals ?? []

  async function runCorrelation() {
    setAnalyzing(true)
    try {
      const res = await api.post('/admin/kangqore-immp/correlation/analyze', { windowHours: 24 })
      setPatterns(res.data?.patterns ?? [])
    } finally {
      setAnalyzing(false)
    }
  }

  const counts = {
    CRITICAL: signals.filter(s => s.severity === 'CRITICAL').length,
    HIGH:     signals.filter(s => s.severity === 'HIGH').length,
    MODERATE: signals.filter(s => s.severity === 'MODERATE').length,
    LOW:      signals.filter(s => s.severity === 'LOW').length,
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 mb-1 border-b border-[var(--os-border)]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[var(--os-text-1)]">Signal Ledger + Correlation</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">
            Every signal KIMMP has observed — from Scout, Proactive Engine, and cross-module triggers.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => refetch()}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--os-text-2)] bg-[var(--os-surface-0)] border border-[var(--os-border)] hover:text-[var(--os-text-1)] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={runCorrelation}
            disabled={analyzing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-[12px] font-bold hover:-translate-y-1 transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2564ea 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
          >
            {analyzing ? <Spinner size="sm" /> : <GitMerge className="w-4 h-4" />}
            Analyze Patterns
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Critical',   value: counts.CRITICAL, accent: '#e2445c', icon: AlertTriangle },
          { label: 'High',       value: counts.HIGH,     accent: '#fdab3d', icon: Shield        },
          { label: 'Correlated', value: counts.MODERATE, accent: '#7c3aed', icon: GitMerge      },
          { label: 'Sources',    value: counts.LOW,      accent: '#579bfc', icon: Activity      },
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
              <s.icon style={{ width: 18, height: 18, color: '#ffffff' }} />
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

      {/* Patterns */}
      {patterns.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-purple-500" />
            Correlation Patterns Detected ({patterns.length})
          </h3>
          {patterns.map((p, i) => <PatternCard key={i} pattern={p} />)}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-[var(--os-text-2)]" />
          {SEVERITY_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setSevFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                sevFilter === f
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-[var(--os-surface-0)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-slate-100'
              }`}
            >
              {f === 'ALL' ? 'All Severities' : f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-4 h-4 flex-shrink-0" />
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setCatFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                catFilter === f
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                  : 'bg-[var(--os-surface-0)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-slate-100'
              }`}
            >
              {f === 'ALL' ? 'All Categories' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Signal list */}
      <div className="bg-[var(--os-card)] shadow-[0_32px_64px_rgba(0,0,0,0.04)] overflow-hidden" style={{ borderRadius: 'var(--os-radius-xl)' }}>
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : signals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
              <Activity className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-bold text-[var(--os-text-1)]">No signals match</p>
            <p className="text-sm font-semibold text-[var(--os-text-2)] mt-2">Try widening the filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-[var(--os-border)] bg-[var(--os-surface-0)]/50 flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-wider">{signals.length} signals</span>
              <span className="text-[11px] font-bold text-[var(--os-text-2)]">Latest first</span>
            </div>
            {signals.map(signal => <SignalRow key={signal.id} signal={signal} />)}
          </>
        )}
      </div>
    </div>
  )
}
