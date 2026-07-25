import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const SOURCE_TYPES = [
  { key: 'reasoning_trace', label: 'Reasoning Trace', icon: '🧠', desc: 'Sub-goal decomposition traces from live KIMMP executions', color: BLUE },
  { key: 'debate',          label: 'Debate Phase',    icon: '⚔️',  desc: 'Competing hypothesis debates from WAANDA multi-agent sessions', color: AMBER },
  { key: 'decision',        label: 'Decision Record', icon: '📋', desc: 'Structured decision records from KimmpStrategicDecision', color: PURPLE },
]

export function SyntheticDataPipelinePage() {
  const qc = useQueryClient()
  const [count, setCount] = useState(200)
  const [sourceType, setSourceType] = useState('reasoning_trace')

  const statsQ = useQuery({ queryKey: ['gen5-synthetic-stats'], queryFn: () => api.get('/admin/kangqore-immp/gen5/synthetic/stats').then(r => r.data), staleTime: 10_000 })
  const genMut  = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen5/synthetic/generate', { count, sourceType }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen5-synthetic-stats'] }),
  })

  const stats  = statsQ.data ?? {}
  const total  = stats.total ?? 0
  const target = stats.target ?? 100000
  const pct    = Math.min(100, Math.round((total / target) * 100))
  const byType: any[] = stats.byType ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S201 · Synthetic Data Pipeline</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen5 Synthetic Training Pairs</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>WAANDA generates training data from live reasoning traces · debate transcripts · 100K+ examples target</p>
      </div>

      {/* Progress */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
          {[
            { label: 'Total Pairs', value: total.toLocaleString(), color: PURPLE },
            { label: 'Approved',    value: (stats.approved ?? 0).toLocaleString(), color: GREEN },
            { label: 'Pending Review', value: (stats.pending ?? 0).toLocaleString(), color: AMBER },
            { label: 'Target',      value: target.toLocaleString(), color: '#8899aa' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
              <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 6, background: '#263250', borderRadius: 999, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${PURPLE}, ${BLUE})`, borderRadius: 999 }} />
        </div>
        <div style={{ fontSize: 10, color: '#8899aa', textAlign: 'right' }}>{pct}% of {target.toLocaleString()} target</div>
      </div>

      {/* Source type cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {SOURCE_TYPES.map(s => (
          <div key={s.key} onClick={() => setSourceType(s.key)}
            style={{ background: sourceType === s.key ? s.color + '10' : '#1a2235', border: `1px solid ${sourceType === s.key ? s.color + '50' : '#263250'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.4, marginBottom: 8 }}>{s.desc}</div>
            {byType.find((b: any) => b.sourceType === s.key) && (
              <div style={{ fontSize: 11, fontWeight: 800, color: s.color }}>{byType.find((b: any) => b.sourceType === s.key)?._count.toLocaleString()} pairs</div>
            )}
          </div>
        ))}
      </div>

      {/* Generate */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '18px 22px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Generate Synthetic Pairs</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: '#8899aa', marginBottom: 4 }}>Count (max 500)</div>
            <input type="number" min={10} max={500} value={count} onChange={e => setCount(Number(e.target.value))}
              style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 12px', borderRadius: 7, fontSize: 12, width: 100 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: '#8899aa', marginBottom: 4 }}>Source: <strong style={{ color: SOURCE_TYPES.find(s => s.key === sourceType)?.color }}>{SOURCE_TYPES.find(s => s.key === sourceType)?.label}</strong></div>
            <button onClick={() => genMut.mutate()} disabled={genMut.isPending}
              style={{ background: PURPLE, border: 'none', color: '#fff', padding: '9px 22px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: genMut.isPending ? 0.7 : 1 }}>
              {genMut.isPending ? 'WAANDA generating…' : `⚡ Generate ${count} Pairs`}
            </button>
          </div>
          {genMut.isSuccess && <div style={{ fontSize: 11, color: GREEN }}>✓ {(genMut.data as any)?.data?.generated} pairs generated · total: {(genMut.data as any)?.data?.total?.toLocaleString()}</div>}
        </div>
      </div>
    </div>
  )
}
