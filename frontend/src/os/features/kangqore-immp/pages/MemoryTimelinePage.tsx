import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '@lib/api'
import { cn } from '@design-system/cn'
import {
  BookMarked, Brain, CheckCircle2, ChevronDown, ChevronUp, ChevronRight,
  Clock, Flame, Lightbulb, Loader2, Search, Shield, TrendingUp,
  ArrowRight, BarChart2, Zap, Target, Layers, AlertTriangle,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────

interface TimelineItem {
  id:         string
  _type:      'lesson' | 'insight' | 'principle' | 'policy' | 'pattern'
  domain:     string
  tier?:      string
  lesson?:    string
  insight?:   string
  statement?: string
  description?: string
  policyChange?: string
  confidence: number
  evidenceCount: number
  tags:       string[]
  createdAt:  string
}

interface ETIResult {
  overall:    number
  grade:      'A' | 'B' | 'C' | 'D' | 'F'
  dimensions: {
    predictionAccuracy:       { score: number; trend: string }
    decisionAccuracy:         { score: number; trend: string }
    outcomeSuccess:           { score: number; trend: string }
    recommendationAcceptance: { score: number; trend: string }
    calibrationDrift:         { score: number; trend: string }
    coverage:                 { score: number; trend: string }
    stability:                { score: number; trend: string }
    reliability:              { score: number; trend: string }
    simulationTrust:          null
  }
  snapshotAt: string
}

interface KnowledgeCoverageEntry {
  domain:         string
  coverage:       number
  evidenceCount:  number
  lessonCount:    number
  insightCount:   number
  principleCount: number
  playbookCount:  number
  maturityLevel:  string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TIER_COLOR: Record<string, string> = {
  STRATEGIC: '#b89eff', CRITICAL: '#e2445c', OPERATIONAL: '#579bfc', INFORMATIONAL: '#888',
}
const TREND_ICON: Record<string, string> = { IMPROVING: '↑', STABLE: '→', DRIFTING: '↓' }
const TREND_COLOR: Record<string, string> = { IMPROVING: '#00c875', STABLE: '#888', DRIFTING: '#e2445c' }
const MATURITY_COLOR: Record<string, string> = {
  MATURE: '#00c875', ESTABLISHED: '#579bfc', DEVELOPING: '#fdab3d', NASCENT: '#888',
}
const TYPE_ICON: Record<string, any> = {
  lesson: Lightbulb, insight: Brain, principle: Shield, policy: Flame, pattern: Layers,
}
const TYPE_LABEL: Record<string, string> = {
  lesson: 'Lesson', insight: 'Insight', principle: 'Principle', policy: 'Policy', pattern: 'Pattern',
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60)   return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function confColor(c: number) {
  if (c >= 0.85) return '#00c875'
  if (c >= 0.70) return '#fdab3d'
  return '#e2445c'
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ETIPanel({ eti }: { eti: ETIResult }) {
  const [expanded, setExpanded] = useState(false)
  const gradeColor = eti.overall >= 80 ? '#00c875' : eti.overall >= 60 ? '#fdab3d' : '#e2445c'

  const dims = [
    ['Prediction Accuracy',        eti.dimensions.predictionAccuracy],
    ['Decision Accuracy',          eti.dimensions.decisionAccuracy],
    ['Outcome Success',            eti.dimensions.outcomeSuccess],
    ['Recommendation Acceptance',  eti.dimensions.recommendationAcceptance],
    ['Calibration Drift',          eti.dimensions.calibrationDrift],
    ['Coverage',                   eti.dimensions.coverage],
    ['Stability',                  eti.dimensions.stability],
    ['Reliability',                eti.dimensions.reliability],
  ] as [string, { score: number; trend: string }][]

  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)]">
      <button className="w-full flex items-center justify-between px-5 py-4" onClick={() => setExpanded(p => !p)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black" style={{ background: gradeColor + '20', color: gradeColor }}>
            {eti.grade}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-[var(--os-text-1)]">Executive Trust Index</p>
            <p className="text-[11px] text-[var(--os-text-2)]">Overall: <span className="font-bold" style={{ color: gradeColor }}>{eti.overall}/100</span></p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-[var(--os-text-2)]" /> : <ChevronDown className="w-4 h-4 text-[var(--os-text-2)]" />}
      </button>

      {expanded && (
        <div className="border-t border-[var(--os-border)] px-5 py-4 space-y-2">
          {dims.map(([label, d]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-[11px] text-[var(--os-text-2)] w-52 flex-shrink-0">{label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[var(--os-border)] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: confColor(d.score / 100) }} />
              </div>
              <span className="text-[11px] font-bold tabular-nums w-8 text-right" style={{ color: confColor(d.score / 100) }}>{d.score}</span>
              <span className="text-[10px] w-4" style={{ color: TREND_COLOR[d.trend] ?? '#888' }}>{TREND_ICON[d.trend] ?? '→'}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 opacity-40">
            <span className="text-[11px] text-[var(--os-text-2)] w-52">Simulation Trust</span>
            <div className="flex-1 h-1.5 rounded-full bg-[var(--os-border)]" />
            <span className="text-[10px] text-[var(--os-text-2)] w-8 text-right">—</span>
            <span className="text-[9px] text-[var(--os-text-2)]">Reserved 6.7</span>
          </div>
        </div>
      )}
    </div>
  )
}

function KnowledgeCoverageBar({ domains }: { domains: KnowledgeCoverageEntry[] }) {
  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-[#b89eff]" />
        <h3 className="text-sm font-semibold text-[var(--os-text-1)]">Knowledge Coverage</h3>
        <span className="ml-auto text-[10px] text-[var(--os-text-2)]">How much WAANDA has learned per domain</span>
      </div>
      <div className="space-y-2.5">
        {domains.map(d => {
          const matColor = MATURITY_COLOR[d.maturityLevel] ?? '#888'
          const filledBlocks = Math.round(d.coverage / 10)
          return (
            <div key={d.domain} className="flex items-center gap-3">
              <span className="text-[11px] text-[var(--os-text-2)] w-24 capitalize flex-shrink-0">{d.domain}</span>
              <div className="flex gap-0.5 flex-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-3 rounded-sm"
                    style={{ background: i < filledBlocks ? matColor : 'var(--os-border)' }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold w-8 text-right" style={{ color: matColor }}>{d.coverage}%</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: matColor + '15', color: matColor }}>{d.maturityLevel}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TimelineItemCard({ item }: { item: TimelineItem }) {
  const [expanded, setExpanded] = useState(false)
  const Icon      = TYPE_ICON[item._type] ?? Lightbulb
  const label     = TYPE_LABEL[item._type] ?? item._type
  const tierColor = TIER_COLOR[item.tier ?? ''] ?? '#888'
  const content   = item.lesson ?? item.insight ?? item.statement ?? item.description ?? ''

  return (
    <div className={cn('rounded-2xl border bg-[var(--os-card)] transition-all', expanded ? 'border-[var(--os-border)]/80' : 'border-[var(--os-border)]')}>
      <div className="flex items-start gap-3 p-3 cursor-pointer" onClick={() => setExpanded(p => !p)}>
        <div className="w-7 h-7 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: tierColor + '18' }}>
          <Icon className="w-3.5 h-3.5" style={{ color: tierColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: tierColor + '20', color: tierColor }}>{label}</span>
            <span className="text-[9px] text-[var(--os-text-2)] capitalize">{item.domain}</span>
            {item.tier && <span className="text-[9px] text-[var(--os-text-2)]">· {item.tier}</span>}
          </div>
          <p className="text-xs text-[var(--os-text-1)] line-clamp-2">{content}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-10 h-1 rounded-full bg-[var(--os-border)] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.round(item.confidence * 100)}%`, background: confColor(item.confidence) }} />
            </div>
            <span className="text-[9px] font-bold" style={{ color: confColor(item.confidence) }}>{Math.round(item.confidence * 100)}%</span>
          </div>
          <span className="text-[9px] text-[var(--os-text-2)]">{timeAgo(item.createdAt)}</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[var(--os-border)] px-3 py-2.5 space-y-2">
          <p className="text-[11px] text-[var(--os-text-1)]">{content}</p>
          {item.policyChange && (
            <div className="flex items-start gap-1.5">
              <Flame className="w-3 h-3 text-[#fdab3d] flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#fdab3d]">Policy implication: {item.policyChange}</p>
            </div>
          )}
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map(t => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--os-border)] text-[var(--os-text-2)]">{t}</span>
              ))}
            </div>
          )}
          <p className="text-[10px] text-[var(--os-text-2)]">{item.evidenceCount} observation{item.evidenceCount !== 1 ? 's' : ''} · confidence {Math.round(item.confidence * 100)}%</p>
        </div>
      )}
    </div>
  )
}

// ── Search Panel ───────────────────────────────────────────────────────────────

function MemorySearchPanel() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')

  const { data, isLoading } = useQuery({
    queryKey:  ['memory-search', submitted],
    queryFn:   () => apiFetch(`/admin/kangqore-immp/cognition/memory/search?q=${encodeURIComponent(submitted)}`),
    enabled:   submitted.length >= 3,
    staleTime: 60_000,
  })

  const results: any[] = (data as any)?.results ?? []

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--os-text-2)]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setSubmitted(query)}
            placeholder="Search enterprise memory… (e.g. pricing, sales, delivery)"
            className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] outline-none focus:border-[color:var(--os-blue)]"
          />
        </div>
        <button
          onClick={() => setSubmitted(query)}
          className="px-3 py-2 text-[11px] bg-[color:var(--os-blue)] text-white rounded-2xl hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </div>

      {isLoading && <div className="flex items-center gap-2 text-[var(--os-text-2)] text-sm"><Loader2 className="w-3.5 h-3.5 animate-spin" />Searching memory…</div>}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map(r => (
            <div key={r.id} className="flex items-start gap-2 p-2.5 rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)]">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#b89eff]/15 text-[#b89eff] capitalize">{r.type}</span>
              <div className="flex-1">
                <p className="text-[11px] text-[var(--os-text-1)]">{r.content}</p>
                <p className="text-[10px] text-[var(--os-text-2)]">{r.domain} · {Math.round(r.confidence * 100)}% confidence</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {submitted && !isLoading && results.length === 0 && (
        <p className="text-sm text-[var(--os-text-2)] text-center py-4">No memory matches found. Record more decision outcomes to build enterprise memory.</p>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type Lens = 'Strategic' | 'Operational' | 'Learning' | 'Evolution'
type Window = 'today' | 'yesterday' | 'week' | 'month'

export function MemoryTimelinePage() {
  const [lens, setLens]     = useState<Lens>('Learning')
  const [window_, setWindow] = useState<Window>('week')
  const [activeTab, setActiveTab] = useState<'timeline' | 'eti' | 'search' | 'knowledge'>('timeline')

  const { data: timelineData, isLoading: timelineLoading } = useQuery({
    queryKey:  ['memory-timeline', window_, lens],
    queryFn:   () => apiFetch(`/admin/kangqore-immp/cognition/memory/timeline?window=${window_}&lens=${lens}`),
    staleTime: 60_000,
  })

  const { data: etiData, isLoading: etiLoading } = useQuery({
    queryKey:  ['cognition-eti'],
    queryFn:   () => apiFetch('/admin/kangqore-immp/cognition/eti'),
    staleTime: 60_000,
  })

  const items:    TimelineItem[] = (timelineData as any)?.items ?? []
  const eti:      ETIResult | null = (etiData as any)?.eti ?? null
  const coverage: KnowledgeCoverageEntry[] = (etiData as any)?.coverage?.domains ?? []

  const lenses: Lens[] = ['Strategic', 'Operational', 'Learning', 'Evolution']
  const windows: { key: Window; label: string }[] = [
    { key: 'today',     label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'week',      label: 'This Week' },
    { key: 'month',     label: 'This Month' },
  ]

  const tabs = [
    { key: 'timeline',  label: 'Memory Timeline', icon: Clock },
    { key: 'eti',       label: 'Trust Index',     icon: Shield },
    { key: 'knowledge', label: 'Knowledge Tree',  icon: Layers },
    { key: 'search',    label: 'Search Memory',   icon: Search },
  ] as const

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--os-text-1)]">Enterprise Memory</h1>
        <p className="text-sm text-[var(--os-text-2)] mt-0.5">Phase 6.4 — Enterprise Cognition Layer · append-only, forward-only</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 border-b border-[var(--os-border)]">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-all',
              activeTab === t.key ? 'border-os-blue text-os-blue' : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Memory Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            {/* Window */}
            <div className="flex items-center gap-1 bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-0.5">
              {windows.map(w => (
                <button
                  key={w.key}
                  onClick={() => setWindow(w.key)}
                  className={cn('px-3 py-1 text-[11px] font-semibold rounded-2xl transition-all', window_ === w.key ? 'bg-[color:var(--os-blue)] text-white' : 'text-[var(--os-text-2)] hover:text-[var(--os-text-1)]')}
                >{w.label}</button>
              ))}
            </div>
            {/* Lens */}
            <div className="flex items-center gap-1 flex-wrap">
              {lenses.map(l => (
                <button
                  key={l}
                  onClick={() => setLens(l)}
                  className={cn('px-3 py-1 text-[11px] font-medium rounded-full border transition-all',
                    lens === l ? 'border-[color:var(--os-blue)] bg-[color:var(--os-blue)]/10 text-[color:var(--os-blue)]' : 'border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
                  )}
                >{l}</button>
              ))}
            </div>
          </div>

          {timelineLoading ? (
            <div className="flex items-center gap-2 text-[var(--os-text-2)] text-sm py-10 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />Retrieving enterprise memory…
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Brain className="w-10 h-10 text-[var(--os-text-2)] mx-auto" />
              <p className="text-sm text-[var(--os-text-2)]">No {lens} entries in this window.</p>
              <p className="text-[11px] text-[var(--os-text-2)]">Record decision outcomes to build enterprise cognition.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map(item => <TimelineItemCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      )}

      {/* ETI Panel */}
      {activeTab === 'eti' && (
        <div className="space-y-4">
          {etiLoading ? (
            <div className="flex items-center gap-2 text-[var(--os-text-2)] text-sm py-10 justify-center"><Loader2 className="w-4 h-4 animate-spin" /></div>
          ) : eti ? (
            <>
              <ETIPanel eti={eti} />
              {coverage.length > 0 && <KnowledgeCoverageBar domains={coverage} />}
            </>
          ) : (
            <div className="text-center py-10">
              <Shield className="w-10 h-10 text-[var(--os-text-2)] mx-auto mb-3" />
              <p className="text-sm text-[var(--os-text-2)]">No ETI data yet. Approve and record outcomes on decisions to build the Trust Index.</p>
            </div>
          )}
        </div>
      )}

      {/* Knowledge Tree */}
      {activeTab === 'knowledge' && <KnowledgeTreePanel />}

      {/* Search */}
      {activeTab === 'search' && <MemorySearchPanel />}
    </div>
  )
}

// ── Knowledge Tree Panel ───────────────────────────────────────────────────────

const DOMAINS = ['sales', 'delivery', 'finance', 'market', 'operations', 'people', 'product', 'risk']

function KnowledgeTreePanel() {
  const [domain, setDomain] = useState('sales')

  const { data, isLoading } = useQuery({
    queryKey:  ['knowledge-tree', domain],
    queryFn:   () => apiFetch(`/admin/kangqore-immp/cognition/knowledge/${domain}`),
    staleTime: 30_000,
  })

  const tree = data as any

  const levels = [
    { key: 'evidence',     label: 'Evidence',     color: '#888',    items: tree?.evidence },
    { key: 'observations', label: 'Observations',  color: '#579bfc', items: tree?.observations },
    { key: 'lessons',      label: 'Lessons',       color: '#fdab3d', items: tree?.lessons },
    { key: 'insights',     label: 'Insights',      color: '#b89eff', items: tree?.insights },
    { key: 'patterns',     label: 'Patterns',      color: '#60a5fa', items: tree?.patterns },
    { key: 'principles',   label: 'Principles',    color: '#00c875', items: tree?.principles },
    { key: 'playbooks',    label: 'Playbooks',     color: '#f97316', items: tree?.playbooks },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {DOMAINS.map(d => (
          <button
            key={d}
            onClick={() => setDomain(d)}
            className={cn('px-3 py-1 text-[11px] font-medium rounded-full border capitalize transition-all',
              domain === d ? 'border-[color:var(--os-blue)] bg-[color:var(--os-blue)]/10 text-[color:var(--os-blue)]' : 'border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            )}
          >{d}</button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-4 h-4 animate-spin text-[var(--os-text-2)]" /></div>
      ) : (
        <div className="space-y-3">
          {levels.map(level => {
            const count = Array.isArray(level.items) ? level.items.length : 0
            const filled = Math.min(10, count)
            return (
              <div key={level.key} className="flex items-center gap-3">
                <span className="text-[11px] text-[var(--os-text-2)] w-28">{level.label}</span>
                <div className="flex gap-0.5 flex-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="flex-1 h-4 rounded-sm" style={{ background: i < filled ? level.color : 'var(--os-border)' }} />
                  ))}
                </div>
                <span className="text-[11px] font-bold tabular-nums w-6 text-right" style={{ color: count > 0 ? level.color : '#888' }}>{count}</span>
              </div>
            )
          })}
          <p className="text-[10px] text-[var(--os-text-2)] pt-2">Each block represents one artifact. Knowledge accumulates as decisions are recorded and outcomes observed.</p>
        </div>
      )}
    </div>
  )
}
