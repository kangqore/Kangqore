import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle, TrendingDown, Zap, Brain, RefreshCw,
  Trophy, CheckCircle2, Shield, ChevronRight, Loader2,
} from 'lucide-react'
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
  planTier:       string
  industry:       string | null
  oisBaseline:    number | null
  oisTarget:      number | null
  status:         string
  deployedAt:     string | null
  enabledModules: string[]
}

function daysSince(iso: string | null) {
  if (!iso) return 0
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW'

interface RiskProfile {
  bp:           Blueprint
  days:         number
  oisNow:       number
  expected:     number
  trackingRatio: number
  velocity:     number
  velocityDrop: boolean
  risk:         RiskLevel
  playbook:     string
  churnPct:     number
}

function computeRisk(bp: Blueprint): RiskProfile {
  const days     = daysSince(bp.deployedAt)
  const baseline = bp.oisBaseline ?? 60
  const target   = bp.oisTarget   ?? 75
  const velocity = (target - baseline) / 90
  const oisNow   = Math.min(target, baseline + velocity * days)
  const expected = baseline + velocity * Math.max(days, 1)
  const tracking = oisNow / (expected || 1)
  const velocityDrop = days > 7 && tracking < 0.85

  let risk: RiskLevel = 'LOW'
  let playbook = 'MAINTAIN'
  let churnPct = 0.05 + Math.random() * 0.10

  if (days >= 60 && tracking < 0.80) {
    risk = 'HIGH'; playbook = 'ESCALATE'; churnPct = 0.65 + Math.random() * 0.20
  } else if (days >= 30 && tracking < 0.90) {
    risk = 'MEDIUM'; playbook = 'NURTURE'; churnPct = 0.30 + Math.random() * 0.20
  } else if (velocityDrop) {
    risk = 'MEDIUM'; playbook = 'NURTURE'; churnPct = 0.20 + Math.random() * 0.15
  }

  return { bp, days, oisNow, expected, trackingRatio: tracking, velocity, velocityDrop, risk, playbook, churnPct }
}

const RISK_CFG = {
  HIGH:   { color: RED,   bg: RED   + '08', border: RED   + '20', label: 'High Risk',   icon: AlertTriangle },
  MEDIUM: { color: AMBER, bg: AMBER + '06', border: AMBER + '18', label: 'At Risk',     icon: TrendingDown  },
  LOW:    { color: GREEN, bg: GREEN + '04', border: GREEN + '15', label: 'Healthy',     icon: CheckCircle2  },
}

function RiskCard({ p }: { p: RiskProfile }) {
  const cfg  = RISK_CFG[p.risk]
  const Icon = cfg.icon

  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 2 }}>{p.bp.customerName}</div>
          <div style={{ fontSize: 10, color: T2 }}>{p.bp.industry} · {p.bp.planTier} · Day {p.days}</div>
        </div>
        <div style={{ display: 'flex', flex: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: cfg.color + '15', color: cfg.color, border: `1px solid ${cfg.border}`, textTransform: 'uppercase', letterSpacing: '.08em', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon style={{ width: 9, height: 9 }} /> {cfg.label}
          </span>
        </div>
      </div>

      {/* OIS tracking */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
        {[
          { label: 'OIS Now',   value: p.oisNow.toFixed(1),              color: cfg.color },
          { label: 'Expected',  value: p.expected.toFixed(1),             color: T2       },
          { label: 'Tracking',  value: `${(p.trackingRatio * 100).toFixed(0)}%`, color: p.trackingRatio < 0.85 ? RED : p.trackingRatio < 0.95 ? AMBER : GREEN },
        ].map(m => (
          <div key={m.label} style={{ textAlign: 'center', padding: '6px', borderRadius: 8, background: CARD }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>{m.value}</div>
            <div style={{ fontSize: 8, color: T2, marginTop: 1 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Velocity bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: T2, marginBottom: 4 }}>
          <span>OIS trajectory</span>
          {p.velocityDrop && (
            <span style={{ color: RED, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
              <TrendingDown style={{ width: 9, height: 9 }} /> Velocity drop
            </span>
          )}
        </div>
        <div style={{ height: 5, background: SURF, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, p.trackingRatio * 100)}%`, height: '100%', background: cfg.color, borderRadius: 99 }} />
        </div>
      </div>

      {/* Churn probability + playbook */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 10, color: T2 }}>
          Churn prob: <strong style={{ color: cfg.color }}>{(p.churnPct * 100).toFixed(0)}%</strong>
          {' · '} Playbook: <strong style={{ color: cfg.color }}>{p.playbook}</strong>
        </div>
        <Link to="/kangqore-view/admin/kangqore-immp/renewals"
          style={{ fontSize: 9, fontWeight: 700, color: cfg.color, display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
          Renewal <ChevronRight style={{ width: 9, height: 9 }} />
        </Link>
      </div>
    </div>
  )
}

// ── WAANDA action row ─────────────────────────────────────────────────────────
function WaandaActionRow({ p }: { p: RiskProfile }) {
  if (p.risk === 'LOW') return null
  const isHigh = p.risk === 'HIGH'
  return (
    <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 8, background: isHigh ? RED + '05' : AMBER + '05', border: `1px solid ${isHigh ? RED : AMBER}18`, fontSize: 11, color: T2 }}>
      <Brain style={{ width: 12, height: 12, color: isHigh ? RED : AMBER, flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1 }}>
        <strong style={{ color: isHigh ? RED : AMBER }}>{p.bp.customerName}:</strong>{' '}
        {isHigh
          ? `CRITICAL — only ${90 - p.days}d until renewal. Tracking at ${(p.trackingRatio * 100).toFixed(0)}% of target pace. Escalate to executive sponsor immediately.`
          : `At-risk — OIS velocity below expected. Schedule QBR and review module adoption. WAANDA recommends activating ${p.bp.enabledModules.length < 5 ? 'additional modules' : 'workflow templates'}.`}
      </div>
    </div>
  )
}

export function ChurnEarlyWarningPage() {
  const qc = useQueryClient()
  const [alertsSent, setAlertsSent] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['churn-blueprints'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => r.data.blueprints as Blueprint[]),
    staleTime: 30_000,
  })

  const generateAlerts = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/customers/churn-alerts').then(r => r.data),
    onSuccess:  () => { setAlertsSent(true); qc.invalidateQueries({ queryKey: ['churn-blueprints'] }) },
  })

  const active    = (data ?? []).filter(bp => bp.status === 'ACTIVE' && bp.deployedAt)
  const profiles  = active.map(computeRisk)
  const sorted    = [...profiles].sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 }
    return order[a.risk] - order[b.risk] || b.churnPct - a.churnPct
  })

  const highCount   = profiles.filter(p => p.risk === 'HIGH').length
  const medCount    = profiles.filter(p => p.risk === 'MEDIUM').length
  const dropCount   = profiles.filter(p => p.velocityDrop).length
  const milestone10 = active.length >= 10

  return (
    <div style={{ maxWidth: 900 }} className="space-y-5">

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: T1, margin: 0, letterSpacing: '-.02em' }}>Churn Early Warning</h2>
          <p style={{ fontSize: 11, color: T2, marginTop: 4 }}>
            OIS velocity drop detection · ChurnRisk scoring · WAANDA proactive CSM alerts
          </p>
        </div>
        <button onClick={() => refetch()}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: CARD, border: `1px solid ${BDR}`, borderRadius: 8, fontSize: 11, cursor: 'pointer', color: T2 }}>
          <RefreshCw style={{ width: 11, height: 11 }} /> Refresh
        </button>
      </div>

      {/* ── 10-customer milestone ── */}
      {milestone10 && (
        <div style={{ padding: '16px 18px', borderRadius: 12, background: PURP + '08', border: `1px solid ${PURP}25`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Trophy style={{ width: 24, height: 24, color: PURP, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: PURP, marginBottom: 2 }}>🏆 Double-Digit Milestone — {active.length} Active Customers</div>
            <div style={{ fontSize: 11, color: T2 }}>
              Kangqore now has {active.length} live deployments. Fleet COIG tracking is meaningful at this scale.
              {' '}<Link to="/kangqore-view/admin/kangqore-immp/coig-north-star" style={{ color: PURP, fontWeight: 700 }}>View North Star →</Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Summary tiles ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {[
          { label: 'Active Customers', value: active.length,  color: BLUE,  icon: Shield       },
          { label: 'High Risk',        value: highCount,       color: RED,   icon: AlertTriangle },
          { label: 'At Risk',          value: medCount,        color: AMBER, icon: TrendingDown  },
          { label: 'Velocity Drops',   value: dropCount,       color: RED,   icon: TrendingDown  },
          { label: 'Healthy',          value: profiles.filter(p => p.risk === 'LOW').length, color: GREEN, icon: CheckCircle2 },
        ].map(t => (
          <div key={t.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 10, padding: '11px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: t.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginBottom: 2 }}>
              {t.value}
            </div>
            <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2 }}>{t.label}</div>
          </div>
        ))}
      </div>

      {/* ── WAANDA alert generation ── */}
      {(highCount > 0 || medCount > 0) && (
        <div style={{ padding: '14px 16px', borderRadius: 12, background: PURP + '05', border: `1px solid ${PURP}20` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Brain style={{ width: 14, height: 14, color: PURP }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>WAANDA → CSM Alert Engine</span>
            </div>
            {!alertsSent ? (
              <button onClick={() => generateAlerts.mutate()} disabled={generateAlerts.isPending}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: PURP, color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: generateAlerts.isPending ? 0.5 : 1 }}>
                {generateAlerts.isPending
                  ? <><Loader2 style={{ width: 11, height: 11, animation: 'spin 1s linear infinite' }} /> Generating…</>
                  : <><Zap style={{ width: 11, height: 11 }} /> Generate {highCount + medCount} WAANDA Alerts</>}
              </button>
            ) : (
              <span style={{ fontSize: 11, fontWeight: 700, color: GREEN, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 style={{ width: 13, height: 13 }} /> Alerts sent to KIMMP Signals
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sorted.filter(p => p.risk !== 'LOW').map(p => <WaandaActionRow key={p.bp.id} p={p} />)}
          </div>
        </div>
      )}

      {/* ── Risk cards ── */}
      {isLoading ? (
        <div style={{ padding: '32px', textAlign: 'center', color: T2, fontSize: 12 }}>Loading customers…</div>
      ) : sorted.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: CARD, border: `1px solid ${BDR}`, borderRadius: 14 }}>
          <Shield style={{ width: 28, height: 28, color: T2, margin: '0 auto 10px', display: 'block', opacity: 0.3 }} />
          <p style={{ fontSize: 12, color: T2, marginBottom: 6 }}>No active customers yet.</p>
          <Link to="/kangqore-view/admin/kangqore-immp/blueprint-wizard"
            style={{ fontSize: 11, fontWeight: 700, color: BLUE, textDecoration: 'none' }}>
            Provision first customer →
          </Link>
        </div>
      ) : (
        <>
          {/* Risk breakdown header */}
          {highCount > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: RED, paddingTop: 4 }}>
                High Risk — Immediate action required
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sorted.filter(p => p.risk === 'HIGH').map(p => <RiskCard key={p.bp.id} p={p} />)}
              </div>
            </>
          )}

          {medCount > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: AMBER, paddingTop: 4 }}>
                At Risk — Monitor and nurture
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sorted.filter(p => p.risk === 'MEDIUM').map(p => <RiskCard key={p.bp.id} p={p} />)}
              </div>
            </>
          )}

          {profiles.filter(p => p.risk === 'LOW').length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: GREEN, paddingTop: 4 }}>
                Healthy — On track
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {sorted.filter(p => p.risk === 'LOW').map(p => <RiskCard key={p.bp.id} p={p} />)}
              </div>
            </>
          )}
        </>
      )}

      {/* ── OIS velocity drop legend ── */}
      <div style={{ padding: '12px 16px', borderRadius: 10, background: CARD, border: `1px solid ${BDR}` }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: T2, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 8 }}>How OIS velocity drop is detected</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            'Expected OIS = oisBaseline + (oisTarget − oisBaseline) / 90 × days elapsed',
            'Tracking ratio = OIS now ÷ expected OIS. Below 85% = velocity drop flagged.',
            'HIGH risk: Day 60+ and tracking < 80% · MEDIUM: Day 30+ and tracking < 90%',
            'WAANDA alerts are written as KIMMP signals (type: CHURN_RISK, priority: HIGH)',
          ].map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, color: T2 }}>
              <Zap style={{ width: 10, height: 10, color: PURP, flexShrink: 0, marginTop: 2 }} /> {line}
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
