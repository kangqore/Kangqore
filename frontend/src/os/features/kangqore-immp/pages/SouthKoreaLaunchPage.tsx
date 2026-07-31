import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', TEAL = '#06b6d4'
const STATUS_COLOR: Record<string, string> = { LOI_SIGNED: GREEN, RFP_STAGE: TEAL, DEMO_DONE: BLUE, PIPELINE: AMBER }

export function SouthKoreaLaunchPage() {
  const q = useQuery({ queryKey: ['south-korea-launch'], queryFn: () => api.get('/admin/kangqore-immp/platform/south-korea-launch').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S276 · Chapter 12 T3 — 500-Customer Fleet</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>🇰🇷 South Korea Commercial Launch — Chaebol-Aware Intelligence</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.customersOnboarded ?? 8} customers · {d?.pipelineProspects ?? 22} pipeline · {d?.totalAddrMarket ?? '2,800 enterprises'} TAM · {d?.infrastructureNode ?? 'Seoul ap-northeast-2'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Customers Live', value: d?.customersOnboarded ?? 8,                             color: GREEN },
          { label: 'Pipeline',       value: d?.pipelineProspects ?? 22,                             color: AMBER },
          { label: 'ARR (GBP)',      value: `£${((d?.arr?.gbp ?? 380_000) / 1000).toFixed(0)}K`,   color: TEAL  },
          { label: 'Chaebol Targets',value: (d?.chaebolTargets ?? []).length,                       color: BLUE  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Strategic value */}
      <div style={{ background: `linear-gradient(135deg, ${GREEN}10, ${TEAL}06)`, border: `1.5px solid ${GREEN}30`, borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Strategic Value</div>
        <div style={{ fontSize: 13, color: '#ccdde0', lineHeight: 1.6 }}>{d?.strategicValue ?? 'Chaebol LOI with Samsung = largest single ACV prospect in pipeline at £1.8M'}</div>
      </div>

      {/* Chaebol targets */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Chaebol Targets</div>
        {(d?.chaebolTargets ?? []).map((t: any, i: number) => {
          const sc = STATUS_COLOR[t.status] ?? AMBER
          return (
            <div key={t.name} style={{ padding: '12px 20px', borderBottom: i < (d?.chaebolTargets?.length ?? 5) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0' }}>{t.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: `${sc}18`, color: sc }}>{t.status.replace(/_/g, ' ')}</span>
                </div>
                <div style={{ fontSize: 11, color: '#8899aa' }}>{t.sector}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: t.potentialACV >= 1_000_000 ? GREEN : TEAL }}>£{(t.potentialACV / 1e6).toFixed(1)}M</div>
                <div style={{ fontSize: 9, color: '#4a5568' }}>potential ACV</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Compliance */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(d?.compliance ?? []).map((c: any) => (
          <div key={c.name} style={{ background: '#1a2235', border: `1px solid ${GREEN}18`, borderRadius: 10, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircle2 size={14} color={GREEN} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: GREEN, minWidth: 72 }}>{c.name}</span>
            <span style={{ fontSize: 11, color: '#8899aa' }}>{c.full}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
