import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Zap } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function WfmPretrainingPhase1Page() {
  const q = useQuery({ queryKey: ['wfm-pretraining-phase1'], queryFn: () => api.get('/admin/kangqore-immp/platform/wfm-pretraining-phase1').then(r => r.data), staleTime: 60_000 })
  const d = q.data
  const pct = d?.progressPct ?? 84

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S285 · Chapter 12 T4 — WAANDA-FM Alpha</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA-FM Pre-training Phase 1 — {d?.tokensConsumed ?? '16.8T'} of {d?.targetTokens ?? '20T'} Tokens</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Loss {d?.currentLoss ?? 2.164} → target {d?.targetLoss ?? 2.0} · batch {d?.batchSize?.toLocaleString() ?? '4,096'} · seq {d?.seqLen?.toLocaleString() ?? '8,192'} · {(d?.gpuHoursUsed ?? 142_000).toLocaleString()} GPU-hours</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Progress',      value: `${pct}%`,               color: PURPLE },
          { label: 'Current Loss',  value: d?.currentLoss ?? 2.164, color: BLUE   },
          { label: 'GPU-hours',     value: `${((d?.gpuHoursUsed ?? 142_000) / 1000).toFixed(0)}K`, color: AMBER },
          { label: 'Est. Cost',     value: d?.estimatedCost ?? '$2.8M', color: GREEN },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ background: '#1a2235', border: `1px solid ${PURPLE}20`, borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: '#8899aa' }}>Tokens consumed</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: PURPLE }}>{d?.tokensConsumed ?? '16.8T'} / {d?.targetTokens ?? '20T'}</span>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: '#263250', overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${PURPLE}, ${BLUE})` }} />
        </div>
      </div>

      {/* Checkpoints */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '80px 80px 80px 100px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Step</span><span>Tokens</span><span>Loss</span><span>Status</span>
        </div>
        {(d?.checkpoints ?? []).map((c: any, i: number) => (
          <div key={c.step} style={{ padding: '11px 20px', borderBottom: i < (d?.checkpoints?.length ?? 6) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '80px 80px 80px 100px', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: PURPLE, fontWeight: 800 }}>{c.step}</span>
            <span style={{ color: '#8899aa' }}>{c.tokens}</span>
            <span style={{ color: c.status === 'CURRENT' ? AMBER : GREEN, fontVariantNumeric: 'tabular-nums' }}>{c.loss}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {c.status === 'CURRENT' ? <Zap size={12} color={AMBER} /> : <CheckCircle2 size={12} color={GREEN} />}
              <span style={{ fontSize: 9, color: c.status === 'CURRENT' ? AMBER : GREEN }}>{c.status}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Observations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {(d?.observations ?? []).map((obs: string, i: number) => (
          <div key={i} style={{ background: `${GREEN}06`, border: `1px solid ${GREEN}18`, borderRadius: 8, padding: '10px 14px', fontSize: 11, color: '#ccdde0', display: 'flex', gap: 8 }}>
            <span style={{ color: GREEN, fontWeight: 700, flexShrink: 0 }}>✓</span>
            <span>{obs}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
