import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'

export function FleetSixtyPage() {
  const [patterns, setPatterns] = useState<any>(null)
  const [s179, setS179]         = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [seeding, setSeeding]   = useState(false)

  const load = () => {
    Promise.all([
      api.get('/admin/kangqore-immp/customers/fleet/vertical-patterns').then(r => r.data).catch(() => null),
      api.get('/admin/kangqore-immp/platform/s179-status').then(r => r.data).catch(() => null),
    ]).then(([p, g]) => { setPatterns(p); setS179(g) }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const seed = async () => {
    setSeeding(true)
    await api.post('/admin/kangqore-immp/customers/seed-c51-c60').catch(() => {})
    load()
    setSeeding(false)
  }

  if (loading) return <div style={{ padding: 40, color: '#aaa', textAlign: 'center' }}>Loading 60-Fleet…</div>

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S179 · Fleet Expansion</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>60-Fleet — COIG Correlation Analysis</h1>
          <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>C51–C60 provisioned · COIG correlation begins · vertical cohort patterns emerging</p>
        </div>
        <button onClick={seed} disabled={seeding}
          style={{ background: '#00ddaa', border: 'none', color: '#0d1824', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: seeding ? 0.7 : 1 }}>
          {seeding ? 'Seeding C51–C60…' : 'Seed C51–C60'}
        </button>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #4fc3f718, #00ddaa18)', border: '1px solid #4fc3f733', borderRadius: 16, padding: '28px 40px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 40 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: '#4fc3f7', lineHeight: 1 }}>{s179?.fleetSize ?? 0}</div>
          <div style={{ fontSize: 13, color: '#8899aa', marginTop: 4 }}>Active Customers</div>
        </div>
        <div style={{ width: 1, height: 80, background: '#263250' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: '#00ddaa', lineHeight: 1 }}>{patterns?.verticalsWithPattern ?? 0}</div>
          <div style={{ fontSize: 13, color: '#8899aa', marginTop: 4 }}>Verticals with Emerging Patterns</div>
        </div>
        <div style={{ width: 1, height: 80, background: '#263250' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: '#ffaa00', lineHeight: 1 }}>{patterns?.total ?? 0}</div>
          <div style={{ fontSize: 13, color: '#8899aa', marginTop: 4 }}>Data Points for Correlation</div>
        </div>
      </div>

      {/* Vertical Patterns */}
      {patterns?.patterns?.length > 0 && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>
            COIG Correlation by Vertical
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #263250' }}>
                {['Vertical', 'Customers', 'Avg OIS Baseline', 'Avg OIS Target', 'Avg COIG Δ', 'Pattern Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', color: '#8899aa', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patterns.patterns.map((p: any) => (
                <tr key={p.vertical} style={{ borderBottom: '1px solid #1e2a40' }}>
                  <td style={{ padding: '12px 16px', color: '#ccdde0', fontWeight: 600 }}>{p.vertical}</td>
                  <td style={{ padding: '12px 16px', color: '#e4e8f0', fontWeight: 700 }}>{p.count}</td>
                  <td style={{ padding: '12px 16px', color: '#8899aa' }}>{p.avgBaseline}</td>
                  <td style={{ padding: '12px 16px', color: '#4fc3f7' }}>{p.avgTarget}</td>
                  <td style={{ padding: '12px 16px', color: '#00ddaa', fontWeight: 700 }}>+{p.avgCoig}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: p.coigCorrelation === 'EMERGING' ? '#00ddaa22' : '#55555522', color: p.coigCorrelation === 'EMERGING' ? '#00ddaa' : '#8899aa', padding: '3px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700 }}>
                      {p.coigCorrelation === 'EMERGING' ? '● EMERGING' : '○ INSUFFICIENT DATA'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gate S179 */}
      {s179 && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>S179 Gate — {s179.passed}/{s179.total} ({s179.score}%)</div>
          {s179.criteria?.map((c: any) => (
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
