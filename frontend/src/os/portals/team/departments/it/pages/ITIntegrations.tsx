import { useState } from 'react'
import { PlugZap, CheckCircle2, XCircle, MinusCircle, Settings2 } from 'lucide-react'

type IntStatus = 'CONNECTED' | 'NOT_CONNECTED' | 'ERROR'

interface Integration {
  id:          string
  name:        string
  description: string
  category:    string
  status:      IntStatus
  lastSync?:   string
  color:       string
  logo:        string
}

const INTEGRATIONS: Integration[] = [
  { id: 'slack',      name: 'Slack',           category: 'Communication', status: 'CONNECTED',     lastSync: '2m ago',  color: '#4A154B', logo: 'S',
    description: 'Incident alerts, @mention on-call, resolution summaries, and P1 war-room channels.' },
  { id: 'github',     name: 'GitHub',          category: 'DevOps',        status: 'CONNECTED',     lastSync: '5m ago',  color: '#24292F', logo: 'GH',
    description: 'Link incidents to PRs and issues. CI failures auto-create P3 incidents.' },
  { id: 'datadog',    name: 'Datadog',         category: 'Monitoring',    status: 'CONNECTED',     lastSync: '1m ago',  color: '#632CA6', logo: 'DD',
    description: 'Auto-create P1/P2 incidents from Datadog alerts. Sync resolution state back.' },
  { id: 'okta',       name: 'Okta',            category: 'Identity',      status: 'CONNECTED',     lastSync: '1h ago',  color: '#007DC1', logo: 'OK',
    description: 'Sync user directory for assignee suggestions. Provision access via workflow.' },
  { id: 'aws',        name: 'AWS CloudWatch',  category: 'Monitoring',    status: 'ERROR',         lastSync: '3h ago',  color: '#FF9900', logo: 'AWS',
    description: 'Ingest CloudWatch alarms as IT incidents. Map AWS resources to CMDB assets.' },
  { id: 'jira',       name: 'Jira',            category: 'ITSM',          status: 'NOT_CONNECTED', color: '#0052CC', logo: 'JR',
    description: 'Bi-directional sync: create Jira tickets from incidents, mirror status changes.' },
  { id: 'pagerduty',  name: 'PagerDuty',       category: 'On-Call',       status: 'NOT_CONNECTED', color: '#25C151', logo: 'PD',
    description: 'Route P1 incidents to PagerDuty on-call schedules and escalation policies.' },
  { id: 'zoom',       name: 'Zoom',            category: 'Communication', status: 'NOT_CONNECTED', color: '#2D8CFF', logo: 'ZM',
    description: 'Auto-create Zoom war-room for P1 incidents. Attach recording post-resolution.' },
  { id: 'confluence', name: 'Confluence',      category: 'Knowledge',     status: 'NOT_CONNECTED', color: '#0052CC', logo: 'CF',
    description: 'Publish resolved incident PIRs to Confluence. Sync IT knowledge base articles.' },
  { id: 'ms-teams',   name: 'Microsoft Teams', category: 'Communication', status: 'NOT_CONNECTED', color: '#464EB8', logo: 'MT',
    description: 'Incident notifications and approval requests via Teams adaptive cards.' },
  { id: 'servicenow', name: 'ServiceNow',      category: 'ITSM',          status: 'NOT_CONNECTED', color: '#81B5A1', logo: 'SN',
    description: 'Read-only import: sync legacy ServiceNow incidents into KIMMP intelligence layer.' },
  { id: 'grafana',    name: 'Grafana',         category: 'Monitoring',    status: 'NOT_CONNECTED', color: '#F46800', logo: 'GF',
    description: 'Grafana alert rules create incidents. Embed dashboards in the incident detail panel.' },
]

const CATEGORIES = ['All', ...Array.from(new Set(INTEGRATIONS.map(i => i.category)))]

const S_COLOR: Record<IntStatus, string> = {
  CONNECTED:     '#10B981',
  NOT_CONNECTED: 'var(--os-text-2)',
  ERROR:         '#EF4444',
}

export function ITIntegrations() {
  const [cat, setCat] = useState('All')
  const [statuses, setStatuses] = useState<Record<string, IntStatus>>(
    Object.fromEntries(INTEGRATIONS.map(i => [i.id, i.status]))
  )

  const visible = INTEGRATIONS.filter(i => cat === 'All' || i.category === cat)

  function toggle(id: string) {
    setStatuses(prev => ({
      ...prev,
      [id]: prev[id] === 'CONNECTED' ? 'NOT_CONNECTED' : 'CONNECTED',
    }))
  }

  const connected = Object.values(statuses).filter(s => s === 'CONNECTED').length
  const errors    = Object.values(statuses).filter(s => s === 'ERROR').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <PlugZap className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Integrations</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">
            Connect IT Ops to your monitoring, DevOps, ITSM, and communication stack.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Connected',  value: connected.toString(),                     color: '#10B981' },
          { label: 'Available',  value: (INTEGRATIONS.length - connected).toString(), color: 'var(--os-text-2)' },
          { label: 'Auth Error', value: errors.toString(),                        color: errors > 0 ? '#EF4444' : 'var(--os-text-2)' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              cat === c ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visible.map(intg => {
          const status = statuses[intg.id]
          const StatusIcon = status === 'CONNECTED' ? CheckCircle2 : status === 'ERROR' ? XCircle : MinusCircle
          return (
            <div
              key={intg.id}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Logo */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: intg.color }}
                >
                  {intg.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-white">{intg.name}</p>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1"
                      style={{ background: `${S_COLOR[status]}22`, color: S_COLOR[status] }}
                    >
                      <StatusIcon className="w-2.5 h-2.5" />
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--os-text-2)] mb-1">{intg.category}</p>
                  <p className="text-xs text-[var(--os-text-2)] leading-relaxed">{intg.description}</p>
                  {status === 'CONNECTED' && intg.lastSync && (
                    <p className="text-xs text-[var(--os-text-2)] mt-1">Last sync: {intg.lastSync}</p>
                  )}
                  {status === 'ERROR' && (
                    <p className="text-xs text-red-400 mt-1">Auth token expired — reconnect to resume sync.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => toggle(intg.id)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    status === 'CONNECTED'
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'text-white hover:opacity-90'
                  }`}
                  style={status !== 'CONNECTED' ? { background: intg.color } : undefined}
                >
                  {status === 'CONNECTED' ? 'Disconnect' : status === 'ERROR' ? 'Reconnect' : 'Connect'}
                </button>
                {status === 'CONNECTED' && (
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--os-text-2)] bg-slate-800/60 border border-white/10 hover:text-[var(--os-text-1)] transition-colors">
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
