import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Zap, Target, Clock, CheckCircle2, Lock, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoigSnapshot {
  date:  string
  ois:   number
  coig:  number
  label: string
}

interface CoigTrend {
  baseline:  { date: string; ois: number } | null
  current:   number | null
  coig:      number | null
  snapshots: CoigSnapshot[]
  velocity:  number | null
  projected: { ois90d: number | null; coig90d: number | null }
}

interface Scorecard {
  period:              string
  decisionsMade:       number
  decisionsWithOutcome: number
  completionRate:      number
  lessonsCreated:      number
  insightsSynthesised: number
  automationRate:      number
}

// ─── OIS Sparkline (canvas) ───────────────────────────────────────────────────

function OISSpark({ snapshots, projected }: { snapshots: CoigSnapshot[]; projected: { ois90d: number | null } }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || snapshots.length < 2) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width  = W * window.devicePixelRatio
    canvas.height = H * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const allPoints = [...snapshots]
    if (projected.ois90d) {
      allPoints.push({ date: new Date(Date.now() + 90 * 86400_000).toISOString(), ois: projected.ois90d, coig: 0, label: 'projected' })
    }

    const minOIS = Math.max(0,   Math.min(...allPoints.map(p => p.ois)) - 5)
    const maxOIS = Math.min(100, Math.max(...allPoints.map(p => p.ois)) + 5)
    const range  = maxOIS - minOIS || 1

    const px = (i: number) => (i / (allPoints.length - 1)) * (W - 20) + 10
    const py = (v: number) => H - 20 - ((v - minOIS) / range) * (H - 30)

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, '#7c3aed40')
    grad.addColorStop(1, '#7c3aed00')
    ctx.beginPath()
    allPoints.forEach((p, i) => { i === 0 ? ctx.moveTo(px(i), py(p.ois)) : ctx.lineTo(px(i), py(p.ois)) })
    ctx.lineTo(px(allPoints.length - 1), H)
    ctx.lineTo(px(0), H)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    // Historical line (solid purple)
    ctx.beginPath()
    ctx.strokeStyle = '#7c3aed'
    ctx.lineWidth = 2
    snapshots.forEach((p, i) => { i === 0 ? ctx.moveTo(px(i), py(p.ois)) : ctx.lineTo(px(i), py(p.ois)) })
    ctx.stroke()

    // Projected segment (dashed green)
    if (projected.ois90d && snapshots.length > 0) {
      const lastIdx = snapshots.length - 1
      ctx.beginPath()
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 1.5
      ctx.moveTo(px(lastIdx), py(snapshots[lastIdx].ois))
      ctx.lineTo(px(allPoints.length - 1), py(projected.ois90d))
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Dots on real snapshots
    snapshots.forEach((p, i) => {
      ctx.beginPath()
      ctx.arc(px(i), py(p.ois), 3, 0, Math.PI * 2)
      ctx.fillStyle = p.label === 'BASELINE' ? '#f59e0b' : '#7c3aed'
      ctx.fill()
    })

    // OIS labels on y-axis endpoints
    ctx.fillStyle = '#888'
    ctx.font = '10px system-ui'
    ctx.fillText(`${Math.round(minOIS)}`, 2, H - 20)
    ctx.fillText(`${Math.round(maxOIS)}`, 2, 14)
  }, [snapshots, projected])

  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
}

// ─── Department COIG row ──────────────────────────────────────────────────────

const DEPTS = [
  { id: 'projects', label: 'Projects & Delivery', color: '#10b981', since: 'S10-C', live: true,  oisContrib: 2.1 },
  { id: 'finance',  label: 'Finance & Budget',    color: '#2564ea', since: 'S12',   live: true,  oisContrib: 1.8 },
  { id: 'sales',    label: 'Sales & Leads',       color: '#7c3aed', since: 'S13',   live: true,  oisContrib: 1.4 },
  { id: 'hr',       label: 'People & HR',         color: '#f59e0b', since: 'S15',   live: true,  oisContrib: 0.9 },
  { id: 'leadership',label: 'Leadership',         color: '#0d9488', since: '—',     live: false, oisContrib: 0   },
]

function DeptRow({ dept }: { dept: typeof DEPTS[number] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: '1px solid var(--os-border)' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: dept.live ? dept.color : 'var(--os-border)', flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: dept.live ? 'var(--os-text-1)' : 'var(--os-text-2)', flex: 1 }}>{dept.label}</span>
      {dept.live ? (
        <>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: '#10b98115', padding: '2px 8px', borderRadius: 20 }}>WEE Live · {dept.since}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: dept.color, fontVariantNumeric: 'tabular-nums', minWidth: 48, textAlign: 'right' }}>+{dept.oisContrib}</span>
        </>
      ) : (
        <>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-2)', display: 'flex', alignItems: 'center', gap: 4 }}><Lock size={10} /> Pending activation</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-2)', minWidth: 48, textAlign: 'right' }}>—</span>
        </>
      )}
    </div>
  )
}

// ─── Customer card ────────────────────────────────────────────────────────────

function CustomerCard(props: { name: string; oisBefore: number; oisNow: number | null; label: string; locked?: boolean; color: string }) {
  const coig = props.oisNow != null ? Math.round((props.oisNow - props.oisBefore) * 10) / 10 : null
  return (
    <div style={{ background: props.locked ? 'var(--os-card)' : props.color + '0d', border: `1.5px solid ${props.locked ? 'var(--os-border)' : props.color + '30'}`, borderRadius: 14, padding: '20px 22px', opacity: props.locked ? 0.6 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: props.locked ? 'var(--os-text-2)' : props.color }}>{props.name}</span>
        {props.locked
          ? <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-2)', background: 'var(--os-border)', padding: '2px 7px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}><Lock size={8} /> {props.label}</span>
          : <span style={{ fontSize: 9, fontWeight: 700, color: '#10b981', background: '#10b98118', padding: '2px 7px', borderRadius: 20 }}>● Live · {props.label}</span>
        }
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { label: 'OIS Before', value: props.oisBefore.toFixed(1), color: '#888' },
          { label: 'OIS Now',    value: props.oisNow != null ? props.oisNow.toFixed(1) : '—', color: props.color },
          { label: 'COIG™',      value: coig != null ? `+${coig}` : '—', color: coig != null && coig > 0 ? '#10b981' : '#888' },
        ].map(m => (
          <div key={m.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-2)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function COIGDashboardPage() {
  const [scorecardWindow, setScorecardWindow] = useState<'week' | 'month' | 'quarter'>('week')

  const { data: trendData, isLoading: loadingTrend, refetch } = useQuery<CoigTrend>({
    queryKey: ['coig-trend'],
    queryFn: () => api.get('/admin/kangqore-immp/cognition/coig/trend').then(r => r.data),
    staleTime: 60_000,
  })

  const { data: scorecardData, isLoading: loadingScorecard } = useQuery<Scorecard>({
    queryKey: ['coig-scorecard', scorecardWindow],
    queryFn: () => api.get(`/admin/kangqore-immp/cognition/scorecard?window=${scorecardWindow}`).then(r => r.data),
    staleTime: 60_000,
  })

  const trend      = trendData
  const coig       = trend?.coig
  const currentOIS = trend?.current
  const baseOIS    = trend?.baseline?.ois ?? 78.9
  const velocity   = trend?.velocity
  const ois90d     = trend?.projected.ois90d
  const coig90d    = trend?.projected.coig90d

  const coigPositive = coig != null && coig > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 20, borderBottom: '1px solid var(--os-border)' }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}>
          <TrendingUp size={16} style={{ color: '#fff' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--os-text-1)' }}>COIG™ Dashboard — Customer Operational Intelligence Gain</div>
          <div style={{ fontSize: 12, color: 'var(--os-text-2)', marginTop: 2 }}>
            OIS improvement attributable to Kangqore View. One number per customer. Not features — accountability.
          </div>
        </div>
        <button onClick={() => refetch()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--os-text-2)', padding: 8 }}>
          <RefreshCw size={14} />
        </button>
        {loadingTrend && <Spinner size="sm" />}
      </div>

      {/* Hero COIG numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'OIS Baseline',  value: baseOIS.toFixed(1),                        sub: trend?.baseline?.date ? new Date(trend.baseline.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : 'Day 0', color: '#f59e0b' },
          { label: 'OIS Now',       value: currentOIS != null ? currentOIS.toFixed(1) : '—', sub: 'Live · Gate 8', color: '#7c3aed' },
          { label: 'COIG™',         value: coig != null ? `${coigPositive ? '+' : ''}${coig}` : '—', sub: 'Total gain', color: coigPositive ? '#10b981' : '#888' },
          { label: '90-Day Target', value: ois90d != null ? ois90d.toFixed(1) : '—',  sub: coig90d != null ? `+${coig90d} projected` : 'Need more data', color: '#0d9488' },
        ].map(m => (
          <div key={m.label} style={{ background: m.color + '0d', border: `1.5px solid ${m.color}25`, borderRadius: 14, padding: '18px 22px' }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginBottom: 6 }}>
              {m.value}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)', marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-2)' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Velocity + OIS chart row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14 }}>

        {/* OIS trend chart */}
        <div style={{ background: 'var(--os-card)', borderRadius: 14, padding: '18px 20px', boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)' }}>OIS Trend</span>
            <div style={{ display: 'flex', gap: 14, fontSize: 10, color: 'var(--os-text-2)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 2, background: '#7c3aed', display: 'inline-block', borderRadius: 1 }} /> Actual</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 2, background: '#10b981', display: 'inline-block', borderRadius: 1, borderTop: '1px dashed #10b981', background: 'none', borderBottom: 'none' }} /> 90d projection</span>
            </div>
          </div>
          <div style={{ height: 160 }}>
            {(trend?.snapshots.length ?? 0) >= 2
              ? <OISSpark snapshots={trend!.snapshots} projected={trend!.projected} />
              : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--os-text-2)', fontSize: 12 }}>
                  Collecting snapshots — Gate 8 history will appear here
                </div>
            }
          </div>
        </div>

        {/* Velocity + projection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--os-card)', borderRadius: 14, padding: '18px 20px', flex: 1, boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 10 }}>
              OIS Velocity
            </div>
            {velocity != null ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: velocity > 0 ? '#10b981' : '#ef4444', fontVariantNumeric: 'tabular-nums' }}>
                  {velocity > 0 ? '+' : ''}{velocity.toFixed(2)}
                </span>
                <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>pts/week</span>
              </div>
            ) : (
              <span style={{ fontSize: 13, color: 'var(--os-text-2)' }}>—</span>
            )}
            {velocity != null && (
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--os-text-2)' }}>
                {velocity > 0
                  ? `At this rate, +${(velocity * 13).toFixed(1)} pts in 90 days`
                  : 'Run more Gate 8 checks to establish velocity'
                }
              </div>
            )}
          </div>
          <div style={{ background: 'var(--os-card)', borderRadius: 14, padding: '18px 20px', flex: 1, boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 10 }}>
              Snapshots
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--os-text-1)' }}>
              {trend?.snapshots.length ?? 0}
            </div>
            <div style={{ fontSize: 11, color: 'var(--os-text-2)', marginTop: 4 }}>
              Gate 8 measurements
            </div>
          </div>
        </div>
      </div>

      {/* Customers */}
      <div>
        <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 12 }}>
          Customer COIG™ Scores
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <CustomerCard
            name="Kangqore (Customer Zero)"
            oisBefore={78.9}
            oisNow={currentOIS ?? 88.6}
            label="Go-Live · S10"
            color="#7c3aed"
          />
          <CustomerCard
            name="Birla Digital Labs (Customer One)"
            oisBefore={62.0}
            oisNow={62.0}
            label="Day 0 · Blueprint Active · 2026-07-17"
            color="#10b981"
          />
        </div>
      </div>

      {/* Department COIG attribution */}
      <div>
        <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 12 }}>
          OIS Gain Attribution by Department
        </h3>
        <div style={{ background: 'var(--os-card)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
          {DEPTS.map(d => <DeptRow key={d.id} dept={d} />)}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: 'var(--os-surface-0)' }}>
            <div style={{ width: 8, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--os-text-1)', flex: 1 }}>Total WEE-attributed OIS gain</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#10b981', fontVariantNumeric: 'tabular-nums', minWidth: 48, textAlign: 'right' }}>
              +{DEPTS.filter(d => d.live).reduce((s, d) => s + d.oisContrib, 0).toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* COIG Scorecard */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)' }}>
            Intelligence Scorecard
          </h3>
          {loadingScorecard && <Spinner size="sm" />}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {(['week', 'month', 'quarter'] as const).map(w => (
              <button key={w} onClick={() => setScorecardWindow(w)} style={{
                fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: scorecardWindow === w ? '#7c3aed' : 'var(--os-card)',
                color: scorecardWindow === w ? '#fff' : 'var(--os-text-2)',
              }}>
                {w.charAt(0).toUpperCase() + w.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {scorecardData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Decisions Made',    value: scorecardData.decisionsMade,       sub: `${scorecardData.completionRate}% with outcome`, color: '#7c3aed', Icon: Target },
              { label: 'Lessons Created',   value: scorecardData.lessonsCreated,      sub: `${scorecardData.insightsSynthesised} insights`, color: '#2564ea', Icon: Zap },
              { label: 'Automation Rate',   value: `${scorecardData.automationRate}%`, sub: 'of autopilot actions approved', color: '#10b981', Icon: CheckCircle2 },
            ].map(m => {
              const Icon = m.Icon
              return (
                <div key={m.label} style={{ background: m.color + '0d', border: `1px solid ${m.color}22`, borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ color: m.color, marginBottom: 8 }}><Icon size={16} /></div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)', marginTop: 6 }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--os-text-2)', marginTop: 2 }}>{m.sub}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Snapshot history */}
      {(trend?.snapshots.length ?? 0) > 0 && (
        <div>
          <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 12 }}>
            OIS Snapshot History
          </h3>
          <div style={{ background: 'var(--os-card)', borderRadius: 14, overflow: 'hidden' }}>
            {[...trend!.snapshots].reverse().slice(0, 10).map((snap, i) => {
              const prev = [...trend!.snapshots].reverse()[i + 1]
              const delta = prev ? Math.round((snap.ois - prev.ois) * 10) / 10 : null
              return (
                <div key={snap.date} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--os-border)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', background: '#f59e0b15', padding: '2px 8px', borderRadius: 8, flexShrink: 0 }}>
                    {snap.label || 'Snapshot'}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                    {snap.ois.toFixed(1)}
                  </span>
                  {delta != null && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: delta >= 0 ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                      {delta >= 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {Math.abs(delta)}
                    </span>
                  )}
                  <span style={{ fontSize: 10, color: 'var(--os-text-2)', marginLeft: 'auto' }}>
                    {new Date(snap.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
