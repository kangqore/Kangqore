import { useQuery } from '@tanstack/react-query'
import { Trophy, CheckCircle, Circle } from '@phosphor-icons/react'
import { gatewayService } from '../gatewayService'

// S327 — AIP Parity Scorecard. The "AIP capability snapshot" grid that has
// lived as hand-written prose at the top of the roadmap document for all of
// P1-P6, now live and computed: every card below is one real query against
// this platform's own data, not a status the author typed in. `live` means
// real non-zero usage — not "the code exists," which is a much lower bar.
// What this deliberately isn't: a database-backed sprint tracker. No table
// records "S308 shipped" — that lives in the roadmap document and session
// memory. What's real and queryable is whether each capability has actual
// production usage, which is exactly what's rendered here.

export function AipParityPage() {
  const { data, isLoading } = useQuery({ queryKey: ['aip-parity'], queryFn: () => gatewayService.aipParity(), refetchInterval: 60_000 })

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="os-card h-20 animate-pulse bg-[var(--os-surface-0)]" />)}</div>
  if (!data) return null

  const { capabilities, overall } = data

  return (
    <div className="space-y-5">
      <div className="os-card p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Trophy size={22} weight="fill" className={overall.allLive ? 'text-emerald-400' : 'text-[var(--os-text-2)]'} />
          <div>
            <p className="text-sm font-bold text-[var(--os-text-1)]">
              {overall.allLive ? 'AIP Parity — every capability has live production data' : `${overall.liveCount}/${overall.totalCount} capabilities have live production data`}
            </p>
            <p className="text-[10px] text-[var(--os-text-2)]">Computed {new Date(data.computedAt).toLocaleString()} · refreshes every 60s</p>
          </div>
        </div>
        <p className="text-2xl font-black tabular-nums" style={{ color: overall.allLive ? '#10b981' : 'var(--os-text-1)' }}>
          {overall.liveCount}<span className="text-sm font-normal text-[var(--os-text-2)]">/{overall.totalCount}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {capabilities.map(c => (
          <div key={c.key} className="os-card p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[var(--os-text-1)]">{c.label}</p>
              {c.live
                ? <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400"><CheckCircle size={12} weight="fill" /> LIVE</span>
                : <span className="flex items-center gap-1 text-[9px] font-bold text-[var(--os-text-2)]"><Circle size={12} /> NO DATA YET</span>}
            </div>
            <p className="text-[11px] text-[var(--os-text-2)]">{c.metric}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
