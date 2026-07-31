import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, MapPin } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', TEAL = '#06b6d4'
const STATUS_COLOR: Record<string, string> = { LIVE: GREEN, PIPELINE: AMBER }

export function CanadaLaunchPage() {
  const q = useQuery({ queryKey: ['canada-launch'], queryFn: () => api.get('/admin/kangqore-immp/platform/canada-launch').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S273 · Chapter 12 T3 — 500-Customer Fleet</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>🇨🇦 Canada Commercial Launch — Toronto · Vancouver · Montreal</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.customersOnboarded ?? 12} customers onboarded · {d?.pipelineProspects ?? 8} pipeline prospects · {d?.totalAddrMarket ?? '4,800 enterprises'} TAM</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Customers Live', value: d?.customersOnboarded ?? 12,                                      color: GREEN },
          { label: 'Pipeline',       value: d?.pipelineProspects ?? 8,                                        color: AMBER },
          { label: 'ARR (GBP)',      value: `£${((d?.arr?.gbp ?? 490_000) / 1000).toFixed(0)}K`,              color: TEAL  },
          { label: 'Partners',       value: (d?.keyPartners ?? []).length,                                     color: BLUE  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Regions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {(d?.regions ?? []).map((r: any) => {
          const sc = STATUS_COLOR[r.status] ?? AMBER
          return (
            <div key={r.city} style={{ background: '#1a2235', border: `1px solid ${sc}20`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <MapPin size={16} color={sc} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0' }}>{r.city}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: `${sc}18`, color: sc }}>{r.status}</span>
                </div>
                <div style={{ fontSize: 11, color: '#8899aa' }}>{r.province} · {r.sector}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Compliance */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Compliance Frameworks</div>
        {(d?.compliance ?? []).map((c: any, i: number) => (
          <div key={c.name} style={{ padding: '11px 20px', borderBottom: i < (d?.compliance?.length ?? 4) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircle2 size={14} color={GREEN} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: GREEN, minWidth: 80 }}>{c.name}</span>
            <span style={{ fontSize: 11, color: '#8899aa' }}>{c.full}</span>
          </div>
        ))}
      </div>

      <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}22`, borderRadius: 12, padding: '12px 18px' }}>
        <span style={{ fontSize: 12, color: '#8899aa' }}>Infrastructure node: <span style={{ color: TEAL, fontWeight: 700 }}>{d?.infrastructureNode ?? 'Toronto (ca-central-1)'}</span> · DR: <span style={{ color: TEAL, fontWeight: 700 }}>{d?.drNode ?? 'Montreal'}</span></span>
      </div>
    </div>
  )
}
