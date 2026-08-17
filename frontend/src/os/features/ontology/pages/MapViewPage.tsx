import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MapTrifold, MagnifyingGlass, FloppyDisk, X } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { api } from '@lib/api'
import { objectSetService } from '../objectSetService'

// S304 — Ontology Map View. No map-tile library in this codebase yet
// (react-map-gl/maplibre-gl aren't installed) — rather than pull in a new
// heavy runtime dependency mid-phase, this is a self-contained equirectangular
// SVG scatter plot with a graticule background. Real geopoint data, real
// clustering, real click-through — just no basemap tiles.

const WIDTH = 900
const HEIGHT = 460

function project(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * WIDTH, y: ((90 - lat) / 180) * HEIGHT }
}

interface GeoObject {
  id: string
  properties: Record<string, any>
  type?: { name: string; displayName: string; color: string | null }
  location: { lat: number; lng: number }
}

function clusterPoints(objects: GeoObject[], pixelRadius = 18) {
  const projected = objects.map(o => ({ o, ...project(o.location.lat, o.location.lng) }))
  const clusters: Array<{ x: number; y: number; items: typeof projected }> = []
  for (const p of projected) {
    const near = clusters.find(c => Math.hypot(c.x - p.x, c.y - p.y) < pixelRadius)
    if (near) {
      near.items.push(p)
      near.x = near.items.reduce((s, i) => s + i.x, 0) / near.items.length
      near.y = near.items.reduce((s, i) => s + i.y, 0) / near.items.length
    } else {
      clusters.push({ x: p.x, y: p.y, items: [p] })
    }
  }
  return clusters
}

export function MapViewPage() {
  const qc = useQueryClient()
  const [openCluster, setOpenCluster] = useState<number | null>(null)
  const [searchLat, setSearchLat] = useState('51.5074')
  const [searchLng, setSearchLng] = useState('-0.1278')
  const [searchRadius, setSearchRadius] = useState('50')
  const [matchedIds, setMatchedIds] = useState<Set<string> | null>(null)
  const [setName, setSetName] = useState('')
  const [saved, setSaved] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['ontology-geo-bbox'],
    queryFn: () => api.get('/admin/ontology/objects/geo-bbox', { params: { minLat: -90, maxLat: 90, minLng: -180, maxLng: 180 } }).then(r => r.data.objects as GeoObject[]),
  })
  const objects = data ?? []
  const clusters = useMemo(() => clusterPoints(objects), [objects])

  const search = useMutation({
    mutationFn: () => api.post('/admin/ontology/objects/geo-search', {
      lat: Number(searchLat), lng: Number(searchLng), radiusKm: Number(searchRadius),
    }).then(r => r.data.objects as Array<{ id: string }>),
    onSuccess: results => setMatchedIds(new Set(results.map(r => r.id))),
  })

  const saveSet = useMutation({
    mutationFn: () => objectSetService.create({
      name: setName || `Within ${searchRadius}km of ${searchLat},${searchLng}`,
      query: { type: 'filter', field: 'properties.location', op: 'within_km', value: { lat: Number(searchLat), lng: Number(searchLng), radiusKm: Number(searchRadius) } },
    }),
    onSuccess: () => { setSaved(true); qc.invalidateQueries({ queryKey: ['object-sets'] }) },
  })

  useEffect(() => { setSaved(false) }, [searchLat, searchLng, searchRadius])

  const cluster = openCluster != null ? clusters[openCluster] : null

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-black text-[var(--os-text-1)] flex items-center gap-2"><MapTrifold size={18} weight="fill" /> Map View</h2>
        <p className="text-xs text-[var(--os-text-2)] mt-0.5">Every OntologyObject with a <code className="font-mono">properties.location</code> geopoint, plotted live.</p>
      </div>

      <div className="os-card p-3 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-[10px] text-[var(--os-text-2)] block mb-1">Latitude</label>
          <input value={searchLat} onChange={e => setSearchLat(e.target.value)} className="w-24 px-2 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
        </div>
        <div>
          <label className="text-[10px] text-[var(--os-text-2)] block mb-1">Longitude</label>
          <input value={searchLng} onChange={e => setSearchLng(e.target.value)} className="w-24 px-2 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
        </div>
        <div>
          <label className="text-[10px] text-[var(--os-text-2)] block mb-1">Radius (km)</label>
          <input value={searchRadius} onChange={e => setSearchRadius(e.target.value)} className="w-20 px-2 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
        </div>
        <button onClick={() => search.mutate()} disabled={search.isPending}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-[var(--os-border)] text-xs font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] disabled:opacity-50">
          {search.isPending ? <Loader2 size={13} className="animate-spin" /> : <MagnifyingGlass size={13} />} Search
        </button>
        {matchedIds && (
          <>
            <span className="text-xs text-[var(--os-text-2)]">{matchedIds.size} matches</span>
            <input value={setName} onChange={e => setSetName(e.target.value)} placeholder="Object Set name…"
              className="flex-1 min-w-[140px] px-2 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
            <button onClick={() => saveSet.mutate()} disabled={saveSet.isPending || saved}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[var(--os-accent)] text-white text-xs font-semibold disabled:opacity-50">
              {saveSet.isPending ? <Loader2 size={13} className="animate-spin" /> : <FloppyDisk size={13} weight="fill" />}
              {saved ? 'Saved as Object Set' : 'Save as Object Set'}
            </button>
            <button onClick={() => setMatchedIds(null)} className="text-[var(--os-text-2)]"><X size={14} /></button>
          </>
        )}
      </div>

      <div className="os-card p-4 overflow-x-auto">
        {isLoading ? (
          <div className="text-center text-xs text-[var(--os-text-2)] py-16">Loading geopoints…</div>
        ) : objects.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <MapTrifold size={28} className="text-[var(--os-text-2)]" />
            <p className="text-sm font-semibold text-[var(--os-text-1)]">No geopoints yet</p>
            <p className="text-xs text-[var(--os-text-2)]">Set <code className="font-mono">properties.location = {'{ lat, lng }'}</code> on an object to see it here.</p>
          </div>
        ) : (
          <svg width={WIDTH} height={HEIGHT} style={{ background: 'var(--os-surface-0)', borderRadius: 10 }}>
            {/* graticule */}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`v${i}`} x1={(i / 6) * WIDTH} y1={0} x2={(i / 6) * WIDTH} y2={HEIGHT} stroke="var(--os-border)" strokeWidth={1} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={(i / 4) * HEIGHT} x2={WIDTH} y2={(i / 4) * HEIGHT} stroke="var(--os-border)" strokeWidth={1} />
            ))}
            <line x1={WIDTH / 2} y1={0} x2={WIDTH / 2} y2={HEIGHT} stroke="var(--os-border)" strokeWidth={1.5} />
            <line x1={0} y1={HEIGHT / 2} x2={WIDTH} y2={HEIGHT / 2} stroke="var(--os-border)" strokeWidth={1.5} />

            {clusters.map((c, i) => {
              const highlighted = matchedIds ? c.items.some(it => matchedIds.has(it.o.id)) : false
              const color = c.items.length === 1 ? (c.items[0].o.type?.color ?? '#579bfc') : '#f59e0b'
              return (
                <g key={i} style={{ cursor: 'pointer' }} onClick={() => setOpenCluster(i)}>
                  <circle cx={c.x} cy={c.y} r={c.items.length > 1 ? 10 : 5} fill={color} fillOpacity={highlighted ? 1 : 0.75}
                    stroke={highlighted ? '#fff' : 'none'} strokeWidth={highlighted ? 2 : 0} />
                  {c.items.length > 1 && (
                    <text x={c.x} y={c.y + 3.5} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">{c.items.length}</text>
                  )}
                </g>
              )
            })}
          </svg>
        )}
      </div>

      {cluster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={e => e.target === e.currentTarget && setOpenCluster(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-4 space-y-2 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-[var(--os-text-1)]">{cluster.items.length} object{cluster.items.length !== 1 ? 's' : ''}</p>
              <button onClick={() => setOpenCluster(null)}><X size={14} className="text-[var(--os-text-2)]" /></button>
            </div>
            {cluster.items.map(({ o }) => (
              <div key={o.id} className="px-3 py-2 rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-xs">
                <p className="font-semibold text-[var(--os-text-1)]">{o.properties?.name ?? o.id.slice(0, 8)}</p>
                <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{o.type?.displayName} · {o.location.lat.toFixed(3)}, {o.location.lng.toFixed(3)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
