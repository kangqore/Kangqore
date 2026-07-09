import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const surface = 'rgba(255,255,255,0.04)'
const border  = '1px solid rgba(255,255,255,0.08)'

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

export function UnderstandPage() {
  const [twinId, setTwinId] = useState('')
  const [lookupId, setLookupId] = useState('')

  // Relationship evidence ledger
  const evidence = useQuery({
    queryKey:  ['waanda-evidence'],
    queryFn:   () => api.get('/kangqore/urgi/evidence').then(r => r.data),
    staleTime: 30_000,
  })

  // Domain awareness
  const domains = useQuery({
    queryKey:  ['waanda-domains'],
    queryFn:   () => api.get('/admin/waanda/domains').then(r => r.data),
    staleTime: 60_000,
  })

  // Digital twin spotlight (on-demand)
  const twin = useQuery({
    queryKey:  ['waanda-twin', lookupId],
    queryFn:   () => api.get(`/kangqore/urgi/twin/${lookupId}`).then(r => r.data),
    enabled:   !!lookupId,
    retry:     false,
    staleTime: 30_000,
  })

  const evidenceList: any[] = evidence.data?.data ?? []
  const domainList: any[]   = domains.data?.domains ?? []
  const twinData: any       = twin.data?.data

  return (
    <div className="space-y-8">

      {/* ── Evidence ledger */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase">
            Relationship Facts
          </div>
          <span className="text-sm text-white/40">{evidenceList.length} facts observed</span>
        </div>

        {evidence.isLoading ? (
          <div className="text-sm text-white/40">Loading evidence…</div>
        ) : evidenceList.length === 0 ? (
          <div className="text-sm text-white/40">
            No relationship facts yet. WAANDA will populate this as visitors interact.
          </div>
        ) : (
          <div className="space-y-1.5" style={{ maxHeight: 320, overflowY: 'auto' }}>
            {evidenceList.map((row: any, i: number) => (
              <div
                key={row.id ?? i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: confidenceBg(row.confidence), color: confidenceColor(row.confidence) }}
                >
                  {row.confidence}%
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-white/70 mr-2">{row.factKey}</span>
                  <span className="text-sm text-white/45">{row.factValue}</span>
                </div>
                <span className="text-[11px] text-white/25 flex-shrink-0">{row.visitor}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}
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
          <div className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase mb-4">
            Entity Spotlight
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={twinId}
              onChange={e => setTwinId(e.target.value)}
              placeholder="Enter visitor or user ID…"
              className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-[#2564ea]/50"
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

          {twin.isLoading && <div className="text-sm text-white/40">Retrieving profile…</div>}

          {twin.isError && (
            <div className="text-sm" style={{ color: '#f43f5e' }}>
              No profile found for <span className="font-mono">{lookupId}</span>.
            </div>
          )}

          {twinData && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-medium text-white/80">{twinData.identity}</div>
                  <div className="text-xs text-white/35 font-mono mt-0.5">{twinData.visitorId ?? twinData.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light" style={{ color: confidenceColor(twinData.trustScore ?? 0) }}>
                    {Math.round(twinData.trustScore ?? 0)}
                  </div>
                  <div className="text-[11px] text-white/35">trust score</div>
                </div>
              </div>

              {(twinData.recentFacts ?? []).length > 0 && (
                <div>
                  <div className="text-[11px] text-white/30 mb-1.5">Known facts</div>
                  <div className="space-y-1">
                    {(twinData.recentFacts as string[]).map((f, i) => (
                      <div key={i} className="text-sm text-white/55 pl-2" style={{ borderLeft: '2px solid rgba(37,100,234,0.4)' }}>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(twinData.timeline ?? []).length > 0 && (
                <div>
                  <div className="text-[11px] text-white/30 mb-1.5">Recent history</div>
                  <div className="space-y-1">
                    {(twinData.timeline as string[]).map((t, i) => (
                      <div key={i} className="text-sm text-white/45">{t}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!lookupId && !twin.isLoading && (
            <div className="text-sm text-white/30">
              Enter an ID to see what WAANDA knows about this entity.
            </div>
          )}
        </div>

        {/* Enterprise awareness */}
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase mb-4">
            Enterprise Awareness
          </div>
          {domains.isLoading ? (
            <div className="text-sm text-white/40">Loading domains…</div>
          ) : (
            <div className="space-y-3">
              {domainList.map((d: any, i: number) => (
                <div
                  key={d.id ?? i}
                  className="p-3 rounded-lg flex items-center justify-between"
                  style={{ background: 'rgba(255,255,255,0.025)' }}
                >
                  <div>
                    <div className="text-sm font-medium text-white/70">{d.name}</div>
                    <div className="text-[11px] text-white/35 mt-0.5">{d.purpose}</div>
                  </div>
                  <div className="flex items-center gap-3 text-right ml-4 flex-shrink-0">
                    <div>
                      <div className="text-base font-light text-white/60">{d.capabilities ?? d.objects}</div>
                      <div className="text-[10px] text-white/25">capabilities</div>
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
    </div>
  )
}
