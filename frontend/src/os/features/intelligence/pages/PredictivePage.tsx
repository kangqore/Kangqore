// Layer 2 — Predictive: "What will happen?"
// Pulls from GET /api/admin/intelligence/predictive

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { RefreshCw, Folder, Users, User, GitBranch } from 'lucide-react'
import { SeverityBadge, SignalCard, SectionHeader, ProbBar } from '../components'

export function PredictivePage() {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['intelligence', 'predictive'],
    queryFn: () => api.get('/admin/intelligence/predictive').then(r => r.data),
    staleTime: 60_000,
  })

  if (isLoading) return <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Running predictive models…</div>

  const {
    deadlinePredictions = [],
    churnPredictions = [],
    overloadPredictions = [],
    bottlenecks = [],
    summary,
  } = data ?? {}

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {summary && (
            <span className="text-sm text-[var(--os-text-2)]">
              <span className="font-medium text-red-500">{summary.highRiskDeadlines}</span> deadline risks ·{' '}
              <span className="font-medium text-amber-500">{summary.highRiskChurns}</span> churn risks ·{' '}
              {summary.overloadedStaff} overloaded · {summary.activeBottlenecks} bottlenecks
            </span>
          )}
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-1.5 text-xs text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {deadlinePredictions.length > 0 && (
        <section>
          <SectionHeader icon={Folder} label="Deadline Risk" count={deadlinePredictions.length} />
          <div className="grid gap-2">
            {deadlinePredictions.map((d: any) => (
              <SignalCard key={d.projectId} severity={d.severity}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[var(--os-text-1)] truncate">{d.title}</div>
                    {d.clientName && <div className="text-xs text-[var(--os-text-2)]">{d.clientName}</div>}
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[var(--os-text-2)]">Miss probability</span>
                        <span className="text-xs font-semibold text-[var(--os-text-1)]">{Math.round(d.missProb * 100)}%</span>
                        <span className="text-xs text-[var(--os-text-3)]">({d.confidence} confidence)</span>
                      </div>
                      <ProbBar value={d.missProb} />
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-[var(--os-text-2)]">
                      <span>Progress: {d.progress}%</span>
                      <span className="text-amber-500">Behind: {d.progressDeficit}%</span>
                      <span>Velocity: {d.velocityPerDay} pts/day</span>
                      {d.daysLeft > 0 && <span>{d.daysLeft}d left</span>}
                      {d.estimatedCompletionDays && <span>ETA: {d.estimatedCompletionDays}d</span>}
                    </div>
                  </div>
                  <SeverityBadge severity={d.severity} />
                </div>
              </SignalCard>
            ))}
          </div>
        </section>
      )}

      {churnPredictions.length > 0 && (
        <section>
          <SectionHeader icon={Users} label="Churn Risk" count={churnPredictions.length} />
          <div className="grid gap-2">
            {churnPredictions.map((c: any) => (
              <SignalCard key={c.customerId} severity={c.severity}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-[var(--os-text-1)]">{c.customerName ?? c.customerId}</div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[var(--os-text-2)]">Renewal likelihood</span>
                        <span className="text-xs font-semibold text-[var(--os-text-1)]">{c.renewalLikelihood}%</span>
                      </div>
                      <ProbBar value={c.renewalLikelihood / 100} invert />
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-[var(--os-text-2)]">
                      {c.healthTier && <span>Health: <span className={c.healthTier === 'RED' ? 'text-red-500' : 'text-amber-500'}>{c.healthTier}</span></span>}
                      <span>{c.daysUntilRenewal}d to renewal</span>
                    </div>
                    {c.riskFactors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.riskFactors.slice(0, 3).map((f: string, i: number) => (
                          <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-500">{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <SeverityBadge severity={c.severity} />
                </div>
              </SignalCard>
            ))}
          </div>
        </section>
      )}

      {overloadPredictions.length > 0 && (
        <section>
          <SectionHeader icon={User} label="Overload Risk" count={overloadPredictions.length} />
          <div className="grid gap-2">
            {overloadPredictions.map((o: any) => (
              <SignalCard key={o.staffId} severity={o.severity}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-sm text-[var(--os-text-1)]">{o.name}</div>
                    <div className="text-xs text-[var(--os-text-2)] mt-0.5">{o.role} · {o.department}</div>
                    <div className="flex gap-3 mt-1.5 text-xs text-[var(--os-text-2)]">
                      <span>Current: {o.currentUtilization}%</span>
                      <span className={o.projectedUtilization >= 100 ? 'text-red-500' : 'text-amber-500'}>
                        Projected: {o.projectedUtilization}%
                      </span>
                      <span>{o.upcomingAllocations} allocations · {o.hoursPerWeekCommitted}h/week</span>
                    </div>
                    <div className="text-xs text-[var(--os-text-3)] mt-1">{o.riskWindow}</div>
                  </div>
                  <SeverityBadge severity={o.severity} />
                </div>
              </SignalCard>
            ))}
          </div>
        </section>
      )}

      {bottlenecks.length > 0 && (
        <section>
          <SectionHeader icon={GitBranch} label="Bottlenecks" count={bottlenecks.length} />
          <div className="grid gap-2">
            {bottlenecks.map((b: any) => (
              <SignalCard key={b.entityId} severity={b.severity}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-sm text-[var(--os-text-1)]">{b.name}</div>
                    <div className="flex gap-3 mt-1.5 text-xs text-[var(--os-text-2)]">
                      <span>Current: {b.current}</span>
                      <span>Target: {b.target}</span>
                      <span className="text-red-500">Deficit: {b.deficitPct}%</span>
                      <span>Trend: {b.trend}</span>
                    </div>
                  </div>
                  <SeverityBadge severity={b.severity} />
                </div>
              </SignalCard>
            ))}
          </div>
        </section>
      )}

      {!deadlinePredictions.length && !churnPredictions.length && !overloadPredictions.length && !bottlenecks.length && (
        <div className="text-center py-16 text-[var(--os-text-2)] text-sm">No predictions — all signals look healthy.</div>
      )}
    </div>
  )
}
