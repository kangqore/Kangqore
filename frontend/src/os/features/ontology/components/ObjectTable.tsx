import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

function labelize(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase())
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'object' && !Array.isArray(v) && typeof (v as any).lat === 'number') {
    return `${(v as any).lat.toFixed(2)}, ${(v as any).lng.toFixed(2)}`
  }
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (Array.isArray(v)) return v.join(', ')
  return String(v)
}

interface OntologyObjectRow {
  id: string
  properties: Record<string, unknown>
  type: { name: string; displayName: string; color: string | null }
}

// S307 — schema-driven table: columns are auto-detected from the union of
// properties observed across the returned page, same inference approach the
// backend SDK generator uses for interfaces (see ontologySdkGenerator.service.ts).
export function ObjectTable({ typeName, typeId, limit = 20, onRowClick }: {
  typeName?: string
  typeId?: string
  limit?: number
  onRowClick?: (objectId: string) => void
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['sdk-object-table', typeName, typeId, limit],
    queryFn: () => api.get('/admin/ontology/objects', { params: { typeId, search: typeName, limit } })
      .then(r => r.data.objects as OntologyObjectRow[]),
    enabled: !!typeId,
  })

  const rows = data ?? []
  const columns = Array.from(new Set(rows.flatMap(r => Object.keys(r.properties ?? {})))).slice(0, 6)

  if (!typeId) return <div className="os-card p-6 text-xs text-[var(--os-text-2)] text-center">Pass a typeId to render a table</div>
  if (isLoading) return <div className="os-card h-40 animate-pulse bg-[var(--os-surface-0)]" />
  if (rows.length === 0) return <div className="os-card p-6 text-xs text-[var(--os-text-2)] text-center">No objects of this type yet</div>

  return (
    <div className="os-card overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[var(--os-border)]">
            {columns.map(c => (
              <th key={c} className="text-left px-3 py-2 font-semibold text-[var(--os-text-2)] uppercase tracking-wide text-[9px]">{labelize(c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr
              key={r.id}
              className={onRowClick ? 'cursor-pointer hover:bg-[var(--os-surface-0)]' : ''}
              onClick={() => onRowClick?.(r.id)}
            >
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
  )
}
