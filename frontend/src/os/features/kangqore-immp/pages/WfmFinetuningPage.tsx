import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function WfmFinetuningPage() {
  const q = useQuery({ queryKey: ['wfm-finetuning'], queryFn: () => api.get('/admin/kangqore-immp/platform/wfm-finetuning').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S287 · Chapter 12 T4 — WAANDA-FM Alpha</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA-FM Fine-tuning & Alignment — SFT → RM → PPO → DPO → Constitutional</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Model: {d?.modelVersion ?? 'WAANDA-FM-alpha-v0.1'} · alignment {d?.alignmentScore ?? 96.2}% · violation rate {((d?.constitutionalViolationRate ?? 0.0008) * 100).toFixed(2)}%</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Alignment Score',     value: `${d?.alignmentScore ?? 96.2}%`,                                            color: GREEN  },
          { label: 'Total SFT Examples',  value: `${((d?.totalExamples ?? 5_440_000) / 1e6).toFixed(1)}M`,                  color: BLUE   },
          { label: 'Harm Rate',           value: `${((d?.safetyEval?.harmRate ?? 0.0003) * 100).toFixed(3)}%`,               color: AMBER  },
          { label: 'Refusal Accuracy',    value: `${((d?.safetyEval?.refusalAccuracy ?? 0.994) * 100).toFixed(1)}%`,         color: PURPLE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(d?.phases ?? []).map((p: any, i: number) => {
          const colors = [BLUE, GREEN, PURPLE, AMBER, GREEN]
          const c = colors[i % colors.length]
          return (
            <div key={p.phase} style={{ background: '#1a2235', border: `1px solid ${c}20`, borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: `${c}14`, border: `1.5px solid ${c}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <CheckCircle2 size={14} color={c} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0' }}>{p.phase}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: `${GREEN}18`, color: GREEN }}>{p.status}</span>
                </div>
                <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 6 }}>{p.desc}</div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ fontSize: 10, color: '#4a5568' }}>{(p.examples / 1000).toFixed(0)}K examples</span>
                  <span style={{ fontSize: 10, color: '#4a5568' }}>{p.epochs} epochs</span>
                  <span style={{ fontSize: 10, color: c, fontWeight: 700 }}>loss {p.loss}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
