import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Brain, CheckCircle, AlertTriangle, Cpu, Database,
  Download, Zap, Activity, Circle, ThumbsUp, ThumbsDown, Trash2, RefreshCw,
} from 'lucide-react'
import { api, isDemo } from '@lib/api'

// ── Types ─────────────────────────────────────────────────────────────────────

interface LocalModelStatus {
  available:     boolean
  model:         string
  ollamaUrl:     string
  loadedModels?: string[]
  note?:         string
}

interface TrainingProgress {
  total:           number
  reasonExamples:  number
  exportReady:     number
  threshold:       number
  pct:             number
  readyToFinetune: boolean
}

interface GenStatus {
  localModel:       LocalModelStatus
  trainingProgress: TrainingProgress
  recipe?: {
    baseModel?:      string
    method?:         string
    estimatedTime?:  string
    estimatedCost?:  string
    minExamples?:    number
    ready?:          boolean
    tool?:           string
  }
}

interface CorpusStats {
  total:        number
  byType:       Record<string, number>
  bySystem:     Record<string, number>
  byFeedback:   Record<string, number>
  exportReady:  number
  negativePairs: number
  unexported:   number
  estimatedReadyForFinetune: boolean
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface TrainingExample {
  id:           string
  exampleType:  string
  system:       string | null
  trigger:      string | null
  feedback:     string | null
  qualityScore: number | null
  exported:     boolean
  createdAt:    string
  completion:   string | null
}

function ExampleReviewPanel() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const limit = 10

  const { data, isLoading, refetch } = useQuery<{ total: number; rows: TrainingExample[] }>({
    queryKey:  ['waanda-examples-review', page],
    queryFn:   () => api.get(`/admin/waanda-training/examples?feedback=unlabelled&limit=${limit}&offset=${page * limit}`).then(r => r.data),
    enabled:   !isDemo(),
    staleTime: 30_000,
  })

  const rate = useMutation({
    mutationFn: ({ id, quality }: { id: string; quality: number }) =>
      api.post(`/admin/waanda-training/examples/${id}/rate`, { quality }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['waanda-examples-review'] }),
  })

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/waanda-training/examples/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['waanda-examples-review'] }),
  })

  const rows  = data?.rows ?? []
  const total = data?.total ?? 0

  return (
    <div className="rounded-3xl p-6" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ThumbsUp style={{ width: 18, height: 18, color: '#00c875' }} />
          <p className="text-base font-bold text-[var(--os-text-1)]">Example Review</p>
          {total > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {total} pending
            </span>
          )}
        </div>
        <button
          onClick={() => refetch()}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--os-surface-0)' }} />
          ))}
        </div>
      )}

      {!isLoading && rows.length === 0 && (
        <div className="py-8 text-center text-sm font-medium text-[var(--os-text-2)]">
          No unlabelled examples — all caught up.
        </div>
      )}

      {!isLoading && rows.length > 0 && (
        <div className="space-y-2">
          {rows.map(ex => (
            <div key={ex.id} className="flex items-start gap-3 p-3 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)]">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(127,83,249,0.12)', color: '#a78bfa' }}>
                    {ex.exampleType}
                  </span>
                  {ex.system && (
                    <span className="text-[10px] font-bold text-[var(--os-text-2)]">{ex.system}</span>
                  )}
                </div>
                <p className="text-xs text-[var(--os-text-2)] line-clamp-2 font-mono leading-relaxed">
                  {ex.completion ?? '(no completion)'}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => rate.mutate({ id: ex.id, quality: 1.0 })}
                  disabled={rate.isPending}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-green-500/15 text-green-500 disabled:opacity-40"
                  title="Approve"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => rate.mutate({ id: ex.id, quality: 0.0 })}
                  disabled={rate.isPending}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-amber-500/15 text-amber-500 disabled:opacity-40"
                  title="Dismiss (low quality)"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => del.mutate(ex.id)}
                  disabled={del.isPending}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/15 text-red-500 disabled:opacity-40"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > limit && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--os-border)]">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="text-xs font-bold text-[var(--os-text-2)] disabled:opacity-30 hover:text-[var(--os-text-1)] transition-colors"
          >
            ← Prev
          </button>
          <span className="text-xs text-[var(--os-text-2)]">{page + 1} / {Math.ceil(total / limit)}</span>
          <button
            disabled={(page + 1) * limit >= total}
            onClick={() => setPage(p => p + 1)}
            className="text-xs font-bold text-[var(--os-text-2)] disabled:opacity-30 hover:text-[var(--os-text-1)] transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{
        color:      ok ? '#00c875' : '#fdab3d',
        background: ok ? 'rgba(0,200,117,0.08)' : 'rgba(253,171,61,0.08)',
        border:     `1px solid ${ok ? 'rgba(0,200,117,0.2)' : 'rgba(253,171,61,0.2)'}`,
      }}>
      <Circle style={{ width: 6, height: 6, fill: ok ? '#00c875' : '#fdab3d', color: ok ? '#00c875' : '#fdab3d' }} />
      {label}
    </span>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`shadow-[0_32px_64px_rgba(0,0,0,0.04)] bg-[var(--os-card)] overflow-hidden transition-transform hover:-translate-y-1 ${className}`} style={{ borderRadius: 'var(--os-radius-xl)' }}>
      {children}
    </div>
  )
}

// ── Local Model Panel ─────────────────────────────────────────────────────────

function LocalModelPanel({ status }: { status: GenStatus }) {
  const { localModel: lm, trainingProgress: tp } = status
  const recipe = status.recipe

  return (
    <Card>
      <div className="px-6 py-4 border-b border-[var(--os-border)]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider flex items-center gap-2">
            <Cpu style={{ width: 14, height: 14, color: '#7f53f9' }} />
            Gen 2 Local Model
          </p>
          <StatusPill ok={lm.available} label={lm.available ? 'Online' : 'Not loaded'} />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Model info */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[var(--os-text-2)] font-semibold">Model</span>
            <span className="text-[var(--os-text-1)] font-bold">{lm.model}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--os-text-2)] font-semibold">Ollama URL</span>
            <span className="text-[var(--os-text-1)] font-bold">{lm.ollamaUrl}</span>
          </div>
          {lm.loadedModels && lm.loadedModels.length > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-[var(--os-text-2)] font-semibold">Loaded models</span>
              <span className="text-[var(--os-text-1)] font-bold">{lm.loadedModels.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Note */}
        {lm.note && (
          <div className="px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed"
            style={{
              background: lm.available ? 'rgba(0,200,117,0.08)' : 'rgba(253,171,61,0.08)',
              border:     `1px solid ${lm.available ? 'rgba(0,200,117,0.2)' : 'rgba(253,171,61,0.2)'}`,
              color:      lm.available ? '#00c875' : '#fdab3d',
            }}>
            {lm.note}
          </div>
        )}

        {/* Routing behaviour */}
        <div className="space-y-3 pt-4 border-t border-[var(--os-border)]">
          <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider mb-3">Routing behaviour</p>
          {[
            { label: 'REASON phase', value: lm.available ? `→ ${lm.model}` : '→ Claude (fallback)',  ok: lm.available },
            { label: 'SPEAK phase',  value: '→ Claude claude-opus-4-8 (always)',                       ok: true         },
            { label: 'GOVERN phase', value: '→ Claude claude-opus-4-8 (always)',                       ok: true         },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between text-xs">
              <span className="text-[var(--os-text-2)] font-semibold">{r.label}</span>
              <span className="font-bold" style={{ color: r.ok && lm.available ? '#00c875' : 'var(--os-text-2)' }}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Deploy instructions when not loaded */}
        {!lm.available && (
          <div className="pt-4 space-y-3 border-t border-[var(--os-border)]">
            <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider">Deploy instructions</p>
            <div className="bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl p-4 space-y-2">
              {[
                '1. Run the fine-tune script (see below)',
                `2. ollama create ${lm.model} -f ./models/WAANDAx/Modelfile`,
                `3. Set KIMMP_LOCAL_REASON_MODEL=${lm.model}`,
                '4. Restart core-backend — REASON phase auto-switches',
              ].map((step, i) => (
                <p key={i} className="text-xs text-[var(--os-text-1)] leading-relaxed font-mono font-medium">{step}</p>
              ))}
            </div>
          </div>
        )}

        {/* Fine-tune recipe */}
        {recipe && (
          <div className="pt-4 space-y-3 border-t border-[var(--os-border)]">
            <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider mb-3">Fine-tune recipe</p>
            {[
              { label: 'Base model',  value: recipe.baseModel ?? 'Llama-3.2-3B-Instruct' },
              { label: 'Method',      value: recipe.method    ?? 'QLoRA (r=16, 4-bit)' },
              { label: 'Tool',        value: recipe.tool      ?? 'Unsloth' },
              { label: 'Est. time',   value: recipe.estimatedTime ?? '—' },
              { label: 'Est. cost',   value: recipe.estimatedCost ?? '—' },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-xs">
                <span className="text-[var(--os-text-2)] font-semibold">{r.label}</span>
                <span className="text-[var(--os-text-1)] font-bold">{r.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

// ── Training Progress Panel ───────────────────────────────────────────────────

function TrainingProgressPanel({ tp }: { tp: TrainingProgress }) {
  const pct = tp.pct

  return (
    <Card>
      <div className="px-6 py-4 border-b border-[var(--os-border)]">
        <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider flex items-center gap-2">
          <Database style={{ width: 14, height: 14, color: '#7f53f9' }} />
          Training Corpus — REASON examples
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-[var(--os-text-2)]">{tp.reasonExamples.toLocaleString()} / {tp.threshold.toLocaleString()} examples</span>
            <span className="text-sm font-bold" style={{ color: pct >= 100 ? '#00c875' : '#7f53f9' }}>{pct}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden bg-[var(--os-surface-0)] border border-[var(--os-border)]">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width:      `${Math.min(100, pct)}%`,
                background: pct >= 100
                  ? 'linear-gradient(90deg, #00c875, #4ade80)'
                  : 'linear-gradient(90deg, #7f53f9, #2564ea)',
              }} />
          </div>
          <p className="text-[11px] font-semibold text-[var(--os-text-2)] mt-2">
            {pct >= 100
              ? '— Ready to fine-tune. Run the script below.'
              : `— ${Math.max(0, tp.threshold - tp.reasonExamples)} more REASON examples needed. Keep KIMMP running.`}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total examples', value: tp.total },
            { label: 'Export ready',   value: tp.exportReady },
            { label: 'Negative pairs', value: 0 },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 text-center bg-[var(--os-surface-0)] border border-[var(--os-border)] shadow-sm">
              <p className="text-2xl font-black tabular-nums text-[var(--os-text-1)]">{s.value}</p>
              <p className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wide mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {tp.readyToFinetune && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(0,200,117,0.08)', border: '1px solid rgba(0,200,117,0.2)' }}>
            <CheckCircle style={{ width: 16, height: 16, color: '#00c875', flexShrink: 0 }} />
            <p className="text-xs text-[#00c875] font-bold">
              Threshold reached — ready to fine-tune.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

// ── Corpus stats panel ────────────────────────────────────────────────────────

function CorpusPanel({ stats }: { stats: CorpusStats }) {
  const byType    = stats.byType    ?? {}
  const bySystem  = stats.bySystem  ?? {}
  const byFeedback = stats.byFeedback ?? {}

  return (
    <Card>
      <div className="px-6 py-4 border-b border-[var(--os-border)]">
        <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider flex items-center gap-2">
          <Activity style={{ width: 14, height: 14, color: '#7f53f9' }} />
          Full Corpus
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* By type */}
        <div>
          <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider mb-3">By example type</p>
          <div className="space-y-3">
            {Object.entries(byType).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[var(--os-text-2)] w-24 flex-shrink-0">{type}</span>
                <div className="flex-1 h-5 rounded-full overflow-hidden bg-[var(--os-surface-0)] border border-[var(--os-border)]">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(4, (count / Math.max(...Object.values(byType))) * 100)}%`,
                      background: type === 'REASON' ? 'linear-gradient(90deg, #7f53f9, #2564ea)' : type === 'SPEAK' ? 'linear-gradient(90deg, #2564ea, #06b6d4)' : 'var(--os-border)',
                    }} />
                </div>
                <span className="text-xs font-bold tabular-nums text-[var(--os-text-1)] w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By system */}
        {Object.keys(bySystem).length > 0 && (
          <div className="pt-4 border-t border-[var(--os-border)]">
            <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider mb-3">By system</p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(bySystem).map(([sys, count]) => (
                <div key={sys} className="flex justify-between px-3 py-2 rounded-xl bg-[var(--os-surface-0)] border border-[var(--os-border)]">
                  <span className="text-xs font-semibold text-[var(--os-text-2)]">{sys}</span>
                  <span className="text-xs font-bold text-[var(--os-text-1)]">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quality/feedback */}
        {Object.keys(byFeedback).length > 0 && (
          <div className="pt-4 border-t border-[var(--os-border)]">
            <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider mb-3">Quality labels</p>
            <div className="space-y-2">
              {Object.entries(byFeedback).map(([fb, count]) => {
                const color = fb === 'ACCEPTED' ? '#00c875' : fb === 'DISMISSED' ? '#e2445c' : '#fdab3d'
                return (
                  <div key={fb} className="flex justify-between text-xs">
                    <span className="font-bold" style={{ color }}>{fb ?? 'UNLABELLED'}</span>
                    <span className="text-[var(--os-text-2)] tabular-nums font-semibold">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// ── Fine-tune script panel ────────────────────────────────────────────────────

function ScriptPanel({ modelName }: { modelName: string }) {
  const steps = [
    { n: '1', label: 'Export training data',   cmd: 'curl http://localhost:5050/api/admin/waanda-training/export' },
    { n: '2', label: 'Install Unsloth',         cmd: 'pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"\npip install --no-deps trl peft accelerate bitsandbytes' },
    { n: '3', label: 'Run fine-tune (GPU required)', cmd: 'cd backend\npython scripts/finetune_kimmp_reason.py --export-gguf' },
    { n: '4', label: 'Deploy to Ollama',        cmd: `ollama create ${modelName} -f ./models/WAANDAx/Modelfile` },
    { n: '5', label: 'Set env + restart',        cmd: `KIMMP_LOCAL_REASON_MODEL=${modelName}\nKIMMP_OLLAMA_URL=http://localhost:11434\n\ndocker compose up -d core-backend` },
  ]

  return (
    <Card>
      <div className="px-6 py-4 border-b border-[var(--os-border)]">
        <p className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider flex items-center gap-2">
          <Zap style={{ width: 14, height: 14, color: '#7f53f9' }} />
          Fine-Tune Deployment Steps
        </p>
      </div>
      <div className="p-6 space-y-4">
        {steps.map(s => (
          <div key={s.n} className="flex gap-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(127,83,249,0.15)', border: '1px solid rgba(127,83,249,0.3)' }}>
              <span className="text-[10px] font-black text-[#7f53f9]">{s.n}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--os-text-1)] mb-1.5">{s.label}</p>
              <pre className="text-xs text-[var(--os-text-2)] font-mono leading-relaxed whitespace-pre-wrap break-all p-3 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] shadow-sm">
                {s.cmd}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function TrainingPage() {
  const { data: genStatus, isLoading: loadingStatus } = useQuery<GenStatus>({
    queryKey:       ['waanda-gen2-status'],
    queryFn:        () => api.get('/admin/waanda-training/local-model/status').then(r => r.data),
    enabled:        !isDemo(),
    staleTime:      30_000,
    refetchInterval: 30_000,
  })

  const { data: corpusStats, isLoading: loadingCorpus } = useQuery<CorpusStats>({
    queryKey:       ['waanda-training-stats'],
    queryFn:        () => api.get('/admin/waanda-training/stats').then(r => r.data),
    enabled:        !isDemo(),
    staleTime:      60_000,
    refetchInterval: 60_000,
  })

  const isLoading = loadingStatus || loadingCorpus

  if (isLoading && !genStatus) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-xl p-6" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
            <div className="h-3 w-48 rounded animate-pulse mb-3" style={{ background: '#1f2a4a' }} />
            <div className="h-2 w-full rounded animate-pulse" style={{ background: '#1a2035' }} />
          </div>
        ))}
      </div>
    )
  }

  const tp = genStatus?.trainingProgress
  const lm = genStatus?.localModel

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-6 mb-2 border-b border-[var(--os-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain style={{ width: 24, height: 24, color: '#a78bfa' }} />
            <h2 className="text-xl font-bold text-[var(--os-text-1)] tracking-tight">KIMMP Gen 2 — Local Reasoning Model</h2>
          </div>
          <p className="text-sm font-semibold text-[var(--os-text-2)] leading-relaxed max-w-xl">
            Capture REASON phase training data until 1,000 examples, then fine-tune Llama-3.2-3B-Instruct with QLoRA.
            The local model replaces Claude for routing decisions — Claude stays for synthesis and governance.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {lm && (
            <StatusPill ok={lm.available} label={lm.available ? 'Gen 2 Active' : 'Gen 1 Mode'} />
          )}
          <button
            onClick={async () => {
              const res = await api.get('/admin/waanda-training/export')
              const files: string[] = res.data?.availableExports ?? []
              if (files.length > 0) {
                window.open(`/api/admin/waanda-training/export/${files[0]}`, '_blank')
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
            style={{ background: 'rgba(87,155,252,0.1)', color: '#579bfc', border: '1px solid rgba(87,155,252,0.2)' }}
          >
            <Download className="w-3 h-3" />
            Export JSONL
          </button>
        </div>
      </div>

      {/* Warning if no API key / demo */}
      {isDemo() && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl"
          style={{ background: 'rgba(253,171,61,0.08)', border: '1px solid rgba(253,171,61,0.2)' }}>
          <AlertTriangle style={{ width: 16, height: 16, color: '#fdab3d', flexShrink: 0 }} />
          <p className="text-sm font-bold text-amber-500">Demo mode — training data capture is disabled.</p>
        </div>
      )}

      {/* Top row: local model + training progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {genStatus && <LocalModelPanel status={genStatus} />}
        {tp && <TrainingProgressPanel tp={tp} />}
      </div>

      {/* Script steps */}
      <ScriptPanel modelName={lm?.model ?? 'waandax:latest'} />

      {/* Full corpus stats */}
      {corpusStats && <CorpusPanel stats={corpusStats} />}

      {/* Example review */}
      <ExampleReviewPanel />

      {/* Architecture note */}
      <div className="rounded-3xl p-6 transition-transform hover:-translate-y-1 shadow-[0_32px_64px_rgba(0,0,0,0.04)]" style={{ background: 'var(--os-card)', borderRadius: 'var(--os-radius-xl)' }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <Download style={{ width: 20, height: 20, color: '#a78bfa' }} />
          </div>
          <div>
            <p className="text-base font-bold text-[var(--os-text-1)] mb-2">Gen 2 Architecture</p>
            <p className="text-sm font-medium text-[var(--os-text-2)] leading-relaxed">
              Every KIMMP activation captures the REASON prompt + Claude's response as a training example. Once 1,000
              high-quality REASON examples are labelled, QLoRA fine-tuning on Llama-3.2-3B produces{' '}
              <span className="font-bold text-[var(--os-text-1)]">WAANDAx</span> — a Kangqore-specific routing model.
              The dispatcher automatically switches REASON → local model, SPEAK + GOVERN stay on Claude.
              This eliminates ~50% of Claude API calls and reduces REASON latency from ~1,500 ms to &lt;100 ms.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
