import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', TEAL = '#06b6d4'

export function SingaporeLaunchPage() {
  const q = useQuery({ queryKey: ['singapore-launch'], queryFn: () => api.get('/admin/kangqore-immp/platform/singapore-launch').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S274 · Chapter 12 T3 — 500-Customer Fleet</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>🇸🇬 Singapore Commercial Launch — ASEAN Gateway</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.customersOnboarded ?? 12} customers onboarded · {d?.pipelineProspects ?? 35} pipeline prospects · {d?.totalAddrMarket ?? '3,200 enterprises'} TAM</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Customers Live', value: d?.customersOnboarded ?? 12,                      color: GREEN },
          { label: 'Pipeline',       value: d?.pipelineProspects ?? 35,                       color: AMBER },
          { label: 'ARR (GBP)',      value: `£${((d?.arr?.gbp ?? 940_000) / 1000).toFixed(0)}K`, color: TEAL },
          { label: 'Node',           value: 'ap-southeast-1',                                  color: BLUE  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: s.label === 'Node' ? 13 : 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Strategic value banner */}
      <div style={{ background: `linear-gradient(135deg, ${TEAL}10, ${GREEN}06)`, border: `1.5px solid ${TEAL}30`, borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Strategic Value</div>
        <div style={{ fontSize: 13, color: '#ccdde0', lineHeight: 1.6 }}>{d?.strategicValue ?? 'ASEAN gateway — Singapore win opens Malaysia, Indonesia, Thailand, Philippines pipeline'}</div>
      </div>

      {/* Sector breakdown */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '2fr 80px 80px 120px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Sector</span><span>Prospects</span><span>Live</span><span>Avg ACV</span>
        </div>
        {(d?.sectors ?? []).map((s: any, i: number) => (
          <div key={s.name} style={{ padding: '11px 20px', borderBottom: i < (d?.sectors?.length ?? 4) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '2fr 80px 80px 120px', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: '#ccdde0', fontWeight: 700 }}>{s.name}</span>
            <span style={{ color: AMBER }}>{s.prospects}</span>
            <span style={{ color: GREEN, fontWeight: 700 }}>{s.customers}</span>
            <span style={{ color: TEAL, fontWeight: 700 }}>£{(s.avgACV / 1000).toFixed(0)}K</span>
          </div>
        ))}
      </div>

      {/* Compliance */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(d?.compliance ?? []).map((c: any) => (
          <div key={c.name} style={{ background: '#1a2235', border: `1px solid ${GREEN}18`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircle2 size={14} color={GREEN} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: GREEN, minWidth: 60 }}>{c.name}</span>
            <span style={{ fontSize: 11, color: '#8899aa' }}>{c.full}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
