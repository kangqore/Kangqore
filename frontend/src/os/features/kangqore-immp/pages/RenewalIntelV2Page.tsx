import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'

const ACTION_COLOR: Record<string, string> = { EXPAND: '#00ddaa', RENEW: '#4fc3f7', NURTURE: '#ffaa00', ESCALATE: '#ff5252', OFFBOARD: '#ff2255' }

export function RenewalIntelV2Page() {
  const [customers, setCustomers]   = useState<any[]>([])
  const [selected, setSelected]     = useState<string | null>(null)
  const [predictions, setPredictions] = useState<any>(null)
  const [pitch, setPitch]           = useState<string | null>(null)
  const [predicting, setPredicting] = useState(false)
  const [loadingPitch, setLoadingPitch] = useState(false)
  const [outcome, setOutcome]       = useState<string | null>(null)
  const [savingOutcome, setSavingOutcome] = useState(false)

  useEffect(() => {
    api.get('/admin/kangqore-immp/customers/blueprints').then(r => {
      const active = (r.data ?? []).filter((b: any) => b.status === 'ACTIVE').slice(0, 20)
      setCustomers(active)
      if (active.length && !selected) setSelected(active[0].id)
    }).catch(() => {})
    api.get('/admin/kangqore-immp/customers/renewal/predictions').then(r => setPredictions(r.data)).catch(() => {})
  }, [])

  const predict = async () => {
    if (!selected) return
    setPredicting(true)
    setPitch(null)
    await api.post(`/admin/kangqore-immp/customers/${selected}/renewal/predict`).catch(() => {})
    const fresh = await api.get('/admin/kangqore-immp/customers/renewal/predictions').then(r => r.data).catch(() => null)
    setPredictions(fresh)
    setPredicting(false)
  }

  const buildPitch = async () => {
    if (!selected) return
    setLoadingPitch(true)
    const r = await api.post(`/admin/kangqore-immp/customers/${selected}/renewal/pitch`).catch(() => null)
    setPitch(r?.data?.pitch ?? 'Pitch unavailable.')
    setLoadingPitch(false)
  }

  const logOutcome = async (o: string) => {
    if (!selected) return
    setSavingOutcome(true)
    await api.post(`/admin/kangqore-immp/customers/${selected}/renewal/outcome`, { outcome: o }).catch(() => {})
    const fresh = await api.get('/admin/kangqore-immp/customers/renewal/predictions').then(r => r.data).catch(() => null)
    setPredictions(fresh)
    setOutcome(o)
    setSavingOutcome(false)
  }

  const sel = customers.find(c => c.id === selected)
  const allPreds: any[] = predictions?.predictions ?? []
  const selPred = allPreds.find((p: any) => p.customerId === selected)

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S180 · Revenue Intelligence</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Renewal Intelligence v2</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>90-day prediction · Day-60 nudge · COIG-driven pitch builder · outcome logging</p>
      </div>

      {/* Fleet summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Predictions', value: predictions?.total ?? 0, color: '#e4e8f0' },
          { label: 'Avg Likelihood', value: `${predictions?.avgLikelihood ?? 0}%`, color: '#4fc3f7' },
          { label: 'Needs Nudge', value: predictions?.needsNudge ?? 0, color: '#ffaa00' },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Prediction Panel */}
        <div>
          <select value={selected ?? ''} onChange={e => { setSelected(e.target.value); setPitch(null); setOutcome(null) }}
            style={{ background: '#1a2235', border: '1px solid #263250', color: '#e4e8f0', padding: '10px 16px', borderRadius: 8, fontSize: 13, width: '100%', marginBottom: 16 }}>
            {customers.map(c => <option key={c.id} value={c.id}>{c.customerName} — {c.industry}</option>)}
          </select>

          {sel && (
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '24px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0', marginBottom: 16 }}>{sel.customerName}</div>

              {selPred ? (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 56, fontWeight: 900, color: selPred.renewalLikelihood >= 70 ? '#00ddaa' : selPred.renewalLikelihood >= 45 ? '#ffaa00' : '#ff5252' }}>
                      {selPred.renewalLikelihood}%
                    </div>
                    <div style={{ fontSize: 12, color: '#8899aa', marginTop: 4 }}>Renewal Likelihood</div>
                    <div style={{ display: 'inline-block', marginTop: 10, background: `${ACTION_COLOR[selPred.recommendedAction] ?? '#556'}22`, color: ACTION_COLOR[selPred.recommendedAction] ?? '#8899aa', padding: '4px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                      {selPred.recommendedAction}
                    </div>
                  </div>

                  {(selPred.riskFactors ?? []).length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>RISK FACTORS</div>
                      {selPred.riskFactors.map((rf: any, i: number) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1e2a40', fontSize: 12 }}>
                          <span style={{ color: '#ccdde0' }}>{rf.factor}</span>
                          <span style={{ color: rf.impact === 'HIGH' ? '#ff5252' : '#ffaa00', fontWeight: 600 }}>{rf.impact}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selPred.nudgeSentAt && (
                    <div style={{ background: '#ffaa0018', border: '1px solid #ffaa0044', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#ffaa00', marginBottom: 16 }}>
                      Day-60 nudge sent {new Date(selPred.nudgeSentAt).toLocaleDateString()}
                    </div>
                  )}

                  {/* Outcome logging */}
                  {!selPred.outcome && (
                    <div>
                      <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>LOG OUTCOME</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['RENEWED', 'EXPANDED', 'CHURNED'].map(o => (
                          <button key={o} onClick={() => logOutcome(o)} disabled={savingOutcome}
                            style={{ flex: 1, background: o === 'CHURNED' ? '#ff525222' : o === 'EXPANDED' ? '#00ddaa22' : '#4fc3f722', border: `1px solid ${o === 'CHURNED' ? '#ff5252' : o === 'EXPANDED' ? '#00ddaa' : '#4fc3f7'}44`, color: o === 'CHURNED' ? '#ff5252' : o === 'EXPANDED' ? '#00ddaa' : '#4fc3f7', padding: '7px', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {selPred.outcome && (
                    <div style={{ background: '#00ddaa18', border: '1px solid #00ddaa33', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#00ddaa' }}>
                      Outcome recorded: <strong>{selPred.outcome}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ color: '#556', fontSize: 13, marginBottom: 16 }}>No prediction yet for this customer.</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={predict} disabled={predicting} style={{ flex: 1, background: '#4fc3f7', border: 'none', color: '#0d1824', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: predicting ? 0.7 : 1 }}>
                  {predicting ? 'Predicting…' : 'Run Prediction'}
                </button>
                <button onClick={buildPitch} disabled={loadingPitch} style={{ flex: 1, background: '#00ddaa22', border: '1px solid #00ddaa44', color: '#00ddaa', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: loadingPitch ? 0.7 : 1 }}>
                  {loadingPitch ? 'Building…' : 'Build Pitch'}
                </button>
              </div>
            </div>
          )}

          {/* Pitch */}
          {pitch && (
            <div style={{ marginTop: 16, background: '#0d1824', border: '1px solid #00ddaa33', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#00ddaa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>WAANDA Renewal Pitch</div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: '#ccdde0', borderLeft: '3px solid #00ddaa', paddingLeft: 16 }}>{pitch}</div>
            </div>
          )}
        </div>

        {/* Predictions List */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>All Predictions</div>
          {allPreds.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#556', fontSize: 13 }}>No predictions yet. Run "Predict" on any customer.</div>
          ) : allPreds.slice(0, 15).map((p: any) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #1e2a40', cursor: 'pointer' }} onClick={() => setSelected(p.customerId)}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#ccdde0', fontWeight: 500 }}>{p.customerId.slice(0, 16)}…</div>
                <div style={{ fontSize: 11, color: '#556', marginTop: 2 }}>{new Date(p.predictedAt).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: p.renewalLikelihood >= 70 ? '#00ddaa' : p.renewalLikelihood >= 45 ? '#ffaa00' : '#ff5252' }}>{p.renewalLikelihood}%</div>
                <div style={{ fontSize: 10, color: ACTION_COLOR[p.recommendedAction] ?? '#8899aa', fontWeight: 600 }}>{p.recommendedAction}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
