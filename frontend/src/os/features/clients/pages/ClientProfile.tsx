import { useState } from 'react'
import { Phone, Mail, MessageSquare, Video, Star, ChevronLeft, ExternalLink, Check, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Button } from '@design-system/components/Button'
import { Progress } from '@design-system/components/Progress'
import { Divider } from '@design-system/components/Divider'
import { EditDrawer } from '@components/EditDrawer'
import { api, isDemo } from '@lib/api'
import { useClientsStore } from '../store'
import type { ClientHealth, RelationshipTier, InteractionType, Contact } from '../types'

const HEALTH_VARIANT: Record<ClientHealth, 'success' | 'warning' | 'danger' | 'info'> = {
  excellent: 'info', good: 'success', 'at-risk': 'warning', critical: 'danger',
}
const TIER_COLOR: Record<RelationshipTier, string> = {
  strategic: 'bg-[#0073ea] text-white shadow-sm font-bold',
  enterprise: 'bg-[#7f53f9] text-white shadow-sm font-bold',
  standard: 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300 font-bold',
  starter: 'bg-slate-900 text-slate-300 font-bold',
}
const INTERACTION_ICON: Record<InteractionType, React.ElementType> = {
  call: Phone, email: Mail, meeting: Video, note: MessageSquare, milestone: Star,
}
const INTERACTION_COLOR: Record<InteractionType, string> = {
  call: 'bg-[#00c875] text-white shadow-[0_2px_6px_rgba(0,200,117,0.2)]',
  email: 'bg-[#0073ea] text-white shadow-[0_2px_6px_rgba(0,115,234,0.2)]',
  meeting: 'bg-[#7f53f9] text-white shadow-[0_2px_6px_rgba(127,83,249,0.2)]',
  note: 'bg-[#fdab3d] text-white shadow-[0_2px_6px_rgba(253,171,61,0.2)]',
  milestone: 'bg-os-blue text-white shadow-[0_2px_6px_rgba(37,100,234,0.2)]',
}
const fmt = (n: number) => `₹${(n / 1000).toFixed(0)}k`

// ─── invite drawer ────────────────────────────────────────────────────────────

type InviteResult = { email: string; status: 'created' | 'exists'; tempPassword?: string }

function InviteToPortalDrawer({
  clientId,
  contacts,
  onClose,
}: {
  clientId: string
  contacts: Contact[]
  onClose: () => void
}) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(contacts.filter(c => c.isPrimary).map(c => c.email)))
  const [results, setResults] = useState<InviteResult[] | null>(null)

  const toggle = (email: string) =>
    setSelected(s => { const n = new Set(s); n.has(email) ? n.delete(email) : n.add(email); return n })

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload = contacts.filter(c => selected.has(c.email)).map(c => ({ name: c.name, email: c.email }))
      if (isDemo()) return payload.map(c => ({ email: c.email, status: 'created' as const, tempPassword: 'Demo123!' }))
      const res = await api.post(`/admin/clients/${clientId}/portal-invite`, { contacts: payload })
      return res.data.results as InviteResult[]
    },
    onSuccess: (data) => setResults(data),
  })

  const canSend = selected.size > 0 && !results

  return (
    <EditDrawer
      open
      onClose={onClose}
      title="Invite to Client Portal"
      description="Selected contacts will receive an email with their login credentials."
      width="md"
      footer={results ? (
        <Button variant="secondary" size="sm" onClick={onClose}>Done</Button>
      ) : (
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary" size="sm"
            leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
            disabled={!canSend || isPending}
            onClick={() => mutate()}
          >
            {isPending ? 'Sending…' : `Send ${selected.size > 0 ? `${selected.size} ` : ''}Invite${selected.size !== 1 ? 's' : ''}`}
          </Button>
        </>
      )}
    >
      {results ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-white">Invites sent</p>
          </div>
          {results.map(r => (
            <div key={r.email} className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-semibold text-slate-200 truncate">{r.email}</span>
                <Badge variant={r.status === 'created' ? 'success' : 'warning'} size="sm">
                  {r.status === 'created' ? 'Account created' : 'Already exists'}
                </Badge>
              </div>
              {r.tempPassword && (
                <p className="text-xs text-slate-500 mt-1">
                  Temp password: <span className="font-mono text-blue-400">{r.tempPassword}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {contacts.length} contact{contacts.length !== 1 ? 's' : ''} on this account
          </p>
          {contacts.map(ct => (
            <button
              key={ct.email}
              onClick={() => toggle(ct.email)}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
              style={{
                background: selected.has(ct.email) ? 'rgba(37,100,234,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selected.has(ct.email) ? 'rgba(37,100,234,0.3)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                selected.has(ct.email) ? 'bg-os-blue' : 'border border-slate-600'
              }`}>
                {selected.has(ct.email) && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <Avatar name={ct.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-slate-200 truncate">{ct.name}</p>
                  {ct.isPrimary && <Badge variant="brand" size="sm">Primary</Badge>}
                </div>
                <p className="text-xs text-slate-500 truncate">{ct.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </EditDrawer>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

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

  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Selector + back */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4"/>} onClick={() => navigate('/kangqore-view/admin/clients')}>
          All Clients
        </Button>
        <select
          value={selectedId}
          onChange={e => setSelected(e.target.value)}
          className="h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-slate-300 pl-3 pr-8 outline-none focus:border-os-blue focus:ring-2 focus:ring-os-blue/20"
        >
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <Button
          variant="secondary" size="sm"
          leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
          onClick={() => setInviteOpen(true)}
          className="ml-auto"
        >
          Invite to Portal
        </Button>
      </div>

      {/* Header card */}
      <Card variant="glass" className="relative overflow-hidden">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-os-blue to-os-cyan flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(37,100,234,0.15)]">
            <span className="text-white font-bold text-xl">{client.logo}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h2 className="text-xl font-bold text-white">{client.name}</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${TIER_COLOR[client.tier]}`}>{client.tier}</span>
              <Badge variant={HEALTH_VARIANT[client.health]} dot size="sm">{client.health}</Badge>
              <Badge variant={client.status === 'active' ? 'success' : client.status === 'onboarding' ? 'info' : 'warning'} size="sm">{client.status}</Badge>
            </div>
            <p className="text-sm text-slate-500 mb-3">{client.industry} · {client.country}</p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{client.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-2xl font-bold tracking-tight text-white">{fmt(client.arr)}</p>
              <p className="text-xs text-slate-500">Annual Recurring Revenue</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-300">{client.satisfactionScore}</span>
              <span className="text-slate-500 text-xs">/ 100 satisfaction</span>
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
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">{s.label}</p>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">{s.value}</p>
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
                    <p className="text-sm font-semibold text-slate-200 truncate">{ct.name}</p>
                    {ct.isPrimary && <Badge variant="brand" size="sm">Primary</Badge>}
                  </div>
                  <p className="text-xs text-slate-500">{ct.role}</p>
                  <p className="text-xs text-slate-500 truncate">{ct.email}</p>
                </div>
                <div className="flex gap-1.5">
                   <button className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-os-blue/10 hover:text-os-blue flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                     <Mail className="w-3.5 h-3.5 text-slate-500" />
                   </button>
                   {ct.phone && (
                     <button className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-[#00c875]/10 hover:text-[#00c875] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
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
                  <span className="text-xs font-medium text-slate-500">{sla.metric}</span>
                  <Badge variant={sla.status === 'met' ? 'success' : sla.status === 'at-risk' ? 'warning' : 'danger'} size="sm">
                    {sla.current}{sla.unit}
                  </Badge>
                </div>
                <Progress
                  value={Math.min(100, (sla.current / sla.target) * 100)}
                  size="sm"
                  color={sla.status === 'met' ? 'success' : sla.status === 'at-risk' ? 'warning' : 'danger'}
                />
                <p className="text-[10px] font-semibold text-slate-500 mt-1 tracking-wide">Target: {sla.target}{sla.unit}</p>
              </div>
            ))}
            {slas.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">No SLAs defined</p>}
          </div>
        </Card>

        {/* Milestones */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Delivery</CardTitle>
            <span className="text-xs text-slate-500">{completedMs}/{milestones.length} done</span>
          </CardHeader>
          <div className="space-y-3.5">
            {milestones.map(ms => (
              <div key={ms.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  ms.status === 'completed'   ? 'bg-green-500' :
                  ms.status === 'in-progress' ? 'bg-os-blue' :
                  ms.status === 'delayed'     ? 'bg-red-500'   : 'bg-slate-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-tight ${ms.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{ms.title}</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-1">
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
          <div className="divide-y divide-[#2E2854]/60">
            {interactions.slice(0, 5).map((interaction) => {
              const Icon = INTERACTION_ICON[interaction.type]
              return (
                <div key={interaction.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${INTERACTION_COLOR[interaction.type]}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-200 truncate">{interaction.title}</p>
                      <span className="text-[10px] text-slate-500 flex-shrink-0">{new Date(interaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
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
          <div className="divide-y divide-[#2E2854]/60">
            {governance.map(item => (
              <div key={item.id} className="py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xs font-semibold text-slate-200 flex-1 truncate">{item.title}</p>
                  <span className="text-[10px] font-semibold text-slate-500 capitalize">{item.status}</span>
                </div>
                <p className="text-[11px] text-slate-505 line-clamp-1">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {inviteOpen && (
        <InviteToPortalDrawer
          clientId={client.id}
          contacts={client.contacts}
          onClose={() => setInviteOpen(false)}
        />
      )}
    </div>
  )
}
