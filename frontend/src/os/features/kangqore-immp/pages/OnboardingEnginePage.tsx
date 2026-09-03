import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'

const MILESTONE_LABEL: Record<string, string> = { DAY_0: 'Day 0 — Baseline', DAY_1: 'Day 1 — Activation', DAY_7: 'Day 7 — First Week', DAY_30: 'Day 30 — Checkpoint', DAY_90: 'Day 90 — QBR' }
const STATUS_COLOR: Record<string, string> = { COMPLETED: '#00ddaa', IN_PROGRESS: '#4fc3f7', PENDING: '#556', OVERDUE: '#ff5252' }
const DEPTS = ['Projects','Finance','CRM','WAANDA','HANUMANAS','Analytics','Workflows','Signals']

export function OnboardingEnginePage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [selected, setSelected]   = useState<string | null>(null)
  const [onboarding, setOnboarding] = useState<any>(null)
  const [briefing, setBriefing]   = useState<string | null>(null)
  const [loadingBrief, setLoadingBrief] = useState(false)
  const [activating, setActivating] = useState<string | null>(null)

  useEffect(() => {
    api.get('/admin/kangqore-immp/customers/blueprints').then(r => {
      const active = (r.data ?? []).filter((b: any) => b.status === 'ACTIVE').slice(0, 20)
      setCustomers(active)
      if (active.length && !selected) setSelected(active[0].id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selected) return
    setBriefing(null)
    api.get(`/admin/kangqore-immp/customers/${selected}/onboarding`).then(r => setOnboarding(r.data)).catch(() => setOnboarding(null))
  }, [selected])

  const completeMilestone = async (milestone: string) => {
    if (!selected) return
    await api.post(`/admin/kangqore-immp/customers/${selected}/onboarding/milestone`, { milestone, status: 'COMPLETED', notes: 'Completed via Onboarding Engine' })
    api.get(`/admin/kangqore-immp/customers/${selected}/onboarding`).then(r => setOnboarding(r.data)).catch(() => {})
  }

  const activateDept = async (dept: string, pct: number) => {
    if (!selected) return
    setActivating(dept)
    await api.post(`/admin/kangqore-immp/customers/${selected}/onboarding/activation-score`, { department: dept, activationPct: pct }).catch(() => {})
    const scores = await api.get(`/admin/kangqore-immp/customers/${selected}/onboarding/activation-scores`).then(r => r.data).catch(() => null)
    if (scores && onboarding) setOnboarding({ ...onboarding, activationScores: scores.scores, activationAvg: scores.avg })
    setActivating(null)
  }

  const generateBriefing = async () => {
    if (!selected) return
    setLoadingBrief(true)
    const r = await api.post(`/admin/kangqore-immp/customers/${selected}/onboarding/briefing`).catch(() => null)
    setBriefing(r?.data?.briefing ?? 'WAANDA is unavailable right now.')
    setLoadingBrief(false)
  }

  const sel = customers.find(c => c.id === selected)

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S175 · WAANDA Onboarding Engine</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Customer Activation</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Guided milestone nudges · Day 0/1/7/30/90 tracking · WAANDA briefing · activation score per department</p>
      </div>

      {/* Customer Selector */}
      <div style={{ marginBottom: 24 }}>
        <select value={selected ?? ''} onChange={e => setSelected(e.target.value)}
          style={{ background: '#1a2235', border: '1px solid #263250', color: '#e4e8f0', padding: '10px 16px', borderRadius: 8, fontSize: 13, width: '100%', maxWidth: 360 }}>
          {customers.map(c => <option key={c.id} value={c.id}>{c.customerName} — {c.industry}</option>)}
        </select>
      </div>

      {sel && onboarding && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Milestones */}
          <div>
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Onboarding Milestones — {sel.customerName}</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#00ddaa' }}>{onboarding.completedCount}/{onboarding.total}</div>
                  <div style={{ flex: 1, background: '#263250', borderRadius: 6, height: 6 }}>
                    <div style={{ height: 6, borderRadius: 6, background: 'linear-gradient(90deg, #00ddaa, #4fc3f7)', width: `${(onboarding.completedCount / onboarding.total) * 100}%`, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              </div>
              {(onboarding.milestones ?? []).map((m: any) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1e2a40' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLOR[m.status] ?? '#556', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#ccdde0' }}>{MILESTONE_LABEL[m.milestone] ?? m.milestone}</div>
                    {m.completedAt && <div style={{ fontSize: 11, color: '#556' }}>{new Date(m.completedAt).toLocaleDateString()}</div>}
                    {m.notes && <div style={{ fontSize: 11, color: '#8899aa', marginTop: 2 }}>{m.notes}</div>}
                  </div>
                  {m.status !== 'COMPLETED' && (
                    <button onClick={() => completeMilestone(m.milestone)}
                      style={{ background: '#00ddaa22', border: '1px solid #00ddaa44', color: '#00ddaa', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                      Complete
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* WAANDA Briefing */}
            <div style={{ marginTop: 20, background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>WAANDA Briefing</div>
                <button onClick={generateBriefing} disabled={loadingBrief}
                  style={{ background: '#4fc3f722', border: '1px solid #4fc3f744', color: '#4fc3f7', padding: '6px 16px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600, opacity: loadingBrief ? 0.6 : 1 }}>
                  {loadingBrief ? 'Generating…' : 'Generate Briefing'}
                </button>
              </div>
              {briefing ? (
                <div style={{ background: '#0d1824', borderRadius: 8, padding: '16px 20px', fontSize: 13, lineHeight: 1.7, color: '#ccdde0', borderLeft: '3px solid #4fc3f7' }}>
                  {briefing}
                </div>
              ) : (
                <div style={{ color: '#556', fontSize: 13 }}>Click "Generate Briefing" for a WAANDA CSM report on this customer.</div>
              )}
            </div>
          </div>

          {/* Activation Scores */}
          <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>Dept Activation Scores</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#00ddaa' }}>{onboarding.activationAvg ?? 0}% avg</div>
            </div>
            {DEPTS.map(dept => {
              const score = (onboarding.activationScores ?? []).find((s: any) => s.department === dept)
              const pct = score?.activationPct ?? 0
              return (
                <div key={dept} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: '#ccdde0', fontWeight: 500 }}>{dept}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: pct >= 80 ? '#00ddaa' : pct >= 50 ? '#ffaa00' : '#8899aa' }}>{pct}%</span>
                      {activating !== dept && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {[25, 50, 75, 100].map(v => (
                            <button key={v} onClick={() => activateDept(dept, v)}
                              style={{ background: '#263250', border: 'none', color: '#8899aa', padding: '2px 7px', borderRadius: 4, cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>
                              {v}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ background: '#263250', borderRadius: 4, height: 5 }}>
                    <div style={{ height: 5, borderRadius: 4, background: pct >= 80 ? '#00ddaa' : pct >= 50 ? '#ffaa00' : '#4fc3f7', width: `${pct}%`, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
