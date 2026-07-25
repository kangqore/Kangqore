import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'

const HEALTH_COLOR: Record<string, string> = { GREEN: '#00ddaa', AMBER: '#ffaa00', RED: '#ff5252' }

export function FleetIntelligencePage() {
  const [heatmap, setHeatmap]   = useState<any>(null)
  const [cohorts, setCohorts]   = useState<any>(null)
  const [briefing, setBriefing] = useState<string | null>(null)
  const [loadingBrief, setLoadingBrief] = useState(false)
  const [loading, setLoading]   = useState(true)
  const [view, setView] = useState<'heatmap' | 'cohorts' | 'risk'>('heatmap')

  useEffect(() => {
    Promise.all([
      api.get('/admin/kangqore-immp/customers/fleet/heatmap').then(r => r.data).catch(() => null),
      api.get('/admin/kangqore-immp/customers/fleet/cohorts').then(r => r.data).catch(() => null),
    ]).then(([h, c]) => { setHeatmap(h); setCohorts(c) }).finally(() => setLoading(false))
  }, [])

  const generateBriefing = async () => {
    setLoadingBrief(true)
    const r = await api.post('/admin/kangqore-immp/customers/fleet/briefing').catch(() => null)
    setBriefing(r?.data?.briefing ?? 'Fleet briefing unavailable.')
    setLoadingBrief(false)
  }

  if (loading) return <div style={{ padding: 40, color: '#aaa', textAlign: 'center' }}>Loading Fleet Intelligence…</div>

  const tiles = heatmap?.heatmap ?? []
  const atRisk = heatmap?.atRisk ?? []
  const byVertical = cohorts?.byVertical ?? []
  const byPlan = cohorts?.byPlan ?? []
  const byRegion = cohorts?.byRegion ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S177 · Customer Intelligence</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Fleet Intelligence Dashboard</h1>
          <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>OIS heatmap · cohort analytics · top-5 at-risk · WAANDA fleet briefing</p>
        </div>
        <button onClick={generateBriefing} disabled={loadingBrief}
          style={{ background: '#4fc3f722', border: '1px solid #4fc3f744', color: '#4fc3f7', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: loadingBrief ? 0.7 : 1 }}>
          {loadingBrief ? 'Generating…' : 'WAANDA Fleet Briefing'}
        </button>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Fleet Size', value: heatmap?.total ?? 0, color: '#e4e8f0' },
          { label: 'Avg OIS', value: heatmap?.avgOis ?? 0, color: '#4fc3f7' },
          { label: 'At Risk', value: atRisk.length, color: '#ff5252' },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* WAANDA Briefing */}
      {briefing && (
        <div style={{ background: '#0d1824', border: '1px solid #4fc3f733', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4fc3f7', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>WAANDA Fleet Briefing</div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: '#ccdde0', borderLeft: '3px solid #4fc3f7', paddingLeft: 16 }}>{briefing}</div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#1a2235', borderRadius: 10, padding: 4, border: '1px solid #263250', width: 'fit-content' }}>
        {(['heatmap', 'cohorts', 'risk'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{ padding: '8px 20px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: view === v ? '#4fc3f7' : 'transparent', color: view === v ? '#0d1824' : '#8899aa' }}>
            {v === 'heatmap' ? 'OIS Heatmap' : v === 'cohorts' ? 'Cohorts' : 'At-Risk Top 5'}
          </button>
        ))}
      </div>

      {/* Heatmap */}
      {view === 'heatmap' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {tiles.map((t: any) => (
            <div key={t.id} style={{ background: `${HEALTH_COLOR[t.health]}18`, border: `1px solid ${HEALTH_COLOR[t.health]}44`, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: HEALTH_COLOR[t.health], marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.health}</div>
              <div style={{ fontSize: 12, color: '#ccdde0', fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{t.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: HEALTH_COLOR[t.health] }}>{t.oisNow}</span>
                <span style={{ fontSize: 10, color: '#556' }}>{t.industry?.slice(0, 8)}</span>
              </div>
              <div style={{ background: '#1a2235', borderRadius: 3, height: 4, marginTop: 8 }}>
                <div style={{ height: 4, borderRadius: 3, background: HEALTH_COLOR[t.health], width: `${Math.min(100, (t.oisNow / (t.oisTarget || 100)) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cohorts */}
      {view === 'cohorts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[{ label: 'By Vertical', data: byVertical }, { label: 'By Plan', data: byPlan }, { label: 'By Region', data: byRegion }].map(group => (
            <div key={group.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>{group.label}</div>
              {group.data.map((item: any) => (
                <div key={item.key} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: '#ccdde0' }}>{item.key}</span>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontSize: 11, color: '#8899aa' }}>{item.count} cust</span>
                      <span style={{ fontSize: 11, color: '#4fc3f7', fontWeight: 600 }}>OIS {item.avgOis}</span>
                    </div>
                  </div>
                  <div style={{ background: '#263250', borderRadius: 4, height: 5 }}>
                    <div style={{ height: 5, borderRadius: 4, background: '#4fc3f7', width: `${(item.count / (cohorts?.total || 1)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* At-Risk */}
      {view === 'risk' && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#ff5252', letterSpacing: 1, textTransform: 'uppercase' }}>Top 5 At-Risk Customers</div>
          {atRisk.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#556', fontSize: 13 }}>No at-risk customers — fleet is healthy.</div>
          ) : atRisk.map((t: any, i: number) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: '1px solid #1e2a40' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#ff525233', width: 30 }}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#fff', marginBottom: 2 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: '#8899aa' }}>{t.industry} · {t.region} · {t.plan}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#ff5252' }}>{t.oisNow}</div>
                <div style={{ fontSize: 11, color: '#8899aa' }}>OIS Now</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#ffaa00' }}>{t.coig > 0 ? '+' : ''}{t.coig}</div>
                <div style={{ fontSize: 11, color: '#8899aa' }}>COIG Δ</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
