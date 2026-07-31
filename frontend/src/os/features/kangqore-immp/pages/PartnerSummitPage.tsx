import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const SESSION_TYPE_COLORS: Record<string, string> = {
  Keynote: PURPLE, Workshop: BLUE, Presentation: GREEN,
  Networking: '#4a5568', Showcase: AMBER, Technical: BLUE, Ceremony: AMBER, Preview: '#06b6d4',
}

export function PartnerSummitPage() {
  const q = useQuery({ queryKey: ['partner-summit'], queryFn: () => api.get('/admin/kangqore-immp/platform/partner-summit').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S249 · Partner Summit + COIG Leaderboard</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>First Annual Kangqore Partner Summit</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>COIG leaderboard published (anonymized) · best-in-class case studies spotlighted · partner awards · London, UK</p>
      </div>

      {/* Event hero */}
      <div style={{ background: `linear-gradient(135deg, ${PURPLE}10, ${BLUE}08)`, border: `1px solid ${PURPLE}30`, borderRadius: 14, padding: '20px 24px', marginBottom: 20, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Date', value: d?.date ?? '2026-10-15', color: PURPLE },
          { label: 'Location', value: d?.location ?? 'London, UK', color: BLUE },
          { label: 'Attendees', value: d?.attendees ?? 94, color: GREEN },
          { label: 'Partners', value: d?.partners ?? 10, color: AMBER },
          { label: 'Virtual', value: d?.virtual ? 'Available' : 'In-person only', color: '#8899aa' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {/* Agenda */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Agenda</div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {(d?.agenda ?? []).map((item: any, i: number) => {
              const accent = SESSION_TYPE_COLORS[item.type] ?? BLUE
              return (
                <div key={`${item.time}-${i}`} style={{ padding: '10px 16px', borderBottom: i < (d?.agenda?.length ?? 9) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 10, color: '#4a5568', fontWeight: 700, minWidth: 36, flexShrink: 0 }}>{item.time}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#ccdde0', marginBottom: 2 }}>{item.session}</div>
                    {item.speaker && <div style={{ fontSize: 9, color: '#8899aa' }}>{item.speaker}</div>}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: accent + '14', color: accent, flexShrink: 0 }}>{item.type}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* COIG Leaderboard */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>COIG Leaderboard (Anonymized)</div>
          {(d?.coigLeaderboard ?? []).map((row: any) => (
            <div key={row.rank} style={{ padding: '9px 16px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, minWidth: 22 }}>{row.badge || `#${row.rank}`}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ccdde0' }}>{row.industry}</div>
                <div style={{ fontSize: 9, color: '#8899aa' }}>{row.region} · {row.clients} clients</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: row.rank <= 3 ? AMBER : GREEN }}>+{row.coigAvg}</div>
                <div style={{ fontSize: 9, color: '#8899aa' }}>COIG avg</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case studies / awards */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Featured Case Studies + Awards</div>
        {(d?.caseStudies ?? []).map((cs: any, i: number) => {
          const accent = [AMBER, BLUE, PURPLE][i] ?? GREEN
          return (
            <div key={cs.partner} style={{ padding: '13px 20px', borderBottom: i < (d?.caseStudies?.length ?? 3) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 2 }}>{cs.partner}</div>
                <div style={{ fontSize: 10, color: '#8899aa' }}>{cs.engagement}</div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: GREEN }}>{cs.coigGain}</div>
                  <div style={{ fontSize: 9, color: '#8899aa' }}>COIG gain</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: BLUE }}>{cs.blueprintROI}</div>
                  <div style={{ fontSize: 9, color: '#8899aa' }}>Blueprint ROI</div>
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 6, background: accent + '18', border: `1px solid ${accent}30`, color: accent }}>{cs.award}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
