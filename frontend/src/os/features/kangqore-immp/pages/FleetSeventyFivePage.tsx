import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'

export function FleetSeventyFivePage() {
  const [caseStudies, setCaseStudies] = useState<any>(null)
  const [s181, setS181]               = useState<any>(null)
  const [loading, setLoading]         = useState(true)
  const [seeding, setSeeding]         = useState(false)

  const load = () => {
    Promise.all([
      api.get('/admin/kangqore-immp/customers/fleet/case-studies').then(r => r.data).catch(() => null),
      api.get('/admin/kangqore-immp/platform/s181-status').then(r => r.data).catch(() => null),
    ]).then(([cs, g]) => { setCaseStudies(cs); setS181(g) }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const seed = async () => {
    setSeeding(true)
    await api.post('/admin/kangqore-immp/customers/seed-c61-c75').catch(() => {})
    load()
    setSeeding(false)
  }

  if (loading) return <div style={{ padding: 40, color: '#aaa', textAlign: 'center' }}>Loading 75-Fleet…</div>

  const candidates: any[] = caseStudies?.candidates ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S181 · Fleet Milestone</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>75-Fleet 🏆 — Case Study Candidates</h1>
          <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>C61–C75 provisioned · statistically meaningful COIG patterns · first case studies identified</p>
        </div>
        <button onClick={seed} disabled={seeding}
          style={{ background: '#00ddaa', border: 'none', color: '#0d1824', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: seeding ? 0.7 : 1 }}>
          {seeding ? 'Seeding C61–C75…' : 'Seed C61–C75'}
        </button>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #00ddaa1a, #4fc3f71a, #ffaa001a)', border: '1px solid #00ddaa33', borderRadius: 16, padding: '32px 40px', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {[
            { value: s181?.fleetSize ?? 0, label: 'Total Fleet', color: '#fff' },
            { value: caseStudies?.total ?? 0, label: 'Case Study Candidates', color: '#00ddaa' },
            { value: `+${caseStudies?.avgProjectedGain ?? 0}`, label: 'Avg Projected OIS Gain', color: '#4fc3f7' },
            { value: `≥${caseStudies?.threshold ?? 15}`, label: 'Candidacy Threshold (pts)', color: '#ffaa00' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#8899aa', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Candidates */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>
          Top Case Study Candidates (Projected OIS Gain ≥ {caseStudies?.threshold ?? 15} pts)
        </div>
        {candidates.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#556', fontSize: 13 }}>No candidates yet. Seed C61–C75 to populate.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #263250' }}>
                {['#', 'Customer', 'Vertical', 'OIS Baseline', 'OIS Target', 'Projected Gain', 'Candidacy Reason'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', color: '#8899aa', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((c: any, i: number) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #1e2a40' }}>
                  <td style={{ padding: '12px 16px', color: '#556', fontWeight: 700 }}>#{i + 1}</td>
                  <td style={{ padding: '12px 16px', color: '#fff', fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: '12px 16px', color: '#8899aa' }}>{c.industry}</td>
                  <td style={{ padding: '12px 16px', color: '#8899aa' }}>{c.oisBaseline}</td>
                  <td style={{ padding: '12px 16px', color: '#4fc3f7' }}>{c.oisTarget}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#00ddaa22', color: '#00ddaa', padding: '3px 10px', borderRadius: 5, fontWeight: 700, fontSize: 13 }}>+{c.projectedGain}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#8899aa', fontSize: 12 }}>{c.candidacyReason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Statistical Significance Note */}
      <div style={{ background: '#0d1824', border: '1px solid #4fc3f733', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#4fc3f7', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Statistical Significance</div>
        <div style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.7 }}>
          At {s181?.fleetSize ?? 0} customers, fleet COIG patterns are now statistically meaningful (n ≥ 75 threshold crossed).
          Case study candidates are selected based on projected OIS gain ≥ {caseStudies?.threshold ?? 15} points — these customers will provide the strongest ROI narrative for enterprise sales.
          The pattern data can now be used to benchmark incoming customer OIS targets against vertical cohort norms.
        </div>
      </div>

      {/* Gate S181 */}
      {s181 && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>S181 Gate — {s181.passed}/{s181.total} ({s181.score}%)</div>
          {s181.criteria?.map((c: any) => (
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
