import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Gen5AgenticReasoningPage() {
  const [goal, setGoal] = useState('')
  const statusQ = useQuery({ queryKey: ['gen5-agentic-status'], queryFn: () => api.get('/admin/kangqore-immp/gen5/agentic-reasoning/status').then(r => r.data), staleTime: 15_000 })
  const runMut  = useMutation({ mutationFn: () => api.post('/admin/kangqore-immp/gen5/agentic-reasoning/run', { goal }) })

  const d = statusQ.data
  const chains: any[] = d?.chains ?? []

  const STATUS_COLOR: Record<string, string> = { COMPLETE: GREEN, RUNNING: AMBER, PENDING: '#8899aa' }

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S218 · Agentic Reasoning</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen5 Autonomous Multi-step Reasoning</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>WAANDA-native sub-agent orchestration · up to 10-step planning chains · goal decomposition · self-supervised execution</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Status', value: d?.status ?? 'LIVE', color: GREEN },
          { label: 'Max Chain Steps', value: d?.maxSteps ?? 10, color: PURPLE },
          { label: 'Avg Steps', value: d?.avgSteps ?? 8.4, color: BLUE },
          { label: 'Avg Duration', value: d?.avgDuration ? `${d.avgDuration}s` : '3.65s', color: AMBER },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Active chains */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '13px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          Active Reasoning Chains
        </div>
        {chains.map((c: any) => (
          <div key={c.id} style={{ padding: '14px 18px', borderBottom: '1px solid #1e2a40' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 800, fontFamily: 'monospace', color: '#8899aa' }}>{c.id}</span>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: '#ccdde0' }}>{c.goal}</div>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 9px', borderRadius: 4, background: (STATUS_COLOR[c.status] ?? GREEN) + '18', color: STATUS_COLOR[c.status] ?? GREEN }}>{c.status}</span>
              {c.duration && <span style={{ fontSize: 11, color: '#8899aa' }}>{c.duration}s</span>}
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {c.subGoals.map((sg: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: i < (c.status === 'RUNNING' ? c.steps - 1 : c.steps) ? PURPLE + '18' : '#263250', color: i < (c.status === 'RUNNING' ? c.steps - 1 : c.steps) ? PURPLE : '#556' }}>{i + 1}. {sg}</span>
                  {i < c.subGoals.length - 1 && <span style={{ fontSize: 9, color: '#3a4a60' }}>→</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Run new chain */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '18px 22px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Run Agentic Reasoning Chain</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g. Should we expand into Japan in Q1 2027?"
            style={{ flex: 1, background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12 }} />
          <button onClick={() => runMut.mutate()} disabled={!goal || runMut.isPending}
            style={{ background: PURPLE, border: 'none', color: '#fff', padding: '9px 20px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: runMut.isPending ? 0.7 : 1, whiteSpace: 'nowrap' }}>
            {runMut.isPending ? 'Reasoning…' : '⚡ Run Chain'}
          </button>
        </div>
        {runMut.isSuccess && (() => {
          const r = (runMut.data as any)?.data
          return (
            <div style={{ marginTop: 14, background: '#0f1828', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: GREEN }}>✓ {r.steps}-step chain complete · {r.duration}s · {r.confidence}% confidence</span>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {r.subGoals.map((sg: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: PURPLE + '18', color: PURPLE }}>{i + 1}. {sg}</span>
                    {i < r.subGoals.length - 1 && <span style={{ fontSize: 9, color: '#3a4a60' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
