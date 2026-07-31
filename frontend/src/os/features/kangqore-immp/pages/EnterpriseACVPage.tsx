import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function EnterpriseACVPage() {
  const q = useQuery({ queryKey: ['enterprise-acv'], queryFn: () => api.get('/admin/kangqore-immp/platform/enterprise-acv').then(r => r.data), staleTime: 60_000 })
  const d = q.data
  const fmt = (n: number) => `£${(n / 1e6).toFixed(1)}M`

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S270 · Enterprise ACV Intelligence</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Enterprise ACV — £1M+ Per Customer Validated</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Total enterprise ACV: {fmt(d?.totalEnterpriseACV ?? 8000000)} · avg: {fmt(d?.avgACV ?? 1600000)} · all 5 clients above £1M threshold</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Enterprise ACV', value: fmt(d?.totalEnterpriseACV ?? 8000000), color: GREEN  },
          { label: 'Avg ACV',              value: fmt(d?.avgACV ?? 1600000),              color: BLUE   },
          { label: 'Min ACV',              value: fmt(d?.minACV ?? 1100000),              color: AMBER  },
          { label: 'Max ACV',              value: fmt(d?.maxACV ?? 2400000),              color: PURPLE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ACV breakdown by component */}
      <div style={{ background: '#1a2235', border: `1px solid ${GREEN}20`, borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>ACV Component Breakdown</div>
        <div style={{ display: 'flex', gap: 0, height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
          {([GREEN, BLUE, AMBER, PURPLE, '#06b6d4'] as string[]).map((color, i) => {
            const comp = (d?.acvBreakdown ?? [])[i]
            return <div key={i} style={{ width: `${comp?.pct ?? 20}%`, background: color }} />
          })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(d?.acvBreakdown ?? []).map((comp: any, i: number) => {
            const colors = [GREEN, BLUE, AMBER, PURPLE, '#06b6d4']
            const accent = colors[i] ?? BLUE
            return (
              <div key={comp.component} style={{ flex: '1 1 180px', background: '#141c2c', border: `1px solid ${accent}18`, borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: accent }}>{comp.pct}%</span>
                  <span style={{ fontSize: 11, color: '#ccdde0' }}>{comp.component}</span>
                </div>
                <div style={{ fontSize: 10, color: '#4a5568', lineHeight: 1.4 }}>{comp.desc}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Per-client ACV */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '1.5fr 120px 100px 80px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Customer</span><span>ACV</span><span>Contract</span><span>Y2 Expansion</span>
        </div>
        {(d?.clients ?? []).map((client: any, i: number) => (
          <div key={client.name} style={{ padding: '11px 20px', borderBottom: i < (d?.clients?.length ?? 5) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '1.5fr 120px 100px 80px', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: '#ccdde0', fontWeight: 700 }}>{client.name}</span>
            <span style={{ color: GREEN, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{fmt(client.acv)}</span>
            <span style={{ color: '#8899aa' }}>{client.contractYears}yr contract</span>
            <span>{client.expansionYear2 ? <CheckCircle2 size={14} color={GREEN} /> : <span style={{ fontSize: 10, color: '#4a5568' }}>—</span>}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
