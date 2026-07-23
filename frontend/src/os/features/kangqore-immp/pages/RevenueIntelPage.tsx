import { useQuery } from '@tanstack/react-query'
import { TrendingUp, DollarSign, Users, Zap, AlertTriangle, CheckCircle2, Activity } from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const GREEN = '#10b981'
const BLUE  = '#3b82f6'
const PURP  = '#7c3aed'
const AMB   = '#f59e0b'
const RED   = '#ef4444'
const TEAL  = '#0d9488'

function fmt(n: number) { return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toFixed(0)}` }

function MetricCard({ label, value, sub, color, Icon }: { label: string; value: string; sub?: string; color: string; Icon: React.ElementType }) {
  return (
    <div className="rounded-2xl p-5 border flex items-start gap-4" style={{ background: CARD, borderColor: BDR }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: T2 }}>{label}</p>
        <p className="text-2xl font-black tabular-nums" style={{ color: T1 }}>{value}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: T2 }}>{sub}</p>}
      </div>
    </div>
  )
}

function TierBar({ tier, count, total, color }: { tier: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-bold w-12 flex-shrink-0" style={{ color }}>{tier}</span>
      <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ background: `${color}15` }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[11px] tabular-nums font-semibold w-6 text-right flex-shrink-0" style={{ color: T2 }}>{count}</span>
    </div>
  )
}

function RiskBadge({ tier, probability }: { tier: string; probability: number }) {
  const color = tier === 'RED' ? RED : tier === 'AMBER' ? AMB : GREEN
  const label = tier === 'RED' ? 'High' : tier === 'AMBER' ? 'Medium' : 'Low'
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}>
      {label} · {(probability * 100).toFixed(0)}%
    </span>
  )
}

interface RevenueMetrics {
  mrr: number; totalRevenue: number; platformRevenue: number
  capturedCount: number; activeSubscriptions: number; totalCharges: number
  tierCounts: Record<string, number>
  recentCharges: Array<{ id: string; amount: number; platformFee: number; status: string; currency: string; createdAt: string; stripePaymentIntentId?: string }>
}

interface ChurnCustomer {
  customerId: string; totalScore: number; tier: string; churnProbability: number; playbook: string; computedAt: string; renewalProximityDays: number
}

export function RevenueIntelPage() {
  const { data: rev, isLoading: revLoading } = useQuery<RevenueMetrics>({
    queryKey: ['revenue-intel-metrics'],
    queryFn: () => api.get('/admin/kangqore-immp/billing/revenue').then(r => r.data),
    staleTime: 60_000,
  })

  const { data: churnRaw } = useQuery<{ customers: ChurnCustomer[]; highRisk: number }>({
    queryKey: ['revenue-intel-churn'],
    queryFn: () => api.get('/admin/kangqore-immp/customers/churn-risk').then(r => r.data),
    staleTime: 60_000,
  })

  const customers = churnRaw?.customers ?? []
  const tierCounts = rev?.tierCounts ?? {}
  const totalTenants = Object.values(tierCounts).reduce((s, n) => s + n, 0)

  const TIER_COLORS: Record<string, string> = { FREE: TEAL, PRO: BLUE, ENTERPRISE: PURP, STARTER: GREEN }

  const STATUS_COLOR: Record<string, string> = { CAPTURED: GREEN, PENDING: AMB, REFUNDED: RED, FAILED: RED }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <TrendingUp className="w-6 h-6" style={{ color: GREEN }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-black" style={{ color: T1 }}>Revenue Intelligence</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(16,185,129,0.1)', color: GREEN }}>S99 · INTEL</span>
            </div>
            <p className="text-xs" style={{ color: T2 }}>
              MRR, tier distribution, renewal risk heatmap, and charge activity — unified commercial view across all customer deployments.
            </p>
          </div>
        </div>
      </div>

      {/* Metric row */}
      {revLoading ? (
        <div className="rounded-xl p-6 text-center border" style={{ background: CARD, borderColor: BDR }}>
          <p className="text-sm" style={{ color: T2 }}>Loading revenue data…</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="MRR" value={fmt(rev?.mrr ?? 0)} sub="Active subscriptions only" color={GREEN} Icon={TrendingUp} />
          <MetricCard label="Total Revenue" value={fmt(rev?.totalRevenue ?? 0)} sub={`${rev?.capturedCount ?? 0} captured charges`} color={BLUE} Icon={DollarSign} />
          <MetricCard label="Active Subscriptions" value={String(rev?.activeSubscriptions ?? 0)} sub={`${totalTenants} total tenants`} color={PURP} Icon={Users} />
          <MetricCard label="Platform Fees" value={fmt(rev?.platformRevenue ?? 0)} sub="Net platform take" color={AMB} Icon={Zap} />
        </div>
      )}

      {/* Tier breakdown + Renewal risk — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Tier distribution */}
        <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4" style={{ color: BLUE }} />
            <p className="text-sm font-bold" style={{ color: T1 }}>Tier Distribution</p>
          </div>
          {totalTenants === 0 ? (
            <p className="text-xs" style={{ color: T2 }}>No tenants provisioned yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(tierCounts).map(([tier, count]) => (
                <TierBar key={tier} tier={tier} count={count} total={totalTenants} color={TIER_COLORS[tier] ?? PURP} />
              ))}
              <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: BDR }}>
                <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: T2 }}>Total tenants</span>
                <span className="text-sm font-black tabular-nums" style={{ color: T1 }}>{totalTenants}</span>
              </div>
            </div>
          )}
        </div>

        {/* Renewal risk heatmap */}
        <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4" style={{ color: AMB }} />
            <p className="text-sm font-bold" style={{ color: T1 }}>Renewal Risk</p>
            {churnRaw && churnRaw.highRisk > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold ml-auto"
                style={{ background: `${RED}12`, color: RED }}>{churnRaw.highRisk} high-risk</span>
            )}
          </div>
          {customers.length === 0 ? (
            <p className="text-xs" style={{ color: T2 }}>No customer health scores computed yet. Run health scoring from the Churn Risk page.</p>
          ) : (
            <div className="space-y-2">
              {customers.sort((a, b) => b.churnProbability - a.churnProbability).slice(0, 6).map((c) => (
                <div key={c.customerId} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: SURF }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate" style={{ color: T1 }}>{c.customerId.slice(0, 12)}…</p>
                    <p className="text-[10px]" style={{ color: T2 }}>{c.playbook} · {c.renewalProximityDays}d to renewal</p>
                  </div>
                  <RiskBadge tier={c.tier} probability={c.churnProbability} />
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] font-black tabular-nums" style={{ color: T1 }}>{c.totalScore}<span className="text-[9px] font-normal ml-0.5">/100</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent charges */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4" style={{ color: GREEN }} />
          <p className="text-sm font-bold" style={{ color: T1 }}>Recent Charges</p>
          <span className="ml-auto text-[10px]" style={{ color: T2 }}>{rev?.totalCharges ?? 0} total</span>
        </div>
        {(rev?.recentCharges ?? []).length === 0 ? (
          <div className="rounded-xl p-4 border text-center" style={{ background: SURF, borderColor: BDR }}>
            <p className="text-xs" style={{ color: T2 }}>No charges yet — record the first revenue event from KEOS Billing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: `1px solid ${BDR}` }}>
                  {['Intent ID', 'Amount', 'Platform Fee', 'Net', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left py-2 px-2 font-bold uppercase tracking-wider text-[9px]" style={{ color: T2 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(rev?.recentCharges ?? []).map(c => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${BDR}40` }}>
                    <td className="py-2 px-2 font-mono text-[10px]" style={{ color: T2 }}>{(c.stripePaymentIntentId ?? c.id).slice(0, 16)}…</td>
                    <td className="py-2 px-2 font-bold tabular-nums" style={{ color: T1 }}>{fmt(c.amount)}</td>
                    <td className="py-2 px-2 tabular-nums" style={{ color: T2 }}>{fmt(c.platformFee)}</td>
                    <td className="py-2 px-2 font-bold tabular-nums" style={{ color: GREEN }}>{fmt(c.amount - c.platformFee)}</td>
                    <td className="py-2 px-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                        style={{ background: `${STATUS_COLOR[c.status] ?? AMB}12`, color: STATUS_COLOR[c.status] ?? AMB }}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2 px-2" style={{ color: T2 }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info callout */}
      <div className="rounded-xl p-4 border flex items-start gap-3"
        style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: BLUE }} />
        <p className="text-xs" style={{ color: T2 }}>
          <span className="font-bold" style={{ color: BLUE }}>Revenue Intelligence:</span>{' '}
          MRR is computed from active-status TenantOrganisations × tier pricing (no live Stripe call).
          Renewal risk is derived from CustomerHealthScore tier (RED/AMBER/GREEN). Run health scoring from Churn Risk page to refresh.
        </p>
      </div>
    </div>
  )
}
