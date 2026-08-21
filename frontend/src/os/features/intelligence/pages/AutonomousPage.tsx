// Layer 4 — Autonomous: "Execute it."
// Shows AutonomousExecution records and lets admins trigger new cycles.

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { RefreshCw, Zap, ChevronDown, ChevronRight, Play } from 'lucide-react'

const STATUS_COLOR: Record<string, string> = {
  REASONING:        'text-blue-400   bg-blue-400/10',
  PROPOSING:        'text-indigo-400 bg-indigo-400/10',
  GOVERNING:        'text-violet-400 bg-violet-400/10',
  PENDING_APPROVAL: 'text-amber-400  bg-amber-400/10',
  EXECUTING:        'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent   bg-cyan-400/10',
  OBSERVING:        'text-teal-400   bg-teal-400/10',
  LEARNING:         'text-green-400  bg-green-400/10',
  COMPLETE:         'text-emerald-500 bg-emerald-500/10',
  FAILED:           'text-red-500    bg-red-500/10',
}

function StatusPill({ status }: { status: string }) {
  const cls = STATUS_COLOR[status] ?? 'text-[var(--os-text-2)] bg-[var(--os-bg-2)]'
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{status.replace('_', ' ')}</span>
}

function AERow({ ae, onResume }: { ae: any; onResume: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-[var(--os-border)] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--os-bg-hover)] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-3)]" /> : <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-3)]" />}
          <StatusPill status={ae.status} />
          <span className="text-sm font-medium text-[var(--os-text-1)]">{ae.triggerType}</span>
          {ae.proposal?.actionName && (
            <span className="text-xs text-[var(--os-text-2)]">→ {ae.proposal.actionName}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--os-text-3)]">
          {ae.durationMs > 0 && <span>{(ae.durationMs / 1000).toFixed(1)}s</span>}
          {ae.status === 'PENDING_APPROVAL' && (
            <button
              onClick={e => { e.stopPropagation(); onResume(ae.id) }}
              className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
            >
              Resume after approval
            </button>
          )}
          <span>{new Date(ae.startedAt).toLocaleString()}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-[var(--os-border)] space-y-3 text-xs">
          {ae.reasoning && (
            <div>
              <div className="text-[var(--os-text-3)] font-medium mb-1">REASONING</div>
              <p className="text-[var(--os-text-2)] leading-relaxed whitespace-pre-wrap">{ae.reasoning}</p>
            </div>
          )}
          {ae.proposal && (
            <div>
              <div className="text-[var(--os-text-3)] font-medium mb-1">PROPOSAL</div>
              <div className="flex gap-3">
                <span className="font-medium text-[var(--os-text-1)]">{ae.proposal.actionName}</span>
                <span className="text-[var(--os-text-2)]">{ae.proposal.rationale}</span>
                <span className="text-[#579bfc]">confidence: {ae.proposal.confidence}%</span>
              </div>
              {Object.keys(ae.proposal.params ?? {}).length > 0 && (
                <pre className="mt-1 text-[0.65rem] bg-[var(--os-bg-2)] p-2 rounded overflow-x-auto">
                  {JSON.stringify(ae.proposal.params, null, 2)}
                </pre>
              )}
            </div>
          )}
          {ae.governanceVerdict && (
            <div>
              <div className="text-[var(--os-text-3)] font-medium mb-1">GOVERNANCE</div>
              <span className={ae.governanceVerdict === 'DENY' ? 'text-red-500' : ae.governanceVerdict === 'REQUIRE_APPROVAL' ? 'text-amber-500' : 'text-emerald-500'}>
                {ae.governanceVerdict}
              </span>
              {ae.policyName && <span className="text-[var(--os-text-2)] ml-2">({ae.policyName})</span>}
            </div>
          )}
          {ae.outcome && (
            <div>
              <div className="text-[var(--os-text-3)] font-medium mb-1">OUTCOME</div>
              <pre className="text-[0.65rem] bg-[var(--os-bg-2)] p-2 rounded overflow-x-auto">
                {JSON.stringify(ae.outcome, null, 2)}
              </pre>
            </div>
          )}
          {ae.learnNote && (
            <div>
              <div className="text-[var(--os-text-3)] font-medium mb-1">LEARNING</div>
              <p className="text-[var(--os-text-2)] italic">{ae.learnNote}</p>
            </div>
          )}
          {ae.errorMessage && (
            <div className="text-red-500">
              <div className="font-medium mb-1">ERROR</div>
              <p>{ae.errorMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function AutonomousPage() {
  const qc = useQueryClient()
  const [status, setStatus] = useState('')
  const [showTrigger, setShowTrigger] = useState(false)
  const [contextJson, setContextJson] = useState('{\n  "signal": "manual trigger"\n}')
  const [jsonError, setJsonError] = useState('')

  const { data: rows = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['intelligence', 'autonomous', status],
    queryFn: () => api.get('/admin/intelligence/autonomous', { params: { status: status || undefined, limit: 20 } }).then(r => r.data),
    staleTime: 15_000,
    refetchInterval: 8_000,  // poll since executions run async
  })

  const trigger = useMutation({
    mutationFn: (context: any) => api.post('/admin/intelligence/autonomous/trigger', { context, triggerType: 'MANUAL' }),
    onSuccess: () => { setShowTrigger(false); qc.invalidateQueries({ queryKey: ['intelligence', 'autonomous'] }) },
  })

  const resume = useMutation({
    mutationFn: (id: string) => api.post(`/admin/intelligence/autonomous/${id}/resume`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['intelligence', 'autonomous'] }),
  })

  function handleTrigger() {
    try {
      const ctx = JSON.parse(contextJson)
      setJsonError('')
      trigger.mutate(ctx)
    } catch {
      setJsonError('Invalid JSON')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="text-sm bg-[var(--os-bg-2)] border border-[var(--os-border)] rounded px-2 py-1.5 text-[var(--os-text-1)]"
          >
            <option value="">All states</option>
            {['REASONING','PROPOSING','GOVERNING','PENDING_APPROVAL','EXECUTING','OBSERVING','LEARNING','COMPLETE','FAILED'].map(s => (
              <option key={s} value={s}>{s.replace('_',' ')}</option>
            ))}
          </select>
          <button onClick={() => refetch()} className="flex items-center gap-1.5 text-xs text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-xs text-[var(--os-text-3)]">Auto-refreshes every 8s</span>
        </div>
        <button
          onClick={() => setShowTrigger(t => !t)}
          className="flex items-center gap-2 text-sm px-3 py-1.5 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 rounded transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          Trigger Autonomous Cycle
        </button>
      </div>

      {showTrigger && (
        <div className="border border-[var(--os-border)] rounded-2xl p-4 space-y-3">
          <div className="text-sm font-medium text-[var(--os-text-1)]">Manual Trigger</div>
          <div className="text-xs text-[var(--os-text-2)]">Provide a JSON context object. KIMMP will reason about it and propose an action.</div>
          <textarea
            value={contextJson}
            onChange={e => { setContextJson(e.target.value); setJsonError('') }}
            rows={5}
            className="w-full text-xs font-mono bg-[var(--os-bg-2)] border border-[var(--os-border)] rounded px-3 py-2 text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
          />
          {jsonError && <div className="text-xs text-red-500">{jsonError}</div>}
          <div className="flex gap-2">
            <button
              onClick={handleTrigger}
              disabled={trigger.isPending}
              className="flex items-center gap-2 text-sm px-4 py-1.5 bg-[#579bfc] hover:bg-[#4a8be0] text-white rounded transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {trigger.isPending ? 'Triggering…' : 'Run Cycle'}
            </button>
            <button onClick={() => setShowTrigger(false)} className="text-sm px-3 py-1.5 text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading && <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Loading executions…</div>}

      {!isLoading && rows.length === 0 && (
        <div className="text-center py-16 text-[var(--os-text-2)] text-sm">
          No autonomous cycles yet. Trigger one to begin.
        </div>
      )}

      <div className="space-y-2">
        {rows.map((ae: any) => (
          <AERow key={ae.id} ae={ae} onResume={id => resume.mutate(id)} />
        ))}
      </div>
    </div>
  )
}
