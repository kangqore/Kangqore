import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Brain, Download, Plus, CheckCircle, XCircle, AlertCircle, Cpu, ChevronRight, RefreshCw, Tag } from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const PURP = '#7c3aed'
const BLUE = '#579bfc'
const TEAL = '#14b8a6'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const GRN  = '#10b981'

type RatingLabel = 'good' | 'needs-improvement' | 'bad'

interface Example {
  id:           string
  source:       string
  systemPrompt: string
  userMessage:  string
  idealResponse: string
  quality:      number
  approved:     boolean
  tags:         string[]
  createdAt:    string
}

interface FinetuneJob {
  id:            string
  name:          string
  provider:      string
  status:        string
  exampleCount:  number
  minQuality:    number
  format:        string
  baseModel:     string
  exportedAt:    string | null
  submittedAt:   string | null
  completedAt:   string | null
  providerJobId: string | null
  notes:         string | null
  createdAt:     string
}

interface Stats {
  total: number; approved: number; unapproved: number
  q05: number; q07: number; q09: number; q10: number
  recentExamples: Example[]
}

const QUALITY_CLR = (q: number) => q >= 1.0 ? GRN : q >= 0.9 ? TEAL : q >= 0.7 ? AMB : RED
const QUALITY_LBL = (q: number) => q >= 1.0 ? 'Approved' : q >= 0.9 ? 'Operational' : q >= 0.7 ? 'Synthetic' : q >= 0.5 ? 'Mined' : 'Rejected'

const JOB_STATUS_CFG: Record<string, { color: string; bg: string }> = {
  PENDING:   { color: T2,   bg: SURF },
  EXPORTING: { color: BLUE, bg: 'rgba(87,155,252,0.1)' },
  SUBMITTED: { color: AMB,  bg: 'rgba(245,158,11,0.1)' },
  TRAINING:  { color: PURP, bg: 'rgba(124,58,237,0.1)' },
  COMPLETE:  { color: GRN,  bg: 'rgba(16,185,129,0.1)' },
  FAILED:    { color: RED,  bg: 'rgba(239,68,68,0.1)'  },
}

type Tab = 'annotate' | 'jobs' | 'export'

export function WaandaGen2Page() {
  const [tab, setTab] = useState<Tab>('annotate')
  const qc = useQueryClient()

  return (
    <div className="space-y-5 max-w-4xl">

      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(124,58,237,0.12)', border: `1px solid rgba(124,58,237,0.2)` }}>
            <Brain className="w-6 h-6" style={{ color: PURP }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-bold" style={{ color: T1 }}>WAANDA Gen 2 Preparation</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(124,58,237,0.1)', color: PURP }}>GEN 1 → GEN 2</span>
            </div>
            <p className="text-xs" style={{ color: T2 }}>
              Every KIMMP decision, signal, and action is automatically stored as a training example. Rate outputs here to build the high-quality corpus that will fine-tune WAANDA Gen 2. Target: 1,000 approved examples.
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl border" style={{ background: SURF, borderColor: BDR, width: 'fit-content' }}>
        {([['annotate', 'Annotate'], ['jobs', 'Fine-tune Jobs'], ['export', 'Export JSONL']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
            style={tab === id ? { background: PURP, color: '#fff' } : { color: T2 }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'annotate' && <AnnotateTab qc={qc} />}
      {tab === 'jobs'     && <JobsTab qc={qc} />}
      {tab === 'export'   && <ExportTab />}
    </div>
  )
}

// ── Annotation tab ───────────────────────────────────────────────────────────

function AnnotateTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data: statsData } = useQuery<{ stats: Stats }>({
    queryKey: ['learning-stats'],
    queryFn:  () => api.get('/admin/kangqore-immp/learning/stats').then(r => r.data),
    staleTime: 30_000,
  })

  const { data, isLoading, refetch } = useQuery<{ examples: Example[] }>({
    queryKey: ['learning-examples', filter],
    queryFn:  () => {
      const params: Record<string, string> = { limit: '50' }
      if (filter === 'approved')  params.approved = 'true'
      if (filter === 'rejected')  { params.approved = 'false'; params.maxQuality = '0.4' }
      if (filter === 'pending')   { params.approved = 'false' }
      return api.get('/admin/kangqore-immp/learning/examples', { params }).then(r => r.data)
    },
    staleTime: 15_000,
  })

  const rate = useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: RatingLabel }) =>
      api.patch(`/admin/kangqore-immp/learning/examples/${id}/rate`, { rating }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['learning-examples'] })
      qc.invalidateQueries({ queryKey: ['learning-stats'] })
    },
  })

  const stats = statsData?.stats
  const examples = data?.examples ?? []

  return (
    <div className="space-y-4">
      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total examples',   value: stats.total,    color: BLUE },
            { label: 'Approved (q=1.0)', value: stats.q10,      color: GRN  },
            { label: 'Needs review',     value: stats.unapproved, color: AMB },
            { label: 'Graduation',       value: `${Math.min(100, Math.round((stats.q10 / 1000) * 100))}%`, color: PURP },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: T2 }}>{s.label}</p>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Progress to 1000 examples */}
      {stats && (
        <div className="rounded-xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold" style={{ color: T1 }}>Progress to Gen 2 graduation</p>
            <p className="text-xs font-bold" style={{ color: PURP }}>{stats.q10} / 1,000 approved</p>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: SURF }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ background: PURP, width: `${Math.min(100, (stats.q10 / 1000) * 100)}%` }} />
          </div>
          <p className="text-[10px] mt-1.5" style={{ color: T2 }}>At 1,000 approved examples, KIMMP's weights can replace Claude for domain inference.</p>
        </div>
      )}

      {/* Filter chips */}
      <div className="flex items-center gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            style={filter === f ? { background: PURP, color: '#fff' } : { background: SURF, color: T2, border: `1px solid ${BDR}` }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button onClick={() => refetch()} className="ml-auto p-1.5 rounded-lg" style={{ color: T2 }}>
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Example list */}
      {isLoading && (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: SURF }} />)}</div>
      )}
      {!isLoading && examples.length === 0 && (
        <div className="py-12 text-center text-sm" style={{ color: T2 }}>No examples in this category yet.</div>
      )}
      {examples.map(ex => (
        <div key={ex.id} className="rounded-xl border overflow-hidden" style={{ background: CARD, borderColor: BDR }}>
          <div className="flex items-start gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: SURF, color: T2 }}>{ex.source}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${QUALITY_CLR(ex.quality)}18`, color: QUALITY_CLR(ex.quality) }}>
                  q={ex.quality.toFixed(1)} · {QUALITY_LBL(ex.quality)}
                </span>
                {ex.tags?.map(t => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: SURF, color: T2 }}>
                    <Tag className="w-2.5 h-2.5" />{t}
                  </span>
                ))}
              </div>
              <p className="text-xs font-medium line-clamp-2" style={{ color: T1 }}>{ex.userMessage}</p>
            </div>
            <button onClick={() => setExpanded(expanded === ex.id ? null : ex.id)}
              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ color: T2 }}>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded === ex.id ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {expanded === ex.id && (
            <div className="px-4 pb-3 border-t" style={{ borderColor: BDR }}>
              <div className="space-y-2 mt-3">
                {[
                  { label: 'System Prompt', content: ex.systemPrompt },
                  { label: 'User Message',  content: ex.userMessage  },
                  { label: 'Ideal Response', content: ex.idealResponse },
                ].map(({ label, content }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: T2 }}>{label}</p>
                    <pre className="text-[11px] font-mono whitespace-pre-wrap rounded-lg p-3 max-h-36 overflow-y-auto"
                      style={{ background: SURF, color: T1, border: `1px solid ${BDR}` }}>
                      {content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating buttons */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-t" style={{ borderColor: BDR, background: SURF }}>
            <p className="text-[10px] font-semibold mr-1" style={{ color: T2 }}>Rate:</p>
            {([
              ['good',             GRN,  CheckCircle,  'Good — approve for training'],
              ['needs-improvement', AMB, AlertCircle,  'Needs improvement'],
              ['bad',              RED,  XCircle,      'Bad — exclude'],
            ] as const).map(([rating, color, Icon, label]) => (
              <button key={rating}
                onClick={() => rate.mutate({ id: ex.id, rating: rating as RatingLabel })}
                disabled={rate.isPending}
                title={label}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold disabled:opacity-40 transition-colors"
                style={{
                  background: `${color}12`,
                  color,
                  border: `1px solid ${color}30`,
                }}>
                <Icon className="w-3 h-3" />
                {rating === 'needs-improvement' ? 'Needs work' : rating.charAt(0).toUpperCase() + rating.slice(1)}
              </button>
            ))}
            <span className="ml-auto text-[10px]" style={{ color: T2 }}>
              {new Date(ex.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Fine-tune Jobs tab ───────────────────────────────────────────────────────

function JobsTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', provider: 'ANTHROPIC', minQuality: '0.9', format: 'anthropic', baseModel: 'claude-haiku-4-5-20251001', notes: '' })

  const { data, isLoading } = useQuery<{ jobs: FinetuneJob[] }>({
    queryKey: ['finetune-jobs'],
    queryFn:  () => api.get('/admin/kangqore-immp/learning/finetune-jobs').then(r => r.data),
    staleTime: 30_000,
  })

  const create = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/learning/finetune-jobs', {
      name: form.name.trim(), provider: form.provider, minQuality: parseFloat(form.minQuality),
      format: form.format, baseModel: form.baseModel, notes: form.notes || undefined,
    }),
    onSuccess: () => {
      setShowCreate(false)
      setForm({ name: '', provider: 'ANTHROPIC', minQuality: '0.9', format: 'anthropic', baseModel: 'claude-haiku-4-5-20251001', notes: '' })
      qc.invalidateQueries({ queryKey: ['finetune-jobs'] })
    },
  })

  const advance = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/kangqore-immp/learning/finetune-jobs/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['finetune-jobs'] }),
  })

  const jobs = data?.jobs ?? []

  const STATUS_FLOW: Record<string, string | null> = {
    PENDING: 'EXPORTING', EXPORTING: 'SUBMITTED', SUBMITTED: 'TRAINING', TRAINING: 'COMPLETE', COMPLETE: null, FAILED: null,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: T1 }}>Fine-tune Jobs</p>
        <button onClick={() => setShowCreate(s => !s)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
          style={{ background: 'rgba(124,58,237,0.1)', color: PURP, border: `1px solid rgba(124,58,237,0.2)` }}>
          <Plus className="w-3.5 h-3.5" /> New Job
        </button>
      </div>

      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3" style={{ background: CARD, borderColor: BDR }}>
          <p className="text-xs font-bold" style={{ color: T1 }}>New fine-tune job</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { field: 'name',      label: 'Job name', ph: 'e.g. Q3-2026 Decision Corpus' },
              { field: 'baseModel', label: 'Base model', ph: 'claude-haiku-4-5-20251001' },
            ].map(({ field, label, ph }) => (
              <div key={field}>
                <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>{label}</p>
                <input value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={ph}
                  className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
                  style={{ borderColor: BDR, background: SURF, color: T1 }} />
              </div>
            ))}
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Provider</p>
              <select value={form.provider} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
                style={{ borderColor: BDR, background: SURF, color: T1 }}>
                {['ANTHROPIC', 'TOGETHER', 'HUGGINGFACE', 'OPENAI'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Min quality (0–1)</p>
              <input type="number" min="0.5" max="1.0" step="0.1" value={form.minQuality}
                onChange={e => setForm(f => ({ ...f, minQuality: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
                style={{ borderColor: BDR, background: SURF, color: T1 }} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Notes (optional)</p>
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Training notes..."
              className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
              style={{ borderColor: BDR, background: SURF, color: T1 }} />
          </div>
          <div className="flex gap-2">
            <button disabled={!form.name.trim() || create.isPending}
              onClick={() => create.mutate()}
              className="px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
              style={{ background: PURP, color: '#fff' }}>
              {create.isPending ? 'Creating…' : 'Create Job'}
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-xs font-bold" style={{ color: T2 }}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading && <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: SURF }} />)}</div>}
      {!isLoading && jobs.length === 0 && !showCreate && (
        <div className="py-12 text-center text-sm" style={{ color: T2 }}>No fine-tune jobs yet.</div>
      )}

      {jobs.map(job => {
        const cfg = JOB_STATUS_CFG[job.status] ?? JOB_STATUS_CFG.PENDING
        const next = STATUS_FLOW[job.status]
        const STEPS = ['PENDING', 'EXPORTING', 'SUBMITTED', 'TRAINING', 'COMPLETE']
        const stepIdx = STEPS.indexOf(job.status)
        return (
          <div key={job.id} className="rounded-xl border" style={{ background: CARD, borderColor: BDR }}>
            <div className="flex items-start gap-3 px-4 py-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                <Cpu className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold" style={{ color: T1 }}>{job.name}</p>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: cfg.bg, color: cfg.color }}>{job.status}</span>
                  <span className="text-[10px]" style={{ color: T2 }}>{job.provider}</span>
                </div>
                <p className="text-[10px] mb-2" style={{ color: T2 }}>
                  {job.exampleCount} examples · q≥{job.minQuality} · {job.baseModel}
                  {job.providerJobId ? ` · ID: ${job.providerJobId}` : ''}
                </p>
                {/* Status timeline */}
                <div className="flex items-center gap-1">
                  {STEPS.map((s, i) => {
                    const done = i < stepIdx
                    const active = i === stepIdx
                    return (
                      <div key={s} className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{
                            background: done ? GRN : active ? cfg.color : SURF,
                            color: done || active ? '#fff' : T2,
                          }}>
                          {done ? '✓' : i + 1}
                        </div>
                        <span className="text-[9px]" style={{ color: active ? cfg.color : T2 }}>{s.slice(0,3)}</span>
                        {i < STEPS.length - 1 && <div className="w-4 h-px" style={{ background: i < stepIdx ? GRN : BDR }} />}
                      </div>
                    )
                  })}
                </div>
              </div>
              {next && (
                <button onClick={() => advance.mutate({ id: job.id, status: next })}
                  disabled={advance.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold flex-shrink-0 disabled:opacity-40"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                  → {next}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Export tab ───────────────────────────────────────────────────────────────

function ExportTab() {
  const [minQuality, setMinQuality] = useState(0.9)
  const [exporting, setExporting]   = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await api.get('/admin/kangqore-immp/learning/export', {
        params: { minQuality },
        responseType: 'blob',
      })
      const blob = new Blob([res.data], { type: 'application/jsonl' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url
      a.download = `kimmp-training-corpus-q${minQuality}-${new Date().toISOString().slice(0,10)}.jsonl`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 border space-y-4" style={{ background: CARD, borderColor: BDR }}>
        <p className="text-sm font-bold" style={{ color: T1 }}>Export Training Corpus</p>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: T2 }}>Minimum quality threshold</p>
            <div className="flex items-center gap-3">
              <input type="range" min="0.5" max="1.0" step="0.1" value={minQuality}
                onChange={e => setMinQuality(parseFloat(e.target.value))}
                className="flex-1" />
              <span className="text-xs font-bold w-8 text-center" style={{ color: PURP }}>{minQuality}</span>
            </div>
            <div className="flex justify-between text-[10px] mt-1" style={{ color: T2 }}>
              <span>0.5 — auto-mined</span>
              <span>0.7 — synthetic</span>
              <span>0.9 — operational</span>
              <span>1.0 — approved only</span>
            </div>
          </div>
        </div>
        <button onClick={handleExport} disabled={exporting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors"
          style={{ background: PURP, color: '#fff' }}>
          <Download className="w-4 h-4" />
          {exporting ? 'Preparing…' : 'Download JSONL'}
        </button>
      </div>

      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <p className="text-sm font-bold mb-3" style={{ color: T1 }}>Format reference</p>
        <pre className="text-xs font-mono rounded-xl p-4 overflow-x-auto leading-relaxed"
          style={{ background: SURF, border: `1px solid ${BDR}`, color: T2 }}>{`# Anthropic fine-tuning format (default)
{"messages":[
  {"role":"system","content":"<KIMMP system prompt>"},
  {"role":"user","content":"<user query>"},
  {"role":"assistant","content":"<ideal KIMMP response>"}
]}

# Each line = one training example
# quality ≥ 0.9 → approved operational data (highest signal)
# quality ≥ 0.7 → synthetic / Claude-validated
# quality ≥ 0.5 → auto-mined (use for scale, not signal)

# Submit to Anthropic fine-tuning API:
# POST https://api.anthropic.com/v1/fine-tuning/jobs
# (requires enterprise access)`}</pre>
      </div>
    </div>
  )
}
