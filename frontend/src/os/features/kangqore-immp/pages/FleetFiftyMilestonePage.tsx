import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'

export function FleetFiftyMilestonePage() {
  const [dist, setDist] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [s176, setS176] = useState<any>(null)

  const load = () => {
    Promise.all([
      api.get('/admin/kangqore-immp/customers/fleet/ois-distribution').then(r => r.data).catch(() => null),
      api.get('/admin/kangqore-immp/platform/s176-status').then(r => r.data).catch(() => null),
    ]).then(([d, g]) => { setDist(d); setS176(g) }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const seed = async () => {
    setSeeding(true)
    await api.post('/admin/kangqore-immp/customers/seed-c41-c50').catch(() => {})
    load()
    setSeeding(false)
  }

  if (loading) return <div style={{ padding: 40, color: '#aaa', textAlign: 'center' }}>Loading 50-Fleet…</div>

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S176 · Fleet Milestone</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>50-Fleet Milestone 🎯</h1>
          <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>C41–C50 provisioned · Fleet OIS distribution · First cohort comparison</p>
        </div>
        <button onClick={seed} disabled={seeding}
          style={{ background: '#00ddaa', border: 'none', color: '#0d1824', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: seeding ? 0.7 : 1 }}>
          {seeding ? 'Seeding C41–C50…' : 'Seed C41–C50'}
        </button>
      </div>

      {/* Hero stat */}
      <div style={{ background: 'linear-gradient(135deg, #00ddaa18, #4fc3f718)', border: '1px solid #00ddaa33', borderRadius: 16, padding: '32px 40px', marginBottom: 28, textAlign: 'center' }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: '#00ddaa', lineHeight: 1 }}>{dist?.total ?? 0}</div>
        <div style={{ fontSize: 16, color: '#8899aa', marginTop: 8, fontWeight: 500 }}>Active Customers in Fleet</div>
        <div style={{ fontSize: 13, color: '#556', marginTop: 4 }}>Avg OIS Baseline: <span style={{ color: '#4fc3f7', fontWeight: 700 }}>{dist?.avgOis ?? 0}</span></div>
      </div>

      {/* OIS Distribution */}
      {dist?.distribution && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '24px 28px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Fleet OIS Distribution</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
            {Object.entries(dist.distribution).map(([band, cnt]: any) => {
              const max = Math.max(...Object.values(dist.distribution) as number[], 1)
              const h = Math.round((cnt / max) * 100)
              return (
                <div key={band} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e8f0' }}>{cnt}</div>
                  <div style={{ width: '100%', height: h, background: band === '80+' ? '#00ddaa' : band === '70-80' ? '#4fc3f7' : band === '60-70' ? '#ffaa00' : '#ff9800', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
                  <div style={{ fontSize: 11, color: '#8899aa' }}>{band}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* By Industry */}
      {dist?.byIndustry && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '24px 28px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Cohort by Vertical</div>
          {Object.entries(dist.byIndustry).sort((a: any, b: any) => b[1].count - a[1].count).map(([vertical, stats]: any) => (
            <div key={vertical} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 160, fontSize: 13, color: '#ccdde0', fontWeight: 500 }}>{vertical}</div>
              <div style={{ flex: 1, background: '#263250', borderRadius: 4, height: 8 }}>
                <div style={{ height: 8, borderRadius: 4, background: '#4fc3f7', width: `${(stats.count / (dist.total || 1)) * 100}%` }} />
              </div>
              <div style={{ width: 40, textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#4fc3f7' }}>{stats.count}</div>
              <div style={{ width: 80, textAlign: 'right', fontSize: 12, color: '#8899aa' }}>Avg {stats.avgOis}</div>
            </div>
          ))}
        </div>
      )}

      {/* Gate criteria */}
      {s176 && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>S176 Gate — {s176.passed}/{s176.total} ({s176.score}%)</div>
          {s176.criteria?.map((c: any) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #1e2a40' }}>
              <span style={{ color: c.passed ? '#00ddaa' : '#ff5252', fontSize: 16 }}>{c.passed ? '✓' : '✗'}</span>
              <span style={{ fontSize: 13, color: c.passed ? '#ccdde0' : '#8899aa' }}>{c.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
