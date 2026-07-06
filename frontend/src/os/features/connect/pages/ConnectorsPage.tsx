import { useState } from 'react'
import { CheckCircle, Circle, Settings, AlertCircle, ExternalLink, Zap } from 'lucide-react'

type ConnectorStatus = 'active' | 'setup' | 'available'
type ConnectorTier = 1 | 2

interface Connector {
  id: string
  name: string
  category: string
  description: string
  status: ConnectorStatus
  tier: ConnectorTier
  signalsToday?: number
  lastSync?: string
  logoColor: string
  logoText: string
  kimmpWeight: 'high' | 'medium' | 'low'
}

const connectors: Connector[] = [
  {
    id: 'servicenow',
    name: 'ServiceNow',
    category: 'ITSM',
    description: 'Incident, Problem, Change, CMDB — bi-directional. KIMMP writes insights back as ServiceNow KB articles.',
    status: 'active',
    tier: 1,
    signalsToday: 312,
    lastSync: '2m ago',
    logoColor: '#81B5A1',
    logoText: 'SN',
    kimmpWeight: 'high',
  },
  {
    id: 'jira',
    name: 'Jira / Azure DevOps',
    category: 'Engineering',
    description: 'Sprint velocity, defect rate, release risk, open issue count by severity.',
    status: 'active',
    tier: 1,
    signalsToday: 847,
    lastSync: '1m ago',
    logoColor: '#0052CC',
    logoText: 'JR',
    kimmpWeight: 'high',
  },
  {
    id: 'salesforce',
    name: 'Salesforce / HubSpot',
    category: 'CRM',
    description: 'Pipeline velocity, deal stage changes, churn signals, contract renewal proximity.',
    status: 'active',
    tier: 1,
    signalsToday: 688,
    lastSync: '5m ago',
    logoColor: '#00A1E0',
    logoText: 'SF',
    kimmpWeight: 'high',
  },
  {
    id: 'm365',
    name: 'Microsoft 365',
    category: 'Collaboration',
    description: 'Teams, Outlook, SharePoint — meeting patterns, escalation signals (opt-in), document activity.',
    status: 'setup',
    tier: 1,
    logoColor: '#0078D4',
    logoText: 'M3',
    kimmpWeight: 'medium',
  },
  {
    id: 'workday',
    name: 'Workday',
    category: 'HR',
    description: 'Headcount changes, attrition rate, hiring velocity, capacity signals.',
    status: 'setup',
    tier: 1,
    logoColor: '#F5A623',
    logoText: 'WD',
    kimmpWeight: 'medium',
  },
  {
    id: 'github',
    name: 'GitHub / GitLab',
    category: 'Engineering',
    description: 'PR merge rate, review lag, deploy frequency, DORA metrics.',
    status: 'available',
    tier: 1,
    logoColor: '#6E40C9',
    logoText: 'GH',
    kimmpWeight: 'medium',
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Collaboration',
    description: 'Escalation pattern detection, sentiment signals, response time in key channels (opt-in).',
    status: 'available',
    tier: 1,
    logoColor: '#4A154B',
    logoText: 'SL',
    kimmpWeight: 'low',
  },
  {
    id: 'stripe',
    name: 'Stripe / Zuora',
    category: 'Finance',
    description: 'AR aging, payment failures, MRR movements, subscription changes.',
    status: 'available',
    tier: 1,
    logoColor: '#635BFF',
    logoText: 'ST',
    kimmpWeight: 'high',
  },
  {
    id: 'sap',
    name: 'SAP / Oracle',
    category: 'ERP',
    description: 'Budget variance, AP/AR, cash position, procurement signals (read-only event stream).',
    status: 'available',
    tier: 1,
    logoColor: '#0070F2',
    logoText: 'SP',
    kimmpWeight: 'high',
  },
  {
    id: 'epic',
    name: 'Epic / Cerner',
    category: 'Healthcare',
    description: 'Patient volume, utilisation rates, compliance signals — healthcare vertical.',
    status: 'available',
    tier: 2,
    logoColor: '#E31B23',
    logoText: 'EP',
    kimmpWeight: 'high',
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg Terminal',
    category: 'Financial Services',
    description: 'Market signals, rate movements, sector intelligence for financial services clients.',
    status: 'available',
    tier: 2,
    logoColor: '#FF6A00',
    logoText: 'BL',
    kimmpWeight: 'high',
  },
  {
    id: 'veeva',
    name: 'Veeva',
    category: 'Pharma',
    description: 'Clinical, commercial, and regulatory signals for pharma and life sciences.',
    status: 'available',
    tier: 2,
    logoColor: '#F35F22',
    logoText: 'VV',
    kimmpWeight: 'medium',
  },
]

const STATUS_CONFIG: Record<ConnectorStatus, { label: string; color: string; icon: React.ReactNode }> = {
  active:    { label: 'Active',     color: '#10B981', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  setup:     { label: 'In Setup',   color: '#F59E0B', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  available: { label: 'Available',  color: 'var(--os-text-2)', icon: <Circle      className="w-3.5 h-3.5" /> },
}

const WEIGHT_COLOR: Record<string, string> = { high: '#e2445c', medium: '#fdab3d', low: '#6B7280' }

type FilterTab = 'all' | 'active' | 'setup' | 'available'

export function ConnectorsPage() {
  const [filter, setFilter] = useState<FilterTab>('all')

  const visible = connectors.filter(c => filter === 'all' || c.status === filter)
  const tier1   = visible.filter(c => c.tier === 1)
  const tier2   = visible.filter(c => c.tier === 2)

  const activeCount    = connectors.filter(c => c.status === 'active').length
  const setupCount     = connectors.filter(c => c.status === 'setup').length
  const availableCount = connectors.filter(c => c.status === 'available').length

  return (
    <div className="space-y-8">
      {/* Architecture callout */}
      <div className="p-5 rounded-2xl border border-[#2E2854] bg-[#0d1117] flex items-start gap-4">
        <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white mb-1">Signal ingestion, not replacement</p>
          <p className="text-xs text-[var(--os-text-2)] leading-relaxed">
            Each connector ships a <span className="text-[var(--os-text-1)] font-medium">Signal Schema</span> (maps tool events to Kangqore entities),
            a <span className="text-[var(--os-text-1)] font-medium">KIMMP Interpreter</span> (weights each signal in correlation),
            and a <span className="text-[var(--os-text-1)] font-medium">Confidence Decay</span> (how quickly signal relevance fades without follow-on events).
            You keep every existing tool. Kangqore synthesises above them.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--os-border)]">
        {([['all', 'All', connectors.length], ['active', 'Active', activeCount], ['setup', 'In Setup', setupCount], ['available', 'Available', availableCount]] as [FilterTab, string, number][]).map(([id, label, count]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all ${
              filter === id
                ? 'border-[#2564ea] text-[#2564ea]'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:border-[var(--os-border)]'
            }`}
          >
            {label}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-[var(--os-text-2)]">{count}</span>
          </button>
        ))}
      </div>

      {/* Tier 1 */}
      {tier1.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xs font-black tracking-widest uppercase text-[var(--os-text-2)]">Tier 1 — Enterprise Core</h2>
            <span className="text-[9px] text-[var(--os-text-2)]">Required for 80% of enterprise deals</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {tier1.map(c => <ConnectorCard key={c.id} c={c} />)}
          </div>
        </section>
      )}

      {/* Tier 2 */}
      {tier2.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xs font-black tracking-widest uppercase text-[var(--os-text-2)]">Tier 2 — Regulated Verticals</h2>
            <span className="text-[9px] text-[var(--os-text-2)]">Healthcare, Financial Services, Pharma</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {tier2.map(c => <ConnectorCard key={c.id} c={c} />)}
          </div>
        </section>
      )}
    </div>
  )
}

function ConnectorCard({ c }: { c: Connector }) {
  const cfg = STATUS_CONFIG[c.status]

  return (
    <div className={`p-5 rounded-2xl border bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 transition-all hover:border-[var(--os-border)] ${c.status === 'active' ? 'border-white/15' : 'border-[var(--os-border)]'}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ background: `${c.logoColor}25`, border: `1px solid ${c.logoColor}40` }}>
            {c.logoText}
          </div>
          <div>
            <p className="font-bold text-white text-sm">{c.name}</p>
            <p className="text-[10px] text-[var(--os-text-2)] font-medium uppercase tracking-wide">{c.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0" style={{ color: cfg.color }}>
          {cfg.icon}
          <span className="text-[10px] font-bold">{cfg.label}</span>
        </div>
      </div>

      <p className="text-xs text-[var(--os-text-2)] leading-relaxed mb-4">{c.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-black uppercase text-[var(--os-text-2)]">KIMMP weight</span>
            <span className="text-[10px] font-bold" style={{ color: WEIGHT_COLOR[c.kimmpWeight] }}>{c.kimmpWeight}</span>
          </div>
          {c.signalsToday !== undefined && (
            <>
              <span className="text-slate-800">·</span>
              <span className="text-[10px] text-[var(--os-text-2)]"><span className="font-bold text-[var(--os-text-2)]">{c.signalsToday.toLocaleString()}</span> signals today</span>
            </>
          )}
          {c.lastSync && (
            <>
              <span className="text-slate-800">·</span>
              <span className="text-[10px] text-[var(--os-text-2)]">synced {c.lastSync}</span>
            </>
          )}
        </div>
        <button className="flex items-center gap-1 text-[10px] font-bold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
          {c.status === 'active' ? <><Settings className="w-3 h-3" />Configure</> : <><ExternalLink className="w-3 h-3" />Setup</>}
        </button>
      </div>
    </div>
  )
}
