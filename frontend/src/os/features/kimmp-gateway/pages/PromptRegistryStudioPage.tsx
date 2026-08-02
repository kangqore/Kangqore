import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  MagicWand, ClockCounterClockwise, ArrowsClockwise, FileText, Plus, X, CaretDown, CaretUp, Warning,
} from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { promptRegistryService, type PromptNameSummary } from '../promptRegistryService'

// S312 — Prompt Registry Studio. The registry (AIPrompt + PromptRegistry
// service — versioning, rollback, admin API) already existed end to end
// before this sprint; this page is the UI that was missing, plus a
// calls-today panel wired to the S311 LlmCallLog<->AIPrompt link.

// Minimal line-based diff — LCS over lines. Prompts are short paragraphs,
// so this is plenty fast without pulling in a diff library.
function diffLines(a: string, b: string): Array<{ type: 'same' | 'add' | 'remove'; text: string }> {
  const linesA = a.split('\n')
  const linesB = b.split('\n')
  const m = linesA.length, n = linesB.length
  const lcs: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      lcs[i][j] = linesA[i] === linesB[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }
  const out: Array<{ type: 'same' | 'add' | 'remove'; text: string }> = []
  let i = 0, j = 0
  while (i < m && j < n) {
    if (linesA[i] === linesB[j]) { out.push({ type: 'same', text: linesA[i] }); i++; j++ }
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) { out.push({ type: 'remove', text: linesA[i] }); i++ }
    else { out.push({ type: 'add', text: linesB[j] }); j++ }
  }
  while (i < m) { out.push({ type: 'remove', text: linesA[i] }); i++ }
  while (j < n) { out.push({ type: 'add', text: linesB[j] }); j++ }
  return out
}

function DiffView({ before, after }: { before: string; after: string }) {
  const lines = diffLines(before, after)
  return (
    <pre className="text-[11px] font-mono bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg p-3 overflow-x-auto leading-relaxed">
      {lines.map((l, i) => (
        <div key={i} style={{
          background: l.type === 'add' ? 'rgba(16,185,129,0.12)' : l.type === 'remove' ? 'rgba(239,68,68,0.12)' : 'transparent',
          color: l.type === 'add' ? '#10b981' : l.type === 'remove' ? '#ef4444' : 'var(--os-text-1)',
        }}>
          {l.type === 'add' ? '+ ' : l.type === 'remove' ? '- ' : '  '}{l.text || ' '}
        </div>
      ))}
    </pre>
  )
}

function NewPromptWizard({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [notes, setNotes] = useState('')
  const [created, setCreated] = useState<string | null>(null)

  const create = useMutation({
    mutationFn: () => promptRegistryService.create(name.trim(), content, notes || undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['prompt-registry'] }); setCreated(name.trim()) },
  })

  if (created) {
    return (
      <div className="os-card p-4 space-y-3 border-emerald-500/30">
        <p className="text-xs font-bold text-[var(--os-text-1)]">Registered. Paste this into a call site:</p>
        <code className="block text-[11px] font-mono bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-md px-3 py-2 text-[var(--os-text-1)]">
          {`{ promptName: '${created}' }`}
        </code>
        <p className="text-[10px] text-[var(--os-text-2)]">Pass it as the 5th arg meta field on <code>sonnet()</code>/<code>haiku()</code>/<code>opus()</code>, or the 4th arg on AEGIS's <code>callLLM()</code> — the caller's existing inline string stays as a safe fallback.</p>
        <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-[11px] font-semibold">Done</button>
      </div>
    )
  }

  return (
    <div className="os-card p-4 space-y-2">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="prompt name (e.g. renewal_summarizer_system)"
        className="w-full px-2.5 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="System prompt content" rows={5}
        className="w-full px-2.5 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none font-mono" />
      <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)"
        className="w-full px-2.5 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
      <div className="flex items-center gap-2">
        <button onClick={() => create.mutate()} disabled={create.isPending || !name.trim() || !content.trim()}
          className="px-3 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-[11px] font-semibold disabled:opacity-50">
          {create.isPending ? <Loader2 size={12} className="animate-spin" /> : 'Register'}
        </button>
        <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--os-text-2)]">Cancel</button>
      </div>
    </div>
  )
}

function PromptCard({ summary }: { summary: PromptNameSummary }) {
  const qc = useQueryClient()
  const [expanded, setExpanded] = useState(false)
  const [compareVersion, setCompareVersion] = useState<number | null>(null)

  const { data: usage } = useQuery({ queryKey: ['prompt-usage', summary.name], queryFn: () => promptRegistryService.usage(summary.name), enabled: expanded })
  const { data: active } = useQuery({ queryKey: ['prompt-content', summary.name, summary.activeVersion], queryFn: () => promptRegistryService.get(summary.name), enabled: expanded })
  const { data: compareTo } = useQuery({
    queryKey: ['prompt-content', summary.name, compareVersion],
    queryFn: () => promptRegistryService.get(summary.name, compareVersion!),
    enabled: expanded && compareVersion !== null,
  })

  const rollback = useMutation({
    mutationFn: (version: number) => promptRegistryService.rollback(summary.name, version),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['prompt-registry'] }); qc.invalidateQueries({ queryKey: ['prompt-content'] }) },
  })

  const versions = Array.from({ length: summary.totalVersions }, (_, i) => summary.totalVersions - i)

  return (
    <div className="os-card p-4 space-y-3">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-[var(--os-text-2)]" />
          <p className="text-sm font-bold text-[var(--os-text-1)]">{summary.name}</p>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">v{summary.activeVersion} active · {summary.totalVersions} version{summary.totalVersions === 1 ? '' : 's'}</span>
        </div>
        {expanded ? <CaretUp size={14} className="text-[var(--os-text-2)]" /> : <CaretDown size={14} className="text-[var(--os-text-2)]" />}
      </div>

      {expanded && (
        <div className="space-y-3 pt-2 border-t border-[var(--os-border)]">
          {usage && (
            <div className="flex items-center gap-4 flex-wrap text-[11px] text-[var(--os-text-2)]">
              <span><strong className="text-[var(--os-text-1)]">{usage.callsToday}</strong> calls today</span>
              <span><strong className="text-[var(--os-text-1)]">{usage.last30Days}</strong> calls / 30d</span>
              {usage.byVersion.map(v => (
                <span key={v.version} className="flex items-center gap-1">
                  v{v.version || '—'}: {v.callCount} calls, ${v.cost.toFixed(2)}{v.errors > 0 ? `, ${v.errors} errors` : ''}
                  {v.regression.flagged && (
                    <span title={`Drift alert: ${v.regression.driftDelta.toFixed(1)}pt drop, score ${v.regression.totalScore.toFixed(0)}, ${new Date(v.regression.at).toLocaleDateString()}`}
                      className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">
                      <Warning size={9} weight="fill" /> DRIFT
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}

          <div>
            <p className="text-[9px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Active content (v{summary.activeVersion})</p>
            <pre className="text-[11px] font-mono bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg p-3 whitespace-pre-wrap text-[var(--os-text-1)]">{active?.content}</pre>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {versions.map(v => (
              <button key={v} onClick={() => setCompareVersion(v === compareVersion ? null : v)}
                className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${v === summary.activeVersion ? 'border-emerald-500/30 text-emerald-400' : compareVersion === v ? 'bg-[var(--os-accent)] text-white border-transparent' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
                v{v}
              </button>
            ))}
            {compareVersion !== null && compareVersion !== summary.activeVersion && (
              <button onClick={() => rollback.mutate(compareVersion)} disabled={rollback.isPending}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-amber-400 border border-amber-500/30">
                <ArrowsClockwise size={11} /> Roll back to v{compareVersion}
              </button>
            )}
          </div>

          {compareTo && compareVersion !== summary.activeVersion && (
            <div>
              <p className="text-[9px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Diff — v{summary.activeVersion} (active) → v{compareVersion}</p>
              <DiffView before={active?.content ?? ''} after={compareTo.content} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function PromptRegistryStudioPage() {
  const { data, isLoading } = useQuery({ queryKey: ['prompt-registry'], queryFn: () => promptRegistryService.list() })
  const [showWizard, setShowWizard] = useState(false)
  const names = data?.names ?? []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight mb-1 flex items-center gap-2" style={{ color: 'var(--os-text-1)' }}>
            <MagicWand size={20} weight="fill" /> Prompt Registry
          </h1>
          <p className="text-xs text-[var(--os-text-2)]">Every system prompt is versioned, stored, and retrievable by name — roll back a bad prompt in seconds.</p>
        </div>
        <button onClick={() => setShowWizard(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--os-accent)] text-white text-xs font-semibold">
          <Plus size={13} /> Register new prompt
        </button>
      </div>

      {showWizard && (
        <div className="relative">
          <button onClick={() => setShowWizard(false)} className="absolute -top-2 -right-2 z-10 p-1 rounded-full bg-[var(--os-card)] border border-[var(--os-border)]"><X size={11} className="text-[var(--os-text-2)]" /></button>
          <NewPromptWizard onClose={() => setShowWizard(false)} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="os-card h-16 animate-pulse bg-[var(--os-surface-0)]" />)}</div>
      ) : names.length === 0 ? (
        <div className="os-card p-12 flex flex-col items-center gap-3 text-center">
          <ClockCounterClockwise size={28} className="text-[var(--os-text-2)]" />
          <p className="text-sm text-[var(--os-text-1)] font-semibold">No prompts registered yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {names.map(n => <PromptCard key={n.name} summary={n} />)}
        </div>
      )}
    </div>
  )
}
