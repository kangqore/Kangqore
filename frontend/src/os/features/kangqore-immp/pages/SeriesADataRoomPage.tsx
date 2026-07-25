import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa', TEAL = '#06b6d4'

const SECTIONS = [
  {
    title: 'Company Overview', icon: '🏢', color: BLUE, status: 'COMPLETE',
    docs: ['Executive Summary', 'Company History & Mission', 'Product Vision 2027', 'Team & Advisors'],
  },
  {
    title: 'Product & Technology', icon: '🧠', color: PURPLE, status: 'COMPLETE',
    docs: ['WAANDA Platform Architecture', 'Gen5 Foundation Roadmap', 'WVIS Intelligence Canvas', 'BIDS™ Scoring Framework', 'AEGIS Governance Layer'],
  },
  {
    title: 'Traction & Metrics', icon: '📊', color: GREEN, status: 'COMPLETE',
    docs: ['75-Customer Fleet Summary', 'ARR Growth (Jan–Jul 2026)', 'COIG North Star Metrics', 'Customer Health Scores', 'NPS & Churn Data'],
  },
  {
    title: 'Market & Competition', icon: '🎯', color: AMBER, status: 'COMPLETE',
    docs: ['TAM / SAM / SOM Analysis', 'Competitive Positioning Map', 'Industry Edition Breakdown', 'OEM Partner Programme', 'International GTM'],
  },
  {
    title: 'Financials', icon: '💷', color: TEAL, status: 'IN REVIEW',
    docs: ['P&L 2024–2026 (actual)', 'ARR Forecast 2026–2028', 'Unit Economics per Tier', 'Series A Use of Funds', 'Cap Table (pre-round)'],
  },
  {
    title: 'Legal & Compliance', icon: '⚖️', color: '#8899aa', status: 'IN REVIEW',
    docs: ['Corporate Structure', 'IP Assignments', 'SOC2 Type II Summary', 'GDPR DPA Framework', 'Customer Contract Templates'],
  },
]

const STATUS_COLOR: Record<string, string> = { COMPLETE: GREEN, 'IN REVIEW': AMBER, PENDING: '#556' }

export function SeriesADataRoomPage() {
  const q = useQuery({ queryKey: ['series-a'], queryFn: () => api.get('/admin/kangqore-immp/platform/series-a').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  const completePct = Math.round((SECTIONS.filter(s => s.status === 'COMPLETE').length / SECTIONS.length) * 100)

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S211 · Series A Data Room</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Kangqore Series A — Investor Data Room</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>6 sections · 29 documents · ARR trajectory · 75-customer fleet · Gen5 AI engine · SOC2 compliance</p>
      </div>

      {/* Progress hero */}
      <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 2 }}>Data Room Readiness</div>
            <div style={{ fontSize: 11, color: '#8899aa' }}>{SECTIONS.filter(s => s.status === 'COMPLETE').length} of {SECTIONS.length} sections complete</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: AMBER, fontVariantNumeric: 'tabular-nums' }}>{completePct}%</div>
            <div style={{ fontSize: 9, color: '#8899aa' }}>ready for LP review</div>
          </div>
        </div>
        <div style={{ height: 8, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completePct}%`, background: `linear-gradient(90deg, ${AMBER}, ${GREEN})`, borderRadius: 999 }} />
        </div>
      </div>

      {/* Key investment highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Fleet', value: d?.customers ?? '75', sub: 'paying customers', color: BLUE },
          { label: 'ARR', value: d?.arr ? `£${(d.arr / 1000).toFixed(0)}K` : '£295K', sub: 'run-rate', color: GREEN },
          { label: 'Raise Target', value: '£3M', sub: 'Series A', color: AMBER },
          { label: 'Valuation', value: '£18M', sub: 'pre-money cap', color: PURPLE },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 8, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{m.label}</div>
            <div style={{ fontSize: 9, color: '#556', marginTop: 1 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Sections grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {SECTIONS.map(s => (
          <div key={s.title} style={{ background: '#1a2235', border: `1px solid ${s.color}20`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#ccdde0' }}>{s.title}</div>
              </div>
              <span style={{ fontSize: 8, fontWeight: 800, padding: '1px 7px', borderRadius: 4, background: (STATUS_COLOR[s.status] ?? '#556') + '15', color: STATUS_COLOR[s.status] ?? '#556' }}>{s.status}</span>
            </div>
            <div style={{ padding: '10px 14px' }}>
              {s.docs.map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.status === 'COMPLETE' ? GREEN : AMBER, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.3 }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
