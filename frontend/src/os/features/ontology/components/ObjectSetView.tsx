import { useQuery } from '@tanstack/react-query'
import { objectSetService } from '../objectSetService'

function labelize(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase())
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'object' && !Array.isArray(v) && typeof (v as any).lat === 'number') {
    return `${(v as any).lat.toFixed(2)}, ${(v as any).lng.toFixed(2)}`
  }
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  return String(v)
}

// S307 — renders the live result of a saved ObjectSet with auto-detected
// columns, same rendering strategy as ObjectTable but bound to a query
// instead of a raw type filter.
export function ObjectSetView({ setId, onRowClick }: { setId: string; onRowClick?: (objectId: string) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['sdk-objectset-view', setId],
    queryFn: () => objectSetService.execute(setId),
  })

  const rows = data?.objects ?? []
  const columns = Array.from(new Set(rows.flatMap((r: any) => Object.keys(r.properties ?? {})))).slice(0, 6) as string[]

  if (isLoading) return <div className="os-card h-40 animate-pulse bg-[var(--os-surface-0)]" />
  if (rows.length === 0) return <div className="os-card p-6 text-xs text-[var(--os-text-2)] text-center">This Object Set has no members</div>

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-[var(--os-text-2)]">{data?.count} member{data?.count === 1 ? '' : 's'}</p>
      <div className="os-card overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--os-border)]">
              <th className="text-left px-3 py-2 font-semibold text-[var(--os-text-2)] uppercase tracking-wide text-[9px]">Type</th>
              {columns.map(c => (
                <th key={c} className="text-left px-3 py-2 font-semibold text-[var(--os-text-2)] uppercase tracking-wide text-[9px]">{labelize(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className={onRowClick ? 'cursor-pointer hover:bg-[var(--os-surface-0)]' : ''} onClick={() => onRowClick?.(r.id)}>
                <td className="px-3 py-2 border-t border-[var(--os-border)]">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: `${r.type?.color ?? '#579bfc'}22`, color: r.type?.color ?? '#579bfc' }}>
                    {r.type?.displayName ?? '—'}
                  </span>
                </td>
                {columns.map(c => (
                  <td key={c} className="px-3 py-2 border-t border-[var(--os-border)] text-[var(--os-text-1)] font-medium truncate max-w-[180px]">
                    {formatCell(r.properties?.[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
