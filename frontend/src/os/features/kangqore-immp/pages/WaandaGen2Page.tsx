import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Brain, Download, Plus, CheckCircle, XCircle, AlertCircle, Cpu, ChevronRight, RefreshCw, Tag, Sliders, Rocket, BarChart3, GitMerge, Radio } from 'lucide-react'
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

type Tab = 'annotate' | 'jobs' | 'export' | 'health' | 'autonomy' | 'diff'

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
      <div className="flex gap-1 p-1 rounded-2xl border" style={{ background: SURF, borderColor: BDR, width: 'fit-content' }}>
        {([['annotate', 'Annotate'], ['jobs', 'Fine-tune Jobs'], ['export', 'Export JSONL'], ['health', 'Gen 2 Health'], ['autonomy', 'Autonomy'], ['diff', 'Quality Diff']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="px-4 py-1.5 rounded-2xl text-xs font-bold transition-colors"
            style={tab === id ? { background: PURP, color: '#fff' } : { color: T2 }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'annotate' && <AnnotateTab qc={qc} />}
      {tab === 'jobs'     && <JobsTab qc={qc} />}
      {tab === 'export'   && <ExportTab />}
      {tab === 'health'   && <Gen2HealthTab qc={qc} />}
      {tab === 'autonomy' && <AutonomyTab qc={qc} />}
      {tab === 'diff'     && <QualityDiffTab />}
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
            <div key={s.label} className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: T2 }}>{s.label}</p>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Progress to 1000 examples */}
      {stats && (
        <div className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
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
            className="px-3 py-1.5 rounded-2xl text-xs font-bold transition-colors"
            style={filter === f ? { background: PURP, color: '#fff' } : { background: SURF, color: T2, border: `1px solid ${BDR}` }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button onClick={() => refetch()} className="ml-auto p-1.5 rounded-2xl" style={{ color: T2 }}>
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Example list */}
      {isLoading && (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: SURF }} />)}</div>
      )}
      {!isLoading && examples.length === 0 && (
        <div className="py-12 text-center text-sm" style={{ color: T2 }}>No examples in this category yet.</div>
      )}
      {examples.map(ex => (
        <div key={ex.id} className="rounded-2xl border overflow-hidden" style={{ background: CARD, borderColor: BDR }}>
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
              className="w-6 h-6 rounded-2xl flex items-center justify-center flex-shrink-0"
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
                    <pre className="text-[11px] font-mono whitespace-pre-wrap rounded-2xl p-3 max-h-36 overflow-y-auto"
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
                className="flex items-center gap-1.5 px-3 py-1 rounded-2xl text-[10px] font-bold disabled:opacity-40 transition-colors"
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
  const [pollResults, setPollResults] = useState<Record<string, any>>({})
  const [polling, setPolling] = useState<Record<string, boolean>>({})

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

  async function pollJob(id: string) {
    setPolling(p => ({ ...p, [id]: true }))
    try {
      const r = await api.get(`/admin/kangqore-immp/learning/finetune-jobs/${id}/poll`)
      setPollResults(p => ({ ...p, [id]: r.data }))
      qc.invalidateQueries({ queryKey: ['finetune-jobs'] })
    } catch { /* ignore */ } finally {
      setPolling(p => ({ ...p, [id]: false }))
    }
  }

  // Auto-poll every 30s when any job is SUBMITTED or RUNNING
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    const active = jobs.filter(j => j.providerJobId && (j.status === 'SUBMITTED' || j.status === 'TRAINING'))
    if (active.length > 0) {
      autoRef.current = setInterval(() => {
        active.forEach(j => pollJob(j.id))
      }, 30_000)
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [jobs.map(j => j.id + j.status).join(',')])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: T1 }}>Fine-tune Jobs</p>
        <button onClick={() => setShowCreate(s => !s)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold"
          style={{ background: 'rgba(124,58,237,0.1)', color: PURP, border: `1px solid rgba(124,58,237,0.2)` }}>
          <Plus className="w-3.5 h-3.5" /> New Job
        </button>
      </div>

      {showCreate && (
        <div className="rounded-2xl border p-4 space-y-3" style={{ background: CARD, borderColor: BDR }}>
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
                  className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none"
                  style={{ borderColor: BDR, background: SURF, color: T1 }} />
              </div>
            ))}
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Provider</p>
              <select value={form.provider} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none"
                style={{ borderColor: BDR, background: SURF, color: T1 }}>
                {['ANTHROPIC', 'TOGETHER', 'HUGGINGFACE', 'OPENAI'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Min quality (0–1)</p>
              <input type="number" min="0.5" max="1.0" step="0.1" value={form.minQuality}
                onChange={e => setForm(f => ({ ...f, minQuality: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none"
                style={{ borderColor: BDR, background: SURF, color: T1 }} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Notes (optional)</p>
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Training notes..."
              className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none"
              style={{ borderColor: BDR, background: SURF, color: T1 }} />
          </div>
          <div className="flex gap-2">
            <button disabled={!form.name.trim() || create.isPending}
              onClick={() => create.mutate()}
              className="px-4 py-2 rounded-2xl text-xs font-bold disabled:opacity-40"
              style={{ background: PURP, color: '#fff' }}>
              {create.isPending ? 'Creating…' : 'Create Job'}
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-2xl text-xs font-bold" style={{ color: T2 }}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading && <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: SURF }} />)}</div>}
      {!isLoading && jobs.length === 0 && !showCreate && (
        <div className="py-12 text-center text-sm" style={{ color: T2 }}>No fine-tune jobs yet.</div>
      )}

      {jobs.map(job => {
        const cfg = JOB_STATUS_CFG[job.status] ?? JOB_STATUS_CFG.PENDING
        const next = STATUS_FLOW[job.status]
        const STEPS = ['PENDING', 'EXPORTING', 'SUBMITTED', 'TRAINING', 'COMPLETE']
        const stepIdx = STEPS.indexOf(job.status)
        const pr = pollResults[job.id]
        const isAutoRegistered = pr?.fineTunedModelId && pr?.providerStatus === 'succeeded'
        return (
          <div key={job.id} className="rounded-2xl border" style={{ background: CARD, borderColor: BDR }}>
            <div className="flex items-start gap-3 px-4 py-4">
              <div className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                <Cpu className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-xs font-bold" style={{ color: T1 }}>{job.name}</p>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: cfg.bg, color: cfg.color }}>{job.status}</span>
                  <span className="text-[10px]" style={{ color: T2 }}>{job.provider}</span>
                  {pr?.providerStatus && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                      style={{ background: 'rgba(87,155,252,0.12)', color: BLUE }}>
                      Provider: {pr.providerStatus}
                    </span>
                  )}
                  {isAutoRegistered && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                      style={{ background: 'rgba(16,185,129,0.12)', color: GRN }}>
                      Auto-registered as active Gen2 model
                    </span>
                  )}
                </div>
                <p className="text-[10px] mb-2" style={{ color: T2 }}>
                  {job.exampleCount} examples · q≥{job.minQuality} · {job.baseModel}
                  {job.providerJobId ? ` · ID: ${job.providerJobId.slice(0, 20)}…` : ''}
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
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                {job.providerJobId && (
                  <button onClick={() => pollJob(job.id)} disabled={polling[job.id]}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[10px] font-bold disabled:opacity-40"
                    style={{ background: 'rgba(87,155,252,0.1)', color: BLUE, border: `1px solid rgba(87,155,252,0.2)` }}>
                    <Radio className="w-3 h-3" /> {polling[job.id] ? 'Polling…' : 'Poll Status'}
                  </button>
                )}
                {next && (
                  <button onClick={() => advance.mutate({ id: job.id, status: next })}
                    disabled={advance.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[10px] font-bold disabled:opacity-40"
                    style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                    → {next}
                  </button>
                )}
              </div>
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold disabled:opacity-50 transition-colors"
          style={{ background: PURP, color: '#fff' }}>
          <Download className="w-4 h-4" />
          {exporting ? 'Preparing…' : 'Download JSONL'}
        </button>
      </div>

      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <p className="text-sm font-bold mb-3" style={{ color: T1 }}>Format reference</p>
        <pre className="text-xs font-mono rounded-2xl p-4 overflow-x-auto leading-relaxed"
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

// ── Gen 2 Health tab ─────────────────────────────────────────────────────────

function Gen2HealthTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useQuery<any>({
    queryKey: ['router-stats'],
    queryFn:  () => api.get('/admin/kangqore-immp/learning/router-stats').then(r => r.data),
    staleTime: 15_000,
  })

  const { data: modelsData, isLoading: modelsLoading, refetch: refetchModels } = useQuery<any>({
    queryKey: ['gen2-models'],
    queryFn:  () => api.get('/admin/kangqore-immp/learning/gen2-models').then(r => r.data),
    staleTime: 15_000,
  })

  const { data: cbData, refetch: refetchCb } = useQuery<any>({
    queryKey: ['gen2-circuit-breaker'],
    queryFn:  () => api.get('/admin/kangqore-immp/learning/circuit-breaker').then(r => r.data),
    refetchInterval: 30_000,
  })

  const { data: corpusStats } = useQuery<any>({
    queryKey: ['corpus-stats'],
    queryFn:  () => api.get('/admin/kangqore-immp/learning/corpus-stats').then(r => r.data),
    staleTime: 30_000,
  })

  const deployMut = useMutation({
    mutationFn: ({ id, deploy }: { id: string; deploy: boolean }) =>
      api.patch(`/admin/kangqore-immp/learning/gen2-models/${id}/deploy`, { deploy }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gen2-models'] })
      qc.invalidateQueries({ queryKey: ['router-stats'] })
    },
  })

  const graduateMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/learning/graduate'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['router-stats'] })
      refetchCb()
    },
  })

  const circuitTripMut = useMutation({
    mutationFn: (reason: string) => api.post('/admin/kangqore-immp/learning/circuit-trip', { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['router-stats'] })
      refetchCb()
    },
  })

  const approved = corpusStats?.approved ?? 0
  const threshold = corpusStats?.graduationThreshold ?? 1000
  const readyToGraduate = approved >= threshold
  const gen2CB = cbData?.gen2
  const gen2CBHealth = gen2CB?.health ?? 'offline'

  const routerStats = statsData
  const models: any[] = modelsData?.models ?? []
  const deployedModel = modelsData?.deployed ?? null
  const providers: any[] = routerStats?.providers ?? []

  const HEALTH_COLOR: Record<string, string> = {
    healthy:     GRN,
    degraded:    AMB,
    recovering:  BLUE,
    offline:     RED,
    maintenance: T2,
    warming:     TEAL,
  }

  return (
    <div className="space-y-5">
      {/* ── S86: Graduation + Circuit Breaker Panel ─────────────────────── */}
      <div className="rounded-2xl p-4 border grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ background: CARD, borderColor: BDR }}>
        {/* Graduate button */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: T2 }}>Gen2 Graduation</p>
          <p className="text-[11px] mb-3" style={{ color: T2 }}>
            {approved}/{threshold} approved examples
            {readyToGraduate ? ' — ready to graduate' : ` — ${threshold - approved} remaining`}
          </p>
          <button
            onClick={() => graduateMut.mutate()}
            disabled={!readyToGraduate || graduateMut.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all"
            style={{ background: readyToGraduate ? 'rgba(16,185,129,0.15)' : 'rgba(100,100,100,0.1)', color: readyToGraduate ? GRN : T2, cursor: readyToGraduate ? 'pointer' : 'not-allowed' }}
            title={readyToGraduate ? 'Set Gen2 to 25% traffic' : `Need ${threshold} approved examples`}
          >
            <Rocket className="w-3 h-3" />
            {graduateMut.isPending ? 'Graduating…' : 'Graduate → 25% Traffic'}
          </button>
          {graduateMut.isSuccess && (
            <p className="text-[11px] mt-1" style={{ color: GRN }}>Graduated — Gen2 now at 25% traffic</p>
          )}
          {graduateMut.isError && (
            <p className="text-[11px] mt-1" style={{ color: RED }}>{(graduateMut.error as any)?.response?.data?.error ?? 'Graduation failed'}</p>
          )}
        </div>

        {/* Circuit breaker status */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: T2 }}>Gen2 Circuit Breaker</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: gen2CBHealth === 'healthy' ? GRN : gen2CBHealth === 'degraded' ? AMB : RED }} />
            <span className="text-xs font-bold capitalize" style={{ color: gen2CBHealth === 'healthy' ? GRN : gen2CBHealth === 'degraded' ? AMB : RED }}>
              {gen2CBHealth}
            </span>
            {gen2CB?.failures > 0 && (
              <span className="text-[11px]" style={{ color: AMB }}>{gen2CB.failures} failure{gen2CB.failures !== 1 ? 's' : ''}</span>
            )}
          </div>
          <button
            onClick={() => { if (confirm('Trip circuit and revert all Gen2 traffic to 0%?')) circuitTripMut.mutate('>5% error rate — manual trip') }}
            disabled={circuitTripMut.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all"
            style={{ background: 'rgba(239,68,68,0.1)', color: RED }}
          >
            <XCircle className="w-3 h-3" />
            {circuitTripMut.isPending ? 'Tripping…' : 'Emergency Revert → 0%'}
          </button>
          {circuitTripMut.isSuccess && (
            <p className="text-[11px] mt-1" style={{ color: AMB }}>Circuit tripped — Gen2 at 0%</p>
          )}
        </div>
      </div>

      {/* ── WAANDAx Server Status ────────────────────────────────────────────── */}
      <div className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: routerStats?.waandaxAvailable ? GRN : RED }} />
            <p className="text-xs font-bold" style={{ color: T1 }}>WAANDAx Local Server</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: routerStats?.waandaxAvailable ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: routerStats?.waandaxAvailable ? GRN : RED }}>
              {routerStats?.waandaxAvailable ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/admin/kangqore-immp/learning/export-jsonl"
              download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold"
              style={{ background: 'rgba(124,58,237,0.1)', color: PURP, textDecoration: 'none' }}
            >
              <Download className="w-3 h-3" /> Export JSONL
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <div>
            <span style={{ color: T2 }}>Model path: </span>
            <span className="font-mono font-bold" style={{ color: routerStats?.waandaxModel ? T1 : RED }}>
              {routerStats?.waandaxModel ?? 'WAANDAX_MODEL not set'}
            </span>
          </div>
          <div>
            <span style={{ color: T2 }}>Server URL: </span>
            <span className="font-mono" style={{ color: T2 }}>{routerStats?.waandaxUrl ?? 'http://localhost:11435'}</span>
          </div>
          <div>
            <span style={{ color: T2 }}>Local calls: </span>
            <span className="font-bold" style={{ color: GRN }}>{routerStats?.callsWaandax ?? 0}</span>
          </div>
          <div>
            <span style={{ color: T2 }}>Autonomy ratio: </span>
            <span className="font-bold" style={{ color: PURP }}>{((routerStats?.autonomyRatio ?? 0) * 100).toFixed(1)}%</span>
          </div>
        </div>
        {!routerStats?.waandaxAvailable && (
          <div className="mt-3 p-2 rounded-2xl font-mono text-[10px]" style={{ background: 'rgba(239,68,68,0.06)', color: RED, border: '1px solid rgba(239,68,68,0.2)' }}>
            cd ~/.kimmp-venv && mlx_lm.server --model {routerStats?.waandaxModel ?? '$WAANDAX_MODEL'} --port 11435
          </div>
        )}
        {routerStats?.waandaxAvailable && routerStats?.waandaxModel && (
          <p className="text-[11px] mt-2" style={{ color: GRN }}>
            Router Step 1 active — WAANDAx handles local inference before Claude
          </p>
        )}
      </div>

      {/* Router stats header */}
      <div className="rounded-2xl p-4 border flex items-center justify-between" style={{ background: CARD, borderColor: BDR }}>
        <div>
          <p className="text-xs font-bold mb-1" style={{ color: T1 }}>Live Router Stats</p>
          <p className="text-[11px]" style={{ color: T2 }}>
            {routerStats
              ? `${routerStats.callsTotal} total calls · WAANDAx ${routerStats.callsWaandax ?? 0} · Gen2 ${routerStats.callsGen2 ?? 0} (${((routerStats.gen2Ratio ?? 0) * 100).toFixed(1)}%) · Autonomy ${((routerStats.autonomyRatio ?? 0) * 100).toFixed(1)}%`
              : 'Loading…'}
          </p>
        </div>
        <button
          onClick={() => { refetchStats(); refetchModels() }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium"
          style={{ background: 'rgba(124,58,237,0.1)', color: PURP }}
        >
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {/* Provider health grid */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: T2 }}>Provider Health</p>
        {statsLoading ? (
          <p className="text-xs" style={{ color: T2 }}>Loading…</p>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {providers.map((p: any) => (
              <div key={p.name} className="rounded-2xl p-3 border text-center" style={{ background: CARD, borderColor: BDR }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: T2 }}>{p.name}</p>
                <p className="text-sm font-black mb-1" style={{ color: HEALTH_COLOR[p.health] ?? T2 }}>{p.health}</p>
                <p className="text-[11px]" style={{ color: T2 }}>{p.calls} calls</p>
                <p className="text-[11px]" style={{ color: PURP }}>{(p.ratio * 100).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* A/B routing bar */}
      {routerStats && routerStats.callsTotal > 0 && (
        <div className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
          <p className="text-xs font-bold mb-2" style={{ color: T1 }}>A/B Routing Distribution</p>
          <div className="h-3 rounded-full overflow-hidden flex">
            {providers.filter((p: any) => p.calls > 0).map((p: any) => (
              <div
                key={p.name}
                title={`${p.name}: ${(p.ratio * 100).toFixed(1)}%`}
                style={{ width: `${p.ratio * 100}%`, background: HEALTH_COLOR[p.health] ?? T2 }}
              />
            ))}
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {providers.filter((p: any) => p.calls > 0).map((p: any) => (
              <div key={p.name} className="flex items-center gap-1.5 text-[11px]" style={{ color: T2 }}>
                <span className="w-2 h-2 rounded-full" style={{ background: HEALTH_COLOR[p.health] ?? T2 }} />
                {p.name} {(p.ratio * 100).toFixed(1)}%
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployed Gen2 model banner */}
      {deployedModel ? (
        <div className="rounded-2xl p-4 border flex items-center gap-3"
          style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: GRN }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: GRN }}>Gen 2 Active — {deployedModel.name}</p>
            <p className="text-[11px]" style={{ color: T2 }}>
              {deployedModel.providerModelId} · {deployedModel.provider}
              {deployedModel.benchmarkAccuracy ? ` · Accuracy ${(deployedModel.benchmarkAccuracy * 100).toFixed(1)}%` : ''}
            </p>
          </div>
          <button
            onClick={() => deployMut.mutate({ id: deployedModel.id, deploy: false })}
            disabled={deployMut.isPending}
            className="px-3 py-1.5 rounded-2xl text-xs font-medium"
            style={{ background: 'rgba(239,68,68,0.1)', color: RED }}
          >
            Undeploy
          </button>
        </div>
      ) : (
        <div className="rounded-2xl p-4 border flex items-center gap-3"
          style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: AMB }} />
          <div>
            <p className="text-sm font-bold" style={{ color: AMB }}>No Gen 2 model deployed</p>
            <p className="text-[11px]" style={{ color: T2 }}>All inference routing through Claude Gen 1 and fallbacks.</p>
          </div>
        </div>
      )}

      {/* Model registry */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: T2 }}>Model Registry</p>
        {modelsLoading ? (
          <p className="text-xs" style={{ color: T2 }}>Loading…</p>
        ) : models.length === 0 ? (
          <div className="rounded-2xl p-5 border text-center" style={{ background: CARD, borderColor: BDR }}>
            <Cpu className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium" style={{ color: T2 }}>No Gen 2 models registered</p>
            <p className="text-[11px] mt-1" style={{ color: T2 }}>
              Run MLX-LM fine-tune, then use POST /waandax/register-model to register the deployed weights path.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {models.map((m: any) => (
              <div key={m.id} className="rounded-2xl p-4 border flex items-center gap-3" style={{ background: CARD, borderColor: BDR }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold truncate" style={{ color: T1 }}>{m.name}</p>
                    {m.isDeployed && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                        style={{ background: 'rgba(16,185,129,0.1)', color: GRN }}>LIVE</span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono truncate" style={{ color: T2 }}>{m.providerModelId}</p>
                  <p className="text-[11px]" style={{ color: T2 }}>
                    {m.provider} · {m.baseModel} · {m.trainingExamples} examples
                    {m.benchmarkAccuracy ? ` · ${(m.benchmarkAccuracy * 100).toFixed(1)}% accuracy` : ''}
                  </p>
                </div>
                {!m.isDeployed ? (
                  <button
                    onClick={() => deployMut.mutate({ id: m.id, deploy: true })}
                    disabled={deployMut.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all"
                    style={{ background: 'rgba(124,58,237,0.1)', color: PURP }}
                  >
                    <ChevronRight className="w-3 h-3" /> Deploy
                  </button>
                ) : (
                  <button
                    onClick={() => deployMut.mutate({ id: m.id, deploy: false })}
                    disabled={deployMut.isPending}
                    className="px-3 py-1.5 rounded-2xl text-xs font-medium"
                    style={{ background: 'rgba(239,68,68,0.1)', color: RED }}
                  >
                    Undeploy
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Phase indicator */}
      {routerStats && (
        <div className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: T2 }}>Router Phase</p>
          <div className="flex items-center gap-3">
            {['distilling', 'pre-graduation', 'routing'].map((phase, i) => {
              const active = routerStats.phase === phase
              const done   = ['distilling', 'pre-graduation', 'routing'].indexOf(routerStats.phase) > i
              return (
                <div key={phase} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: active ? PURP : done ? GRN : SURF, color: active || done ? '#fff' : T2 }}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span className="text-[11px] font-medium capitalize"
                      style={{ color: active ? PURP : done ? GRN : T2 }}>{phase}</span>
                  </div>
                  {i < 2 && <span style={{ color: T2 }}>→</span>}
                </div>
              )
            })}
          </div>
          <p className="text-[11px] mt-2" style={{ color: T2 }}>
            Corpus: {routerStats.distillationCount} distilled / {routerStats.totalCorpus} total · Cap: {routerStats.distillationCap}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Autonomy Tab (S68) ────────────────────────────────────────────────────────

interface AutonomyConfig {
  id: string; gen2TrafficPct: number; enabledAt: string | null; updatedBy: string | null; updatedAt: string
}

interface AutonomyStats {
  deployedModel: string | null; humanOverrideRate: number
  gen1TrafficPct: number; gen2TrafficPct: number
}

function AutonomyTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [slider, setSlider] = useState<number | null>(null)

  const { data: config, isLoading: cfgLoading } = useQuery<AutonomyConfig>({
    queryKey: ['autonomy-config'],
    queryFn:  () => api.get('/admin/kangqore-immp/learning/autonomy-config').then(r => r.data),
    staleTime: 30_000,
  })

  useEffect(() => {
    if (config && slider === null) setSlider(config.gen2TrafficPct)
  }, [config]) // eslint-disable-line react-hooks/exhaustive-deps

  const { data: stats } = useQuery<AutonomyStats>({
    queryKey: ['autonomy-stats'],
    queryFn:  () => api.get('/admin/kangqore-immp/learning/autonomy-stats').then(r => r.data),
    staleTime: 30_000,
  })

  const update = useMutation({
    mutationFn: (pct: number) => api.patch('/admin/kangqore-immp/learning/autonomy-config', { gen2TrafficPct: pct }),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['autonomy-config'] })
      qc.invalidateQueries({ queryKey: ['autonomy-stats'] })
    },
  })

  const pct         = slider ?? config?.gen2TrafficPct ?? 0
  const isDeplyed   = !!stats?.deployedModel
  const graduated   = pct >= 75

  if (cfgLoading) return <div className="h-48 rounded-2xl animate-pulse" style={{ background: SURF }} />

  return (
    <div className="space-y-4">
      {/* Graduation Banner */}
      {graduated && (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.08)', border: `1px solid rgba(16,185,129,0.2)` }}>
          <Rocket className="w-5 h-5 flex-shrink-0" style={{ color: GRN }} />
          <div>
            <p className="text-xs font-bold" style={{ color: GRN }}>Gen 2 Graduation Active</p>
            <p className="text-[11px] mt-0.5" style={{ color: T2 }}>≥75% traffic routing to Gen 2. Monitor quality delta before graduating to 100%.</p>
          </div>
        </div>
      )}

      {/* Traffic split donut + controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border p-5" style={{ background: CARD, borderColor: BDR }}>
          <div className="flex items-center gap-2 mb-4">
            <GitMerge className="w-4 h-4" style={{ color: PURP }} />
            <p className="text-sm font-bold" style={{ color: T1 }}>Traffic Split</p>
          </div>

          {/* SVG donut */}
          <div className="flex items-center gap-6">
            <DonutChart gen2Pct={pct} />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: PURP }} />
                <span className="text-xs font-bold" style={{ color: T1 }}>Gen 2 — {pct}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: BLUE }} />
                <span className="text-xs font-bold" style={{ color: T1 }}>Gen 1 — {100 - pct}%</span>
              </div>
              {!isDeplyed && (
                <p className="text-[10px] mt-2" style={{ color: RED }}>No Gen 2 model deployed</p>
              )}
            </div>
          </div>

          {/* Slider */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold" style={{ color: T2 }}>Gen 2 traffic %</p>
              <span className="text-sm font-black" style={{ color: PURP }}>{pct}%</span>
            </div>
            <input type="range" min={0} max={100} step={5} value={pct}
              onChange={e => setSlider(parseInt(e.target.value))}
              className="w-full accent-purple-600" />
            <div className="flex gap-2">
              {[0, 10, 25, 50, 75, 100].map(v => (
                <button key={v} onClick={() => setSlider(v)}
                  className="flex-1 py-1 rounded text-[10px] font-bold transition-colors"
                  style={pct === v ? { background: PURP, color: '#fff' } : { background: SURF, color: T2 }}>
                  {v}%
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={update.isPending || slider === null || slider === config?.gen2TrafficPct}
            onClick={() => slider !== null && update.mutate(slider)}
            className="mt-4 flex items-center gap-2 w-full justify-center px-4 py-2 rounded-2xl text-xs font-bold disabled:opacity-40"
            style={{ background: PURP, color: '#fff' }}>
            <Sliders className="w-3.5 h-3.5" />
            {update.isPending ? 'Applying…' : 'Apply Split'}
          </button>
        </div>

        {/* Stats panel */}
        <div className="rounded-2xl border p-5 space-y-4" style={{ background: CARD, borderColor: BDR }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4" style={{ color: TEAL }} />
            <p className="text-sm font-bold" style={{ color: T1 }}>Autonomy Stats</p>
          </div>

          {stats ? (
            <div className="space-y-3">
              <StatRow label="Deployed Model" value={stats.deployedModel ?? 'None'} color={stats.deployedModel ? GRN : RED} />
              <StatRow label="Human Override Rate"   value={`${(stats.humanOverrideRate * 100).toFixed(1)}%`} color={stats.humanOverrideRate > 0.1 ? AMB : GRN} />
              <StatRow label="Gen 1 Traffic"         value={`${stats.gen1TrafficPct}%`} color={BLUE}  />
              <StatRow label="Gen 2 Traffic"         value={`${stats.gen2TrafficPct}%`} color={PURP}  />
            </div>
          ) : (
            <div className="py-8 text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 opacity-30" style={{ color: T2 }} />
              <p className="text-xs" style={{ color: T2 }}>Loading stats…</p>
            </div>
          )}

          {config?.enabledAt && (
            <div className="pt-3 border-t" style={{ borderColor: BDR }}>
              <p className="text-[10px]" style={{ color: T2 }}>
                Autonomy enabled {new Date(config.enabledAt).toLocaleDateString()}
                {config.updatedBy && ` · by ${config.updatedBy}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DonutChart({ gen2Pct }: { gen2Pct: number }) {
  const R = 36; const CX = 44; const CY = 44
  const circumference = 2 * Math.PI * R
  const gen2Arc = (gen2Pct / 100) * circumference
  return (
    <svg width={88} height={88} viewBox={`0 0 88 88`}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={BLUE}     strokeWidth={12} />
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={PURP}     strokeWidth={12}
        strokeDasharray={`${gen2Arc} ${circumference - gen2Arc}`}
        strokeDashoffset={circumference / 4} strokeLinecap="round" />
      <text x={CX} y={CY + 2} textAnchor="middle" dominantBaseline="middle"
        fontSize="13" fontWeight="900" fill={PURP}>{gen2Pct}%</text>
    </svg>
  )
}

function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: BDR }}>
      <span className="text-[11px]" style={{ color: T2 }}>{label}</span>
      <span className="text-xs font-bold" style={{ color }}>{value}</span>
    </div>
  )
}

// ── Quality Diff Tab (S110) ───────────────────────────────────────────────────

interface DiffResult {
  prompt: string
  gen1: { response: string; latencyMs: number; model: string; provider: string }
  gen2: { response: string; latencyMs: number; model: string; provider: string }
  speedupRatio: string | null
  qualityMetrics: { gen1Length: number; gen2Length: number; lengthRatio: string | null }
  totalMs: number
}

function QualityDiffTab() {
  const [prompt, setPrompt] = useState('')
  const [context, setContext] = useState('')
  const [result, setResult] = useState<DiffResult | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    if (!prompt.trim()) return
    setRunning(true); setError(''); setResult(null)
    try {
      const r = await api.post('/admin/kangqore-immp/learning/quality-diff', {
        prompt: prompt.trim(),
        context: context.trim() || undefined,
      })
      setResult(r.data)
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e?.message ?? 'Comparison failed')
    } finally {
      setRunning(false)
    }
  }

  const isGen2Faster = result && result.gen2.latencyMs > 0 && result.gen2.latencyMs < result.gen1.latencyMs

  return (
    <div className="space-y-4">
      {/* Intro */}
      <div className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center gap-2 mb-1">
          <GitMerge className="w-4 h-4" style={{ color: PURP }} />
          <p className="text-sm font-bold" style={{ color: T1 }}>Gen 1 vs Gen 2 Quality Diff</p>
        </div>
        <p className="text-xs" style={{ color: T2 }}>
          Run the same prompt through Gen 1 (Claude) and Gen 2 / WAANDAx in parallel. Compare response quality, latency, and output length to validate Gen 2 readiness.
        </p>
      </div>

      {/* Input */}
      <div className="rounded-2xl border p-4 space-y-3" style={{ background: CARD, borderColor: BDR }}>
        <div>
          <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Test prompt</p>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3}
            placeholder="e.g. What are the top 3 risks for a customer whose OIS velocity dropped below 80% at Day 45?"
            className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none resize-none"
            style={{ borderColor: BDR, background: SURF, color: T1 }} />
        </div>
        <div>
          <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>System context (optional)</p>
          <input value={context} onChange={e => setContext(e.target.value)}
            placeholder="Additional context to include in system prompt…"
            className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none"
            style={{ borderColor: BDR, background: SURF, color: T1 }} />
        </div>
        {error && <p className="text-xs" style={{ color: RED }}>{error}</p>}
        <button disabled={!prompt.trim() || running} onClick={run}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold disabled:opacity-40"
          style={{ background: PURP, color: '#fff' }}>
          <Cpu className="w-4 h-4" />
          {running ? 'Running comparison…' : 'Run Gen 1 vs Gen 2'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Summary metrics */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Gen 1 latency', value: `${result.gen1.latencyMs}ms`, color: BLUE },
              { label: 'Gen 2 latency', value: result.gen2.latencyMs > 0 ? `${result.gen2.latencyMs}ms` : 'N/A', color: result.gen2.provider === 'gen1' ? AMB : TEAL },
              { label: 'Speed ratio', value: result.speedupRatio ? `${result.speedupRatio}×` : '—', color: isGen2Faster ? GRN : RED },
              { label: 'Total time', value: `${result.totalMs}ms`, color: T2 },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: T2 }}>{s.label}</p>
                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Side-by-side responses */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'gen1', label: 'Gen 1 · Claude', data: result.gen1, accent: BLUE },
              { key: 'gen2', label: `Gen 2 · ${result.gen2.provider === 'gen1' ? 'Claude (WAANDAx offline)' : 'WAANDAx'}`, data: result.gen2, accent: result.gen2.provider === 'gen1' ? AMB : PURP },
            ].map(({ key, label, data, accent }) => (
              <div key={key} className="rounded-2xl border overflow-hidden" style={{ background: CARD, borderColor: BDR }}>
                <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: BDR, background: SURF }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
                  <span className="text-xs font-bold" style={{ color: accent }}>{label}</span>
                  <span className="ml-auto text-[10px] font-mono" style={{ color: T2 }}>{data.latencyMs}ms · {data.response.length} chars</span>
                </div>
                <div className="p-4">
                  <pre className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto" style={{ color: T1 }}>
                    {data.response || <span style={{ color: T2, fontStyle: 'italic' }}>No response</span>}
                  </pre>
                </div>
                {/* Length bar */}
                <div className="px-4 pb-3">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: SURF }}>
                    <div className="h-full rounded-full" style={{
                      background: accent,
                      width: `${Math.min(100, (data.response.length / Math.max(result.gen1.response.length, result.gen2.response.length, 1)) * 100)}%`,
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Model info */}
          <div className="rounded-2xl p-3 border" style={{ background: SURF, borderColor: BDR }}>
            <p className="text-[10px]" style={{ color: T2 }}>
              Gen 1: <span className="font-mono" style={{ color: T1 }}>{result.gen1.model}</span> ·
              Gen 2: <span className="font-mono" style={{ color: T1 }}>{result.gen2.model}</span> ·
              {result.gen2.provider !== 'gen1'
                ? <span style={{ color: GRN }}> WAANDAx active — local inference serving Gen 2 slot</span>
                : <span style={{ color: AMB }}> WAANDAx offline — both slots served by Claude</span>
              }
            </p>
          </div>
        </>
      )}
    </div>
  )
}
