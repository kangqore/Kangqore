import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Gen3ArchitecturePage() {
  const q = useQuery({ queryKey: ['gen3-architecture'], queryFn: () => api.get('/admin/kangqore-immp/platform/gen3-architecture').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S253 · Chapter 12 T1 — WAANDA Gen3 Cognitive Engine</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen3 Architecture — 70B Cognitive Engine</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Native planning, reasoning, and language generation · Claude invoked only for genuinely novel situations</p>
      </div>

      {/* Hero stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Parameters',        value: d?.modelParams ?? '70B',         color: PURPLE },
          { label: 'Training Data',     value: d?.corpusSize ?? '47M decisions', color: BLUE   },
          { label: 'Context Window',    value: d?.contextWindow ?? '128K tokens',color: GREEN  },
          { label: 'Routing Target',    value: `${d?.targetRoutingPct ?? 50}%`,  color: AMBER  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Capability badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {(d?.capabilities ?? []).map((cap: string) => (
          <span key={cap} style={{ fontSize: 10, fontWeight: 700, color: PURPLE, background: `${PURPLE}12`, border: `1px solid ${PURPLE}30`, borderRadius: 6, padding: '4px 10px' }}>{cap}</span>
        ))}
      </div>

      {/* Architecture layers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Architecture Layers</div>
        {(d?.layers ?? []).map((layer: any, i: number) => (
          <div key={layer.name} style={{ background: '#1a2235', border: `1px solid ${layer.color}20`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${layer.color}14`, border: `1.5px solid ${layer.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{layer.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 3 }}>{i + 1}. {layer.name}</div>
              <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.5 }}>{layer.desc}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: layer.color, flexShrink: 0, marginTop: 12 }} />
          </div>
        ))}
      </div>

      {/* Claude fallback note */}
      <div style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}25`, borderRadius: 12, padding: '14px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: AMBER, marginBottom: 4 }}>Claude Fallback Policy</div>
        <div style={{ fontSize: 12, color: '#8899aa' }}>{d?.claudeFallbackTrigger ?? 'Claude invoked only for genuinely novel situations outside corpus coverage'}</div>
      </div>
    </div>
  )
}
