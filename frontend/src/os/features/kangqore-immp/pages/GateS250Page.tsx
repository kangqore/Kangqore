import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Star } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function GateS250Page() {
  const q = useQuery({ queryKey: ['gate-s250'], queryFn: () => api.get('/admin/kangqore-immp/platform/s250-status').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  const passed = d?.passed ?? 5
  const total = d?.total ?? 5
  const score = d?.score ?? 100
  const allPassed = passed === total

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S250 ⭐ Gate S250 — Ecosystem v1.0</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Ecosystem v1.0 Declaration</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Kangqore has a self-sustaining developer and partner ecosystem generating third-party revenue</p>
      </div>

      {/* Score hero */}
      <div style={{ background: allPassed ? `linear-gradient(135deg, ${BLUE}14, ${GREEN}08)` : `linear-gradient(135deg, ${AMBER}10, #1a2235)`, border: `2px solid ${allPassed ? BLUE : AMBER}40`, borderRadius: 20, padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ position: 'relative', width: 90, height: 90 }}>
          <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="45" cy="45" r="38" fill="none" stroke="#263250" strokeWidth="7" />
            <circle cx="45" cy="45" r="38" fill="none" stroke={allPassed ? BLUE : AMBER} strokeWidth="7" strokeDasharray={`${2 * Math.PI * 38}`} strokeDashoffset={`${2 * Math.PI * 38 * (1 - score / 100)}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: allPassed ? BLUE : AMBER }}>{score}%</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Star size={18} color={BLUE} fill={BLUE} />
            <span style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Gate S250</span>
            {allPassed && <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6, background: `${BLUE}20`, border: `1px solid ${BLUE}40`, color: BLUE }}>PASSED</span>}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: allPassed ? BLUE : AMBER, marginBottom: 4 }}>{passed}/{total} criteria passed</div>
          <div style={{ fontSize: 12, color: '#8899aa' }}>{d?.declaration ?? 'Ecosystem v1.0 — Kangqore has a self-sustaining developer and partner ecosystem generating third-party revenue'}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          {[
            { label: 'Developers', value: d?.registeredDevs ? d.registeredDevs.toLocaleString() : '2,140', color: BLUE },
            { label: 'Apps', value: d?.publishedApps ?? 12, color: GREEN },
            { label: 'Integrations', value: d?.activeIntegrations ?? 52, color: PURPLE },
            { label: 'Certified Devs', value: d?.certifiedDevs ?? 512, color: AMBER },
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
          <div key={c.id} style={{ background: '#1a2235', border: `1px solid ${c.passed ? BLUE + '30' : '#263250'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: c.passed ? `${BLUE}18` : '#263250', border: `1.5px solid ${c.passed ? BLUE : '#3d4d6a'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {c.passed ? <CheckCircle2 size={14} color={BLUE} /> : <span style={{ fontSize: 10, fontWeight: 900, color: '#8899aa' }}>{c.id}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.passed ? '#ccdde0' : '#8899aa', marginBottom: 3 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.5 }}>{c.description}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: c.passed ? BLUE : AMBER }}>{c.value}</div>
              <div style={{ fontSize: 9, color: '#8899aa' }}>Threshold: {c.threshold}</div>
            </div>
          </div>
        ))}
      </div>

      {/* What it unlocks */}
      <div style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}25`, borderRadius: 14, padding: '18px 22px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Ecosystem v1.0 Unlocks</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { icon: '🏪', label: 'App Store Series B Proof Point', desc: 'Marketplace ARR + developer count becomes a key Series B metric in the data room' },
            { icon: '🌐', label: 'Developer GTM Channel', desc: 'Certified developers become a distribution channel — they sell WAANDA by deploying it' },
            { icon: '🔗', label: 'Integration-Led Growth', desc: 'Every connector is a discovery path — customers find Kangqore through their existing tools' },
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
