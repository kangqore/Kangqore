import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, Briefcase, DollarSign, AlertTriangle } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { StatCard } from '@design-system/components/StatCard'
import { Badge } from '@design-system/components/Badge'
import { Input } from '@design-system/components/Input'
import { usePartnersStore } from '../store'
import type { PartnerTier } from '../types'

const TIER_STYLE: Record<PartnerTier, string> = {
  platinum: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] text-white',
  gold:     'bg-amber-100 text-amber-700 border border-amber-200',
  silver:   'bg-slate-100 text-slate-600 border border-slate-200',
  associate:'bg-slate-50  text-slate-400 border border-slate-200',
}

const STATUS_VARIANT = {
  active: 'success', onboarding: 'info', paused: 'warning', offboarded: 'neutral',
} as const

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
      ))}
      <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

export function PartnersOverview() {
  const { partners, setSelected } = usePartnersStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [tierFilter, setTier] = useState<PartnerTier | 'all'>('all')

  const visible = partners.filter(p =>
    (tierFilter === 'all' || p.tier === tierFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.specialisms.some(s => s.toLowerCase().includes(search.toLowerCase())))
  )

  const active         = partners.filter(p => p.status === 'active').length
  const totalEarned    = partners.reduce((s, p) => s + p.totalEarned, 0)
  const totalPending   = partners.reduce((s, p) => s + p.pendingPayment, 0)
  const atRisk         = partners.filter(p => p.status === 'paused').length

  function open(id: string) { setSelected(id); navigate('/os/partners/profile') }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Partners</h2>
        <p className="text-sm text-slate-500 mt-0.5">{partners.length} partners · {active} active</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Partners"   value={active}                                 icon={<Briefcase     className="w-5 h-5"/>} iconColor="bg-[#2564ea]/10 text-[#2564ea]" />
        <StatCard label="Total Paid Out"    value={`£${(totalEarned/1000).toFixed(0)}k`}  icon={<DollarSign    className="w-5 h-5"/>} iconColor="bg-green-100 text-green-600"    />
        <StatCard label="Pending Payment"   value={`£${(totalPending/1000).toFixed(0)}k`} icon={<DollarSign    className="w-5 h-5"/>} iconColor="bg-amber-100 text-amber-600"    />
        <StatCard label="Paused"            value={atRisk}                                 icon={<AlertTriangle className="w-5 h-5"/>} iconColor={atRisk > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'} />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Search partners or skills…" prefix={<Search className="w-3.5 h-3.5"/>} className="w-64" value={search} onChange={e => setSearch(e.target.value)} />
        {(['all','platinum','gold','silver','associate'] as const).map(t => (
          <button key={t} onClick={() => setTier(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${tierFilter === t ? 'bg-[#2564ea] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#2564ea]/40'}`}>
            {t === 'all' ? 'All Tiers' : t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visible.map(partner => (
          <Card key={partner.id} className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer" onClick={() => open(partner.id)}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2564ea] to-[#4ab6d4] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{partner.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 truncate">{partner.name}</h3>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${TIER_STYLE[partner.tier]}`}>{partner.tier}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize">{partner.type} · {partner.country}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[partner.status]} dot size="sm">{partner.status}</Badge>
                </div>

                <Stars rating={partner.rating} />
                <p className="text-xs text-slate-500 mt-2 line-clamp-1">{partner.description}</p>

                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {partner.specialisms.slice(0,4).map(s => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{s}</span>
                  ))}
                  {partner.specialisms.length > 4 && <span className="text-[11px] text-slate-400">+{partner.specialisms.length - 4}</span>}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span><strong className="text-slate-800">{partner.activeTasks}</strong> active tasks</span>
                  <span><strong className="text-slate-800">£{(partner.totalEarned/1000).toFixed(0)}k</strong> earned</span>
                  {partner.pendingPayment > 0 && (
                    <span className="text-amber-600 font-semibold">£{(partner.pendingPayment/1000).toFixed(0)}k pending</span>
                  )}
                  <span>£{partner.hourlyRate}/hr</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
