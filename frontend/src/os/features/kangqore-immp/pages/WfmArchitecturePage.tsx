import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Cpu } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function WfmArchitecturePage() {
  const q = useQuery({ queryKey: ['wfm-architecture'], queryFn: () => api.get('/admin/kangqore-immp/platform/wfm-architecture').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S284 · Chapter 12 T4 — WAANDA-FM Alpha</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA-FM Architecture — {d?.totalParams ?? '194B'} Parameters · {d?.contextWindow ?? '256K'} Context</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.architecture ?? 'Sparse MoE Transformer + Domain Expert Heads'} · {d?.activeParams ?? '28B'} active params per forward pass</p>
      </div>

      {/* Hero model card */}
      <div style={{ background: `linear-gradient(135deg, ${PURPLE}12, ${BLUE}06)`, border: `2px solid ${PURPLE}35`, borderRadius: 18, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ width: 72, height: 72, borderRadius: 18, background: `${PURPLE}18`, border: `2px solid ${PURPLE}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Cpu size={30} color={PURPLE} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{d?.modelName ?? 'WAANDA-FM'} <span style={{ fontSize: 12, fontWeight: 600, color: '#8899aa' }}>{d?.modelFamily}</span></div>
          <div style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.6 }}>{d?.trainingObjective}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', minWidth: 140 }}>
          {[
            { label: 'Total Params',  value: d?.totalParams ?? '194B',  color: PURPLE },
            { label: 'Active/fwd',    value: d?.activeParams ?? '28B',  color: BLUE   },
            { label: 'Context',       value: d?.contextWindow ?? '256K', color: GREEN  },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {(d?.layers ?? []).map((l: any, i: number) => {
          const colors = [PURPLE, BLUE, GREEN, AMBER, PURPLE]
          const c = colors[i % colors.length]
          return (
            <div key={l.layer} style={{ background: '#1a2235', border: `1px solid ${c}20`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${c}14`, border: `1.5px solid ${c}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 900, color: c }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 3 }}>{l.layer}</div>
                <div style={{ fontSize: 11, color: '#8899aa' }}>{l.config}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: c }}>{l.params}</div>
                <div style={{ fontSize: 9, color: '#4a5568' }}>params</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Differentiators */}
      <div style={{ background: `${PURPLE}06`, border: `1px solid ${PURPLE}22`, borderRadius: 12, padding: '14px 18px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>What makes WAANDA-FM different</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(d?.differentiators ?? []).map((d: string, i: number) => (
            <div key={i} style={{ fontSize: 11, color: '#ccdde0', display: 'flex', gap: 8 }}>
              <span style={{ color: PURPLE, fontWeight: 700, flexShrink: 0 }}>→</span>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
