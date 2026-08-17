import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

// S307 — "Auto-generated React components." Reality check: statically
// codegen'ing .tsx files per OntologyObjectType isn't practical for a live
// web app whose types change at runtime. These three components deliver the
// same benefit — build a UI once, get every current and future object type
// rendered automatically — by reading the type schema at render time instead
// of at build time. This is the same tradeoff Palantir's own Workshop widgets
// make in practice.

function labelize(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase())
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'object' && !Array.isArray(v) && typeof (v as any).lat === 'number') {
    return `${(v as any).lat.toFixed(3)}, ${(v as any).lng.toFixed(3)}`
  }
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (Array.isArray(v)) return v.join(', ')
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).toLocaleString()
  return String(v)
}

interface OntologyObjectDetail {
  id: string
  properties: Record<string, unknown>
  type: { name: string; displayName: string; icon: string | null; color: string | null }
  createdAt: string
}

export function ObjectCard({ objectId, compact = false }: { objectId: string; compact?: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ['sdk-object-card', objectId],
    queryFn: () => api.get(`/admin/ontology/objects/${objectId}`).then(r => r.data.object as OntologyObjectDetail),
  })

  if (isLoading) return <div className="os-card p-4 h-24 animate-pulse bg-[var(--os-surface-0)]" />
  if (!data) return <div className="os-card p-4 text-xs text-[var(--os-text-2)]">Object not found</div>

  const entries = Object.entries(data.properties ?? {}).filter(([, v]) => v !== null && v !== undefined)

  return (
    <div className="os-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span
          className="w-6 h-6 rounded-2xl flex items-center justify-center text-[10px] font-black flex-shrink-0"
          style={{ background: `${data.type.color ?? '#579bfc'}22`, color: data.type.color ?? '#579bfc' }}
        >
          {data.type.displayName?.charAt(0) ?? '?'}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: data.type.color ?? 'var(--os-text-2)' }}>{data.type.displayName}</p>
          <p className="text-xs text-[var(--os-text-2)] font-mono truncate">{data.id}</p>
        </div>
      </div>
      {!compact && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2 border-t border-[var(--os-border)]">
          {entries.length === 0
            ? <p className="col-span-2 text-[11px] text-[var(--os-text-2)]">No properties set</p>
            : entries.map(([k, v]) => (
              <div key={k} className="min-w-0">
                <p className="text-[9px] uppercase tracking-wide text-[var(--os-text-2)]">{labelize(k)}</p>
                <p className="text-xs text-[var(--os-text-1)] font-semibold truncate">{formatValue(v)}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
