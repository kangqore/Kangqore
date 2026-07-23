import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, TrendingUp, DollarSign, Award, Plus, ChevronRight, CheckCircle, Clock, Banknote } from 'lucide-react'
import { api } from '@lib/api'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const PURP = '#7c3aed'
const GRN  = '#10b981'
const AMB  = '#f59e0b'
const BLUE = '#579bfc'

const TIERS = ['BRONZE','SILVER','GOLD','PLATINUM'] as const
const TIER_COLOR: Record<string, string> = { BRONZE: '#b45309', SILVER: '#6b7280', GOLD: AMB, PLATINUM: PURP }
type Tier = typeof TIERS[number]

interface PartnerOrg {
  id: string; name: string; slug: string; contactEmail: string; website?: string
  tier: Tier; commissionRate: number; status: string; specialisms: string[]
  certifications: string[]; oisBoostAvg: number; totalRevenue: number
  createdAt: string; commissions: Commission[]
}
interface Commission {
  id: string; sourceType: string; grossAmount: number; commissionEarned: number
  status: string; createdAt: string
}

function fmt(n: number) { return `£${n.toLocaleString('en-GB', { maximumFractionDigits: 0 })}` }

export function PartnerOrgPage() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', contactEmail: '', tier: 'SILVER' as Tier, commissionRate: '0.15', website: '', specialisms: '' })

  const { data } = useQuery({
    queryKey: ['partner-orgs'],
    queryFn: () => api.get('/admin/kangqore-immp/partner-orgs').then(r => r.data),
  })
  const { data: detail } = useQuery({
    queryKey: ['partner-org', selected],
    queryFn: () => api.get(`/admin/kangqore-immp/partner-orgs/${selected}`).then(r => r.data),
    enabled: !!selected,
  })

  const createMut = useMutation({
    mutationFn: (body: any) => api.post('/admin/kangqore-immp/partner-orgs', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['partner-orgs'] }); setShowForm(false) },
  })

  const commMut = useMutation({
    mutationFn: ({ id, grossAmount }: { id: string; grossAmount: number }) =>
      api.post(`/admin/kangqore-immp/partner-orgs/${id}/commissions`, { grossAmount, sourceType: 'DEPLOYMENT' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['partner-org', selected] }); qc.invalidateQueries({ queryKey: ['partner-orgs'] }) },
  })

  const orgs: PartnerOrg[] = data?.orgs ?? []
  const org: PartnerOrg | null = detail?.org ?? null

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Partner Organisations" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: T1 }}>Partner Network</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
            {orgs.length} implementation partners · commission ledger · pack publishing
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg"
          style={{ background: PURP, color: '#fff' }}>
          <Plus className="w-3.5 h-3.5" /> Onboard Partner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Partners', value: orgs.length, icon: Building2, color: PURP },
          { label: 'Total Revenue', value: fmt(orgs.reduce((s, o) => s + o.totalRevenue, 0)), icon: DollarSign, color: GRN },
          { label: 'Gold / Platinum', value: orgs.filter(o => ['GOLD','PLATINUM'].includes(o.tier)).length, icon: Award, color: AMB },
          { label: 'Avg OIS Boost', value: `+${(orgs.reduce((s,o) => s + o.oisBoostAvg, 0) / Math.max(orgs.length, 1)).toFixed(1)}`, icon: TrendingUp, color: BLUE },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${s.color}18` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: T1 }}>{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: T2 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Partner list */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: T2 }}>All Partners</p>
          {orgs.map(o => (
            <button key={o.id} onClick={() => setSelected(o.id)}
              className="w-full text-left rounded-xl p-4 flex items-center gap-3 transition-colors"
              style={{ background: selected === o.id ? `${PURP}18` : CARD, border: `1px solid ${selected === o.id ? PURP : BDR}` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-black"
                style={{ background: `${TIER_COLOR[o.tier]}20`, color: TIER_COLOR[o.tier] }}>
                {o.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: T1 }}>{o.name}</p>
                <p className="text-xs" style={{ color: T2 }}>
                  <span style={{ color: TIER_COLOR[o.tier] }}>{o.tier}</span> · {fmt(o.totalRevenue)}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: T2 }} />
            </button>
          ))}
          {orgs.length === 0 && <p className="text-sm text-center py-8" style={{ color: T2 }}>No partners yet.</p>}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {!org && !selected && (
            <div className="rounded-xl p-12 flex flex-col items-center justify-center gap-3 h-full"
              style={{ background: CARD, border: `1px dashed ${BDR}` }}>
              <Building2 className="w-8 h-8" style={{ color: T2 }} />
              <p className="text-sm" style={{ color: T2 }}>Select a partner to view details</p>
            </div>
          )}
          {org && (
            <div className="space-y-4">
              {/* Header */}
              <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BDR}` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-black" style={{ color: T1 }}>{org.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: T2 }}>{org.contactEmail} {org.website && `· ${org.website}`}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${TIER_COLOR[org.tier]}22`, color: TIER_COLOR[org.tier] }}>
                    {org.tier}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: 'Commission', v: `${(org.commissionRate * 100).toFixed(0)}%` },
                    { l: 'Total Revenue', v: fmt(org.totalRevenue) },
                    { l: 'OIS Boost Avg', v: `+${org.oisBoostAvg.toFixed(1)}` },
                  ].map(x => (
                    <div key={x.l} className="rounded-lg p-3 text-center"
                      style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}` }}>
                      <p className="text-base font-bold" style={{ color: T1 }}>{x.v}</p>
                      <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: T2 }}>{x.l}</p>
                    </div>
                  ))}
                </div>
                {org.specialisms.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {org.specialisms.map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: `${BLUE}18`, color: BLUE }}>{s}</span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => commMut.mutate({ id: org.id, grossAmount: 5000 })}
                  disabled={commMut.isPending}
                  className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: `${GRN}18`, color: GRN }}>
                  + Add Commission Event (£5k demo)
                </button>
              </div>

              {/* Commission ledger */}
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
                <div className="px-5 py-3 flex items-center gap-2" style={{ background: CARD, borderBottom: `1px solid ${BDR}` }}>
                  <Banknote className="w-4 h-4" style={{ color: T2 }} />
                  <p className="text-sm font-semibold" style={{ color: T1 }}>Commission Ledger</p>
                </div>
                <div style={{ background: CARD }}>
                  {org.commissions?.length === 0 && (
                    <p className="text-xs text-center py-8" style={{ color: T2 }}>No commissions yet.</p>
                  )}
                  {org.commissions?.slice(0, 10).map((c, i) => (
                    <div key={c.id} className="flex items-center justify-between px-5 py-3"
                      style={{ borderBottom: i < org.commissions.length - 1 ? `1px solid ${BDR}` : undefined }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: T1 }}>{c.sourceType.replace(/_/g, ' ')}</p>
                        <p className="text-xs" style={{ color: T2 }}>{c.createdAt.slice(0, 10)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: GRN }}>{fmt(c.commissionEarned)}</p>
                        <div className="flex items-center gap-1 justify-end">
                          {c.status === 'PAID' ? <CheckCircle className="w-3 h-3" style={{ color: GRN }} /> : <Clock className="w-3 h-3" style={{ color: AMB }} />}
                          <p className="text-[10px]" style={{ color: c.status === 'PAID' ? GRN : AMB }}>{c.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Onboard form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl p-6 w-full max-w-md space-y-4"
            style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <h3 className="font-black text-lg" style={{ color: T1 }}>Onboard Partner</h3>
            {[
              { label: 'Organisation Name', key: 'name', type: 'text', placeholder: 'Acme Consulting Ltd' },
              { label: 'Contact Email', key: 'contactEmail', type: 'email', placeholder: 'partner@acme.com' },
              { label: 'Website', key: 'website', type: 'text', placeholder: 'https://acme.com' },
              { label: 'Commission Rate', key: 'commissionRate', type: 'number', placeholder: '0.15' },
              { label: 'Specialisms (comma-separated)', key: 'specialisms', type: 'text', placeholder: 'fintech, saas' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>{f.label}</label>
                <input
                  type={f.type}
                  className="w-full text-sm px-3 py-2 rounded-lg"
                  style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>Tier</label>
              <select
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}
                value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value as Tier }))}>
                {TIERS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowForm(false)}
                className="flex-1 text-sm py-2 rounded-lg" style={{ background: `${BDR}50`, color: T2 }}>
                Cancel
              </button>
              <button
                onClick={() => createMut.mutate({
                  name: form.name, contactEmail: form.contactEmail, tier: form.tier,
                  commissionRate: parseFloat(form.commissionRate) || 0.15,
                  website: form.website || undefined,
                  specialisms: form.specialisms ? form.specialisms.split(',').map(s => s.trim()) : [],
                })}
                disabled={createMut.isPending || !form.name || !form.contactEmail}
                className="flex-1 text-sm font-semibold py-2 rounded-lg"
                style={{ background: PURP, color: '#fff' }}>
                {createMut.isPending ? 'Creating…' : 'Onboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
