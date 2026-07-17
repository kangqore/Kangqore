import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Package, CheckCircle2, Clock, Download, RefreshCw, Layers, Brain, TrendingUp, DollarSign } from 'lucide-react'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'
import { WaandaExperienceEngine, WaandaCognitiveMirror } from '../../../runtime/wee'
import type { ExperienceContract, ExperienceModel } from '../../../runtime/wee'
import { useEffect } from 'react'

// ─── Live department health from WEE ─────────────────────────────────────────

const DEPT_CONTRACTS: { id: string; label: string; scope: ExperienceContract['projectionScope']; icon: React.FC<{size?:number}>; color: string; since: string }[] = [
  { id: 'projects', label: 'Projects & Delivery',  scope: 'OPERATIONS', icon: ({size}) => <Layers size={size??16} />,     color: '#10b981', since: 'S10-C' },
  { id: 'finance',  label: 'Finance & Budget',      scope: 'FINANCE',    icon: ({size}) => <DollarSign size={size??16} />, color: '#2564ea', since: 'S12'   },
  { id: 'sales',    label: 'Sales & Leads',         scope: 'REVENUE',    icon: ({size}) => <TrendingUp size={size??16} />, color: '#7c3aed', since: 'S13'   },
]

function useDeptProjection(scope: ExperienceContract['projectionScope'], workspaceId: string): ExperienceModel | null {
  const [model, setModel] = useState<ExperienceModel | null>(null)
  useEffect(() => {
    let cancelled = false
    const contract: ExperienceContract = {
      id: `ps-pack-${workspaceId}`, projectionScope: scope,
      persona: 'EXECUTIVE', requiredCapabilities: [],
      context: { workspaceId },
    }
    async function project() {
      const m = await WaandaExperienceEngine.project(contract)
      if (!cancelled) setModel(m)
    }
    void project()
    const unsub = WaandaCognitiveMirror.subscribe(() => { void project() })
    return () => { cancelled = true; unsub() }
  }, [scope, workspaceId])
  return model
}

// ─── Dept card ────────────────────────────────────────────────────────────────

function DeptCard({ dept }: { dept: typeof DEPT_CONTRACTS[number] }) {
  const model = useDeptProjection(dept.scope, dept.id)
  const payload = model?.payload as Record<string, any> ?? {}
  const conf = model ? Math.round(model.confidence * 100) : 0

  const stats: { label: string; value: string | number }[] = []
  if (dept.id === 'projects') {
    stats.push(
      { label: 'Projects',  value: (payload.projectCount ?? 0) },
      { label: 'On Track',  value: (payload.onTrackCount  ?? 0) },
      { label: 'At Risk',   value: (payload.atRiskCount   ?? 0) },
      { label: 'Workflows', value: (payload.workflowStats?.total ?? 0) },
    )
  } else if (dept.id === 'finance') {
    stats.push(
      { label: 'Revenue MTD',   value: payload.revenueMTD   ?? '—' },
      { label: 'Budget Burn',   value: payload.burnPct != null ? `${payload.burnPct}%` : '—' },
      { label: 'Overdue',       value: payload.overdueInvoices ?? 0 },
      { label: 'Cash Health',   value: payload.cashHealthScore != null ? `${payload.cashHealthScore}%` : '—' },
    )
  } else if (dept.id === 'sales') {
    stats.push(
      { label: 'New Leads',  value: payload.newLeadsCount      ?? 0 },
      { label: 'Active',     value: payload.inProgressLeadsCount ?? 0 },
      { label: 'Pipeline',   value: payload.pipelineTotalValue  ?? '—' },
      { label: 'Contracts',  value: payload.activeContracts      ?? 0 },
    )
  }

  return (
    <div style={{ background: dept.color + '0a', border: `1.5px solid ${dept.color}25`, borderRadius: 14, padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: dept.color + '20', color: dept.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <dept.icon size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--os-text-1)' }}>{dept.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: '#10b98118', padding: '1px 7px', borderRadius: 20 }}>
              ✓ WEE Live since {dept.since}
            </span>
            {model && (
              <span style={{ fontSize: 10, color: 'var(--os-text-2)' }}>
                {conf}% confidence
              </span>
            )}
          </div>
        </div>
        {!model && <Spinner size="sm" />}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--os-card)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-2)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {model?.payload.kimmSynthesis && (
        <div style={{ marginTop: 12, padding: '8px 12px', background: dept.color + '10', borderRadius: 8, fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.5 }}>
          <Brain size={10} style={{ display: 'inline', marginRight: 5, color: dept.color }} />
          {(model.payload.kimmSynthesis as string).slice(0, 140)}…
        </div>
      )}
    </div>
  )
}

// ─── Pack contents ────────────────────────────────────────────────────────────

interface PackHealth {
  workflows: number
  agents: number
  goals: number
  kpis: number
  policies: number
  blueprintVersion: string
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function PSPackExtractionPage() {
  const [extracting, setExtracting] = useState(false)
  const [lastExtracted, setLastExtracted] = useState<string | null>(null)

  // Pull pack health from existing blueprint endpoint
  const { data: blueprintData, isLoading } = useQuery({
    queryKey: ['blueprints-list'],
    queryFn: () => api.get('/admin/enterprise/blueprints').then(r => r.data),
    staleTime: 30_000,
  })

  const blueprints: any[] = blueprintData?.blueprints ?? []
  const activeBlueprint = blueprints.find(b => b.status === 'ACTIVE') ?? blueprints[0] ?? null

  const packHealth: PackHealth = {
    workflows:        activeBlueprint?.metadata?.workflowCount ?? 17,
    agents:           activeBlueprint?.metadata?.agentCount    ?? 80,
    goals:            activeBlueprint?.metadata?.goalCount     ?? 5,
    kpis:             activeBlueprint?.metadata?.kpiCount      ?? 12,
    policies:         activeBlueprint?.metadata?.policyCount   ?? 8,
    blueprintVersion: activeBlueprint?.version ?? '1.0.0',
  }

  async function extractPack() {
    setExtracting(true)
    try {
      // Generate an updated blueprint from current live state
      const res = await api.post('/admin/enterprise/blueprints/generate', {
        pack: 'professional-services',
        label: `PS Pack v${packHealth.blueprintVersion} — extracted ${new Date().toISOString().slice(0, 10)}`,
        departments: ['projects', 'finance', 'sales'],
        source: 'live-operations',
      })
      setLastExtracted(new Date().toISOString())
      // Download the generated blueprint as JSON
      const blob = new Blob([JSON.stringify(res.data?.blueprint ?? res.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ps-pack-blueprint-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExtracting(false)
    }
  }

  const PACK_METRICS = [
    { label: 'Workflows',       value: packHealth.workflows,  color: '#2564ea', icon: RefreshCw },
    { label: 'WAANDA Agents',   value: packHealth.agents,     color: '#7c3aed', icon: Brain     },
    { label: 'Enterprise Goals',value: packHealth.goals,      color: '#10b981', icon: CheckCircle2 },
    { label: 'KPI Definitions', value: packHealth.kpis,       color: '#f59e0b', icon: TrendingUp },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 20, borderBottom: '1px solid var(--os-border)' }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #2564ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
          <Package size={16} style={{ color: '#fff' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--os-text-1)' }}>Professional Services Pack™ — Extraction</div>
          <div style={{ fontSize: 12, color: 'var(--os-text-2)', marginTop: 2 }}>
            Distilled from 3 live departments. The pack is what Kangqore runs — not what was designed.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {lastExtracted && (
            <span style={{ fontSize: 10, color: 'var(--os-text-2)' }}>
              Last extracted {new Date(lastExtracted).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </span>
          )}
          <button
            onClick={extractPack}
            disabled={extracting}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 99,
              fontSize: 12, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #10b981, #2564ea)',
              boxShadow: '0 6px 18px rgba(16,185,129,0.35)',
              opacity: extracting ? 0.6 : 1,
            }}
          >
            {extracting ? <Spinner size="sm" /> : <Download size={13} />}
            {extracting ? 'Extracting…' : 'Extract PS Pack'}
          </button>
        </div>
      </div>

      {/* Extraction loop diagram */}
      <div style={{ background: 'var(--os-card)', borderRadius: 14, padding: '18px 24px', boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 14 }}>
          Continuous Distillation Loop
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
          {[
            { label: 'Run Kangqore Global', color: '#2564ea', done: true },
            { label: 'Measure COIG', color: '#7c3aed', done: true },
            { label: 'Improve WAANDA', color: '#10b981', done: true },
            { label: 'Distill PS Pack', color: '#f59e0b', done: false },
            { label: 'Deploy to Customer', color: '#10b981', done: false },
            { label: 'Learn Again', color: '#2564ea', done: false },
          ].map((step, i) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '0 8px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step.done ? step.color : step.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {step.done ? <CheckCircle2 size={14} style={{ color: '#fff' }} /> : <Clock size={14} style={{ color: step.color }} />}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: step.done ? step.color : 'var(--os-text-2)', textAlign: 'center', width: 70, whiteSpace: 'normal' }}>
                  {step.label}
                </span>
              </div>
              {i < 5 && <div style={{ width: 24, height: 1, background: 'var(--os-border)', flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Department live feeds */}
      <div>
        <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 14 }}>
          Live Department Feeds (via WEE)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {DEPT_CONTRACTS.map(dept => <DeptCard key={dept.id} dept={dept} />)}
        </div>
      </div>

      {/* Pack contents */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)' }}>
            Pack Contents — v{packHealth.blueprintVersion}
          </h3>
          {isLoading && <Spinner size="sm" />}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {PACK_METRICS.map(m => {
            const Icon = m.icon
            return (
              <div key={m.label} style={{ background: m.color + '0d', border: `1px solid ${m.color}22`, borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ color: m.color, marginBottom: 10 }}><Icon size={18} /></div>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-2)', marginTop: 6 }}>{m.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Blueprint active status */}
      <div style={{ background: 'var(--os-card)', borderRadius: 14, padding: '18px 24px', boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', marginBottom: 4 }}>
              {activeBlueprint?.label ?? 'Professional Services Pack — Kangqore Internal'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--os-text-2)' }}>
              blueprint.json · schema: kangqore-view/v1 · departments: Delivery, Finance, Sales, Operations
            </div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: '#10b98118', padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>
            {activeBlueprint?.status ?? 'ACTIVE'}
          </span>
        </div>
        {activeBlueprint?.description && (
          <p style={{ fontSize: 12, color: 'var(--os-text-2)', marginTop: 10, lineHeight: 1.6 }}>
            {activeBlueprint.description}
          </p>
        )}
      </div>
    </div>
  )
}
