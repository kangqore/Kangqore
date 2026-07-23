import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreditCard, TrendingUp, Users, Zap, CheckCircle2, Clock,
  AlertCircle, RefreshCw, DollarSign, Building2,
} from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const TEAL = '#10b981'
const PURP = '#7c3aed'
const BLUE = '#3b82f6'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const SURF = 'var(--os-surface-0)'

interface RevenueMetrics {
  mrr: number
  totalRevenue: number
  platformRevenue: number
  totalCharges: number
  capturedCount: number
  pendingCount: number
  refundedCount: number
  activeSubscriptions: number
  tierCounts: Record<string, number>
  recentCharges: Array<{
    id: string; amount: number; platformFee: number; currency: string
    status: string; createdAt: string; listingId: string
  }>
  stripeEnabled: boolean
}

interface SubscriptionData {
  tenants: Array<{
    id: string; name: string; subdomain: string; planTier: string
    subscriptionStatus: string | null; currentPeriodEnd: string | null
    monthlyValue: number; isActive: boolean; provisionedAt: string | null
  }>
  total: number
  stripeEnabled: boolean
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  active:   { label: 'Active',    color: TEAL, bg: 'rgba(16,185,129,0.1)'  },
  trial:    { label: 'Trial',     color: BLUE, bg: 'rgba(59,130,246,0.1)'  },
  past_due: { label: 'Past Due',  color: AMB,  bg: 'rgba(245,158,11,0.1)'  },
  churned:  { label: 'Churned',   color: RED,  bg: 'rgba(244,63,94,0.1)'   },
}
const CHARGE_STATUS: Record<string, { label: string; color: string }> = {
  CAPTURED: { label: 'Captured', color: TEAL },
  PENDING:  { label: 'Pending',  color: AMB  },
  FAILED:   { label: 'Failed',   color: RED  },
  REFUNDED: { label: 'Refunded', color: BLUE },
}

export function KEOSBillingPage() {
  const qc = useQueryClient()
  const [simDone, setSimDone] = useState(false)

  const { data: revenue, isLoading: revLoading } = useQuery<RevenueMetrics>({
    queryKey: ['billing-revenue'],
    queryFn:  () => api.get('/admin/kangqore-immp/billing/revenue').then(r => r.data),
    staleTime: 30_000,
  })

  const { data: subs, isLoading: subsLoading } = useQuery<SubscriptionData>({
    queryKey: ['billing-subscriptions'],
    queryFn:  () => api.get('/admin/kangqore-immp/billing/subscriptions').then(r => r.data),
    staleTime: 30_000,
  })

  const simulateMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/billing/simulate-first-revenue', { amount: 249900, planTier: 'PRO' }),
    onSuccess: () => {
      setSimDone(true)
      qc.invalidateQueries({ queryKey: ['billing-revenue'] })
      qc.invalidateQueries({ queryKey: ['billing-subscriptions'] })
    },
  })

  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const isLoading = revLoading || subsLoading

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <CreditCard className="w-6 h-6" style={{ color: TEAL }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-black" style={{ color: T1 }}>KEOS Billing</p>
              {revenue?.stripeEnabled
                ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(16,185,129,0.1)', color: TEAL }}>STRIPE LIVE</span>
                : <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(245,158,11,0.1)', color: AMB }}>STRIPE NOT CONFIGURED</span>
              }
            </div>
            <p className="text-xs" style={{ color: T2 }}>
              Revenue metrics, subscription lifecycle, and charge history. MRR calculated from active tenant subscriptions.
            </p>
          </div>
        </div>

        {/* Metrics row */}
        {isLoading ? (
          <div className="mt-4 text-xs" style={{ color: T2 }}>Loading billing data…</div>
        ) : (
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { label: 'MRR',                  value: fmt(revenue?.mrr ?? 0),                color: TEAL, icon: TrendingUp },
              { label: 'Total Revenue',         value: fmt(revenue?.totalRevenue ?? 0),       color: PURP, icon: DollarSign },
              { label: 'Active Subscriptions',  value: String(revenue?.activeSubscriptions ?? 0), color: BLUE, icon: Users },
              { label: 'Charges Captured',      value: String(revenue?.capturedCount ?? 0),   color: AMB,  icon: Zap },
            ].map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} className="rounded-xl p-3 border" style={{ borderColor: BDR, background: SURF }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className="w-3 h-3" style={{ color: s.color }} />
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: T2 }}>{s.label}</p>
                  </div>
                  <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* First Revenue Event CTA (when MRR is zero + Stripe not configured) */}
      {!revenue?.stripeEnabled && (revenue?.mrr ?? 0) === 0 && !simDone && (
        <div className="rounded-xl p-5 border" style={{ background: 'rgba(124,58,237,0.05)', borderColor: 'rgba(124,58,237,0.2)' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <Zap className="w-5 h-5" style={{ color: PURP }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold mb-1" style={{ color: T1 }}>Record First Revenue Event</p>
              <p className="text-xs mb-3" style={{ color: T2 }}>
                Stripe is not configured. Simulate the first confirmed subscription charge — creates a CAPTURED MarketplaceCharge,
                sets a tenant subscription to active, and makes MRR non-zero. This represents the commercial proof-of-concept milestone.
              </p>
              <button
                onClick={() => simulateMut.mutate()}
                disabled={simulateMut.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90"
                style={{ background: PURP, color: '#fff', opacity: simulateMut.isPending ? 0.7 : 1 }}
              >
                <Zap className="w-4 h-4" />
                {simulateMut.isPending ? 'Recording…' : 'Record First Revenue Event'}
              </button>
              {simulateMut.isError && (
                <p className="text-xs mt-2" style={{ color: RED }}>{(simulateMut.error as any)?.response?.data?.error ?? 'Failed'}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success callout */}
      {simDone && (
        <div className="rounded-xl p-4 border flex items-center gap-3"
          style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: TEAL }} />
          <p className="text-sm font-semibold" style={{ color: TEAL }}>
            First Revenue Event recorded — subscription is active, MRR is live. Kangqore is now a revenue-generating platform.
          </p>
        </div>
      )}

      {/* Subscriptions table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: BDR }}>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" style={{ color: BLUE }} />
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: T2 }}>Tenant Subscriptions</p>
          </div>
          <button onClick={() => qc.invalidateQueries({ queryKey: ['billing-subscriptions'] })}
            className="p-1 rounded-lg transition-all hover:opacity-70" style={{ color: T2 }}>
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        {subsLoading ? (
          <div className="p-5 text-xs" style={{ color: T2 }}>Loading…</div>
        ) : (subs?.tenants ?? []).length === 0 ? (
          <div className="p-5 text-xs" style={{ color: T2 }}>No tenants provisioned yet.</div>
        ) : (
          <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
            {(subs?.tenants ?? []).map(t => {
              const scfg = STATUS_CFG[t.subscriptionStatus ?? '']
              return (
                <div key={t.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: T1 }}>{t.name}</p>
                    <p className="text-[11px]" style={{ color: T2 }}>{t.subdomain} · {t.planTier}</p>
                  </div>
                  {scfg ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                      style={{ background: scfg.bg, color: scfg.color }}>{scfg.label}</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                      style={{ background: SURF, color: T2 }}>No subscription</span>
                  )}
                  <p className="text-xs font-bold tabular-nums" style={{ color: t.monthlyValue > 0 ? TEAL : T2 }}>
                    {t.monthlyValue > 0 ? fmt(t.monthlyValue) + '/mo' : '—'}
                  </p>
                  {t.currentPeriodEnd && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" style={{ color: T2 }} />
                      <span className="text-[10px]" style={{ color: T2 }}>renews {fmtDate(t.currentPeriodEnd)}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent charges */}
      <div className="rounded-xl border overflow-hidden" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: BDR }}>
          <CreditCard className="w-4 h-4" style={{ color: PURP }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: T2 }}>Recent Charges</p>
          <span className="ml-auto text-[10px] font-semibold" style={{ color: T2 }}>
            {revenue?.pendingCount ?? 0} pending · {revenue?.refundedCount ?? 0} refunded
          </span>
        </div>
        {(revenue?.recentCharges ?? []).length === 0 ? (
          <div className="p-5 text-xs" style={{ color: T2 }}>No charges yet.</div>
        ) : (
          <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
            {(revenue?.recentCharges ?? []).map(c => {
              const scfg = CHARGE_STATUS[c.status] ?? { label: c.status, color: T2 }
              return (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: scfg.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono truncate" style={{ color: T2 }}>{c.id}</p>
                    <p className="text-[10px]" style={{ color: T2 }}>{fmtDate(c.createdAt)}</p>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: scfg.color, background: `${scfg.color}15` }}>
                    {scfg.label}
                  </span>
                  <p className="text-xs font-bold tabular-nums" style={{ color: c.status === 'CAPTURED' ? TEAL : T2 }}>
                    {fmt(c.amount)} {c.currency}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Tier breakdown */}
      {Object.keys(revenue?.tierCounts ?? {}).length > 0 && (
        <div className="rounded-xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: T2 }}>Plan Distribution</p>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(revenue?.tierCounts ?? {}).map(([tier, count]) => (
              <div key={tier} className="rounded-xl px-4 py-3 border text-center min-w-[80px]"
                style={{ borderColor: BDR, background: SURF }}>
                <p className="text-xs font-bold" style={{ color: T1 }}>{count}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: T2 }}>{tier}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stripe not configured notice */}
      {!revenue?.stripeEnabled && (
        <div className="rounded-xl p-4 border flex items-center gap-3"
          style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: AMB }} />
          <p className="text-xs" style={{ color: T2 }}>
            <span className="font-bold" style={{ color: AMB }}>STRIPE_SECRET_KEY not configured.</span>{' '}
            Real card charges, checkout sessions, and subscription lifecycle require a Stripe secret key.
            Set <code className="text-[10px] font-mono">STRIPE_SECRET_KEY</code> and{' '}
            <code className="text-[10px] font-mono">STRIPE_WEBHOOK_SECRET</code> in <code className="text-[10px] font-mono">.env</code>.
          </p>
        </div>
      )}
    </div>
  )
}
