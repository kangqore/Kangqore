import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Zap } from 'lucide-react'
import { api } from '@lib/api'

export function AegisAutonomyPage() {
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 40

  const { data, isLoading } = useQuery({
    queryKey: ['aegis-autonomy', page],
    queryFn: () =>
      api.get(`/admin/aegis/autonomy?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`).then(r => r.data),
    staleTime: 15_000,
    refetchInterval: 60_000,
  })

  const rows: any[] = data?.rows ?? []
  const total: number = data?.total ?? 0

  return (
    <div className="space-y-4">
      <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl p-4 flex items-start gap-3">
        <Zap className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-violet-300 mb-0.5">Autonomy Boundary Log</p>
          <p className="text-xs text-[var(--os-text-2)] leading-relaxed">
            Every action KIMMP took <strong className="text-[var(--os-text-1)]">without being asked</strong> — scheduled loops,
            auto-synthesises, Scout-triggered wakeups. The ADMIN sees everything KIMMP did autonomously.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <span className="text-xs text-[var(--os-text-2)]">{total} autonomous actions recorded</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--os-surface-0)] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-[var(--os-text-2)] text-sm">
          No autonomous actions yet. AEGIS will record them the moment KIMMP acts without being asked.
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((row: any) => (
            <div key={row.id} className="bg-[var(--os-surface-0)] border border-violet-500/10 hover:border-violet-500/25 rounded-xl p-4 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3 h-3 text-violet-400 flex-shrink-0" />
                    <span className="text-xs font-mono text-violet-300 font-semibold">{row.system ?? 'KIMMP'}</span>
                    <span className="text-xs text-[var(--os-text-2)]">·</span>
                    <span className="text-xs text-[var(--os-text-2)]">{row.trigger}</span>
                  </div>
                  {row.agentsRun?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {row.agentsRun.map((a: string) => (
                        <span key={a} className="text-[10px] font-mono bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded px-1.5 py-0.5 text-[var(--os-text-2)]">
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[var(--os-text-2)]">{new Date(row.createdAt).toLocaleString()}</p>
                  {row.durationMs != null && (
                    <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{(row.durationMs / 1000).toFixed(1)}s</p>
                  )}
                </div>
              </div>
            </div>
          ))}
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
