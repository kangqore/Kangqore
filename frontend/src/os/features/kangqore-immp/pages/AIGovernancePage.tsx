import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@lib/api'
import {
  Cpu, DollarSign, FileText, Star, CheckCircle2, AlertTriangle,
  XCircle, RotateCcw, TrendingUp, Loader2, ChevronDown, ChevronRight,
  Activity, Shield, Zap,
} from 'lucide-react'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────
interface WIRDashboard {
  version:  string
  aiHealth: 'HEALTHY' | 'DEGRADED'
  models: {
    all:     ModelHealth[]
    healthy: number; degraded: number; offline: number
  }
  costs: {
    totalUsd: number; totalCalls: number; monthlyProjectionUsd: number
    byModel:  Array<{ modelName: string; calls: number; costUsd: number; avgLatencyMs: number }>
    byAgent:  Array<{ agentType: string; calls: number; costUsd: number }>
  }
  prompts:      Array<{ name: string; activeVersion: number; totalVersions: number }>
  recentEvals:  any[]
  agentQuality: any[]
  router: {
    callsClaude: number; callsLocal: number; autonomyRatio: number
    distillationCount: number; totalCorpus: number; phase: string
  }
  generatedAt: string
}

interface ModelHealth {
  modelId:     string
  displayName: string
  status:      string
  avgLatencyMs: number
  failureRate:  number
  callCount:    number
}

const STATUS_COLOR: Record<string, string> = {
  HEALTHY:  '#00c875',
  DEGRADED: '#fdab3d',
  OFFLINE:  '#e2445c',
}

// ── Model card ────────────────────────────────────────────────────────────────
function ModelCard({ model }: { model: ModelHealth }) {
  const color = STATUS_COLOR[model.status] ?? '#8b8b8b'
  return (
    <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] font-semibold text-[var(--os-text-1)]">{model.displayName}</p>
          <p className="text-[10px] font-mono text-[var(--os-text-2)]">{model.modelId}</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color, background: `${color}20` }}>
          {model.status}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          ['Latency',      `${model.avgLatencyMs}ms`],
          ['Failure %',    `${model.failureRate}%`],
          ['Calls',        model.callCount],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] px-2 py-1.5">
            <p className="text-[12px] font-bold text-[var(--os-text-1)]">{value}</p>
            <p className="text-[9px] text-[var(--os-text-2)]">{label}</p>
          </div>
        ))}
      </div>
      <div className="h-1 rounded-full bg-[var(--os-surface-0)]">
        <div className="h-full rounded-full transition-all" style={{ width: `${100 - model.failureRate}%`, background: color }} />
      </div>
    </div>
  )
}

// ── Prompt version row ────────────────────────────────────────────────────────
function PromptRow({ prompt, onRollback }: { prompt: any; onRollback: (name: string, version: number) => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <tr className="border-b border-[var(--os-border)]">
      <td className="px-4 py-2.5 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-1.5">
          {expanded ? <ChevronDown className="w-3 h-3 text-[var(--os-text-2)]" /> : <ChevronRight className="w-3 h-3 text-[var(--os-text-2)]" />}
          <span className="text-[11px] font-mono text-[var(--os-text-1)]">{prompt.name}</span>
        </div>
      </td>
      <td className="px-4 py-2.5 text-center">
        <span className="text-[11px] font-bold text-[#579bfc]">v{prompt.activeVersion}</span>
      </td>
      <td className="px-4 py-2.5 text-center">
        <span className="text-[11px] text-[var(--os-text-2)]">{prompt.totalVersions}</span>
      </td>
      <td className="px-4 py-2.5">
        {prompt.activeVersion > 1 && (
          <button
            onClick={() => onRollback(prompt.name, prompt.activeVersion - 1)}
            className="flex items-center gap-1 text-[10px] text-[var(--os-text-2)] hover:text-[#fdab3d]"
          >
            <RotateCcw className="w-2.5 h-2.5" /> Roll back to v{prompt.activeVersion - 1}
          </button>
        )}
      </td>
    </tr>
  )
}

// ── Eval score bar ────────────────────────────────────────────────────────────
function ScoreBar({ label, value, max = 5 }: { label: string; value?: number; max?: number }) {
  const pct = value != null ? (value / max) * 100 : 0
  const color = pct >= 80 ? '#00c875' : pct >= 60 ? '#fdab3d' : '#e2445c'
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[var(--os-text-2)] w-20 text-right">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--os-surface-0)]">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold" style={{ color }}>{value?.toFixed(1) ?? '—'}</span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function AIGovernancePage() {
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<'models' | 'costs' | 'prompts' | 'evals'>('models')

  const { data, isLoading } = useQuery<WIRDashboard>({
    queryKey: ['wir-dashboard'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/wir/dashboard'),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const rollback = useMutation({
    mutationFn: ({ name, version }: { name: string; version: number }) =>
      apiFetch(`/admin/kangqore-immp/wir/prompts/${name}/rollback`, {
        method: 'POST', body: JSON.stringify({ version }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wir-dashboard'] }),
  })

  if (isLoading || !data) {
    return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-[var(--os-surface-0)] animate-pulse" />)}</div>
  }

  const { models, costs, prompts, agentQuality, router } = data

  const TABS = [
    { id: 'models' as const, label: 'Models',     icon: Cpu        },
    { id: 'costs'  as const, label: 'Costs',       icon: DollarSign },
    { id: 'prompts'as const, label: 'Prompts',     icon: FileText   },
    { id: 'evals'  as const, label: 'Quality',     icon: Star       },
  ]

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#7c3aed]" />
            <h2 className="text-base font-bold text-[var(--os-text-1)]">AI Governance</h2>
            <span className="text-[10px] font-mono text-[var(--os-text-2)]">WIR v{data.version}</span>
          </div>
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">
            WAANDA Intelligence Runtime — model health, cost, prompts, quality
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[data.aiHealth] }} />
          <span className="text-[11px] font-semibold" style={{ color: STATUS_COLOR[data.aiHealth] }}>{data.aiHealth}</span>
        </div>
      </div>

      {/* Stat bar */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Models healthy',     value: `${models.healthy}/${models.all.length}`, color: models.offline > 0 ? '#e2445c' : '#00c875', icon: Cpu },
          { label: '30-day cost',        value: `$${costs.totalUsd.toFixed(4)}`,           color: undefined,  icon: DollarSign },
          { label: 'Monthly projection', value: `$${costs.monthlyProjectionUsd.toFixed(2)}`, color: costs.monthlyProjectionUsd > 5 ? '#fdab3d' : undefined, icon: TrendingUp },
          { label: 'Prompt versions',    value: prompts.reduce((s, p) => s + p.totalVersions, 0), color: undefined, icon: FileText },
          { label: 'Autonomy ratio',     value: `${Math.round(router.autonomyRatio * 100)}%`, color: router.autonomyRatio > 0.2 ? '#00c875' : undefined, icon: Zap },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className="w-3.5 h-3.5" style={{ color: color ?? 'var(--os-text-2)' }} />
            </div>
            <p className="text-lg font-bold tabular-nums" style={{ color: color ?? 'var(--os-text-1)' }}>{value}</p>
            <p className="text-[10px] text-[var(--os-text-2)]">{label}</p>
          </div>
        ))}
      </div>

      {/* Distillation status */}
      <div className="rounded-xl border border-[#7c3aed]/20 bg-[#7c3aed]/[0.03] px-4 py-3 flex items-center gap-4">
        <Activity className="w-4 h-4 text-[#7c3aed] flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-[#7c3aed]">Gen 2 Training Pipeline</p>
          <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">
            Phase: <span className="text-[var(--os-text-1)]">{router.phase}</span> ·
            Corpus: <span className="text-[var(--os-text-1)]">{router.totalCorpus} examples</span> ·
            Distilled: <span className="text-[var(--os-text-1)]">{router.distillationCount}</span> ·
            Claude calls: {router.callsClaude} · Local calls: {router.callsLocal}
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0.5 border-b border-[var(--os-border)]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              activeTab === tab.id
                ? 'border-[#7c3aed] text-[#7c3aed]'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}

      {activeTab === 'models' && (
        <div className="grid grid-cols-3 gap-3">
          {models.all.map(m => <ModelCard key={m.modelId} model={m} />)}
        </div>
      )}

      {activeTab === 'costs' && (
        <div className="space-y-4">
          {/* By model */}
          <div className="os-card overflow-hidden">
            <p className="px-4 py-2.5 border-b border-[var(--os-border)] text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">Cost by Model</p>
            {costs.byModel.length === 0 ? (
              <p className="text-center py-6 text-[11px] text-[var(--os-text-2)]">No calls recorded yet</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--os-border)]">
                    {['Model', 'Calls', 'Cost (USD)', 'Avg Latency'].map(h => (
                      <th key={h} className="px-4 py-2 text-left text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {costs.byModel.map(m => (
                    <tr key={m.modelName} className="border-b border-[var(--os-border)]">
                      <td className="px-4 py-2 font-mono text-[11px] text-[var(--os-text-1)]">{m.modelName}</td>
                      <td className="px-4 py-2 text-[11px] text-[var(--os-text-2)]">{m.calls}</td>
                      <td className="px-4 py-2 text-[11px] font-semibold text-[var(--os-text-1)]">${m.costUsd.toFixed(6)}</td>
                      <td className="px-4 py-2 text-[11px] text-[var(--os-text-2)]">{m.avgLatencyMs}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* By agent */}
          {costs.byAgent.length > 0 && (
            <div className="os-card overflow-hidden">
              <p className="px-4 py-2.5 border-b border-[var(--os-border)] text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">Cost by Agent</p>
              <table className="w-full text-xs">
                <tbody>
                  {costs.byAgent.slice(0, 10).map(a => (
                    <tr key={a.agentType} className="border-b border-[var(--os-border)]">
                      <td className="px-4 py-2 text-[11px] text-[var(--os-text-1)]">{a.agentType}</td>
                      <td className="px-4 py-2 text-[11px] text-[var(--os-text-2)]">{a.calls} calls</td>
                      <td className="px-4 py-2 text-[11px] font-semibold text-[var(--os-text-1)]">${a.costUsd.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'prompts' && (
        <div className="os-card overflow-hidden">
          {prompts.length === 0 ? (
            <p className="text-center py-8 text-[11px] text-[var(--os-text-2)]">No prompts registered yet</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--os-border)]">
                  {['Prompt name', 'Active version', 'Total versions', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prompts.map(p => (
                  <PromptRow
                    key={p.name}
                    prompt={p}
                    onRollback={(name, version) => rollback.mutate({ name, version })}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'evals' && (
        <div className="space-y-4">
          {agentQuality.length === 0 ? (
            <div className="os-card py-10 text-center">
              <Star className="w-7 h-7 text-[var(--os-text-2)] mx-auto mb-2" />
              <p className="text-[11px] text-[var(--os-text-2)]">No evaluations yet. Decisions are auto-scored after creation.</p>
            </div>
          ) : (
            agentQuality.map(aq => (
              <div key={aq.agentType} className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-[var(--os-text-1)]">{aq.agentType}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--os-text-2)]">{aq.evalCount} eval{aq.evalCount !== 1 ? 's' : ''}</span>
                    <span className="text-[12px] font-bold" style={{ color: aq.avgOverall >= 4 ? '#00c875' : aq.avgOverall >= 3 ? '#fdab3d' : '#e2445c' }}>
                      {aq.avgOverall.toFixed(1)}/5
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <ScoreBar label="Correct"    value={aq.dimensions.correct}    />
                  <ScoreBar label="Useful"     value={aq.dimensions.useful}     />
                  <ScoreBar label="Complete"   value={aq.dimensions.complete}   />
                  <ScoreBar label="Grounded"   value={aq.dimensions.grounded}   />
                  <ScoreBar label="Actionable" value={aq.dimensions.actionable} />
                  <ScoreBar label="Safe"       value={aq.dimensions.safe}       />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
