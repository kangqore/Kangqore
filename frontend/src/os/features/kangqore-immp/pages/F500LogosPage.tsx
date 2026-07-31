import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Clock } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function F500LogosPage() {
  const q = useQuery({ queryKey: ['f500-logos'], queryFn: () => api.get('/admin/kangqore-immp/platform/f500-logos').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S271 · Fortune 500 Logos</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Fortune 500 — 5 Logos Secured</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.pressReleasesIssued ?? 3} press releases issued · {d?.caseStudiesLive ?? 3} case studies live · gate target: ≥{d?.gateTarget ?? 5} logos</p>
      </div>

      {/* Gate status hero */}
      <div style={{ background: `linear-gradient(135deg, ${AMBER}10, ${GREEN}06)`, border: `2px solid ${d?.targetMet ? AMBER : '#263250'}35`, borderRadius: 18, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: AMBER, lineHeight: 1 }}>{d?.totalF500Logos ?? 5}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#ccdde0', marginBottom: 4 }}>Fortune 500 Logos Signed</div>
          <div style={{ fontSize: 12, color: '#8899aa' }}>Gate target: ≥{d?.gateTarget ?? 5} · {d?.targetMet ? '✓ Target met' : 'In progress'}</div>
        </div>
        {d?.targetMet && (
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 800, padding: '6px 16px', borderRadius: 9, background: `${AMBER}22`, border: `1.5px solid ${AMBER}45`, color: AMBER }}>GATE MET ✓</span>
        )}
      </div>

      {/* Logo cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(d?.logos ?? []).map((logo: any) => (
          <div key={logo.name} style={{ background: '#1a2235', border: `1px solid ${AMBER}18`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${AMBER}14`, border: `1.5px solid ${AMBER}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: AMBER, flexShrink: 0 }}>F500</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0' }}>{logo.name}</div>
                <div style={{ fontSize: 10, color: '#8899aa' }}>{logo.rank} · {logo.sector} · {logo.employees.toLocaleString()} employees · {logo.revenue}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>{logo.acv > 0 ? `£${(logo.acv / 1e6).toFixed(1)}M ACV` : '—'}</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <CheckCircle2 size={12} color={GREEN} />
                <span style={{ fontSize: 10, color: '#8899aa' }}>Logo approved</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {logo.pressRelease ? <CheckCircle2 size={12} color={GREEN} /> : <Clock size={12} color="#4a5568" />}
                <span style={{ fontSize: 10, color: logo.pressRelease ? '#8899aa' : '#4a5568' }}>Press release</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {logo.caseStudy ? <CheckCircle2 size={12} color={GREEN} /> : <Clock size={12} color="#4a5568" />}
                <span style={{ fontSize: 10, color: logo.caseStudy ? '#8899aa' : '#4a5568' }}>Case study</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
