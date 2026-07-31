import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const CAT_COLORS: Record<string, string> = {
  CRM: BLUE, Comms: PURPLE, Automation: GREEN, Productivity: AMBER,
  PM: '#34d399', Dev: '#60a5fa', Finance: '#10b981', Support: '#f472b6',
  Analytics: '#a78bfa', Marketing: '#fb923c', Cloud: '#0ea5e9', Data: '#e879f9',
  HR: '#f59e0b', ITSM: '#ef4444', Storage: '#8899aa', Legal: BLUE,
  Design: '#ec4899', Scheduling: '#06b6d4', Observability: '#f97316',
}

export function IntegrationHubPage() {
  const q = useQuery({ queryKey: ['integration-hub'], queryFn: () => api.get('/admin/kangqore-immp/platform/integration-hub').then(r => r.data), staleTime: 60_000 })
  const d = q.data
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const filtered = activeCategory === 'All'
    ? (d?.integrations ?? [])
    : (d?.integrations ?? []).filter((i: any) => i.category === activeCategory)

  const categories = ['All', ...(d?.categories ?? [])]

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S244 · Integration Hub</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>50+ Connectors — All Live</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Slack · HubSpot · Salesforce · Zapier · Make · Teams · Notion · Jira · GitHub · 40+ more via Connector SDK</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Active Integrations', value: d?.total ?? 52, color: GREEN },
          { label: 'Total Installs', value: d?.totalInstalls ?? '—', color: BLUE },
          { label: 'Categories', value: d?.categories?.length ?? 18, color: PURPLE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {categories.map(cat => {
          const accent = cat === 'All' ? BLUE : (CAT_COLORS[cat] ?? BLUE)
          const active = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 6, border: `1px solid ${active ? accent + '50' : '#263250'}`, background: active ? accent + '16' : 'transparent', color: active ? accent : '#8899aa', cursor: 'pointer' }}
            >{cat}</button>
          )
        })}
      </div>

      {/* Integration grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {filtered.map((intg: any) => {
          const accent = CAT_COLORS[intg.category] ?? BLUE
          return (
            <div key={intg.id} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{intg.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ccdde0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{intg.name}</div>
                <div style={{ fontSize: 9, color: accent, fontWeight: 700, marginTop: 1 }}>{intg.category}</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, color: GREEN, background: `${GREEN}14`, border: `1px solid ${GREEN}25`, borderRadius: 4, padding: '1px 5px', flexShrink: 0 }}>LIVE</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
