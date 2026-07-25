import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  PENDING:  { color: '#8899aa', bg: '#263250' },
  RUNNING:  { color: AMBER,     bg: AMBER + '18' },
  COMPLETE: { color: GREEN,     bg: GREEN + '12' },
  FAILED:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
}

const LOSS_POINTS = [0.42, 0.38, 0.31, 0.27, 0.22, 0.19, 0.17, 0.15, 0.14, 0.13]

export function Gen5PretrainingPage() {
  const qc = useQueryClient()
  const [runLabel, setRunLabel] = useState('')
  const [baseModel, setBaseModel] = useState('Mistral-22B')

  const runsQ = useQuery({ queryKey: ['gen5-training-runs'], queryFn: () => api.get('/admin/kangqore-immp/gen5/training/runs').then(r => r.data), staleTime: 8_000, refetchInterval: 5000 })
  const startMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen5/training/start', { runLabel, baseModel }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['gen5-training-runs'] }); setRunLabel('') },
  })

  const runs: any[] = runsQ.data?.runs ?? []

  const MAX_H = 60
  const maxLoss = 0.45

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S203 · Gen5 Pre-training</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Training Cycle Management</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>LoRA + QLoRA combined adapters · checkpoint management · loss tracking · cost monitoring</p>
      </div>

      {/* Loss curve reference */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Representative Loss Curve (3-epoch LoRA run)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: MAX_H + 20 }}>
          {LOSS_POINTS.map((loss, i) => {
            const h = Math.round((loss / maxLoss) * MAX_H)
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 8, color: '#8899aa' }}>{loss.toFixed(2)}</div>
                <div style={{ width: '100%', height: h, background: i === LOSS_POINTS.length - 1 ? GREEN : `hsl(${200 - i * 15},80%,60%)`, borderRadius: 3, transition: 'height .3s ease' }} />
                <div style={{ fontSize: 8, color: '#556' }}>ep{Math.floor(i / 3) + 1}</div>
              </div>
            )
          })}
        </div>
        <div style={{ fontSize: 10, color: '#8899aa', marginTop: 8 }}>Target: final loss &lt; 0.15 · LoRA rank 64 · learning rate 2e-4 · batch 32</div>
      </div>

      {/* Start run form */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Start Training Run</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px auto', gap: 10, alignItems: 'end' }}>
          <input placeholder="Run label (e.g. Gen5-v0.1-Mistral-22B)" value={runLabel} onChange={e => setRunLabel(e.target.value)}
            style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12 }} />
          <select value={baseModel} onChange={e => setBaseModel(e.target.value)}
            style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 10px', borderRadius: 7, fontSize: 12 }}>
            <option value="Mistral-22B">Mistral-22B</option>
            <option value="Qwen-32B">Qwen-32B</option>
            <option value="Mistral-7B">Mistral-7B (fast)</option>
          </select>
          <button onClick={() => startMut.mutate()} disabled={!runLabel || startMut.isPending}
            style={{ background: GREEN, border: 'none', color: '#0d1824', padding: '9px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: startMut.isPending ? 0.7 : 1, whiteSpace: 'nowrap' }}>
            {startMut.isPending ? 'Starting…' : '▶ Start Run'}
          </button>
        </div>
      </div>

      {/* Runs list */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Training Runs ({runs.length})</div>
        {runs.length === 0 ? <div style={{ padding: 24, color: '#556', fontSize: 13, textAlign: 'center' }}>No training runs yet.</div> : runs.map((r: any) => {
          const st = STATUS_STYLE[r.status] ?? STATUS_STYLE.PENDING
          return (
            <div key={r.id} style={{ padding: '14px 18px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: st.bg, color: st.color, minWidth: 60, textAlign: 'center' }}>{r.status}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0' }}>{r.runLabel}</div>
                <div style={{ fontSize: 10, color: '#8899aa', marginTop: 2 }}>{r.baseModel} · {r.adapterType} · {r.corpusSize.toLocaleString()} corpus + {r.syntheticSize.toLocaleString()} synthetic</div>
              </div>
              {r.finalLoss != null && <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: GREEN }}>loss {r.finalLoss}</div>
                <div style={{ fontSize: 10, color: '#8899aa' }}>£{r.costGbp ?? '?'} · {r.epochs} epochs</div>
              </div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
