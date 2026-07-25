import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'

export function FleetOrganicSeedPage() {
  const [s173, setS173] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  const load = () => {
    Promise.all([
      api.get('/admin/kangqore-immp/platform/s173-status').then(r => r.data).catch(() => null),
    ]).then(([g]) => { setS173(g) }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const seed = async () => {
    setSeeding(true)
    await api.post('/admin/kangqore-immp/customers/seed-c36-c40').catch(() => {})
    load()
    setSeeding(false)
  }

  if (loading) return <div style={{ padding: 40, color: '#aaa', textAlign: 'center' }}>Loading…</div>

  const CUSTOMERS = [
    { ref: 'C36', name: 'Meridian Logistics',   industry: 'Logistics',  region: 'UK',    oisBaseline: 52.3 },
    { ref: 'C37', name: 'ClearPath Legal',       industry: 'LegalTech',  region: 'UK',    oisBaseline: 48.1 },
    { ref: 'C38', name: 'Nimble Health',         industry: 'HealthTech', region: 'EU',    oisBaseline: 61.2 },
    { ref: 'C39', name: 'Atlas Construction',    industry: 'Enterprise', region: 'US',    oisBaseline: 44.7 },
    { ref: 'C40', name: 'Braintree Advisory',    industry: 'Enterprise', region: 'UK',    oisBaseline: 57.8 },
  ]

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S173 · Customer Fleet</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>C36–C40: First 5 Organic Customers</h1>
          <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Blueprint Wizard provisioning · COIG Day-0 baseline · WAANDA onboarding begins · first real ARR events</p>
        </div>
        <button onClick={seed} disabled={seeding}
          style={{ background: '#00ddaa', border: 'none', color: '#0d1824', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: seeding ? 0.7 : 1 }}>
          {seeding ? 'Provisioning…' : 'Seed C36–C40'}
        </button>
      </div>

      {/* Customer Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
        {CUSTOMERS.map(c => (
          <div key={c.ref} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#00ddaa', letterSpacing: 1, marginBottom: 6 }}>{c.ref}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 8 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 4 }}>{c.industry}</div>
            <div style={{ fontSize: 11, color: '#556' }}>{c.region}</div>
            <div style={{ marginTop: 12, borderTop: '1px solid #263250', paddingTop: 10 }}>
              <div style={{ fontSize: 11, color: '#8899aa' }}>OIS Baseline</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#4fc3f7', marginTop: 2 }}>{c.oisBaseline}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gate */}
      {s173 && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
            S173 Gate — {s173.passed}/{s173.total} ({s173.score}%) — Fleet: {s173.fleetSize}
          </div>
          {s173.criteria?.map((c: any) => (
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
