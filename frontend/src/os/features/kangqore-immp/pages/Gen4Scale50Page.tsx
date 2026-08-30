import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Zap } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const PURPLE = '#a78bfa', GREEN = '#10b981', RED = '#ef4444', AMBER = '#f59e0b'

export function Gen4Scale50Page() {
  const qc = useQueryClient()
  const statusQ = useQuery({ queryKey: ['s171-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/s171-status').then(r => r.data), staleTime: 15_000 })
  const pushM = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen4/router/push-50').then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['s171-status'] }); qc.invalidateQueries({ queryKey: ['gen4-router'] }) },
  })

  const s = statusQ.data
  const allPass = s?.passed === s?.total && s?.total > 0

  return (
    <div style={{ maxWidth: 900 }} className="space-y-6">
      {/* Header */}
      <div style={{ padding: '22px 26px', borderRadius: 16, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap style={{ width: 26, height: 26, color: PURPLE }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>S171 — Gen4 50% Routing Milestone</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>Scale Krisnam Foundation v0.1 to handle half of all KIMMP reasoning · intermediate production gate</div>
        </div>
        {s && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: allPass ? GREEN : PURPLE, fontVariantNumeric: 'tabular-nums' }}>{s.score}%</div>
            <div style={{ fontSize: 10, color: T2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em' }}>Gate Score</div>
          </div>
        )}
      </div>

      {/* Key stats */}
      {s && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {[
            { label: 'Live %',        value: `${s.livePercent}%`,                                         color: s.livePercent >= 50 ? GREEN : PURPLE },
            { label: 'Parity Score',  value: s.parityScore ? `${(s.parityScore * 100).toFixed(1)}%` : '—', color: s.parityScore >= 0.80 ? GREEN : RED },
            { label: 'Cost Saving',   value: `${s.costSavingPct}%`,                                        color: s.costSavingPct > 0 ? GREEN : RED },
            { label: 'Fallback Rate', value: `${s.fallbackRate}%`,                                          color: s.fallbackRate < 20 ? GREEN : AMBER },
          ].map(m => (
            <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Gate criteria */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: T1, marginBottom: 14 }}>Gate S171 Criteria</div>
        <div className="space-y-3">
          {s?.criteria?.map((c: any) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: c.passed ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.04)', border: `1px solid ${c.passed ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.15)'}` }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.passed ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)', flexShrink: 0, fontSize: 12 }}>
                {c.passed ? '✓' : '○'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: c.passed ? T1 : T2 }}>{c.label}</div>
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: c.passed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', color: c.passed ? GREEN : RED, border: `1px solid ${c.passed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'}` }}>
                {c.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Push action */}
      <div style={{ background: CARD, border: `1px solid ${allPass ? 'rgba(167,139,250,0.3)' : BDR}`, borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: T1, marginBottom: 8 }}>Push to 50%</div>
        <div style={{ fontSize: 12, color: T2, marginBottom: 16 }}>Scales Gen4 to handle 50% of all production KIMMP reasoning. Simulates 2 500 requests. Requires parity ≥80%, circuit healthy, currently live at ≥10%.</div>
        {s?.livePercent >= 50
          ? <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', color: GREEN, fontSize: 13, fontWeight: 700, border: '1px solid rgba(16,185,129,0.2)' }}>✓ Gate S171 cleared — Gen4 at {s.livePercent}%</div>
          : <button onClick={() => pushM.mutate()} disabled={pushM.isPending || !allPass} style={{ padding: '11px 24px', borderRadius: 10, background: allPass ? PURPLE : 'rgba(255,255,255,0.04)', color: allPass ? '#fff' : T2, border: `1px solid ${allPass ? PURPLE : BDR}`, fontSize: 13, fontWeight: 700, cursor: allPass ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap style={{ width: 14, height: 14 }} />
              {pushM.isPending ? 'Scaling…' : 'Push Gen4 to 50%'}
            </button>
        }
        {pushM.isError && <div style={{ fontSize: 11, color: RED, marginTop: 8 }}>{(pushM.error as any)?.response?.data?.error}</div>}
        {pushM.isSuccess && <div style={{ fontSize: 11, color: GREEN, marginTop: 8 }}>{pushM.data?.message}</div>}
        {!allPass && s && <div style={{ fontSize: 11, color: AMBER, marginTop: 8 }}>{s.total - s.passed} criteria unmet — resolve before pushing.</div>}
      </div>
    </div>
  )
}
