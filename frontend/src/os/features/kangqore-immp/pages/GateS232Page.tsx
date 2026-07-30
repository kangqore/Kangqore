import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, XCircle } from 'lucide-react'

const GREEN = '#10b981', AMBER = '#f59e0b', PURPLE = '#a78bfa', BLUE = '#4fc3f7'

export function GateS232Page() {
  const q = useQuery({ queryKey: ['fleet-gate-s232'], queryFn: () => api.get('/admin/kangqore-immp/platform/s232-status').then(r => r.data), staleTime: 5_000, refetchInterval: 8000 })
  const d = q.data
  const criteria: any[] = d?.criteria ?? []
  const passed = d?.passed ?? 0
  const total  = d?.total ?? 5
  const allPass = passed === total

  const REGIONS = ['🇬🇧 UK', '🇪🇺 EU', '🇮🇳 India', '🇺🇸 US', '🇯🇵 Japan', '🇦🇺 ANZ', '🌎 LatAm', '🇦🇪 MENA']

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 860 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S232 · Chapter 11 Track 2 Gate</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gate S232 — 200-Customer Fleet · 8 Regions</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>5-criteria gate · global commercial presence established · COIG at scale · Chapter 11 T2 complete</p>
      </div>

      {/* Score hero */}
      <div style={{ background: allPass ? 'rgba(16,185,129,0.07)' : 'rgba(245,158,11,0.06)', border: `2px solid ${allPass ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.3)'}`, borderRadius: 16, padding: '28px 32px', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: allPass ? GREEN : AMBER, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          {allPass ? '✓ GATE S232 PASSED — 200-FLEET · 8 REGIONS' : 'Gate S232 — Global Fleet Criteria'}
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, color: allPass ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginBottom: 8 }}>
          {passed}/{total}
        </div>
        <div style={{ fontSize: 13, color: '#8899aa', marginBottom: 12 }}>criteria passed</div>
        <div style={{ height: 8, background: '#263250', borderRadius: 999, overflow: 'hidden', maxWidth: 320, margin: '0 auto 16px' }}>
          <div style={{ height: '100%', width: `${(passed / total) * 100}%`, background: allPass ? GREEN : AMBER, borderRadius: 999, transition: 'width 0.5s ease' }} />
        </div>

        {/* Region badges */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {REGIONS.map(r => (
            <span key={r} style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 4, background: 'rgba(16,185,129,0.10)', color: GREEN, border: '1px solid rgba(16,185,129,0.25)' }}>{r}</span>
          ))}
        </div>
      </div>

      {/* Criteria */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Gate Criteria</div>
        {criteria.map((c: any, i: number) => (
          <div key={i} style={{ padding: '14px 20px', borderBottom: i < criteria.length - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            {c.passed ? <CheckCircle2 size={20} color={GREEN} /> : <XCircle size={20} color={AMBER} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0', marginBottom: 3 }}>{c.label}</div>
              <div style={{ fontSize: 10, color: '#8899aa' }}>{c.description}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: c.passed ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{c.value}</div>
              <div style={{ fontSize: 9, color: '#8899aa' }}>{c.threshold}</div>
            </div>
          </div>
        ))}
      </div>

      {/* What unlocks */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Gate S232 Unlocks</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { title: 'Chapter 11 T3', desc: 'BIDS™ at Scale — 50 commercial engagements automated delivery', color: PURPLE },
            { title: 'Series A Prep', desc: '200-customer fleet + £2M ARR trajectory = Series A data room ready', color: AMBER },
            { title: 'Platform Ecosystem T4', desc: 'Developer API marketplace, partner SDK ecosystem, 2K dev signups', color: BLUE },
            { title: 'Enterprise v2.0', desc: 'Fortune 500 tier · multi-subsidiary Blueprint · white-glove SLA', color: GREEN },
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
