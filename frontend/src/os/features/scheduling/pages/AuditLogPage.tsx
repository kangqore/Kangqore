import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, ScrollText, Filter } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface AuditEntry {
  id: string
  action: string
  description: string
  performedBy: string
  targetId?: string
  createdAt: string
}

const ACTION_OPTIONS = [
  'booking.created', 'booking.cancelled', 'booking.rescheduled',
  'event_type.created', 'event_type.updated', 'event_type.deleted',
  'availability.updated', 'calendar.connected', 'calendar.disconnected',
  'workflow.created', 'workflow.deleted', 'webhook.created', 'webhook.deleted',
]

const ACTION_VARIANT: Record<string, 'success' | 'danger' | 'warning' | 'neutral'> = {
  'booking.created': 'success',
  'booking.cancelled': 'danger',
  'booking.rescheduled': 'warning',
  'event_type.deleted': 'danger',
  'calendar.disconnected': 'danger',
  'workflow.deleted': 'danger',
  'webhook.deleted': 'danger',
}

const PAGE_SIZE = 20

export function AuditLogPage() {
  const [page, setPage]   = useState(1)
  const [action, setAction] = useState('')
  const [from, setFrom]   = useState('')
  const [to, setTo]       = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['scheduling-audit-log', page, action, from, to],
    queryFn: () => api.get('/scheduling/audit', {
      params: { page, limit: PAGE_SIZE, action: action || undefined, from: from || undefined, to: to || undefined }
    }).then(r => r.data),
    enabled: !isDemo(),
    staleTime: 1000 * 30,
  })

  const entries: AuditEntry[] = data?.logs ?? data?.entries ?? []
  const total: number = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Audit Log</h2>
        <p className="text-sm text-[var(--os-text-2)] mt-1">All scheduling actions and changes.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="w-3.5 h-3.5 text-[var(--os-text-2)] shrink-0" />
        <select
          value={action}
          onChange={e => { setAction(e.target.value); setPage(1) }}
          className="h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:border-blue-400"
        >
          <option value="">All actions</option>
          {ACTION_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <input
          type="date"
          value={from}
          onChange={e => { setFrom(e.target.value); setPage(1) }}
          className="h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:border-blue-400"
        />
        <span className="text-[var(--os-text-2)] text-sm">to</span>
        <input
          type="date"
          value={to}
          onChange={e => { setTo(e.target.value); setPage(1) }}
          className="h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:border-blue-400"
        />
        {(action || from || to) && (
          <button
            onClick={() => { setAction(''); setFrom(''); setTo(''); setPage(1) }}
            className="text-xs text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {isLoading && <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]"><Spinner size="sm" /> Loading…</div>}

      {!isLoading && entries.length === 0 && (
        <Card><CardBody className="text-center py-12">
          <ScrollText className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-3" />
          <p className="text-sm text-[var(--os-text-2)]">No audit entries found</p>
        </CardBody></Card>
      )}

      {entries.length > 0 && (
        <Card>
          <div className="divide-y divide-[var(--os-border)]">
            {entries.map(entry => (
              <div key={entry.id} className="flex items-start gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant={ACTION_VARIANT[entry.action] ?? 'neutral'} size="sm">
                      {entry.action}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--os-text-1)] truncate">{entry.description}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">{entry.performedBy}</p>
                </div>
                <time className="text-xs text-[var(--os-text-2)] whitespace-nowrap shrink-0">
                  {new Date(entry.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
            ))}
          </div>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[var(--os-text-2)]">
          <span>{total} total</span>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg hover:bg-[var(--os-surface-0)] border border-[var(--os-border)] disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg hover:bg-[var(--os-surface-0)] border border-[var(--os-border)] disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
