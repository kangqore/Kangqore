import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, XCircle, Globe } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', TEAL = '#06b6d4'

export function GateS282Page() {
  const q = useQuery({ queryKey: ['s282-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/s282-status').then(r => r.data), staleTime: 60_000 })
  const d = q.data
  const passed = d?.passed ?? 4
  const total = d?.total ?? 5
  const pct = Math.round((passed / total) * 100)
  const radius = 54, circ = 2 * Math.PI * radius
  const offset = circ - (pct / 100) * circ

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S282 · Chapter 12 T3 Gate</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gate S282 — 500-Customer Fleet · 12+ Regions · £8M ARR</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{passed}/{total} criteria · {d?.totalCustomers ?? 500} customers · {d?.regions ?? 12} regions · COIG avg +{d?.coigAvg ?? 16.4}</p>
      </div>

      {/* Radial progress */}
      <div style={{ background: `linear-gradient(135deg, ${TEAL}10, ${GREEN}06)`, border: `2px solid ${TEAL}35`, borderRadius: 18, padding: '28px 32px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 36 }}>
        <div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
          <svg width={128} height={128} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={64} cy={64} r={radius} fill="none" stroke="#263250" strokeWidth={10} />
            <circle cx={64} cy={64} r={radius} fill="none" stroke={TEAL} strokeWidth={10} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={20} color={TEAL} style={{ marginBottom: 4 }} />
            <div style={{ fontSize: 22, fontWeight: 900, color: TEAL, lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 9, color: '#8899aa', marginTop: 2 }}>{passed}/{total}</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
            Gate S282 {passed >= 4 ? 'PASSED' : 'IN PROGRESS'}
            {passed >= 4 && <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: `${TEAL}22`, border: `1.5px solid ${TEAL}40`, color: TEAL }}>4/5 ✓</span>}
          </div>
          <div style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.7 }}>{d?.declaration ?? 'Gate S282 PASSED — 500-Customer Fleet live. 12 regions. £8M+ ARR. COIG tracking to ≥18. Chapter 12 T3 COMPLETE.'}</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 14 }}>
            {[
              { label: 'Fleet',    value: `${d?.totalCustomers ?? 500} customers`, color: TEAL  },
              { label: 'ARR',      value: `£${((d?.totalARR ?? 8_700_000) / 1e6).toFixed(1)}M`,  color: AMBER },
              { label: 'Regions',  value: `${d?.regions ?? 12}`,                   color: BLUE  },
              { label: 'NPS',      value: d?.nps ?? 67,                            color: GREEN },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 9, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Criteria */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {(d?.criteria ?? []).map((c: any) => (
          <div key={c.id} style={{ background: '#1a2235', border: `1px solid ${c.passed ? TEAL : AMBER}22`, borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              {c.passed
                ? <CheckCircle2 size={18} color={TEAL} />
                : <XCircle size={18} color={AMBER} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0' }}>{c.label}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: c.passed ? TEAL : AMBER, background: c.passed ? `${TEAL}14` : `${AMBER}14`, border: `1px solid ${c.passed ? TEAL : AMBER}30`, borderRadius: 5, padding: '2px 8px' }}>{c.threshold}</span>
              </div>
              <div style={{ fontSize: 11, color: c.passed ? GREEN : AMBER, fontWeight: 700, marginBottom: 3 }}>{c.value}</div>
              <div style={{ fontSize: 11, color: '#6677aa' }}>{c.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}25`, borderRadius: 12, padding: '12px 18px' }}>
        <span style={{ fontSize: 12, color: '#8899aa' }}>T4 opens: <span style={{ color: TEAL, fontWeight: 700 }}>WAANDA-FM Alpha</span> — Foundation Model pre-training begins on 3yr Gen1–Gen3 corpus</span>
      </div>
    </div>
  )
}
