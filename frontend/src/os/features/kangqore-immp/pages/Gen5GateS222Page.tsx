import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, XCircle } from 'lucide-react'

const GREEN = '#10b981', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Gen5GateS222Page() {
  const q = useQuery({ queryKey: ['gen5-gate-s222'], queryFn: () => api.get('/admin/kangqore-immp/platform/s222-status').then(r => r.data), staleTime: 5_000, refetchInterval: 8000 })
  const d = q.data
  const criteria: any[] = d?.criteria ?? []
  const passed = d?.passed ?? 0
  const total  = d?.total ?? 5
  const allPass = passed === total

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 860 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S222 · Chapter 11 Track 1 Gate</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gate S222 — Gen5 Primary Engine</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>5-criteria architectural gate · Chapter 11 T1 completion · Gen5 autonomous operation confirmed</p>
      </div>

      {/* Score hero */}
      <div style={{ background: allPass ? 'rgba(16,185,129,0.07)' : 'rgba(167,139,250,0.07)', border: `2px solid ${allPass ? 'rgba(16,185,129,0.4)' : 'rgba(167,139,250,0.35)'}`, borderRadius: 16, padding: '28px 32px', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: allPass ? GREEN : PURPLE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          {allPass ? '✓ GATE S222 PASSED' : 'Gate S222 — In Progress'}
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: allPass ? GREEN : PURPLE, lineHeight: 1, marginBottom: 8 }}>
          {passed}/{total}
        </div>
        <div style={{ fontSize: 13, color: '#8899aa' }}>criteria passed</div>
        <div style={{ marginTop: 12, height: 8, background: '#263250', borderRadius: 999, overflow: 'hidden', maxWidth: 300, margin: '12px auto 0' }}>
          <div style={{ height: '100%', width: `${(passed / total) * 100}%`, background: allPass ? GREEN : PURPLE, borderRadius: 999, transition: 'width 0.5s ease' }} />
        </div>
        {allPass && (
          <div style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: '#ccdde0' }}>
            Chapter 11 Track 1 Complete · Gen5 is Kangqore's primary intelligence engine
          </div>
        )}
      </div>

      {/* Criteria checklist */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Gate Criteria</div>
        {criteria.map((c: any, i: number) => (
          <div key={i} style={{ padding: '14px 20px', borderBottom: i < criteria.length - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            {c.passed
              ? <CheckCircle2 size={20} color={GREEN} />
              : <XCircle size={20} color={AMBER} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0', marginBottom: 3 }}>{c.label}</div>
              <div style={{ fontSize: 10, color: '#8899aa' }}>{c.description}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: c.passed ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{c.value}</div>
              <div style={{ fontSize: 9, color: '#8899aa' }}>{c.threshold}</div>
            </div>
          </div>
        ))}
      </div>

      {/* What this gate unlocks */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Gate S222 Unlocks</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { title: 'Chapter 11 T2', desc: 'Gen3 Pre-training Corpus Assembly — 500B token pipeline', color: PURPLE },
            { title: 'RLKF Pipeline', desc: 'Reinforcement Learning from Kangqore Feedback infra begins', color: AMBER },
            { title: 'Gen5 Retirement Plan', desc: '24-month Gen5 lifecycle defined, Gen3 transition roadmap locked', color: GREEN },
            { title: 'Customer AI SLAs', desc: 'First-party AI commitments: uptime, accuracy, cost guarantees', color: '#4fc3f7' },
          ].map(u => (
            <div key={u.title} style={{ background: '#0f1828', borderRadius: 8, padding: '10px 14px', borderLeft: `3px solid ${u.color}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: u.color, marginBottom: 3 }}>{u.title}</div>
              <div style={{ fontSize: 10, color: '#8899aa' }}>{u.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
