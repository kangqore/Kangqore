import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Activity, RefreshCw, GitMerge, Filter,
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
  COMPETITOR:  { icon: ({ className }) => <AlertTriangle className={className} />, color: 'text-red-500 bg-red-50'    },
  OPPORTUNITY: { icon: ({ className }) => <Lightbulb    className={className} />, color: 'text-green-600 bg-green-50' },
  MARKET:      { icon: ({ className }) => <TrendingUp   className={className} />, color: 'text-blue-500 bg-blue-50'  },
  RISK:        { icon: ({ className }) => <Shield       className={className} />, color: 'text-amber-500 bg-amber-50'},
  SYSTEM:      { icon: ({ className }) => <Zap          className={className} />, color: 'text-purple-500 bg-purple-50'},
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
  const sev = SEV_CONFIG[signal.severity] ?? SEV_CONFIG.LOW
  const cat = CAT_CONFIG[signal.signalCategory] ?? CAT_CONFIG.SYSTEM
  const Icon = cat.icon

  return (
    <div className="flex items-start gap-3 py-3 px-4 border-b border-os-border last:border-0 hover:bg-slate-900/60 transition-colors">
      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${cat.color}`}>
        <Icon className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-200 leading-snug line-clamp-2">{signal.signalValue}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant={sev.badge} size="sm" dot>{signal.severity}</Badge>
          <span className="text-[10px] text-slate-500">{signal.signalType.replace(/_/g, ' ')}</span>
          <span className="text-[10px] text-slate-500 border-l border-os-border pl-2">{signal.sourceModule}</span>
          <span className="text-[10px] text-slate-300 ml-auto">{signal.confidence}% conf</span>
        </div>
      </div>
      <span className="text-[10px] text-slate-500 flex-shrink-0 mt-0.5">{formatRelative(signal.createdAt)}</span>
    </div>
  )
}

// ─── Correlation pattern card ─────────────────────────────────────────────────

function PatternCard({ pattern }: { pattern: CorrelationPattern }) {
  return (
    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 space-y-2">
      <div className="flex items-start gap-2">
        <GitMerge className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm font-semibold text-white">{pattern.pattern}</p>
        <span className="ml-auto text-[10px] font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-md flex-shrink-0">
          {pattern.confidence}%
        </span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed ml-6">{pattern.recommendation}</p>
      {pattern.signals?.length > 0 && (
        <div className="flex flex-wrap gap-1 ml-6">
          {pattern.signals.map((s, i) => (
            <span key={i} className="text-[10px] bg-os-s1 border border-purple-200 text-purple-600 px-1.5 py-0.5 rounded-md">{s}</span>
          ))}
        </div>
      )}
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
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Signal Ledger + Correlation</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Every signal KIMMP has observed — from Scout, Proactive Engine, and cross-module triggers.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => refetch()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-os-s1 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={runCorrelation}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {analyzing ? <Spinner size="sm" /> : <GitMerge className="w-4 h-4" />}
            Analyze Patterns
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Critical', count: counts.CRITICAL, color: 'text-red-600'   },
          { label: 'High',     count: counts.HIGH,     color: 'text-amber-600' },
          { label: 'Moderate', count: counts.MODERATE, color: 'text-blue-600'  },
          { label: 'Low',      count: counts.LOW,      color: 'text-slate-500' },
        ].map(s => (
          <div key={s.label} className="bg-os-s1 border border-os-border rounded-xl p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
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

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          {SEVERITY_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setSevFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                sevFilter === f
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-os-s1 text-slate-300 border-os-border hover:border-slate-400'
              }`}
            >
              {f === 'ALL' ? 'All Severities' : f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-3.5 h-3.5 flex-shrink-0" />
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setCatFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                catFilter === f
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-os-s1 text-slate-300 border-os-border hover:border-slate-400'
              }`}
            >
              {f === 'ALL' ? 'All Categories' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Signal list */}
      <div className="bg-os-s1 border border-os-border rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : signals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="w-8 h-8 text-slate-200 mb-3" />
            <p className="text-sm text-slate-500">No signals match the current filter.</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-2.5 border-b border-os-border bg-slate-900 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{signals.length} signals</span>
              <span className="text-[10px] text-slate-500">Latest first</span>
            </div>
            {signals.map(signal => <SignalRow key={signal.id} signal={signal} />)}
          </>
        )}
      </div>
    </div>
  )
}
