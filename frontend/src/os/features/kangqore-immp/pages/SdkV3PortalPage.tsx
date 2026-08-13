import { useQuery } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

// Overshadow Roadmap P6.3 — this page previously described a fictional npm
// package `@kangqore/sdk` with a fictional API (waanda.ask/stream/batch/
// webhook, domain namespaces like waanda.projects.*) that doesn't exist
// anywhere in the codebase. Rewritten to describe the real KangqoreClient
// (backend/src/routes/developer.ts) and the real Ontology SDK generator.
const METHODS = [
  { name: 'kq.getOIS()',            desc: 'Fetch recent OIS snapshots', color: BLUE },
  { name: 'kq.createOISSnapshot()', desc: 'Record a new OIS snapshot', color: GREEN },
  { name: 'kq.getSignals()',        desc: 'List KIMMP signals, paginated', color: BLUE },
  { name: 'kq.createSignal()',      desc: 'Ingest a new KIMMP signal', color: GREEN },
  { name: 'kq.getDecisions()',      desc: 'List strategic decisions, paginated', color: AMBER },
  { name: 'kq.createDecision()',    desc: 'Record a new strategic decision', color: GREEN },
  { name: 'kq.selectDecision()',    desc: 'Record which option was selected', color: AMBER },
  { name: 'kq.getBlueprints()',     desc: 'List deployment blueprints, paginated', color: PURPLE },
  { name: 'kq.createBlueprint()',   desc: 'Publish a new deployment blueprint', color: PURPLE },
]

const CODE = `// Downloaded directly from GET /api/admin/developer/sdk/typescript
// (authenticated — no npm/PyPI package is published)
import { KangqoreClient } from './kangqore-sdk'

const kq = new KangqoreClient({ apiKey: 'kq_live_...' })

const { data: signals } = await kq.getSignals({ severity: 'HIGH' })

const { data: decision } = await kq.createDecision({
  question: 'Should we expand into the EU market in Q3?',
  reasoning: 'Pipeline velocity and TAM analysis',
  options: [/* ... */],
})

await kq.selectDecision(decision.id, 'Expand in Q4', 'Approved by leadership')
`

export function SdkV3PortalPage() {
  const q = useQuery({ queryKey: ['sdk-v3-stats'], queryFn: () => api.get('/admin/kangqore-immp/platform/sdk-v3/stats').then(r => r.data), staleTime: 20_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Overshadow Roadmap P6.3 — Developer Relations</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Kangqore TypeScript &amp; Python SDK</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>The real client — downloaded from an authenticated endpoint, not installed from a registry.</p>
      </div>

      {d?.disclaimer && (
        <div style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30`, borderRadius: 10, padding: '10px 14px', marginBottom: 18, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <AlertTriangle size={14} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11.5, color: '#ccdde0', lineHeight: 1.6 }}>{d.disclaimer}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Languages', value: (d?.languages ?? []).join(' + ') || '—', color: BLUE },
          { label: 'Active API Keys', value: d?.activeApiKeys ?? '—', color: GREEN },
          { label: 'Active Webhook Subs', value: d?.activeWebhookSubscriptions ?? '—', color: AMBER },
          { label: 'npm / PyPI Published', value: d?.published?.npm ? 'Yes' : 'Not yet', color: PURPLE },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8899aa', marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ background: '#0a1020', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e2a40', fontSize: 11, fontWeight: 700, color: '#8899aa', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', color: GREEN }}>TypeScript</span>
            Real usage
          </div>
          <pre style={{ margin: 0, padding: '14px 16px', fontSize: 10, color: '#a0c0e0', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'JetBrains Mono, Menlo, monospace' }}>{CODE}</pre>
        </div>

        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Real SDK methods</div>
          {METHODS.map(m => (
            <div key={m.name} style={{ padding: '9px 16px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono, monospace', minWidth: 160 }}>{m.name}</span>
              <span style={{ fontSize: 10, color: '#8899aa', flex: 1, lineHeight: 1.4 }}>{m.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <a href="/api/admin/developer/sdk/typescript" style={{ fontSize: 12, fontWeight: 700, color: BLUE, textDecoration: 'none', padding: '10px 16px', borderRadius: 10, background: `${BLUE}12`, border: `1px solid ${BLUE}30` }}>Download TypeScript SDK</a>
        <a href="/api/admin/developer/sdk/python" style={{ fontSize: 12, fontWeight: 700, color: GREEN, textDecoration: 'none', padding: '10px 16px', borderRadius: 10, background: `${GREEN}12`, border: `1px solid ${GREEN}30` }}>Download Python SDK</a>
        <a href="/api/docs" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: AMBER, textDecoration: 'none', padding: '10px 16px', borderRadius: 10, background: `${AMBER}12`, border: `1px solid ${AMBER}30` }}>Public API docs (/api/docs)</a>
      </div>
    </div>
  )
}
