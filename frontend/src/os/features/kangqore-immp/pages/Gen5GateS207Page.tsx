import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, XCircle } from 'lucide-react'

const GREEN = '#10b981', AMBER = '#f59e0b', BLUE = '#4fc3f7', PURPLE = '#a78bfa'

export function Gen5GateS207Page() {
  const gateQ = useQuery({ queryKey: ['gen5-gate-s207'], queryFn: () => api.get('/admin/kangqore-immp/platform/s207-status').then(r => r.data), staleTime: 10_000 })
  const gate = gateQ.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S207 · Chapter 10 T4 Gate</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen5 Foundation Gate</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>5 criteria · live routing ≥ 10% · accuracy ≥ 88% · circuit breaker healthy · cost efficiency proven</p>
      </div>

      {/* Gate status hero */}
      {gate && (
        <div style={{ background: gate.passed ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)', border: `1px solid ${gate.passed ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: 16, padding: '24px 28px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            {gate.passed
              ? <CheckCircle2 size={40} color={GREEN} />
              : <XCircle size={40} color={AMBER} />}
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: gate.passed ? GREEN : AMBER }}>
                {gate.passed ? 'GATE S207 PASSED' : 'GATE S207 PENDING'}
              </div>
              <div style={{ fontSize: 12, color: '#8899aa', marginTop: 2 }}>
                {gate.total}/{gate.criteria?.length ?? 5} criteria met · Gen5 Foundation
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: gate.passed ? GREEN : AMBER }}>{gate.score ?? 0}%</div>
              <div style={{ fontSize: 10, color: '#8899aa' }}>Gate score</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { label: 'Gen5 Live %', value: gate.gen5Pct !== undefined ? `${gate.gen5Pct}%` : '—', color: AMBER },
              { label: 'Gen5 Accuracy', value: gate.gen5Accuracy !== undefined ? `${gate.gen5Accuracy}%` : '—', color: BLUE },
              { label: 'Corpus + Synthetic', value: gate.corpusTotal !== undefined ? gate.corpusTotal.toLocaleString() : '—', color: PURPLE },
              { label: 'Circuit Breaker', value: gate.circuitBreakerHealthy ? 'HEALTHY' : 'OPEN', color: gate.circuitBreakerHealthy ? GREEN : '#ef4444' },
            ].map(m => (
              <div key={m.label} style={{ background: '#0f1828', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Criteria list */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '13px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          Gate Criteria
        </div>
        {(gate?.criteria ?? [
          { id: 'G1', label: 'Gen5 live routing ≥ 10% (shadow mode OFF)', passed: false },
          { id: 'G2', label: 'Gen5 benchmark accuracy ≥ 88%', passed: false },
          { id: 'G3', label: 'Corpus + synthetic pairs ≥ 1,000', passed: false },
          { id: 'G4', label: 'Circuit breaker: zero opens in last 24h', passed: false },
          { id: 'G5', label: 'Gen5 cost per 1K < Gen4 cost per 1K', passed: false },
        ]).map((c: any) => (
          <div key={c.id} style={{ padding: '14px 18px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 14 }}>
            {c.passed
              ? <CheckCircle2 size={18} color={GREEN} />
              : <XCircle size={18} color={AMBER} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{c.label}</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 10px', borderRadius: 4, background: c.passed ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.10)', color: c.passed ? GREEN : AMBER }}>
              {c.passed ? 'PASS' : 'PENDING'}
            </span>
          </div>
        ))}
      </div>

      {!gate && <div style={{ padding: 24, color: '#556', fontSize: 13, textAlign: 'center' }}>Loading gate status…</div>}
    </div>
  )
}
