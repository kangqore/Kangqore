import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, XCircle } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const MILESTONES = [
  { pct: 10, label: '10% Beta',        sprint: 'S206', color: '#8899aa', desc: 'Shadow → live beta. Circuit breaker extended.' },
  { pct: 25, label: '25% — Gate S213', sprint: 'S213', color: BLUE,   desc: 'Gate: parity ≥ 88%, fallback < 15%.' },
  { pct: 50, label: '50% — Gate S215', sprint: 'S215', color: AMBER,  desc: 'Gate: parity ≥ 90%, cost savings ≥ 40% vs Claude.' },
  { pct: 80, label: '80% Production',  sprint: 'S217', color: PURPLE, desc: 'Gate: parity ≥ 91%, zero circuit failures.' },
  { pct: 95, label: '95% Primary',     sprint: 'S220', color: GREEN,  desc: 'Gate: parity ≥ 92%, consecutive fails = 0.' },
]

export function Gen5RoutingPage() {
  const qc = useQueryClient()
  const histQ = useQuery({ queryKey: ['gen5-routing-history'], queryFn: () => api.get('/admin/kangqore-immp/gen5/routing/history').then(r => r.data), staleTime: 5_000 })
  const promoteMut = useMutation({
    mutationFn: (targetPct: number) => api.post('/admin/kangqore-immp/gen5/routing/promote', { targetPct }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen5-routing-history'] }),
  })

  const latest = histQ.data?.latest
  const configs: any[] = histQ.data?.configs ?? []
  const currentPct = latest?.gen5Pct ?? 0

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S213 · Chapter 11 T1</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen5 Routing — 10% → 25% → 95%</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Progressive traffic promotion · gate-checked at each milestone · fallback monitoring · cost validation</p>
      </div>

      {/* Current state hero */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Current Gen5 Routing</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: currentPct >= 95 ? GREEN : currentPct >= 50 ? AMBER : BLUE, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{currentPct}%</div>
          </div>
          {latest && (
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { label: 'Gen5', pct: latest.gen5Pct, color: AMBER },
                { label: 'Gen4', pct: latest.gen4Pct, color: BLUE },
                { label: 'Claude', pct: latest.claudePct, color: GREEN },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: m.color }}>{m.pct}%</div>
                  <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase' }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress bar over milestones */}
        <div style={{ position: 'relative', marginTop: 8 }}>
          <div style={{ height: 8, background: '#263250', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ height: '100%', width: `${currentPct}%`, background: `linear-gradient(90deg, ${BLUE}, ${GREEN})`, borderRadius: 999, transition: 'width .5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {MILESTONES.map(m => (
              <div key={m.pct} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: currentPct >= m.pct ? m.color : '#263250', border: `1.5px solid ${m.color}`, margin: '0 auto 4px' }} />
                <div style={{ fontSize: 8, fontWeight: 800, color: currentPct >= m.pct ? m.color : '#556' }}>{m.pct}%</div>
                <div style={{ fontSize: 7, color: '#556' }}>{m.sprint}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promotion buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {MILESTONES.slice(1).map(m => (
          <button key={m.pct} onClick={() => promoteMut.mutate(m.pct)} disabled={promoteMut.isPending || currentPct >= m.pct}
            style={{ background: currentPct >= m.pct ? m.color + '10' : m.color + '12', border: `1px solid ${currentPct >= m.pct ? m.color + '40' : m.color + '30'}`, borderRadius: 10, padding: '14px 10px', cursor: currentPct >= m.pct ? 'default' : 'pointer', textAlign: 'center', opacity: currentPct >= m.pct ? 0.6 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
              {currentPct >= m.pct ? <CheckCircle2 size={16} color={GREEN} /> : <XCircle size={16} color='#556' />}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: m.color }}>{m.pct}%</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#8899aa', marginTop: 2 }}>{m.label}</div>
            <div style={{ fontSize: 9, color: '#556', marginTop: 4, lineHeight: 1.4 }}>{m.desc}</div>
          </button>
        ))}
      </div>
      {promoteMut.isSuccess && <div style={{ fontSize: 11, color: GREEN, marginBottom: 16, textAlign: 'center' }}>✓ {(promoteMut.data as any)?.data?.message}</div>}

      {/* Routing history */}
      {configs.length > 0 && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Routing Change History</div>
          {configs.slice().reverse().slice(0, 8).map((c: any) => (
            <div key={c.id} style={{ padding: '9px 18px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 11, color: '#556', minWidth: 90 }}>{new Date(c.createdAt).toLocaleDateString()}</div>
              <div style={{ flex: 1, display: 'flex', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: AMBER }}>Gen5 {c.gen5Pct}%</span>
                <span style={{ fontSize: 11, color: '#556' }}>·</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: BLUE }}>Gen4 {c.gen4Pct}%</span>
                <span style={{ fontSize: 11, color: '#556' }}>·</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: GREEN }}>Claude {c.claudePct}%</span>
              </div>
              {!c.shadowMode && <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', color: GREEN }}>LIVE</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
