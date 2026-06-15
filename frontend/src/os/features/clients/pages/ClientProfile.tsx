import { Phone, Mail, MessageSquare, Video, Star, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Button } from '@design-system/components/Button'
import { Progress } from '@design-system/components/Progress'
import { Divider } from '@design-system/components/Divider'
import { useClientsStore } from '../store'
import type { ClientHealth, RelationshipTier, InteractionType } from '../types'

const HEALTH_VARIANT: Record<ClientHealth, 'success' | 'warning' | 'danger' | 'info'> = {
  excellent: 'info', good: 'success', 'at-risk': 'warning', critical: 'danger',
}
const TIER_COLOR: Record<RelationshipTier, string> = {
  strategic: 'bg-[#0073ea] text-white shadow-sm font-bold',
  enterprise: 'bg-[#7f53f9] text-white shadow-sm font-bold',
  standard: 'bg-slate-100 text-slate-700 font-bold',
  starter: 'bg-slate-50 text-slate-500 font-bold',
}
const INTERACTION_ICON: Record<InteractionType, React.ElementType> = {
  call: Phone, email: Mail, meeting: Video, note: MessageSquare, milestone: Star,
}
const INTERACTION_COLOR: Record<InteractionType, string> = {
  call: 'bg-[#00c875] text-white shadow-[0_2px_6px_rgba(0,200,117,0.2)]',
  email: 'bg-[#0073ea] text-white shadow-[0_2px_6px_rgba(0,115,234,0.2)]',
  meeting: 'bg-[#7f53f9] text-white shadow-[0_2px_6px_rgba(127,83,249,0.2)]',
  note: 'bg-[#fdab3d] text-white shadow-[0_2px_6px_rgba(253,171,61,0.2)]',
  milestone: 'bg-[#2564ea] text-white shadow-[0_2px_6px_rgba(37,100,234,0.2)]',
}
const fmt = (n: number) => `£${(n / 1000).toFixed(0)}k`

export function ClientProfile() {
  const navigate = useNavigate()
  const { clients, setSelected, clientInteractions, clientSLAs, clientMilestones, clientGovernance } = useClientsStore()
  const selectedId = useClientsStore(s => s.selectedId)
  const client = clients.find(c => c.id === selectedId) ?? clients[0]

  const interactions = clientInteractions(client.id)
  const slas         = clientSLAs(client.id)
  const milestones   = clientMilestones(client.id)
  const governance   = clientGovernance(client.id).slice(0, 4)

  const slaBreached  = slas.filter(s => s.status === 'breached').length
  const slaAtRisk    = slas.filter(s => s.status === 'at-risk').length
  const completedMs  = milestones.filter(m => m.status === 'completed').length
  return (
    <div className="space-y-6">
      {/* Selector + back */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4"/>} onClick={() => navigate('/kangqore-view/clients')}>
          All Clients
        </Button>
        <select
          value={selectedId}
          onChange={e => setSelected(e.target.value)}
          className="ml-auto h-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pl-3 pr-8 outline-none focus:border-[#2564ea] focus:ring-2 focus:ring-[#2564ea]/20"
        >
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Header card */}
      <Card variant="glass" className="relative overflow-hidden">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2564ea] to-[#4ab6d4] flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(37,100,234,0.15)]">
            <span className="text-white font-bold text-xl">{client.logo}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h2 className="text-xl font-bold text-slate-900">{client.name}</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${TIER_COLOR[client.tier]}`}>{client.tier}</span>
              <Badge variant={HEALTH_VARIANT[client.health]} dot size="sm">{client.health}</Badge>
              <Badge variant={client.status === 'active' ? 'success' : client.status === 'onboarding' ? 'info' : 'warning'} size="sm">{client.status}</Badge>
            </div>
            <p className="text-sm text-slate-500 mb-3">{client.industry} · {client.country}</p>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{client.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">{fmt(client.arr)}</p>
              <p className="text-xs text-slate-400">Annual Recurring Revenue</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-700">{client.satisfactionScore}</span>
              <span className="text-slate-400 text-xs">/ 100 satisfaction</span>
            </div>
          </div>
        </div>

        <Divider className="my-4" />

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Contract start',  value: new Date(client.contractStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { label: 'Contract end',    value: new Date(client.contractEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { label: 'Account owner',   value: client.owner.split(' ')[0] },
            { label: 'Last activity',   value: new Date(client.lastActivity).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) },
          ].map(s => (
            <div key={s.label}>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">{s.label}</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Contract timeline */}
        <div className="mt-4">
          <Progress
            value={Math.min(100, Math.round(
              (Date.now() - new Date(client.contractStart).getTime()) /
              (new Date(client.contractEnd).getTime() - new Date(client.contractStart).getTime()) * 100
            ))}
            color={client.health === 'critical' ? 'danger' : client.health === 'at-risk' ? 'warning' : 'brand'}
            size="md"
            label="Contract consumed"
            showValue
          />
        </div>
      </Card>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Contacts */}
        <Card variant="glass">
          <CardHeader><CardTitle>Key Contacts</CardTitle></CardHeader>
          <div className="space-y-3.5">
            {client.contacts.map(ct => (
              <div key={ct.id} className="flex items-center gap-3">
                <Avatar name={ct.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">{ct.name}</p>
                    {ct.isPrimary && <Badge variant="brand" size="sm">Primary</Badge>}
                  </div>
                  <p className="text-xs text-slate-400">{ct.role}</p>
                  <p className="text-xs text-slate-400 truncate">{ct.email}</p>
                </div>
                <div className="flex gap-1.5">
                   <button className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-[#2564ea]/10 hover:text-[#2564ea] flex items-center justify-center transition-all duration-300">
                     <Mail className="w-3.5 h-3.5 text-slate-500" />
                   </button>
                   {ct.phone && (
                     <button className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-[#00c875]/10 hover:text-[#00c875] flex items-center justify-center transition-all duration-300">
                       <Phone className="w-3.5 h-3.5 text-slate-500" />
                     </button>
                   )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* SLA summary */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>SLA Health</CardTitle>
            <div className="flex items-center gap-2">
              {slaBreached > 0 && <Badge variant="danger" dot size="sm">{slaBreached} breached</Badge>}
              {slaAtRisk > 0 && <Badge variant="warning" dot size="sm">{slaAtRisk} at risk</Badge>}
            </div>
          </CardHeader>
          <div className="space-y-4">
            {slas.map(sla => (
              <div key={sla.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-600">{sla.metric}</span>
                  <Badge variant={sla.status === 'met' ? 'success' : sla.status === 'at-risk' ? 'warning' : 'danger'} size="sm">
                    {sla.current}{sla.unit}
                  </Badge>
                </div>
                <Progress
                  value={Math.min(100, (sla.current / sla.target) * 100)}
                  size="sm"
                  color={sla.status === 'met' ? 'success' : sla.status === 'at-risk' ? 'warning' : 'danger'}
                />
                <p className="text-[10px] font-semibold text-slate-400 mt-1 tracking-wide">Target: {sla.target}{sla.unit}</p>
              </div>
            ))}
            {slas.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">No SLAs defined</p>}
          </div>
        </Card>

        {/* Milestones */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Delivery</CardTitle>
            <span className="text-xs text-slate-400">{completedMs}/{milestones.length} done</span>
          </CardHeader>
          <div className="space-y-3.5">
            {milestones.map(ms => (
              <div key={ms.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  ms.status === 'completed'   ? 'bg-green-500' :
                  ms.status === 'in-progress' ? 'bg-[#2564ea]' :
                  ms.status === 'delayed'     ? 'bg-red-500'   : 'bg-slate-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-tight ${ms.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{ms.title}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1">
                    {ms.status === 'completed'
                      ? `Done ${new Date(ms.completedDate!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                      : `Due ${new Date(ms.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                    }
                    {ms.status === 'delayed' && <span className="text-red-500 ml-1">· delayed</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Interaction timeline + governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interaction history */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <Badge variant="neutral" size="sm">{interactions.length} entries</Badge>
          </CardHeader>
          <div className="divide-y divide-slate-100/60">
            {interactions.slice(0, 5).map((interaction) => {
              const Icon = INTERACTION_ICON[interaction.type]
              return (
                <div key={interaction.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${INTERACTION_COLOR[interaction.type]}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800 truncate">{interaction.title}</p>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{new Date(interaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{interaction.summary}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Governance */}
        <Card>
          <CardHeader>
            <CardTitle>Governance Log</CardTitle>
            <Badge variant={governance.some(g => g.priority === 'critical') ? 'danger' : 'neutral'} size="sm">
              {governance.filter(g => g.status === 'open' || g.status === 'pending').length} open
            </Badge>
          </CardHeader>
          <div className="divide-y divide-slate-100/60">
            {governance.map(item => (
              <div key={item.id} className="py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xs font-semibold text-slate-800 flex-1 truncate">{item.title}</p>
                  <span className="text-[10px] font-semibold text-slate-400 capitalize">{item.status}</span>
                </div>
                <p className="text-[11px] text-slate-505 line-clamp-1">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
