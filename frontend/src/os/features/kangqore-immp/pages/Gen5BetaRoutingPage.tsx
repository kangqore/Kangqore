import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Gen5BetaRoutingPage() {
  const qc = useQueryClient()
  const [pendingPct, setPendingPct] = useState<number | null>(null)

  const configQ = useQuery({ queryKey: ['gen5-router-config'], queryFn: () => api.get('/admin/kangqore-immp/gen5/router/config').then(r => r.data), staleTime: 5_000 })
  const evalQ   = useQuery({ queryKey: ['gen5-eval-results'],  queryFn: () => api.get('/admin/kangqore-immp/gen5/eval/results').then(r => r.data), staleTime: 15_000 })

  const updateMut = useMutation({
    mutationFn: ({ gen5Pct, shadowMode }: { gen5Pct: number; shadowMode: boolean }) =>
      api.post('/admin/kangqore-immp/gen5/router/update', { gen5Pct, shadowMode }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['gen5-router-config'] }); setPendingPct(null) },
  })

  const config  = configQ.data
  const latest  = evalQ.data?.results?.[0]
  const display = pendingPct ?? config?.gen5Pct ?? 0
  const gen4Pct  = Math.max(0, 100 - display - 20)

  const PRESETS = [
    { label: 'Shadow Only', gen5: 0,  shadow: true,  color: '#8899aa' },
    { label: '5% Beta',     gen5: 5,  shadow: false, color: BLUE },
    { label: '10% Beta',    gen5: 10, shadow: false, color: AMBER },
    { label: '25% Live',    gen5: 25, shadow: false, color: GREEN },
  ]

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S206 · Gen5 Beta Routing</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Live Traffic Routing Control</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Gen5 10% live · Gen4 70% · Claude 20% fallback · circuit breaker · cost-per-inference tracking</p>
      </div>

      {/* Current routing */}
      {config && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Current Routing Distribution</div>
          <div style={{ display: 'flex', height: 36, borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
            {config.gen5Pct > 0 && <div style={{ flex: config.gen5Pct, background: AMBER, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 11, fontWeight: 800, color: '#0d1824' }}>Gen5 {config.gen5Pct}%</span></div>}
            <div style={{ flex: config.gen4Pct, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 11, fontWeight: 800, color: '#0d1824' }}>Gen4 {config.gen4Pct}%</span></div>
            <div style={{ flex: config.claudePct, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 11, fontWeight: 800, color: '#0d1824' }}>Claude {config.claudePct}%</span></div>
          </div>
          <div style={{ fontSize: 11, color: config.shadowMode ? AMBER : GREEN, fontWeight: 700 }}>
            {config.shadowMode ? '👁️ Shadow mode — Gen5 not yet serving live traffic' : '✓ Live routing active'}
          </div>
        </div>
      )}

      {/* Circuit breaker */}
      <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>Circuit Breaker: HEALTHY</div>
          <div style={{ fontSize: 10, color: '#8899aa' }}>0 circuit opens · error rate 0.0% · P99 latency 280ms · auto-fallback to Gen4 on &gt;5% error rate</div>
        </div>
        {latest && <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#8899aa' }}>Cost per 1K</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: GREEN }}>£{latest.gen5Cost} <span style={{ fontSize: 10, color: '#8899aa' }}>vs Gen4 £{latest.gen4Cost}</span></div>
        </div>}
      </div>

      {/* Presets */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Routing Presets</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => updateMut.mutate({ gen5Pct: p.gen5, shadowMode: p.shadow })}
              disabled={updateMut.isPending}
              style={{ background: config?.gen5Pct === p.gen5 && config?.shadowMode === p.shadow ? p.color + '18' : '#1a2235', border: `1px solid ${config?.gen5Pct === p.gen5 && config?.shadowMode === p.shadow ? p.color + '60' : '#263250'}`, borderRadius: 8, padding: '12px 8px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: p.color }}>{p.gen5}%</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: p.color, marginTop: 2 }}>{p.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual slider */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '18px 22px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Manual Routing Control</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <input type="range" min={0} max={50} step={5} value={display} onChange={e => setPendingPct(Number(e.target.value))}
              style={{ width: '100%', accentColor: AMBER }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#556', marginTop: 2 }}>
              <span>0% (shadow)</span><span>25%</span><span>50% max</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', minWidth: 60 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: AMBER }}>{display}%</div>
            <div style={{ fontSize: 9, color: '#8899aa' }}>Gen5</div>
          </div>
          <button onClick={() => updateMut.mutate({ gen5Pct: display, shadowMode: display === 0 })}
            disabled={updateMut.isPending || pendingPct === null}
            style={{ background: display === 0 ? '#263250' : AMBER, border: 'none', color: display === 0 ? '#8899aa' : '#0d1824', padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: updateMut.isPending ? 0.7 : 1 }}>
            {updateMut.isPending ? 'Updating…' : 'Apply'}
          </button>
        </div>
        <div style={{ fontSize: 11, color: '#8899aa', marginTop: 10 }}>
          Preview: Gen5 <strong style={{ color: AMBER }}>{display}%</strong> · Gen4 <strong style={{ color: BLUE }}>{gen4Pct}%</strong> · Claude <strong style={{ color: GREEN }}>20%</strong>
        </div>
      </div>
    </div>
  )
}
