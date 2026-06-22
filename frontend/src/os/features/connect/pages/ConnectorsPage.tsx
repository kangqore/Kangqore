import { useState } from 'react'
import { CheckCircle2, AlertCircle, Clock, RefreshCw, Zap, ArrowRight, ExternalLink } from 'lucide-react'

type ConnectorStatus = 'connected' | 'needs-config' | 'coming-soon' | 'error'
type SignalTier = 'T1' | 'T2'

interface SignalMapping {
  rawEvent: string
  kimmpSignal: string
  weight: number
}

interface Connector {
  id: string
  name: string
  logo: string
  category: string
  status: ConnectorStatus
  tier: SignalTier
  description: string
  lastSync?: string
  signalsToday?: number
  totalSignals?: number
  signals: SignalMapping[]
  entitiesMapped: string[]
  authType: 'oauth2' | 'api-key' | 'webhook' | 'saml'
  docsUrl: string
}

const CONNECTORS: Connector[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: '☁️',
    category: 'CRM',
    status: 'connected',
    tier: 'T1',
    description: 'Pipeline velocity, deal stage changes, churn signals, opportunity health scores',
    lastSync: '2m ago',
    signalsToday: 47,
    totalSignals: 1284,
    signals: [
      { rawEvent: 'opportunity.stage_changed',     kimmpSignal: 'Revenue · deal velocity',     weight: 85 },
      { rawEvent: 'opportunity.marked_at_risk',    kimmpSignal: 'Revenue · churn early warning', weight: 95 },
      { rawEvent: 'account.activity_gap',          kimmpSignal: 'Revenue · engagement cold',    weight: 78 },
      { rawEvent: 'contract.renewal_approaching',  kimmpSignal: 'Finance · contract expiry',    weight: 80 },
    ],
    entitiesMapped: ['Client', 'Deal', 'Contact', 'Contract'],
    authType: 'oauth2',
    docsUrl: '#',
  },
  {
    id: 'jira',
    name: 'Jira / Azure DevOps',
    logo: '🔵',
    category: 'Engineering',
    status: 'connected',
    tier: 'T1',
    description: 'Sprint velocity, defect rate, release risk, team throughput, backlog health',
    lastSync: '8m ago',
    signalsToday: 31,
    totalSignals: 892,
    signals: [
      { rawEvent: 'sprint.velocity_drop',          kimmpSignal: 'Delivery · velocity degraded',  weight: 90 },
      { rawEvent: 'blocker.created',               kimmpSignal: 'Delivery · blocker raised',     weight: 88 },
      { rawEvent: 'defect.critical_opened',        kimmpSignal: 'Delivery · quality risk',       weight: 82 },
      { rawEvent: 'release.milestone_at_risk',     kimmpSignal: 'Delivery · milestone risk',     weight: 92 },
    ],
    entitiesMapped: ['Project', 'Sprint', 'Resource', 'Release'],
    authType: 'api-key',
    docsUrl: '#',
  },
  {
    id: 'm365',
    name: 'Microsoft 365',
    logo: '🟦',
    category: 'Productivity',
    status: 'connected',
    tier: 'T1',
    description: 'Meeting patterns, email response times, Teams activity, document collaboration signals',
    lastSync: '15m ago',
    signalsToday: 23,
    totalSignals: 567,
    signals: [
      { rawEvent: 'email.unanswered_client_thread', kimmpSignal: 'Revenue · engagement gap',       weight: 70 },
      { rawEvent: 'calendar.no_client_meeting_30d', kimmpSignal: 'Revenue · relationship cold',    weight: 72 },
      { rawEvent: 'teams.escalation_pattern',       kimmpSignal: 'Operations · internal friction', weight: 65 },
    ],
    entitiesMapped: ['Client', 'Resource', 'Project'],
    authType: 'oauth2',
    docsUrl: '#',
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: '💬',
    category: 'Communication',
    status: 'connected',
    tier: 'T1',
    description: 'Escalation patterns, sentiment signals, incident channels, response latency (opt-in)',
    lastSync: '1m ago',
    signalsToday: 18,
    totalSignals: 423,
    signals: [
      { rawEvent: 'channel.incident_opened',       kimmpSignal: 'Operations · incident signal',   weight: 85 },
      { rawEvent: 'message.exec_escalation',       kimmpSignal: 'Operations · escalation raised', weight: 80 },
      { rawEvent: 'channel.client_sentiment_neg',  kimmpSignal: 'Revenue · client sentiment',     weight: 68 },
    ],
    entitiesMapped: ['Project', 'Client', 'Resource'],
    authType: 'oauth2',
    docsUrl: '#',
  },
  {
    id: 'github',
    name: 'GitHub / GitLab',
    logo: '⬛',
    category: 'Engineering',
    status: 'connected',
    tier: 'T1',
    description: 'PR merge rate, deployment frequency, DORA metrics, code review latency',
    lastSync: '4m ago',
    signalsToday: 12,
    totalSignals: 334,
    signals: [
      { rawEvent: 'deployment.failed',             kimmpSignal: 'Delivery · deployment risk',     weight: 88 },
      { rawEvent: 'pr.review_overdue_48h',         kimmpSignal: 'Delivery · review bottleneck',   weight: 72 },
      { rawEvent: 'release.rollback',              kimmpSignal: 'Delivery · quality regression',  weight: 95 },
    ],
    entitiesMapped: ['Project', 'Resource', 'Release'],
    authType: 'api-key',
    docsUrl: '#',
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    logo: '🟩',
    category: 'ITSM',
    status: 'needs-config',
    tier: 'T1',
    description: 'Incident volume, MTTR, P1 count, change risk scores — ingested as Business Issues',
    signals: [
      { rawEvent: 'incident.p1_opened',            kimmpSignal: 'Operations · critical incident', weight: 95 },
      { rawEvent: 'change.high_risk_approved',     kimmpSignal: 'Operations · high-risk change',  weight: 80 },
      { rawEvent: 'sla.breach_detected',           kimmpSignal: 'Operations · SLA breached',      weight: 90 },
    ],
    entitiesMapped: ['Resource', 'Project', 'Vendor'],
    authType: 'api-key',
    docsUrl: '#',
  },
  {
    id: 'stripe',
    name: 'Stripe / Zuora',
    logo: '💳',
    category: 'Finance',
    status: 'needs-config',
    tier: 'T1',
    description: 'MRR movements, churn events, invoice failures, subscription lifecycle signals',
    signals: [
      { rawEvent: 'subscription.cancelled',        kimmpSignal: 'Finance · churn confirmed',      weight: 100 },
      { rawEvent: 'invoice.payment_failed',        kimmpSignal: 'Finance · payment at risk',      weight: 88 },
      { rawEvent: 'mrr.decline_consecutive',       kimmpSignal: 'Finance · revenue trend negative', weight: 85 },
    ],
    entitiesMapped: ['Client', 'Contract', 'Finance'],
    authType: 'api-key',
    docsUrl: '#',
  },
  {
    id: 'workday',
    name: 'Workday',
    logo: '🏢',
    category: 'HR',
    status: 'coming-soon',
    tier: 'T1',
    description: 'Headcount changes, attrition rate, hiring velocity, org structure shifts',
    signals: [
      { rawEvent: 'employee.resigned',             kimmpSignal: 'People · attrition signal',      weight: 90 },
      { rawEvent: 'headcount.below_plan',          kimmpSignal: 'People · capacity risk',         weight: 82 },
      { rawEvent: 'hiring.velocity_drop',          kimmpSignal: 'People · recruitment lagging',   weight: 75 },
    ],
    entitiesMapped: ['Resource', 'Department', 'Project'],
    authType: 'saml',
    docsUrl: '#',
  },
  {
    id: 'sap',
    name: 'SAP / Oracle',
    logo: '🔷',
    category: 'ERP',
    status: 'coming-soon',
    tier: 'T2',
    description: 'AR aging, cash position, budget variance, cost centre over-runs',
    signals: [
      { rawEvent: 'ar.days_outstanding_exceeded',  kimmpSignal: 'Finance · AR aging',             weight: 88 },
      { rawEvent: 'budget.variance_15pct',         kimmpSignal: 'Finance · budget breach',        weight: 85 },
      { rawEvent: 'cashflow.runway_below_90d',     kimmpSignal: 'Finance · cash warning',         weight: 92 },
    ],
    entitiesMapped: ['Finance', 'Department', 'Vendor'],
    authType: 'api-key',
    docsUrl: '#',
  },
  {
    id: 'google',
    name: 'Google Workspace',
    logo: '🔴',
    category: 'Productivity',
    status: 'needs-config',
    tier: 'T1',
    description: 'Gmail response patterns, Meet attendance, Drive collaboration density',
    signals: [
      { rawEvent: 'gmail.client_unanswered_48h',   kimmpSignal: 'Revenue · communication gap',    weight: 68 },
      { rawEvent: 'meet.attendance_dropped',        kimmpSignal: 'People · engagement drop',      weight: 60 },
    ],
    entitiesMapped: ['Client', 'Resource'],
    authType: 'oauth2',
    docsUrl: '#',
  },
]

const STATUS_CONFIG: Record<ConnectorStatus, { label: string; color: string; icon: React.ElementType }> = {
  'connected':    { label: 'Connected',       color: '#00c875', icon: CheckCircle2 },
  'needs-config': { label: 'Needs Setup',     color: '#fdab3d', icon: AlertCircle  },
  'coming-soon':  { label: 'Coming Soon',     color: '#475569', icon: Clock        },
  'error':        { label: 'Error',           color: '#e2445c', icon: AlertCircle  },
}

const AUTH_LABEL: Record<Connector['authType'], string> = {
  'oauth2':  'OAuth 2.0',
  'api-key': 'API Key',
  'webhook': 'Webhook',
  'saml':    'SAML 2.0',
}

function ConnectorCard({ connector, selected, onClick }: { connector: Connector; selected: boolean; onClick: () => void }) {
  const sc = STATUS_CONFIG[connector.status]
  const Icon = sc.icon

  return (
    <button onClick={onClick}
      className="w-full text-left p-4 rounded-xl transition-all"
      style={{
        background: selected ? 'rgba(37,100,234,0.06)' : '#0d1117',
        border: `1px solid ${selected ? 'rgba(37,100,234,0.3)' : '#2E2854'}`,
        outline: 'none',
      }}>
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none flex-shrink-0 mt-0.5">{connector.logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[13px] font-semibold text-white leading-tight">{connector.name}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{connector.category} · {AUTH_LABEL[connector.authType]}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 px-2 py-1 rounded-lg"
              style={{ background: `${sc.color}10`, border: `1px solid ${sc.color}25` }}>
              <Icon style={{ width: 10, height: 10, color: sc.color }} />
              <span className="text-[9px] font-bold" style={{ color: sc.color }}>{sc.label}</span>
            </div>
          </div>
          {connector.status === 'connected' && (
            <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {connector.signalsToday} signals today
              </span>
              <span>·</span>
              <span>Synced {connector.lastSync}</span>
            </div>
          )}
          {connector.status === 'needs-config' && (
            <p className="text-[10px] text-amber-500 mt-1.5 flex items-center gap-1">
              <AlertCircle style={{ width: 10, height: 10 }} />
              API credentials required to activate
            </p>
          )}
        </div>
      </div>
    </button>
  )
}

function ConnectorDetail({ connector }: { connector: Connector }) {
  const sc = STATUS_CONFIG[connector.status]
  const Icon = sc.icon

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl p-5" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
        <div className="flex items-start gap-4">
          <div className="text-4xl leading-none">{connector.logo}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white mb-0.5">{connector.name}</h2>
                <p className="text-[12px] text-slate-500">{connector.description}</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: `${sc.color}10`, border: `1px solid ${sc.color}30` }}>
                <Icon style={{ width: 12, height: 12, color: sc.color }} />
                <span className="text-[11px] font-bold" style={{ color: sc.color }}>{sc.label}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-4">
              {connector.status === 'connected' ? [
                { label: 'Signals Today',  value: connector.signalsToday ?? 0, color: '#00c875' },
                { label: 'Total Signals',  value: (connector.totalSignals ?? 0).toLocaleString(), color: '#2564ea' },
                { label: 'Last Sync',      value: connector.lastSync ?? '—',   color: '#64748b' },
                { label: 'Entities',       value: connector.entitiesMapped.length, color: '#7f53f9' },
              ] : [
                { label: 'Auth Method',    value: AUTH_LABEL[connector.authType], color: '#64748b' },
                { label: 'Signal Count',   value: connector.signals.length,       color: '#64748b' },
                { label: 'Tier',           value: connector.tier,                 color: connector.tier === 'T1' ? '#2564ea' : '#64748b' },
                { label: 'Entities',       value: connector.entitiesMapped.length, color: '#64748b' },
              ].map(item => (
                <div key={item.label} className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1f2a4a' }}>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-700 mb-1">{item.label}</p>
                  <p className="text-sm font-bold" style={{ color: item.color }}>{typeof item.value === 'number' ? item.value : item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #1f2a4a' }}>
          {connector.status === 'connected' && (
            <>
              <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold rounded-lg transition-all hover:opacity-80"
                style={{ background: 'rgba(0,200,117,0.08)', border: '1px solid rgba(0,200,117,0.2)', color: '#00c875' }}>
                <RefreshCw style={{ width: 12, height: 12 }} /> Sync Now
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold rounded-lg transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
                <ExternalLink style={{ width: 12, height: 12 }} /> Configure
              </button>
            </>
          )}
          {connector.status === 'needs-config' && (
            <button className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold rounded-lg transition-all hover:opacity-80"
              style={{ background: 'rgba(253,171,61,0.1)', border: '1px solid rgba(253,171,61,0.3)', color: '#fdab3d' }}>
              <ArrowRight style={{ width: 12, height: 12 }} /> Connect {connector.name}
            </button>
          )}
          {connector.status === 'coming-soon' && (
            <button className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold rounded-lg opacity-50 cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
              <Clock style={{ width: 12, height: 12 }} /> Notify when available
            </button>
          )}
        </div>
      </div>

      {/* Signal Schema */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
        <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1f2a4a' }}>
          <Zap style={{ width: 12, height: 12, color: '#fdab3d' }} />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Signal Schema — how {connector.name} events map to KIMMP intelligence</p>
        </div>
        <div className="divide-y divide-[#1a2035]">
          {connector.signals.map(sig => {
            const weight = sig.weight
            const wColor = weight >= 90 ? '#e2445c' : weight >= 75 ? '#fdab3d' : '#2564ea'
            return (
              <div key={sig.rawEvent} className="px-4 py-3 grid grid-cols-5 gap-4 items-center">
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-700 mb-0.5 uppercase tracking-wider">Raw Event</p>
                  <p className="text-[11px] font-mono text-slate-400">{sig.rawEvent}</p>
                </div>
                <div className="flex justify-center">
                  <ArrowRight style={{ width: 14, height: 14, color: '#334155' }} />
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-700 mb-0.5 uppercase tracking-wider">KIMMP Signal</p>
                  <p className="text-[11px] font-semibold text-white">{sig.kimmpSignal}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Entity mapping */}
      <div className="rounded-xl p-4" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-700 mb-3">Entity Graph Mapping</p>
        <div className="flex flex-wrap gap-2">
          {connector.entitiesMapped.map(e => (
            <span key={e} className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(37,100,234,0.08)', border: '1px solid rgba(37,100,234,0.2)', color: '#60a5fa' }}>
              {e}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-slate-700 mt-2.5 leading-relaxed">
          Signals from {connector.name} are automatically mapped to these entity types in the Ops Centre Entity Graph. Disruptions propagate through dependency chains.
        </p>
      </div>
    </div>
  )
}

export function ConnectorsPage() {
  const [selected, setSelected] = useState('salesforce')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(CONNECTORS.map(c => c.category)))]
  const filtered = categoryFilter === 'all' ? CONNECTORS : CONNECTORS.filter(c => c.category === categoryFilter)
  const selectedConnector = CONNECTORS.find(c => c.id === selected) ?? CONNECTORS[0]

  const connected = CONNECTORS.filter(c => c.status === 'connected').length
  const signalsToday = CONNECTORS.filter(c => c.status === 'connected').reduce((s, c) => s + (c.signalsToday ?? 0), 0)

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Connected Sources',    value: connected,                     color: '#00c875' },
          { label: 'Signals Today',        value: signalsToday,                  color: '#2564ea' },
          { label: 'Entities Enriched',    value: '5 types',                     color: '#7f53f9' },
          { label: 'Awaiting Setup',       value: CONNECTORS.filter(c => c.status === 'needs-config').length, color: '#fdab3d' },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: '#0d1117', border: `1px solid ${s.color}18` }}>
            <p className="text-xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg capitalize transition-all"
            style={{
              background: categoryFilter === cat ? 'rgba(37,100,234,0.1)' : '#0d1117',
              border: `1px solid ${categoryFilter === cat ? 'rgba(37,100,234,0.3)' : '#2E2854'}`,
              color: categoryFilter === cat ? '#60a5fa' : '#64748b',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Two-panel */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 space-y-2" style={{ maxHeight: 700, overflowY: 'auto' }}>
          {filtered.map(c => (
            <ConnectorCard key={c.id} connector={c} selected={selected === c.id} onClick={() => setSelected(c.id)} />
          ))}
        </div>
        <div className="col-span-3">
          <ConnectorDetail connector={selectedConnector} />
        </div>
      </div>
    </div>
  )
}
