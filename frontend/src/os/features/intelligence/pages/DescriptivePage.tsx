// Layer 1 — Descriptive: "What is happening?"
// Pulls from GET /api/admin/intelligence/descriptive

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { RefreshCw, Folder, Users, AlertTriangle, Activity } from 'lucide-react'
import { SeverityBadge, SignalCard, SectionHeader } from '../components'

export function DescriptivePage() {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['intelligence', 'descriptive'],
    queryFn: () => api.get('/admin/intelligence/descriptive').then(r => r.data),
    staleTime: 60_000,
  })

  if (isLoading) return <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Computing signals…</div>

  const snap = data
  const { projects = [], clients = [], teams = [], sla = [], summary } = snap ?? {}

  return (
    <div className="space-y-8">
      {/* Summary bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {summary && (
            <>
              <span className="text-sm text-[var(--os-text-2)]">
                <span className="font-medium text-red-500">{summary.criticalCount} critical</span>
                {' · '}
                <span className="font-medium text-amber-500">{summary.highCount} high</span>
                {' · '}
                {summary.totalSignals} total signals
              </span>
              <span className="text-xs text-[var(--os-text-3)]">Computed {new Date(summary.computedAt).toLocaleTimeString()}</span>
            </>
          )}
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-1.5 text-xs text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <SectionHeader icon={Folder} label="Projects" count={projects.length} />
          <div className="grid gap-2">
            {projects.map((p: any) => (
              <SignalCard key={p.id} severity={p.severity}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-sm text-[var(--os-text-1)]">{p.title}</div>
                    {p.clientName && <div className="text-xs text-[var(--os-text-2)] mt-0.5">{p.clientName}</div>}
                    <div className="flex gap-3 mt-1.5 text-xs text-[var(--os-text-2)]">
                      <span>Progress: {p.progress}%</span>
                      {p.daysUntilDue !== null && (
                        <span className={p.daysUntilDue < 0 ? 'text-red-500' : p.daysUntilDue < 7 ? 'text-amber-500' : ''}>
                          {p.daysUntilDue < 0 ? `${Math.abs(p.daysUntilDue)}d overdue` : `${p.daysUntilDue}d left`}
                        </span>
                      )}
                      <span>Health: {p.health}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--os-bg-2)] text-[var(--os-text-2)]">{p.flag}</span>
                    <SeverityBadge severity={p.severity} />
                  </div>
                </div>
              </SignalCard>
            ))}
          </div>
        </section>
      )}

      {/* Clients */}
      {clients.length > 0 && (
        <section>
          <SectionHeader icon={Users} label="Clients" count={clients.length} />
          <div className="grid gap-2">
            {clients.map((c: any) => (
              <SignalCard key={c.id} severity={c.severity}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-sm text-[var(--os-text-1)]">{c.name}</div>
                    <div className="flex gap-3 mt-1.5 text-xs text-[var(--os-text-2)]">
                      <span>Tier: <span className={c.tier === 'RED' ? 'text-red-500' : c.tier === 'AMBER' ? 'text-amber-500' : ''}>{c.tier}</span></span>
                      <span>Score: {c.totalScore}</span>
                      <span>OIS Δ: {c.oisDelta > 0 ? '+' : ''}{c.oisDelta}</span>
                      <span>Renewal: {c.renewalProximityDays}d</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--os-bg-2)] text-[var(--os-text-2)]">{c.flag}</span>
                    <SeverityBadge severity={c.severity} />
                  </div>
                </div>
              </SignalCard>
            ))}
          </div>
        </section>
      )}

      {/* Teams */}
      {teams.length > 0 && (
        <section>
          <SectionHeader icon={Activity} label="Team Capacity" count={teams.length} />
          <div className="grid gap-2">
            {teams.map((t: any) => (
              <SignalCard key={t.id} severity={t.severity}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-sm text-[var(--os-text-1)]">{t.name}</div>
                    <div className="text-xs text-[var(--os-text-2)] mt-0.5">{t.role} · {t.department}</div>
                    <div className="flex gap-3 mt-1.5 text-xs text-[var(--os-text-2)]">
                      <span>Utilization: {t.utilization}%</span>
                      <span>Allocations: {t.allocations}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--os-bg-2)] text-[var(--os-text-2)]">{t.flag}</span>
                    <SeverityBadge severity={t.severity} />
                  </div>
                </div>
              </SignalCard>
            ))}
          </div>
        </section>
      )}

      {/* SLA */}
      {sla.length > 0 && (
        <section>
          <SectionHeader icon={AlertTriangle} label="SLA" count={sla.length} />
          <div className="grid gap-2">
            {sla.map((s: any) => (
              <SignalCard key={s.id} severity={s.severity}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-sm text-[var(--os-text-1)]">{s.title ?? s.metric ?? 'SLA Signal'}</div>
                    <div className="flex gap-3 mt-1.5 text-xs text-[var(--os-text-2)]">
                      {s.priority && <span>Priority: {s.priority}</span>}
                      <span>Status: {s.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--os-bg-2)] text-[var(--os-text-2)]">{s.flag}</span>
                    <SeverityBadge severity={s.severity} />
                  </div>
                </div>
              </SignalCard>
            ))}
          </div>
        </section>
      )}

      {!projects.length && !clients.length && !teams.length && !sla.length && (
        <div className="text-center py-16 text-[var(--os-text-2)] text-sm">
          No active signals — all systems are healthy.
        </div>
      )}
    </div>
  )
}
