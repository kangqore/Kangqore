import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'

const HEALTH_COLOR: Record<string, string> = { ON_TRACK: '#00ddaa', AT_RISK: '#ffaa00', OVERDUE: '#ff5252' }
const STEP_STATUS_COLOR: Record<string, string> = { COMPLETED: '#00ddaa', PENDING: '#556', OVERDUE: '#ff5252' }
const VERTICALS = ['HealthTech', 'LegalTech', 'FinTech', 'default']

export function PlaybookEnginePage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [selected, setSelected]   = useState<string | null>(null)
  const [playbook, setPlaybook]   = useState<any>(null)
  const [loading, setLoading]     = useState(false)
  const [saving, setSaving]       = useState<number | null>(null)
  const [outcome, setOutcome]     = useState('')

  useEffect(() => {
    api.get('/admin/kangqore-immp/customers/blueprints').then(r => {
      const active = (r.data ?? []).filter((b: any) => b.status === 'ACTIVE').slice(0, 20)
      setCustomers(active)
      if (active.length && !selected) setSelected(active[0].id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selected) return
    setLoading(true)
    api.get(`/admin/kangqore-immp/customers/${selected}/playbook`).then(r => setPlaybook(r.data)).catch(() => setPlaybook(null)).finally(() => setLoading(false))
  }, [selected])

  const completeStep = async (stepIndex: number) => {
    if (!selected) return
    setSaving(stepIndex)
    await api.post(`/admin/kangqore-immp/customers/${selected}/playbook/step`, { stepIndex, status: 'COMPLETED', notes: 'Completed via Playbook Engine' }).catch(() => {})
    const fresh = await api.get(`/admin/kangqore-immp/customers/${selected}/playbook`).then(r => r.data).catch(() => null)
    setPlaybook(fresh)
    setSaving(null)
  }

  const saveOutcome = async () => {
    if (!selected || !outcome.trim()) return
    await api.post(`/admin/kangqore-immp/customers/${selected}/playbook/outcome`, { outcomeNotes: outcome }).catch(() => {})
    setOutcome('')
  }

  const sel = customers.find(c => c.id === selected)
  const steps: any[] = playbook?.steps ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S178 · Customer Success</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Playbook Engine</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Vertical-specific CSM playbooks · 30/60/90-day milestones · WAANDA-managed success workflow · outcome documentation</p>
      </div>

      {/* Customer Selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select value={selected ?? ''} onChange={e => setSelected(e.target.value)}
          style={{ background: '#1a2235', border: '1px solid #263250', color: '#e4e8f0', padding: '10px 16px', borderRadius: 8, fontSize: 13, flex: 1, maxWidth: 360 }}>
          {customers.map(c => <option key={c.id} value={c.id}>{c.customerName} — {c.industry}</option>)}
        </select>
      </div>

      {loading && <div style={{ color: '#8899aa', padding: 20 }}>Loading playbook…</div>}

      {!loading && playbook && sel && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Playbook Steps */}
          <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #263250', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0' }}>{sel.customerName}</div>
                <div style={{ fontSize: 11, color: '#8899aa' }}>{playbook.vertical} Playbook · Step {playbook.currentStep}/{steps.length}</div>
              </div>
              <span style={{ background: `${HEALTH_COLOR[playbook.health]}22`, color: HEALTH_COLOR[playbook.health], padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                {playbook.health.replace('_', ' ')}
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ padding: '12px 24px', background: '#141e2e', borderBottom: '1px solid #263250' }}>
              <div style={{ background: '#263250', borderRadius: 6, height: 6 }}>
                <div style={{ height: 6, borderRadius: 6, background: 'linear-gradient(90deg, #00ddaa, #4fc3f7)', width: `${steps.length ? (steps.filter((s: any) => s.status === 'COMPLETED').length / steps.length) * 100 : 0}%`, transition: 'width 0.6s ease' }} />
              </div>
            </div>

            {steps.map((step: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 24px', borderBottom: '1px solid #1e2a40', opacity: step.status === 'COMPLETED' ? 0.7 : 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${STEP_STATUS_COLOR[step.status] ?? '#556'}22`, border: `2px solid ${STEP_STATUS_COLOR[step.status] ?? '#556'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {step.status === 'COMPLETED' ? <span style={{ color: '#00ddaa', fontSize: 14 }}>✓</span> : <span style={{ color: '#8899aa', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ccdde0', marginBottom: 2 }}>{step.label}</div>
                  <div style={{ fontSize: 11, color: '#8899aa' }}>Day {step.day}</div>
                  {step.completedAt && <div style={{ fontSize: 11, color: '#00ddaa44', marginTop: 2 }}>Completed {new Date(step.completedAt).toLocaleDateString()}</div>}
                </div>
                {step.status !== 'COMPLETED' && (
                  <button onClick={() => completeStep(i)} disabled={saving === i}
                    style={{ background: '#00ddaa22', border: '1px solid #00ddaa44', color: '#00ddaa', padding: '5px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600, flexShrink: 0, opacity: saving === i ? 0.6 : 1 }}>
                    {saving === i ? '…' : 'Done'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Right Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Vertical Templates */}
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Vertical Templates</div>
              {VERTICALS.map(v => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e2a40' }}>
                  <span style={{ fontSize: 12, color: '#ccdde0' }}>{v === 'default' ? 'Enterprise (default)' : v}</span>
                  <span style={{ fontSize: 11, color: '#556' }}>6 steps</span>
                </div>
              ))}
            </div>

            {/* Outcome Notes */}
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Outcome Documentation</div>
              {playbook.outcomeNotes && (
                <div style={{ background: '#0d1824', borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#8899aa', marginBottom: 12, lineHeight: 1.6 }}>{playbook.outcomeNotes}</div>
              )}
              <textarea value={outcome} onChange={e => setOutcome(e.target.value)}
                placeholder="Document success outcome, expansion, or churn reason…"
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 12, resize: 'vertical', minHeight: 80, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
              <button onClick={saveOutcome} style={{ marginTop: 10, background: '#00ddaa', border: 'none', color: '#0d1824', padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700, width: '100%' }}>
                Save Outcome
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !playbook && !sel && (
        <div style={{ color: '#556', padding: 20, textAlign: 'center' }}>Select a customer to view their playbook.</div>
      )}
    </div>
  )
}
