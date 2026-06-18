import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronDown, ChevronRight, CheckCircle2, XCircle,
  Clock, Zap, Brain, BarChart3, RefreshCw, Search,
  Filter, Download, AlertTriangle, TrendingUp, ScrollText,
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

// ─── Agent colour map ─────────────────────────────────────────────────────────

const AGENT_COLOR: Record<string, string> = {
  SCOUT:                '#7c3aed', RESEARCH:             '#7c3aed',
  GOAL_CHECK:           '#059669', SIGNAL_READ:          '#2564ea',
  LEAD_ANALYSIS:        '#2564ea', FINANCIAL_SNAPSHOT:   '#059669',
  REPORT_GENERATE:      '#64748b', STRATEGIST:           '#d97706',
  ADVISOR:              '#d97706', FORECAST:             '#0ea5e9',
  RISK_ANALYSIS:        '#ef4444', OPPORTUNITY_SCAN:     '#10b981',
  COMPETITOR_INTEL:     '#f97316', WORKFLOW_ORCHESTRATOR:'#64748b',
  EXEC_SUMMARY:         '#64748b', DECISION_ENGINE:      '#d97706',
  MEMORY_RECALL:        '#8b5cf6', TASK_MANAGER:         '#64748b',
  MEETING_INTEL:        '#0ea5e9', ORGANIZATION_HEALTH:  '#059669',
  CLIENT_INTEL:         '#2564ea', KNOWLEDGE_ENGINE:     '#8b5cf6',
  SIMULATION_ENGINE:    '#f59e0b', THREAT_DETECTOR:      '#ef4444',
  VULNERABILITY_MANAGER:'#ef4444', SECURITY_POSTURE:     '#f97316',
  RISK_MANAGER:         '#ef4444', COMPLIANCE_GUARD:     '#64748b',
  ATTACK_ANALYZER:      '#ef4444', ACCESS_GOVERNOR:      '#f97316',
  ASSET_GUARDIAN:       '#f97316', THIRD_PARTY_RISK:     '#f59e0b',
  RESILIENCE_MONITOR:   '#0ea5e9', SHADOW_AI_DETECTOR:   '#8b5cf6',
  AGENT_GUARDIAN:       '#8b5cf6',
}

function agentColor(type: string) {
  return AGENT_COLOR[type] ?? '#64748b'
}

const REC_COLOR: Record<string, string> = {
  YES: '#059669', NO: '#ef4444', CONDITIONAL: '#d97706',
}

function recColor(rec: string) {
  const key = (rec ?? '').toUpperCase().split(' ')[0]
  return REC_COLOR[key] ?? '#64748b'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent = '#2564ea' }: {
  label: string; value: string | number; sub?: string; accent?: string
}) {
  return (
    <div
      className="rounded-xl px-5 py-4"
      style={{ background: `${accent}08`, border: `1px solid ${accent}18` }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: `${accent}80` }}>{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs mt-0.5 text-slate-500">{sub}</p>}
    </div>
  )
}

function AgentPill({ agent, durationMs, success }: { agent: string; durationMs?: number; success?: boolean }) {
  const color = agentColor(agent)
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border flex-shrink-0"
      style={{ color, borderColor: `${color}30`, background: `${color}10` }}
    >
      {success === false
        ? <XCircle className="w-2.5 h-2.5" />
        : <CheckCircle2 className="w-2.5 h-2.5" />
      }
      {agent}
      {durationMs != null && <span className="opacity-60 ml-0.5">{fmtMs(durationMs)}</span>}
    </span>
  )
}

function AgentTrace({ result }: { result: any }) {
  const [open, setOpen] = useState(false)
  const color = agentColor(result.agentType)

  return (
    <div
      className="rounded-lg overflow-hidden transition-all"
      style={{ border: `1px solid ${open ? color + '35' : 'rgba(255,255,255,0.06)'}` }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
        style={{ background: open ? `${color}08` : 'transparent' }}
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: color }}>
          <Brain className="w-3 h-3 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold font-mono" style={{ color }}>{result.agentType}</span>
          {result.role && <span className="text-[10px] text-slate-500 ml-2 truncate">{result.role}</span>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {result.durationMs != null && (
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />{fmtMs(result.durationMs)}
            </span>
          )}
          {result.success === false
            ? <XCircle className="w-4 h-4 text-red-400" />
            : <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          }
          {open ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: `${color}20` }}>
          {result.output ? (
            <pre
              className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed mt-3 p-3 rounded-lg font-mono overflow-x-auto"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {result.output}
            </pre>
          ) : (
            <p className="text-xs text-slate-500 mt-3 italic">No output recorded.</p>
          )}
        </div>
      )}
    </div>
  )
}

function OrchestrationRow({ item }: { item: any }) {
  const [open, setOpen] = useState(false)

  const agentResults: any[] = Array.isArray(item.agentResults) ? item.agentResults : []
  const evidence: any[]     = Array.isArray(item.evidence)     ? item.evidence     : []
  const riskFactors: any[]  = Array.isArray(item.riskFactors)  ? item.riskFactors  : []
  const nextSteps: any[]    = Array.isArray(item.nextSteps)    ? item.nextSteps    : []
  const rCol = recColor(item.recommendation ?? '')
  const confColor = item.confidence >= 80 ? '#059669' : item.confidence >= 50 ? '#d97706' : '#ef4444'

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ background: 'rgba(255,255,255,0.025)', border: open ? '1px solid rgba(37,100,234,0.3)' : '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Row header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-4 px-5 py-4 text-left transition-colors"
        style={{ background: open ? 'rgba(37,100,234,0.04)' : 'transparent' }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-snug mb-2">{item.question}</p>
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded font-mono text-slate-400" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {item.intent}
            </span>
            {item.recommendation && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ color: rCol, background: `${rCol}12` }}>
                {item.recommendation.slice(0, 50)}
              </span>
            )}
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />{fmtMs(item.durationMs)}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3" />{(item.agentsUsed ?? []).length} agents
            </span>
            <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: confColor }}>
              <BarChart3 className="w-3 h-3" />{item.confidence}%
            </span>
            <span className="text-[10px] text-slate-600 ml-auto">{timeAgo(item.createdAt)}</span>
          </div>
        </div>
        <div className="flex-shrink-0 mt-1">
          {open ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div className="px-5 pb-5 border-t space-y-5" style={{ borderColor: 'rgba(37,100,234,0.15)' }}>

          {item.summary && (
            <div className="pt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Summary</p>
              <p className="text-sm text-slate-300 leading-relaxed">{item.summary}</p>
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Agents Used</p>
            <div className="flex flex-wrap gap-1.5">
              {(item.agentsUsed ?? []).map((a: string) => {
                const res = agentResults.find((r: any) => r.agentType === a)
                return <AgentPill key={a} agent={a} durationMs={res?.durationMs} success={res?.success} />
              })}
            </div>
          </div>

          {agentResults.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Agent Trace</p>
              <div className="space-y-1.5">
                {agentResults.map((r: any, i: number) => <AgentTrace key={i} result={r} />)}
              </div>
            </div>
          )}

          {evidence.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Evidence</p>
              <div className="space-y-1.5">
                {evidence.map((e: any, i: number) => {
                  const color = agentColor(e.agent)
                  return (
                    <div key={i} className="flex gap-3 text-xs py-1.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <span className="font-bold font-mono flex-shrink-0" style={{ color }}>{e.agent}</span>
                      <span className="text-slate-400">{e.finding}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {(riskFactors.length > 0 || nextSteps.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {riskFactors.length > 0 && (
                <div className="rounded-lg p-3" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-2">Risk Factors</p>
                  <ul className="space-y-1.5">
                    {riskFactors.map((r: string, i: number) => (
                      <li key={i} className="text-xs text-slate-400 flex gap-1.5">
                        <span className="text-red-400 flex-shrink-0">•</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {nextSteps.length > 0 && (
                <div className="rounded-lg p-3" style={{ background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.15)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2">Next Steps</p>
                  <ol className="space-y-1.5">
                    {nextSteps.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-slate-400 flex gap-1.5">
                        <span className="text-emerald-400 font-bold flex-shrink-0">{i + 1}.</span>{s}
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

// ─── Agent usage breakdown ────────────────────────────────────────────────────

function AgentUsageBar({ logs }: { logs: any[] }) {
  const agentStats = useMemo(() => {
    const counts: Record<string, { count: number; totalMs: number; failures: number }> = {}
    for (const log of logs) {
      for (const res of (log.agentResults ?? [])) {
        if (!counts[res.agentType]) counts[res.agentType] = { count: 0, totalMs: 0, failures: 0 }
        counts[res.agentType].count++
        counts[res.agentType].totalMs += res.durationMs ?? 0
        if (res.success === false) counts[res.agentType].failures++
      }
    }
    return Object.entries(counts)
      .map(([name, s]) => ({
        name,
        count: s.count,
        avgMs: s.count ? Math.round(s.totalMs / s.count) : 0,
        failRate: s.count ? Math.round((s.failures / s.count) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
  }, [logs])

  if (!agentStats.length) return null

  const maxCount = agentStats[0]?.count ?? 1

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          Agent Usage Breakdown
        </p>
        <span className="text-xs text-slate-500">{agentStats.length} agents active</span>
      </div>
      <div className="space-y-2">
        {agentStats.map(s => {
          const color = agentColor(s.name)
          const pct = Math.round((s.count / maxCount) * 100)
          return (
            <div key={s.name} className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold w-40 flex-shrink-0 truncate" style={{ color }}>{s.name}</span>
              <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: `${color}60` }}
                />
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 w-40 text-right justify-end">
                <span className="text-[10px] font-bold text-white w-8 text-right">{s.count}×</span>
                <span className="text-[10px] text-slate-500 w-14 text-right font-mono">avg {fmtMs(s.avgMs)}</span>
                {s.failRate > 0 && (
                  <span className="text-[10px] font-bold" style={{ color: '#ef4444' }}>{s.failRate}% fail</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Intent distribution ──────────────────────────────────────────────────────

function IntentDistribution({ logs }: { logs: any[] }) {
  const intents = useMemo(() => {
    const freq: Record<string, number> = {}
    logs.forEach(l => { freq[l.intent] = (freq[l.intent] ?? 0) + 1 })
    return Object.entries(freq).sort((a, b) => b[1] - a[1])
  }, [logs])

  if (!intents.length) return null
  const maxCount = intents[0]?.[1] ?? 1

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <p className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-purple-400" />
        Query Intent Distribution
      </p>
      <div className="space-y-2">
        {intents.map(([intent, count]) => (
          <div key={intent} className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400 w-36 flex-shrink-0 truncate">{intent}</span>
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.round((count / maxCount) * 100)}%`, background: 'rgba(124,58,237,0.5)' }}
              />
            </div>
            <span className="text-[10px] font-bold text-white w-6 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main module ──────────────────────────────────────────────────────────────

export function AgentLogsModule() {
  const [search, setSearch]         = useState('')
  const [intentFilter, setIntent]   = useState('ALL')
  const [agentFilter, setAgent]     = useState('ALL')
  const [sortBy, setSort]           = useState<'date' | 'confidence' | 'duration' | 'agents'>('date')
  const [minConf, setMinConf]       = useState(0)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['orchestration-history-full'],
    queryFn: () => api.get('/admin/kangqore-immp/orchestrate/history?limit=100').then(r => r.data.history ?? []),
    staleTime: 30_000,
    refetchInterval: 120_000,
  })

  const logs: any[] = data ?? []

  // ── stats ──
  const totalRuns   = logs.length
  const avgAgents   = logs.length ? Math.round(logs.reduce((s: number, l: any) => s + (l.agentsUsed?.length ?? 0), 0) / logs.length) : 0
  const avgConf     = logs.length ? Math.round(logs.reduce((s: number, l: any) => s + (l.confidence ?? 0), 0) / logs.length) : 0
  const avgDuration = logs.length ? Math.round(logs.reduce((s: number, l: any) => s + (l.durationMs ?? 0), 0) / logs.length) : 0
  const successRate = logs.length ? Math.round(logs.filter((l: any) => (l.confidence ?? 0) >= 60).length / logs.length * 100) : 0
  const intentFreq: Record<string, number> = {}
  logs.forEach((l: any) => { intentFreq[l.intent] = (intentFreq[l.intent] ?? 0) + 1 })
  const topIntent = Object.entries(intentFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  // ── filter options ──
  const allIntents = useMemo(() => ['ALL', ...Array.from(new Set(logs.map((l: any) => l.intent))).sort()], [logs])
  const allAgents  = useMemo(() => {
    const s = new Set<string>()
    logs.forEach((l: any) => (l.agentsUsed ?? []).forEach((a: string) => s.add(a)))
    return ['ALL', ...Array.from(s).sort()]
  }, [logs])

  // ── filtered + sorted list ──
  const filtered = useMemo(() => {
    let out = logs.filter((l: any) => {
      if (search && !l.question?.toLowerCase().includes(search.toLowerCase())) return false
      if (intentFilter !== 'ALL' && l.intent !== intentFilter) return false
      if (agentFilter !== 'ALL' && !(l.agentsUsed ?? []).includes(agentFilter)) return false
      if ((l.confidence ?? 0) < minConf) return false
      return true
    })
    return out.sort((a: any, b: any) => {
      if (sortBy === 'confidence') return (b.confidence ?? 0) - (a.confidence ?? 0)
      if (sortBy === 'duration') return (b.durationMs ?? 0) - (a.durationMs ?? 0)
      if (sortBy === 'agents') return (b.agentsUsed?.length ?? 0) - (a.agentsUsed?.length ?? 0)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [logs, search, intentFilter, agentFilter, minConf, sortBy])

  function exportJSON() {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agent-logs-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <ScrollText className="w-5 h-5 text-blue-400" />
            Agent Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Every WAANDA orchestration — per-agent trace, evidence chain, synthesis output
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={exportJSON}
            disabled={!filtered.length}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 rounded-lg transition-colors disabled:opacity-30"
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-colors"
            style={{ border: '1px solid rgba(37,100,234,0.3)', background: 'rgba(37,100,234,0.08)', color: '#2564ea' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <StatCard label="Total Runs"      value={totalRuns}          sub="in history"            accent="#2564ea"  />
        <StatCard label="Avg Agents"      value={avgAgents}          sub="per orchestration"     accent="#7c3aed"  />
        <StatCard label="Avg Confidence"  value={`${avgConf}%`}      sub="synthesis score"       accent="#059669"  />
        <StatCard label="Avg Duration"    value={fmtMs(avgDuration)} sub="end-to-end"            accent="#0ea5e9"  />
        <StatCard label="High Confidence" value={`${successRate}%`}  sub="≥60% confidence runs"  accent="#10b981"  />
        <StatCard label="Top Intent"      value={topIntent}          sub="most queried"          accent="#f59e0b"  />
      </div>

      {/* ── Filter bar ── */}
      <div
        className="flex flex-wrap gap-3 px-4 py-3 rounded-xl items-center"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by question…"
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-transparent text-white placeholder:text-slate-600 rounded-lg outline-none"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        {/* Intent filter */}
        <select
          value={intentFilter}
          onChange={e => setIntent(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg outline-none text-slate-300 bg-transparent"
          style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0d1117' }}
        >
          {allIntents.map(i => <option key={i} value={i}>{i === 'ALL' ? 'All Intents' : i}</option>)}
        </select>

        {/* Agent filter */}
        <select
          value={agentFilter}
          onChange={e => setAgent(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg outline-none text-slate-300 bg-transparent"
          style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0d1117' }}
        >
          {allAgents.map(a => <option key={a} value={a}>{a === 'ALL' ? 'All Agents' : a}</option>)}
        </select>

        {/* Min confidence */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Conf ≥</span>
          <input
            type="number"
            min={0} max={100}
            value={minConf}
            onChange={e => setMinConf(Number(e.target.value))}
            className="w-14 px-2 py-1.5 text-xs text-white bg-transparent rounded-lg outline-none text-center"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0d1117' }}
          />
          <span className="text-[10px] text-slate-500">%</span>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSort(e.target.value as any)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg outline-none text-slate-300 bg-transparent"
          style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0d1117' }}
        >
          <option value="date">Sort: Newest</option>
          <option value="confidence">Sort: Confidence</option>
          <option value="duration">Sort: Duration</option>
          <option value="agents">Sort: Agent Count</option>
        </select>

        {(search || intentFilter !== 'ALL' || agentFilter !== 'ALL' || minConf > 0) && (
          <button
            onClick={() => { setSearch(''); setIntent('ALL'); setAgent('ALL'); setMinConf(0) }}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg"
            style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            Clear Filters
          </button>
        )}

        <span className="text-[11px] text-slate-600 ml-auto">{filtered.length} of {totalRuns} runs</span>
      </div>

      {/* ── Analytics row (usage + intent) ── */}
      {logs.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <AgentUsageBar logs={logs} />
          <IntentDistribution logs={logs} />
        </div>
      )}

      {/* ── Runs list ── */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl px-5 py-4 space-y-2 animate-pulse" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="h-4 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-3 rounded w-1/2" style={{ background: 'rgba(255,255,255,0.04)' }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {totalRuns === 0 ? <Brain className="w-7 h-7 text-slate-600" /> : <AlertTriangle className="w-7 h-7 text-slate-600" />}
          </div>
          <p className="text-base font-semibold text-slate-500">
            {totalRuns === 0 ? 'No orchestrations yet' : 'No results match your filters'}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {totalRuns === 0 ? 'Ask WAANDA a question to generate the first agent run.' : 'Try clearing filters or adjusting the confidence threshold.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item: any) => <OrchestrationRow key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
