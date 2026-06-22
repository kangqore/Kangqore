import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bot, ChevronDown, ChevronRight, Play } from 'lucide-react'
import { api } from '@lib/api'
import { cn } from '@design-system/cn'

const VERDICT_STYLES: Record<string, string> = {
  PASS:     'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  INFO:     'text-sky-400     bg-sky-500/10     border-sky-500/20',
  WARN:     'text-amber-400   bg-amber-500/10   border-amber-500/20',
  CRITICAL: 'text-red-400     bg-red-500/10     border-red-500/20',
}

const ENGINE_COLORS: Record<string, string> = {
  GOVERNANCE_OPS:       'text-violet-300',
  SOVEREIGNTY:          'text-purple-300',
  AUDIT_LEDGER:         'text-blue-300',
  AUTONOMY_BOUNDARY:    'text-indigo-300',
  ACCESS_SENTINEL:      'text-rose-300',
  INTELLIGENCE_REGISTRY:'text-emerald-300',
  EGRESS_CONTROL:       'text-amber-300',
  POLICY:               'text-cyan-300',
  TRUST_COMPLIANCE:     'text-teal-300',
  RISK_INTELLIGENCE:    'text-orange-300',
}

function RunRow({ run }: { run: any }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left"
      >
        {open ? <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
               : <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
        <span className={`text-[11px] font-mono px-2 py-0.5 border rounded flex-shrink-0 ${VERDICT_STYLES[run.verdict] ?? VERDICT_STYLES.INFO}`}>
          {run.verdict}
        </span>
        <span className="text-xs text-slate-300 font-mono flex-shrink-0">{run.agentId}</span>
        <span className={`text-[10px] flex-shrink-0 ${ENGINE_COLORS[run.engine] ?? 'text-slate-400'}`}>[{run.engine}]</span>
        <span className="text-xs text-slate-400 flex-1 truncate">{run.summary}</span>
        <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 ml-auto">
          {run.durationMs}ms · {new Date(run.raisedAt).toLocaleTimeString()}
        </span>
      </button>

      {open && (
        <div className="border-t border-white/10 px-4 py-3 bg-white/[0.02] space-y-3">
          {run.findings?.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5">Findings</p>
              <ul className="space-y-1">
                {run.findings.map((f: string, i: number) => (
                  <li key={i} className="text-xs text-slate-300 flex gap-2">
                    <span className="text-slate-600">·</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {run.actions?.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5">Recommended Actions</p>
              <ul className="space-y-1">
                {run.actions.map((a: string, i: number) => (
                  <li key={i} className="text-xs text-amber-300 flex gap-2">
                    <span className="text-amber-600">→</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function AegisAgentsPage() {
  const [engineFilter, setEngineFilter] = useState('')
  const [verdictFilter, setVerdictFilter] = useState('')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 30

  const { data: registryData } = useQuery({
    queryKey: ['aegis-agent-registry'],
    queryFn:  () => api.get('/admin/aegis/agents').then(r => r.data),
    staleTime: 300_000,
  })

  const { data: runsData, isLoading, refetch } = useQuery({
    queryKey: ['aegis-agent-runs', engineFilter, verdictFilter, page],
    queryFn:  () => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) })
      if (engineFilter)  params.set('engine',  engineFilter)
      if (verdictFilter) params.set('verdict', verdictFilter)
      return api.get(`/admin/aegis/agents/runs?${params}`).then(r => r.data)
    },
    staleTime: 15_000,
    refetchInterval: 60_000,
  })

  const engines: string[] = registryData?.engines ? Object.keys(registryData.engines) : []
  const runs: any[]  = runsData?.rows  ?? []
  const total        = runsData?.total ?? 0
  const regStats     = registryData?.engines ?? {}

  const criticalCount = runs.filter((r: any) => r.verdict === 'CRITICAL').length
  const warnCount     = runs.filter((r: any) => r.verdict === 'WARN').length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl p-4 flex items-start gap-3">
        <Bot className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-violet-300 mb-0.5">AEGIS Agent Corps</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {registryData?.total ?? 80} agents across {engines.length} engines — continuously monitoring KIMMP governance.
            Phase 1 (Governance Ops) is fully active. Phases 2–4 run with live ledger data.
          </p>
        </div>
        <div className="flex gap-3 text-right flex-shrink-0">
          <div>
            <p className="text-lg font-bold text-white">{registryData?.total ?? 80}</p>
            <p className="text-[10px] text-slate-500">agents</p>
          </div>
          <div>
            <p className="text-lg font-bold text-red-400">{criticalCount}</p>
            <p className="text-[10px] text-slate-500">critical</p>
          </div>
          <div>
            <p className="text-lg font-bold text-amber-400">{warnCount}</p>
            <p className="text-[10px] text-slate-500">warn</p>
          </div>
        </div>
      </div>

      {/* Engine chip summary */}
      {engines.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(regStats).map(([eng, count]) => (
            <button
              key={eng}
              onClick={() => { setEngineFilter(e => e === eng ? '' : eng); setPage(0) }}
              className={cn(
                'text-[10px] font-mono px-2.5 py-1 rounded-md border transition-all',
                engineFilter === eng
                  ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
              )}
            >
              {eng} · {count as number}
            </button>
          ))}
        </div>
      )}

      {/* Filters + run button */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={verdictFilter}
          onChange={e => { setVerdictFilter(e.target.value); setPage(0) }}
          className="text-xs bg-white/5 border border-white/10 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-violet-500/50"
        >
          <option value="">All verdicts</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="WARN">WARN</option>
          <option value="PASS">PASS</option>
          <option value="INFO">INFO</option>
        </select>

        <span className="text-xs text-slate-500 ml-auto">{total} runs</span>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 border border-violet-500/30 hover:border-violet-500/50 rounded-lg px-3 py-1.5 transition-all"
        >
          <Play className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {/* Run history */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />)}
        </div>
      ) : runs.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <Bot className="w-8 h-8 text-slate-700 mx-auto" />
          <p className="text-slate-500 text-sm">No agent runs yet.</p>
          <p className="text-slate-600 text-xs">The AEGIS scheduler fires within 5s of server boot.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {runs.map((run: any) => <RunRow key={run.id} run={run} />)}
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
            ← Prev
          </button>
          <span className="text-xs text-slate-500">Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PAGE_SIZE >= total}
            className="text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
