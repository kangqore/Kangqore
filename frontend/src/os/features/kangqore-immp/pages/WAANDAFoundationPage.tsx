import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Brain, Download, RefreshCw, TrendingUp, Award, Zap, Lightbulb } from 'lucide-react'
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
    name: 'Local Llama (WAANDAx)',
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
  const qc = useQueryClient()

  const { data, isLoading, refetch } = useQuery<FoundationStatus>({
    queryKey: ['foundation-model-status'],
    queryFn: () => api.get('/admin/kangqore-immp/foundation-model/status').then(r => r.data),
    staleTime: 30_000,
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
    </div>
  )
}
