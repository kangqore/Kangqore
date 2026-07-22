import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  TrendingUp, Users, DollarSign, Target, Cpu, BarChart3,
  ArrowUp, ArrowDown, Minus, Brain, Activity, ShieldCheck,
  Briefcase, Globe, Zap,
} from 'lucide-react'

const S: Record<string, React.CSSProperties> = {
  page:    { display: 'flex', flexDirection: 'column', gap: 24, padding: '4px 0' },
  grid4:   { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },
  grid3:   { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  grid2:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card:    { background: 'var(--os-surface-1)', border: '1px solid var(--os-border)', borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 },
  cardH:   { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: 'var(--os-text-3)', textTransform: 'uppercase' as const },
  kpiCard: { background: 'var(--os-surface-1)', border: '1px solid var(--os-border)', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 },
  row:     { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' },
  badge:   { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20 },
}

function trend(v: number | null | undefined) {
  if (v == null) return <Minus size={12} color="var(--os-text-4)" />
  if (v > 0) return <ArrowUp size={12} color="var(--os-success)" />
  if (v < 0) return <ArrowDown size={12} color="var(--os-danger)" />
  return <Minus size={12} color="var(--os-text-4)" />
}

function fmt(n: number | null | undefined, prefix = ''): string {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(1)}K`
  return `${prefix}${n.toFixed(0)}`
}

export const ExecutiveWorkspacePage: React.FC = () => {
  const { data: kpis } = useQuery({
    queryKey: ['ws-financial-kpis'],
    queryFn: () => api.get('/admin/financial-kpis').then(r => r.data).catch(() => null),
  })
  const { data: coig } = useQuery({
    queryKey: ['ws-coig'],
    queryFn: () => api.get('/admin/enterprise/coig').then(r => r.data).catch(() => null),
  })
  const { data: coigWeek } = useQuery({
    queryKey: ['ws-coig-week'],
    queryFn: () => api.get('/admin/enterprise/coig/week-report').then(r => r.data).catch(() => null),
  })
  const { data: sysHealth } = useQuery({
    queryKey: ['ws-sys-health'],
    queryFn: () => api.get('/admin/kangqore-immp/system-health').then(r => r.data).catch(() => null),
  })
  const { data: insights } = useQuery({
    queryKey: ['ws-exec-insights'],
    queryFn: () => api.get('/admin/kangqore-immp/insights?limit=8').then(r => r.data).catch(() => []),
  })

  const arr     = kpis?.arr ?? kpis?.annualRecurringRevenue ?? null
  const mrr     = kpis?.mrr ?? kpis?.monthlyRecurringRevenue ?? null
  const clients  = kpis?.activeClients ?? kpis?.totalClients ?? null
  const nps     = kpis?.nps ?? kpis?.netPromoterScore ?? null
  const churn   = kpis?.churnRate ?? null
  const cac     = kpis?.cac ?? null
  const ltv     = kpis?.ltv ?? null

  const coigScore  = coig?.score ?? coig?.coigScore ?? null
  const velocity   = coig?.velocity ?? coig?.weeklyVelocity ?? coigWeek?.velocity ?? null
  const momentum   = coig?.momentum ?? coigWeek?.momentum ?? null

  const agents     = sysHealth?.activeAgents ?? sysHealth?.agentCount ?? null
  const agentUp    = sysHealth?.agentHealth ?? sysHealth?.agentUptime ?? null
  const activeMiss = sysHealth?.activeMissions ?? null
  const oisScore   = sysHealth?.oisScore ?? null

  return (
    <div style={S.page}>

      {/* ── KPI Grid ── */}
      <div style={S.card}>
        <span style={S.cardH}>Enterprise KPI Grid</span>
        <div style={S.grid4}>
          {[
            { icon: DollarSign, label: 'ARR', val: fmt(arr, '$'), sub: 'Annual Recurring Revenue', col: '#10b981' },
            { icon: TrendingUp,  label: 'MRR', val: fmt(mrr, '$'), sub: 'Monthly Recurring Revenue', col: '#579bfc' },
            { icon: Users,       label: 'Active Clients', val: clients != null ? `${clients}` : '—', sub: 'Live accounts', col: '#a78bfa' },
            { icon: Target,      label: 'NPS', val: nps != null ? `${nps}` : '—', sub: 'Net Promoter Score', col: '#f59e0b' },
          ].map(kpi => (
            <div key={kpi.label} style={{ ...S.kpiCard, borderTop: `3px solid ${kpi.col}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <kpi.icon size={14} color={kpi.col} />
                <span style={{ fontSize: 10, color: 'var(--os-text-3)', fontWeight: 600 }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{kpi.val}</div>
              <div style={{ fontSize: 9.5, color: 'var(--os-text-4)' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>
        <div style={S.grid4}>
          {[
            { label: 'Churn Rate', val: churn != null ? `${churn.toFixed(2)}%` : '—', good: churn != null && churn < 3 },
            { label: 'CAC',        val: fmt(cac, '$'), good: null },
            { label: 'LTV',        val: fmt(ltv, '$'), good: ltv != null && ltv > 0 },
            { label: 'LTV:CAC',    val: (ltv && cac) ? (ltv / cac).toFixed(1) + 'x' : '—', good: ltv && cac ? ltv / cac >= 3 : null },
          ].map(m => (
            <div key={m.label} style={{ padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: m.good === true ? 'var(--os-success)' : m.good === false ? 'var(--os-danger)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
              <div style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.grid3}>
        {/* ── COIG Velocity ── */}
        <div style={{ ...S.card, gridColumn: '1 / 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart3 size={13} color="#579bfc" />
            <span style={S.cardH}>COIG Velocity</span>
          </div>

          {coigScore !== null ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: coigScore >= 70 ? 'var(--os-success)' : coigScore >= 50 ? 'var(--os-warning)' : 'var(--os-danger)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {typeof coigScore === 'number' ? coigScore.toFixed(1) : coigScore}
                </span>
                <span style={{ fontSize: 12, color: 'var(--os-text-3)' }}>/100</span>
              </div>
              <div style={{ height: 6, borderRadius: 6, background: 'var(--os-surface-3)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 6, width: `${coigScore}%`, background: 'linear-gradient(90deg,#579bfc,#a78bfa)', transition: 'width .5s' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  { label: 'Week Velocity', val: velocity != null ? `${velocity.toFixed(1)}` : '—' },
                  { label: 'Momentum', val: momentum != null ? (momentum > 0 ? `+${momentum.toFixed(1)}` : `${momentum.toFixed(1)}`) : '—' },
                  { label: 'Active Customers', val: coig?.activeCustomers ?? coigWeek?.activeCustomers ?? '—' },
                  { label: 'At-Risk', val: coig?.atRisk ?? coigWeek?.atRisk ?? '—' },
                ].map(m => (
                  <div key={m.label} style={S.row}>
                    <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-2)' }}>{m.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{m.val}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>COIG data loading…</div>
          )}
        </div>

        {/* ── Agent Health ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Brain size={13} color="#a78bfa" />
            <span style={S.cardH}>Agent Health</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Active Agents', val: agents ?? '—', col: '#a78bfa' },
              { label: 'Uptime', val: agentUp != null ? `${agentUp}%` : '—', col: 'var(--os-success)' },
              { label: 'Active Missions', val: activeMiss ?? '—', col: '#579bfc' },
              { label: 'OIS Score', val: oisScore != null ? `${oisScore.toFixed(1)}` : '—', col: '#f59e0b' },
            ].map(m => (
              <div key={m.label} style={{ padding: '12px 10px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: m.col, fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
                <div style={{ fontSize: 9.5, color: 'var(--os-text-4)', marginTop: 3 }}>{m.label}</div>
              </div>
            ))}
          </div>
          {sysHealth?.engines && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--os-text-4)', fontWeight: 600 }}>ENGINE STATUS</span>
              {Object.entries(sysHealth.engines).slice(0, 5).map(([name, status]: [string, any]) => (
                <div key={name} style={S.row}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: status === 'UP' || status === 'ACTIVE' ? 'var(--os-success)' : status === 'DEGRADED' ? 'var(--os-warning)' : 'var(--os-danger)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-2)' }}>{name}</span>
                  <span style={{ fontSize: 10, color: 'var(--os-text-3)' }}>{String(status)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Intelligence Digest ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={13} color="#f59e0b" />
            <span style={S.cardH}>Intelligence Digest</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(Array.isArray(insights) ? insights : []).slice(0, 6).length === 0 ? (
              <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 12 }}>No insights yet</div>
            ) : (Array.isArray(insights) ? insights : []).slice(0, 6).map((ins: any, i: number) => (
              <div key={ins.id ?? i} style={{ padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-1)', marginBottom: 2 }}>
                  {ins.title ?? ins.type ?? 'Executive Insight'}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--os-text-3)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ins.body ?? ins.description ?? ins.content ?? ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Week summary cards ── */}
      {coigWeek && (
        <div style={S.card}>
          <span style={S.cardH}>Week-over-Week Performance</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {Object.entries(coigWeek).filter(([k]) => !['id','createdAt','updatedAt','activeCustomers','atRisk'].includes(k)).slice(0, 5).map(([k, v]: [string, any]) => (
              <div key={k} style={{ padding: '10px 8px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>
                  {typeof v === 'number' ? v.toFixed(1) : String(v ?? '—')}
                </div>
                <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2 }}>
                  {k.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
