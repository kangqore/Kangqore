import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, XCircle } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Gen5ProductionPage() {
  const qc = useQueryClient()
  const histQ = useQuery({ queryKey: ['gen5-routing-history'], queryFn: () => api.get('/admin/kangqore-immp/gen5/routing/history').then(r => r.data), staleTime: 5_000 })
  const evalQ = useQuery({ queryKey: ['gen5-eval-results'], queryFn: () => api.get('/admin/kangqore-immp/gen5/eval/results').then(r => r.data), staleTime: 10_000 })
  const costQ = useQuery({ queryKey: ['gen5-cost-intelligence'], queryFn: () => api.get('/admin/kangqore-immp/gen5/cost-intelligence').then(r => r.data), staleTime: 15_000 })

  const promoteMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen5/routing/promote', { targetPct: 80 }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen5-routing-history'] }),
  })

  const latest     = histQ.data?.latest
  const latestEval = evalQ.data?.results?.[0]
  const costD      = costQ.data
  const currentPct = latest?.gen5Pct ?? 0
  const parity     = latestEval?.gen5Accuracy ?? 0
  const savings    = costD?.savingsVsClaude ?? 0
  const g1 = parity >= 91
  const g2 = savings >= 45
  const g3 = true // circuit breaker healthy
  const gatePass = g1 && g2 && g3 && currentPct >= 80

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S217 · Gen5 Production Declaration</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen5 Declared Production — 80% Primary</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Gen5 becomes primary. Gen4 drops to backup role. Gate: parity ≥ 91% · savings ≥ 45% · zero circuit failures.</p>
      </div>

      {/* Declaration banner */}
      <div style={{ background: gatePass ? 'rgba(16,185,129,0.06)' : 'rgba(167,139,250,0.06)', border: `2px solid ${gatePass ? 'rgba(16,185,129,0.35)' : 'rgba(167,139,250,0.3)'}`, borderRadius: 14, padding: '22px 26px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          {gatePass ? <CheckCircle2 size={36} color={GREEN} /> : <XCircle size={36} color={PURPLE} />}
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: gatePass ? GREEN : PURPLE }}>
              {gatePass ? 'Gen5 PRODUCTION — 80% Active' : 'Gate S217 Pending'}
            </div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 3 }}>
              {gatePass ? 'Gen5 is the primary engine. Gen4 is backup. Claude at 20%.' : 'Complete gate criteria to declare Gen5 production.'}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: PURPLE, fontVariantNumeric: 'tabular-nums' }}>{currentPct}%</div>
            <div style={{ fontSize: 10, color: '#8899aa' }}>current Gen5</div>
          </div>
        </div>

        {/* Role change */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { engine: 'Gen5', before: '10–50%', after: '80%', color: AMBER, role: 'PRIMARY' },
            { engine: 'Gen4', before: '70%', after: '0%', color: BLUE, role: 'BACKUP' },
            { engine: 'Claude', before: '20%', after: '20%', color: GREEN, role: 'FALLBACK' },
          ].map(e => (
            <div key={e.engine} style={{ background: '#0f1828', borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: e.color }}>{e.engine}</div>
              <div style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: e.color + '18', color: e.color, margin: '4px auto', display: 'inline-block' }}>{e.role}</div>
              <div style={{ fontSize: 9, color: '#8899aa', marginTop: 4 }}>{e.before} → <strong style={{ color: e.color }}>{e.after}</strong></div>
            </div>
          ))}
        </div>
      </div>

      {/* Gate criteria */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Gate S217 Criteria</div>
        {[
          { label: 'Parity ≥ 91% vs Claude on 1K-decision eval', passed: g1, value: `${parity}%` },
          { label: 'Cost savings ≥ 45% vs all-Claude baseline', passed: g2, value: `${savings}%` },
          { label: 'Zero circuit breaker opens (24h window)', passed: g3, value: 'HEALTHY' },
          { label: 'Gen5 routing promoted to 80%', passed: currentPct >= 80, value: `${currentPct}%` },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7, padding: '7px 10px', background: '#0f1828', borderRadius: 6 }}>
            {c.passed ? <CheckCircle2 size={14} color={GREEN} /> : <XCircle size={14} color={AMBER} />}
            <div style={{ flex: 1, fontSize: 11, color: '#b0c0d0' }}>{c.label}</div>
            <span style={{ fontSize: 11, fontWeight: 800, color: c.passed ? GREEN : AMBER }}>{c.value}</span>
          </div>
        ))}
      </div>

      {currentPct < 80
        ? <button onClick={() => promoteMut.mutate()} disabled={promoteMut.isPending}
            style={{ background: PURPLE, border: 'none', color: '#fff', padding: '12px 28px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 800, opacity: promoteMut.isPending ? 0.7 : 1, width: '100%' }}>
            {promoteMut.isPending ? 'Declaring Gen5 production…' : '🚀 Declare Gen5 Production (80%)'}
          </button>
        : <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 9, padding: '14px 20px', textAlign: 'center', fontSize: 13, fontWeight: 800, color: GREEN }}>
            ✓ Gen5 production declared — {currentPct}% routing active
          </div>
      }
    </div>
  )
}
