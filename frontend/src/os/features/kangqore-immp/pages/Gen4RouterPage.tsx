import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Sliders, Zap, AlertTriangle, TrendingUp } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const PURPLE = '#a78bfa', GREEN = '#10b981', AMBER = '#f59e0b', RED = '#ef4444', TEAL = '#06b6d4'

const MILESTONES = [
  { pct: 10,  label: '10% · Beta',        color: TEAL,   sprint: 'S165' },
  { pct: 50,  label: '50% · Milestone',   color: PURPLE, sprint: 'S171' },
  { pct: 80,  label: '80% · Production',  color: GREEN,  sprint: 'S172' },
  { pct: 100, label: '100% · Gen5 ready', color: AMBER,  sprint: 'S180+' },
]

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
  const push50M = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen4/router/push-50').then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen4-router'] }),
  })
  const push80M = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen4/router/push-80').then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen4-router'] }),
  })
  const cfg = cfgQ.data
  const currentPct = cfg?.livePercent ?? 0

  const activeMilestone = MILESTONES.slice().reverse().find(m => currentPct >= m.pct)
  const accentColor = cfg?.circuitOpen ? RED : (activeMilestone?.color ?? PURPLE)

  return (
    <div style={{ maxWidth: 960 }} className="space-y-6">
      {/* Header */}
      <div style={{ padding: '22px 26px', borderRadius: 16, background: `rgba(${cfg?.circuitOpen ? '239,68,68' : '167,139,250'},0.06)`, border: `1px solid ${cfg?.circuitOpen ? 'rgba(239,68,68,0.2)' : 'rgba(167,139,250,0.2)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sliders style={{ width: 28, height: 28, color: PURPLE }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>Gen4 A/B Router + Scale</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>Shadow → 10% → 50% → 80% production · WAANDAx Foundation v0.1 routing path</div>
        </div>
        {cfg && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 34, fontWeight: 900, color: accentColor, fontVariantNumeric: 'tabular-nums' }}>{cfg.livePercent}%</div>
            <div style={{ fontSize: 10, color: T2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em' }}>Live Routing</div>
          </div>
        )}
      </div>

      {/* Routing scale progress */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <TrendingUp style={{ width: 15, height: 15, color: PURPLE }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: T1, textTransform: 'uppercase', letterSpacing: '.07em' }}>Routing Scale Path</span>
        </div>
        {/* Progress bar */}
        <div style={{ position: 'relative', height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: '0 0 0 0', width: `${Math.min(currentPct, 100)}%`, background: `linear-gradient(90deg, ${TEAL}, ${PURPLE}, ${GREEN})`, borderRadius: 4, transition: 'width 0.6s ease' }} />
        </div>
        {/* Milestone nodes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {MILESTONES.map(m => {
            const done = currentPct >= m.pct
            const isCurrent = activeMilestone?.pct === m.pct
            return (
              <div key={m.pct} style={{ borderRadius: 10, padding: '12px 14px', border: `1px solid ${done ? m.color + '44' : BDR}`, background: done ? `rgba(${m.color === GREEN ? '16,185,129' : m.color === PURPLE ? '167,139,250' : m.color === TEAL ? '6,182,212' : '245,158,11'},0.06)` : 'transparent' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: done ? m.color : T2, fontVariantNumeric: 'tabular-nums' }}>{m.pct}%</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: done ? m.color : T2, marginTop: 2 }}>{m.label}</div>
                <div style={{ fontSize: 9, color: T2, marginTop: 4 }}>{m.sprint} {isCurrent && currentPct > 0 ? '← current' : done ? '✓' : ''}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats row */}
      {cfg && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {[
            { label: 'Live %',         value: `${cfg.livePercent}%`,                 color: accentColor },
            { label: 'Mode',           value: cfg.shadowMode ? 'Shadow' : 'Live',    color: cfg.shadowMode ? AMBER : GREEN },
            { label: 'Circuit',        value: cfg.circuitOpen ? 'OPEN' : 'Closed',   color: cfg.circuitOpen ? RED : GREEN },
            { label: 'Fallback Count', value: cfg.fallbackCount,                      color: AMBER },
          ].map(m => (
            <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Scale actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {/* Go Live (custom %) */}
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 10 }}>Custom % Go-Live</div>
          <input type="number" min={0} max={100} value={livePercent} onChange={e => setLivePercent(+e.target.value)} style={{ padding: '8px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BDR}`, color: T1, fontSize: 12, width: '100%', marginBottom: 10 }} />
          <button onClick={() => goLiveM.mutate()} disabled={goLiveM.isPending} style={{ width: '100%', padding: '9px', borderRadius: 9, background: 'rgba(167,139,250,0.1)', color: PURPLE, border: '1px solid rgba(167,139,250,0.25)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            <Zap style={{ width: 12, height: 12, display: 'inline', marginRight: 6 }} />
            {goLiveM.isPending ? 'Setting…' : `Go Live at ${livePercent}%`}
          </button>
          {goLiveM.isSuccess && <div style={{ fontSize: 10, color: GREEN, marginTop: 6 }}>Done — 500 requests simulated.</div>}
        </div>

        {/* Push to 50% */}
        <div style={{ background: CARD, border: `1px solid ${currentPct >= 50 ? PURPLE + '44' : BDR}`, borderRadius: 14, padding: '20px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 4 }}>S171 — Push to 50%</div>
          <div style={{ fontSize: 11, color: T2, marginBottom: 12 }}>Requires: ≥10% live · parity ≥80% · circuit healthy</div>
          {currentPct >= 50
            ? <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(167,139,250,0.08)', color: PURPLE, fontSize: 11, fontWeight: 700 }}>✓ Already at {currentPct}%</div>
            : <button onClick={() => push50M.mutate()} disabled={push50M.isPending} style={{ width: '100%', padding: '9px', borderRadius: 9, background: 'rgba(167,139,250,0.12)', color: PURPLE, border: '1px solid rgba(167,139,250,0.3)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                {push50M.isPending ? 'Pushing…' : 'Push to 50%'}
              </button>
          }
          {push50M.isError && <div style={{ fontSize: 10, color: RED, marginTop: 6 }}>{(push50M.error as any)?.response?.data?.error}</div>}
          {push50M.isSuccess && <div style={{ fontSize: 10, color: GREEN, marginTop: 6 }}>50% live — 2 500 requests simulated.</div>}
        </div>

        {/* Push to 80% */}
        <div style={{ background: CARD, border: `1px solid ${currentPct >= 80 ? GREEN + '44' : BDR}`, borderRadius: 14, padding: '20px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 4 }}>S172 — Push to 80% ⭐</div>
          <div style={{ fontSize: 11, color: T2, marginBottom: 12 }}>Requires: ≥50% · parity ≥85% · zero fails · cost savings ≥30%</div>
          {currentPct >= 80
            ? <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', color: GREEN, fontSize: 11, fontWeight: 700 }}>✓ Gen4 Production Declared</div>
            : <button onClick={() => push80M.mutate()} disabled={push80M.isPending} style={{ width: '100%', padding: '9px', borderRadius: 9, background: 'rgba(16,185,129,0.12)', color: GREEN, border: '1px solid rgba(16,185,129,0.3)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                {push80M.isPending ? 'Pushing…' : 'Push to 80% — Declare Production'}
              </button>
          }
          {push80M.isError && <div style={{ fontSize: 10, color: RED, marginTop: 6 }}>{(push80M.error as any)?.response?.data?.error}</div>}
          {push80M.isSuccess && <div style={{ fontSize: 10, color: GREEN, marginTop: 6 }}>Gen4 declared production AI. 5 000 requests simulated.</div>}
        </div>
      </div>

      {/* Configure + Circuit */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T1, marginBottom: 14 }}>Shadow Mode Toggle</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => patchM.mutate({ shadowMode: true })} disabled={patchM.isPending} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', color: AMBER, border: '1px solid rgba(245,158,11,0.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              Enable Shadow Mode
            </button>
            <button onClick={() => patchM.mutate({ shadowMode: false })} disabled={patchM.isPending} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', color: GREEN, border: '1px solid rgba(16,185,129,0.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              Exit Shadow Mode
            </button>
          </div>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <AlertTriangle style={{ width: 16, height: 16, color: cfg?.circuitOpen ? RED : AMBER }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Circuit Breaker</span>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: cfg?.circuitOpen ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: cfg?.circuitOpen ? RED : AMBER, border: `1px solid ${cfg?.circuitOpen ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
              {cfg?.circuitOpen ? 'OPEN' : 'Healthy'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: T2, marginBottom: 12 }}>
            Opens after {cfg?.failThreshold ?? 3} consecutive low-confidence responses. Consecutive fails: <strong style={{ color: T1 }}>{cfg?.consecutiveFails ?? 0}</strong>
          </div>
          <button onClick={() => circuitM.mutate()} disabled={circuitM.isPending} style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', color: RED, border: '1px solid rgba(239,68,68,0.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            {circuitM.isPending ? 'Simulating…' : 'Simulate Circuit Check'}
          </button>
        </div>
      </div>
    </div>
  )
}
