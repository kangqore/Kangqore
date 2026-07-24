import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Sliders, Zap, AlertTriangle } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const PURPLE = '#a78bfa', GREEN = '#10b981', AMBER = '#f59e0b', RED = '#ef4444'

export function Gen4RouterPage() {
  const qc = useQueryClient()
  const [livePercent, setLivePercent] = useState<number>(10)
  const cfgQ = useQuery({ queryKey: ['gen4-router'], queryFn: () => api.get('/admin/kangqore-immp/gen4/router/config').then(r => r.data), staleTime: 20_000 })
  const patchM = useMutation({
    mutationFn: (data: any) => api.patch('/admin/kangqore-immp/gen4/router/config', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen4-router'] }),
  })
  const circuitM = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen4/router/circuit-check').then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen4-router'] }),
  })
  const goLiveM = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen4/router/go-live', { livePercent }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen4-router'] }),
  })
  const cfg = cfgQ.data

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">
      <div style={{ padding: '22px 26px', borderRadius: 16, background: cfg?.circuitOpen ? 'rgba(239,68,68,0.06)' : 'rgba(167,139,250,0.06)', border: `1px solid ${cfg?.circuitOpen ? 'rgba(239,68,68,0.2)' : 'rgba(167,139,250,0.2)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sliders style={{ width: 28, height: 28, color: PURPLE }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>S163–S165 — Gen4 A/B Router</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>Shadow mode → live traffic routing · circuit breaker · configurable % of KIMMP requests</div>
        </div>
        {cfg && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: cfg.circuitOpen ? RED : GREEN, fontVariantNumeric: 'tabular-nums' }}>{cfg.livePercent}%</div>
            <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>Live Routing</div>
          </div>
        )}
      </div>

      {cfg && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {[
            { label: 'Live %',          value: `${cfg.livePercent}%`,       color: PURPLE },
            { label: 'Mode',            value: cfg.shadowMode ? 'Shadow' : 'Live', color: cfg.shadowMode ? AMBER : GREEN },
            { label: 'Circuit',         value: cfg.circuitOpen ? 'OPEN' : 'Closed', color: cfg.circuitOpen ? RED : GREEN },
            { label: 'Fallback Count',  value: cfg.fallbackCount,            color: AMBER },
          ].map(m => (
            <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T1, marginBottom: 14 }}>Configure Routing</div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: T2, display: 'block', marginBottom: 6 }}>Live % (0 = shadow only)</label>
            <input type="number" min={0} max={100} value={livePercent} onChange={e => setLivePercent(+e.target.value)} style={{ padding: '8px 12px', borderRadius: 7, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BDR}`, color: T1, fontSize: 12, width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => patchM.mutate({ shadowMode: true })} disabled={patchM.isPending} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', color: AMBER, border: '1px solid rgba(245,158,11,0.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              Enable Shadow Mode
            </button>
            <button onClick={() => patchM.mutate({ shadowMode: false, livePercent })} disabled={patchM.isPending} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', color: GREEN, border: '1px solid rgba(16,185,129,0.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              Go Live at {livePercent}%
            </button>
          </div>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T1, marginBottom: 14 }}>S165 — Go Live</div>
          <div style={{ fontSize: 12, color: T2, marginBottom: 12 }}>Send {livePercent}% of production KIMMP requests to Gen4. Simulates 500 real traffic requests.</div>
          <button onClick={() => goLiveM.mutate()} disabled={goLiveM.isPending} style={{ width: '100%', padding: '10px', borderRadius: 10, background: PURPLE, color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Zap style={{ width: 14, height: 14 }} />
            {goLiveM.isPending ? 'Routing…' : `Go Live — ${livePercent}% Gen4`}
          </button>
        </div>
      </div>

      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <AlertTriangle style={{ width: 16, height: 16, color: cfg?.circuitOpen ? RED : AMBER }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: T1 }}>S164 — Circuit Breaker</span>
          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: cfg?.circuitOpen ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: cfg?.circuitOpen ? RED : AMBER, border: `1px solid ${cfg?.circuitOpen ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
            {cfg?.circuitOpen ? 'CIRCUIT OPEN' : 'Healthy'}
          </span>
        </div>
        <div style={{ fontSize: 12, color: T2, marginBottom: 14 }}>
          Auto-fallback to Claude when Gen4 confidence &lt; {cfg?.confidenceThreshold ?? 0.7}. Circuit opens after {cfg?.failThreshold ?? 3} consecutive fails. Consecutive fails: <strong style={{ color: T1 }}>{cfg?.consecutiveFails ?? 0}</strong>
        </div>
        <button onClick={() => circuitM.mutate()} disabled={circuitM.isPending} style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', color: RED, border: '1px solid rgba(239,68,68,0.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
          {circuitM.isPending ? 'Simulating…' : 'Simulate Circuit Check'}
        </button>
      </div>
    </div>
  )
}
