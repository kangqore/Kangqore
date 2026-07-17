import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@lib/api'
import {
  Package, ChevronRight, Check, Sparkles, Building2,
  Target, Shield, Users, TrendingUp, Globe2, AlertCircle, Loader2,
} from 'lucide-react'

const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const TEAL   = '#0d9488'
const GOLD   = '#fbbf24'
const SLATE  = '#6b7280'

interface PSPack {
  id: string; name: string; version: string; industry: string; description: string
  kpis:     Array<{ id: string; name: string; unit: string; target: number; pillar: string }>
  goals:    Array<{ id: string; title: string; pillar: string; horizon: string }>
  policies: Array<{ id: string; title: string; domain: string; enforcement: string }>
  agents:   Array<{ id: string; name: string; role: string }>
  oisProfile: { pillars: Record<string, { weight: number; description: string }>; day0Target: number; day90Target: number }
  coig:     { baselineMonthly: number; targetMonthly: number; drivers: string[] }
}

interface CustomerDeployment {
  id: string; customerName: string; milestone: string; pack: string; industry: string
  currentOis: number; contactName?: string; contactEmail?: string
}

type WizardStep = 'select-pack' | 'select-customer' | 'configure' | 'preview' | 'activate'

const STEPS: { key: WizardStep; label: string; icon: React.ElementType }[] = [
  { key: 'select-pack',     label: 'Choose Pack',    icon: Package       },
  { key: 'select-customer', label: 'Choose Customer',icon: Building2     },
  { key: 'configure',       label: 'Configure',      icon: Target        },
  { key: 'preview',         label: 'Preview',        icon: Sparkles      },
  { key: 'activate',        label: 'Activate',       icon: Globe2        },
]

function StepBar({ current }: { current: WizardStep }) {
  const ci = STEPS.findIndex(s => s.key === current)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
      {STEPS.map((s, i) => {
        const done    = i < ci
        const active  = i === ci
        const Icon    = s.icon
        const col     = done ? GREEN : active ? BLUE : SLATE
        return (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? GREEN : active ? BLUE : 'var(--os-surface-3)',
                border: `2px solid ${col}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done
                  ? <Check style={{ width: 14, height: 14, color: '#fff' }} />
                  : <Icon style={{ width: 14, height: 14, color: active ? '#fff' : SLATE }} />}
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: col, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < ci ? GREEN : 'var(--os-border)', margin: '0 8px', marginBottom: 20 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8, background: color + '14', color, border: `1px solid ${color}28` }}>
      {label}
    </span>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: SLATE, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}

export function BlueprintCustomizePage() {
  const qc = useQueryClient()
  const [step, setStep]       = useState<WizardStep>('select-pack')
  const [packId, setPackId]   = useState<string | null>(null)
  const [custId, setCustId]   = useState<string | null>(null)
  const [config, setConfig]   = useState({
    enabledKpis:     [] as string[],
    enabledGoals:    [] as string[],
    enabledPolicies: [] as string[],
    enabledAgents:   [] as string[],
    customOisDay0:   62,
  })
  const [activated, setActivated] = useState(false)

  const { data: packs, isLoading: packsLoading } = useQuery<{ packs: any[] }>({
    queryKey: ['enterprise-packs'],
    queryFn:  () => adminApi('/admin/enterprise/packs'),
  })

  const { data: pack } = useQuery<PSPack>({
    queryKey: ['enterprise-pack', packId],
    queryFn:  () => adminApi(`/admin/enterprise/packs/${packId}`),
    enabled:  !!packId,
  })

  const { data: deployments = [] } = useQuery<CustomerDeployment[]>({
    queryKey: ['customer-deployments'],
    queryFn:  () => adminApi('/admin/enterprise/customer-deployments'),
  })

  const activateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi(`/admin/enterprise/customer-deployments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-deployments'] })
      setActivated(true)
    },
  })

  const customer = deployments.find(d => d.id === custId)

  function selectPack(id: string) {
    setPackId(id)
    setStep('select-customer')
  }

  function selectCustomer(id: string) {
    setCustId(id)
    // pre-populate all items from pack
    if (pack) {
      setConfig({
        enabledKpis:     pack.kpis.map(k => k.id),
        enabledGoals:    pack.goals.map(g => g.id),
        enabledPolicies: pack.policies.map(p => p.id),
        enabledAgents:   pack.agents.map(a => a.id),
        customOisDay0:   pack.oisProfile.day0Target,
      })
    }
    setStep('configure')
  }

  function toggleItem(key: keyof typeof config, id: string) {
    setConfig(c => {
      const arr = c[key] as string[]
      return { ...c, [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] }
    })
  }

  function doActivate() {
    if (!custId) return
    activateMut.mutate({
      id: custId,
      data: {
        milestone:  'LIVE',
        currentOis: config.customOisDay0,
        pack:       packId ?? 'professional-services',
        notes:      `Blueprint activated via ${pack?.name ?? packId} · ${config.enabledKpis.length} KPIs · ${config.enabledGoals.length} goals · ${config.enabledAgents.length} agents · Day 0 OIS: ${config.customOisDay0}`,
      },
    })
  }

  // ─── Step: select pack ────────────────────────────────────────────────────

  if (step === 'select-pack') return (
    <div>
      <StepBar current="select-pack" />
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Choose an Industry Pack</h2>
        <p style={{ fontSize: 11, color: SLATE, margin: '5px 0 0' }}>Packs contain pre-extracted ontology, KPIs, goals, policies and agent configs. Choose one to start customising your customer Blueprint.</p>
      </div>
      {packsLoading && <div style={{ fontSize: 12, color: SLATE }}>Loading packs…</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {(packs?.packs ?? []).map((p: any) => (
          <button key={p.id} onClick={() => selectPack(p.id)} style={{
            background: 'var(--os-card)', border: `1px solid ${BLUE}30`, borderRadius: 14, padding: '20px 22px',
            cursor: 'pointer', textAlign: 'left',
            transition: 'box-shadow 0.18s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${BLUE}18` }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: BLUE + '14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package style={{ width: 18, height: 18, color: BLUE }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)' }}>{p.name}</div>
                <div style={{ fontSize: 9, color: SLATE }}>v{p.version} · {p.industry}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <PillBadge label={`${p.kpis} KPIs`} color={TEAL} />
              <PillBadge label={`${p.goals} Goals`} color={PURPLE} />
              <PillBadge label={`${p.agents} Agents`} color={BLUE} />
              <PillBadge label={`${p.policies} Policies`} color={AMBER} />
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: BLUE }}>
              Select Pack <ChevronRight style={{ width: 12, height: 12 }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // ─── Step: select customer ────────────────────────────────────────────────

  if (step === 'select-customer') return (
    <div>
      <StepBar current="select-customer" />
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Choose Customer</h2>
        <p style={{ fontSize: 11, color: SLATE, margin: '5px 0 0' }}>Select which customer deployment this Blueprint customisation is for. Only ONBOARDING customers can be activated.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {deployments.map(d => {
          const canActivate = d.milestone === 'ONBOARDING'
          return (
            <button key={d.id} onClick={() => canActivate ? selectCustomer(d.id) : undefined} style={{
              background: 'var(--os-card)', border: `1px solid ${canActivate ? AMBER + '40' : 'var(--os-border)'}`,
              borderRadius: 12, padding: '14px 16px', cursor: canActivate ? 'pointer' : 'not-allowed',
              textAlign: 'left', opacity: canActivate ? 1 : 0.55,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: canActivate ? AMBER + '14' : 'var(--os-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: canActivate ? AMBER : SLATE, flexShrink: 0 }}>
                {d.customerName.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)' }}>{d.customerName}</div>
                <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>{d.industry} · {d.pack}</div>
              </div>
              <PillBadge
                label={d.milestone}
                color={d.milestone === 'ONBOARDING' ? AMBER : d.milestone === 'LIVE' ? GREEN : SLATE}
              />
              {canActivate && <ChevronRight style={{ width: 14, height: 14, color: AMBER }} />}
            </button>
          )
        })}
      </div>
    </div>
  )

  // ─── Step: configure ──────────────────────────────────────────────────────

  if (step === 'configure' && pack) return (
    <div>
      <StepBar current="configure" />
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Configure Blueprint</h2>
        <p style={{ fontSize: 11, color: SLATE, margin: '5px 0 0' }}>
          Customising {customer?.customerName ?? 'customer'} with <strong>{pack.name}</strong>. Enable/disable items for this deployment.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* KPIs */}
        <Section title={`KPIs — ${config.enabledKpis.length}/${pack.kpis.length} enabled`}>
          {pack.kpis.map(k => (
            <label key={k.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--os-border)', cursor: 'pointer' }}>
              <input type="checkbox" checked={config.enabledKpis.includes(k.id)} onChange={() => toggleItem('enabledKpis', k.id)} style={{ accentColor: TEAL }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)' }}>{k.name}</div>
                <div style={{ fontSize: 9, color: SLATE }}>Target: {k.target}{k.unit} · {k.pillar}</div>
              </div>
            </label>
          ))}
        </Section>

        {/* Goals */}
        <Section title={`Goals — ${config.enabledGoals.length}/${pack.goals.length} enabled`}>
          {pack.goals.map(g => (
            <label key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--os-border)', cursor: 'pointer' }}>
              <input type="checkbox" checked={config.enabledGoals.includes(g.id)} onChange={() => toggleItem('enabledGoals', g.id)} style={{ accentColor: PURPLE }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)' }}>{g.title}</div>
                <div style={{ fontSize: 9, color: SLATE }}>{g.pillar} · {g.horizon}</div>
              </div>
            </label>
          ))}
        </Section>

        {/* Policies */}
        <Section title={`Policies — ${config.enabledPolicies.length}/${pack.policies.length} enabled`}>
          {pack.policies.map(p => (
            <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--os-border)', cursor: 'pointer' }}>
              <input type="checkbox" checked={config.enabledPolicies.includes(p.id)} onChange={() => toggleItem('enabledPolicies', p.id)} style={{ accentColor: AMBER }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)' }}>{p.title}</div>
                <div style={{ fontSize: 9, color: SLATE }}>{p.domain} · {p.enforcement}</div>
              </div>
            </label>
          ))}
        </Section>

        {/* Agents */}
        <Section title={`Agents — ${config.enabledAgents.length}/${pack.agents.length} enabled`}>
          {pack.agents.map(a => (
            <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--os-border)', cursor: 'pointer' }}>
              <input type="checkbox" checked={config.enabledAgents.includes(a.id)} onChange={() => toggleItem('enabledAgents', a.id)} style={{ accentColor: BLUE }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)' }}>{a.name}</div>
                <div style={{ fontSize: 9, color: SLATE, lineHeight: 1.4 }}>{a.role}</div>
              </div>
            </label>
          ))}
        </Section>
      </div>

      {/* OIS Day 0 */}
      <div style={{ background: 'var(--os-card)', border: `1px solid ${BLUE}20`, borderRadius: 12, padding: '16px 18px', marginTop: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: SLATE, marginBottom: 10 }}>Day 0 OIS™ Baseline</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <input type="range" min={0} max={100} value={config.customOisDay0}
            onChange={e => setConfig(c => ({ ...c, customOisDay0: Number(e.target.value) }))}
            style={{ flex: 1, accentColor: config.customOisDay0 >= 80 ? GREEN : config.customOisDay0 >= 65 ? AMBER : '#ef4444' }}
          />
          <span style={{ fontSize: 28, fontWeight: 900, color: config.customOisDay0 >= 80 ? GREEN : config.customOisDay0 >= 65 ? AMBER : '#ef4444', minWidth: 40 }}>
            {config.customOisDay0}
          </span>
        </div>
        <div style={{ fontSize: 9, color: SLATE }}>Pack recommendation: Day 0 = {pack.oisProfile.day0Target} · Target Day 90: {pack.oisProfile.day90Target}</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={() => setStep('preview')} style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          Preview Blueprint <ChevronRight style={{ width: 13, height: 13 }} />
        </button>
        <button onClick={() => setStep('select-customer')} style={{ background: 'var(--os-surface-3)', border: '1px solid var(--os-border)', borderRadius: 8, padding: '10px 16px', fontSize: 12, cursor: 'pointer', color: 'var(--os-text-2)' }}>
          Back
        </button>
      </div>
    </div>
  )

  // ─── Step: preview ────────────────────────────────────────────────────────

  if (step === 'preview' && pack) return (
    <div>
      <StepBar current="preview" />
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Blueprint Preview</h2>
        <p style={{ fontSize: 11, color: SLATE, margin: '5px 0 0' }}>Review what will be deployed for <strong>{customer?.customerName}</strong></p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {[
          { icon: TrendingUp, label: 'KPIs Enabled',    value: `${config.enabledKpis.length} of ${pack.kpis.length}`,      col: TEAL   },
          { icon: Target,     label: 'Goals Enabled',   value: `${config.enabledGoals.length} of ${pack.goals.length}`,    col: PURPLE },
          { icon: Shield,     label: 'Policies Active', value: `${config.enabledPolicies.length} of ${pack.policies.length}`, col: AMBER },
          { icon: Users,      label: 'Agents Deployed', value: `${config.enabledAgents.length} of ${pack.agents.length}`,  col: BLUE   },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--os-card)', border: `1px solid ${k.col}20`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: k.col + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <k.icon style={{ width: 16, height: 16, color: k.col }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: k.col }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--os-card)', border: `1px solid ${GREEN}20`, borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: SLATE, marginBottom: 10 }}>Deployment Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <div><div style={{ fontSize: 9, color: SLATE, marginBottom: 3 }}>Customer</div><div style={{ fontSize: 12, fontWeight: 700 }}>{customer?.customerName}</div></div>
          <div><div style={{ fontSize: 9, color: SLATE, marginBottom: 3 }}>Pack</div><div style={{ fontSize: 12, fontWeight: 700 }}>{pack.name}</div></div>
          <div><div style={{ fontSize: 9, color: SLATE, marginBottom: 3 }}>Day 0 OIS™</div><div style={{ fontSize: 12, fontWeight: 700, color: config.customOisDay0 >= 65 ? GREEN : AMBER }}>{config.customOisDay0}</div></div>
          <div><div style={{ fontSize: 9, color: SLATE, marginBottom: 3 }}>COIG Target (monthly)</div><div style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>+{pack.coig.targetMonthly}</div></div>
          <div><div style={{ fontSize: 9, color: SLATE, marginBottom: 3 }}>Day 90 OIS Target</div><div style={{ fontSize: 12, fontWeight: 700 }}>{pack.oisProfile.day90Target}</div></div>
          <div><div style={{ fontSize: 9, color: SLATE, marginBottom: 3 }}>Milestone After Activation</div><div style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>LIVE</div></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => setStep('activate')} style={{ background: GREEN, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Globe2 style={{ width: 14, height: 14 }} /> Activate Customer
        </button>
        <button onClick={() => setStep('configure')} style={{ background: 'var(--os-surface-3)', border: '1px solid var(--os-border)', borderRadius: 8, padding: '10px 16px', fontSize: 12, cursor: 'pointer', color: 'var(--os-text-2)' }}>
          Back
        </button>
      </div>
    </div>
  )

  // ─── Step: activate ───────────────────────────────────────────────────────

  if (step === 'activate') return (
    <div>
      <StepBar current="activate" />
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '40px 0' }}>
        {activated ? (
          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: GREEN + '14', border: `2px solid ${GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Check style={{ width: 28, height: 28, color: GREEN }} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: GREEN, marginBottom: 8 }}>{customer?.customerName} is LIVE</div>
            <p style={{ fontSize: 12, color: SLATE, lineHeight: 1.7 }}>
              Blueprint activated · Day 0 OIS™ set to <strong>{config.customOisDay0}</strong> · {config.enabledAgents.length} agents deployed · {config.enabledKpis.length} KPIs tracking
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
              <a href="/kangqore-view/admin/kangqore-immp/deployments" style={{ background: BLUE, color: '#fff', borderRadius: 8, padding: '10px 20px', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Globe2 style={{ width: 13, height: 13 }} /> View Deployments
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: GREEN + '14', border: `2px solid ${GREEN}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Globe2 style={{ width: 28, height: 28, color: GREEN }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', marginBottom: 8 }}>Ready to Activate</div>
            <p style={{ fontSize: 12, color: SLATE, lineHeight: 1.7 }}>
              This will move <strong>{customer?.customerName}</strong> from <span style={{ color: AMBER, fontWeight: 700 }}>ONBOARDING</span> to <span style={{ color: GREEN, fontWeight: 700 }}>LIVE</span> and set Day 0 OIS™ to <strong>{config.customOisDay0}</strong>.
            </p>
            {activateMut.isPending && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, color: BLUE, fontSize: 12 }}>
                <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Activating…
              </div>
            )}
            {!activateMut.isPending && (
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
                <button onClick={doActivate} style={{ background: GREEN, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Globe2 style={{ width: 14, height: 14 }} /> Confirm Activation
                </button>
                <button onClick={() => setStep('preview')} style={{ background: 'var(--os-surface-3)', border: '1px solid var(--os-border)', borderRadius: 8, padding: '12px 16px', fontSize: 12, cursor: 'pointer', color: 'var(--os-text-2)' }}>
                  Back
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return <div style={{ fontSize: 12, color: SLATE }}>Loading…</div>
}
