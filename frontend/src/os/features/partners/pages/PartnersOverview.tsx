import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, Briefcase } from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Input } from '@design-system/components/Input'
import { usePartnersStore } from '../store'
import { useUIStore } from '@store/ui'
import type { PartnerTier } from '../types'

function SkeletonCard() {
  return (
    <div className="os-card p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-700" />
          <div className="h-3 w-1/3 rounded bg-slate-800" />
          <div className="h-3 w-full rounded bg-slate-800 mt-2" />
        </div>
      </div>
    </div>
  )
}

// Monday.com tier colors — hardcoded per design system spec
const TIER_BADGE: Record<PartnerTier, { bg: string; text: string; label: string }> = {
  platinum: { bg: '#579bfc', text: '#fff',     label: 'PLATINUM' },
  gold:     { bg: '#fdab3d', text: '#fff',     label: 'GOLD'     },
  silver:   { bg: '#9aa0b0', text: '#fff',     label: 'SILVER'   },
  associate:{ bg: '#323338', text: '#9aa0b0',  label: 'ASSOCIATE'},
}

const STATUS_DOT: Record<string, string> = {
  active:     '#00c875',
  onboarding: '#579bfc',
  paused:     '#fdab3d',
  offboarded: '#9aa0b0',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-[#fdab3d] fill-[#fdab3d]' : 'text-[var(--os-text-2)]'}`} />
      ))}
      <span className="text-xs text-[var(--os-text-2)] ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

export function PartnersOverview() {
  const { partners, isLoading, setSelected } = usePartnersStore()
  const navigate = useNavigate()
  const viewMode = useUIStore(s => s.viewMode)
  const [search, setSearch] = useState('')
  const [tierFilter, setTier] = useState<PartnerTier | 'all'>('all')

  const visible = partners.filter(p =>
    (tierFilter === 'all' || p.tier === tierFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.specialisms.some(s => s.toLowerCase().includes(search.toLowerCase())))
  )

  const active       = partners.filter(p => p.status === 'active').length
  const totalEarned  = partners.reduce((s, p) => s + p.totalEarned, 0)
  const totalPending = partners.reduce((s, p) => s + p.pendingPayment, 0)
  const atRisk       = partners.filter(p => p.status === 'paused').length

  function open(id: string) { setSelected(id); navigate('/kangqore-view/admin/partners/profile') }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-40 rounded bg-slate-700 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="os-card p-5 h-24 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] font-semibold mb-1">Partner Network</p>
        <h2 className="text-xl font-bold text-[var(--os-text-1)]">Partners</h2>
        <p className="text-sm text-[var(--os-text-2)] mt-0.5">{partners.length} total · {active} active</p>
      </div>

      {/* Stat header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Partners',    value: partners.length,                                bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
          { label: 'Active',            value: active,                                         bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'Revenue Generated', value: `₹${(totalEarned/1000).toFixed(0)}k`,          bg: 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: '#7c3aed' },
          { label: 'Pending Payment',   value: `₹${(totalPending/1000).toFixed(0)}k`,         bg: atRisk > 0 ? 'linear-gradient(135deg,#e2445c 0%,#c0392b 100%)' : 'linear-gradient(135deg,#64748b 0%,#475569 100%)', glow: atRisk > 0 ? '#e2445c' : '#64748b' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: s.bg, boxShadow: `0 4px 20px ${s.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</p>
            <p className="relative text-3xl font-black tracking-tight" style={{ color: '#ffffff' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Search partners or skills…" prefix={<Search className="w-3.5 h-3.5"/>} className="w-64" value={search} onChange={e => setSearch(e.target.value)} />
        {(['all','platinum','gold','silver','associate'] as const).map(t => {
          const tb = t === 'all' ? null : TIER_BADGE[t]
          return (
            <button
              key={t}
              onClick={() => setTier(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border"
              style={
                tierFilter === t
                  ? { background: tb?.bg ?? '#579bfc', color: tb?.text ?? '#fff', borderColor: tb?.bg ?? '#579bfc' }
                  : { background: 'transparent', color: 'var(--os-text-2)', borderColor: 'var(--os-border)' }
              }
            >
              {t === 'all' ? 'All Tiers' : t}
            </button>
          )
        })}
      </div>

      {/* List view — compact table */}
      {viewMode === 'list' && (
        <div className="os-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--os-border)] bg-[var(--os-surface-0)]">
                  {['Partner', 'Tier', 'Status', 'Rating', 'Tasks', 'Earned', 'Pending', 'Rate'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--os-border)]">
                {visible.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-16 text-center text-[var(--os-text-2)] text-sm">No partners found.</td></tr>
                )}
                {visible.map(partner => {
                  const tb = TIER_BADGE[partner.tier]
                  const statusColor = STATUS_DOT[partner.status] ?? '#9aa0b0'
                  return (
                    <tr key={partner.id} onClick={() => open(partner.id)} className="hover:bg-[var(--os-surface-0)] transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs text-white" style={{ background: '#579bfc' }}>
                            {partner.logo}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[var(--os-text-1)] truncate">{partner.name}</p>
                            <p className="text-xs text-[var(--os-text-2)] capitalize">{partner.type} · {partner.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: tb.bg, color: tb.text }}>{tb.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold capitalize" style={{ color: statusColor }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: statusColor }} />
                          {partner.status}
                        </div>
                      </td>
                      <td className="px-4 py-3"><Stars rating={partner.rating} /></td>
                      <td className="px-4 py-3 font-semibold text-[var(--os-text-1)]">{partner.activeTasks}</td>
                      <td className="px-4 py-3 font-semibold text-[var(--os-text-1)] whitespace-nowrap">₹{(partner.totalEarned / 1000).toFixed(0)}k</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {partner.pendingPayment > 0
                          ? <span className="font-semibold" style={{ color: '#fdab3d' }}>₹{(partner.pendingPayment / 1000).toFixed(0)}k</span>
                          : <span className="text-[var(--os-text-2)]">—</span>}
                      </td>
                      <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">₹{partner.hourlyRate}/hr</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Board view — partner cards */}
      {viewMode === 'board' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visible.length === 0 && (
          <div className="col-span-2 py-16 text-center">
            <Briefcase className="w-10 h-10 text-[var(--os-text-2)] mx-auto mb-3" />
            <p className="text-[var(--os-text-2)] font-medium">No partners found</p>
            <p className="text-[var(--os-text-2)] text-sm mt-1">Try adjusting filters or add a new partner.</p>
          </div>
        )}
        {visible.map(partner => {
          const tb = TIER_BADGE[partner.tier]
          const statusColor = STATUS_DOT[partner.status] ?? '#9aa0b0'
          return (
            <div
              key={partner.id}
              className="os-card p-5 hover:shadow-[var(--os-shadow-card)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              onClick={() => open(partner.id)}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm text-white" style={{ background: '#579bfc' }}>
                  {partner.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-[var(--os-text-1)] truncate">{partner.name}</h3>
                        {/* Tier badge */}
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: tb.bg, color: tb.text }}
                        >{tb.label}</span>
                      </div>
                      <p className="text-xs text-[var(--os-text-2)] mt-0.5 capitalize">{partner.type} · {partner.country}</p>
                    </div>
                    {/* Status dot */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-xs" style={{ color: statusColor }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                      <span className="capitalize font-semibold">{partner.status}</span>
                    </div>
                  </div>

                  <Stars rating={partner.rating} />
                  <p className="text-xs text-[var(--os-text-2)] mt-2 line-clamp-1">{partner.description}</p>

                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {partner.specialisms.slice(0,4).map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[#579bfc]/10 text-[#579bfc] font-medium border border-[#579bfc]/20">{s}</span>
                    ))}
                    {partner.specialisms.length > 4 && <span className="text-[10px] text-[var(--os-text-2)]">+{partner.specialisms.length - 4}</span>}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--os-border)] text-xs text-[var(--os-text-2)]">
                    <span><strong className="text-[var(--os-text-1)]">{partner.activeTasks}</strong> active tasks</span>
                    <span><strong className="text-[var(--os-text-1)]">₹{(partner.totalEarned/1000).toFixed(0)}k</strong> earned</span>
                    {partner.pendingPayment > 0 && (
                      <span className="font-semibold" style={{ color: '#fdab3d' }}>₹{(partner.pendingPayment/1000).toFixed(0)}k pending</span>
                    )}
                    <span>₹{partner.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}
