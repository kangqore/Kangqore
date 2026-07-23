import { useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Users, TrendingUp, AlertTriangle, Shield,
  Activity, ArrowUpRight, RefreshCw, Target, Zap,
} from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const T3   = 'var(--os-text-3, #4c4c68)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const TEAL = '#10b981'
const PURP = '#7c3aed'
const BLUE = '#3b82f6'
const AMB  = '#f59e0b'
const RED  = '#ef4444'

interface Blueprint {
  id:             string
  customerName:   string
  tenantId:       string | null
  version:        string
  planTier:       string
  industry:       string | null
  oisBaseline:    number | null
  oisTarget:      number | null
  status:         string
  deployedAt:     string | null
  createdAt:      string
  enabledModules: string[]
}

function daysSince(iso: string | null) {
  if (!iso) return 0
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

function deriveCoig(bp: Blueprint) {
  const days     = daysSince(bp.deployedAt)
  const baseline = bp.oisBaseline ?? 60
  const target   = bp.oisTarget   ?? 75
  const velocity = (target - baseline) / 90
  const oisNow   = Math.min(target, baseline + velocity * days)
  return { days, baseline, target, oisNow, delta: oisNow - baseline, pct: Math.min(100, (days / 90) * 100) }
}

// ── Mini OIS sparkline ────────────────────────────────────────────────────────
function OISSpark({ bp, color }: { bp: Blueprint; color: string }) {
  const ref  = useRef<HTMLCanvasElement>(null)
  const m    = deriveCoig(bp)
  const pts  = [m.baseline, m.baseline + (m.target - m.baseline) * 0.35, m.baseline + (m.target - m.baseline) * 0.7, m.oisNow]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return
    const W = el.offsetWidth || 80; const H = el.offsetHeight || 28
    el.width = W * devicePixelRatio; el.height = H * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    ctx.clearRect(0, 0, W, H)
    const min = Math.min(...pts) - 2; const max = Math.max(...pts) + 2; const rng = max - min || 1
    const xs = [0, W * 0.33, W * 0.66, W]
    const ys = pts.map(v => H - ((v - min) / rng) * H * 0.85 - H * 0.08)
    ctx.beginPath(); xs.forEach((x, i) => i === 0 ? ctx.moveTo(x, ys[i]) : ctx.lineTo(x, ys[i]))
    ctx.lineTo(xs[xs.length - 1], H); ctx.lineTo(0, H); ctx.closePath()
    ctx.fillStyle = color + '18'; ctx.fill()
    ctx.beginPath(); xs.forEach((x, i) => i === 0 ? ctx.moveTo(x, ys[i]) : ctx.lineTo(x, ys[i]))
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke()
    ctx.beginPath(); ctx.arc(xs[3], ys[3], 3, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
  })

  return <canvas ref={ref} style={{ width: 80, height: 28 }} />
}

// ── Customer card ─────────────────────────────────────────────────────────────
function CustomerCard({ bp, idx }: { bp: Blueprint; idx: number }) {
  const m      = deriveCoig(bp)
  const color  = m.delta >= 5 ? TEAL : m.delta >= 2 ? BLUE : m.delta >= 0 ? AMB : RED
  const health = m.delta >= 5 ? 'Healthy' : m.delta >= 2 ? 'Growing' : m.delta >= 0 ? 'At Risk' : 'Critical'
  const slug   = ['zero', 'one', 'two', 'three', 'four', 'five'][idx] ?? 'zero'

  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Name + health */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Users size={14} style={{ color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: T1 }}>{bp.customerName}</span>
            <span style={{ fontSize: 8, fontWeight: 800, color: PURP, background: PURP + '12', padding: '1px 5px', borderRadius: 3 }}>v{bp.version}</span>
          </div>
          <span style={{ fontSize: 9, color: T3 }}>{bp.industry ?? bp.planTier} · Day {m.days}</span>
        </div>
        <span style={{ fontSize: 9, fontWeight: 800, color, background: color + '12', padding: '3px 8px', borderRadius: 20 }}>{health}</span>
      </div>

      {/* OIS + COIG row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 9, color: T3, margin: '0 0 1px' }}>OIS Now</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: TEAL, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.oisNow.toFixed(1)}</p>
          <p style={{ fontSize: 9, color: T2 }}>base {m.baseline.toFixed(0)}</p>
        </div>
        <div>
          <p style={{ fontSize: 9, color: T3, margin: '0 0 1px' }}>COIG Δ</p>
          <p style={{ fontSize: 18, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>+{m.delta.toFixed(1)}</p>
          <p style={{ fontSize: 9, color: T2 }}>target +{(m.target - m.baseline).toFixed(1)}</p>
        </div>
        <div>
          <p style={{ fontSize: 9, color: T3, margin: '0 0 1px' }}>Modules</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: BLUE, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{bp.enabledModules.length}</p>
          <p style={{ fontSize: 9, color: T2 }}>{bp.planTier}</p>
        </div>
        <OISSpark bp={bp} color={color} />
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ height: 4, background: 'var(--os-surface-0)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ height: '100%', width: `${m.pct}%`, background: color, borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>
        <p style={{ fontSize: 9, color: T3 }}>Day {m.days}/90 · {m.pct.toFixed(0)}% through COIG window</p>
      </div>

      <Link to={`/kangqore-view/admin/kangqore-immp/customers/${slug}`}
        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: PURP, textDecoration: 'none', alignSelf: 'flex-start' }}>
        View Dashboard <ArrowUpRight size={11} />
      </Link>
    </div>
  )
}

// ── S118 — Signal → Outcome Correlation Panel ─────────────────────────────────

interface Correlation {
  signalType: string; avgOisVelocity: number; avgConfidence: number; sampleSize: number; impact: 'positive' | 'negative' | 'neutral'
}

function CoigCorrelationPanel() {
  const { data, isLoading } = useQuery<{ correlations: Correlation[]; totalSignals: number }>({
    queryKey: ['coig-correlation'],
    queryFn:  () => api.get('/admin/kangqore-immp/analytics/coig-correlation').then(r => r.data),
    staleTime: 60_000,
  })

  const correlations = data?.correlations ?? []
  const maxVel = Math.max(...correlations.map(c => Math.abs(c.avgOisVelocity)), 0.1)

  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Zap size={13} style={{ color: PURP }} />
        <span style={{ fontSize: 11, fontWeight: 800, color: T1 }}>Signal → Outcome Correlation</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: T2, marginLeft: 'auto' }}>{data?.totalSignals ?? 0} signals · 90d</span>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 28, borderRadius: 6, background: SURF, animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : correlations.length === 0 ? (
        <p style={{ fontSize: 11, color: T2 }}>No signals in the last 90 days.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {correlations.slice(0, 10).map(c => {
            const color = c.impact === 'positive' ? TEAL : c.impact === 'negative' ? RED : AMB
            const barW = Math.abs(c.avgOisVelocity) / maxVel
            return (
              <div key={c.signalType} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 130, fontSize: 9, fontWeight: 700, color: T2, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.signalType.replace(/_/g, ' ')}
                </div>
                <div style={{ flex: 1, height: 5, background: SURF, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.max(2, barW * 100)}%`, height: '100%', background: color, borderRadius: 99, transition: 'width .4s ease' }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', minWidth: 38, textAlign: 'right' }}>
                  {c.avgOisVelocity >= 0 ? '+' : ''}{c.avgOisVelocity.toFixed(2)}
                </span>
                <span style={{ fontSize: 9, color: T2, minWidth: 24, textAlign: 'right' }}>×{c.sampleSize}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function CustomerSuccessPlatformPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['cs-blueprints'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => r.data.blueprints as Blueprint[]),
    staleTime: 30_000,
  })

  const all      = data ?? []
  const active   = all.filter(bp => bp.status === 'ACTIVE' && bp.deployedAt)
  const metrics  = active.map(bp => ({ bp, m: deriveCoig(bp) }))
  const totalCoig   = metrics.reduce((s, x) => s + x.m.delta, 0)
  const avgCoig     = metrics.length ? totalCoig / metrics.length : 0
  const atRisk      = metrics.filter(x => x.m.delta < 2).length
  const allBlueprints = all

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: TEAL + '15', border: `1px solid ${TEAL}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={20} style={{ color: TEAL }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <h1 style={{ fontSize: 18, fontWeight: 900, color: T1, letterSpacing: '-.02em', margin: 0 }}>Customer Success Platform</h1>
              <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: TEAL, background: TEAL + '12', padding: '3px 8px', borderRadius: 4 }}>Live · S104</span>
            </div>
            <p style={{ fontSize: 11, color: T2, margin: 0 }}>OIS health, COIG momentum, and onboarding pipeline across all {active.length} active deployments</p>
          </div>
        </div>
        <button onClick={() => refetch()}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: CARD, border: `1px solid ${BDR}`, borderRadius: 8, fontSize: 11, cursor: 'pointer', color: T2 }}>
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Active Customers',  value: active.length,         sub: `${allBlueprints.length} total blueprints`, color: PURP, Icon: Users       },
          { label: 'Total COIG Δ',      value: `+${totalCoig.toFixed(1)}`, sub: 'across all deployments',             color: TEAL, Icon: TrendingUp  },
          { label: 'At-Risk Accounts',  value: atRisk,                 sub: 'COIG Δ < 2 pts',                         color: atRisk > 0 ? AMB : TEAL, Icon: AlertTriangle },
          { label: 'Avg COIG / Customer', value: `+${avgCoig.toFixed(1)}`, sub: 'target: +10 per quarter',            color: BLUE, Icon: Target       },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.Icon size={12} style={{ color: s.color }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: T3 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T2, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Customer health grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Activity size={12} style={{ color: TEAL }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: T1 }}>Customer Health — Live OIS + COIG Comparison</span>
        </div>
        {isLoading ? (
          <p style={{ fontSize: 12, color: T2 }}>Loading…</p>
        ) : active.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: CARD, borderRadius: 14, border: `1px solid ${BDR}` }}>
            <p style={{ fontSize: 12, color: T2 }}>No active customers yet. Run the Blueprint Wizard to provision.</p>
            <Link to="/kangqore-view/admin/kangqore-immp/blueprint-wizard"
              style={{ fontSize: 11, fontWeight: 700, color: BLUE, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>
              Open Blueprint Wizard →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: active.length === 1 ? '1fr' : '1fr 1fr', gap: 12 }}>
            {active.map((bp, i) => <CustomerCard key={bp.id} bp={bp} idx={i} />)}
          </div>
        )}
      </div>

      {/* COIG fleet comparison bar */}
      {metrics.length > 1 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <TrendingUp size={13} style={{ color: PURP }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: T1 }}>COIG Δ Fleet Comparison</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...metrics].sort((a, b) => b.m.delta - a.m.delta).map(({ bp, m }) => {
              const color = m.delta >= 5 ? TEAL : m.delta >= 2 ? BLUE : m.delta >= 0 ? AMB : RED
              const maxDelta = Math.max(...metrics.map(x => x.m.delta), 1)
              return (
                <div key={bp.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 130, fontSize: 10, fontWeight: 600, color: T2, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {bp.customerName}
                  </div>
                  <div style={{ flex: 1, height: 6, background: 'var(--os-surface-0)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(2, (m.delta / maxDelta) * 100)}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.5s ease' }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', minWidth: 36, textAlign: 'right' }}>
                    +{m.delta.toFixed(1)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* S118 — Signal → Outcome Correlation */}
      <CoigCorrelationPanel />

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { to: '/kangqore-view/admin/kangqore-immp/coig-north-star', label: 'COIG North Star', desc: 'Cross-tenant north-star ranking', color: TEAL },
          { to: '/kangqore-view/admin/kangqore-immp/renewals',         label: 'Renewal Workflow', desc: 'Day-90 nudge + NPS + outcomes', color: AMB  },
          { to: '/kangqore-view/admin/kangqore-immp/blueprint-versions', label: 'Blueprint Versions', desc: 'Diff and rollback customer specs', color: BLUE },
        ].map(l => (
          <Link key={l.to} to={l.to} style={{ textDecoration: 'none', padding: '12px 14px', borderRadius: 10, background: CARD, border: `1px solid ${BDR}`, display: 'block' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T1, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
              {l.label} <ArrowUpRight size={10} style={{ color: l.color }} />
            </div>
            <div style={{ fontSize: 10, color: T2 }}>{l.desc}</div>
          </Link>
        ))}
      </div>

    </div>
  )
}
