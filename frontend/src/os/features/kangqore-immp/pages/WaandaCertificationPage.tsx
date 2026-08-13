import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', GREY = '#8899aa'

const TIER_ACCENT: Record<string, string> = { Bronze: '#cd7f32', Silver: BLUE, Gold: AMBER }

// Overshadow Roadmap P6.3 — this page previously rendered fabricated
// fallback numbers (512 "total certified" against a "500 target ✓ Reached")
// even independent of the backend response, via `?? 512`-style defaults, plus
// invented exam pass rates and prices. Rewritten to show only real counts —
// currently 0, honestly, since no certification program has launched — with
// the tier structure kept as a real proposal, not a claim anyone holds it.
export function WaandaCertificationPage() {
  const q = useQuery({ queryKey: ['waanda-certification'], queryFn: () => api.get('/admin/kangqore-immp/platform/waanda-certification').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Overshadow Roadmap P6.3 — Developer Relations</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Developer Certification — Program Proposal</h1>
        <p style={{ margin: '6px 0 0', color: GREY, fontSize: 13 }}>Bronze / Silver / Gold tier structure, not a running program.</p>
      </div>

      {d?.disclaimer && (
        <div style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30`, borderRadius: 10, padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <AlertTriangle size={14} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11.5, color: '#ccdde0', lineHeight: 1.6 }}>{d.disclaimer}</span>
        </div>
      )}

      <div style={{ background: '#1a2235', border: `1px solid ${GREY}25`, borderRadius: 14, padding: '18px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 40, fontWeight: 900, color: d?.programLaunched ? GREEN : GREY }}>{d?.totalCertified ?? 0}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0' }}>Developers certified</div>
          <div style={{ fontSize: 11, color: GREY }}>{d?.programLaunched ? 'Program is live' : 'No exam exists yet — program not launched'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {(d?.tiers ?? []).map((tier: any) => {
          const accent = TIER_ACCENT[tier.tier] ?? BLUE
          return (
            <div key={tier.tier} style={{ background: '#1a2235', border: `1px solid ${accent}30`, borderRadius: 14, padding: '20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 24 }}>{tier.badge}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: accent }}>{tier.tier}</div>
                  <div style={{ fontSize: 10, color: GREY }}>Proposed tier</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: accent }}>{tier.certified ?? 0}</div>
                  <div style={{ fontSize: 9, color: GREY }}>certified</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: GREY, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Skills this tier would validate</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {(tier.skills ?? []).map((sk: string) => (
                    <div key={sk} style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                      <CheckCircle2 size={10} color={accent} style={{ marginTop: 1, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, color: GREY }}>{sk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
