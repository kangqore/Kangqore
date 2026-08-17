import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FlowArrow, Play, Sparkle, CheckCircle, Trash, Plus, PencilSimple, X } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { pipelineService, type OntologyPipeline } from '../pipelineService'

// S305 — "The ontology is no longer manually curated. It stays alive
// automatically." PipelineDashboard: list every pipeline, its last run,
// object count, a manual trigger, and a field-mapping editor.

function timeAgo(date: string | null) {
  if (!date) return 'never run'
  const d = Date.now() - new Date(date).getTime()
  const m = Math.floor(d / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function FieldMappingEditor({ pipeline, onClose }: { pipeline: OntologyPipeline; onClose: () => void }) {
  const qc = useQueryClient()
  const [rows, setRows] = useState<Array<[string, string]>>(Object.entries(pipeline.fieldMapping))

  const save = useMutation({
    mutationFn: () => pipelineService.update(pipeline.id, { fieldMapping: Object.fromEntries(rows.filter(([k]) => k.trim())) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ontology-pipelines'] }); onClose() },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--os-text-1)]">{pipeline.name} — Field Mapping</p>
          <button onClick={onClose}><X size={14} className="text-[var(--os-text-2)]" /></button>
        </div>
        <p className="text-[10px] text-[var(--os-text-2)]">ontologyProperty ← sourceField (from <code className="font-mono">{pipeline.sourceQuery?.model}</code>)</p>
        <div className="space-y-1.5">
          {rows.map(([k, v], i) => (
            <div key={i} className="flex items-center gap-1.5">
              <input value={k} onChange={e => setRows(rows.map((r, idx) => idx === i ? [e.target.value, r[1]] : r))}
                placeholder="ontologyProperty" className="flex-1 px-2 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
              <span className="text-[var(--os-text-2)] text-xs">←</span>
              <input value={v} onChange={e => setRows(rows.map((r, idx) => idx === i ? [r[0], e.target.value] : r))}
                placeholder="sourceField" className="flex-1 px-2 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
              <button onClick={() => setRows(rows.filter((_, idx) => idx !== i))} className="text-[var(--os-text-2)] hover:text-red-400 p-1"><Trash size={12} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setRows([...rows, ['', '']])} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#579bfc]">
          <Plus size={12} /> Add field
        </button>
        <button onClick={() => save.mutate()} disabled={save.isPending}
          className="w-full py-2 rounded-2xl bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5] disabled:opacity-50 flex items-center justify-center gap-2">
          {save.isPending ? <Loader2 size={14} className="animate-spin" /> : 'Save Mapping'}
        </button>
      </div>
    </div>
  )
}

function PipelineCard({ pipeline }: { pipeline: OntologyPipeline }) {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const run = useMutation({
    mutationFn: () => pipelineService.run(pipeline.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ontology-pipelines'] }); qc.invalidateQueries({ queryKey: ['ontology-objects'] }) },
  })
  const toggle = useMutation({
    mutationFn: () => pipelineService.update(pipeline.id, { enabled: !pipeline.enabled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ontology-pipelines'] }),
  })

  return (
    <div className="os-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--os-text-1)] truncate">{pipeline.name}</p>
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">
            {pipeline.sourceType} · {pipeline.sourceQuery?.model ?? '—'} → {pipeline.targetType?.displayName ?? pipeline.targetTypeId.slice(0, 8)}
          </p>
        </div>
        <p className="text-2xl font-black text-[var(--os-text-1)] leading-none flex-shrink-0">{pipeline.lastObjectCount}</p>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-[var(--os-text-2)]">
        <span className="px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] font-mono">{pipeline.schedule}</span>
        <span>{timeAgo(pipeline.lastRunAt)}</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--os-border)]">
        <button onClick={() => toggle.mutate()} className={`text-[10px] font-semibold px-2 py-1 rounded-2xl border ${pipeline.enabled ? 'border-emerald-500/30 text-emerald-400' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
          {pipeline.enabled ? 'Enabled' : 'Disabled'}
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => setEditing(true)} title="Edit field mapping" className="p-1.5 rounded-2xl text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)]"><PencilSimple size={13} /></button>
          <button onClick={() => run.mutate()} disabled={run.isPending} title="Run now" className="p-1.5 rounded-2xl text-[var(--os-text-2)] hover:text-[#579bfc] hover:bg-[var(--os-surface-0)]">
            {run.isPending ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} weight="fill" />}
          </button>
        </div>
      </div>
      {editing && <FieldMappingEditor pipeline={pipeline} onClose={() => setEditing(false)} />}
    </div>
  )
}

export function PipelineDashboardPage() {
  const qc = useQueryClient()
  const [seeded, setSeeded] = useState(false)
  const { data, isLoading } = useQuery({ queryKey: ['ontology-pipelines'], queryFn: () => pipelineService.list() })
  const pipelines = data ?? []

  const seed = useMutation({
    mutationFn: () => pipelineService.seedBuiltins(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ontology-pipelines'] }); setSeeded(true) },
  })
  const runAll = useMutation({
    mutationFn: () => pipelineService.runAll(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ontology-pipelines'] }); qc.invalidateQueries({ queryKey: ['ontology-objects'] }) },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-black text-[var(--os-text-1)] flex items-center gap-2"><FlowArrow size={18} weight="fill" /> Data Pipelines</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">Live object population — clients, projects, and team members stay synced automatically.</p>
        </div>
        <div className="flex items-center gap-2">
          {pipelines.length === 0 && !isLoading && (
            <button onClick={() => seed.mutate()} disabled={seed.isPending || seeded}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-[var(--os-border)] text-xs font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] disabled:opacity-50">
              {seeded ? <CheckCircle size={13} weight="bold" /> : <Sparkle size={13} />} {seeded ? 'Seeded' : 'Seed Built-in Pipelines'}
            </button>
          )}
          {pipelines.length > 0 && (
            <button onClick={() => runAll.mutate()} disabled={runAll.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--os-accent)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50">
              {runAll.isPending ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} weight="fill" />} Run All
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="os-card p-4 h-32 animate-pulse bg-[var(--os-surface-0)]" />)}
        </div>
      ) : pipelines.length === 0 ? (
        <div className="os-card p-12 flex flex-col items-center gap-3 text-center">
          <FlowArrow size={32} className="text-[var(--os-text-2)]" />
          <p className="text-sm text-[var(--os-text-1)] font-semibold">No pipelines yet</p>
          <p className="text-xs text-[var(--os-text-2)]">Seed the built-ins to auto-populate Client, Project, and Resource objects from real data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelines.map(p => <PipelineCard key={p.id} pipeline={p} />)}
        </div>
      )}
    </div>
  )
}
