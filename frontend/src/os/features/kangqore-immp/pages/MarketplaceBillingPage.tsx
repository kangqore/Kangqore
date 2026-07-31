import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function MarketplaceBillingPage() {
  const q = useQuery({ queryKey: ['marketplace-billing'], queryFn: () => api.get('/admin/kangqore-immp/platform/marketplace-billing').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  const fmt = (n: number) => `£${n.toLocaleString()}`

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S248 · Marketplace Billing Live</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>App Store Revenue — Automated</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>70/30 revenue split automated · partner payout ledger · marketplace ARR tracking · first third-party revenue events</p>
      </div>

      {/* Revenue cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Gross MRR', value: d?.grossMRR ? fmt(d.grossMRR) : '—', color: BLUE },
          { label: 'Kangqore MRR (70%)', value: d?.kangqoreMRR ? fmt(d.kangqoreMRR) : '—', color: GREEN },
          { label: 'Partner MRR (30%)', value: d?.partnerMRR ? fmt(d.partnerMRR) : '—', color: AMBER },
          { label: 'Marketplace ARR', value: d?.marketplaceARR ? fmt(d.marketplaceARR) : '—', color: PURPLE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue split visual */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Revenue Split — Automated 70/30</div>
        <div style={{ display: 'flex', gap: 0, height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ width: '70%', background: GREEN }} />
          <div style={{ width: '30%', background: AMBER }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: GREEN, fontWeight: 700 }}>70% → Kangqore ({d?.kangqoreMRR ? fmt(d.kangqoreMRR) : '—'}/mo)</span>
          <span style={{ fontSize: 11, color: AMBER, fontWeight: 700 }}>30% → Partners ({d?.partnerMRR ? fmt(d.partnerMRR) : '—'}/mo)</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
          {[
            { label: 'Automated Payouts', value: d?.automatedPayouts ? '✓ Live' : '—', color: GREEN },
            { label: 'First Revenue Event', value: d?.firstRevenueEvent ?? '2026-05', color: BLUE },
            { label: 'Split Automated', value: d?.splitAutomated ? '✓' : '—', color: PURPLE },
          ].map(s => (
            <span key={s.label} style={{ fontSize: 10, fontWeight: 700, color: s.color, background: s.color + '10', border: `1px solid ${s.color}25`, borderRadius: 6, padding: '4px 10px' }}>{s.label}: {s.value}</span>
          ))}
        </div>
      </div>

      {/* Payout ledger */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '1fr 60px 80px 90px 90px 70px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Partner</span><span>Apps</span><span>Gross Rev</span><span>Kangqore</span><span>Partner Pay</span><span>Status</span>
        </div>
        {(d?.payoutLedger ?? []).map((row: any, i: number) => (
          <div key={row.partner} style={{ padding: '10px 20px', borderBottom: i < (d?.payoutLedger?.length ?? 10) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '1fr 60px 80px 90px 90px 70px', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: '#ccdde0', fontWeight: 600 }}>{row.partner}</span>
            <span style={{ color: '#8899aa' }}>{row.apps}</span>
            <span style={{ color: row.grossRevenue > 0 ? BLUE : '#4a5568', fontVariantNumeric: 'tabular-nums' }}>{row.grossRevenue > 0 ? fmt(row.grossRevenue) : '—'}</span>
            <span style={{ color: row.kangqoreShare > 0 ? GREEN : '#4a5568', fontVariantNumeric: 'tabular-nums' }}>{row.kangqoreShare > 0 ? fmt(row.kangqoreShare) : '—'}</span>
            <span style={{ color: row.partnerPayout > 0 ? AMBER : '#4a5568', fontVariantNumeric: 'tabular-nums' }}>{row.partnerPayout > 0 ? fmt(row.partnerPayout) : '—'}</span>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: row.status === 'PAID' ? `${GREEN}18` : '#263250', color: row.status === 'PAID' ? GREEN : '#8899aa' }}>{row.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
