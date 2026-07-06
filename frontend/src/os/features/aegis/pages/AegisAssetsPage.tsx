import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen } from 'lucide-react'
import { api } from '@lib/api'

export function AegisAssetsPage() {
  const [system, setSystem] = useState('')
  const [page, setPage]     = useState(0)
  const PAGE_SIZE = 40

  const { data, isLoading } = useQuery({
    queryKey: ['aegis-assets', system, page],
    queryFn: () => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) })
      if (system) params.set('system', system)
      return api.get(`/admin/aegis/assets?${params}`).then(r => r.data)
    },
    staleTime: 30_000,
  })

  const rows: any[] = data?.rows ?? []
  const total: number = data?.total ?? 0

  return (
    <div className="space-y-4">
      <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
        <BookOpen className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-300 mb-0.5">Intelligence Registry</p>
          <p className="text-xs text-[var(--os-text-2)] leading-relaxed">
            Every document KIMMP ingested into its knowledge base — catalogued as ADMIN-owned intelligence assets.
            These form the grounded context KIMMP reasons from.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
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
        <span className="text-xs text-[var(--os-text-2)] ml-auto">{total} assets</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-[var(--os-surface-0)] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-[var(--os-text-2)] text-sm">No knowledge assets registered yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--os-border)]">
                <th className="pb-2 text-xs text-[var(--os-text-2)] font-medium pr-4 w-44">Registered</th>
                <th className="pb-2 text-xs text-[var(--os-text-2)] font-medium pr-4">System</th>
                <th className="pb-2 text-xs text-[var(--os-text-2)] font-medium pr-4">Type</th>
                <th className="pb-2 text-xs text-[var(--os-text-2)] font-medium">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {rows.map((row: any) => (
                <tr key={row.id} className="hover:bg-[var(--os-surface-0)] transition-colors">
                  <td className="py-2 pr-4 text-xs font-mono text-[var(--os-text-2)] whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">
                    <span className="text-xs font-mono text-emerald-400">{row.system ?? '—'}</span>
                  </td>
                  <td className="py-2 pr-4 text-xs text-[var(--os-text-2)]">{row.assetType ?? '—'}</td>
                  <td className="py-2 text-xs text-[var(--os-text-2)] max-w-[240px] truncate">{row.assetSource ?? '—'}</td>
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
