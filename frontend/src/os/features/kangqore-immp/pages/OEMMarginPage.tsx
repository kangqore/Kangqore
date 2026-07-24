import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { DollarSign, Save } from 'lucide-react'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const GREEN = '#10b981'
const PURP  = '#7c3aed'
const AMBER = '#f59e0b'

const PARTNER_ID = 'partner-zero'
const TYPE_META: Record<string, { label: string; color: string }> = {
  WHOLESALE_CHARGE: { label: 'Wholesale',      color: '#3b82f6' },
  PARTNER_MARGIN:   { label: 'Partner Margin', color: GREEN },
  KANGQORE_CUT:     { label: 'Kangqore Cut',   color: PURP },
}

export function OEMMarginPage() {
  const qc = useQueryClient()
  const marginQ = useQuery({
    queryKey: ['oem-margin', PARTNER_ID],
    queryFn:  () => api.get(`/admin/kangqore-immp/oem/margin/${PARTNER_ID}`).then(r => r.data.margin),
    staleTime: 30_000,
  })
  const revenueQ = useQuery({
    queryKey: ['oem-revenue', PARTNER_ID],
    queryFn:  () => api.get(`/admin/kangqore-immp/oem/revenue-share?partnerId=${PARTNER_ID}`).then(r => r.data),
    staleTime: 30_000,
  })

  const margin = marginQ.data ?? {}
  const revenue = revenueQ.data ?? {}
  const entries: any[] = revenue.entries ?? []

  const [form, setForm] = useState({ wholesaleGBP: 249, retailGBP: 499, kangqoreCutPct: 45, partnerMarginPct: 55 })
  const mut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/oem/margin', { partnerId: PARTNER_ID, ...form }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['oem-margin', PARTNER_ID] }),
  })

  const activeW = margin.wholesaleGBP ?? form.wholesaleGBP
  const activeR = margin.retailGBP    ?? form.retailGBP
  const activeK = margin.kangqoreCutPct ?? form.kangqoreCutPct
  const activeP = margin.partnerMarginPct ?? form.partnerMarginPct

  return (
    <div style={{ maxWidth: 960 }} className="space-y-6">
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: T1, margin: 0 }}>OEM Billing & Margin Architecture</h2>
        <p style={{ fontSize: 12, color: T2, marginTop: 4 }}>Wholesale/retail price split, revenue share ledger, and partner margin dashboard.</p>
      </div>

      {/* Margin overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Wholesale Price',   value: `£${activeW}`,      color: '#3b82f6' },
          { label: 'Retail Price',      value: `£${activeR}`,      color: T1 },
          { label: 'Kangqore Cut',      value: `${activeK}%`,      color: PURP },
          { label: 'Partner Margin',    value: `${activeP}%`,      color: GREEN },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue share totals */}
      {(revenue.kangqoreMRR || revenue.partnerPay) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Total Cleared',    value: `£${(revenue.totalGBP ?? 0).toLocaleString()}`, color: T1 },
            { label: 'Kangqore Revenue', value: `£${(revenue.kangqoreCut ?? 0).toLocaleString()}`, color: PURP },
            { label: 'Partner Revenue',  value: `£${(revenue.partnerPay ?? 0).toLocaleString()}`, color: GREEN },
          ].map(s => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Config form */}
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <DollarSign style={{ width: 15, height: 15, color: GREEN }} />
            <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Margin Configuration</div>
          </div>
          {[
            { label: 'Wholesale Price (£/mo)', key: 'wholesaleGBP' as const },
            { label: 'Retail Price (£/mo)',    key: 'retailGBP'    as const },
            { label: 'Kangqore Cut (%)',        key: 'kangqoreCutPct' as const },
            { label: 'Partner Margin (%)',      key: 'partnerMarginPct' as const },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 10, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em' }}>{f.label}</label>
              <input type="number" value={form[f.key]} onChange={e => setForm(o => ({ ...o, [f.key]: parseFloat(e.target.value) }))}
                style={{ display: 'block', width: '100%', marginTop: 4, padding: '8px 12px', borderRadius: 8, border: `1px solid ${BDR}`, background: 'var(--os-surface-0)', color: T1, fontSize: 12 }} />
            </div>
          ))}
          <button onClick={() => mut.mutate()} disabled={mut.isPending}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: GREEN, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', width: 'fit-content' }}>
            <Save style={{ width: 12, height: 12 }} /> {mut.isPending ? 'Saving…' : 'Save Config'}
          </button>
        </div>

        {/* Revenue ledger */}
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Revenue Ledger</div>
          {entries.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: T2, fontSize: 12 }}>No entries. Seed Partner Zero to populate.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {entries.map((e: any, i: number) => {
                const meta = TYPE_META[e.type] ?? { label: e.type, color: T2 }
                return (
                  <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 18px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: meta.color }}>{meta.label}</div>
                      <div style={{ fontSize: 10, color: T2 }}>{e.description ?? '—'} · {e.period}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: meta.color, fontVariantNumeric: 'tabular-nums' }}>£{e.amountGBP.toLocaleString()}</div>
                      <div style={{ fontSize: 9, color: e.status === 'CLEARED' ? GREEN : AMBER }}>{e.status}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
