import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function WfmPretrainingPhase2Page() {
  const q = useQuery({ queryKey: ['wfm-pretraining-phase2'], queryFn: () => api.get('/admin/kangqore-immp/platform/wfm-pretraining-phase2').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S286 · Chapter 12 T4 — WAANDA-FM Alpha</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA-FM Pre-training Phase 2 — Complete · Final Loss {d?.finalLoss ?? 1.874}</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.targetTokens ?? '25T'} tokens consumed · {(d?.gpuHoursTotal ?? 248_000).toLocaleString()} GPU-hours total · {d?.estimatedCostTotal ?? '$4.9M'} total compute cost</p>
      </div>

      {/* Completion hero */}
      <div style={{ background: `linear-gradient(135deg, ${GREEN}10, ${PURPLE}06)`, border: `2px solid ${GREEN}35`, borderRadius: 18, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'center', minWidth: 110 }}>
          <CheckCircle2 size={40} color={GREEN} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 11, color: GREEN, fontWeight: 700 }}>PRE-TRAINING<br/>COMPLETE</div>
        </div>
        <div style={{ height: 64, width: 1, background: '#263250' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, flex: 1 }}>
          {[
            { label: 'Final Loss',    value: d?.finalLoss ?? 1.874,                        color: GREEN  },
            { label: 'Phase 1 Loss',  value: d?.phaseOneLoss ?? 2.164,                     color: AMBER  },
            { label: 'Improvement',   value: `${d?.improvement ?? 13.4}%`,                 color: PURPLE },
            { label: 'Total Tokens',  value: d?.tokensConsumed ?? '25.2T',                 color: BLUE   },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#8899aa', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Annealing schedule */}
      <div style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}22`, borderRadius: 12, padding: '12px 18px', marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: '#8899aa' }}>Annealing schedule: <span style={{ color: PURPLE, fontWeight: 700 }}>{d?.annealingSchedule ?? 'Cosine decay from 3e-4 to 3e-5 over final 5T tokens'}</span></span>
      </div>

      {/* Checkpoint loss curve */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Loss Curve — Phases 1 + 2</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
          {(d?.checkpoints ?? []).map((c: any, i: number) => {
            const maxLoss = 5.0, h = Math.round(((maxLoss - c.loss) / maxLoss) * 100)
            const col = c.phase === 1 ? `${PURPLE}80` : PURPLE
            return (
              <div key={c.step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 8, color: '#8899aa' }}>{c.loss}</div>
                <div style={{ width: '100%', height: `${h}%`, background: col, borderRadius: '3px 3px 0 0', minHeight: 6 }} />
                <div style={{ fontSize: 8, color: '#4a5568' }}>{c.step}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}25`, borderRadius: 12, padding: '12px 18px' }}>
        <span style={{ fontSize: 12, color: '#8899aa' }}>Next step: <span style={{ color: GREEN, fontWeight: 700 }}>RLHF fine-tuning on Kangqore decision outcomes</span> — SFT → RM → PPO → DPO → Constitutional</span>
      </div>
    </div>
  )
}
