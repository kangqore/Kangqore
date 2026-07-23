import { useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, AlertTriangle, Zap, Target, RefreshCw, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const BLUE  = '#3b82f6'
const RED   = '#ef4444'
const PURP  = '#7c3aed'

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

function daysSince(iso: string | null): number {
  if (!iso) return 0
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

function deriveMetrics(bp: Blueprint) {
  const days        = daysSince(bp.deployedAt)
  const baseline    = bp.oisBaseline ?? 60
  const target      = bp.oisTarget   ?? 75
  const velocity    = (target - baseline) / 90           // pts/day expected
  const oisNow      = Math.min(target, baseline + velocity * days)
  const coigDelta   = oisNow - baseline
  const ois30       = Math.min(target, baseline + velocity * 30)
  const ois60       = Math.min(target, baseline + velocity * 60)
  const ois90       = target
  const expected    = baseline + velocity * days
  const tracking    = oisNow / (expected || 1)
  const isDropping  = days > 7 && tracking < 0.85        // >15% behind expected pace
  return { days, baseline, target, velocity, oisNow, coigDelta, ois30, ois60, ois90, isDropping, tracking }
}

// ── Mini sparkline bar ────────────────────────────────────────────────────────
function SparkBar({ ois30, ois60, ois90, baseline, target, color }: {
  ois30: number; ois60: number; ois90: number; baseline: number; target: number; color: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return
    const W = el.offsetWidth || 120
    const H = el.offsetHeight || 28
    el.width  = W * window.devicePixelRatio
    el.height = H * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    ctx.clearRect(0, 0, W, H)

    const pts = [baseline, ois30, ois60, ois90]
    const min = Math.max(0,   Math.min(...pts) - 3)
    const max = Math.min(100, Math.max(...pts) + 3)
    const rng = max - min || 1

    const xs = [0, W * 0.33, W * 0.66, W]
    const ys = pts.map(v => H - ((v - min) / rng) * H * 0.9 - H * 0.05)

    // Fill
    ctx.beginPath()
    ctx.moveTo(xs[0], H)
    xs.forEach((x, i) => ctx.lineTo(x, ys[i]))
    ctx.lineTo(xs[xs.length - 1], H)
    ctx.closePath()
    ctx.fillStyle = color + '18'
    ctx.fill()

    // Line
    ctx.beginPath()
    xs.forEach((x, i) => i === 0 ? ctx.moveTo(x, ys[i]) : ctx.lineTo(x, ys[i]))
    ctx.strokeStyle = color
    ctx.lineWidth   = 1.5
    ctx.stroke()

    // Target dot
    ctx.beginPath()
    ctx.arc(xs[3], ys[3], 3, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }, [ois30, ois60, ois90, baseline, target, color])

  return <canvas ref={canvasRef} style={{ width: '100%', height: 28 }} />
}

// ── Customer row ──────────────────────────────────────────────────────────────
function CustomerRow({ bp, rank }: { bp: Blueprint; rank: number }) {
  const m = deriveMetrics(bp)
  const color = m.isDropping ? RED : m.coigDelta >= 5 ? GREEN : m.coigDelta >= 2 ? AMBER : BLUE
  const pct   = Math.min(100, (m.days / 90) * 100)

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '28px 1fr 110px 80px 90px 90px 70px',
      alignItems: 'center', gap: 14,
      padding: '12px 16px', borderBottom: `1px solid ${BDR}`,
      background: m.isDropping ? RED + '04' : 'transparent',
    }}>
      {/* Rank */}
      <div style={{ fontSize: 11, fontWeight: 900, color: T2, fontVariantNumeric: 'tabular-nums', textAlign: 'center' }}>
        {rank}
      </div>

      {/* Name + progress */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: T1, marginBottom: 3 }}>{bp.customerName}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 80, height: 3, background: SURF, borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 9, color: T2, fontVariantNumeric: 'tabular-nums' }}>Day {m.days}/90</span>
        </div>
      </div>

      {/* Sparkline */}
      <div style={{ width: '100%' }}>
        <SparkBar ois30={m.ois30} ois60={m.ois60} ois90={m.ois90} baseline={m.baseline} target={m.target} color={color} />
      </div>

      {/* OIS baseline */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: T2, fontVariantNumeric: 'tabular-nums' }}>{m.baseline.toFixed(0)}</div>
        <div style={{ fontSize: 8, color: T2, textTransform: 'uppercase', letterSpacing: '.07em' }}>Day 0</div>
      </div>

      {/* OIS now */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>{m.oisNow.toFixed(1)}</div>
        <div style={{ fontSize: 8, color: T2, textTransform: 'uppercase', letterSpacing: '.07em' }}>OIS now</div>
      </div>

      {/* COIG delta */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          {m.coigDelta >= 0
            ? <TrendingUp  style={{ width: 10, height: 10, color }} />
            : <TrendingDown style={{ width: 10, height: 10, color: RED }} />}
          <span style={{ fontSize: 15, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>
            {m.coigDelta >= 0 ? '+' : ''}{m.coigDelta.toFixed(1)}
          </span>
        </div>
        <div style={{ fontSize: 8, color: T2, textTransform: 'uppercase', letterSpacing: '.07em' }}>COIG Δ</div>
      </div>

      {/* Status badge */}
      <div style={{ textAlign: 'center' }}>
        {m.isDropping
          ? <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 7px', borderRadius: 999, background: RED + '12', color: RED, border: `1px solid ${RED}25` }}>DROP</span>
          : <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 7px', borderRadius: 999, background: color + '12', color, border: `1px solid ${color}25` }}>
              {m.coigDelta >= 5 ? 'ON TRACK' : m.coigDelta >= 0 ? 'GROWING' : 'SLOW'}
            </span>}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function COIGNorthStarPage() {
  const { data, isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['coig-north-star'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => r.data.blueprints as Blueprint[]),
    staleTime: 30_000,
  })

  const blueprints: Blueprint[] = (data ?? []).filter(bp => bp.status === 'ACTIVE' && bp.deployedAt)
  const withMetrics = blueprints.map(bp => ({ bp, m: deriveMetrics(bp) }))
  const ranked      = [...withMetrics].sort((a, b) => b.m.coigDelta - a.m.coigDelta)
  const drops       = withMetrics.filter(({ m }) => m.isDropping)
  const totalCoig   = withMetrics.reduce((s, { m }) => s + m.coigDelta, 0)
  const avgCoig     = withMetrics.length ? totalCoig / withMetrics.length : 0

  // Aggregate 30/60/90 trend across all customers
  const agg30 = withMetrics.length ? withMetrics.reduce((s, { m }) => s + m.ois30, 0) / withMetrics.length : 0
  const agg60 = withMetrics.length ? withMetrics.reduce((s, { m }) => s + m.ois60, 0) / withMetrics.length : 0
  const agg90 = withMetrics.length ? withMetrics.reduce((s, { m }) => s + m.ois90, 0) / withMetrics.length : 0
  const aggBase = withMetrics.length ? withMetrics.reduce((s, { m }) => s + m.baseline, 0) / withMetrics.length : 0

  return (
    <div style={{ maxWidth: 900 }} className="space-y-5">

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: T1, margin: 0, letterSpacing: '-.02em' }}>COIG North Star</h2>
          <p style={{ fontSize: 11, color: T2, marginTop: 4 }}>
            Cross-tenant OIS growth index — all active customers ranked by COIG delta
          </p>
        </div>
        <button onClick={() => refetch()}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: CARD, border: `1px solid ${BDR}`, borderRadius: 8, fontSize: 11, cursor: 'pointer', color: T2 }}>
          <RefreshCw style={{ width: 11, height: 11 }} /> Refresh
        </button>
      </div>

      {/* ── WAANDA drop alerts ── */}
      {drops.length > 0 && (
        <div style={{ padding: '14px 16px', borderRadius: 12, background: RED + '06', border: `1px solid ${RED}20` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <AlertTriangle style={{ width: 14, height: 14, color: RED }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: RED, textTransform: 'uppercase', letterSpacing: '.09em' }}>
              WAANDA Alert — {drops.length} customer{drops.length > 1 ? 's' : ''} tracking below pace
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {drops.map(({ bp, m }) => (
              <div key={bp.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: T2 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: RED, flexShrink: 0 }} />
                <strong style={{ color: T1 }}>{bp.customerName}</strong>
                <span>tracking at {(m.tracking * 100).toFixed(0)}% of expected OIS pace on Day {m.days}</span>
                <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: RED }}>ACTION REQUIRED</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 10, color: T2, marginTop: 10 }}>
            WAANDA recommends: schedule QBR call, review OIS blockers, escalate to CSM.
          </p>
        </div>
      )}

      {/* ── Summary tiles ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {[
          { label: 'Active Customers',   value: blueprints.length,       color: BLUE,  fmt: (v: number) => v.toString()     },
          { label: 'Total COIG Δ',       value: totalCoig,               color: GREEN, fmt: (v: number) => `+${v.toFixed(1)}` },
          { label: 'Avg COIG / Customer',value: avgCoig,                 color: GREEN, fmt: (v: number) => `+${v.toFixed(1)}` },
          { label: 'Avg OIS @ Day 90',   value: agg90,                   color: PURP,  fmt: (v: number) => v.toFixed(1)     },
          { label: 'Drop Alerts',        value: drops.length,            color: drops.length > 0 ? RED : GREEN, fmt: (v: number) => v.toString() },
        ].map(t => (
          <div key={t.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 10, padding: '11px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: t.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginBottom: 2 }}>
              {t.fmt(t.value)}
            </div>
            <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2 }}>{t.label}</div>
          </div>
        ))}
      </div>

      {/* ── Aggregate trend ── */}
      {withMetrics.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginBottom: 12 }}>
            Fleet OIS trajectory — average across {blueprints.length} active customer{blueprints.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Day 0 (baseline)', value: aggBase, color: T2   },
              { label: 'Day 30 (est.)',    value: agg30,   color: BLUE  },
              { label: 'Day 60 (est.)',    value: agg60,   color: PURP  },
              { label: 'Day 90 (target)', value: agg90,   color: GREEN },
            ].map(p => (
              <div key={p.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: p.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginBottom: 2 }}>
                  {p.value.toFixed(1)}
                </div>
                <div style={{ fontSize: 9, color: T2 }}>{p.label}</div>
                {p.label !== 'Day 0 (baseline)' && (
                  <div style={{ fontSize: 9, color: p.color, fontWeight: 700 }}>
                    +{(p.value - aggBase).toFixed(1)} pts
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Ranked table ── */}
      <div style={{ borderRadius: 12, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '28px 1fr 110px 80px 90px 90px 70px',
          gap: 14, padding: '8px 16px',
          background: CARD, borderBottom: `1px solid ${BDR}`,
        }}>
          {['#', 'Customer', '30·60·90 Trend', 'Day 0', 'OIS Now', 'COIG Δ', 'Status'].map((h, i) => (
            <span key={i} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, textAlign: i > 1 ? 'center' : 'left' }}>{h}</span>
          ))}
        </div>

        {isLoading ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: T2, fontSize: 12 }}>
            Loading customers…
          </div>
        ) : ranked.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center' }}>
            <Users style={{ width: 28, height: 28, color: T2, margin: '0 auto 10px', display: 'block', opacity: 0.3 }} />
            <p style={{ fontSize: 12, color: T2, marginBottom: 6 }}>No active customers yet</p>
            <Link to="/kangqore-view/admin/kangqore-immp/blueprint-wizard"
              style={{ fontSize: 11, fontWeight: 700, color: BLUE, textDecoration: 'none' }}>
              Provision first customer →
            </Link>
          </div>
        ) : (
          ranked.map(({ bp }, i) => <CustomerRow key={bp.id} bp={bp} rank={i + 1} />)
        )}
      </div>

      {/* ── WAANDA guidance ── */}
      <div style={{ padding: '14px 16px', borderRadius: 10, background: PURP + '04', border: `1px solid ${PURP}15` }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: PURP, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 6 }}>
          WAANDA Intelligence
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            `COIG north-star: aggregate OIS delta across all ${blueprints.length} active tenants = +${totalCoig.toFixed(1)} pts`,
            'Target: +10 pts per customer per quarter. A drop > 5 in 7 days triggers an automatic CSM alert.',
            `Fleet average OIS trajectory: ${aggBase.toFixed(0)} → ${agg30.toFixed(0)} (D30) → ${agg60.toFixed(0)} (D60) → ${agg90.toFixed(0)} (D90)`,
          ].map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, color: T2 }}>
              <Zap style={{ width: 11, height: 11, color: PURP, flexShrink: 0, marginTop: 2 }} />
              {line}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 9, color: T2, marginTop: 8 }}>Last updated: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—'}</p>
      </div>

    </div>
  )
}
