import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const REVENUE_SPLIT = { kangqore: 70, partner: 30 }

const OEM_PARTNERS = [
  { id: 'nexus-nova', name: 'Nexus Intelligence', brand: 'NOVA Diagnostic™', icon: '🧬', color: PURPLE },
]

export function BidsPartnerDeliveryPage() {
  const qc = useQueryClient()
  const [form, setForm] = useState({ customerId: '', customerName: '', title: '', oemPartnerId: 'nexus-nova', oemPartnerName: 'Nexus Intelligence', verticalPack: 'STANDARD' })

  const partnerQ = useQuery({ queryKey: ['bids-partner-engagements'], queryFn: () => api.get('/admin/kangqore-immp/bids/partner-engagements').then(r => r.data), staleTime: 15_000 })

  const createMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/bids/engagements', { ...form, tier: 'STANDARD' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bids-partner-engagements'] }); setForm(f => ({ ...f, customerId: '', customerName: '', title: '' })) },
  })

  const engagements: any[] = partnerQ.data?.engagements ?? []
  const totalRevenue = engagements.filter((e: any) => e.status === 'COMPLETED').length * 4999

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S196 · Partner Delivery</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>OEM Partner BIDS™ Delivery</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>White-label scorecard · Nexus/NOVA Diagnostic™ · 70/30 revenue split · partner-branded delivery</p>
      </div>

      {/* Revenue split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Partner Engagements', value: engagements.length, color: PURPLE },
          { label: 'Completed',           value: engagements.filter((e: any) => e.status === 'COMPLETED').length, color: GREEN },
          { label: 'Kangqore Share (70%)', value: `£${Math.round(totalRevenue * 0.7).toLocaleString()}`, color: BLUE },
          { label: 'Partner Share (30%)',  value: `£${Math.round(totalRevenue * 0.3).toLocaleString()}`, color: AMBER },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8899aa', marginTop: 5 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue split visual */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Revenue Split Model</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: 28, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ flex: REVENUE_SPLIT.kangqore, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#0d1824' }}>Kangqore {REVENUE_SPLIT.kangqore}%</span>
          </div>
          <div style={{ flex: REVENUE_SPLIT.partner, background: PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>Partner {REVENUE_SPLIT.partner}%</span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#8899aa', marginTop: 10 }}>
          Standard BIDS™ engagement (£4,999 list price) → £3,499 to Kangqore + £1,500 to partner. Enterprise tier (£14,999) → £10,499 + £4,500.
        </div>
      </div>

      {/* Partner profiles */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Certified OEM Partners</div>
        {OEM_PARTNERS.map(p => (
          <div key={p.id} style={{ background: p.color + '08', border: `1px solid ${p.color}30`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 28 }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: p.color, fontWeight: 700, marginTop: 2 }}>Delivering as: {p.brand}</div>
              <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>
                Certified BIDS™ delivery partner · white-label scorecard · partner-branded Executive Reports · 30% revenue share
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: p.color }}>{engagements.filter((e: any) => e.oemPartnerId === p.id).length}</div>
              <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase' }}>engagements</div>
            </div>
          </div>
        ))}
      </div>

      {/* NOVA Diagnostic preview */}
      <div style={{ background: '#1a2235', border: '1px solid rgba(167,139,250,0.25)', borderRadius: 12, padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>NOVA Diagnostic™ White-Label Preview</div>
        <div style={{ background: '#0f1624', borderRadius: 8, padding: '14px 16px', border: '1px solid #1e2a40' }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: PURPLE, marginBottom: 4 }}>NOVA Diagnostic™</div>
          <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 10 }}>Powered by Nexus Intelligence · Business Intelligence Assessment</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Strategic', 'Financial', 'Digital', 'People'].map(d => (
              <div key={d} style={{ flex: 1, background: PURPLE + '12', border: `1px solid ${PURPLE}25`, borderRadius: 6, padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: PURPLE }}>{Math.floor(50 + Math.random() * 30)}</div>
                <div style={{ fontSize: 9, color: '#8899aa', marginTop: 2 }}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: '#556', marginTop: 10, textAlign: 'right' }}>
            NOVA Diagnostic™ is a white-label product. Underlying engine: BIDS™ by Kangqore.
          </div>
        </div>
      </div>

      {/* Create partner engagement */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '18px 22px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>New OEM Engagement</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <input placeholder="Customer ID" value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
            style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12 }} />
          <input placeholder="Customer Name" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
            style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8 }}>
          <input placeholder="Engagement Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12 }} />
          <select value={form.verticalPack} onChange={e => setForm(f => ({ ...f, verticalPack: e.target.value }))}
            style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 10px', borderRadius: 7, fontSize: 12 }}>
            {['STANDARD', 'ARIA', 'LEX', 'FINX'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <button onClick={() => createMut.mutate()} disabled={!form.customerId || !form.customerName || !form.title || createMut.isPending}
            style={{ background: PURPLE, border: 'none', color: '#fff', padding: '9px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: createMut.isPending ? 0.7 : 1, whiteSpace: 'nowrap' }}>
            {createMut.isPending ? 'Opening…' : 'Open Partner Engagement'}
          </button>
        </div>
      </div>

      {/* Partner engagements list */}
      {engagements.length > 0 && (
        <div style={{ marginTop: 20, background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
            OEM Engagements ({engagements.length})
          </div>
          {engagements.map((e: any) => (
            <div key={e.id} style={{ padding: '12px 18px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{e.customerName}</div>
                <div style={{ fontSize: 10, color: '#8899aa' }}>Partner: {e.oemPartnerName} · {e.verticalPack}</div>
              </div>
              {e.overallScore != null && <span style={{ fontSize: 13, fontWeight: 800, color: GREEN }}>{e.overallScore}/100</span>}
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: e.status === 'COMPLETED' ? 'rgba(16,185,129,0.12)' : '#263250', color: e.status === 'COMPLETED' ? GREEN : '#8899aa' }}>{e.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
