import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const EVENT_COLORS: Record<string, string> = {
  ACTIVATION:      'text-blue-400 bg-blue-500/10 border-blue-500/20',
  AUTONOMOUS:      'text-violet-400 bg-violet-500/10 border-violet-500/20',
  ACCESS_DENIED:   'text-rose-400 bg-rose-500/10 border-rose-500/20',
  KNOWLEDGE_ASSET: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
}

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: 'text-red-400',
  HIGH:     'text-amber-400',
  NORMAL:   'text-[var(--os-text-2)]',
}

type FilterType = '' | 'ACTIVATION' | 'AUTONOMOUS' | 'ACCESS_DENIED' | 'KNOWLEDGE_ASSET'

export function AegisAuditPage() {
  const [eventType, setEventType] = useState<FilterType>('')
  const [system, setSystem]       = useState('')
  const [page, setPage]           = useState(0)
  const PAGE_SIZE = 40

  const { data, isLoading } = useQuery({
    queryKey: ['aegis-audit', eventType, system, page],
    queryFn: () => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) })
      if (eventType) params.set('eventType', eventType)
      if (system)    params.set('system', system)
      return api.get(`/admin/aegis/audit?${params}`).then(r => r.data)
    },
    staleTime: 15_000,
  })

  const rows: any[] = data?.rows ?? []
  const total: number = data?.total ?? 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={eventType}
          onChange={e => { setEventType(e.target.value as FilterType); setPage(0) }}
          className="bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--os-text-1)] focus:outline-none focus:ring-1 focus:ring-os-blue"
        >
          <option value="">All events</option>
          <option value="ACTIVATION">Activations</option>
          <option value="AUTONOMOUS">Autonomous</option>
          <option value="ACCESS_DENIED">Access Denied</option>
          <option value="KNOWLEDGE_ASSET">Knowledge Assets</option>
        </select>
        <select
          value={system}
          onChange={e => { setSystem(e.target.value); setPage(0) }}
          className="bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--os-text-1)] focus:outline-none focus:ring-1 focus:ring-os-blue"
        >
          <option value="">All systems</option>
          {['KIMMP','EQORE','LEAD_INTEL','ALIS','VIS','SENTINEL'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-xs text-[var(--os-text-2)] ml-auto">{total} records</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-[var(--os-surface-0)] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-[var(--os-text-2)] text-sm">No audit records yet. AEGIS is watching.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--os-border)]">
                <th className="pb-2 text-xs text-[var(--os-text-2)] font-medium pr-4 w-44">Timestamp</th>
                <th className="pb-2 text-xs text-[var(--os-text-2)] font-medium pr-4">Event</th>
                <th className="pb-2 text-xs text-[var(--os-text-2)] font-medium pr-4">System</th>
                <th className="pb-2 text-xs text-[var(--os-text-2)] font-medium pr-4">Trigger</th>
                <th className="pb-2 text-xs text-[var(--os-text-2)] font-medium pr-4">Actor</th>
                <th className="pb-2 text-xs text-[var(--os-text-2)] font-medium pr-4">Priority</th>
                <th className="pb-2 text-xs text-[var(--os-text-2)] font-medium">Conf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {rows.map((row: any) => (
                <tr key={row.id} className="hover:bg-[var(--os-surface-0)] transition-colors">
                  <td className="py-2 pr-4 text-[var(--os-text-2)] text-xs font-mono whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-mono border rounded px-1.5 py-0.5 ${EVENT_COLORS[row.eventType] ?? 'text-[var(--os-text-2)]'}`}>
                      {row.autonomous ? '⚡ ' : ''}{row.eventType}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-xs font-mono text-[var(--os-text-1)]">{row.system ?? '—'}</td>
                  <td className="py-2 pr-4 text-xs text-[var(--os-text-2)] max-w-[180px] truncate">{row.trigger ?? row.endpoint ?? '—'}</td>
                  <td className="py-2 pr-4 text-xs text-[var(--os-text-2)]">{row.actor}</td>
                  <td className={`py-2 pr-4 text-xs font-medium ${PRIORITY_COLORS[row.priority ?? ''] ?? 'text-[var(--os-text-2)]'}`}>
                    {row.priority ?? '—'}
                  </td>
                  <td className="py-2 text-xs text-[var(--os-text-2)]">{row.confidence != null ? `${row.confidence}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-xs text-[var(--os-text-2)] hover:text-[var(--os-text-1)] disabled:opacity-30 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-xs text-[var(--os-text-2)]">Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * PAGE_SIZE >= total}
            className="text-xs text-[var(--os-text-2)] hover:text-[var(--os-text-1)] disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
