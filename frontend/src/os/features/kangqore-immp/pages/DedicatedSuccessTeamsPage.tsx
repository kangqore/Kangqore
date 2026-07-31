import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function DedicatedSuccessTeamsPage() {
  const q = useQuery({ queryKey: ['dedicated-success-teams'], queryFn: () => api.get('/admin/kangqore-immp/platform/dedicated-success-teams').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S265 · Dedicated Success Teams</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Dedicated Pod per Fortune 500 Customer</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>CSM + SA + Exec Sponsor per enterprise account · avg health score {d?.avgHealthScore ?? 91.6}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total CSMs',        value: d?.totalCSMs ?? 6,        color: BLUE   },
          { label: 'Solution Architects', value: d?.totalSAs ?? 5,       color: PURPLE },
          { label: 'Exec Sponsors',      value: d?.execSponsors ?? 2,    color: AMBER  },
          { label: 'Avg Health Score',   value: `${d?.avgHealthScore ?? 91.6}`, color: GREEN },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Team role structure */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
        {(d?.teamStructure ?? []).map((role: any) => {
          const colors: Record<string, string> = { CSM: BLUE, SA: PURPLE, ES: AMBER, BDL: GREEN }
          const accent = colors[role.abbr] ?? BLUE
          return (
            <div key={role.role} style={{ background: '#1a2235', border: `1px solid ${accent}18`, borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: accent, background: `${accent}18`, border: `1px solid ${accent}30`, borderRadius: 5, padding: '2px 8px' }}>{role.abbr}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0' }}>{role.role}</span>
              </div>
              {(role.responsibilities ?? []).map((r: string) => (
                <div key={r} style={{ fontSize: 10, color: '#8899aa', padding: '2px 0 2px 8px', borderLeft: `2px solid ${accent}25`, marginBottom: 3 }}>{r}</div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Customer teams table */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '1.5fr 80px 120px 130px 90px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Customer</span><span>Pod Size</span><span>CSM</span><span>Solution Architect</span><span>Health</span>
        </div>
        {(d?.teams ?? []).map((team: any, i: number) => {
          const hColor = team.healthScore >= 90 ? GREEN : team.healthScore >= 80 ? AMBER : '#ef4444'
          return (
            <div key={team.customerName} style={{ padding: '11px 20px', borderBottom: i < (d?.teams?.length ?? 5) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '1.5fr 80px 120px 130px 90px', alignItems: 'center', fontSize: 11 }}>
              <span style={{ color: '#ccdde0', fontWeight: 700 }}>{team.customerName}</span>
              <span style={{ color: '#8899aa' }}>{team.teamSize} people</span>
              <span style={{ color: BLUE }}>{team.csm}</span>
              <span style={{ color: PURPLE }}>{team.sa}</span>
              <span style={{ color: hColor, fontWeight: 800 }}>{team.healthScore}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
