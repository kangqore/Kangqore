import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Circle, Settings, AlertCircle, ExternalLink, Zap, X, Plus, Trash2, RefreshCw, ArrowLeftRight } from 'lucide-react'
import { api } from '@lib/api'

type ConnectorStatus = 'active' | 'setup' | 'available'
type ConnectorTier = 1 | 2
type SyncDirection = 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL'

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

interface FieldMapping {
  sourceField: string
  targetField: string
  transform: 'PASSTHROUGH' | 'UPPERCASE' | 'LOWERCASE' | 'TRIM' | 'PARSE_DATE'
}

const KANGQORE_FIELDS = [
  'contact.name', 'contact.email', 'contact.phone', 'contact.company',
  'deal.name', 'deal.amount', 'deal.stage', 'deal.closeDate',
  'project.name', 'project.status', 'project.owner',
  'signal.value', 'signal.severity', 'signal.source',
  'person.name', 'person.role', 'person.department',
]

const PLATFORM_SOURCE_FIELDS: Record<string, string[]> = {
  salesforce: ['Name', 'Email', 'Phone', 'Account.Name', 'Opportunity.Name', 'Opportunity.Amount', 'Opportunity.StageName', 'Opportunity.CloseDate'],
  jira:       ['summary', 'description', 'status', 'priority', 'assignee.displayName', 'reporter.displayName', 'project.name', 'issuetype.name'],
  github:     ['title', 'body', 'state', 'user.login', 'repository.full_name', 'labels', 'merged_at'],
  slack:      ['text', 'user', 'channel', 'ts', 'thread_ts'],
  hubspot:    ['properties.firstname', 'properties.lastname', 'properties.email', 'properties.company', 'properties.dealname', 'properties.amount'],
  m365:       ['subject', 'from.emailAddress.address', 'body.content', 'createdDateTime'],
  workday:    ['worker.name', 'worker.email', 'worker.department', 'position.title', 'hireDate'],
  servicenow: ['short_description', 'state', 'priority', 'assigned_to.name', 'category', 'sys_created_on'],
  default:    ['id', 'name', 'email', 'status', 'created_at', 'updated_at'],
}

const WEBHOOK_EVENTS: Record<string, string[]> = {
  salesforce: ['account.created', 'opportunity.stagechange', 'contact.updated', 'deal.lost', 'deal.won'],
  jira:       ['issue.created', 'issue.updated', 'issue.comment', 'sprint.started', 'sprint.closed'],
  github:     ['push', 'pull_request.opened', 'pull_request.merged', 'issues.opened'],
  slack:      ['message', 'channel.created', 'reaction_added'],
  hubspot:    ['contact.creation', 'deal.creation', 'deal.stageChange'],
  default:    ['created', 'updated', 'deleted'],
}

const connectors: Connector[] = [
  { id: 'servicenow', name: 'ServiceNow',         category: 'ITSM',                description: 'Incident, Problem, Change, CMDB — bi-directional. KIMMP writes insights back as ServiceNow KB articles.', status: 'active',    tier: 1, signalsToday: 312, lastSync: '2m ago',  logoColor: '#81B5A1', logoText: 'SN', kimmpWeight: 'high' },
  { id: 'jira',       name: 'Jira / Azure DevOps', category: 'Engineering',          description: 'Sprint velocity, defect rate, release risk, open issue count by severity.',                               status: 'active',    tier: 1, signalsToday: 847, lastSync: '1m ago',  logoColor: '#0052CC', logoText: 'JR', kimmpWeight: 'high' },
  { id: 'salesforce', name: 'Salesforce / HubSpot', category: 'CRM',                description: 'Pipeline velocity, deal stage changes, churn signals, contract renewal proximity.',                        status: 'active',    tier: 1, signalsToday: 688, lastSync: '5m ago',  logoColor: '#00A1E0', logoText: 'SF', kimmpWeight: 'high' },
  { id: 'm365',       name: 'Microsoft 365',        category: 'Collaboration',       description: 'Teams, Outlook, SharePoint — meeting patterns, escalation signals (opt-in), document activity.',          status: 'setup',     tier: 1, logoColor: '#0078D4', logoText: 'M3', kimmpWeight: 'medium' },
  { id: 'workday',    name: 'Workday',               category: 'HR',                 description: 'Headcount changes, attrition rate, hiring velocity, capacity signals.',                                    status: 'setup',     tier: 1, logoColor: '#F5A623', logoText: 'WD', kimmpWeight: 'medium' },
  { id: 'github',     name: 'GitHub / GitLab',       category: 'Engineering',        description: 'PR merge rate, review lag, deploy frequency, DORA metrics.',                                               status: 'available', tier: 1, logoColor: '#6E40C9', logoText: 'GH', kimmpWeight: 'medium' },
  { id: 'slack',      name: 'Slack',                 category: 'Collaboration',      description: 'Escalation pattern detection, sentiment signals, response time in key channels (opt-in).',                 status: 'available', tier: 1, logoColor: '#4A154B', logoText: 'SL', kimmpWeight: 'low' },
  { id: 'stripe',     name: 'Stripe / Zuora',        category: 'Finance',            description: 'AR aging, payment failures, MRR movements, subscription changes.',                                         status: 'available', tier: 1, logoColor: '#635BFF', logoText: 'ST', kimmpWeight: 'high' },
  { id: 'sap',        name: 'SAP / Oracle',           category: 'ERP',               description: 'Budget variance, AP/AR, cash position, procurement signals (read-only event stream).',                    status: 'available', tier: 1, logoColor: '#0070F2', logoText: 'SP', kimmpWeight: 'high' },
  { id: 'epic',       name: 'Epic / Cerner',          category: 'Healthcare',        description: 'Patient volume, utilisation rates, compliance signals — healthcare vertical.',                              status: 'available', tier: 2, logoColor: '#E31B23', logoText: 'EP', kimmpWeight: 'high' },
  { id: 'bloomberg',  name: 'Bloomberg Terminal',     category: 'Financial Services', description: 'Market signals, rate movements, sector intelligence for financial services clients.',                      status: 'available', tier: 2, logoColor: '#FF6A00', logoText: 'BL', kimmpWeight: 'high' },
  { id: 'veeva',      name: 'Veeva',                  category: 'Pharma',            description: 'Clinical, commercial, and regulatory signals for pharma and life sciences.',                               status: 'available', tier: 2, logoColor: '#F35F22', logoText: 'VV', kimmpWeight: 'medium' },
]

const STATUS_CONFIG: Record<ConnectorStatus, { label: string; color: string; icon: React.ReactNode }> = {
  active:    { label: 'Active',    color: '#10B981', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  setup:     { label: 'In Setup',  color: '#F59E0B', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  available: { label: 'Available', color: 'var(--os-text-2)', icon: <Circle className="w-3.5 h-3.5" /> },
}

const WEIGHT_COLOR: Record<string, string> = { high: '#e2445c', medium: '#fdab3d', low: '#6B7280' }

type FilterTab = 'all' | 'active' | 'setup' | 'available'

export function ConnectorsPage() {
  const [filter, setFilter]       = useState<FilterTab>('all')
  const [drawerConnector, setDrawerConnector] = useState<Connector | null>(null)

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
            {tier1.map(c => <ConnectorCard key={c.id} c={c} onConfigure={() => setDrawerConnector(c)} />)}
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
            {tier2.map(c => <ConnectorCard key={c.id} c={c} onConfigure={() => setDrawerConnector(c)} />)}
          </div>
        </section>
      )}

      {/* Field mapper drawer */}
      {drawerConnector && (
        <FieldMapperDrawer connector={drawerConnector} onClose={() => setDrawerConnector(null)} />
      )}
    </div>
  )
}

// ── Connector card ────────────────────────────────────────────────────────────

function ConnectorCard({ c, onConfigure }: { c: Connector; onConfigure: () => void }) {
  const cfg = STATUS_CONFIG[c.status]

  return (
    <div className={`p-5 rounded-2xl border bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 transition-all hover:border-[var(--os-border)] ${c.status === 'active' ? 'border-white/15' : 'border-[var(--os-border)]'}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ background: `${c.logoColor}25`, border: `1px solid ${c.logoColor}40` }}>
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
        <button
          onClick={onConfigure}
          className="flex items-center gap-1 text-[10px] font-bold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
        >
          {c.status === 'active' ? <><Settings className="w-3 h-3" />Configure</> : <><ExternalLink className="w-3 h-3" />Setup</>}
        </button>
      </div>
    </div>
  )
}

// ── Field mapper drawer ───────────────────────────────────────────────────────

function FieldMapperDrawer({ connector, onClose }: { connector: Connector; onClose: () => void }) {
  const qc = useQueryClient()
  const [syncDirection, setSyncDirection] = useState<SyncDirection>('BIDIRECTIONAL')
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([
    { sourceField: '', targetField: '', transform: 'PASSTHROUGH' },
  ])
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [syncStatus, setSyncStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const [syncing, setSyncing] = useState(false)

  const platformId = connector.id

  const { data: existingMap } = useQuery<any>({
    queryKey: ['connector-field-map', platformId],
    queryFn: () => api.get('/admin/kangqore-immp/connectors/field-maps').then(r => {
      const found = (r.data.maps ?? []).find((m: any) => m.platform === platformId)
      if (found) {
        setSyncDirection(found.syncDirection ?? 'BIDIRECTIONAL')
        if (found.fieldMaps?.mappings?.length) setFieldMappings(found.fieldMaps.mappings)
        if (found.webhookEvents?.length) setSelectedEvents(found.webhookEvents)
      }
      return found ?? null
    }),
    staleTime: 30_000,
  })

  const saveMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/connectors/field-maps', {
      platform:      platformId,
      syncDirection,
      fieldMaps:     { mappings: fieldMappings.filter(m => m.sourceField && m.targetField) },
      webhookEvents: selectedEvents,
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['connector-field-map', platformId] }),
  })

  async function triggerSync() {
    setSyncing(true); setSyncStatus('idle')
    try {
      await api.post(`/admin/kangqore-immp/connectors/${platformId}/sync`, {})
      setSyncStatus('ok')
    } catch {
      setSyncStatus('err')
    } finally {
      setSyncing(false)
    }
  }

  const sourceFields   = PLATFORM_SOURCE_FIELDS[platformId] ?? PLATFORM_SOURCE_FIELDS.default
  const webhookOptions = WEBHOOK_EVENTS[platformId]          ?? WEBHOOK_EVENTS.default

  function addRow() {
    setFieldMappings(prev => [...prev, { sourceField: '', targetField: '', transform: 'PASSTHROUGH' }])
  }

  function removeRow(i: number) {
    setFieldMappings(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateRow(i: number, key: keyof FieldMapping, value: string) {
    setFieldMappings(prev => prev.map((row, idx) => idx === i ? { ...row, [key]: value } : row))
  }

  function toggleEvent(ev: string) {
    setSelectedEvents(prev => prev.includes(ev) ? prev.filter(e => e !== ev) : [...prev, ev])
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="flex flex-col w-full max-w-xl bg-[var(--os-card)] border-l border-[var(--os-border)] overflow-y-auto"
        style={{ boxShadow: '-8px 0 32px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--os-border)] sticky top-0 bg-[var(--os-card)] z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
              style={{ background: `${connector.logoColor}25`, border: `1px solid ${connector.logoColor}40` }}>
              {connector.logoText}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{connector.name} · Field Mapper</p>
              <p className="text-[11px]" style={{ color: 'var(--os-text-2)' }}>Map platform fields → Kangqore entities</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-2xl hover:bg-slate-700 transition-colors">
            <X className="w-4 h-4" style={{ color: 'var(--os-text-2)' }} />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">
          {/* Sync direction */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--os-text-2)' }}>Sync Direction</p>
            <div className="flex gap-2">
              {(['INBOUND', 'BIDIRECTIONAL', 'OUTBOUND'] as SyncDirection[]).map(dir => (
                <button
                  key={dir}
                  onClick={() => setSyncDirection(dir)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all"
                  style={{
                    background: syncDirection === dir ? 'rgba(37,100,234,0.15)' : 'var(--os-surface-0)',
                    color:      syncDirection === dir ? '#2564ea' : 'var(--os-text-2)',
                    border:     `1px solid ${syncDirection === dir ? 'rgba(37,100,234,0.3)' : 'var(--os-border)'}`,
                  }}
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  {dir === 'INBOUND' ? '← Inbound' : dir === 'OUTBOUND' ? '→ Outbound' : '⇄ Bidirectional'}
                </button>
              ))}
            </div>
          </div>

          {/* Field mappings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-text-2)' }}>Field Mappings</p>
              <button
                onClick={addRow}
                className="flex items-center gap-1 text-xs font-medium"
                style={{ color: '#2564ea' }}
              >
                <Plus className="w-3 h-3" /> Add row
              </button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 text-[9px] font-bold uppercase tracking-wider px-1" style={{ color: 'var(--os-text-2)' }}>
                <span>Source ({connector.name})</span>
                <span>Target (Kangqore)</span>
                <span>Transform</span>
                <span />
              </div>
              {fieldMappings.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                  <select
                    value={row.sourceField}
                    onChange={e => updateRow(i, 'sourceField', e.target.value)}
                    className="px-2 py-1.5 rounded-2xl text-xs border"
                    style={{ background: 'var(--os-surface-0)', borderColor: 'var(--os-border)', color: 'var(--os-text-1)' }}
                  >
                    <option value="">— source —</option>
                    {sourceFields.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <select
                    value={row.targetField}
                    onChange={e => updateRow(i, 'targetField', e.target.value)}
                    className="px-2 py-1.5 rounded-2xl text-xs border"
                    style={{ background: 'var(--os-surface-0)', borderColor: 'var(--os-border)', color: 'var(--os-text-1)' }}
                  >
                    <option value="">— target —</option>
                    {KANGQORE_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <select
                    value={row.transform}
                    onChange={e => updateRow(i, 'transform', e.target.value)}
                    className="px-2 py-1.5 rounded-2xl text-xs border"
                    style={{ background: 'var(--os-surface-0)', borderColor: 'var(--os-border)', color: 'var(--os-text-1)' }}
                  >
                    {['PASSTHROUGH', 'UPPERCASE', 'LOWERCASE', 'TRIM', 'PARSE_DATE'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeRow(i)}
                    className="p-1.5 rounded-2xl transition-colors hover:bg-red-500/10"
                    style={{ color: 'var(--os-text-2)' }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Webhook events */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--os-text-2)' }}>Webhook Events → KIMMP Signals</p>
            <div className="flex flex-wrap gap-2">
              {webhookOptions.map(ev => (
                <button
                  key={ev}
                  onClick={() => toggleEvent(ev)}
                  className="px-2.5 py-1 rounded-2xl text-[11px] font-medium transition-all"
                  style={{
                    background: selectedEvents.includes(ev) ? 'rgba(37,100,234,0.15)' : 'var(--os-surface-0)',
                    color:      selectedEvents.includes(ev) ? '#2564ea' : 'var(--os-text-2)',
                    border:     `1px solid ${selectedEvents.includes(ev) ? 'rgba(37,100,234,0.3)' : 'var(--os-border)'}`,
                  }}
                >
                  {ev}
                </button>
              ))}
            </div>
            {selectedEvents.length > 0 && (
              <p className="text-[11px] mt-1.5" style={{ color: 'var(--os-text-2)' }}>
                {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''} will generate KIMMP signals on inbound webhook calls.
              </p>
            )}
          </div>

          {/* Existing map info */}
          {existingMap && (
            <div className="rounded-2xl p-3 border" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
              <p className="text-[11px] font-medium" style={{ color: '#10b981' }}>
                Active field map — last saved {new Date(existingMap.updatedAt ?? existingMap.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 border-t border-[var(--os-border)] bg-[var(--os-card)] flex items-center gap-3">
          <button
            onClick={() => saveMut.mutate()}
            disabled={saveMut.isPending}
            className="flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all"
            style={{
              background: saveMut.isPending ? 'rgba(37,100,234,0.3)' : '#2564ea',
              color: '#fff',
              opacity: saveMut.isPending ? 0.7 : 1,
            }}
          >
            {saveMut.isPending ? 'Saving…' : saveMut.isSuccess ? '✓ Saved' : 'Save Field Map'}
          </button>
          <button
            onClick={triggerSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all"
            style={{
              background: 'rgba(16,185,129,0.1)',
              color: '#10b981',
              opacity: syncing ? 0.7 : 1,
            }}
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing…' : 'Sync Now'}
          </button>
          {syncStatus === 'ok' && <span className="text-xs" style={{ color: '#10b981' }}>Sync triggered</span>}
          {syncStatus === 'err' && <span className="text-xs" style={{ color: '#f43f5e' }}>Sync failed</span>}
        </div>
      </div>
    </div>
  )
}
