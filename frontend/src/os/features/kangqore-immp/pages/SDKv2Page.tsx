import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Code2, Globe, Terminal, Webhook, Key, Copy, CheckCircle, ChevronRight } from 'lucide-react'
import { api } from '@lib/api'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const PURP = '#7c3aed'
const GRN  = '#10b981'
const BLUE = '#579bfc'
const AMB  = '#f59e0b'

const TABS = ['TypeScript', 'Python', 'OpenAPI', 'Webhooks'] as const
type Tab = typeof TABS[number]

const TS_SNIPPET = `import { KangqoreClient } from './kangqore-sdk'

const kq = new KangqoreClient({
  apiKey:  'kq_live_YOUR_KEY_HERE',
  baseUrl: 'https://yourdomain.com',
})

// Get latest OIS score
const { data: [latest] } = await kq.getOIS({ limit: 1 })
console.log('OIS:', latest.oisScore)

// Ingest a signal
await kq.createSignal({
  sourceModule:   'crm',
  signalType:     'deal_won',
  signalCategory: 'INTENT',
  signalValue:    'Enterprise deal closed — £250k ACV',
  confidence:     0.95, severity: 'HIGH',
})

// Trigger a strategic decision
const { data: decision } = await kq.createDecision({
  question: 'Should we expand to BFSI vertical in Q4?',
})
console.log('Decision ID:', decision.id)`

const PY_SNIPPET = `from kangqore import KangqoreClient

kq = KangqoreClient(
    api_key="kq_live_YOUR_KEY_HERE",
    base_url="https://yourdomain.com"
)

# Get OIS trend
ois = kq.get_ois(limit=10)
print("Latest OIS:", ois["data"][0]["oisScore"])

# Ingest a signal
kq.create_signal(
    source_module="crm", signal_type="deal_won",
    signal_category="INTENT",
    signal_value="Enterprise deal closed — £250k ACV",
    confidence=0.95, severity="HIGH",
)

# Verify webhook signature
valid = KangqoreClient.verify_webhook(
    payload=request.body,
    signature=request.headers["X-Kangqore-Signature"],
    secret="your_webhook_secret"
)
if not valid:
    return 401`

const WEBHOOK_SNIPPET = `// Receive and verify Kangqore webhook
app.post('/webhooks/kangqore', express.raw({ type: 'application/json' }), (req, res) => {
  const sig    = req.headers['x-kangqore-signature']
  const secret = process.env.KANGQORE_WEBHOOK_SECRET
  const expected = crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  const event = JSON.parse(req.body)
  switch (event.type) {
    case 'ois.updated':    handleOISUpdate(event.data);  break
    case 'signal.created': handleSignal(event.data);     break
    case 'decision.resolved': handleDecision(event.data); break
  }
  res.json({ received: true })
})`

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: '#0f172a', border: `1px solid ${BDR}` }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="text-[10px] font-mono font-semibold" style={{ color: '#64748b' }}>{lang}</span>
        <button onClick={copy} className="flex items-center gap-1 text-[10px] font-semibold transition-colors"
          style={{ color: copied ? GRN : '#64748b' }}>
          {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-xs overflow-x-auto font-mono leading-relaxed" style={{ color: '#e2e8f0' }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function SDKv2Page() {
  const [tab, setTab] = useState<Tab>('TypeScript')

  const { data: eventTypes } = useQuery({
    queryKey: ['webhook-event-types'],
    queryFn: () => api.get('/admin/developer/webhook/event-types').then(r => r.data),
  })

  const { data: openapi } = useQuery({
    queryKey: ['openapi-spec'],
    queryFn: () => api.get('/admin/developer/openapi.json').then(r => r.data),
    enabled: tab === 'OpenAPI',
  })

  const downloadTS = () => {
    window.open('/api/admin/developer/sdk/typescript', '_blank')
  }
  const downloadPY = () => {
    window.open('/api/admin/developer/sdk/python', '_blank')
  }
  const downloadSpec = () => {
    window.open('/api/admin/developer/openapi.json', '_blank')
  }

  const events = eventTypes?.eventTypes ?? []
  const paths = openapi ? Object.keys(openapi.paths ?? {}) : []

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="SDK v2" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: T1 }}>SDK v2 — Developer Portal</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
            TypeScript · Python · OpenAPI 3.1 · Webhook HMAC
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadTS}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-2xl"
            style={{ background: BLUE, color: '#fff' }}>
            <Download className="w-3.5 h-3.5" /> TypeScript SDK
          </button>
          <button onClick={downloadPY}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-2xl"
            style={{ background: GRN, color: '#fff' }}>
            <Download className="w-3.5 h-3.5" /> Python SDK
          </button>
          <button onClick={downloadSpec}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-2xl"
            style={{ background: AMB, color: '#fff' }}>
            <Download className="w-3.5 h-3.5" /> OpenAPI Spec
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: 'SDK Languages', v: '2', icon: Code2, c: BLUE },
          { l: 'API Endpoints', v: paths.length || '4', icon: Globe, c: PURP },
          { l: 'Webhook Events', v: events.length || '11', icon: Webhook, c: AMB },
          { l: 'Auth Methods', v: '1 (Bearer)', icon: Key, c: GRN },
        ].map(s => (
          <div key={s.l} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${s.c}18` }}>
              <s.icon className="w-4 h-4" style={{ color: s.c }} />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: T1 }}>{s.v}</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: T2 }}>{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background: CARD, border: `1px solid ${BDR}` }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 text-xs font-semibold py-2 rounded-2xl transition-colors"
            style={{ background: tab === t ? PURP : 'transparent', color: tab === t ? '#fff' : T2 }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'TypeScript' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-2xl" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}40` }}>
            <Terminal className="w-4 h-4 flex-shrink-0" style={{ color: BLUE }} />
            <code className="text-xs font-mono" style={{ color: T1 }}>
              # No install needed — download and import directly<br />
              import {'{ KangqoreClient }'} from './kangqore-sdk'
            </code>
          </div>
          <CodeBlock code={TS_SNIPPET} lang="TypeScript" />
        </div>
      )}

      {tab === 'Python' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-2xl" style={{ background: `${GRN}12`, border: `1px solid ${GRN}40` }}>
            <Terminal className="w-4 h-4 flex-shrink-0" style={{ color: GRN }} />
            <code className="text-xs font-mono" style={{ color: T1 }}>pip install requests  &nbsp;&nbsp; # only dependency</code>
          </div>
          <CodeBlock code={PY_SNIPPET} lang="Python" />
        </div>
      )}

      {tab === 'OpenAPI' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl"
            style={{ background: `${AMB}12`, border: `1px solid ${AMB}40` }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: T1 }}>OpenAPI 3.1 Specification</p>
              <p className="text-xs mt-0.5" style={{ color: T2 }}>Import into Postman, Insomnia, or any OpenAPI toolchain</p>
            </div>
            <button onClick={downloadSpec}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-2xl"
              style={{ background: AMB, color: '#fff' }}>
              <Download className="w-3.5 h-3.5" /> openapi.json
            </button>
          </div>
          <div className="space-y-2">
            {paths.map((p: string) => (
              <div key={p} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: CARD, border: `1px solid ${BDR}` }}>
                <code className="text-xs font-mono flex-1" style={{ color: PURP }}>{p}</code>
                <div className="flex gap-1">
                  {Object.keys(openapi?.paths?.[p] ?? {}).map((m: string) => (
                    <span key={m} className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                      style={{ background: m === 'get' ? `${GRN}20` : m === 'post' ? `${BLUE}20` : `${AMB}20`,
                               color: m === 'get' ? GRN : m === 'post' ? BLUE : AMB }}>
                      {m}
                    </span>
                  ))}
                </div>
                <ChevronRight className="w-4 h-4" style={{ color: T2 }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Webhooks' && (
        <div className="space-y-4">
          <CodeBlock code={WEBHOOK_SNIPPET} lang="Webhook Handler (Node.js)" />
          <p className="text-xs font-semibold uppercase tracking-widest mt-2" style={{ color: T2 }}>Event Types</p>
          <div className="space-y-2">
            {events.map((e: any) => (
              <div key={e.type} className="rounded-2xl px-4 py-3 flex items-start gap-3"
                style={{ background: CARD, border: `1px solid ${BDR}` }}>
                <code className="text-xs font-mono font-bold flex-shrink-0 pt-0.5"
                  style={{ color: PURP }}>{e.type}</code>
                <div className="flex-1">
                  <p className="text-xs" style={{ color: T2 }}>{e.description}</p>
                  <code className="text-[10px] mt-1 block" style={{ color: T2 }}>
                    {JSON.stringify(e.example)}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
