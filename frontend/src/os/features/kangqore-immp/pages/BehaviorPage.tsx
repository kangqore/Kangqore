import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  UserCheck, RefreshCw, ChevronDown, ChevronUp,
  Eye, Globe, TrendingUp, AlertCircle, MessageSquare, Clock,
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
  POSITIVE:  'text-green-700 bg-green-50 border-green-200',
  NEUTRAL:   'text-[var(--os-text-2)] bg-[var(--os-surface-0)] border-[var(--os-border)]',
  NEGATIVE:  'text-red-700 bg-red-50 border-red-200',
  MIXED:     'text-amber-700 bg-amber-50 border-amber-200',
}

const URGENCY_BADGE: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  HIGH:   'danger',
  MEDIUM: 'warning',
  LOW:    'neutral',
}

const SEVERITY_COLOR: Record<string, string> = {
  HIGH:     '#e2445c',
  CRITICAL: '#e2445c',
  MEDIUM:   '#fdab3d',
  LOW:      '#579bfc',
  INFO:     '#579bfc',
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
    <div className="p-6 space-y-4 transition-transform hover:-translate-y-1" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0">
          <Eye className="w-5 h-5 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0 mt-0.5">
          <div className="flex items-center gap-3 flex-wrap">
            {obs.leadName && (
              <p className="text-base font-bold text-[var(--os-text-1)]">{obs.leadName}</p>
            )}
            <span className={`text-[11px] font-bold px-2 py-1 rounded-md border ${sentColor}`}>
              {obs.sentiment}
            </span>
            <Badge variant={urgencyBadge} size="sm">Urgency: {obs.urgency}</Badge>
            <span className="text-[11px] font-bold text-[var(--os-text-2)] ml-auto flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/>{formatRelative(obs.createdAt)}</span>
          </div>
          <p className="text-xs font-bold text-[var(--os-text-2)] mt-1.5">Intent: <span className="text-[var(--os-text-1)]">{obs.intent}</span></p>
        </div>
      </div>

      <p className="text-sm font-medium text-[var(--os-text-1)] leading-relaxed ml-14">{obs.summary}</p>

      {obs.traits?.length > 0 && (
        <div className="ml-14 flex flex-wrap gap-2">
          {obs.traits.map((t, i) => (
            <span key={i} className="text-[11px] font-bold px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700">
              {t}
            </span>
          ))}
        </div>
      )}

      {obs.recommendation && expanded && (
        <div className="ml-14 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 mt-2 shadow-[0_8px_16px_rgba(59,130,246,0.08)]">
          <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-blue-900 leading-relaxed">{obs.recommendation}</p>
        </div>
      )}

      {obs.recommendation && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="ml-14 flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:text-blue-800 transition-colors mt-2"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {expanded ? 'Hide recommendation' : 'Show recommendation'}
        </button>
      )}
    </div>
  )
}

// ─── Market signal row ────────────────────────────────────────────────────────

function MarketSignalRow({ signal }: { signal: MarketSignal }) {
  const signalColor = SEVERITY_COLOR[signal.severity?.toUpperCase()] ?? '#579bfc'
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[var(--os-border)] last:border-0 hover:bg-[var(--os-surface-0)] transition-colors px-6">
      <div className="w-1.5 self-stretch rounded-full flex-shrink-0 mt-1 shadow-sm" style={{ background: signalColor }} />
      <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: signalColor }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--os-text-1)] leading-snug">{signal.signalValue}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider">{signal.signalType.replace(/_/g, ' ')}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--os-border)]" />
          <span className="text-[11px] font-bold text-[var(--os-text-2)]">{signal.confidence}% confidence</span>
        </div>
      </div>
      <span className="text-[11px] font-bold text-[var(--os-text-2)] flex-shrink-0 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/>{formatRelative(signal.createdAt)}</span>
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
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 mb-1 border-b border-[var(--os-border)]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <UserCheck className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[var(--os-text-1)]">Behavior Intelligence</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">
            Stakeholder behavioral analysis from live conversations, plus market-level behavior signals.
          </p>
        </div>
        <button
          onClick={refresh}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--os-text-2)] bg-[var(--os-surface-0)] border border-[var(--os-border)] hover:text-[var(--os-text-1)] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tab switcher */}
      <div className="border-b border-[var(--os-border)] mb-6 flex gap-4">
        {([
          { key: 'shadow', label: `Shadow Observations (${observations.length})`, icon: Eye },
          { key: 'market', label: `Market Behavior (${marketSignals.length})`,    icon: Globe },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`flex items-center gap-2 px-2 py-3 text-sm font-bold border-b-2 -mb-px transition-all ${
              tab === t.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:border-[var(--os-border)]'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* What is this */}
      {tab === 'shadow' && (
        <div className="flex items-start gap-4 bg-violet-50/50 rounded-3xl p-6 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0 shadow-sm">
            <MessageSquare className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-sm font-medium text-violet-900 leading-relaxed pt-1">
            KIMMP Shadow Mode passively observes eQORE conversations and builds behavioral profiles — sentiment, intent, urgency, and personality traits — without interrupting the conversation flow.
          </p>
        </div>
      )}

      {tab === 'market' && (
        <div className="flex items-start gap-4 bg-blue-50/50 rounded-3xl p-6 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-blue-900 leading-relaxed pt-1">
            Market behavior signals are aggregated from ALIS (the client interaction layer) and reveal macro-level patterns in how the market is responding to Kangqore's services.
          </p>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : tab === 'shadow' ? (
        observations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[var(--os-card)] shadow-[0_32px_64px_rgba(0,0,0,0.04)] text-center" style={{ borderRadius: 'var(--os-radius-xl)' }}>
            <div className="w-16 h-16 rounded-3xl bg-violet-50 flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-violet-400" />
            </div>
            <p className="text-lg font-bold text-[var(--os-text-1)]">No observations yet</p>
            <p className="text-sm font-semibold text-[var(--os-text-2)] mt-2 max-w-xs">Shadow Mode records behavioral insights as eQORE conversations happen.</p>
          </div>
        ) : (
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-4">
              Observations
            </h3>
            <div className="space-y-6">
              {observations.map(obs => <ObservationCard key={obs.id} obs={obs} />)}
            </div>
          </div>
        )
      ) : (
        marketSignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[var(--os-card)] shadow-[0_32px_64px_rgba(0,0,0,0.04)] text-center" style={{ borderRadius: 'var(--os-radius-xl)' }}>
            <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-lg font-bold text-[var(--os-text-1)]">No market signals yet</p>
            <p className="text-sm font-semibold text-[var(--os-text-2)] mt-2 max-w-xs">Market behavior signals will appear here as ALIS interaction data flows in.</p>
          </div>
        ) : (
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-4">
              Market Signals
            </h3>
            <div className="overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.04)] bg-[var(--os-card)]" style={{ borderRadius: 'var(--os-radius-xl)' }}>
              {marketSignals.map(s => <MarketSignalRow key={s.id} signal={s} />)}
            </div>
          </div>
        )
      )}
    </div>
  )
}
