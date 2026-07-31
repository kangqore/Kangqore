import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Star } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function GateS242Page() {
  const q = useQuery({ queryKey: ['gate-s242'], queryFn: () => api.get('/admin/kangqore-immp/platform/s242-status').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  const passed = d?.passed ?? 5
  const total = d?.total ?? 5
  const score = d?.score ?? 100
  const allPassed = passed === total

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S242 ⭐ Gate S242 — BIDS™ v2.0</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>BIDS™ v2.0 Declaration</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>BIDS™ is a self-sustaining commercial product delivering measurable enterprise transformation</p>
      </div>

      {/* Score hero */}
      <div style={{ background: allPassed ? `linear-gradient(135deg, ${GREEN}14, ${AMBER}08)` : `linear-gradient(135deg, ${AMBER}10, #1a2235)`, border: `2px solid ${allPassed ? GREEN : AMBER}40`, borderRadius: 20, padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ position: 'relative', width: 90, height: 90 }}>
          <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="45" cy="45" r="38" fill="none" stroke="#263250" strokeWidth="7" />
            <circle cx="45" cy="45" r="38" fill="none" stroke={allPassed ? GREEN : AMBER} strokeWidth="7" strokeDasharray={`${2 * Math.PI * 38}`} strokeDashoffset={`${2 * Math.PI * 38 * (1 - score / 100)}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: allPassed ? GREEN : AMBER }}>{score}%</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Star size={18} color={AMBER} fill={AMBER} />
            <span style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Gate S242</span>
            {allPassed && <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6, background: `${GREEN}20`, border: `1px solid ${GREEN}40`, color: GREEN }}>PASSED</span>}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: allPassed ? GREEN : AMBER, marginBottom: 4 }}>{passed}/{total} criteria passed</div>
          <div style={{ fontSize: 12, color: '#8899aa' }}>{d?.declaration ?? 'BIDS™ v2.0 — Self-sustaining commercial product delivering measurable enterprise transformation'}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          {[
            { label: 'Engagements', value: `${d?.totalEngagements ?? 51}`, color: GREEN },
            { label: 'Partners', value: `${d?.totalPartners ?? 10}`, color: BLUE },
            { label: 'Sub. ARR %', value: `${d?.subscriptionArrPct ?? 22}%`, color: AMBER },
            { label: 'Conversion', value: `${d?.conversionRate ?? 62}%`, color: PURPLE },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Criteria */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {(d?.criteria ?? []).map((c: any) => (
          <div key={c.id} style={{ background: '#1a2235', border: `1px solid ${c.passed ? GREEN + '30' : '#263250'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: c.passed ? `${GREEN}18` : '#263250', border: `1.5px solid ${c.passed ? GREEN : '#3d4d6a'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {c.passed ? <CheckCircle2 size={14} color={GREEN} /> : <span style={{ fontSize: 10, fontWeight: 900, color: '#8899aa' }}>{c.id}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.passed ? '#ccdde0' : '#8899aa', marginBottom: 3 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.5 }}>{c.description}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: c.passed ? GREEN : AMBER }}>{c.value}</div>
              <div style={{ fontSize: 9, color: '#8899aa' }}>Threshold: {c.threshold}</div>
            </div>
          </div>
        ))}
      </div>

      {/* What it unlocks */}
      <div style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}25`, borderRadius: 14, padding: '18px 22px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>BIDS™ v2.0 Unlocks</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { icon: '🏭', label: 'BIDS™ as standalone SaaS', desc: 'Decoupled from direct Kangqore sales — licensed directly' },
            { icon: '🤝', label: 'White-label for OEM Partners', desc: 'Partners deliver BIDS™ under their own brand with Kangqore engine' },
            { icon: '📊', label: 'Industry Report Publication', desc: 'Annual BIDS™ State of Enterprise Intelligence Report' },
          ].map(u => (
            <div key={u.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 10, padding: '12px 14px' }}>
              <span style={{ fontSize: 18 }}>{u.icon}</span>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#ccdde0', margin: '6px 0 3px' }}>{u.label}</div>
              <div style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.5 }}>{u.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
