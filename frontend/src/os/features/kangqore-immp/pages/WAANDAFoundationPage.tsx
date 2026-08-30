import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Brain, Download, RefreshCw, TrendingUp, Award, Zap, Lightbulb, Database, FlaskConical, Layers, CheckCircle2 } from 'lucide-react'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LearningExample {
  id: string
  source: string
  agentSystem: string
  quality: number
  approved: boolean
  createdAt: string
  userMessage: string
}

interface FoundationStatus {
  total: number
  approved: number
  graduationThreshold: number
  graduationPct: number
  examplesPerDay: number
  daysToGraduation: number | null
  qualityBands: { mined: number; synthetic: number; operational: number; approved: number }
  recentExamples: LearningExample[]
  recentRuns: Array<{ id: string; startedAt: string; totalExamples?: number; status?: string }>
}

// ─── Generation timeline ──────────────────────────────────────────────────────

const GENERATIONS = [
  {
    gen: 1,
    name: 'Orchestrates Claude',
    color: '#3b82f6',
    status: 'live' as const,
    desc: 'KIMMP routes enterprise context → Claude Sonnet for reasoning. Every interaction is also training data collection for Gen 2+.',
    detail: 'Running in production. Generates ~2–8 examples/day from live WAANDA sessions.',
  },
  {
    gen: 2,
    name: 'Local Llama (Krisnam)',
    color: '#7c3aed',
    status: 'live' as const,
    desc: 'Llama 3.2-3B via MLX on port 11435. REASON phase uses it before falling back to Claude.',
    detail: 'Active on this machine. Lightweight inference for pattern classification and signal pre-processing.',
  },
  {
    gen: 3,
    name: 'Cognitive Engine',
    color: '#f59e0b',
    status: 'roadmap' as const,
    desc: 'WAANDA reasons natively — no API dependency for core decisions. Trained on 1,000+ approved examples from Gen 1 corpus.',
    detail: 'Requires graduation threshold (1,000 examples). Currently building corpus.',
  },
  {
    gen: 4,
    name: 'WAANDA Foundation Model',
    color: '#10b981',
    status: 'future' as const,
    desc: 'Purpose-built foundation model for enterprise intelligence. Distilled from Gen 3, fine-tuned on enterprise-specific reasoning patterns.',
    detail: 'Long-horizon goal. Defined by WAANDA Evolution Roadmap. Requires Gen 3 validation first.',
  },
]

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  live:    { label: 'Live',    color: '#10b981' },
  roadmap: { label: 'Roadmap', color: '#f59e0b' },
  future:  { label: 'Future',  color: '#888' },
}

const QUALITY_META: Record<string, { label: string; color: string; Icon: React.FC<{ size?: number }> }> = {
  mined:       { label: 'Mined (0.5)',       color: '#f59e0b', Icon: ({ size }) => <Zap       size={size ?? 14} /> },
  synthetic:   { label: 'Synthetic (0.7)',   color: '#7c3aed', Icon: ({ size }) => <Lightbulb size={size ?? 14} /> },
  operational: { label: 'Operational (0.9)', color: '#2564ea', Icon: ({ size }) => <TrendingUp size={size ?? 14} /> },
  approved:    { label: 'Approved (1.0)',    color: '#10b981', Icon: ({ size }) => <Award      size={size ?? 14} /> },
}

// ─── S78 types ───────────────────────────────────────────────────────────────

interface FMScan {
  id: string
  qualityThreshold: number
  totalScanned: number
  totalIncluded: number
  byPhase: Record<string, number>
  scanAt: string
}

interface FMStatus {
  latestScan: FMScan | null
  totalIncludedExamples: number
  evals: Array<{ id: string; modelCandidate: string; overallScore?: number; evalDate: string; notes?: string }>
}

interface FMExample {
  id: string
  phase: string
  prompt: string
  quality: number
  sourceType: string
  included: boolean
  createdAt: string
}

const PHASE_COLORS: Record<string, string> = {
  REASON:  '#3b82f6',
  DECIDE:  '#7c3aed',
  PLAN:    '#f59e0b',
  EXECUTE: '#10b981',
  LEARN:   '#ef4444',
}

const ARCH_MODELS = [
  { name: 'Mistral 7B',    params: '7B',  arch: 'Decoder-only', strength: 'Fast inference, strong reasoning', context: '32K', license: 'Apache 2.0' },
  { name: 'Llama 3.1 8B',  params: '8B',  arch: 'Decoder-only', strength: 'Best-in-class at scale, RLHF-tuned', context: '128K', license: 'Meta' },
  { name: 'Llama 3.1 13B', params: '13B', arch: 'Decoder-only', strength: 'Enterprise reasoning, slower but richer', context: '128K', license: 'Meta' },
  { name: 'Qwen2 7B',      params: '7B',  arch: 'Decoder-only', strength: 'Multilingual, code-heavy', context: '32K', license: 'Apache 2.0' },
]

// ─── Generation card ──────────────────────────────────────────────────────────

function GenCard({ g }: { g: typeof GENERATIONS[number] }) {
  const { label, color: statusColor } = STATUS_LABELS[g.status]
  return (
    <div style={{
      background: g.color + '0c', border: `1.5px solid ${g.color}25`,
      borderRadius: 14, padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: g.color + '20', color: g.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 900 }}>
          {g.gen}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--os-text-1)' }}>{g.name}</div>
          <span style={{ fontSize: 10, fontWeight: 700, color: statusColor, background: statusColor + '18', padding: '1px 8px', borderRadius: 20 }}>
            {label}
          </span>
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--os-text-1)', lineHeight: 1.6, marginBottom: 8 }}>{g.desc}</p>
      <p style={{ fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.5 }}>{g.detail}</p>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function WAANDAFoundationPage() {
  const [exporting, setExporting] = useState(false)
  const [fmTab, setFmTab] = useState<'examples' | 'evals' | 'arch'>('examples')
  const qc = useQueryClient()

  // Gen1 corpus
  const { data, isLoading, refetch } = useQuery<FoundationStatus>({
    queryKey: ['foundation-model-status'],
    queryFn: () => api.get('/admin/kangqore-immp/foundation-model/status').then(r => r.data),
    staleTime: 30_000,
  })

  // S78 WAANDA-FM
  const { data: fmStatus, refetch: refetchFM } = useQuery<FMStatus>({
    queryKey: ['waanda-fm-status'],
    queryFn: () => api.get('/admin/bids/waanda-fm/status').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })
  const { data: fmExamples } = useQuery<{ examples: FMExample[] }>({
    queryKey: ['waanda-fm-examples'],
    queryFn: () => api.get('/admin/bids/waanda-fm/examples?limit=20').then(r => r.data).catch(() => ({ examples: [] })),
    staleTime: 60_000,
  })
  const { mutate: runCuration, isPending: curating } = useMutation({
    mutationFn: () => api.post('/admin/bids/waanda-fm/curate').then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['waanda-fm-status'] }); qc.invalidateQueries({ queryKey: ['waanda-fm-examples'] }) },
  })

  const { mutate: runLearning, isPending: runningLearning } = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/learning/run').then(r => r.data),
    onSuccess: () => {
      setTimeout(() => { qc.invalidateQueries({ queryKey: ['foundation-model-status'] }) }, 3000)
    },
  })

  async function exportJSONL() {
    setExporting(true)
    try {
      const res = await api.get('/admin/kangqore-immp/learning/export', { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `waanda-corpus-${new Date().toISOString().slice(0, 10)}.jsonl`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  const pct = data?.graduationPct ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 20, borderBottom: '1px solid var(--os-border)' }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}>
          <Brain size={16} style={{ color: '#fff' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--os-text-1)' }}>WAANDA Foundation Model</div>
          <div style={{ fontSize: 12, color: 'var(--os-text-2)', marginTop: 2 }}>
            4-generation evolution path · Training corpus health · Export for fine-tuning
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => runLearning()}
            disabled={runningLearning}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 99, fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', background: 'var(--os-card)', border: '1px solid var(--os-border)', cursor: 'pointer', opacity: runningLearning ? 0.6 : 1 }}
          >
            {runningLearning ? <Spinner size="sm" /> : <RefreshCw size={13} />}
            Run Learning Cycle
          </button>
          <button
            onClick={exportJSONL}
            disabled={exporting || !data?.total}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 99, fontSize: 12, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #7c3aed, #2564ea)', border: 'none', cursor: 'pointer', boxShadow: '0 6px 18px rgba(124,58,237,0.3)', opacity: (exporting || !data?.total) ? 0.5 : 1 }}
          >
            {exporting ? <Spinner size="sm" /> : <Download size={13} />}
            Export JSONL
          </button>
        </div>
      </div>

      {/* Generation evolution */}
      <div>
        <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 14 }}>
          Evolution Roadmap
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {GENERATIONS.map(g => <GenCard key={g.gen} g={g} />)}
        </div>
      </div>

      {/* Corpus health */}
      {isLoading && <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--os-text-2)', fontSize: 13 }}><Spinner size="sm" /> Loading corpus stats…</div>}
      {data && (
        <>
          {/* Graduation bar */}
          <div style={{ background: 'var(--os-card)', borderRadius: 14, padding: 24, boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)' }}>Gen 3 Graduation Progress</div>
                <div style={{ fontSize: 11, color: 'var(--os-text-2)', marginTop: 3 }}>
                  Reach 1,000 approved examples to unlock native cognitive engine
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#7c3aed', fontVariantNumeric: 'tabular-nums' }}>
                  {data.total.toLocaleString()}
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-text-2)' }}> / {data.graduationThreshold.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--os-text-2)', marginTop: 2 }}>{pct}% complete</div>
              </div>
            </div>
            <div style={{ height: 12, background: 'var(--os-border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #7c3aed, #10b981)', borderRadius: 99, transition: 'width .6s ease' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>
                {data.approved} approved · {data.examplesPerDay > 0 ? `${data.examplesPerDay}/day` : 'no velocity yet'}
              </span>
              {data.daysToGraduation != null
                ? <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>~{data.daysToGraduation} days to graduation</span>
                : <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>Run a learning cycle to estimate ETA</span>
              }
            </div>
          </div>

          {/* Quality distribution */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 12 }}>
              Quality Distribution
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {(Object.entries(data.qualityBands) as [string, number][]).map(([band, count]) => {
                const meta = QUALITY_META[band]
                return (
                  <div key={band} style={{ background: meta.color + '10', border: `1px solid ${meta.color}25`, borderRadius: 12, padding: '18px 20px' }}>
                    <div style={{ color: meta.color, marginBottom: 10 }}><meta.Icon size={18} /></div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                      {count.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-2)', marginTop: 6 }}>{meta.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent learning runs */}
          {data.recentRuns?.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)' }}>
                  Recent Learning Runs
                </h3>
                <button onClick={() => refetch()} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--os-text-2)' }}>
                  <RefreshCw size={13} />
                </button>
              </div>
              <div style={{ background: 'var(--os-card)', borderRadius: 14, overflow: 'hidden' }}>
                {data.recentRuns.map((run, i) => (
                  <div key={run.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < data.recentRuns.length - 1 ? '1px solid var(--os-border)' : 'none' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: '#10b98118', padding: '2px 8px', borderRadius: 8, flexShrink: 0 }}>
                      {run.status ?? 'completed'}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--os-text-1)', flex: 1 }}>
                      {run.totalExamples != null ? `${run.totalExamples} examples generated` : 'Learning run'}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--os-text-2)', flexShrink: 0 }}>
                      {new Date(run.startedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent examples table */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 12 }}>
              Recent Examples
            </h3>
            <div style={{ background: 'var(--os-card)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
              {data.recentExamples.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--os-text-2)', fontSize: 13 }}>
                  No examples yet — run a learning cycle to seed the corpus.
                </div>
              ) : (
                data.recentExamples.map((ex, i) => {
                  const qColor = ex.quality >= 0.95 ? '#10b981' : ex.quality >= 0.8 ? '#2564ea' : ex.quality >= 0.6 ? '#7c3aed' : '#f59e0b'
                  return (
                    <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < data.recentExamples.length - 1 ? '1px solid var(--os-border)' : 'none' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: qColor, background: qColor + '18', padding: '2px 8px', borderRadius: 20, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                        {ex.quality.toFixed(2)}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--os-text-1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ex.userMessage?.slice(0, 90) ?? ex.agentSystem}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--os-text-2)', flexShrink: 0 }}>{ex.source}</span>
                      {ex.approved && (
                        <span style={{ fontSize: 10, color: '#10b981', background: '#10b98118', padding: '1px 7px', borderRadius: 8, flexShrink: 0 }}>✓</span>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* ─── S78: WAANDA-FM Panel ─────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--os-border)', paddingTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#10b98115', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FlaskConical size={16} style={{ color: '#10b981' }} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--os-text-1)' }}>WAANDA-FM — Gen 4 Pre-training Pipeline</p>
              <p style={{ fontSize: 11, color: 'var(--os-text-2)', marginTop: 2 }}>S78 · Corpus curation from Gen1+2 operational data · Architecture evaluation</p>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: '#10b98112', color: '#10b981', border: '1px solid #10b98125' }}>S78</span>
          </div>
          <button
            onClick={() => runCuration()}
            disabled={curating}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 99, fontSize: 12, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', cursor: 'pointer', opacity: curating ? 0.6 : 1 }}
          >
            {curating ? <Spinner size="sm" /> : <Database size={13} />}
            {curating ? 'Curating…' : 'Run Corpus Curation'}
          </button>
        </div>

        {/* Corpus scan summary */}
        {fmStatus?.latestScan && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Total Scanned',    value: fmStatus.latestScan.totalScanned,    color: 'var(--os-text-1)', Icon: Database },
              { label: 'Included',          value: fmStatus.latestScan.totalIncluded,   color: '#10b981',          Icon: CheckCircle2 },
              { label: 'Total FM Examples', value: fmStatus.totalIncludedExamples,       color: '#7c3aed',          Icon: Layers },
              { label: 'Quality Threshold', value: `${(fmStatus.latestScan.qualityThreshold * 100).toFixed(0)}%`, color: '#f59e0b', Icon: FlaskConical },
            ].map(k => (
              <div key={k.label} style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <k.Icon size={13} style={{ color: k.color }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</span>
                </div>
                <p style={{ fontSize: 20, fontWeight: 900, color: k.color }}>{k.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Phase breakdown from latest scan */}
        {fmStatus?.latestScan?.byPhase && Object.keys(fmStatus.latestScan.byPhase).length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {Object.entries(fmStatus.latestScan.byPhase).map(([phase, count]) => (
              <div key={phase} style={{ padding: '6px 14px', borderRadius: 8, background: `${PHASE_COLORS[phase] ?? '#888'}10`, border: `1px solid ${PHASE_COLORS[phase] ?? '#888'}30` }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: PHASE_COLORS[phase] ?? '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{phase}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--os-text-1)', marginLeft: 8 }}>{count}</span>
              </div>
            ))}
            <span style={{ fontSize: 11, color: 'var(--os-text-2)', alignSelf: 'center', marginLeft: 4 }}>examples in latest scan</span>
          </div>
        )}

        {/* Tab selector */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--os-border)', marginBottom: 16 }}>
          {(['examples', 'evals', 'arch'] as const).map(t => (
            <button key={t} onClick={() => setFmTab(t)} style={{ padding: '7px 14px', fontSize: 11, fontWeight: 600, borderRadius: '7px 7px 0 0', border: 'none', cursor: 'pointer', background: 'transparent', color: fmTab === t ? '#10b981' : 'var(--os-text-2)', borderBottom: fmTab === t ? '2px solid #10b981' : '2px solid transparent' }}>
              {t === 'arch' ? 'Architecture' : t === 'evals' ? 'Evaluations' : 'Training Examples'}
            </button>
          ))}
          <button onClick={() => refetchFM()} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--os-text-2)', padding: '7px 10px' }}><RefreshCw size={13} /></button>
        </div>

        {/* Examples tab */}
        {fmTab === 'examples' && (
          <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 14, overflow: 'hidden' }}>
            {!fmExamples?.examples?.length ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--os-text-2)', fontSize: 13 }}>
                No training examples yet — run corpus curation to extract from Gen1+2 operational data.
              </div>
            ) : (
              fmExamples.examples.map((ex, i) => {
                const phaseColor = PHASE_COLORS[ex.phase] ?? '#888'
                return (
                  <div key={ex.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 20px', borderBottom: i < fmExamples.examples.length - 1 ? '1px solid var(--os-border)' : 'none' }}>
                    <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: `${phaseColor}15`, color: phaseColor, flexShrink: 0, marginTop: 1 }}>{ex.phase}</span>
                    <span style={{ fontSize: 11, color: 'var(--os-text-1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.prompt?.slice(0, 100)}</span>
                    <span style={{ fontSize: 10, color: 'var(--os-text-2)', flexShrink: 0 }}>{ex.sourceType}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: ex.quality >= 0.85 ? '#10b981' : '#f59e0b', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{(ex.quality * 100).toFixed(0)}%</span>
                    {ex.included && <span style={{ fontSize: 9, color: '#10b981', flexShrink: 0 }}>✓</span>}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Evals tab */}
        {fmTab === 'evals' && (
          <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 14, overflow: 'hidden' }}>
            {!fmStatus?.evals?.length ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--os-text-2)', fontSize: 13 }}>
                No evaluations recorded yet. POST to <code>/admin/bids/waanda-fm/evals</code> to log benchmark results.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Model', 'Accuracy', 'Loss', 'Eval Date', 'Notes'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 700, color: 'var(--os-text-2)', borderBottom: '1px solid var(--os-border)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fmStatus.evals.map((ev, i) => (
                    <tr key={ev.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--os-surface-0)' }}>
                      <td style={{ padding: '10px 16px', color: 'var(--os-text-1)', fontWeight: 700 }}>{ev.modelCandidate}</td>
                      <td style={{ padding: '10px 16px', color: (ev.overallScore ?? 0) >= 0.85 ? '#10b981' : '#f59e0b', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{(((ev.overallScore ?? 0)) * 100).toFixed(1)}%</td>
                      <td style={{ padding: '10px 16px', color: 'var(--os-text-2)', fontVariantNumeric: 'tabular-nums' }}>—</td>
                      <td style={{ padding: '10px 16px', color: 'var(--os-text-2)' }}>{new Date(ev.evalDate).toLocaleDateString()}</td>
                      <td style={{ padding: '10px 16px', color: 'var(--os-text-2)', fontSize: 11 }}>{ev.notes ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Architecture tab */}
        {fmTab === 'arch' && (
          <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['Model', 'Params', 'Architecture', 'Context', 'Strength', 'License'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 700, color: 'var(--os-text-2)', borderBottom: '1px solid var(--os-border)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ARCH_MODELS.map((m, i) => (
                  <tr key={m.name} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--os-surface-0)' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--os-text-1)' }}>{m.name}</td>
                    <td style={{ padding: '10px 16px', fontWeight: 800, color: '#7c3aed' }}>{m.params}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--os-text-2)' }}>{m.arch}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--os-text-2)', fontVariantNumeric: 'tabular-nums' }}>{m.context}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--os-text-1)', fontSize: 11, maxWidth: 260 }}>{m.strength}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: '#10b98112', color: '#10b981' }}>{m.license}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '14px 16px', borderTop: '1px solid var(--os-border)', fontSize: 11, color: 'var(--os-text-2)' }}>
              Recommended starting point: <strong style={{ color: 'var(--os-text-1)' }}>Llama 3.1 8B</strong> — best balance of reasoning quality, context length, and fine-tuning cost at WAANDA-FM corpus scale.
            </div>
          </div>
        )}

        {/* Last scan meta */}
        {fmStatus?.latestScan && (
          <p style={{ fontSize: 10, color: 'var(--os-text-2)', marginTop: 12 }}>
            Last corpus scan: {new Date(fmStatus.latestScan.scanAt).toLocaleString()} · quality threshold {(fmStatus.latestScan.qualityThreshold * 100).toFixed(0)}%
          </p>
        )}
      </div>

    </div>
  )
}
