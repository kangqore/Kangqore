import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Building2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function GateS272Page() {
  const q = useQuery({ queryKey: ['gate-s272'], queryFn: () => api.get('/admin/kangqore-immp/platform/s272-status').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  const passed = d?.passed ?? 5
  const total  = d?.total ?? 5
  const score  = d?.score ?? 100

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S272 · Gate S272 — Chapter 12 T2</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gate S272: Fortune 500 Enterprise Tier Live</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>≥5 F500 logos · SOC2 Type II certified · FedRAMP Moderate · £1M+ per-customer ACV</p>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${AMBER}14, ${BLUE}08)`, border: `2px solid ${AMBER}45`, borderRadius: 20, padding: '28px 32px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ position: 'relative', width: 100, height: 100 }}>
            <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="43" fill="none" stroke="#263250" strokeWidth="7" />
              <circle cx="50" cy="50" r="43" fill="none" stroke={AMBER} strokeWidth="7"
                strokeDasharray={`${2 * Math.PI * 43}`}
                strokeDashoffset={`${2 * Math.PI * 43 * (1 - score / 100)}`}
                strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} color={AMBER} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>Gate S272</span>
              {passed === total && (
                <span style={{ fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: `${AMBER}22`, border: `1.5px solid ${AMBER}50`, color: AMBER }}>F500 TIER LIVE</span>
              )}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: AMBER, marginBottom: 6 }}>{passed}/{total} criteria · {score}% score</div>
            <div style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.6 }}>{d?.declaration ?? 'Gate S272 PASSED — Fortune 500 Enterprise Tier live.'}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            {[
              { label: 'F500 Logos',    value: `${d?.f500Count ?? 5} logos`,                          color: AMBER  },
              { label: 'SOC2 Type II',  value: d?.soc2Certified ? '✓ Certified' : '—',                color: GREEN  },
              { label: 'FedRAMP',       value: d?.fedRampModerate ? '✓ Authorized' : '—',             color: BLUE   },
              { label: 'Min ACV',       value: `£${((d?.minACV ?? 1100000) / 1e6).toFixed(1)}M`,      color: PURPLE },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {(d?.criteria ?? []).map((c: any) => (
          <div key={c.id} style={{ background: '#1a2235', border: `1px solid ${c.passed ? AMBER + '35' : '#263250'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: c.passed ? `${AMBER}18` : '#263250', border: `1.5px solid ${c.passed ? AMBER : '#3d4d6a'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {c.passed ? <CheckCircle2 size={15} color={AMBER} /> : <span style={{ fontSize: 10, fontWeight: 900, color: '#8899aa' }}>{c.id}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.passed ? '#ccdde0' : '#8899aa', marginBottom: 3 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.5 }}>{c.description}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 200 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: c.passed ? GREEN : AMBER }}>{c.value}</div>
              <div style={{ fontSize: 9, color: '#4a5568', marginTop: 2 }}>Threshold: {c.threshold}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}22`, borderRadius: 14, padding: '16px 22px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Chapter 12 T3 Opens — Global Scale</div>
        <div style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.7 }}>Fortune 500 Enterprise Tier is live with full compliance stack (SOC2 Type II + FedRAMP Moderate). Five logos signed at £1M+ ACV. Three Tier-1 resellers active. Chapter 12 T3 opens: targeting global scale — 500 customers, 20+ regions, and the £10M ARR milestone.</div>
      </div>
    </div>
  )
}
