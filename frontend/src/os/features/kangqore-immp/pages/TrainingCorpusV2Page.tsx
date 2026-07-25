import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const DOMAIN_COLOR: Record<string, string> = { Finance: GREEN, PMO: BLUE, CRM: AMBER, HR: PURPLE, Strategy: '#06b6d4' }

export function TrainingCorpusV2Page() {
  const qc = useQueryClient()
  const statsQ = useQuery({ queryKey: ['gen5-corpus-stats'], queryFn: () => api.get('/admin/kangqore-immp/gen5/corpus/stats').then(r => r.data), staleTime: 10_000 })
  const expandMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen5/corpus/expand', {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen5-corpus-stats'] }),
  })

  const stats   = statsQ.data ?? {}
  const total   = stats.total ?? 0
  const target  = stats.target ?? 50000
  const pct     = Math.min(100, Math.round((total / target) * 100))
  const byDomain: any[] = stats.byDomain ?? []
  const byTier: any[]   = stats.byTier ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S200 · Training Corpus v2</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen5 Corpus — 50K+ Target</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Production Gen4 decisions + quality tier audit v2 · Finance / PMO / CRM / HR / Strategy coverage</p>
      </div>

      {/* Progress hero */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '22px 26px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: BLUE, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{total.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>of {target.toLocaleString()} target · {pct}% complete</div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: GREEN }}>{stats.highQuality ?? 0}</div>
              <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase' }}>Quality ≥ 0.85</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: AMBER }}>{byDomain.length}</div>
              <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase' }}>Domains</div>
            </div>
          </div>
        </div>
        <div style={{ height: 8, background: '#263250', borderRadius: 999, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${BLUE}, ${GREEN})`, borderRadius: 999, transition: 'width .5s ease' }} />
        </div>
        <button onClick={() => expandMut.mutate()} disabled={expandMut.isPending}
          style={{ background: BLUE, border: 'none', color: '#0d1824', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: expandMut.isPending ? 0.7 : 1 }}>
          {expandMut.isPending ? 'Expanding from Gen4 decisions…' : '⚡ Expand from Gen4 Production Decisions'}
        </button>
        {expandMut.isSuccess && <div style={{ fontSize: 11, color: GREEN, marginTop: 8 }}>✓ {(expandMut.data as any)?.data?.added ?? 0} examples added · total: {(expandMut.data as any)?.data?.total?.toLocaleString()}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* By domain */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '13px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>By Domain</div>
          {byDomain.length === 0 ? (
            <div style={{ padding: 24, color: '#556', fontSize: 12, textAlign: 'center' }}>Click Expand to populate corpus.</div>
          ) : byDomain.map((d: any) => {
            const domainTotal = total || 1
            const pctD = Math.round((d._count / domainTotal) * 100)
            const color = DOMAIN_COLOR[d.domain] ?? BLUE
            return (
              <div key={d.domain} style={{ padding: '10px 18px', borderBottom: '1px solid #1e2a40' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{d.domain}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{d._count.toLocaleString()}</span>
                </div>
                <div style={{ height: 4, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pctD}%`, background: color, borderRadius: 999 }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* By tier */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '13px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>By Quality Tier</div>
          {byTier.length === 0 ? (
            <div style={{ padding: 24, color: '#556', fontSize: 12, textAlign: 'center' }}>No data yet.</div>
          ) : byTier.map((t: any) => {
            const color = t.tier === 'HIGH' ? GREEN : t.tier === 'SYNTHETIC' ? PURPLE : BLUE
            return (
              <div key={t.tier} style={{ padding: '14px 18px', borderBottom: '1px solid #1e2a40' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: color + '18', color }}>{t.tier}</span>
                  <div style={{ flex: 1, height: 4, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((t._count / (total || 1)) * 100)}%`, background: color, borderRadius: 999 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{t._count.toLocaleString()}</span>
                </div>
              </div>
            )
          })}
          <div style={{ padding: '14px 18px', background: '#0f1828' }}>
            <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.6 }}>
              HIGH (quality ≥ 0.85) → prime training data<br />
              STANDARD (0.7–0.85) → supporting context<br />
              SYNTHETIC → WAANDA-generated pairs
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
