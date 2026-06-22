import { useNavigate } from 'react-router-dom'
import { Star, Mail, Phone, ChevronLeft, MessageSquare, AlertCircle, ThumbsUp, Wrench } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'

import { Divider } from '@design-system/components/Divider'
import { usePartnersStore } from '../store'
import type { PartnerTier, DeliverableStatus, PartnerNote } from '../types'

const TIER_STYLE: Record<PartnerTier, string> = {
  platinum: 'bg-gradient-to-r from-os-blue to-os-cyan text-white',
  gold:     'bg-amber-100 text-amber-700',
  silver:   'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300',
  associate:'bg-slate-900  text-slate-300',
}
const DELIVERABLE_VARIANT: Record<DeliverableStatus,'success'|'info'|'warning'|'danger'|'neutral'> = {
  approved: 'success', submitted: 'info', 'in-progress': 'neutral', revision: 'warning', 'not-started': 'neutral',
}
const NOTE_ICON: Record<PartnerNote['type'], React.ElementType> = {
  praise: ThumbsUp, issue: AlertCircle, performance: Wrench, general: MessageSquare,
}
const NOTE_COLOR: Record<PartnerNote['type'], string> = {
  praise: 'bg-green-100 text-green-600', issue: 'bg-red-100 text-red-600',
  performance: 'bg-amber-100 text-amber-600', general: 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  )
}

const fmt = (n: number) => `₹${n.toLocaleString()}`

export function PartnerProfile() {
  const navigate = useNavigate()
  const { partners, selectedId, setSelected, partnerTasks, partnerDeliverables, partnerPayments, partnerNotes } = usePartnersStore()
  const partner     = partners.find(p => p.id === selectedId) ?? partners[0]
  const tasks       = partnerTasks(partner.id)
  const deliverables= partnerDeliverables(partner.id)
  const payments    = partnerPayments(partner.id)
  const notes       = partnerNotes(partner.id)

  const completedDel = deliverables.filter(d => d.status === 'approved').length
  const pendingDel   = deliverables.filter(d => d.status === 'submitted' || d.status === 'in-progress').length
  const activeTasks  = tasks.filter(t => t.status !== 'completed').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4"/>} onClick={() => navigate('/kangqore-view/admin/partners')}>
          All Partners
        </Button>
        <select value={selectedId} onChange={e => setSelected(e.target.value)}
          className="ml-auto h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-slate-300 pl-3 pr-8 outline-none focus:border-os-blue focus:ring-2 focus:ring-os-blue/20">
          {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Header */}
      <Card>
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-os-blue to-os-cyan flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">{partner.logo}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h2 className="text-xl font-bold text-white">{partner.name}</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${TIER_STYLE[partner.tier]}`}>{partner.tier}</span>
              <Badge variant={partner.status === 'active' ? 'success' : partner.status === 'paused' ? 'warning' : 'neutral'} dot size="sm">{partner.status}</Badge>
            </div>
            <p className="text-sm text-slate-500 capitalize mb-2">{partner.type} · {partner.country}</p>
            <Stars rating={partner.rating} />
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{partner.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <p className="text-2xl font-bold tracking-tight text-white">{fmt(partner.totalEarned)}</p>
            <p className="text-xs text-slate-500">total earned</p>
            {partner.pendingPayment > 0 && (
              <Badge variant="warning" size="sm">₹{(partner.pendingPayment/1000).toFixed(0)}k pending</Badge>
            )}
          </div>
        </div>

        <Divider className="my-4" />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Rate',        value: `₹${partner.hourlyRate}/hr`          },
            { label: 'Active tasks',value: `${activeTasks}`                     },
            { label: 'Deliverables',value: `${completedDel}/${deliverables.length} done`   },
            { label: 'Projects',    value: `${partner.completedProjects} completed`},
            { label: 'Partner since',value: new Date(partner.joinDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })},
          ].map(s => (
            <div key={s.label}>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {partner.specialisms.map(s => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-os-blue/5 text-os-blue font-medium border border-os-blue/15">{s}</span>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10 border-t-white/20">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Mail className="w-4 h-4 text-slate-500" />
            {partner.contact.email}
          </div>
          {partner.contact.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone className="w-4 h-4 text-slate-500" />
              {partner.contact.phone}
            </div>
          )}
          <span className="text-xs text-slate-500 ml-2">{partner.contact.name} · {partner.contact.role}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Deliverables */}
        <Card>
          <CardHeader>
            <CardTitle>Deliverables</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">{completedDel} approved</Badge>
              {pendingDel > 0 && <Badge variant="info" size="sm">{pendingDel} in review</Badge>}
            </div>
          </CardHeader>
          <div className="space-y-3">
            {deliverables.map(d => (
              <div key={d.id} className="p-3 rounded-xl bg-slate-900 border border-white/10 border-t-white/20">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-200">{d.title}</p>
                  <Badge variant={DELIVERABLE_VARIANT[d.status]} size="sm">{d.status.replace('-',' ')}</Badge>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{d.description}</p>
                {d.feedback && (
                  <p className="text-xs text-slate-500 mt-1.5 italic border-l-2 border-white/10 border-t-white/20 pl-2">{d.feedback}</p>
                )}
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                  <span>Due {new Date(d.dueDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                  <span className="font-semibold text-slate-500">{fmt(d.fee)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader><CardTitle>Partner Notes</CardTitle></CardHeader>
          <div className="space-y-3">
            {notes.map(note => {
              const Icon = NOTE_ICON[note.type]
              return (
                <div key={note.id} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${NOTE_COLOR[note.type]}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 leading-relaxed">{note.content}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{note.author} · {new Date(note.date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</p>
                  </div>
                </div>
              )
            })}
            {notes.length === 0 && <p className="text-sm text-slate-500 text-center py-6">No notes yet.</p>}
          </div>
        </Card>
      </div>

      {/* Recent payments */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <Badge variant="neutral" size="sm">{payments.length} invoices</Badge>
        </CardHeader>
        <div className="space-y-2">
          {payments.map(p => (
            <div key={p.id} className="flex items-center gap-4 py-2.5 border-b border-white/10 border-t-white/20 last:border-0">
              <span className="font-mono text-xs text-slate-500 w-28 flex-shrink-0">{p.invoiceNumber}</span>
              <span className="text-sm text-slate-300 flex-1 truncate">{p.description}</span>
              <span className="font-bold text-white flex-shrink-0">{fmt(p.amount)}</span>
              <Badge variant={p.status === 'paid' ? 'success' : p.status === 'processing' ? 'info' : p.status === 'overdue' ? 'danger' : 'warning'} dot size="sm">
                {p.status}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 border-t-white/20 flex items-center justify-between">
          <span className="text-sm text-slate-500">Total pending</span>
          <span className="text-base font-bold text-amber-600">
            {fmt(payments.filter(p => p.status === 'pending' || p.status === 'processing').reduce((s,p)=>s+p.amount,0))}
          </span>
        </div>
      </Card>
    </div>
  )
}
