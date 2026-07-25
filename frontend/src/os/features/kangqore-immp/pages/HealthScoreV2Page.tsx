import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'

const GRADE_COLOR: Record<string, string> = { A: '#00ddaa', B: '#4fc3f7', C: '#ffaa00', D: '#ff5252' }
const GRADE_BG: Record<string, string>    = { A: '#00ddaa18', B: '#4fc3f718', C: '#ffaa0018', D: '#ff525218' }

export function HealthScoreV2Page() {
  const [data, setData]   = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [seed, setSeed]   = useState(false)

  useEffect(() => {
    api.get('/admin/kangqore-immp/customers/health-scores-v2').then(r => setData(r.data)).catch(() => setData({ scores: [], gradeDist: { A: 0, B: 0, C: 0, D: 0 }, atRisk: 0, amber: 0 })).finally(() => setLoading(false))
  }, [seed])

  const runSeed = async () => {
    setSeed(false)
    // Seed v2 score for a demo customer
    const bps = await api.get('/admin/kangqore-immp/customers/blueprints').then(r => r.data).catch(() => [])
    if (bps.length) {
      await api.post(`/admin/kangqore-immp/customers/${bps[0].id}/health-score-v2`, {
        oisDelta: 8.4, coigVelocity: 1.2, loginFrequency: 4.5, featureDepth: 0.72,
        signalVolume: 28, agentUsage: 0.65, workflowRuns: 14, blueprintVersionLag: 0,
        npsScore: 4.1, supportTickets: 1, renewalProximityDays: 180,
        daysSinceLastDecision: 3, oisVelocity: 0.9, coigAttribution: 8.3, engagementDepthScore: 74,
      }).catch(() => {})
    }
    setSeed(true)
  }

  if (loading) return <div style={{ padding: 40, color: '#aaa', textAlign: 'center' }}>Loading Health Score v2…</div>

  const { scores = [], gradeDist = {}, atRisk = 0, amber = 0 } = data ?? {}
  const total = scores.length

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S174 · Customer Intelligence</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Health Score v2</h1>
          <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>OIS velocity · COIG attribution · NPS cohort · engagement depth · grade A–D</p>
        </div>
        <button onClick={runSeed} style={{ background: '#00ddaa22', border: '1px solid #00ddaa44', color: '#00ddaa', padding: '9px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          Seed Demo Score
        </button>
      </div>

      {/* Grade Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {(['A','B','C','D'] as const).map(g => (
          <div key={g} style={{ background: GRADE_BG[g], border: `1px solid ${GRADE_COLOR[g]}33`, borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: GRADE_COLOR[g] }}>{(gradeDist as any)[g] ?? 0}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4, fontWeight: 600, letterSpacing: 1 }}>GRADE {g}</div>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Scored', value: total, color: '#e4e8f0' },
          { label: 'At Risk (RED)', value: atRisk, color: '#ff5252' },
          { label: 'Monitoring (AMBER)', value: amber, color: '#ffaa00' },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Score Table */}
      {scores.length > 0 ? (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #263250' }}>
                {['Customer', 'Grade', 'Score', 'OIS Vel (pts/wk)', 'COIG Attr %', 'Engagement', 'NPS Cohort', 'Tier'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', color: '#8899aa', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scores.map((s: any) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #1e2a40' }}>
                  <td style={{ padding: '12px 16px', color: '#ccdde0', fontWeight: 500 }}>{s.customerId.slice(0, 12)}…</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: GRADE_BG[s.healthGrade ?? 'D'], color: GRADE_COLOR[s.healthGrade ?? 'D'], padding: '3px 10px', borderRadius: 6, fontWeight: 700, fontSize: 13 }}>{s.healthGrade ?? '–'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#e4e8f0', fontWeight: 600 }}>{s.totalScore}</td>
                  <td style={{ padding: '12px 16px', color: '#4fc3f7' }}>{s.oisVelocity != null ? `+${s.oisVelocity.toFixed(1)}` : '–'}</td>
                  <td style={{ padding: '12px 16px', color: '#00ddaa' }}>{s.coigAttribution != null ? `${s.coigAttribution}%` : '–'}</td>
                  <td style={{ padding: '12px 16px', color: '#8899aa' }}>{s.engagementDepthScore != null ? `${s.engagementDepthScore}/100` : '–'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {s.npsCohort ? <span style={{ fontSize: 11, fontWeight: 600, color: s.npsCohort === 'PROMOTER' ? '#00ddaa' : s.npsCohort === 'DETRACTOR' ? '#ff5252' : '#ffaa00' }}>{s.npsCohort}</span> : <span style={{ color: '#556' }}>–</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.tier === 'GREEN' ? '#00ddaa' : s.tier === 'AMBER' ? '#ffaa00' : '#ff5252' }}>{s.tier}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '40px', textAlign: 'center', color: '#556' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 14, marginBottom: 6, color: '#8899aa' }}>No v2 scores yet</div>
          <div style={{ fontSize: 12, color: '#556' }}>Click "Seed Demo Score" to generate your first Health Score v2 record.</div>
        </div>
      )}

      {/* v2 New Metrics Callout */}
      <div style={{ marginTop: 24, background: '#0d1824', border: '1px solid #00ddaa33', borderRadius: 12, padding: '20px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#00ddaa', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>v2 New Metrics</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'OIS Velocity', desc: 'Weekly OIS pts/wk change. Bonus up to +5 pts on total score. Signals improving trajectory.', color: '#4fc3f7' },
            { label: 'COIG Attribution', desc: 'This customer\'s share of fleet-wide COIG gain. Identifies top OIS performers.', color: '#00ddaa' },
            { label: 'Health Grade A–D', desc: 'Replaces binary RED/AMBER/GREEN. A=85+, B=70+, C=50+, D=<50. Finer-grained CSM targeting.', color: '#ff9800' },
          ].map(m => (
            <div key={m.label} style={{ borderLeft: `2px solid ${m.color}`, paddingLeft: 12 }}>
              <div style={{ fontWeight: 700, color: m.color, fontSize: 13, marginBottom: 4 }}>{m.label}</div>
              <div style={{ color: '#8899aa', fontSize: 12, lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
