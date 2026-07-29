import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, XCircle } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Gen5FiftyPercentPage() {
  const qc = useQueryClient()
  const histQ = useQuery({ queryKey: ['gen5-routing-history'], queryFn: () => api.get('/admin/kangqore-immp/gen5/routing/history').then(r => r.data), staleTime: 5_000 })
  const evalQ = useQuery({ queryKey: ['gen5-eval-results'], queryFn: () => api.get('/admin/kangqore-immp/gen5/eval/results').then(r => r.data), staleTime: 10_000 })
  const costQ = useQuery({ queryKey: ['gen5-cost-intelligence'], queryFn: () => api.get('/admin/kangqore-immp/gen5/cost-intelligence').then(r => r.data), staleTime: 15_000 })

  const promoteMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen5/routing/promote', { targetPct: 50 }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen5-routing-history'] }),
  })

  const latest     = histQ.data?.latest
  const latestEval = evalQ.data?.results?.[0]
  const costD      = costQ.data
  const currentPct = latest?.gen5Pct ?? 0
  const parity     = latestEval?.gen5Accuracy ?? 0
  const savings    = costD?.savingsVsClaude ?? 0
  const g1 = parity >= 90
  const g2 = savings >= 40
  const gatePass = g1 && g2 && currentPct >= 50

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S215 · 50% Routing Milestone</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen5 = Gen4 — Equal Share of KIMMP Traffic</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Parity gate ≥ 90% · cost savings ≥ 40% vs Claude · Gen5 and Gen4 each handle half the platform</p>
      </div>

      {/* Split visualisation */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Traffic Distribution at 50% Milestone</div>
        <div style={{ display: 'flex', height: 48, borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ flex: 50, background: AMBER, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#0d1824' }}>Gen5 50%</div>
          <div style={{ flex: 30, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#0d1824' }}>Gen4 30%</div>
          <div style={{ flex: 20, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#0d1824' }}>Claude 20%</div>
        </div>
        <div style={{ fontSize: 10, color: '#8899aa' }}>Gen4 drops from 70% → 30%. Gen5 takes the majority. Claude remains at 20% fallback.</div>
      </div>

      {/* Gate criteria */}
      <div style={{ background: gatePass ? 'rgba(16,185,129,0.06)' : '#1a2235', border: `1px solid ${gatePass ? 'rgba(16,185,129,0.3)' : '#263250'}`, borderRadius: 12, padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: gatePass ? GREEN : '#ccdde0', marginBottom: 14 }}>Gate S215 — {gatePass ? 'PASSED ✓' : 'Criteria'}</div>
        {[
          { label: 'Gen5 parity ≥ 90% vs Claude on 1K-decision eval', passed: g1, value: `${parity}%` },
          { label: 'Cost savings ≥ 40% vs all-Claude baseline', passed: g2, value: `${savings}%` },
          { label: 'Gen5 routing at 50%', passed: currentPct >= 50, value: `${currentPct}%` },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '8px 12px', background: '#0f1828', borderRadius: 7 }}>
            {c.passed ? <CheckCircle2 size={16} color={GREEN} /> : <XCircle size={16} color={AMBER} />}
            <div style={{ flex: 1, fontSize: 12, color: '#b0c0d0' }}>{c.label}</div>
            <span style={{ fontSize: 12, fontWeight: 800, color: c.passed ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{c.value}</span>
          </div>
        ))}
      </div>

      {/* Promote button */}
      {currentPct < 50 && (
        <button onClick={() => promoteMut.mutate()} disabled={promoteMut.isPending}
          style={{ background: AMBER, border: 'none', color: '#0d1824', padding: '12px 28px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 800, opacity: promoteMut.isPending ? 0.7 : 1, width: '100%' }}>
          {promoteMut.isPending ? 'Promoting Gen5 to 50%…' : '⚡ Promote Gen5 to 50% Routing'}
        </button>
      )}
      {currentPct >= 50 && (
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 9, padding: '14px 20px', textAlign: 'center', fontSize: 13, fontWeight: 800, color: GREEN }}>
          ✓ Gen5 at {currentPct}% — 50% milestone reached
        </div>
      )}
    </div>
  )
}
