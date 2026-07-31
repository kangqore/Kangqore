import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const TIER_ACCENT: Record<string, string> = { Bronze: '#cd7f32', Silver: BLUE, Gold: AMBER }

export function WaandaCertificationPage() {
  const q = useQuery({ queryKey: ['waanda-certification'], queryFn: () => api.get('/admin/kangqore-immp/platform/waanda-certification').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S247 · WAANDA Certification Programme</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA Developer Certification</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Bronze / Silver / Gold developer tiers · certified WAANDA architect badge · proctored exam · 500-dev target</p>
      </div>

      {/* Hero stats */}
      <div style={{ background: `linear-gradient(135deg, ${AMBER}10, ${BLUE}08)`, border: `1px solid ${AMBER}28`, borderRadius: 14, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: AMBER }}>{d?.totalCertified ?? 512}</div>
          <div style={{ fontSize: 11, color: '#8899aa' }}>Total Certified</div>
        </div>
        <div style={{ height: 56, width: 1, background: '#263250' }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 8 }}>
            {[
              { label: 'Target', value: d?.targetTotal ?? 500, color: '#8899aa' },
              { label: 'Proctored', value: d?.proctored ? 'Yes' : 'No', color: GREEN },
              { label: 'Architect Badge', value: d?.architectBadge ? 'Live' : '—', color: PURPLE },
              { label: '500 Target', value: d?.target500 ? '✓ Reached' : 'In progress', color: AMBER },
            ].map(st => (
              <div key={st.label}>
                <div style={{ fontSize: 14, fontWeight: 900, color: st.color }}>{st.value}</div>
                <div style={{ fontSize: 9, color: '#8899aa' }}>{st.label}</div>
              </div>
            ))}
          </div>
          <div style={{ width: '100%', height: 6, background: '#263250', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, Math.round(((d?.totalCertified ?? 512) / (d?.targetTotal ?? 500)) * 100))}%`, height: '100%', background: AMBER, borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 9, color: '#8899aa', marginTop: 4 }}>{d?.totalCertified ?? 512} / {d?.targetTotal ?? 500} certified ({Math.round(((d?.totalCertified ?? 512) / (d?.targetTotal ?? 500)) * 100)}%)</div>
        </div>
      </div>

      {/* Tier cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {(d?.tiers ?? []).map((tier: any) => {
          const accent = TIER_ACCENT[tier.tier] ?? BLUE
          return (
            <div key={tier.tier} style={{ background: '#1a2235', border: `1px solid ${accent}30`, borderRadius: 14, padding: '20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 24 }}>{tier.badge}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: accent }}>{tier.tier}</div>
                  <div style={{ fontSize: 10, color: '#8899aa' }}>{tier.price} · valid {tier.validity}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: accent }}>{tier.certified}</div>
                  <div style={{ fontSize: 9, color: '#8899aa' }}>certified</div>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Exams</div>
                {(tier.exams ?? []).map((exam: string) => (
                  <div key={exam} style={{ fontSize: 10, color: '#ccdde0', marginBottom: 4, paddingLeft: 8, borderLeft: `2px solid ${accent}30` }}>{exam}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Skills Validated</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {(tier.skills ?? []).map((sk: string) => (
                    <div key={sk} style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                      <CheckCircle2 size={10} color={accent} style={{ marginTop: 1, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, color: '#8899aa' }}>{sk}</span>
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
