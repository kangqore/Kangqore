import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { Loader2, Rocket, Wand2, ChevronRight, Trophy } from 'lucide-react'
import { api } from '@lib/api'

const T1    = 'var(--os-text-1)'
const T2    = 'var(--os-text-2)'
const BDR   = 'var(--os-border)'
const CARD  = 'var(--os-card)'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const BLUE  = '#3b82f6'
const PURP  = '#7c3aed'

export interface CustomerConfig {
  name:           string
  slug:           string        // e.g. "six"
  subdomain:      string        // e.g. "customer-six"
  industry:       string
  planTier:       'STARTER' | 'PRO' | 'ENTERPRISE'
  size:           string
  oisBaseline:    number
  oisTarget:      number
  modules:        string[]
  isMilestone?:    boolean
  milestoneLabel?: string
  accentColor?:    string
  verticalEdition?: string
  personaName?:    string
}

interface Blueprint {
  id: string; customerName: string; status: string
  oisBaseline: number | null; oisTarget: number | null; deployedAt: string | null
  planTier: string; industry: string | null; enabledModules: string[]
}

function daysSince(iso: string | null) {
  if (!iso) return 0
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

export function CustomerProvisionPage({ cfg }: { cfg: CustomerConfig }) {
  const navigate  = useNavigate()
  const accent    = cfg.accentColor ?? BLUE

  const { data } = useQuery({
    queryKey: [`blueprints-c-${cfg.slug}`],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => r.data.blueprints as Blueprint[]),
    staleTime: 30_000,
  })

  const blueprint = (data ?? []).find(bp =>
    bp.customerName?.toLowerCase().includes(cfg.name.split(' ').pop()?.toLowerCase() ?? cfg.slug)
  )

  const quickMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/customers/provision-one', {
      customerName:   cfg.name,
      subdomain:      cfg.subdomain,
      industry:       cfg.industry,
      planTier:       cfg.planTier,
      size:           cfg.size,
      oisBaseline:    cfg.oisBaseline,
      oisTarget:      cfg.oisTarget,
      enabledModules: cfg.modules,
    }).then(r => r.data),
    onSuccess: () => navigate(`/kangqore-view/admin/kangqore-immp/customers/${cfg.slug}`),
  })

  // ── Pre-deployment ────────────────────────────────────────────────────────
  if (!blueprint) {
    return (
      <div style={{ maxWidth: 680 }} className="space-y-5">

        {cfg.isMilestone && (
          <div style={{ padding: '12px 16px', borderRadius: 12, background: PURP + '08', border: `1px solid ${PURP}25`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Trophy style={{ width: 18, height: 18, color: PURP, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: PURP }}>{cfg.milestoneLabel ?? 'Milestone'}</div>
              <div style={{ fontSize: 10, color: T2 }}>Provisioning this customer unlocks a platform milestone.</div>
            </div>
          </div>
        )}

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: T1, margin: 0 }}>{cfg.name}</h2>
          <p style={{ fontSize: 11, color: T2, marginTop: 4 }}>
            {cfg.industry} · {cfg.planTier} · OIS {cfg.oisBaseline}→{cfg.oisTarget} (+{(cfg.oisTarget - cfg.oisBaseline).toFixed(1)} pts target)
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Link to="/kangqore-view/admin/kangqore-immp/blueprint-wizard"
            style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 18px', borderRadius: 14, border: `1px solid ${BLUE}25`, background: BLUE + '04', textDecoration: 'none' }}>
            <Wand2 style={{ width: 22, height: 22, color: BLUE }} />
            <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Blueprint Wizard</div>
            <div style={{ fontSize: 11, color: T2 }}>Full guided provisioning with custom OIS baseline and module selection.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: BLUE }}>
              Open wizard <ChevronRight style={{ width: 12, height: 12 }} />
            </div>
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 18px', borderRadius: 14, border: `1px solid ${GREEN}25`, background: GREEN + '04' }}>
            <Rocket style={{ width: 22, height: 22, color: GREEN }} />
            <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Quick Provision</div>
            <div style={{ fontSize: 11, color: T2 }}>
              {cfg.industry} · {cfg.planTier} · OIS {cfg.oisBaseline}→{cfg.oisTarget} · {cfg.modules.length} modules
            </div>
            <button onClick={() => quickMut.mutate()} disabled={quickMut.isPending}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', background: GREEN, color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: quickMut.isPending ? 0.5 : 1, width: 'fit-content' }}>
              {quickMut.isPending
                ? <><Loader2 style={{ width: 11, height: 11, animation: 'spin 1s linear infinite' }} /> Provisioning…</>
                : 'Provision now'}
            </button>
            {quickMut.isError && <p style={{ fontSize: 10, color: '#ef4444', margin: 0 }}>Already exists or provision failed.</p>}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {cfg.modules.map(m => (
            <span key={m} style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: accent + '10', color: accent, border: `1px solid ${accent}20` }}>{m}</span>
          ))}
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // ── Live ─────────────────────────────────────────────────────────────────
  const days   = daysSince(blueprint.deployedAt)
  const pct    = Math.min(100, (days / 90) * 100)
  const coig   = blueprint.oisBaseline && blueprint.oisTarget
    ? (((blueprint.oisTarget - blueprint.oisBaseline) / 90) * days)
    : 0
  const isActive = blueprint.status === 'ACTIVE'

  return (
    <div style={{ maxWidth: 800 }} className="space-y-5">

      {cfg.isMilestone && isActive && (
        <div style={{ padding: '14px 16px', borderRadius: 12, background: PURP + '08', border: `1px solid ${PURP}25`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Trophy style={{ width: 18, height: 18, color: PURP }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: PURP }}>{cfg.milestoneLabel ?? 'Milestone achieved!'}</div>
            <div style={{ fontSize: 11, color: T2 }}>Check the <Link to="/kangqore-view/admin/kangqore-immp/coig-north-star" style={{ color: PURP, fontWeight: 700 }}>COIG North Star</Link> for fleet-level comparison.</div>
          </div>
        </div>
      )}

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: T1, margin: 0 }}>{blueprint.customerName}</h2>
          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: isActive ? GREEN + '12' : AMBER + '12', color: isActive ? GREEN : AMBER, border: `1px solid ${isActive ? GREEN : AMBER}25`, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {blueprint.status}
          </span>
          {cfg.isMilestone && (
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: PURP + '12', color: PURP, border: `1px solid ${PURP}25` }}>🏆 Milestone</span>
          )}
        </div>
        <p style={{ fontSize: 11, color: T2, margin: 0 }}>{blueprint.industry} · {blueprint.planTier} · {blueprint.enabledModules.length} modules</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { label: 'OIS Day 0',  value: blueprint.oisBaseline?.toFixed(1) ?? '—', color: T2    },
          { label: 'OIS Target', value: blueprint.oisTarget?.toFixed(1) ?? '—',   color: accent },
          { label: 'COIG Δ',     value: `+${coig.toFixed(1)}`,                    color: GREEN  },
        ].map(t => (
          <div key={t.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: t.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginBottom: 2 }}>{t.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2 }}>{t.label}</div>
          </div>
        ))}
      </div>

      {isActive && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T2, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>COIG Clock — Day {days} of 90</span>
            <span style={{ color: GREEN, fontWeight: 800 }}>{pct.toFixed(0)}%</span>
          </div>
          <div style={{ height: 8, background: 'var(--os-surface-0)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${GREEN}, ${accent})`, borderRadius: 99 }} />
          </div>
        </div>
      )}
    </div>
  )
}
