import { useNavigate } from 'react-router-dom'
import { Star, Mail, Phone, ChevronLeft, MessageSquare, AlertCircle, ThumbsUp, Wrench, UserCircle } from 'lucide-react'
import { Button } from '@design-system/components/Button'
import { usePartnersStore } from '../store'
import type { PartnerTier, DeliverableStatus, PartnerNote } from '../types'

// Monday.com tier colors
const TIER_BADGE: Record<PartnerTier, { bg: string; text: string; label: string }> = {
  platinum: { bg: '#579bfc', text: '#fff',    label: 'PLATINUM'  },
  gold:     { bg: '#fdab3d', text: '#fff',    label: 'GOLD'      },
  silver:   { bg: '#9aa0b0', text: '#fff',    label: 'SILVER'    },
  associate:{ bg: '#323338', text: '#9aa0b0', label: 'ASSOCIATE' },
}

const DELIVERABLE_COLOR: Record<DeliverableStatus, string> = {
  approved:      '#00c875',
  submitted:     '#579bfc',
  'in-progress': '#fdab3d',
  revision:      '#e2445c',
  'not-started': '#9aa0b0',
}

const NOTE_ICON: Record<PartnerNote['type'], React.ElementType> = {
  praise: ThumbsUp, issue: AlertCircle, performance: Wrench, general: MessageSquare,
}
const NOTE_COLOR: Record<PartnerNote['type'], { bg: string; icon: string }> = {
  praise:      { bg: '#00c87518', icon: '#00c875' },
  issue:       { bg: '#e2445c18', icon: '#e2445c' },
  performance: { bg: '#fdab3d18', icon: '#fdab3d' },
  general:     { bg: '#579bfc18', icon: '#579bfc' },
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-[#fdab3d] fill-[#fdab3d]' : 'text-[var(--os-text-2)]'}`} />
      ))}
    </div>
  )
}

const fmt = (n: number) => `₹${n.toLocaleString()}`

export function PartnerProfile() {
  const navigate = useNavigate()
  const { partners, isLoading, selectedId, setSelected, partnerTasks, partnerDeliverables, partnerPayments, partnerNotes } = usePartnersStore()
  const partner = partners.find(p => p.id === selectedId) ?? partners[0]

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-32 rounded bg-slate-700" />
        <div className="os-card p-5 h-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="os-card p-5 h-64" />
          <div className="os-card p-5 h-64" />
        </div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <UserCircle className="w-12 h-12 text-[var(--os-text-2)]" />
        <p className="text-[var(--os-text-2)] font-medium">No partner selected</p>
        <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4"/>} onClick={() => navigate('/kangqore-view/admin/partners')}>
          Back to Partners
        </Button>
      </div>
    )
  }

  const tasks        = partnerTasks(partner.id)
  const deliverables = partnerDeliverables(partner.id)
  const payments     = partnerPayments(partner.id)
  const notes        = partnerNotes(partner.id)

  const completedDel = deliverables.filter(d => d.status === 'approved').length
  const pendingDel   = deliverables.filter(d => d.status === 'submitted' || d.status === 'in-progress').length
  const activeTasks  = tasks.filter(t => t.status !== 'completed').length

  const tb = TIER_BADGE[partner.tier]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4"/>} onClick={() => navigate('/kangqore-view/admin/partners')}>
          All Partners
        </Button>
        <select
          value={selectedId}
          onChange={e => setSelected(e.target.value)}
          className="ml-auto h-9 rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] text-sm text-[var(--os-text-1)] pl-3 pr-8 outline-none focus:border-[#579bfc]"
        >
          {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Header card */}
      <div className="os-card p-5">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-xl text-white" style={{ background: '#579bfc' }}>
            {partner.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h2 className="text-xl font-bold text-[var(--os-text-1)]">{partner.name}</h2>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: tb.bg, color: tb.text }}>{tb.label}</span>
              <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: partner.status === 'active' ? '#00c875' : '#fdab3d' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: partner.status === 'active' ? '#00c875' : '#fdab3d' }} />
                {partner.status}
              </span>
            </div>
            <p className="text-sm text-[var(--os-text-2)] capitalize mb-2">{partner.type} · {partner.country}</p>
            <Stars rating={partner.rating} />
            <p className="text-sm text-[var(--os-text-2)] mt-2 leading-relaxed">{partner.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <p className="text-2xl font-black text-[var(--os-text-1)]">{fmt(partner.totalEarned)}</p>
            <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)]">total earned</p>
            {partner.pendingPayment > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#fdab3d22', color: '#fdab3d' }}>
                ₹{(partner.pendingPayment/1000).toFixed(0)}k pending
              </span>
            )}
          </div>
        </div>

        <div className="my-4 border-t border-[var(--os-border)]" />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Rate',          value: `₹${partner.hourlyRate}/hr` },
            { label: 'Active tasks',  value: `${activeTasks}` },
            { label: 'Deliverables',  value: `${completedDel}/${deliverables.length} done` },
            { label: 'Projects',      value: `${partner.completedProjects} completed` },
            { label: 'Partner since', value: new Date(partner.joinDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) },
          ].map(s => (
            <div key={s.label}>
              <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-widest font-semibold">{s.label}</p>
              <p className="text-sm font-semibold text-[var(--os-text-1)] mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {partner.specialisms.map(s => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium border" style={{ background: '#579bfc10', color: '#579bfc', borderColor: '#579bfc30' }}>{s}</span>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--os-border)]">
          <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
            <Mail className="w-4 h-4" />
            {partner.contact.email}
          </div>
          {partner.contact.phone && (
            <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
              <Phone className="w-4 h-4" />
              {partner.contact.phone}
            </div>
          )}
          <span className="text-xs text-[var(--os-text-2)] ml-2">{partner.contact.name} · {partner.contact.role}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Deliverables */}
        <div className="os-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--os-text-1)]">Deliverables</h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#00c87520', color: '#00c875' }}>{completedDel} approved</span>
              {pendingDel > 0 && <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#579bfc20', color: '#579bfc' }}>{pendingDel} in review</span>}
            </div>
          </div>
          <div className="space-y-2">
            {deliverables.map(d => {
              const dc = DELIVERABLE_COLOR[d.status]
              return (
                <div key={d.id} className="px-4 py-3 rounded-2xl border border-[var(--os-border)] hover:bg-[var(--os-surface-0)]">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-[var(--os-text-1)]">{d.title}</p>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${dc}20`, color: dc }}>
                      {d.status.replace('-',' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--os-text-2)] line-clamp-1">{d.description}</p>
                  {d.feedback && (
                    <p className="text-xs text-[var(--os-text-2)] mt-1.5 italic border-l-2 border-[var(--os-border)] pl-2">{d.feedback}</p>
                  )}
                  <div className="flex items-center justify-between mt-2 text-[10px] text-[var(--os-text-2)]">
                    <span>Due {new Date(d.dueDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                    <span className="font-semibold text-[var(--os-text-1)]">{fmt(d.fee)}</span>
                  </div>
                </div>
              )
            })}
            {deliverables.length === 0 && <p className="text-sm text-[var(--os-text-2)] text-center py-6">No deliverables yet.</p>}
          </div>
        </div>

        {/* Notes */}
        <div className="os-card p-5">
          <h3 className="font-semibold text-[var(--os-text-1)] mb-4">Partner Notes</h3>
          <div className="space-y-3">
            {notes.map(note => {
              const Icon = NOTE_ICON[note.type]
              const nc = NOTE_COLOR[note.type]
              return (
                <div key={note.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: nc.bg }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: nc.icon }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--os-text-1)] leading-relaxed">{note.content}</p>
                    <p className="text-[10px] text-[var(--os-text-2)] mt-1">{note.author} · {new Date(note.date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</p>
                  </div>
                </div>
              )
            })}
            {notes.length === 0 && <p className="text-sm text-[var(--os-text-2)] text-center py-6">No notes yet.</p>}
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="os-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--os-text-1)]">Payment History</h3>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-700/50 text-[var(--os-text-2)]">{payments.length} invoices</span>
        </div>
        <div>
          {payments.map(p => {
            const statusColor = p.status === 'paid' ? '#00c875' : p.status === 'processing' ? '#579bfc' : p.status === 'overdue' ? '#e2445c' : '#fdab3d'
            return (
              <div key={p.id} className="flex items-center gap-4 px-4 py-3 border-b border-[var(--os-border)] hover:bg-[var(--os-surface-0)] last:border-0">
                <span className="font-mono text-xs text-[var(--os-text-2)] w-28 flex-shrink-0">{p.invoiceNumber}</span>
                <span className="text-sm text-[var(--os-text-1)] flex-1 truncate">{p.description}</span>
                <span className="font-bold text-[var(--os-text-1)] flex-shrink-0">{fmt(p.amount)}</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${statusColor}20`, color: statusColor }}>
                  {p.status}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--os-border)] flex items-center justify-between">
          <span className="text-sm text-[var(--os-text-2)]">Total pending</span>
          <span className="text-base font-black" style={{ color: '#fdab3d' }}>
            {fmt(payments.filter(p => p.status === 'pending' || p.status === 'processing').reduce((s,p)=>s+p.amount,0))}
          </span>
        </div>
      </div>
    </div>
  )
}
