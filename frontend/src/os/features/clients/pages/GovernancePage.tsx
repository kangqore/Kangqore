import { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, GitMerge, Search } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { useClientsStore } from '../store'
import type { GovernanceType, GovernanceStatus } from '../types'

const TYPE_ICON: Record<GovernanceType, React.ElementType> = {
  decision:        CheckCircle,
  'change-request':GitMerge,
  steering:        Clock,
  escalation:      AlertTriangle,
}
const TYPE_COLOR: Record<GovernanceType, string> = {
  decision:        'bg-[#2564ea]/10 text-os-blue',
  'change-request':'bg-amber-100 text-amber-600',
  steering:        'bg-os-s1 text-slate-300',
  escalation:      'bg-red-100 text-red-600',
}
const STATUS_VARIANT: Record<GovernanceStatus,'success'|'warning'|'danger'|'neutral'|'info'> = {
  approved: 'success', closed: 'info', open: 'warning', pending: 'neutral', rejected: 'danger',
}
const PRIORITY_VARIANT = {
  critical: 'danger', high: 'warning', medium: 'neutral', low: 'neutral',
} as const

export function GovernancePage() {
  const { clients, governance } = useClientsStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setType]     = useState<GovernanceType | 'all'>('all')
  const [statusFilter, setStatus] = useState<GovernanceStatus | 'all'>('all')
  const [clientFilter, setClient] = useState('all')

  const visible = governance.filter(g =>
    (typeFilter === 'all'   || g.type === typeFilter) &&
    (statusFilter === 'all' || g.status === statusFilter) &&
    (clientFilter === 'all' || g.clientId === clientFilter) &&
    g.title.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const p = { critical: 0, high: 1, medium: 2, low: 3 }
    return p[a.priority] - p[b.priority] || b.date.localeCompare(a.date)
  })

  const open      = governance.filter(g => g.status === 'open').length

  const pending   = governance.filter(g => g.status === 'pending').length
  const critical  = governance.filter(g => g.priority === 'critical' && (g.status === 'open' || g.status === 'pending')).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Governance</h2>
          <p className="text-sm text-slate-500 mt-0.5">{governance.length} items · decisions, changes, steering, escalations</p>
        </div>
        <div className="flex items-center gap-2">
          {critical > 0 && <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200"><AlertTriangle className="w-3.5 h-3.5"/>{critical} critical open</span>}
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">{open} open</span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 border border-os-border">{pending} pending</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Search…" prefix={<Search className="w-3.5 h-3.5"/>} className="w-52" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={typeFilter} onChange={e => setType(e.target.value as GovernanceType | 'all')}
          className="h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-slate-300 pl-3 pr-8 outline-none focus:border-os-blue focus:ring-2 focus:ring-[#2564ea]/20">
          <option value="all">All Types</option>
          <option value="decision">Decisions</option>
          <option value="change-request">Change Requests</option>
          <option value="steering">Steering</option>
          <option value="escalation">Escalations</option>
        </select>
        <select value={statusFilter} onChange={e => setStatus(e.target.value as GovernanceStatus | 'all')}
          className="h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-slate-300 pl-3 pr-8 outline-none focus:border-os-blue focus:ring-2 focus:ring-[#2564ea]/20">
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="closed">Closed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={clientFilter} onChange={e => setClient(e.target.value)}
          className="h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-slate-300 pl-3 pr-8 outline-none focus:border-os-blue focus:ring-2 focus:ring-[#2564ea]/20">
          <option value="all">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span className="ml-auto text-sm text-slate-500">{visible.length} items</span>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {visible.map(item => {
          const client  = clients.find(c => c.id === item.clientId)
          const Icon    = TYPE_ICON[item.type]
          return (
            <Card key={item.id}>
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLOR[item.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                        <Badge variant={PRIORITY_VARIANT[item.priority]} size="sm">{item.priority}</Badge>
                        <Badge variant={STATUS_VARIANT[item.status]} size="sm">{item.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 capitalize">{item.type.replace('-',' ')} · {client?.name}</p>
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                  {item.resolution && (
                    <div className="mt-2 flex items-start gap-2 p-2.5 bg-green-50 rounded-xl">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-green-700">{item.resolution}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-os-border">
                    <Avatar name={item.owner} size="xs" />
                    <span className="text-xs text-slate-500">{item.owner}</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
        {visible.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">No governance items match your filters.</div>
        )}
      </div>
    </div>
  )
}
