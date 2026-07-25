import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const METHODS = [
  { name: 'waanda.ask()',         type: 'Standard',   desc: 'Single-turn WAANDA decision query', color: BLUE },
  { name: 'waanda.stream()',      type: 'Streaming',  desc: 'Server-sent events for long-running analysis', color: AMBER },
  { name: 'waanda.batch()',       type: 'Batch',      desc: 'Process up to 100 queries in parallel', color: PURPLE },
  { name: 'waanda.webhook()',     type: 'Webhook',    desc: 'Register async result delivery endpoint', color: GREEN },
  { name: 'waanda.projects.*',   type: 'Domain',     desc: 'KIMMP Projects domain — milestones, risks, resources', color: BLUE },
  { name: 'waanda.finance.*',    type: 'Domain',     desc: 'KIMMP Finance domain — budgets, forecasts, variance', color: GREEN },
  { name: 'waanda.crm.*',        type: 'Domain',     desc: 'KIMMP CRM domain — pipeline, deals, health scores', color: AMBER },
  { name: 'waanda.intelligence.*',type: 'Domain',    desc: 'WVIS graph nodes, BIDS scoring, AEGIS audit', color: PURPLE },
]

const CODE = `import KangqoreClient from '@kangqore/sdk'

const waanda = new KangqoreClient({ apiKey: process.env.KANGQORE_API_KEY })

// Standard ask
const result = await waanda.ask({
  question: 'Should we expand into EU market Q3?',
  context: { customerId: 'C-22', department: 'strategy' },
})
console.log(result.recommendation, result.confidence)

// Streaming
for await (const chunk of waanda.stream({ question: 'Analyse my pipeline' })) {
  process.stdout.write(chunk.delta)
}

// Batch (up to 100 parallel)
const results = await waanda.batch([
  { question: 'Risk: Customer 14 churn?' },
  { question: 'Risk: Budget variance Q2?' },
])

// Domain — Projects
const milestones = await waanda.projects.milestones({ clientId: 'C-08' })
`

const TYPE_COLOR: Record<string, string> = { Standard: BLUE, Streaming: AMBER, Batch: PURPLE, Webhook: GREEN, Domain: '#8899aa' }

export function SdkV3PortalPage() {
  const q = useQuery({ queryKey: ['sdk-v3-stats'], queryFn: () => api.get('/admin/kangqore-immp/platform/sdk-v3/stats').then(r => r.data), staleTime: 20_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S210 · SDK v3 + Developer Portal</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>@kangqore/sdk v3.0</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>TypeScript + JavaScript · streaming · batch · webhooks · 8 domain modules · Developer Portal live</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'SDK Downloads', value: d?.downloads?.toLocaleString() ?? '—', color: BLUE },
          { label: 'API Keys Issued', value: d?.apiKeys ?? '—', color: GREEN },
          { label: 'Avg Requests/Day', value: d?.requestsPerDay?.toLocaleString() ?? '—', color: AMBER },
          { label: 'P99 Latency', value: d?.p99Latency ? `${d.p99Latency}ms` : '—', color: PURPLE },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8899aa', marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Code sample */}
        <div style={{ background: '#0a1020', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e2a40', fontSize: 11, fontWeight: 700, color: '#8899aa', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', color: GREEN }}>TypeScript</span>
            @kangqore/sdk v3
          </div>
          <pre style={{ margin: 0, padding: '14px 16px', fontSize: 10, color: '#a0c0e0', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'JetBrains Mono, Menlo, monospace' }}>{CODE}</pre>
        </div>

        {/* Methods list */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>SDK Methods</div>
          {METHODS.map(m => (
            <div key={m.name} style={{ padding: '9px 16px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono, monospace', minWidth: 160 }}>{m.name}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: (TYPE_COLOR[m.type] ?? BLUE) + '18', color: TYPE_COLOR[m.type] ?? BLUE, minWidth: 56, textAlign: 'center' }}>{m.type}</span>
              <span style={{ fontSize: 10, color: '#8899aa', flex: 1, lineHeight: 1.4 }}>{m.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Portal links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { title: 'SDK Download', sub: 'npm install @kangqore/sdk', icon: '📦', color: BLUE },
          { title: 'API Reference', sub: 'Full method documentation', icon: '📖', color: AMBER },
          { title: 'Webhook Guide', sub: 'Async result delivery', icon: '🔗', color: PURPLE },
        ].map(p => (
          <div key={p.title} style={{ background: p.color + '08', border: `1px solid ${p.color}20`, borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <span style={{ fontSize: 22 }}>{p.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{p.title}</div>
              <div style={{ fontSize: 10, color: '#8899aa', marginTop: 2 }}>{p.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
