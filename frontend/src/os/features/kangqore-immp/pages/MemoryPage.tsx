import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Brain, Check, RotateCcw, TrendingUp, AlertTriangle,
  Lightbulb, Zap, Target, BookOpen, Database, Award,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'
import { useKIMMPStore, type InsightCategory, type MemoryEntry } from '@store/kimmp'

const CATEGORY_CONFIG: Record<InsightCategory, {
  label: string
  color: string
  bg: string
  Icon: React.FC<{ className?: string }>
}> = {
  revenue:     { label: 'Revenue',     color: 'text-[#00c875]', bg: 'bg-[#00c875]', Icon: ({ className }) => <TrendingUp    className={className ?? 'w-3.5 h-3.5'} /> },
  risk:        { label: 'Risk',        color: 'text-[#e2445c]', bg: 'bg-[#e2445c]', Icon: ({ className }) => <AlertTriangle className={className ?? 'w-3.5 h-3.5'} /> },
  opportunity: { label: 'Opportunity', color: 'text-[#0073ea]', bg: 'bg-[#0073ea]', Icon: ({ className }) => <Lightbulb     className={className ?? 'w-3.5 h-3.5'} /> },
  ops:         { label: 'Operations',  color: 'text-[#fdab3d]', bg: 'bg-[#fdab3d]', Icon: ({ className }) => <Zap           className={className ?? 'w-3.5 h-3.5'} /> },
  talent:      { label: 'Talent',      color: 'text-[#7f53f9]', bg: 'bg-[#7f53f9]', Icon: ({ className }) => <Target        className={className ?? 'w-3.5 h-3.5'} /> },
}

const QUALITY_ICONS: Record<string, React.FC<{ size?: number }>> = {
  mined:       ({ size }) => <Zap        size={size ?? 14} />,
  synthetic:   ({ size }) => <Lightbulb  size={size ?? 14} />,
  operational: ({ size }) => <TrendingUp size={size ?? 14} />,
  approved:    ({ size }) => <Award      size={size ?? 14} />,
}

const QUALITY_COLORS: Record<string, string> = {
  mined: '#f59e0b', synthetic: '#7c3aed', operational: '#2564ea', approved: '#10b981',
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function MemoryEntryRow({ entry }: { entry: MemoryEntry }) {
  const config = CATEGORY_CONFIG[entry.signalCategory]
  return (
    <div className="flex items-start gap-4 p-6 transition-transform hover:-translate-y-1" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 16px 32px rgba(0,0,0,0.04)' }}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${config.bg} text-white`}>
        <config.Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--os-text-1)] leading-tight">{entry.signalTitle}</p>
        {entry.note && <p className="text-xs text-[var(--os-text-2)] mt-1">{entry.note}</p>}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="neutral" size="sm">{config.label}</Badge>
          <span className="text-[10px] text-[var(--os-text-2)] font-semibold">{formatTimestamp(entry.timestamp)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 bg-green-50/50 px-3 py-1.5 rounded-full">
          <Check className="w-3.5 h-3.5" />
          {entry.action === 'acted' ? 'Acted' : 'Acknowledged'}
        </div>
      </div>
    </div>
  )
}

interface LearningExample {
  id: string
  source: string
  agentSystem: string
  quality: number
  approved: boolean
  createdAt: string
  userMessage: string
}

interface CorpusStats {
  total: number
  approved: number
  graduationThreshold: number
  graduationPct: number
  examplesPerDay: number
  daysToGraduation: number | null
  qualityBands: { mined: number; synthetic: number; operational: number; approved: number }
  recentExamples: LearningExample[]
}

export function MemoryPage() {
  const { memoryEntries, acknowledgedIds, unacknowledgeSignal, insights } = useKIMMPStore()
  const [view, setView] = useState<'log' | 'patterns' | 'corpus'>('log')

  const acknowledgedSignals = insights.filter(i => acknowledgedIds.includes(i.id))

  const { data: examplesData, isLoading: loadingExamples } = useQuery({
    queryKey: ['learning-examples'],
    queryFn: () => api.get('/admin/kangqore-immp/learning/examples?approved=true&limit=20').then(r => r.data),
    enabled: view === 'patterns',
    staleTime: 60_000,
  })

  const { data: corpusData, isLoading: loadingCorpus } = useQuery<CorpusStats>({
    queryKey: ['foundation-model-status'],
    queryFn: () => api.get('/admin/kangqore-immp/foundation-model/status').then(r => r.data),
    enabled: view === 'corpus',
    staleTime: 30_000,
  })

  const livePatterns: LearningExample[] = examplesData?.examples ?? examplesData ?? []

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 mb-1 border-b border-[var(--os-border)]">
        <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-shrink-0 shadow-lg">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[var(--os-text-1)]">KIMMP Memory</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">
            What KIMMP has learned about your business — and what you've actioned.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 w-fit mb-6">
        {([
          { key: 'log',      label: `Action Log (${memoryEntries.length})` },
          { key: 'patterns', label: 'Learned Patterns' },
          { key: 'corpus',   label: 'Training Corpus' },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              view === t.key
                ? 'text-white'
                : 'bg-[var(--os-card)] text-[var(--os-text-2)] shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:text-[var(--os-text-1)]'
            }`}
            style={view === t.key ? { background: 'linear-gradient(135deg, #7c3aed 0%, #2564ea 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Action Log */}
      {view === 'log' && (
        <div className="space-y-6">
          {acknowledgedSignals.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Currently Acknowledged ({acknowledgedSignals.length})
              </h3>
              <div className="space-y-3">
                {acknowledgedSignals.map(signal => (
                  <div key={signal.id} className="flex items-center gap-4 p-5 transition-transform hover:-translate-y-1" style={{ background: 'rgba(34,197,94,0.06)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 16px 32px rgba(34,197,94,0.1)' }}>
                    <div className="w-8 h-8 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="flex-1 text-sm font-bold text-[var(--os-text-2)] line-through opacity-70">{signal.title}</p>
                    <Badge variant="neutral" size="sm">{signal.module}</Badge>
                    <button
                      onClick={() => unacknowledgeSignal(signal.id)}
                      title="Restore to active signals"
                      className="w-8 h-8 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all bg-white shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              Action History
            </h3>
            {memoryEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#7c3aed20', color: '#7c3aed' }}>
                  <Brain className="w-6 h-6 text-[#7c3aed]" />
                </div>
                <p className="text-base font-bold text-[var(--os-text-1)]">No actions recorded yet</p>
                <p className="text-sm text-[var(--os-text-2)] mt-1.5 max-w-xs">
                  When you acknowledge a signal on the Intelligence tab, KIMMP logs it here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {memoryEntries.map(entry => <MemoryEntryRow key={entry.id} entry={entry} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Learned Patterns — live from /learning/examples?approved=true */}
      {view === 'patterns' && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--os-text-2)]">
            Approved examples from the KIMMP learning corpus — patterns WAANDA has validated and uses to improve signal generation.
          </p>
          {loadingExamples && <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]"><Spinner size="sm" /> Loading patterns…</div>}
          {!loadingExamples && livePatterns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)' }}>
              <Database size={32} style={{ color: '#7c3aed', marginBottom: 12 }} />
              <p className="text-base font-bold text-[var(--os-text-1)]">No approved patterns yet</p>
              <p className="text-sm text-[var(--os-text-2)] mt-1.5 max-w-xs">
                Approve examples in the Training tab to build the pattern library.
              </p>
            </div>
          )}
          {livePatterns.map(ex => {
            const qColor = ex.quality >= 0.95 ? QUALITY_COLORS.approved
              : ex.quality >= 0.8 ? QUALITY_COLORS.operational
              : ex.quality >= 0.6 ? QUALITY_COLORS.synthetic
              : QUALITY_COLORS.mined
            const QIcon = ex.quality >= 0.95 ? QUALITY_ICONS.approved
              : ex.quality >= 0.8 ? QUALITY_ICONS.operational
              : ex.quality >= 0.6 ? QUALITY_ICONS.synthetic
              : QUALITY_ICONS.mined
            return (
              <div key={ex.id} style={{ background: qColor + '10', borderRadius: 'var(--os-radius-xl)', padding: '20px 24px', boxShadow: `0 16px 32px ${qColor}15` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: qColor + '25', color: qColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <QIcon size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ex.userMessage?.slice(0, 120) ?? ex.agentSystem}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: qColor, background: qColor + '20', padding: '2px 8px', borderRadius: 20 }}>
                        q={ex.quality.toFixed(2)}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--os-text-2)' }}>{ex.source}</span>
                      <span style={{ fontSize: 10, color: 'var(--os-text-2)' }}>{ex.agentSystem}</span>
                      <span style={{ fontSize: 10, color: 'var(--os-text-2)', marginLeft: 'auto' }}>
                        {new Date(ex.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Training Corpus */}
      {view === 'corpus' && (
        <div className="space-y-6">
          {loadingCorpus && <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]"><Spinner size="sm" /> Loading corpus stats…</div>}
          {corpusData && (
            <>
              {/* Graduation progress */}
              <div style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', padding: 24, boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Award size={16} style={{ color: '#7c3aed' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>
                    WAANDA Foundation Model — Graduation Progress
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800, color: '#7c3aed' }}>
                    {corpusData.total.toLocaleString()} / {corpusData.graduationThreshold.toLocaleString()} examples
                  </span>
                </div>
                <div style={{ height: 10, background: 'var(--os-border)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${corpusData.graduationPct}%`, background: 'linear-gradient(90deg, #7c3aed, #2564ea)', borderRadius: 99, transition: 'width .6s ease' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{corpusData.graduationPct}% to graduation</span>
                  {corpusData.daysToGraduation != null
                    ? <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>~{corpusData.daysToGraduation}d at {corpusData.examplesPerDay}/day</span>
                    : <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>Run a learning cycle to get velocity estimate</span>
                  }
                </div>
              </div>

              {/* Quality bands */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3">Quality Distribution</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {(Object.entries(corpusData.qualityBands) as [string, number][]).map(([band, count]) => {
                    const col = QUALITY_COLORS[band] ?? '#888'
                    const Icon = QUALITY_ICONS[band]
                    const labels: Record<string, string> = { mined: 'Mined (0.5)', synthetic: 'Synthetic (0.7)', operational: 'Operational (0.9)', approved: 'Approved (1.0)' }
                    return (
                      <div key={band} style={{ background: col + '12', borderRadius: 12, padding: '16px 20px', border: `1px solid ${col}25` }}>
                        <div style={{ color: col, marginBottom: 8 }}><Icon size={16} /></div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{count}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-2)', marginTop: 4 }}>{labels[band]}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent examples */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3">Recent Examples</h3>
                <div style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', overflow: 'hidden' }}>
                  {(corpusData.recentExamples ?? []).map((ex: LearningExample, i: number) => {
                    const qColor = ex.quality >= 0.95 ? QUALITY_COLORS.approved : ex.quality >= 0.8 ? QUALITY_COLORS.operational : ex.quality >= 0.6 ? QUALITY_COLORS.synthetic : QUALITY_COLORS.mined
                    return (
                      <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < (corpusData.recentExamples.length - 1) ? '1px solid var(--os-border)' : 'none' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: qColor, background: qColor + '18', padding: '2px 7px', borderRadius: 20, flexShrink: 0 }}>
                          {ex.quality.toFixed(2)}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--os-text-1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ex.userMessage?.slice(0, 80) ?? ex.agentSystem}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--os-text-2)', flexShrink: 0 }}>{ex.source}</span>
                        {ex.approved && <span style={{ fontSize: 10, color: '#10b981', background: '#10b98118', padding: '1px 6px', borderRadius: 8 }}>approved</span>}
                      </div>
                    )
                  })}
                  {(corpusData.recentExamples ?? []).length === 0 && (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--os-text-2)', fontSize: 13 }}>
                      No examples yet — run a learning cycle from the Gen 2 Training page.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
