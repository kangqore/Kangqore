import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', TEAL = '#06b6d4'

export function AfricaLaunchPage() {
  const q = useQuery({ queryKey: ['africa-launch'], queryFn: () => api.get('/admin/kangqore-immp/platform/africa-launch').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S278 · Chapter 12 T3 — 500-Customer Fleet</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>🌍 Africa Commercial Launch — South Africa · Nigeria</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.totalCustomersOnboarded ?? 10} customers · {d?.totalPipelineProspects ?? 25} pipeline · {d?.regionsNowActive ?? 12} regions now active globally</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Customers (Africa)', value: d?.totalCustomersOnboarded ?? 10,                          color: GREEN },
          { label: 'Pipeline Prospects', value: d?.totalPipelineProspects ?? 25,                           color: AMBER },
          { label: 'ARR (GBP)',          value: `£${((d?.combinedARR?.gbp ?? 320_000) / 1000).toFixed(0)}K`, color: TEAL },
          { label: 'Global Regions',     value: d?.regionsNowActive ?? 12,                                 color: BLUE  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Strategic value */}
      <div style={{ background: `linear-gradient(135deg, ${AMBER}10, ${GREEN}06)`, border: `1.5px solid ${AMBER}30`, borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Strategic Value</div>
        <div style={{ fontSize: 13, color: '#ccdde0', lineHeight: 1.6 }}>{d?.strategicValue ?? 'Africa = largest untapped enterprise AI market. First-mover in SA + Nigeria opens Egypt, Kenya, Ghana pipeline.'}</div>
      </div>

      {/* Market cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        {(d?.markets ?? []).map((m: any) => (
          <div key={m.country} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{m.country === 'South Africa' ? '🇿🇦' : '🇳🇬'} {m.country}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 12 }}>{m.city} · {m.currency} · {m.infrastructureNode}</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}25`, borderRadius: 8, padding: '8px 12px', flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: GREEN }}>{m.customersOnboarded}</div>
                <div style={{ fontSize: 9, color: '#8899aa', marginTop: 2 }}>live</div>
              </div>
              <div style={{ background: `${AMBER}12`, border: `1px solid ${AMBER}25`, borderRadius: 8, padding: '8px 12px', flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: AMBER }}>{m.pipelineProspects}</div>
                <div style={{ fontSize: 9, color: '#8899aa', marginTop: 2 }}>pipeline</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {(m.sectors ?? []).map((s: string) => (
                <span key={s} style={{ fontSize: 9, fontWeight: 700, color: TEAL, background: `${TEAL}12`, border: `1px solid ${TEAL}28`, borderRadius: 4, padding: '2px 8px' }}>{s}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(m.compliance ?? []).map((c: string) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={12} color={GREEN} />
                  <span style={{ fontSize: 10, color: '#8899aa' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
