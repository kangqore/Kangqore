// Layer 3 — Prescriptive: "What should happen?"
// List/generate/accept/dismiss PrescriptiveRecommendation rows.

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { RefreshCw, Sparkles, CheckCircle, XCircle, Zap } from 'lucide-react'
import { SeverityBadge, SignalCard } from '../components'

const IMPACT_COLOR: Record<string, string> = {
  CRITICAL: 'text-red-500',
  HIGH:     'text-orange-500',
  MEDIUM:   'text-amber-500',
  LOW:      'text-[var(--os-text-2)]',
}

const TYPE_LABEL: Record<string, string> = {
  REALLOCATE_RESOURCES: 'Reallocate',
  ESCALATE_ISSUE: 'Escalate',
  CONTACT_CUSTOMER: 'Contact',
  REBALANCE_WORKLOAD: 'Rebalance',
  CHANGE_PRIORITY: 'Priority',
  APPROVE_PROCUREMENT: 'Procurement',
  RESCHEDULE_DEADLINE: 'Reschedule',
  ASSIGN_BACKUP: 'Backup',
  TRIGGER_RENEWAL_PLAY: 'Renewal Play',
}

export function PrescriptivePage() {
  const qc = useQueryClient()
  const [status, setStatus] = useState('PENDING')
  const [dismissId, setDismissId] = useState<string | null>(null)
  const [dismissReason, setDismissReason] = useState('')

  const { data: recs = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['intelligence', 'prescriptive', status],
    queryFn: () => api.get('/admin/intelligence/prescriptive', { params: { status, limit: 30 } }).then(r => r.data),
    staleTime: 30_000,
  })

  const generate = useMutation({
    mutationFn: () => api.post('/admin/intelligence/prescriptive/generate'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['intelligence', 'prescriptive'] }),
  })

  const accept = useMutation({
    mutationFn: (id: string) => api.post(`/admin/intelligence/prescriptive/${id}/accept`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['intelligence', 'prescriptive'] }),
  })

  const dismiss = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api.post(`/admin/intelligence/prescriptive/${id}/dismiss`, { reason }),
    onSuccess: () => { setDismissId(null); setDismissReason(''); qc.invalidateQueries({ queryKey: ['intelligence', 'prescriptive'] }) },
  })

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="text-sm bg-[var(--os-bg-2)] border border-[var(--os-border)] rounded px-2 py-1.5 text-[var(--os-text-1)]"
          >
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DISMISSED">Dismissed</option>
            <option value="EXECUTED">Executed</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <button onClick={() => refetch()} className="flex items-center gap-1.5 text-xs text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <button
          onClick={() => generate.mutate()}
          disabled={generate.isPending}
          className="flex items-center gap-2 text-sm px-3 py-1.5 bg-[#579bfc] hover:bg-[#4a8be0] text-white rounded transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {generate.isPending ? 'Generating…' : 'Generate from Signals'}
        </button>
      </div>

      {isLoading && <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Loading recommendations…</div>}

      {!isLoading && recs.length === 0 && (
        <div className="text-center py-16 text-[var(--os-text-2)] text-sm">
          No {status.toLowerCase()} recommendations. Click "Generate from Signals" to create some.
        </div>
      )}

      <div className="grid gap-3">
        {recs.map((r: any) => (
          <SignalCard key={r.id} severity={r.impact}>
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-[var(--os-bg-3)] text-[var(--os-text-2)]">
                    #{r.priority} · {TYPE_LABEL[r.type] ?? r.type}
                  </span>
                  {r.entityName && (
                    <span className="text-xs text-[var(--os-text-3)]">{r.entityType}: {r.entityName}</span>
                  )}
                  <span className={`text-xs font-semibold ${IMPACT_COLOR[r.impact]}`}>{r.impact}</span>
                </div>
                <div className="font-medium text-sm text-[var(--os-text-1)] mt-1.5">{r.title}</div>
                <div className="text-xs text-[var(--os-text-2)] mt-1 leading-relaxed">{r.rationale}</div>
                {r.actionId && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-[#579bfc]">
                    <Zap className="w-3 h-3" />
                    One-click executable
                  </div>
                )}
              </div>

              {status === 'PENDING' && (
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => accept.mutate(r.id)}
                    disabled={accept.isPending}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Accept
                  </button>
                  <button
                    onClick={() => setDismissId(r.id)}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-[var(--os-bg-2)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
                  >
                    <XCircle className="w-3 h-3" />
                    Dismiss
                  </button>
                </div>
              )}
            </div>

            {/* Inline dismiss form */}
            {dismissId === r.id && (
              <div className="mt-3 pt-3 border-t border-[var(--os-border)] flex gap-2">
                <input
                  type="text"
                  value={dismissReason}
                  onChange={e => setDismissReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="flex-1 text-xs bg-[var(--os-bg-1)] border border-[var(--os-border)] rounded px-2 py-1 text-[var(--os-text-1)]"
                />
                <button
                  onClick={() => dismiss.mutate({ id: r.id, reason: dismissReason })}
                  className="text-xs px-3 py-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  Confirm
                </button>
                <button onClick={() => setDismissId(null)} className="text-xs px-2 py-1 text-[var(--os-text-2)]">
                  Cancel
                </button>
              </div>
            )}
          </SignalCard>
        ))}
      </div>
    </div>
  )
}
