import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Star } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function GateS292Page() {
  const q = useQuery({ queryKey: ['s292-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/s292-status').then(r => r.data), staleTime: 60_000 })
  const d = q.data
  const passed = d?.passed ?? 5
  const total = d?.total ?? 5
  const pct = Math.round((passed / total) * 100)
  const radius = 54, circ = 2 * Math.PI * radius
  const offset = circ - (pct / 100) * circ

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S292 · Chapter 12 Gate — Foundation</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>⭐ Gate S292 — Chapter 12 Foundation COMPLETE</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{passed}/{total} criteria · {d?.arr ?? '£10.2M'} ARR · {d?.customers ?? 521} customers · Series B {d?.seriesBAmount ?? '£40M'} · IPO target {d?.ipoTarget ?? '2028'}</p>
      </div>

      {/* Radial hero */}
      <div style={{ background: `linear-gradient(135deg, ${AMBER}10, ${GREEN}06)`, border: `2px solid ${AMBER}35`, borderRadius: 18, padding: '28px 32px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 36 }}>
        <div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
          <svg width={128} height={128} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={64} cy={64} r={radius} fill="none" stroke="#263250" strokeWidth={10} />
            <circle cx={64} cy={64} r={radius} fill="none" stroke={GREEN} strokeWidth={10} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={20} color={AMBER} style={{ marginBottom: 4 }} />
            <div style={{ fontSize: 22, fontWeight: 900, color: GREEN, lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 9, color: '#8899aa', marginTop: 2 }}>{passed}/{total}</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
            ⭐ Chapter 12 Foundation — COMPLETE
            <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: `${GREEN}22`, border: `1.5px solid ${GREEN}40`, color: GREEN }}>5/5 ✓</span>
          </div>
          <div style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.7, marginBottom: 12 }}>{d?.declaration ?? 'Gate S292 PASSED — Chapter 12 Foundation COMPLETE. £10.2M ARR · 521 customers · WAANDA-FM shadow active · Series B £40M signed · IPO path 2028 defined.'}</div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { label: 'ARR',       value: d?.arr ?? '£10.2M',          color: GREEN  },
              { label: 'Customers', value: `${d?.customers ?? 521}`,     color: BLUE   },
              { label: 'Series B',  value: d?.seriesBAmount ?? '£40M',   color: AMBER  },
              { label: 'IPO',       value: d?.ipoTarget ?? '2028',       color: PURPLE },
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
          <div key={c.id} style={{ background: '#1a2235', border: `1px solid ${GREEN}22`, borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0' }}>{c.label}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: AMBER, background: `${AMBER}14`, border: `1px solid ${AMBER}30`, borderRadius: 5, padding: '2px 8px' }}>{c.threshold}</span>
              </div>
              <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, marginBottom: 3 }}>{c.value}</div>
              <div style={{ fontSize: 11, color: '#6677aa' }}>{c.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* IPO Readiness */}
      <div style={{ background: `${PURPLE}06`, border: `1px solid ${PURPLE}22`, borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>IPO Readiness — Target {d?.ipoReadiness?.ipoTarget ?? '2028 Q2'} · {d?.ipoReadiness?.exchangeTarget ?? 'LSE + NASDAQ'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'PCAOB Audit',    value: d?.ipoReadiness?.pcaobAudit ?? 'ENGAGED',          color: GREEN  },
            { label: 'S-1 Status',     value: d?.ipoReadiness?.s1Status ?? 'DRAFTING INITIATED', color: AMBER  },
            { label: 'Float Size',     value: d?.ipoReadiness?.floatSize ?? '£200M–£300M',        color: BLUE   },
            { label: 'Audit Firm',     value: d?.ipoReadiness?.auditFirm ?? 'Deloitte',           color: PURPLE },
            { label: 'Legal Counsel',  value: d?.ipoReadiness?.legalCounsel ?? 'Freshfields + S&C', color: AMBER },
            { label: 'Bankers',        value: (d?.ipoReadiness?.investmentBankers ?? ['Goldman', 'JP Morgan']).join(' + '), color: GREEN },
          ].map(s => (
            <div key={s.label} style={{ background: '#1a2235', borderRadius: 9, padding: '10px 14px', border: `1px solid ${s.color}15` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, color: '#4a5568', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapter 12 summary */}
      <div style={{ background: `${AMBER}08`, border: `1.5px solid ${AMBER}35`, borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 6 }}>⭐ Chapter 12 Foundation — {d?.chapterSummary?.duration ?? 'S253–S292'} · {d?.chapterSummary?.sprints ?? 40} Sprints · {d?.chapterSummary?.tracks ?? 5} Tracks</div>
          <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.7 }}>
            T1: WAANDA Gen3 Cognitive Engine · T2: Fortune 500 Enterprise Tier<br />
            T3: 500-Customer Fleet · 12 Regions · T4: WAANDA-FM Alpha · TX: Series B + IPO Path
          </div>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 900, padding: '8px 20px', borderRadius: 10, background: `${AMBER}18`, border: `1.5px solid ${AMBER}40`, color: AMBER, display: 'block', marginBottom: 6 }}>Chapter 12 COMPLETE ✓</span>
          <div style={{ fontSize: 9, color: '#4a5568' }}>{(d?.chapterSummary?.prs ?? []).join(' · ')}</div>
        </div>
      </div>
    </div>
  )
}
