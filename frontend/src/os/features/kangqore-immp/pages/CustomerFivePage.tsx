import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Rocket, Wand2, ChevronRight } from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const BLUE  = '#3b82f6'
const PURP  = '#7c3aed'

interface Blueprint {
  id: string; customerName: string; status: string
  oisBaseline: number | null; oisTarget: number | null; deployedAt: string | null
  planTier: string; industry: string | null; enabledModules: string[]
}

function daysSince(iso: string | null) {
  if (!iso) return 0
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

export function CustomerFivePage() {
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['blueprints-c5'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => r.data.blueprints as Blueprint[]),
    staleTime: 30_000,
  })

  const blueprint = (data ?? []).find(bp =>
    bp.customerName?.toLowerCase().includes('five') ||
    bp.customerName?.toLowerCase().includes('5')
  )

  const quickMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/customers/provision-one', {
      customerName:   'Customer Five',
      subdomain:      'customer-five',
      industry:       'Retail & Consumer Goods',
      planTier:       'STARTER',
      size:           '1–50 employees',
      oisBaseline:    48.7,
      oisTarget:      63.0,
      enabledModules: ['projects', 'sales', 'hr'],
    }).then(r => r.data),
    onSuccess: () => navigate('/kangqore-view/admin/kangqore-immp/customers/five'),
  })

  if (!blueprint) {
    return (
      <div style={{ maxWidth: 680 }} className="space-y-5">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: T1, margin: 0 }}>Customer Five</h2>
          <p style={{ fontSize: 11, color: T2, marginTop: 4 }}>
            The 5th deployment — unlocks the 5-customer fleet milestone and COIG comparison across all tenants.
          </p>
        </div>

        <div style={{ padding: '12px 16px', borderRadius: 10, background: PURP + '06', border: `1px solid ${PURP}20` }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: PURP, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 4 }}>S104 Milestone</div>
          <p style={{ fontSize: 11, color: T2, margin: 0, lineHeight: 1.6 }}>
            Provisioning Customer Five completes the 5 live deployments target. At this point the COIG North Star dashboard has enough data
            for fleet-level trend analysis. Target: OIS 48.7 → 63.0 (+14.3 pts).
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Link to="/kangqore-view/admin/kangqore-immp/blueprint-wizard"
            style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 18px', borderRadius: 14, border: `1px solid ${BLUE}25`, background: BLUE + '04', textDecoration: 'none' }}>
            <Wand2 style={{ width: 22, height: 22, color: BLUE }} />
            <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Blueprint Wizard</div>
            <div style={{ fontSize: 11, color: T2 }}>Fully custom provisioning with industry pack selection and OIS baseline capture.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: BLUE }}>
              Open wizard <ChevronRight style={{ width: 12, height: 12 }} />
            </div>
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 18px', borderRadius: 14, border: `1px solid ${GREEN}25`, background: GREEN + '04' }}>
            <Rocket style={{ width: 22, height: 22, color: GREEN }} />
            <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Quick Provision</div>
            <div style={{ fontSize: 11, color: T2 }}>
              Retail & Consumer · STARTER · OIS 48.7→63.0 · 3 modules.
            </div>
            <button onClick={() => quickMut.mutate()} disabled={quickMut.isPending}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', background: GREEN, color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: quickMut.isPending ? 0.5 : 1, width: 'fit-content' }}>
              {quickMut.isPending
                ? <><Loader2 style={{ width: 11, height: 11, animation: 'spin 1s linear infinite' }} /> Provisioning…</>
                : <>Provision now</>}
            </button>
            {quickMut.isError && <p style={{ fontSize: 10, color: '#ef4444', margin: 0 }}>Already exists or failed.</p>}
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  const days   = daysSince(blueprint.deployedAt)
  const pct    = Math.min(100, (days / 90) * 100)
  const isActive = blueprint.status === 'ACTIVE'
  const coig   = blueprint.oisBaseline && blueprint.oisTarget
    ? (((blueprint.oisTarget - blueprint.oisBaseline) / 90) * days)
    : 0

  return (
    <div style={{ maxWidth: 800 }} className="space-y-5">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: T1, margin: 0 }}>{blueprint.customerName}</h2>
          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: isActive ? GREEN + '12' : AMBER + '12', color: isActive ? GREEN : AMBER, border: `1px solid ${isActive ? GREEN : AMBER}25`, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {blueprint.status}
          </span>
          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: PURP + '12', color: PURP, border: `1px solid ${PURP}25`, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            5th customer 🎯
          </span>
        </div>
        <p style={{ fontSize: 11, color: T2 }}>{blueprint.industry} · {blueprint.planTier} · {blueprint.enabledModules.length} modules</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { label: 'OIS Day 0',  value: blueprint.oisBaseline?.toFixed(1) ?? '—', color: T2   },
          { label: 'OIS Target', value: blueprint.oisTarget?.toFixed(1) ?? '—',   color: BLUE  },
          { label: 'COIG Δ',     value: `+${coig.toFixed(1)}`,                    color: GREEN },
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
            <span style={{ color: GREEN, fontWeight: 800 }}>{pct.toFixed(0)}% through</span>
          </div>
          <div style={{ height: 8, background: 'var(--os-surface-0)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${GREEN}, ${PURP})`, borderRadius: 99, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}

      <div style={{ padding: '12px 16px', borderRadius: 10, background: PURP + '04', border: `1px solid ${PURP}15` }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: PURP, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 4 }}>Fleet milestone achieved</div>
        <p style={{ fontSize: 11, color: T2, margin: 0, lineHeight: 1.6 }}>
          5 live customers are now active. COIG North Star has fleet-level data for trend analysis. Check the{' '}
          <Link to="/kangqore-view/admin/kangqore-immp/coig-north-star" style={{ color: PURP, fontWeight: 700 }}>COIG North Star dashboard</Link>{' '}
          for cross-tenant comparison.
        </p>
      </div>
    </div>
  )
}
