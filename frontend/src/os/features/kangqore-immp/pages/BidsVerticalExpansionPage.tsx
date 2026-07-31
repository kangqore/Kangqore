import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa', TEAL = '#06b6d4'

const ACCENT_COLORS = [GREEN, BLUE, AMBER, PURPLE, TEAL, '#f472b6', '#34d399', '#60a5fa', '#fb923c', '#e879f9']

export function BidsVerticalExpansionPage() {
  const q = useQuery({ queryKey: ['bids-vertical-editions'], queryFn: () => api.get('/admin/kangqore-immp/platform/bids-vertical-editions').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S236 · BIDS™ Vertical Expansion</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>10 Industry Editions — All Live</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>6 new editions: Manufacturing · Retail · Education · Government · Logistics · Energy · 10 editions total</p>
      </div>

      {/* Hero row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Editions', value: d?.total ?? 10, color: TEAL },
          { label: 'Total Clients', value: d?.totalClients ?? '—', color: GREEN },
          { label: 'New Editions', value: d?.newEditions?.length ?? 6, color: AMBER },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* NEW badge for new editions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {(d?.newEditions ?? ['MFGX', 'RETX', 'EDUX', 'GOVX', 'LOGX', 'ENRX']).map((id: string) => (
          <span key={id} style={{ fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 6, background: `${AMBER}18`, border: `1px solid ${AMBER}35`, color: AMBER }}>NEW · {id}</span>
        ))}
      </div>

      {/* Edition grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {(d?.editions ?? []).map((ed: any, i: number) => {
          const accent = ACCENT_COLORS[i % ACCENT_COLORS.length]
          const isNew = (d?.newEditions ?? []).includes(ed.id)
          return (
            <div key={ed.id} style={{ background: '#1a2235', border: `1px solid ${isNew ? accent + '40' : '#263250'}`, borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{ed.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{ed.label}</div>
                  <div style={{ fontSize: 10, color: accent, fontWeight: 700 }}>{ed.id} · {ed.clients} clients · avg score {ed.avgScore}</div>
                </div>
                {isNew && <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 900, color: AMBER, background: `${AMBER}18`, border: `1px solid ${AMBER}30`, borderRadius: 4, padding: '2px 7px' }}>NEW</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {(ed.pillars ?? []).map((p: string) => (
                  <div key={p} style={{ fontSize: 10, color: '#8899aa', paddingLeft: 8, borderLeft: `2px solid ${accent}30` }}>{p}</div>
                ))}
              </div>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ flex: 1, height: 4, background: '#263250', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${ed.avgScore}%`, height: '100%', background: accent, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 10, color: accent, fontWeight: 700 }}>{ed.avgScore}/100</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
