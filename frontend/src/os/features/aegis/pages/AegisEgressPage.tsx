import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight } from 'lucide-react'
import { api } from '@lib/api'

export function AegisEgressPage() {
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 40

  const { data, isLoading } = useQuery({
    queryKey: ['aegis-egress', page],
    queryFn: () =>
      api.get(`/admin/aegis/egress?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`).then(r => r.data),
    staleTime: 15_000,
    refetchInterval: 60_000,
  })

  const rows: any[] = data?.rows ?? []
  const total: number = data?.total ?? 0

  return (
    <div className="space-y-4">
      <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <ArrowUpRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-300 mb-0.5">Intelligence Egress Control</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every time KIMMP intelligence leaves the system — a briefing read, a signal queried, a report accessed.
            Egress is not blocked (the ADMIN has full access to their intelligence), but every exit is permanently logged.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <span className="text-xs text-slate-500">{total} egress events</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          No egress events recorded yet. Intelligence monitoring will begin as soon as KIMMP responds to queries.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="pb-2 text-xs text-slate-500 font-medium pr-4 w-44">Timestamp</th>
                <th className="pb-2 text-xs text-slate-500 font-medium pr-4">Endpoint</th>
                <th className="pb-2 text-xs text-slate-500 font-medium pr-4">Method</th>
                <th className="pb-2 text-xs text-slate-500 font-medium pr-4">Asset Type</th>
                <th className="pb-2 text-xs text-slate-500 font-medium pr-4">Size</th>
                <th className="pb-2 text-xs text-slate-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row: any) => {
                const size    = row.metadata?.payloadSize ?? 0
                const status  = row.metadata?.responseStatus ?? 200
                const sizeStr = size > 1024 ? `${(size / 1024).toFixed(1)}KB` : `${size}B`
                return (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2 pr-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4 text-xs font-mono text-slate-300 max-w-[200px] truncate">
                      {row.endpoint ?? '—'}
                    </td>
                    <td className="py-2 pr-4">
                      <span className="text-[11px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded px-1.5 py-0.5">
                        {row.method ?? '—'}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-xs text-slate-400">{row.assetType ?? '—'}</td>
                    <td className="py-2 pr-4 text-xs text-slate-500 font-mono">{sizeStr}</td>
                    <td className="py-2">
                      <span className={`text-xs font-mono ${status >= 200 && status < 300 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-xs text-slate-500">Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * PAGE_SIZE >= total}
            className="text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
