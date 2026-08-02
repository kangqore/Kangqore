import { useQuery } from '@tanstack/react-query'
import { Gauge, Info } from '@phosphor-icons/react'
import { agentStudioService } from '../agentStudioService'

// S324 — Agent Performance + Audit. Full per-row granularity only for
// KimmpAgent rows run through S321's runtime; the 38 KIMMP + 80 AEGIS
// hardcoded agents aren't individually attributable in LlmCallLog today
// (see the reality-check on the backend route) — shown as honest aggregate
// buckets below rather than faked per-agent rows.

function fmtCost(c: number) { return c < 0.01 && c > 0 ? '<$0.01' : `$${c.toFixed(2)}` }

export function AgentPerformancePage() {
  const { data, isLoading } = useQuery({ queryKey: ['agent-performance'], queryFn: () => agentStudioService.performance() })

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="os-card h-24 animate-pulse bg-[var(--os-surface-0)]" />)}</div>

  const agents = data?.agents ?? []
  const legacy = data?.legacyBuckets ?? []

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-[var(--os-text-2)] flex items-center gap-1.5">
          <Gauge size={13} /> 30-day window · calls, cost, tool invocations, and eval scores joined by agent
        </p>
      </div>

      {agents.length === 0 ? (
        <div className="os-card p-8 text-center text-xs text-[var(--os-text-2)]">No DB-defined agents yet — create one in the Builder tab to see it here.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {agents.map(p => (
            <div key={p.agent.id} className="os-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[var(--os-text-1)]">{p.agent.name}</p>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">{p.agent.status}</span>
              </div>
              <p className="text-[10px] text-[var(--os-text-2)]">{p.agent.role}</p>
              <div className="grid grid-cols-4 gap-2 text-center pt-1">
                <div><p className="text-base font-black text-[var(--os-text-1)] tabular-nums">{p.callCount}</p><p className="text-[8px] text-[var(--os-text-2)] uppercase">Calls</p></div>
                <div><p className="text-base font-black text-[var(--os-text-1)] tabular-nums">{fmtCost(p.cost)}</p><p className="text-[8px] text-[var(--os-text-2)] uppercase">Cost</p></div>
                <div><p className="text-base font-black text-[var(--os-text-1)] tabular-nums">{p.avgLatencyMs}ms</p><p className="text-[8px] text-[var(--os-text-2)] uppercase">Avg latency</p></div>
                <div><p className="text-base font-black text-[var(--os-text-1)] tabular-nums">{p.toolInvocations}</p><p className="text-[8px] text-[var(--os-text-2)] uppercase">Tool calls</p></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[var(--os-text-2)] pt-1 border-t border-[var(--os-border)]">
                <span>{p.runCount} runs logged</span>
                {p.errorCount > 0 && <span className="text-red-400 font-semibold">{p.errorCount} errors</span>}
                <span>{p.avgQuality != null ? `${p.avgQuality.toFixed(1)}/5 quality (${p.evalCount})` : 'No evaluations yet'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Info size={12} className="text-[var(--os-text-2)]" />
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--os-text-2)]">Legacy hardcoded agents — aggregate only</p>
        </div>
        <p className="text-[10px] text-[var(--os-text-2)] mb-2 max-w-xl">
          The 38 KIMMP orchestrator agents all log under one <code className="font-mono">agentRole</code> ("orchestrator"), and AEGIS's ~40 shared <code className="font-mono">callLLM()</code> callers set no per-agent role at all — so today these can only be shown as aggregate buckets, not broken out per individual agent. Migrating those 118 existing call sites to per-agent attribution is future scope.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {legacy.map(b => (
            <div key={b.label} className="os-card p-3 space-y-1.5 opacity-80">
              <p className="text-[11px] font-bold text-[var(--os-text-1)]">{b.label}</p>
              <div className="flex items-center justify-between text-[10px] text-[var(--os-text-2)]">
                <span>{b.callCount} calls</span>
                <span>{fmtCost(b.cost)}</span>
                <span>{b.avgLatencyMs}ms</span>
                {b.errorCount > 0 && <span className="text-red-400">{b.errorCount} errors</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
