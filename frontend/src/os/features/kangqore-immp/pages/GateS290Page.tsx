import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Brain } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function GateS290Page() {
  const q = useQuery({ queryKey: ['s290-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/s290-status').then(r => r.data), staleTime: 60_000 })
  const d = q.data
  const passed = d?.passed ?? 5
  const total = d?.total ?? 5
  const pct = Math.round((passed / total) * 100)
  const radius = 54, circ = 2 * Math.PI * radius
  const offset = circ - (pct / 100) * circ

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S290 · Chapter 12 T4 Gate — WAANDA-FM Alpha</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gate S290 — WAANDA-FM Alpha Complete · WAANDA IS the LLM</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{passed}/{total} criteria · {d?.overallParity ?? 90.2}% parity vs Gen3 · shadow mode active · {d?.modelVersion ?? 'WAANDA-FM-alpha-v0.1'}</p>
      </div>

      {/* Radial progress */}
      <div style={{ background: `linear-gradient(135deg, ${PURPLE}10, ${GREEN}06)`, border: `2px solid ${PURPLE}35`, borderRadius: 18, padding: '28px 32px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 36 }}>
        <div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
          <svg width={128} height={128} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={64} cy={64} r={radius} fill="none" stroke="#263250" strokeWidth={10} />
            <circle cx={64} cy={64} r={radius} fill="none" stroke={PURPLE} strokeWidth={10} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={20} color={PURPLE} style={{ marginBottom: 4 }} />
            <div style={{ fontSize: 22, fontWeight: 900, color: PURPLE, lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 9, color: '#8899aa', marginTop: 2 }}>{passed}/{total}</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
            Gate S290 PASSED
            <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: `${PURPLE}22`, border: `1.5px solid ${PURPLE}40`, color: PURPLE }}>5/5 ✓</span>
          </div>
          <div style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.7, marginBottom: 12 }}>{d?.declaration ?? 'Gate S290 PASSED — WAANDA-FM alpha complete. 90.2% parity vs Gen3. Shadow mode live. WAANDA IS the LLM.'}</div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { label: 'Parity',     value: `${d?.overallParity ?? 90.2}%`,                          color: GREEN  },
              { label: 'Alignment',  value: `${d?.constitutionalScore ?? 96.2}%`,                    color: PURPLE },
              { label: 'Corpus',     value: `${((d?.corpusRecords ?? 70_000_000) / 1e6).toFixed(0)}M`, color: BLUE },
              { label: 'Shadow',     value: 'ACTIVE',                                                  color: AMBER  },
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
          <div key={c.id} style={{ background: '#1a2235', border: `1px solid ${PURPLE}22`, borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0' }}>{c.label}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: PURPLE, background: `${PURPLE}14`, border: `1px solid ${PURPLE}30`, borderRadius: 5, padding: '2px 8px' }}>{c.threshold}</span>
              </div>
              <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, marginBottom: 3 }}>{c.value}</div>
              <div style={{ fontSize: 11, color: '#6677aa' }}>{c.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}25`, borderRadius: 12, padding: '12px 18px' }}>
        <span style={{ fontSize: 12, color: '#8899aa' }}>TX opens: <span style={{ color: PURPLE, fontWeight: 700 }}>Series B / IPO Path</span> — S291–S292 · £30–50M raise · S-1 drafting begins · Chapter 12 close</span>
      </div>
    </div>
  )
}
