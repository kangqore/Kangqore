import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronDown, ChevronRight, CheckCircle2, XCircle,
  Clock, Zap, Brain, BarChart3, RefreshCw,
} from 'lucide-react'
import { api } from '@lib/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function fmtMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}

// ─── Agent colours ────────────────────────────────────────────────────────────

const AGENT_COLOR: Record<string, string> = {
  SCOUT:                '#7c3aed',
  RESEARCH:             '#7c3aed',
  GOAL_CHECK:           '#059669',
  SIGNAL_READ:          '#2564ea',
  LEAD_ANALYSIS:        '#2564ea',
  FINANCIAL_SNAPSHOT:   '#059669',
  REPORT_GENERATE:      'var(--os-text-2)',
  STRATEGIST:           '#d97706',
  ADVISOR:              '#d97706',
  FORECAST:             '#0ea5e9',
  RISK_ANALYSIS:        '#ef4444',
  OPPORTUNITY_SCAN:     '#10b981',
  COMPETITOR_INTEL:     '#f97316',
  WORKFLOW_ORCHESTRATOR:'var(--os-text-2)',
  EXEC_SUMMARY:         'var(--os-text-2)',
  DECISION_ENGINE:      '#d97706',
  MEMORY_RECALL:        '#8b5cf6',
  TASK_MANAGER:         'var(--os-text-2)',
  MEETING_INTEL:        '#0ea5e9',
  ORGANIZATION_HEALTH:  '#059669',
  CLIENT_INTEL:         '#2564ea',
  KNOWLEDGE_ENGINE:     '#8b5cf6',
  SIMULATION_ENGINE:    '#f59e0b',
  THREAT_DETECTOR:      '#ef4444',
  VULNERABILITY_MANAGER:'#ef4444',
  SECURITY_POSTURE:     '#f97316',
  RISK_MANAGER:         '#ef4444',
  COMPLIANCE_GUARD:     'var(--os-text-2)',
  ATTACK_ANALYZER:      '#ef4444',
  ACCESS_GOVERNOR:      '#f97316',
  ASSET_GUARDIAN:       '#f97316',
  THIRD_PARTY_RISK:     '#f59e0b',
  RESILIENCE_MONITOR:   '#0ea5e9',
  SHADOW_AI_DETECTOR:   '#8b5cf6',
  AGENT_GUARDIAN:       '#8b5cf6',
}

const REC_COLOR: Record<string, string> = {
  YES: '#059669', NO: '#ef4444', CONDITIONAL: '#d97706',
}

function recColor(rec: string) {
  const key = (rec ?? '').toUpperCase().split(' ')[0]
  return REC_COLOR[key] ?? 'var(--os-text-2)'
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--os-text-2)] mb-1">{label}</p>
      <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {sub && <p className="text-xs text-[var(--os-text-2)] mt-0.5">{sub}</p>}
    </div>
  )
}

// ─── Agent pill ───────────────────────────────────────────────────────────────

function AgentPill({ agent, durationMs, success }: { agent: string; durationMs?: number; success?: boolean }) {
  const color = AGENT_COLOR[agent] ?? 'var(--os-text-2)'
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border flex-shrink-0"
      style={{ color, borderColor: `${color}30`, background: `${color}10` }}
    >
      {success === false ? <XCircle className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
      {agent}
      {durationMs != null && <span className="opacity-60">{fmtMs(durationMs)}</span>}
    </span>
  )
}

// ─── Agent trace row (expandable) ────────────────────────────────────────────

function AgentTrace({ result }: { result: any }) {
  const [open, setOpen] = useState(false)
  const color = AGENT_COLOR[result.agentType] ?? 'var(--os-text-2)'

  return (
    <div
      className="rounded-lg border overflow-hidden transition-all"
      style={{ borderColor: open ? `${color}40` : 'var(--os-text-1)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: color }}
        >
          <Brain className="w-3 h-3 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold font-mono" style={{ color }}>{result.agentType}</span>
            {result.role && <span className="text-[10px] text-[var(--os-text-2)] truncate">{result.role}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {result.durationMs != null && (
            <span className="text-[10px] text-[var(--os-text-2)] font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />{fmtMs(result.durationMs)}
            </span>
          )}
          {result.success === false
            ? <XCircle className="w-4 h-4 text-red-400" />
            : <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          }
          {open
            ? <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
            : <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
          }
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-100">
          {result.output ? (
            <pre
              className="text-xs text-[var(--os-text-2)] whitespace-pre-wrap leading-relaxed mt-3 p-3 rounded-lg font-mono"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
              {result.output}
            </pre>
          ) : (
            <p className="text-xs text-[var(--os-text-2)] mt-3 italic">No output recorded.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Orchestration row (expandable) ──────────────────────────────────────────

function OrchestrationRow({ item }: { item: any }) {
  const [open, setOpen] = useState(false)

  const agentResults: any[] = Array.isArray(item.agentResults) ? item.agentResults : []
  const evidence: any[]     = Array.isArray(item.evidence)     ? item.evidence     : []
  const riskFactors: any[]  = Array.isArray(item.riskFactors)  ? item.riskFactors  : []
  const nextSteps: any[]    = Array.isArray(item.nextSteps)    ? item.nextSteps    : []
  const recCol = recColor(item.recommendation ?? '')

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-snug mb-1.5">{item.question}</p>
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-[var(--os-text-2)] font-mono">{item.intent}</span>
            {item.recommendation && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{ color: recCol, background: `${recCol}12` }}
              >
                {item.recommendation.slice(0, 40)}
              </span>
            )}
            <span className="text-[10px] text-[var(--os-text-2)] flex items-center gap-1">
              <Clock className="w-3 h-3" />{fmtMs(item.durationMs)}
            </span>
            <span className="text-[10px] text-[var(--os-text-2)] flex items-center gap-1">
              <Zap className="w-3 h-3" />{(item.agentsUsed ?? []).length} agents
            </span>
            <span className="text-[10px] text-[var(--os-text-2)] flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />{item.confidence}% conf
            </span>
            <span className="text-[10px] text-[var(--os-text-2)] ml-auto">{timeAgo(item.createdAt)}</span>
          </div>
        </div>
        <div className="flex-shrink-0 mt-1">
          {open
            ? <ChevronDown className="w-4 h-4 text-[var(--os-text-2)]" />
            : <ChevronRight className="w-4 h-4 text-[var(--os-text-2)]" />
          }
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-100 space-y-5">

          {/* Summary */}
          {item.summary && (
            <div className="pt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--os-text-2)] mb-2">Summary</p>
              <p className="text-sm text-[var(--os-text-2)] leading-relaxed">{item.summary}</p>
            </div>
          )}

          {/* Agent pills */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--os-text-2)] mb-2">Agents Used</p>
            <div className="flex flex-wrap gap-1.5">
              {(item.agentsUsed ?? []).map((a: string) => {
                const res = agentResults.find((r: any) => r.agentType === a)
                return <AgentPill key={a} agent={a} durationMs={res?.durationMs} success={res?.success} />
              })}
            </div>
          </div>

          {/* Per-agent trace */}
          {agentResults.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--os-text-2)] mb-2">Agent Trace</p>
              <div className="space-y-2">
                {agentResults.map((r: any, i: number) => (
                  <AgentTrace key={i} result={r} />
                ))}
              </div>
            </div>
          )}

          {/* Evidence */}
          {evidence.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--os-text-2)] mb-2">Evidence</p>
              <div className="space-y-1.5">
                {evidence.map((e: any, i: number) => {
                  const color = AGENT_COLOR[e.agent] ?? 'var(--os-text-2)'
                  return (
                    <div key={i} className="flex gap-3 text-xs py-1.5 border-b border-slate-50 last:border-0">
                      <span className="font-bold font-mono flex-shrink-0" style={{ color }}>{e.agent}</span>
                      <span className="text-[var(--os-text-2)]">{e.finding}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Risks + Next Steps */}
          {(riskFactors.length > 0 || nextSteps.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {riskFactors.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-2">Risk Factors</p>
                  <ul className="space-y-1">
                    {riskFactors.map((r: string, i: number) => (
                      <li key={i} className="text-xs text-[var(--os-text-2)] flex gap-1.5">
                        <span className="text-red-400 flex-shrink-0">•</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {nextSteps.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-2">Next Steps</p>
                  <ol className="space-y-1">
                    {nextSteps.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-[var(--os-text-2)] flex gap-1.5">
                        <span className="text-emerald-500 font-bold flex-shrink-0">{i + 1}.</span>{s}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AgentLogsPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['orchestration-history-full'],
    queryFn: () => api.get('/admin/kangqore-immp/orchestrate/history?limit=50').then(r => r.data.history ?? []),
    staleTime: 30_000,
  })

  const logs: any[] = data ?? []

  const totalRuns   = logs.length
  const avgAgents   = logs.length ? Math.round(logs.reduce((s: number, l: any) => s + (l.agentsUsed?.length ?? 0), 0) / logs.length) : 0
  const avgConf     = logs.length ? Math.round(logs.reduce((s: number, l: any) => s + (l.confidence ?? 0), 0) / logs.length) : 0
  const avgDuration = logs.length ? Math.round(logs.reduce((s: number, l: any) => s + (l.durationMs ?? 0), 0) / logs.length) : 0

  const intentFreq: Record<string, number> = {}
  logs.forEach((l: any) => { intentFreq[l.intent] = (intentFreq[l.intent] ?? 0) + 1 })
  const topIntent = Object.entries(intentFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Agent Logs</h2>
          <p className="text-sm text-[var(--os-text-2)] mt-0.5">Every WAANDA orchestration — per-agent trace, evidence, and synthesis</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-[var(--os-text-2)] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat label="Total Runs"      value={totalRuns}          sub="in history"          />
        <Stat label="Avg Agents"      value={avgAgents}          sub="per orchestration"   />
        <Stat label="Avg Confidence"  value={`${avgConf}%`}      sub="synthesis confidence" />
        <Stat label="Avg Duration"    value={fmtMs(avgDuration)} sub="end-to-end"          />
        <Stat label="Top Intent"      value={topIntent}          sub="most frequent query" />
      </div>

      {/* Logs list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl px-5 py-4 space-y-2 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
            <Brain className="w-7 h-7 text-[var(--os-text-1)]" />
          </div>
          <p className="text-base font-semibold text-[var(--os-text-2)]">No orchestrations yet</p>
          <p className="text-sm text-[var(--os-text-2)] mt-1">Ask WAANDA a question to generate the first agent run.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((item: any) => (
            <OrchestrationRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
