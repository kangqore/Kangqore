import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Zap, BarChart2, Shield, Brain, Users, Plus, ChevronRight,
  RefreshCw, AlertTriangle, Check, Package, Timer,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { EditDrawer } from '@components/EditDrawer'
import { api, isDemo } from '@lib/api'

// ─── tokens ───────────────────────────────────────────────────────────────────

const CARD = 'rgba(15,23,42,0.5)'
const EDGE = 'rgba(30,41,59,0.6)'
const EASE = 'cubic-bezier(0.16,1,0.3,1)'

// ─── mock data ────────────────────────────────────────────────────────────────

type ServiceStatus = 'active' | 'expiring' | 'suspended'
type ServiceTier   = 'Enterprise' | 'Standard' | 'Starter'

interface ContractedService {
  id: string
  name: string
  description: string
  icon: React.ElementType
  iconColor: string
  status: ServiceStatus
  tier: ServiceTier
  renewal: string
  usagePct: number
  usageLabel: string
  highlights: string[]
}

const SERVICES: ContractedService[] = [
  {
    id: 'svc-1', name: 'BIDS™ Strategic Advisory',
    description: 'Full access to the Business Intelligence Delivery System — 16-pillar framework with quarterly strategic reviews.',
    icon: Zap, iconColor: '#2564ea',
    status: 'active', tier: 'Enterprise', renewal: '2027-03-01',
    usagePct: 80, usageLabel: '80% of advisory hours consumed (Q2)',
    highlights: ['Quarterly strategy sessions', 'BIDS™ dashboard access', 'Priority response SLA'],
  },
  {
    id: 'svc-2', name: 'Delivery Tracking & OKRs',
    description: 'Live project milestone tracking, OKR alignment dashboard, and weekly delivery health reports.',
    icon: BarChart2, iconColor: '#7f53f9',
    status: 'active', tier: 'Enterprise', renewal: '2027-03-01',
    usagePct: 65, usageLabel: '65% of milestones completed',
    highlights: ['Real-time milestone tracking', 'OKR alignment scoring', 'Weekly delivery digest'],
  },
  {
    id: 'svc-3', name: 'HANUMANAS Compliance Monitoring',
    description: 'Continuous compliance posture monitoring across SOC 2, ISO 27001, and NIST CSF — with audit evidence export.',
    icon: Shield, iconColor: '#00c875',
    status: 'active', tier: 'Standard', renewal: '2026-12-01',
    usagePct: 45, usageLabel: '45% of controls actively monitored',
    highlights: ['Live compliance dashboard', 'One-click audit exports', 'KIMMP breach readiness score'],
  },
  {
    id: 'svc-4', name: 'WAANDA Intelligence Feed',
    description: 'AI-powered engagement insights, churn risk signals, and proactive recommendations for your account.',
    icon: Brain, iconColor: '#7f53f9',
    status: 'active', tier: 'Enterprise', renewal: '2027-03-01',
    usagePct: 90, usageLabel: '90% signal coverage across your account',
    highlights: ['3 weekly AI insights', 'Churn risk early warning', 'Recommended actions'],
  },
  {
    id: 'svc-5', name: 'Talent Intelligence',
    description: 'Access to Kangqore\'s talent pool for project staffing, team augmentation, and specialist placements.',
    icon: Users, iconColor: '#fdab3d',
    status: 'expiring', tier: 'Standard', renewal: '2026-09-01',
    usagePct: 30, usageLabel: '3 of 10 talent placements used',
    highlights: ['10 placement credits / year', 'Specialist talent network', 'Background check included'],
  },
]

interface AddOn {
  id: string
  name: string
  description: string
  price: string
}

const ADD_ONS: AddOn[] = [
  { id: 'ao-1', name: 'Advanced Analytics Package', description: 'Custom dashboards, cohort analysis, and predictive modelling on your engagement data.', price: '₹85,000 / month' },
  { id: 'ao-2', name: 'Additional Portal Seats (10-pack)', description: 'Add 10 more named users to your Client Portal. Includes full access to all contracted modules.', price: '₹12,000 / month' },
  { id: 'ao-3', name: 'Priority Support Upgrade', description: 'Upgrade to 24/7 P1 support with < 1hr response SLA and a dedicated on-call engineer.', price: '₹45,000 / month' },
  { id: 'ao-4', name: 'Custom Integration Development', description: 'Bespoke connector development to integrate Kangqore data with your existing stack (ERP, CRM, HRIS).', price: 'Quoted per project' },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ServiceStatus, { label: string; variant: 'success' | 'warning' | 'neutral'; icon: React.ElementType }> = {
  active:    { label: 'Active',          variant: 'success', icon: Check },
  expiring:  { label: 'Expiring soon',   variant: 'warning', icon: AlertTriangle },
  suspended: { label: 'Suspended',       variant: 'neutral', icon: AlertTriangle },
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysUntil(s: string) {
  return Math.ceil((new Date(s).getTime() - Date.now()) / 86400000)
}

// ─── usage bar ────────────────────────────────────────────────────────────────

function UsageBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

// ─── request add-on drawer ────────────────────────────────────────────────────

function RequestAddOnDrawer({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<AddOn | null>(null)
  const [note, setNote]         = useState('')
  const [done, setDone]         = useState(false)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!selected) return
      if (isDemo()) return
      await api.post('/client/change-requests', {
        title:       `New Service Request: ${selected.name}`,
        description: `I would like to add the following service to my account:\n\n${selected.name} (${selected.price})\n\n${selected.description}${note ? `\n\nAdditional notes: ${note}` : ''}`,
        type:        'NEW_SERVICE',
        priority:    'MEDIUM',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'change-requests'] })
      setDone(true)
    },
  })

  return (
    <EditDrawer
      open
      onClose={onClose}
      title="Request an Add-On"
      description="Select the service you'd like to add. A Change Request will be raised and your account manager will follow up within 2 business days."
      width="md"
      footer={done ? (
        <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
      ) : (
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary" size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            disabled={!selected || isPending}
            onClick={() => mutate()}
          >
            {isPending ? 'Submitting…' : 'Submit Request'}
          </Button>
        </>
      )}
    >
      {done ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--os-text-1)' }}>Request submitted</p>
          <p className="text-xs text-slate-500">Your account manager will contact you within 2 business days with pricing and next steps.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Add-on options */}
          <div className="space-y-2">
            {ADD_ONS.map(ao => (
              <button
                key={ao.id}
                onClick={() => setSelected(s => s?.id === ao.id ? null : ao)}
                className="w-full text-left rounded-xl p-4 transition-all"
                style={{
                  background: selected?.id === ao.id ? 'rgba(37,100,234,0.08)' : CARD,
                  border: `1px solid ${selected?.id === ao.id ? 'rgba(37,100,234,0.35)' : EDGE}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
                    selected?.id === ao.id ? 'bg-os-blue' : 'border border-slate-600'
                  }`}>
                    {selected?.id === ao.id && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{ao.name}</p>
                      <span className="text-xs font-bold text-slate-400 flex-shrink-0">{ao.price}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{ao.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Optional note */}
          {selected && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Additional context (optional)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="Any specific requirements or questions…"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 outline-none resize-none transition-all"
                style={{ background: CARD, border: `1px solid ${EDGE}` }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(37,100,234,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = EDGE)}
              />
            </div>
          )}
        </div>
      )}
    </EditDrawer>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function ClientServices() {
  const [addOnOpen, setAddOnOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Services</h2>
          <p className="text-sm text-slate-500 mt-0.5">{SERVICES.length} contracted services</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setAddOnOpen(true)}>
          Request Add-On
        </Button>
      </div>

      {/* Expiring banner */}
      {SERVICES.some(s => s.status === 'expiring') && (
        <div
          className="flex items-start gap-3 rounded-xl p-4"
          style={{ background: 'rgba(253,171,61,0.08)', border: '1px solid rgba(253,171,61,0.25)' }}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-300">Service renewal required</p>
            <p className="text-xs text-amber-500 mt-0.5">
              Talent Intelligence expires in {daysUntil('2026-09-01')} days (1 Sep 2026). Contact your account manager to renew.
            </p>
          </div>
        </div>
      )}

      {/* Service cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SERVICES.map(svc => {
          const Icon   = svc.icon
          const status = STATUS_CONFIG[svc.status]
          const days   = daysUntil(svc.renewal)
          return (
            <div
              key={svc.id}
              className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200"
              style={{ background: CARD, border: `1px solid ${EDGE}`, transition: `border-color 0.15s ${EASE}` }}
            >
              {/* Top row */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${svc.iconColor}15`, border: `1px solid ${svc.iconColor}25` }}
                >
                  <Icon className="w-5 h-5" style={{ color: svc.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{svc.name}</p>
                    <Badge variant={status.variant} dot size="sm">{status.label}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{svc.description}</p>
                </div>
              </div>

              {/* Usage */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-slate-500">{svc.usageLabel}</span>
                  <span className="text-[11px] font-bold" style={{ color: svc.iconColor }}>{svc.usagePct}%</span>
                </div>
                <UsageBar pct={svc.usagePct} color={svc.iconColor} />
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1.5">
                {svc.highlights.map(h => (
                  <span
                    key={h}
                    className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--os-text-2)' }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between pt-3 mt-auto"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <RefreshCw className="w-3 h-3" />
                  <span>Renews <span className={svc.status === 'expiring' ? 'text-amber-400 font-semibold' : 'text-slate-400'}>{fmtDate(svc.renewal)}</span></span>
                  {svc.status === 'expiring' && <span className="text-amber-500">· in {days} days</span>}
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-md"
                  style={{ background: 'rgba(37,100,234,0.1)', color: '#60a5fa', border: '1px solid rgba(37,100,234,0.2)' }}
                >
                  {svc.tier}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* What you could add */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-slate-500" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Add-Ons</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ADD_ONS.map(ao => (
            <button
              key={ao.id}
              onClick={() => setAddOnOpen(true)}
              className="text-left rounded-xl p-4 transition-all group"
              style={{ background: CARD, border: `1px solid ${EDGE}` }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,100,234,0.3)'
                ;(e.currentTarget as HTMLElement).style.background  = 'rgba(37,100,234,0.04)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = EDGE
                ;(e.currentTarget as HTMLElement).style.background  = CARD
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--os-text-1)' }}>{ao.name}</p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{ao.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5" />
              </div>
              <p className="text-xs font-bold text-blue-400 mt-2">{ao.price}</p>
            </button>
          ))}
        </div>
      </div>

      {/* SLA Entitlement table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Timer className="w-4 h-4 text-slate-500" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Support SLA Entitlements</p>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${EDGE}` }}>
          {/* Header */}
          <div className="grid grid-cols-4 px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${EDGE}` }}>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Priority</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Description</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Enterprise</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Standard</span>
          </div>
          {[
            { priority: 'P1 — Critical', desc: 'System down, data loss, security breach', enterprise: '< 1 hour', standard: '< 2 hours',       p1Color: '#f87171' },
            { priority: 'P2 — High',     desc: 'Major feature impaired, workaround unavailable', enterprise: '< 4 hours', standard: '< 8 hours', p1Color: '#fbbf24' },
            { priority: 'P3 — Medium',   desc: 'Feature impaired, workaround available', enterprise: '< 1 day',   standard: '< 2 days',         p1Color: '#60a5fa' },
            { priority: 'P4 — Low',      desc: 'Minor issue, cosmetic, enhancement request', enterprise: '< 3 days', standard: '< 5 days',       p1Color: 'var(--os-text-2)' },
          ].map((row, i) => (
            <div
              key={row.priority}
              className="grid grid-cols-4 px-4 py-3 items-center"
              style={{
                background: i % 2 === 0 ? CARD : 'transparent',
                borderBottom: i < 3 ? `1px solid ${EDGE}` : undefined,
              }}
            >
              <span className="text-xs font-bold" style={{ color: row.p1Color }}>{row.priority}</span>
              <span className="text-xs text-slate-500 pr-4">{row.desc}</span>
              <span className="text-xs font-semibold text-violet-300">{row.enterprise}</span>
              <span className="text-xs text-slate-400">{row.standard}</span>
            </div>
          ))}
          <div className="px-4 py-2.5" style={{ background: 'rgba(127,83,249,0.04)', borderTop: `1px solid ${EDGE}` }}>
            <p className="text-[10px] text-slate-600">
              SLA response times are business hours (09:00–18:00 IST, Mon–Fri) unless Priority Support Upgrade is active.
              Enterprise tier includes 24/7 P1 coverage. Resolution targets are separate from response targets.
            </p>
          </div>
        </div>
      </div>

      {addOnOpen && <RequestAddOnDrawer onClose={() => setAddOnOpen(false)} />}
    </div>
  )
}
