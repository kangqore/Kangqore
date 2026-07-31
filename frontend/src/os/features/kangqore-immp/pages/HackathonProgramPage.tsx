import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function HackathonProgramPage() {
  const q = useQuery({ queryKey: ['hackathon-program'], queryFn: () => api.get('/admin/kangqore-immp/platform/hackathon-program').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S245 · WAANDA Hackathon Program</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA Hackathon 2026</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Annual hackathon · £50K prize pool · 48-hour build challenge · winning apps published to App Store · talent pipeline</p>
      </div>

      {/* Prize pool hero */}
      <div style={{ background: `linear-gradient(135deg, ${AMBER}12, ${PURPLE}08)`, border: `1px solid ${AMBER}35`, borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Total Prize Pool</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: AMBER, lineHeight: 1 }}>£{((d?.prizePool ?? 50000) / 1000).toFixed(0)}K</div>
          </div>
          <div style={{ height: 60, width: 1, background: '#263250' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1 }}>
            {[
              { label: 'Duration', value: d?.duration ?? '48 hours', color: BLUE },
              { label: 'Registered Teams', value: d?.registeredTeams ?? 124, color: GREEN },
              { label: 'Submissions Expected', value: d?.submissionsExpected ?? 80, color: PURPLE },
              { label: 'App Store Publication', value: 'All winners', color: AMBER },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 15, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#8899aa' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prizes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {(d?.prizes ?? []).map((p: any, i: number) => {
          const accent = [AMBER, BLUE, '#cd7f32', GREEN][i] ?? GREEN
          return (
            <div key={p.place} style={{ background: '#1a2235', border: `1px solid ${accent}28`, borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: accent, marginBottom: 4 }}>{p.place} Place</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{p.amount}</div>
              <div style={{ fontSize: 11, color: '#8899aa' }}>{p.reward}</div>
            </div>
          )
        })}
      </div>

      {/* Tracks + Timeline side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Challenge Tracks</div>
          {(d?.tracks ?? []).map((t: any, i: number) => {
            const accent = [BLUE, GREEN, PURPLE, AMBER][i] ?? BLUE
            return (
              <div key={t.id} style={{ padding: '12px 20px', borderBottom: i < 3 ? '1px solid #1e2a40' : 'none' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: accent, marginBottom: 3 }}>{t.name}</div>
                <div style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.5 }}>{t.desc}</div>
              </div>
            )
          })}
        </div>
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Timeline</div>
          {(d?.timeline ?? []).map((t: any, i: number) => {
            const accent = [BLUE, AMBER, PURPLE, GREEN, BLUE][i] ?? BLUE
            return (
              <div key={t.phase} style={{ padding: '10px 20px', borderBottom: i < (d?.timeline?.length ?? 5) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#ccdde0' }}>{t.phase}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: accent }}>{t.date}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
