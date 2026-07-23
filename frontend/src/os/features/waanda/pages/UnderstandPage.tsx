import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { useKIMMPStore } from '@store/kimmp'

const surface = '#ffffff'
const border  = '1px solid rgba(37,100,234,0.10)'

function confidenceColor(n: number) {
  if (n >= 80) return '#10b981'
  if (n >= 40) return '#f59e0b'
  return '#f43f5e'
}

function confidenceBg(n: number) {
  if (n >= 80) return 'rgba(16,185,129,0.10)'
  if (n >= 40) return 'rgba(245,158,11,0.10)'
  return 'rgba(244,63,94,0.10)'
}

const DIM_LABEL: Record<string, string> = {
  revenue: 'Revenue', risk: 'Risk', opportunity: 'Opportunity', ops: 'Operations', talent: 'Talent',
}
const DIM_COLOR: Record<string, string> = {
  revenue: '#10b981', risk: '#f43f5e', opportunity: '#2564ea', ops: '#f59e0b', talent: '#7c3aed',
}

export function UnderstandPage() {
  const [twinId, setTwinId] = useState('')
  const [lookupId, setLookupId] = useState('')

  const insights        = useKIMMPStore(s => s.insights)
  const acknowledgedIds = useKIMMPStore(s => s.acknowledgedIds)

  const DIMS = ['revenue', 'risk', 'opportunity', 'ops', 'talent'] as const
  const W    = { critical: 20, high: 8, medium: 3, low: 1 } as Record<string, number>

  const healthDims = useMemo(() => {
    const active = insights.filter(i => i.type !== 'predictive' && !acknowledgedIds.includes(i.id))
    return DIMS.map(dim => {
      const ded = active.filter(i => i.category === dim).reduce((s, i) => s + (W[i.priority] ?? 0), 0)
      return [dim, Math.max(0, Math.min(100, 100 - ded))] as [string, number]
    })
  }, [insights, acknowledgedIds])

  const evidence = useQuery({
    queryKey:  ['waanda-evidence'],
    queryFn:   () => api.get('/kangqore/urgi/evidence').then(r => r.data),
    staleTime: 30_000,
  })

  const domains = useQuery({
    queryKey:  ['waanda-domains'],
    queryFn:   () => api.get('/admin/waanda/domains').then(r => r.data),
    staleTime: 60_000,
  })

  const twin = useQuery({
    queryKey:  ['waanda-twin', lookupId],
    queryFn:   () => api.get(`/kangqore/urgi/twin/${lookupId}`).then(r => r.data),
    enabled:   !!lookupId,
    retry:     false,
    staleTime: 30_000,
  })

  const koreObjects = useQuery({
    queryKey:  ['kore-objects-summary'],
    queryFn:   () => api.get('/admin/ontology/objects?limit=5').then(r => r.data),
    staleTime: 120_000,
  })

  const koreMarkings = useQuery({
    queryKey:  ['kore-markings-recent'],
    queryFn:   () => api.get('/admin/ontology/markings?limit=5').then(r => r.data),
    staleTime: 120_000,
  })

  const evidenceList: any[] = evidence.data?.data ?? []
  const domainList: any[]   = domains.data?.domains ?? []
  const twinData: any       = twin.data?.data
  const koreEntities: any[] = koreObjects.data?.objects ?? koreObjects.data ?? []
  const recentMarkings: any[] = koreMarkings.data?.markings ?? koreMarkings.data ?? []

  return (
    <div className="space-y-8">

      {/* ── Enterprise health by dimension */}
      {healthDims.length > 0 && (
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">
            Enterprise Health · KIMMP Pattern Analysis
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {healthDims.map(([dim, score]) => (
              <div key={dim} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{DIM_LABEL[dim] ?? dim}</span>
                  <span className="text-[11px] font-semibold" style={{ color: DIM_COLOR[dim] ?? '#6b7280' }}>
                    {score}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%`, background: DIM_COLOR[dim] ?? '#6b7280' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Evidence ledger */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase">
            Relationship Facts
          </div>
          <span className="text-sm text-slate-500">{evidenceList.length} facts observed</span>
        </div>

        {evidence.isLoading ? (
          <div className="text-sm text-slate-500">Loading evidence…</div>
        ) : evidenceList.length === 0 ? (
          <div className="text-sm text-slate-500">
            No relationship facts yet. WAANDA will populate this as visitors interact.
          </div>
        ) : (
          <div className="space-y-1.5" style={{ maxHeight: 320, overflowY: 'auto' }}>
            {evidenceList.map((row: any, i: number) => (
              <div
                key={row.id ?? i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(37,100,234,0.03)' }}
              >
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: confidenceBg(row.confidence), color: confidenceColor(row.confidence) }}
                >
                  {row.confidence}%
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-slate-700 mr-2">{row.factKey}</span>
                  <span className="text-sm text-slate-500">{row.factValue}</span>
                </div>
                <span className="text-[11px] text-slate-400 flex-shrink-0">{row.visitor}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: '#f1f5f9', color: '#64748b' }}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Two-column: entity spotlight + domain awareness */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Entity spotlight */}
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">
            Entity Spotlight
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={twinId}
              onChange={e => setTwinId(e.target.value)}
              placeholder="Enter visitor or user ID…"
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              onKeyDown={e => { if (e.key === 'Enter' && twinId.trim()) setLookupId(twinId.trim()) }}
            />
            <button
              onClick={() => { if (twinId.trim()) setLookupId(twinId.trim()) }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: '#2564ea', color: '#fff' }}
            >
              Look up
            </button>
          </div>

          {twin.isLoading && <div className="text-sm text-slate-500">Retrieving profile…</div>}

          {twin.isError && (
            <div className="text-sm" style={{ color: '#f43f5e' }}>
              No profile found for <span className="font-mono">{lookupId}</span>.
            </div>
          )}

          {twinData && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-medium text-slate-800">{twinData.identity}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{twinData.visitorId ?? twinData.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light" style={{ color: confidenceColor(twinData.trustScore ?? 0) }}>
                    {Math.round(twinData.trustScore ?? 0)}
                  </div>
                  <div className="text-[11px] text-slate-400">trust score</div>
                </div>
              </div>

              {(twinData.recentFacts ?? []).length > 0 && (
                <div>
                  <div className="text-[11px] text-slate-400 mb-1.5">Known facts</div>
                  <div className="space-y-1">
                    {(twinData.recentFacts as string[]).map((f, i) => (
                      <div key={i} className="text-sm text-slate-600 pl-2" style={{ borderLeft: '2px solid rgba(37,100,234,0.4)' }}>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(twinData.timeline ?? []).length > 0 && (
                <div>
                  <div className="text-[11px] text-slate-400 mb-1.5">Recent history</div>
                  <div className="space-y-1">
                    {(twinData.timeline as string[]).map((t, i) => (
                      <div key={i} className="text-sm text-slate-500">{t}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!lookupId && !twin.isLoading && (
            <div className="text-sm text-slate-400">
              Enter an ID to see what WAANDA knows about this entity.
            </div>
          )}
        </div>

        {/* Enterprise awareness */}
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">
            Enterprise Awareness
          </div>
          {domains.isLoading ? (
            <div className="text-sm text-slate-500">Loading domains…</div>
          ) : (
            <div className="space-y-3">
              {domainList.map((d: any, i: number) => (
                <div
                  key={d.id ?? i}
                  className="p-3 rounded-lg flex items-center justify-between"
                  style={{ background: 'rgba(37,100,234,0.03)' }}
                >
                  <div>
                    <div className="text-sm font-medium text-slate-700">{d.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{d.purpose}</div>
                  </div>
                  <div className="flex items-center gap-3 text-right ml-4 flex-shrink-0">
                    <div>
                      <div className="text-base font-light text-slate-600">{d.capabilities ?? d.objects}</div>
                      <div className="text-[10px] text-slate-400">capabilities</div>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        background: d.ready ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
                        color:      d.ready ? '#10b981' : '#f43f5e',
                      }}
                    >
                      {d.ready ? 'READY' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── KORE knowledge graph summary */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
        <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">
          Knowledge Graph · Top Entities
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Entity types */}
          <div>
            <div className="text-[11px] text-slate-400 mb-2">Entity types</div>
            {koreObjects.isLoading ? (
              <div className="text-sm text-slate-400">Loading…</div>
            ) : koreEntities.length === 0 ? (
              <div className="text-sm text-slate-400">No entities marked yet.</div>
            ) : (
              <div className="space-y-1.5">
                {koreEntities.slice(0, 5).map((obj: any, i: number) => (
                  <div
                    key={obj.id ?? i}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(37,100,234,0.03)', border: '1px solid rgba(37,100,234,0.07)' }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: '#2564ea' }}
                    />
                    <span className="text-sm text-slate-700 flex-1 truncate">{obj.name ?? (typeof obj.type === 'string' ? obj.type : obj.type?.displayName ?? obj.type?.name) ?? obj.label}</span>
                    {obj.instanceCount !== undefined && (
                      <span className="text-[11px] text-slate-400 font-mono">{obj.instanceCount}</span>
                    )}
                    {obj.type && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(37,100,234,0.08)', color: '#2564ea' }}>
                        {typeof obj.type === 'string' ? obj.type : obj.type?.displayName ?? obj.type?.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent markings */}
          <div>
            <div className="text-[11px] text-slate-400 mb-2">Recent markings</div>
            {koreMarkings.isLoading ? (
              <div className="text-sm text-slate-400">Loading…</div>
            ) : recentMarkings.length === 0 ? (
              <div className="text-sm text-slate-400">No recent markings.</div>
            ) : (
              <div className="space-y-1.5">
                {recentMarkings.slice(0, 5).map((m: any, i: number) => (
                  <div
                    key={m.id ?? i}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.10)' }}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#10b981' }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-slate-700 truncate block">
                        {m.objectName ?? m.entityName ?? m.label ?? (typeof m.type === 'string' ? m.type : m.type?.displayName ?? m.type?.name)}
                      </span>
                      {m.note && (
                        <span className="text-[10px] text-slate-400 truncate block">{m.note}</span>
                      )}
                    </div>
                    {m.confidence !== undefined && (
                      <span className="text-[11px] font-mono" style={{ color: confidenceColor(m.confidence) }}>
                        {m.confidence}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
