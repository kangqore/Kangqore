import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Package, CheckCircle2, Zap, ChevronDown, ChevronUp, Users, FileText, Shield, GitBranch,
} from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const TEAL = '#10b981'
const PURP = '#7c3aed'
const BLUE = '#3b82f6'
const AMB  = '#f59e0b'
const RED  = '#ef4444'

const PACK_META: Record<string, { color: string; industry: string; tagline: string }> = {
  'kangqore/professional-services': { color: BLUE,  industry: 'Professional Services', tagline: 'Engagements · Timesheets · Deliverables · Billing Safeguards · PSA Agents' },
  'kangqore/healthcare':            { color: '#0891b2', industry: 'Healthcare',         tagline: 'Patients · Clinical Incidents · Care Pathways · HIPAA/CQC · Safety Agents' },
  'kangqore/manufacturing':         { color: AMB,   industry: 'Manufacturing',          tagline: 'Production Orders · Defects · OEE · ISO 9001 · Shop Floor Agents' },
  'kangqore/bfsi':                  { color: RED,   industry: 'BFSI',                  tagline: 'Credit Risk · AML/KYC · Regulatory Filing · Basel III · IFRS 9 Agents' },
  'kangqore/logistics':             { color: '#0891b2', industry: 'Logistics',          tagline: 'Shipment Tracking · Carrier Contracts · Customs · Supply Chain Agents' },
  'kangqore/government':            { color: PURP,  industry: 'Government',            tagline: 'Procurement (OJEU) · FOI Requests · Policy Lifecycle · Public Accountability' },
}

const INDUSTRY_PACK_IDS = Object.keys(PACK_META)

interface PackSummary {
  packId: string; name: string; icon: string; description: string
  category: string; tags: string[]
  installed: boolean; installedAt: string | null
  ontologyTypeCount: number; workflowCount: number; policyCount: number; agentCount: number
  contents: {
    ontologyTypes: Array<{ name: string; displayName: string; description: string }>
    workflows:     Array<{ name: string; description: string; stepCount: number }>
    policies:      Array<{ name: string; description: string; effect: string }>
    agents:        Array<{ name: string; role: string; description: string }>
  }
}

function ContentBadge({ count, icon: Icon, label, color }: { count: number; icon: any; label: string; color: string }) {
  if (count === 0) return null
  return (
    <div className="flex items-center gap-1">
      <Icon className="w-3 h-3" style={{ color }} />
      <span className="text-[10px] font-semibold" style={{ color: T2 }}>{count} {label}</span>
    </div>
  )
}

function PackCard({ pack, onActivate, activating, blueprintId }: {
  pack: PackSummary; onActivate: () => void; activating: boolean; blueprintId: string | null
}) {
  const [expanded, setExpanded] = useState(false)
  const meta = PACK_META[pack.packId]
  if (!meta) return null

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: CARD, borderColor: pack.installed ? `${TEAL}40` : BDR }}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}25` }}>
            {pack.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-sm font-bold" style={{ color: T1 }}>{pack.name}</p>
              {pack.installed ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                  style={{ background: 'rgba(16,185,129,0.1)', color: TEAL }}>
                  <CheckCircle2 className="w-2.5 h-2.5" /> Installed
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                  style={{ background: SURF, color: T2 }}>Available</span>
              )}
              <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold"
                style={{ background: `${meta.color}12`, color: meta.color }}>{meta.industry}</span>
            </div>
            <p className="text-[11px] mb-2" style={{ color: T2 }}>{meta.tagline}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <ContentBadge count={pack.ontologyTypeCount} icon={Package}  label="types"     color={BLUE} />
              <ContentBadge count={pack.workflowCount}     icon={GitBranch} label="workflows" color={AMB}  />
              <ContentBadge count={pack.policyCount}       icon={Shield}    label="policies"  color={RED}  />
              <ContentBadge count={pack.agentCount}        icon={Users}     label="agents"    color={PURP} />
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            {!pack.installed && (
              <button
                onClick={onActivate}
                disabled={activating || !blueprintId}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                style={{
                  background: activating ? SURF : meta.color,
                  color: activating ? T2 : '#fff',
                  opacity: (!blueprintId || activating) ? 0.6 : 1,
                }}
              >
                <Zap className="w-3 h-3" />
                {activating ? 'Activating…' : 'Activate Pack'}
              </button>
            )}
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium"
              style={{ background: SURF, color: T2 }}
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? 'Hide' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t px-5 pb-5 pt-4 space-y-4" style={{ borderColor: BDR, background: SURF }}>
          {pack.contents.ontologyTypes.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: BLUE }}>Ontology Types</p>
              <div className="space-y-1.5">
                {pack.contents.ontologyTypes.map(t => (
                  <div key={t.name} className="rounded-lg px-3 py-2 border" style={{ borderColor: `${BLUE}20`, background: `${BLUE}06` }}>
                    <p className="text-[11px] font-bold" style={{ color: T1 }}>{t.displayName}</p>
                    <p className="text-[10px]" style={{ color: T2 }}>{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {pack.contents.agents.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: PURP }}>Agents</p>
              <div className="space-y-1.5">
                {pack.contents.agents.map(a => (
                  <div key={a.name} className="rounded-lg px-3 py-2 border" style={{ borderColor: `${PURP}20`, background: `${PURP}06` }}>
                    <p className="text-[11px] font-bold" style={{ color: T1 }}>{a.name} <span className="font-normal text-[9px] ml-1" style={{ color: PURP }}>{a.role}</span></p>
                    <p className="text-[10px]" style={{ color: T2 }}>{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {pack.contents.policies.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: RED }}>Policies</p>
              <div className="space-y-1.5">
                {pack.contents.policies.map(p => (
                  <div key={p.name} className="rounded-lg px-3 py-2 border" style={{ borderColor: `${RED}20`, background: `${RED}06` }}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[11px] font-bold flex-1" style={{ color: T1 }}>{p.name}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${RED}15`, color: RED }}>{p.effect}</span>
                    </div>
                    <p className="text-[10px]" style={{ color: T2 }}>{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {pack.contents.workflows.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: AMB }}>Workflows</p>
              <div className="space-y-1.5">
                {pack.contents.workflows.map(w => (
                  <div key={w.name} className="rounded-lg px-3 py-2 border" style={{ borderColor: `${AMB}20`, background: `${AMB}06` }}>
                    <p className="text-[11px] font-bold" style={{ color: T1 }}>{w.name} <span className="font-normal text-[9px] ml-1" style={{ color: T2 }}>{w.stepCount} steps</span></p>
                    <p className="text-[10px]" style={{ color: T2 }}>{w.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function PackActivationPage() {
  const qc = useQueryClient()
  const [activatingPack, setActivatingPack] = useState<string | null>(null)
  const [justActivated, setJustActivated] = useState<string[]>([])
  const [blueprintId, setBlueprintId] = useState('')

  const { data: packsRaw = [] } = useQuery<PackSummary[]>({
    queryKey: ['packs-industry'],
    queryFn:  () => api.get('/admin/kangqore-immp/packs').then(r => r.data?.packs ?? r.data),
    staleTime: 60_000,
  })

  const packs = packsRaw.filter(p => INDUSTRY_PACK_IDS.includes(p.packId))

  const activateMut = useMutation({
    mutationFn: ({ packId, bid }: { packId: string; bid: string }) =>
      api.post(`/admin/enterprise/blueprints/${bid}/apply-pack`, { packId }),
    onSuccess: (_, { packId }) => {
      setJustActivated(prev => [...prev, packId])
      setActivatingPack(null)
      qc.invalidateQueries({ queryKey: ['packs-industry'] })
    },
    onError: () => setActivatingPack(null),
  })

  const installedCount = packs.filter(p => p.installed || justActivated.includes(p.packId)).length

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <Package className="w-6 h-6" style={{ color: PURP }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-black" style={{ color: T1 }}>Industry Pack Activation</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(124,58,237,0.1)', color: PURP }}>S97 · GTM UNLOCK</span>
            </div>
            <p className="text-xs" style={{ color: T2 }}>
              Activate an industry pack to deploy pack-specific ontology types, agents, policies, and workflows into a customer Blueprint.
              Each pack is a sellable GTM unit — the moment it's activated, that industry is unlocked for the customer.
            </p>
            <div className="flex gap-4 mt-3">
              <div className="text-center">
                <p className="text-lg font-black" style={{ color: PURP }}>{packs.length}</p>
                <p className="text-[10px]" style={{ color: T2 }}>Available</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black" style={{ color: TEAL }}>{installedCount}</p>
                <p className="text-[10px]" style={{ color: T2 }}>Installed</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black" style={{ color: BLUE }}>{packs.length - installedCount}</p>
                <p className="text-[10px]" style={{ color: T2 }}>Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blueprint ID input */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: T2 }}>
              Target Blueprint ID <span style={{ color: T2, fontWeight: 400 }}>(from Blueprint page — paste to apply pack to a deployment)</span>
            </label>
            <input
              value={blueprintId}
              onChange={e => setBlueprintId(e.target.value)}
              placeholder="cldxxx… (CustomerBlueprint ID)"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }}
            />
          </div>
          {!blueprintId && (
            <p className="text-[10px] mt-5 flex-shrink-0" style={{ color: AMB }}>
              Paste a Blueprint ID to enable activation
            </p>
          )}
        </div>
      </div>

      {/* Pack cards */}
      <div className="space-y-3">
        {packs.length === 0 ? (
          <div className="rounded-xl p-6 text-center border" style={{ background: CARD, borderColor: BDR }}>
            <p className="text-sm" style={{ color: T2 }}>Loading industry packs…</p>
          </div>
        ) : packs.map(pack => (
          <PackCard
            key={pack.packId}
            pack={{ ...pack, installed: pack.installed || justActivated.includes(pack.packId) }}
            blueprintId={blueprintId || null}
            activating={activatingPack === pack.packId}
            onActivate={() => {
              if (!blueprintId) return
              setActivatingPack(pack.packId)
              activateMut.mutate({ packId: pack.packId, bid: blueprintId })
            }}
          />
        ))}
      </div>

      {/* Info callout */}
      <div className="rounded-xl p-4 border flex items-start gap-3"
        style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: BLUE }} />
        <p className="text-xs" style={{ color: T2 }}>
          <span className="font-bold" style={{ color: BLUE }}>GTM Mechanics:</span>{' '}
          Each pack installs its assets into the platform globally (ontology types, workflows, policies, agents).
          The blueprint link records which packs are active for a given customer deployment — enabling per-customer feature flags and pack-specific COIG attribution.
          Pack assets are idempotent — re-installing a pack updates existing records safely.
        </p>
      </div>
    </div>
  )
}
