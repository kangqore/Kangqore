import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ShieldOff } from 'lucide-react'
import { api } from '@lib/api'

export function AegisShieldPage() {
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 40

  const { data, isLoading } = useQuery({
    queryKey: ['aegis-shield', page],
    queryFn: () =>
      api.get(`/admin/aegis/shield?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`).then(r => r.data),
    staleTime: 15_000,
    refetchInterval: 60_000,
  })

  const rows: any[] = data?.rows ?? []
  const total: number = data?.total ?? 0

  return (
    <div className="space-y-4">
      <div className="bg-rose-900/20 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3">
        <ShieldOff className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-rose-300 mb-0.5">Access Shield Log</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every attempt by a non-ADMIN user or unauthenticated request to reach KIMMP endpoints.
            AEGIS blocked and logged all of these. None got through.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <span className="text-xs text-slate-500">{total} blocked attempts</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          No access violations recorded. The shield is holding.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="pb-2 text-xs text-slate-500 font-medium pr-4 w-44">Timestamp</th>
                <th className="pb-2 text-xs text-slate-500 font-medium pr-4">Endpoint</th>
                <th className="pb-2 text-xs text-slate-500 font-medium pr-4">Method</th>
                <th className="pb-2 text-xs text-slate-500 font-medium pr-4">Role</th>
                <th className="pb-2 text-xs text-slate-500 font-medium">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row: any) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 pr-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4 text-xs font-mono text-slate-300 max-w-[200px] truncate">
                    {row.endpoint ?? '—'}
                  </td>
                  <td className="py-2 pr-4">
                    <span className="text-[11px] font-mono bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded px-1.5 py-0.5">
                      {row.method ?? '—'}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-xs text-amber-400">{row.userRole ?? 'anonymous'}</td>
                  <td className="py-2 text-xs text-slate-500 max-w-[120px] truncate">{row.userId ?? '—'}</td>
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
