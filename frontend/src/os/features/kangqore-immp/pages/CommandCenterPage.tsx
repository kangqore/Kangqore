import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '@lib/api'
import { getSocket } from '@lib/socket'
import { cn } from '@design-system/cn'
import {
  Activity, AlertTriangle, Brain, CheckCircle2, ChevronRight,
  Clock, DollarSign, Gauge, Loader2, RefreshCw, TrendingUp,
  TrendingDown, XCircle, Zap, BookOpen,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface CCSignal {
  id: string
  signalType: string
  signalValue: string
  severity: string
  sourceModule: string
  confidence: number
  createdAt: string
}

interface CCDecision {
  id: string
  decisionType: string
  summary: string
  priority: string
  status: string
  createdAt: string
}

interface CCPrediction {
  id: string
  leadId: string
  conversionProbability: number
  acvEstimate: number
  deliveryRisk: string
  createdAt: string
}

interface CommandCenterData {
  signals: {
    criticalCount: number
    highCount: number
    newCount: number
    totalCount: number
    avgConfidence: number
    recent: CCSignal[]
  }
  decisions: {
    proposedCount: number
    top: CCDecision[]
  }
  predictions: {
    atRisk: CCPrediction[]
    highRiskCount: number
    avgConversionProbability: number
  }
  training: {
    total: number
    exportReady: number
    estimatedReadyForFinetune: boolean
  } | null
  cost: {
    totalCalls: number
    totalEstimatedUsd: number
    byOperation: Record<string, { calls: number; estimatedUsd: number }>
  } | null
  ois: { score: number } | null
  generatedAt: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE = '/kangqore-view/admin/kangqore-immp'

const SEV_COLOR: Record<string, string> = {
  CRITICAL: '#e2445c',
  HIGH:     '#fdab3d',
  MODERATE: '#579bfc',
  LOW:      '#00c875',
}

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: '#e2445c',
  HIGH:     '#fdab3d',
  MEDIUM:   '#579bfc',
  LOW:      '#00c875',
}

function oisBand(score: number) {
  if (score >= 80) return { label: 'Excellent', color: '#00c875' }
  if (score >= 65) return { label: 'Good',      color: '#579bfc' }
  if (score >= 50) return { label: 'Fair',       color: '#fdab3d' }
  return                  { label: 'Critical',   color: '#e2445c' }
}

function fmtUsd(n: number) {
  return n < 0.01 ? '<$0.01' : `$${n.toFixed(2)}`
}

function timeAgo(iso: string) {
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60)  return `${sec}s ago`
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
  return `${Math.floor(sec / 3600)}h ago`
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatPill({ label, value, color, icon: Icon }: {
  label: string; value: number | string; color?: string; icon: any
}) {
  return (
    <div className="flex-1 min-w-[140px] rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5" style={{ color: color ?? 'var(--os-text-2)' }} />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--os-text-2)]">{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums" style={{ color: color ?? 'var(--os-text-1)' }}>{value}</p>
    </div>
  )
}

function SectionHeader({ label, path, navigate }: { label: string; path: string; navigate: any }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-[var(--os-text-1)]">{label}</h3>
      <button
        onClick={() => navigate(path)}
        className="flex items-center gap-1 text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
      >
        View all <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function CommandCenterPage() {
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()
  const [liveSignals, setLiveSignals] = useState<CCSignal[]>([])

  const { data, isLoading, isError, dataUpdatedAt } = useQuery<CommandCenterData>({
    queryKey: ['kimmp-command-center'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/command-center'),
    staleTime:       20_000,
    refetchInterval: 30_000,
  })

  // Real-time signal feed
  useEffect(() => {
    const socket = getSocket()
    const onSignal = (raw: any) => {
      const sig: CCSignal = {
        id:           raw.id ?? `live-${Date.now()}`,
        signalType:   raw.signalType   ?? raw.type     ?? 'SIGNAL',
        signalValue:  raw.signalValue  ?? raw.value    ?? '',
        severity:     raw.severity     ?? 'MODERATE',
        sourceModule: raw.sourceModule ?? raw.module   ?? 'system',
        confidence:   Number(raw.confidence ?? 0),
        createdAt:    new Date().toISOString(),
      }
      setLiveSignals(prev => [sig, ...prev].slice(0, 20))
    }
    socket.on('kimmp:signal', onSignal)
    return () => { socket.off('kimmp:signal', onSignal) }
  }, [])

  // Decision approve/dismiss
  const decisionMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch(`/admin/kangqore-immp/decisions/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kimmp-command-center'] }),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 gap-2 text-[var(--os-text-2)]">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Aggregating intelligence…</span>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#e2445c] p-4 rounded-xl border border-[var(--os-border)] bg-[var(--os-card)]">
        <XCircle className="w-4 h-4 flex-shrink-0" />
        Command Center could not load. Backend may be starting up — it will auto-refresh.
      </div>
    )
  }

  const { signals, decisions, predictions, training, cost, ois } = data
  const band = ois ? oisBand(ois.score) : null

  // Merge live signals with polled ones (dedupe by id)
  const polledIds = new Set((signals.recent ?? []).map((s: any) => s.id))
  const mergedSignals: CCSignal[] = [
    ...liveSignals.filter(s => !polledIds.has(s.id)),
    ...(signals.recent ?? []) as CCSignal[],
  ].slice(0, 12)

  // Top operation by cost
  const topOp = cost?.byOperation
    ? Object.entries(cost.byOperation).sort((a, b) => b[1].estimatedUsd - a[1].estimatedUsd)[0]
    : null

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--os-text-1)]">Command Center</h1>
          <p className="text-sm text-[var(--os-text-2)] mt-0.5">
            KIMMP Phase 6 — unified intelligence cockpit
          </p>
        </div>
        <div className="flex items-center gap-3">
          {ois && band && (
            <div className="flex items-center gap-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-card)] px-4 py-2">
              <Gauge className="w-4 h-4" style={{ color: band.color }} />
              <span className="text-sm font-bold tabular-nums" style={{ color: band.color }}>
                OIS {ois.score}
              </span>
              <span className="text-[11px] text-[var(--os-text-2)]">{band.label}</span>
            </div>
          )}
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['kimmp-command-center'] })}
            className="p-2 rounded-lg border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Stat pills ── */}
      <div className="flex flex-wrap gap-3">
        <StatPill label="Critical Signals" value={signals.criticalCount}
          color={signals.criticalCount > 0 ? '#e2445c' : undefined} icon={AlertTriangle} />
        <StatPill label="Proposed Decisions" value={decisions.proposedCount}
          color={decisions.proposedCount > 0 ? '#fdab3d' : undefined} icon={Zap} />
        <StatPill label="Training Examples" value={training?.total ?? '—'}
          color={training?.estimatedReadyForFinetune ? '#00c875' : undefined} icon={Brain} />
        <StatPill label="LLM Cost / 30d" value={cost ? fmtUsd(cost.totalEstimatedUsd) : '—'}
          icon={DollarSign} />
      </div>

      {/* ── Live Signals + Decision Queue ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Live Signals */}
        <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5">
          <SectionHeader label="Live Signals" path={`${BASE}/signals`} navigate={navigate} />
          {mergedSignals.length === 0 ? (
            <p className="text-sm text-[var(--os-text-2)] py-6 text-center">No signals yet</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {mergedSignals.map((sig, i) => (
                <div key={sig.id ?? i} className="flex items-start gap-3 py-2 border-b border-[var(--os-border)] last:border-0">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: SEV_COLOR[sig.severity] ?? '#aaa' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--os-text-1)] truncate">
                        {sig.signalType}
                      </span>
                      <span className="text-[10px] text-[var(--os-text-2)] uppercase tracking-wide">
                        {sig.sourceModule}
                      </span>
                    </div>
                    {sig.signalValue && (
                      <p className="text-[11px] text-[var(--os-text-2)] truncate">{sig.signalValue}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-[var(--os-text-2)] flex-shrink-0 tabular-nums">
                    {timeAgo(sig.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Decision Queue */}
        <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5">
          <SectionHeader label="Decision Queue" path={`${BASE}/decision-engine`} navigate={navigate} />
          {decisions.top.length === 0 ? (
            <p className="text-sm text-[var(--os-text-2)] py-6 text-center">No pending decisions</p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {decisions.top.map((dec) => (
                <div
                  key={dec.id}
                  className="rounded-lg border border-[var(--os-border)] p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{
                            background: (PRIORITY_COLOR[dec.priority] ?? '#aaa') + '22',
                            color: PRIORITY_COLOR[dec.priority] ?? 'var(--os-text-2)',
                          }}
                        >
                          {dec.priority}
                        </span>
                        <span className="text-[10px] text-[var(--os-text-2)]">{dec.decisionType}</span>
                      </div>
                      <p className="text-xs text-[var(--os-text-1)] line-clamp-2">{dec.summary}</p>
                    </div>
                    <span className="text-[10px] text-[var(--os-text-2)] tabular-nums flex-shrink-0">
                      {timeAgo(dec.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decisionMutation.mutate({ id: dec.id, status: 'APPROVED' })}
                      disabled={decisionMutation.isPending}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-[#00c875]/10 text-[#00c875] hover:bg-[#00c875]/20 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Approve
                    </button>
                    <button
                      onClick={() => decisionMutation.mutate({ id: dec.id, status: 'DISMISSED' })}
                      disabled={decisionMutation.isPending}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-[#e2445c]/10 text-[#e2445c] hover:bg-[#e2445c]/20 transition-colors"
                    >
                      <XCircle className="w-3 h-3" /> Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── At-Risk Revenue ── */}
      <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#e2445c]" />
            <h3 className="text-sm font-semibold text-[var(--os-text-1)]">At-Risk Revenue</h3>
            {predictions.highRiskCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e2445c]/15 text-[#e2445c]">
                {predictions.highRiskCount} HIGH
              </span>
            )}
          </div>
          <button
            onClick={() => navigate(`${BASE}/decision-engine`)}
            className="flex items-center gap-1 text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
          >
            Decision Engine <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {predictions.atRisk.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)] py-4">
            <TrendingUp className="w-4 h-4 text-[#00c875]" />
            No at-risk leads detected — predictions engine may need activation.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--os-border)]">
                  <th className="text-left py-2 pr-4 text-[var(--os-text-2)] font-semibold uppercase tracking-wide">Lead ID</th>
                  <th className="text-right py-2 pr-4 text-[var(--os-text-2)] font-semibold uppercase tracking-wide tabular-nums">Conv. %</th>
                  <th className="text-right py-2 pr-4 text-[var(--os-text-2)] font-semibold uppercase tracking-wide tabular-nums">ACV Est.</th>
                  <th className="text-left py-2 text-[var(--os-text-2)] font-semibold uppercase tracking-wide">Delivery Risk</th>
                </tr>
              </thead>
              <tbody>
                {predictions.atRisk.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--os-border)] last:border-0 hover:bg-[var(--os-border)]/20">
                    <td className="py-2.5 pr-4 font-mono text-[var(--os-text-2)] truncate max-w-[120px]">{p.leadId?.slice(-8) ?? '—'}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums text-[var(--os-text-1)]">
                      {p.conversionProbability != null ? `${Math.round(p.conversionProbability * 100)}%` : '—'}
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums text-[var(--os-text-1)]">
                      {p.acvEstimate ? `₹${p.acvEstimate.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-2.5">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          background: (SEV_COLOR[p.deliveryRisk] ?? '#aaa') + '22',
                          color: SEV_COLOR[p.deliveryRisk] ?? 'var(--os-text-2)',
                        }}
                      >
                        {p.deliveryRisk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Training + Cost intel strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-[var(--os-text-2)]" />
            <h3 className="text-sm font-semibold text-[var(--os-text-1)]">WAANDA Training Corpus</h3>
          </div>
          {!training ? (
            <p className="text-sm text-[var(--os-text-2)]">Unavailable</p>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--os-text-2)]">Total examples</span>
                <span className="font-semibold tabular-nums text-[var(--os-text-1)]">{training.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--os-text-2)]">Export-ready</span>
                <span className="font-semibold tabular-nums text-[var(--os-text-1)]">{training.exportReady.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--os-text-2)]">Fine-tune ready</span>
                <span className={cn('font-semibold', training.estimatedReadyForFinetune ? 'text-[#00c875]' : 'text-[var(--os-text-2)]')}>
                  {training.estimatedReadyForFinetune ? 'Yes (≥1,000 examples)' : `No (need ${1000 - training.exportReady} more)`}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => navigate(`${BASE}/training`)}
            className="mt-3 flex items-center gap-1 text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"
          >
            View Gen 2 training <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-[var(--os-text-2)]" />
            <h3 className="text-sm font-semibold text-[var(--os-text-1)]">LLM Spend — 30 days</h3>
          </div>
          {!cost ? (
            <p className="text-sm text-[var(--os-text-2)]">Unavailable</p>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--os-text-2)]">Total spend</span>
                <span className="font-bold tabular-nums text-[var(--os-text-1)]">{fmtUsd(cost.totalEstimatedUsd)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--os-text-2)]">Total calls</span>
                <span className="font-semibold tabular-nums text-[var(--os-text-1)]">{cost.totalCalls.toLocaleString()}</span>
              </div>
              {topOp && (
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--os-text-2)]">Top operation</span>
                  <span className="font-semibold text-[var(--os-text-1)] truncate ml-2">{topOp[0]}</span>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => navigate(`${BASE}/ai-governance`)}
            className="mt-3 flex items-center gap-1 text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"
          >
            View AI Health <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center gap-2 text-[10px] text-[var(--os-text-2)]">
        <Clock className="w-3 h-3" />
        Last aggregated {dataUpdatedAt ? timeAgo(new Date(dataUpdatedAt).toISOString()) : '—'}
        <span className="ml-2">· Auto-refreshes every 30s</span>
      </div>

    </div>
  )
}
