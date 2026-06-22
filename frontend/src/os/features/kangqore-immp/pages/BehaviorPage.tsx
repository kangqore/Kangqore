import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  UserCheck, RefreshCw, ChevronDown, ChevronUp,
  Eye, Globe, TrendingUp, AlertCircle, MessageSquare,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShadowObservation {
  id: string
  conversationId: string
  leadId?: string
  leadName?: string
  sentiment: string
  intent: string
  urgency: string
  traits: string[]
  summary: string
  recommendation: string
  createdAt: string
}

interface MarketSignal {
  id: string
  signalType: string
  signalValue: string
  severity: string
  confidence: number
  createdAt: string
  metadata?: Record<string, any>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SENTIMENT_COLORS: Record<string, string> = {
  POSITIVE:  'text-green-600 bg-green-50 border-green-200',
  NEUTRAL:   'text-slate-300 bg-slate-900 border-white/10 border-t-white/20',
  NEGATIVE:  'text-red-600 bg-red-50 border-red-200',
  MIXED:     'text-amber-600 bg-amber-50 border-amber-200',
}

const URGENCY_BADGE: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  HIGH:   'danger',
  MEDIUM: 'warning',
  LOW:    'neutral',
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

// ─── Observation card ─────────────────────────────────────────────────────────

function ObservationCard({ obs }: { obs: ShadowObservation }) {
  const [expanded, setExpanded] = useState(false)
  const sentColor = SENTIMENT_COLORS[obs.sentiment?.toUpperCase()] ?? SENTIMENT_COLORS.NEUTRAL
  const urgencyBadge = URGENCY_BADGE[obs.urgency?.toUpperCase()] ?? 'neutral'

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
          <Eye className="w-3.5 h-3.5 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {obs.leadName && (
              <p className="text-sm font-semibold text-white">{obs.leadName}</p>
            )}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${sentColor}`}>
              {obs.sentiment}
            </span>
            <Badge variant={urgencyBadge} size="sm">Urgency: {obs.urgency}</Badge>
            <span className="text-[10px] text-slate-500 ml-auto">{formatRelative(obs.createdAt)}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Intent: {obs.intent}</p>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed ml-10">{obs.summary}</p>

      {obs.traits?.length > 0 && (
        <div className="ml-10 flex flex-wrap gap-1.5">
          {obs.traits.map((t, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700">
              {t}
            </span>
          ))}
        </div>
      )}

      {obs.recommendation && expanded && (
        <div className="ml-10 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
          <TrendingUp className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-blue-800">{obs.recommendation}</p>
        </div>
      )}

      {obs.recommendation && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="ml-10 flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide recommendation' : 'Show recommendation'}
        </button>
      )}
    </div>
  )
}

// ─── Market signal row ────────────────────────────────────────────────────────

function MarketSignalRow({ signal }: { signal: MarketSignal }) {
  return (
    <div className="flex items-start gap-3 py-3 px-4 border-b border-white/10 border-t-white/20 last:border-0 hover:bg-slate-900/60 transition-colors">
      <Globe className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-300 leading-snug">{signal.signalValue}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-slate-500">{signal.signalType.replace(/_/g, ' ')}</span>
          <span className="text-[10px] text-slate-300">·</span>
          <span className="text-[10px] text-slate-500">{signal.confidence}% confidence</span>
        </div>
      </div>
      <span className="text-[10px] text-slate-500 flex-shrink-0">{formatRelative(signal.createdAt)}</span>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type Tab = 'shadow' | 'market'

export function BehaviorPage() {
  const [tab, setTab] = useState<Tab>('shadow')

  const { data: shadowData, isLoading: loadingShadow, refetch: refetchShadow } = useQuery({
    queryKey: ['shadow-observations'],
    queryFn: () => api.get('/admin/kangqore-immp/shadow/observations').then(r => r.data),
    staleTime: 60_000,
    enabled: tab === 'shadow',
  })

  const { data: marketData, isLoading: loadingMarket, refetch: refetchMarket } = useQuery({
    queryKey: ['market-behavior'],
    queryFn: () => api.get('/admin/kangqore-immp/market/behavior-signals').then(r => r.data),
    staleTime: 60_000,
    enabled: tab === 'market',
  })

  const observations: ShadowObservation[] = shadowData?.observations ?? []
  const marketSignals: MarketSignal[]     = marketData?.signals      ?? []

  const isLoading = tab === 'shadow' ? loadingShadow : loadingMarket

  function refresh() {
    if (tab === 'shadow') refetchShadow()
    else                   refetchMarket()
  }

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <UserCheck className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Behavior Intelligence</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Stakeholder behavioral analysis from live conversations, plus market-level behavior signals.
          </p>
        </div>
        <button
          onClick={refresh}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 border border-white/10 border-t-white/20 rounded-xl p-1 bg-slate-900 w-fit">
        {([
          { key: 'shadow', label: `Shadow Observations (${observations.length})`, icon: Eye },
          { key: 'market', label: `Market Behavior (${marketSignals.length})`,    icon: Globe },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-white shadow-sm border border-white/10 border-t-white/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* What is this */}
      {tab === 'shadow' && (
        <div className="flex items-start gap-3 bg-violet-50 border border-violet-100 rounded-xl p-4">
          <MessageSquare className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-violet-700 leading-relaxed">
            KIMMP Shadow Mode passively observes eQORE conversations and builds behavioral profiles — sentiment, intent, urgency, and personality traits — without interrupting the conversation flow.
          </p>
        </div>
      )}

      {tab === 'market' && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <Globe className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Market behavior signals are aggregated from ALIS (the client interaction layer) and reveal macro-level patterns in how the market is responding to Kangqore's services.
          </p>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : tab === 'shadow' ? (
        observations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-violet-300" />
            </div>
            <p className="text-sm font-semibold text-slate-300">No observations yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">Shadow Mode records behavioral insights as eQORE conversations happen.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {observations.map(obs => <ObservationCard key={obs.id} obs={obs} />)}
          </div>
        )
      ) : (
        marketSignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-blue-300" />
            </div>
            <p className="text-sm font-semibold text-slate-300">No market signals yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">Market behavior signals will appear here as ALIS interaction data flows in.</p>
          </div>
        ) : (
          <div className="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 rounded-xl overflow-hidden shadow-sm">
            {marketSignals.map(s => <MarketSignalRow key={s.id} signal={s} />)}
          </div>
        )
      )}
    </div>
  )
}
