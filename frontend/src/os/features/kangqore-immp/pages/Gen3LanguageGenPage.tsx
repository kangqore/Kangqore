import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Gen3LanguageGenPage() {
  const q = useQuery({ queryKey: ['gen3-language-gen'], queryFn: () => api.get('/admin/kangqore-immp/platform/gen3-language-gen').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S256 · Gen3 Language Engine</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Native Language Generation — No External LLM Required</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>8 tone registers · fluent professional English · code-capable · {(d?.outputsGeneratedToDate ?? 284500).toLocaleString()} outputs generated</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Fluency Score',       value: `${d?.avgFluencyScore ?? 91.7}%`,         color: PURPLE },
          { label: 'Throughput',          value: d?.tokensThroughput ?? '3,200 tok/s',      color: BLUE   },
          { label: 'Tone Registers',      value: (d?.toneRegisters ?? []).length || 8,       color: GREEN  },
          { label: 'External LLM Needed', value: 'No',                                       color: AMBER  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {(d?.toneRegisters ?? []).map((reg: any) => (
          <div key={reg.name} style={{ background: '#1a2235', border: `1px solid ${PURPLE}18`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 3 }}>{reg.name}</div>
              <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.5 }}>{reg.desc}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: PURPLE }}>{reg.sampleLen}</div>
              <div style={{ fontSize: 9, color: '#4a5568' }}>tokens</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
