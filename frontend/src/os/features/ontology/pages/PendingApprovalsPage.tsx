import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HourglassMedium, Check, X, Robot, ShieldCheck } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { actionEngineService, type PendingApproval } from '../actionEngineService'

// S299 — Human-in-the-loop queue. A REQUIRE_APPROVAL policy match (S298) parks
// the execution here instead of running or hard-blocking it. KIMMP operates
// autonomously within policy, escalates when it can't — this is where it waits.

const ACTOR_CFG = {
  HUMAN: { color: '#579bfc', Icon: Check },
  KIMMP: { color: '#a855f7', Icon: Robot },
  HANUMANAS: { color: '#ef4444', Icon: ShieldCheck },
} as const

function timeAgo(date: string) {
  const d = Date.now() - new Date(date).getTime()
  const m = Math.floor(d / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function PendingCard({ item }: { item: PendingApproval }) {
  const qc = useQueryClient()
  const actor = ACTOR_CFG[item.actorType] ?? ACTOR_CFG.KIMMP
  const approve = useMutation({
    mutationFn: () => actionEngineService.approvePending(item.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pending-approvals'] }); qc.invalidateQueries({ queryKey: ['action-executions'] }) },
  })
  const reject = useMutation({
    mutationFn: () => actionEngineService.rejectPending(item.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pending-approvals'] }); qc.invalidateQueries({ queryKey: ['action-executions'] }) },
  })
  const busy = approve.isPending || reject.isPending

  return (
    <div className="os-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <actor.Icon size={13} weight="fill" style={{ color: actor.color }} />
            <p className="text-sm font-bold text-[var(--os-text-1)] truncate">{item.action?.displayName ?? item.actionId}</p>
          </div>
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">{item.actorType} · {timeAgo(item.createdAt)}</p>
        </div>
        {item.confidence != null && (
          <span className="text-[10px] font-bold text-[var(--os-text-2)] bg-[var(--os-surface-0)] px-1.5 py-0.5 rounded flex-shrink-0">{(item.confidence * 100).toFixed(0)}% conf</span>
        )}
      </div>

      {item.policyName && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 px-3 py-2">
          <p className="text-[11px] font-semibold text-amber-400">{item.policyName}</p>
          {item.reason && <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{item.reason}</p>}
        </div>
      )}

      <pre className="text-[10px] bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl p-2 overflow-x-auto max-h-24">{JSON.stringify(item.params, null, 2)}</pre>

      <div className="flex items-center gap-2 pt-2 border-t border-[var(--os-border)]">
        <button onClick={() => approve.mutate()} disabled={busy}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 disabled:opacity-50">
          {approve.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check size={13} weight="bold" />} Approve
        </button>
        <button onClick={() => reject.mutate()} disabled={busy}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 disabled:opacity-50">
          {reject.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <X size={13} weight="bold" />} Reject
        </button>
      </div>
    </div>
  )
}

export function PendingApprovalsPage() {
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'ALL'>('PENDING')
  const { data, isLoading } = useQuery({
    queryKey: ['pending-approvals', statusFilter],
    queryFn: () => actionEngineService.listPendingApprovals(statusFilter),
    refetchInterval: 15_000,
  })
  const items = data?.items ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-black text-[var(--os-text-1)] flex items-center gap-2"><HourglassMedium size={18} /> Human-in-the-Loop</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">KIMMP escalates here when a Policy requires ADMIN sign-off before effects apply.</p>
        </div>
        <div className="flex items-center gap-0.5 rounded-2xl border border-[var(--os-border)] overflow-hidden">
          {(['PENDING', 'ALL'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase ${statusFilter === s ? 'bg-[#579bfc] text-white' : 'text-[var(--os-text-2)]'}`}
            >{s === 'PENDING' ? 'Pending' : 'All'}</button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="os-card p-4 h-40 animate-pulse bg-[var(--os-surface-0)]" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="os-card p-12 flex flex-col items-center gap-3 text-center">
          <HourglassMedium size={32} className="text-[var(--os-text-2)]" />
          <p className="text-sm text-[var(--os-text-1)] font-semibold">Nothing waiting on you</p>
          <p className="text-xs text-[var(--os-text-2)]">KIMMP is operating autonomously within policy.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => <PendingCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
