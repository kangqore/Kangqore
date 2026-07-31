import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'
const STATUS_COLOR: Record<string, string> = { ACTIVE: GREEN, RAMP_UP: AMBER }

export function F500ClientOnboardingPage() {
  const q = useQuery({ queryKey: ['f500-client-onboarding'], queryFn: () => api.get('/admin/kangqore-immp/platform/f500-client-onboarding').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S269 · Fortune 500 Client Onboarding</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Fortune 500 Clients — First 5 Enterprise Accounts Live</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Avg COIG lift: +{d?.avgOisLift ?? 25.5} · avg BIDS score: {d?.avgBidsScore ?? 62} · total ACV: £{((d?.totalACV ?? 8000000) / 1e6).toFixed(1)}M</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'F500 Clients',    value: d?.clientCount ?? 5,                                     color: AMBER  },
          { label: 'Avg COIG Lift',   value: `+${d?.avgOisLift ?? 25.5}`,                             color: GREEN  },
          { label: 'Avg BIDS Score',  value: d?.avgBidsScore ?? 62,                                   color: BLUE   },
          { label: 'Total ACV',       value: `£${((d?.totalACV ?? 8000000) / 1e6).toFixed(1)}M`,     color: PURPLE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(d?.clients ?? []).map((client: any) => {
          const accent = STATUS_COLOR[client.status] ?? BLUE
          const oisLift = client.oisNow - client.oisDay0
          return (
            <div key={client.id} style={{ background: '#1a2235', border: `1px solid ${accent}20`, borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: '#4a5568' }}>{client.id}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0', flex: 1 }}>{client.name}</span>
                <span style={{ fontSize: 10, color: '#8899aa', background: '#141c2c', borderRadius: 4, padding: '2px 8px' }}>{client.sector}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: PURPLE }}>£{(client.acv / 1e6).toFixed(1)}M ACV</span>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: `${accent}18`, color: accent }}>{client.status.replace('_', ' ')}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#4a5568', marginBottom: 3 }}>OIS Day 0</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: AMBER }}>{client.oisDay0}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#4a5568', marginBottom: 3 }}>OIS Now</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>{client.oisNow}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#4a5568', marginBottom: 3 }}>COIG Lift</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>+{oisLift.toFixed(1)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#4a5568', marginBottom: 3 }}>BIDS Score</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: BLUE }}>{client.bidsScore}</div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 0, height: 5, borderRadius: 3, overflow: 'hidden', background: '#263250' }}>
                  <div style={{ width: `${client.bidsScore}%`, background: BLUE, borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 9, color: '#4a5568', marginTop: 3 }}>BIDS score out of 100 · {client.daysOnPlatform}d on platform</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
