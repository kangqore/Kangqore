import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const QUICK_PILLARS = [
  'Strategic Direction', 'Financial Health', 'Digital Maturity',
  'Customer Experience', 'Operational Excellence', 'People & Talent', 'Risk & Compliance'
]

const INDUSTRIES = ['Technology', 'Financial Services', 'Healthcare', 'Legal', 'Manufacturing', 'Retail', 'Professional Services', 'Education', 'Logistics', 'Energy']
const REVENUE_RANGES = ['< £500K', '£500K – £2M', '£2M – £10M', '£10M – £50M', '> £50M']
const EMPLOYEE_RANGES = ['1–10', '11–50', '51–200', '201–500', '500+']

function MiniScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? GREEN : score >= 55 ? BLUE : AMBER
  return (
    <div style={{ marginBottom: 7 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: '#8899aa' }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{score}</span>
      </div>
      <div style={{ height: 4, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 999 }} />
      </div>
    </div>
  )
}

export function BidsSmbScanPage() {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    companyName: '', industry: 'Technology', contactName: '', contactEmail: '',
    revenueRange: '< £500K', employeeRange: '1–10', topChallenge: '',
  })
  const [submitted, setSubmitted] = useState<any>(null)

  const scansQ = useQuery({ queryKey: ['bids-smb-scans'], queryFn: () => api.get('/admin/kangqore-immp/bids/smb-scans').then(r => r.data), staleTime: 15_000 })

  const scanMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/bids/smb-scans', form),
    onSuccess: (r: any) => { qc.invalidateQueries({ queryKey: ['bids-smb-scans'] }); setSubmitted(r.data); setForm({ companyName: '', industry: 'Technology', contactName: '', contactEmail: '', revenueRange: '< £500K', employeeRange: '1–10', topChallenge: '' }) },
  })

  const scans: any[] = scansQ.data?.scans ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S197 · SMB Self-Serve</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>BIDS™ Quick Scan</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>7-pillar quick-scan · £2,499 flat · automated scorecard in 48h · Transformation Blueprint™ summary</p>
      </div>

      {/* Pricing hero */}
      <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '20px 24px', marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 20 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 6 }}>BIDS™ Quick Scan — SMB Edition</div>
          <div style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.7 }}>
            7 core pillars · WAANDA-evaluated scoring · Diagnostic Scorecard™ + Blueprint™ summary · delivered in 48h · ideal for businesses with &lt;200 employees
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {['7 Pillars', 'WAANDA Scored', '48h Delivery', 'Blueprint Summary', 'Digital Report'].map(f => (
              <span key={f} style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: AMBER + '18', color: AMBER }}>{f}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: AMBER, lineHeight: 1 }}>£2,499</div>
          <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>flat fee · one-time</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Intake form */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Company Intake Form</div>

          {submitted ? (
            <div style={{ padding: '20px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: GREEN, marginBottom: 6 }}>✓ Scan Submitted</div>
              <div style={{ fontSize: 13, color: '#ccdde0', marginBottom: 4 }}>Overall Score: <strong style={{ color: GREEN }}>{submitted.overall}/100</strong> · Grade: <strong style={{ color: GREEN }}>{submitted.grade}</strong></div>
              <div style={{ fontSize: 11, color: '#8899aa' }}>Full report generated via WAANDA. View in the scans list →</div>
              <button onClick={() => setSubmitted(null)} style={{ marginTop: 14, background: BLUE, border: 'none', color: '#0d1824', padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>New Scan</button>
            </div>
          ) : (
            <>
              <input placeholder="Company Name *" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12, marginBottom: 8, boxSizing: 'border-box' }} />
              <input placeholder="Contact Name" value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12, marginBottom: 8, boxSizing: 'border-box' }} />
              <input placeholder="Contact Email *" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12, marginBottom: 8, boxSizing: 'border-box' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <select value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                  style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 10px', borderRadius: 7, fontSize: 12 }}>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
                <select value={form.revenueRange} onChange={e => setForm(f => ({ ...f, revenueRange: e.target.value }))}
                  style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 10px', borderRadius: 7, fontSize: 12 }}>
                  {REVENUE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <select value={form.employeeRange} onChange={e => setForm(f => ({ ...f, employeeRange: e.target.value }))}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 10px', borderRadius: 7, fontSize: 12, marginBottom: 8 }}>
                {EMPLOYEE_RANGES.map(r => <option key={r} value={r}>{r} employees</option>)}
              </select>
              <input placeholder="Top business challenge" value={form.topChallenge} onChange={e => setForm(f => ({ ...f, topChallenge: e.target.value }))}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12, marginBottom: 12, boxSizing: 'border-box' }} />

              <div style={{ background: '#263250', borderRadius: 7, padding: '10px 12px', marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: AMBER, marginBottom: 6 }}>7 Pillars Covered</div>
                {QUICK_PILLARS.map(p => <div key={p} style={{ fontSize: 10, color: '#8899aa', marginBottom: 2 }}>✓ {p}</div>)}
              </div>

              <button onClick={() => scanMut.mutate()} disabled={!form.companyName || !form.contactEmail || scanMut.isPending}
                style={{ width: '100%', background: AMBER, border: 'none', color: '#0d1824', padding: 11, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 800, opacity: scanMut.isPending ? 0.7 : 1 }}>
                {scanMut.isPending ? 'Processing…' : '⚡ Submit & Pay £2,499'}
              </button>
            </>
          )}
        </div>

        {/* Scan results */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Completed Scans ({scans.filter((s: any) => s.status === 'COMPLETE').length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {scans.map((s: any) => (
              <div key={s.id} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0' }}>{s.companyName}</div>
                    <div style={{ fontSize: 10, color: '#8899aa' }}>{s.industry} · {s.employeeRange} employees</div>
                  </div>
                  {s.scoreJson && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: GREEN, lineHeight: 1 }}>{s.scoreJson.overall}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#8899aa' }}>Grade {s.scoreJson.grade}</div>
                    </div>
                  )}
                </div>
                {s.scoreJson?.pillars && (
                  <div>
                    {Object.entries(s.scoreJson.pillars).map(([pillar, score]: [string, any]) => (
                      <MiniScoreBar key={pillar} label={pillar} score={score} />
                    ))}
                  </div>
                )}
                <div style={{ marginTop: 8, fontSize: 10, color: '#556' }}>Submitted {new Date(s.createdAt).toLocaleDateString()} · {s.contactEmail}</div>
              </div>
            ))}
            {scans.length === 0 && <div style={{ color: '#556', fontSize: 13, textAlign: 'center', padding: 24 }}>No scans submitted yet.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
