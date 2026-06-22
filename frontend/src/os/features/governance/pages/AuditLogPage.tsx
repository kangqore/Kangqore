import { useState } from 'react'
import { Search, Shield, AlertTriangle, CheckCircle2, GitPullRequest, Package } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { EmptyState } from '@design-system/components/EmptyState'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Input } from '@design-system/components/Input'
import { Avatar } from '@design-system/components/Avatar'
import { cn } from '@design-system/cn'
import { useGovernanceStore } from '../store'
import type { AuditLog } from '../types'

// ─── action config ────────────────────────────────────────────────────────────

type ActionGroup = 'risk' | 'decision' | 'change' | 'deliverable'

const ACTION_META: Record<string, { label: string; group: ActionGroup; variant: 'danger' | 'warning' | 'success' | 'info' | 'neutral' }> = {
  RISK_CREATED:                { label: 'Risk logged',        group: 'risk',        variant: 'danger'  },
  RISK_UPDATED:                { label: 'Risk updated',       group: 'risk',        variant: 'warning' },
  RISK_ACCEPTED:               { label: 'Risk accepted',      group: 'risk',        variant: 'success' },
  RISK_ESCALATED:              { label: 'Risk escalated',     group: 'risk',        variant: 'danger'  },
  DECISION_PROPOSED:           { label: 'Decision proposed',  group: 'decision',    variant: 'info'    },
  DECISION_CREATED:            { label: 'Decision logged',    group: 'decision',    variant: 'info'    },
  DECISION_APPROVED:           { label: 'Decision approved',  group: 'decision',    variant: 'success' },
  DECISION_REJECTED:           { label: 'Decision rejected',  group: 'decision',    variant: 'danger'  },
  CHANGE_REQUEST_SUBMITTED:    { label: 'CR submitted',       group: 'change',      variant: 'warning' },
  CHANGE_REQUEST_APPROVED:     { label: 'CR approved',        group: 'change',      variant: 'success' },
  CHANGE_REQUEST_REJECTED:     { label: 'CR rejected',        group: 'change',      variant: 'danger'  },
  DELIVERABLE_SUBMITTED:       { label: 'Deliverable submitted',group: 'deliverable',variant: 'info'  },
  DELIVERABLE_ACCEPTED:        { label: 'Deliverable accepted',group: 'deliverable',variant: 'success' },
  DELIVERABLE_REJECTED:        { label: 'Deliverable rejected',group: 'deliverable',variant: 'danger' },
}

const GROUP_ICON: Record<ActionGroup, React.ReactNode> = {
  risk:        <AlertTriangle  className="w-3.5 h-3.5" />,
  decision:    <CheckCircle2   className="w-3.5 h-3.5" />,
  change:      <GitPullRequest className="w-3.5 h-3.5" />,
  deliverable: <Package        className="w-3.5 h-3.5" />,
}

const GROUP_COLOR: Record<ActionGroup, string> = {
  risk:        'bg-red-100   text-red-600',
  decision:    'bg-blue-100  text-blue-600',
  change:      'bg-amber-100 text-amber-600',
  deliverable: 'bg-green-100 text-green-600',
}

const ROLE_VARIANT: Record<string, 'danger' | 'info' | 'success' | 'neutral'> = {
  ADMIN: 'danger', CLIENT: 'info', PARTNER: 'success',
}

const fmtDateTime = (s: string) =>
  new Date(s).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

type GroupFilter = ActionGroup | 'ALL'

// ─── page ─────────────────────────────────────────────────────────────────────

export function AuditLogPage() {
  const { auditLogs } = useGovernanceStore()
  const [search,      setSearch]      = useState('')
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('ALL')

  const visible = auditLogs.filter(log => {
    const meta = ACTION_META[log.action]
    const matchGroup = groupFilter === 'ALL' || meta?.group === groupFilter
    const q = search.toLowerCase()
    const matchSearch = !q
      || log.action.toLowerCase().includes(q)
      || log.resource.toLowerCase().includes(q)
      || (log.user?.name ?? '').toLowerCase().includes(q)
    return matchGroup && matchSearch
  })

  // Group by date
  const grouped = visible.reduce<Record<string, AuditLog[]>>((acc, log) => {
    const day = new Date(log.createdAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
    if (!acc[day]) acc[day] = []
    acc[day].push(log)
    return acc
  }, {})

  const actionGroups: { key: GroupFilter; label: string }[] = [
    { key: 'ALL',         label: 'All' },
    { key: 'risk',        label: 'Risks' },
    { key: 'decision',    label: 'Decisions' },
    { key: 'change',      label: 'Changes' },
    { key: 'deliverable', label: 'Deliverables' },
  ]

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Audit" />

      <div>
        <h2 className="text-xl font-bold text-white">Audit Log</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {auditLogs.length} governance events — immutable record of all decisions, risks, changes, and deliverables
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search events, users, resources…"
          prefix={<Search className="w-3.5 h-3.5" />}
          className="w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-1.5">
          {actionGroups.map(g => (
            <button key={g.key} onClick={() => setGroupFilter(g.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                groupFilter === g.key ? 'bg-os-blue text-white' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 text-slate-300 hover:border-blue-300'
              }`}>
              {g.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-slate-500">{visible.length} events</span>
      </div>

      {/* Grouped timeline */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([day, logs]) => (
          <div key={day}>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{day}</p>
              <div className="flex-1 h-px bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10" />
              <span className="text-xs text-slate-300 whitespace-nowrap">{logs.length} event{logs.length !== 1 ? 's' : ''}</span>
            </div>
            <Card padding="none">
              <ul className="divide-y divide-[#2E2854]">
                {logs.map(log => {
                  const meta = ACTION_META[log.action]
                  const group: ActionGroup = meta?.group ?? 'decision'
                  return (
                    <li key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-900 transition-colors">
                      {/* Action icon */}
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', GROUP_COLOR[group])}>
                        {GROUP_ICON[group]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <Badge variant={meta?.variant ?? 'neutral'} size="sm">
                                {meta?.label ?? log.action.replace(/_/g, ' ')}
                              </Badge>
                              {log.user && (
                                <Badge variant={ROLE_VARIANT[log.user.role] ?? 'neutral'} size="sm">
                                  {log.user.role}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium text-slate-200 truncate">{log.resource}</p>
                          </div>
                          <span className="text-[11px] text-slate-500 whitespace-nowrap flex-shrink-0">
                            {fmtDateTime(log.createdAt)}
                          </span>
                        </div>

                        {/* Actor */}
                        {log.user && (
                          <div className="flex items-center gap-2 mt-2">
                            <Avatar name={log.user.name} size="xs" />
                            <span className="text-xs text-slate-500">{log.user.name}</span>
                            {log.user.company && (
                              <span className="text-xs text-slate-500">· {log.user.company}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Card>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <EmptyState
            icon={<Shield className="w-6 h-6" />}
            title="No audit events match"
            description="Try a different date range or event category."
          />
        )}
      </div>
    </div>
  )
}
