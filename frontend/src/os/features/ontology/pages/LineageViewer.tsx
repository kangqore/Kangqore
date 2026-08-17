import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowLeft, Database, Brain, ArrowRight, CaretLeft, CaretRight, Circle } from '@phosphor-icons/react'
import { api } from '@lib/api'

function fmt(d: string) {
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

function ConfidenceDot({ val }: { val?: number | null }) {
  if (val == null) return <span className="text-[var(--os-text-2)]">—</span>
  const pct = Math.round(val * 100)
  const color = pct >= 80 ? 'text-green-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'
  return <span className={`text-xs font-bold ${color}`}>{pct}%</span>
}

function LineageChain({ record }: { record: any }) {
  const sources: any[] = Array.isArray(record.inputSources) ? record.inputSources : []
  const output = record.outputRef as any

  return (
    <div className="os-card p-5 space-y-4">
      {/* Meta row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)]">Lineage record</p>
          <p className="text-xs font-mono text-[var(--os-text-1)] mt-0.5">{record.id}</p>
          {record.agentName && (
            <p className="text-[11px] text-[var(--os-text-2)] mt-0.5 flex items-center gap-1.5">
              <Brain size={11} className="text-purple-400" /> {record.agentName}
              {record.model && <span className="font-mono">· {record.model}</span>}
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <ConfidenceDot val={record.confidence} />
          <p className="text-[10px] text-[var(--os-text-2)] mt-1">{fmt(record.createdAt)}</p>
        </div>
      </div>

      {/* Chain visualisation */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Input sources */}
        <div className="flex flex-col gap-1.5">
          {sources.length === 0 ? (
            <span className="text-[10px] text-[var(--os-text-2)] italic">No sources logged</span>
          ) : (
            sources.map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl px-2.5 py-1.5">
                <Database size={11} className="text-blue-400 flex-shrink-0" />
                <span className="text-[10px] font-mono text-blue-300">
                  {s.table}
                  {s.rowId && <span className="opacity-60">/{String(s.rowId).slice(0, 8)}</span>}
                  {s.field && <span className="opacity-60">.{s.field}</span>}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-0.5 px-2">
          <Brain size={16} className="text-purple-400" />
          <ArrowRight size={14} className="text-[var(--os-text-2)]" />
        </div>

        {/* Output */}
        {output ? (
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-2xl px-2.5 py-1.5">
            <Database size={11} className="text-green-400 flex-shrink-0" />
            <span className="text-[10px] font-mono text-green-300">
              {output.table}
              {output.rowId && <span className="opacity-60">/{String(output.rowId).slice(0, 8)}</span>}
              {output.field && <span className="opacity-60">.{output.field}</span>}
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-[var(--os-text-2)] italic">No output ref</span>
        )}
      </div>

      {/* Decision text */}
      {record.decisionText && (
        <div className="bg-[var(--os-surface-0)] rounded-2xl p-3 border border-[var(--os-border)]">
          <p className="text-[11px] text-[var(--os-text-1)] leading-relaxed">{record.decisionText}</p>
        </div>
      )}

      {/* Tags */}
      {(record.tags ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1">
          {(record.tags as string[]).map((t: string) => (
            <span key={t} className="text-[9px] bg-[var(--os-surface-0)] border border-[var(--os-border)] px-1.5 py-0.5 rounded text-[var(--os-text-2)]">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function LineageViewer() {
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['data-lineage', page],
    queryFn: () => api.get(`/admin/ontology/lineage?page=${page}&limit=20`).then(r => r.data),
    staleTime: 30_000,
  })

  const records: any[] = data?.records ?? []
  const total: number  = data?.total ?? 0
  const pages: number  = data?.pages ?? 1

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to="/kangqore-view/admin/ontology"
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
        >
          <ArrowLeft size={12} /> Ontology
        </Link>
        <span className="text-[var(--os-border)]">/</span>
        <span className="text-[11px] font-semibold text-[var(--os-text-1)]">Data Lineage</span>
        <span className="ml-auto text-xs text-[var(--os-text-2)]">{total} records</span>
      </div>

      <div className="os-card p-4 bg-purple-500/5 border-purple-500/20">
        <p className="text-xs text-purple-300 font-semibold mb-0.5">Active Lineage Tracking</p>
        <p className="text-[11px] text-[var(--os-text-2)] leading-relaxed">
          Every AI-generated insight or mutation is linked here back to the exact data rows, model version,
          and prompt that produced it. This is Kangqore's answer to Palantir's immutable Action Log.
        </p>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="os-card p-5 h-28 animate-pulse bg-[var(--os-surface-0)]" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="os-card p-12 text-center">
          <Brain size={32} className="text-[var(--os-text-2)] mx-auto mb-3" />
          <p className="text-sm text-[var(--os-text-1)] font-semibold">No lineage records yet</p>
          <p className="text-xs text-[var(--os-text-2)] mt-1">
            Records are created automatically when KIMMP agents emit decisions. You can also POST to
            <span className="font-mono"> /api/admin/ontology/lineage</span> from any agent.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r: any) => (
            <div key={r.id}>
              {expanded === r.id ? (
                <LineageChain record={r} />
              ) : (
                <button
                  onClick={() => setExpanded(r.id)}
                  className="os-card w-full p-4 flex items-center gap-4 hover:border-[var(--os-accent)] transition-all text-left"
                >
                  <Circle size={8} className="text-purple-400 flex-shrink-0" weight="fill" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--os-text-1)] truncate">
                      {r.agentName ?? r.agentId ?? 'Unknown agent'}
                      {r.model && <span className="font-normal text-[var(--os-text-2)] ml-2 font-mono">{r.model}</span>}
                    </p>
                    {r.decisionText && (
                      <p className="text-[11px] text-[var(--os-text-2)] truncate mt-0.5">{r.decisionText}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <ConfidenceDot val={r.confidence} />
                    <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{fmt(r.createdAt)}</p>
                  </div>
                  <ArrowRight size={13} className="text-[var(--os-text-2)] flex-shrink-0" />
                </button>
              )}
              {expanded === r.id && (
                <button
                  onClick={() => setExpanded(null)}
                  className="text-[10px] text-[var(--os-text-2)] mt-1 hover:text-[var(--os-text-1)] transition-colors pl-2"
                >
                  Collapse
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[var(--os-text-2)]">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-2xl border border-[var(--os-border)] disabled:opacity-30 hover:bg-[var(--os-surface-0)]"
            >
              <CaretLeft size={13} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="p-1.5 rounded-2xl border border-[var(--os-border)] disabled:opacity-30 hover:bg-[var(--os-surface-0)]"
            >
              <CaretRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
