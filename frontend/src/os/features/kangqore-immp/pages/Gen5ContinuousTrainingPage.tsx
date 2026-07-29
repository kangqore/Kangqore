import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  PENDING:  { color: '#8899aa', bg: '#263250' },
  RUNNING:  { color: AMBER,     bg: AMBER + '18' },
  COMPLETE: { color: GREEN,     bg: 'rgba(16,185,129,0.12)' },
  FAILED:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
}

export function Gen5ContinuousTrainingPage() {
  const qc = useQueryClient()
  const statusQ = useQuery({ queryKey: ['gen5-continuous-training'], queryFn: () => api.get('/admin/kangqore-immp/gen5/continuous-training/status').then(r => r.data), staleTime: 5_000, refetchInterval: 6000 })
  const triggerMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen5/continuous-training/trigger', {}),
    onSuccess: () => setTimeout(() => qc.invalidateQueries({ queryKey: ['gen5-continuous-training'] }), 5500),
  })

  const d = statusQ.data
  const runs: any[] = d?.runs ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S216 · Continuous Training Pipeline</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Automated 30-Day Retraining Cycle</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Every 30 days: corpus expand → train → eval regression gate → promote if parity ≥ {d?.regressionGatePct ?? 88}%</p>
      </div>

      {/* Pipeline overview */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '18px 24px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Automated Pipeline Steps</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
          {[
            { label: 'New decisions', sub: 'from Gen5 production', icon: '📥' },
            { label: 'Corpus expand', sub: '+5K–15K records', icon: '📚' },
            { label: 'Quality filter', sub: '≥ 0.80 threshold', icon: '🔍' },
            { label: 'LoRA fine-tune', sub: 'Mistral-22B adapter', icon: '⚙️' },
            { label: 'Eval regression', sub: `gate ≥ ${d?.regressionGatePct ?? 88}%`, icon: '📊' },
            { label: 'Promote / hold', sub: 'auto or manual', icon: '🚀' },
          ].map((step, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', padding: '0 10px' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{step.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#ccdde0', whiteSpace: 'nowrap' }}>{step.label}</div>
                <div style={{ fontSize: 9, color: '#8899aa', whiteSpace: 'nowrap' }}>{step.sub}</div>
              </div>
              {i < arr.length - 1 && <div style={{ fontSize: 14, color: '#3a4a60', padding: '0 2px' }}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Corpus Total', value: (d?.corpusTotal ?? 0).toLocaleString(), color: BLUE },
          { label: 'Synthetic Pairs', value: (d?.syntheticTotal ?? 0).toLocaleString(), color: PURPLE },
          { label: 'Cycle Interval', value: `${d?.cycleIntervalDays ?? 30}d`, color: AMBER },
          { label: 'Next Retrain', value: d?.nextRetrainDate ? new Date(d.nextRetrainDate).toLocaleDateString() : '—', color: GREEN },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Trigger button */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => triggerMut.mutate()} disabled={triggerMut.isPending}
          style={{ background: GREEN, border: 'none', color: '#0d1824', padding: '11px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 800, opacity: triggerMut.isPending ? 0.7 : 1 }}>
          {triggerMut.isPending ? '⚙️ Retraining in progress (~5s)…' : '⚡ Trigger Retraining Now'}
        </button>
        {triggerMut.isSuccess && <span style={{ fontSize: 11, color: GREEN, marginLeft: 12 }}>✓ Run started — auto-refreshing</span>}
      </div>

      {/* Run history */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Training Run History ({runs.length})</div>
        {runs.length === 0
          ? <div style={{ padding: 24, color: '#556', fontSize: 13, textAlign: 'center' }}>No training runs yet — click Trigger above.</div>
          : runs.map((r: any) => {
              const st = STATUS_STYLE[r.status] ?? STATUS_STYLE.PENDING
              return (
                <div key={r.id} style={{ padding: '12px 18px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: st.bg, color: st.color, minWidth: 64, textAlign: 'center' }}>{r.status}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{r.runLabel}</div>
                    <div style={{ fontSize: 10, color: '#8899aa', marginTop: 2 }}>{r.baseModel} · {r.corpusSize.toLocaleString()} corpus + {r.syntheticSize.toLocaleString()} synthetic · {r.epochs} epochs</div>
                  </div>
                  {r.finalLoss != null && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: GREEN }}>loss {r.finalLoss}</div>
                      <div style={{ fontSize: 10, color: '#8899aa' }}>£{r.costGbp}</div>
                    </div>
                  )}
                </div>
              )
            })}
      </div>
    </div>
  )
}
