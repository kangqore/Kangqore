import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, AlertTriangle, Users, DollarSign, Star } from 'lucide-react'
import { StaggerList, StaggerItem } from '@components/animations/Stagger'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Card } from '@design-system/components/Card'
import { StatCard } from '@design-system/components/StatCard'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { Progress } from '@design-system/components/Progress'
import { useClientsStore } from '../store'
import type { ClientHealth, RelationshipTier } from '../types'

const HEALTH_VARIANT: Record<ClientHealth, 'success' | 'warning' | 'danger' | 'info'> = {
  excellent: 'info', good: 'success', 'at-risk': 'warning', critical: 'danger',
}
const TIER_COLOR: Record<RelationshipTier, string> = {
  strategic:  'bg-[#2564ea]/10 text-[#2564ea] border border-[#2564ea]/20',
  enterprise: 'bg-violet-50 text-violet-700 border border-violet-200',
  standard:   'bg-slate-100 text-slate-600 border border-slate-200',
  starter:    'bg-slate-50 text-slate-400 border border-slate-200',
}
const fmt = (n: number) => `£${(n / 1000).toFixed(0)}k`

export function ClientsOverview() {
  const { clients, setSelected } = useClientsStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [tierFilter, setTier] = useState<RelationshipTier | 'all'>('all')

  const visible = clients.filter(c =>
    (tierFilter === 'all' || c.tier === tierFilter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.industry.toLowerCase().includes(search.toLowerCase()))
  )

  const totalARR   = clients.reduce((s, c) => s + c.arr, 0)
  const activeCount = clients.filter(c => c.status === 'active').length
  const atRisk      = clients.filter(c => c.health === 'at-risk' || c.health === 'critical').length
  const avgNPS      = Math.round(clients.reduce((s, c) => s + c.satisfactionScore, 0) / clients.length)

  function openClient(id: string) {
    setSelected(id)
    navigate('/os/clients/profile')
  }

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Clients" />
      <div>
        <h2 className="text-xl font-bold text-slate-900">Clients</h2>
        <p className="text-sm text-slate-500 mt-0.5">{clients.length} clients · {activeCount} active</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total ARR"       value={fmt(totalARR)} icon={<DollarSign    className="w-5 h-5"/>} iconColor="bg-[#2564ea]/10 text-[#2564ea]" change={14} changeLabel="YoY" />
        <StatCard label="Active Clients"  value={activeCount}   icon={<Users         className="w-5 h-5"/>} iconColor="bg-green-100 text-green-600"   />
        <StatCard label="At Risk / Critical" value={atRisk}     icon={<AlertTriangle className="w-5 h-5"/>} iconColor={atRisk > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'} />
        <StatCard label="Avg Satisfaction" value={`${avgNPS}`}  icon={<Star          className="w-5 h-5"/>} iconColor="bg-amber-100 text-amber-600" suffix="/100" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Search clients…" prefix={<Search className="w-3.5 h-3.5"/>} className="w-56" value={search} onChange={e => setSearch(e.target.value)} />
        {(['all','strategic','enterprise','standard','starter'] as const).map(t => (
          <button key={t} onClick={() => setTier(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${tierFilter === t ? 'bg-[#2564ea] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#2564ea]/40'}`}>
            {t === 'all' ? 'All Tiers' : t}
          </button>
        ))}
      </div>

      {/* Client cards */}
      <StaggerList className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visible.map(client => (
          <StaggerItem key={client.id}>
          <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full" onClick={() => openClient(client.id)}>
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2564ea] to-[#4ab6d4] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{client.logo}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{client.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{client.industry} · {client.country}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${TIER_COLOR[client.tier]}`}>
                      {client.tier}
                    </span>
                    <Badge variant={HEALTH_VARIANT[client.health]} dot size="sm">{client.health}</Badge>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-1">{client.description}</p>

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800 text-sm">{fmt(client.arr)}<span className="font-normal text-slate-400 text-xs"> ARR</span></span>
                  <span>Owner: <strong className="text-slate-700">{client.owner.split(' ')[0]}</strong></span>
                  <span>NPS <strong className={client.satisfactionScore >= 75 ? 'text-green-600' : client.satisfactionScore >= 55 ? 'text-amber-600' : 'text-red-600'}>{client.satisfactionScore}</strong></span>
                  <Badge variant={client.status === 'active' ? 'success' : client.status === 'onboarding' ? 'info' : client.status === 'paused' ? 'warning' : 'neutral'} size="sm" className="ml-auto">
                    {client.status}
                  </Badge>
                </div>

                {/* Contract progress */}
                {client.status !== 'churned' && (
                  <div className="mt-3">
                    <Progress
                      value={Math.round(
                        (Date.now() - new Date(client.contractStart).getTime()) /
                        (new Date(client.contractEnd).getTime() - new Date(client.contractStart).getTime()) * 100
                      )}
                      size="sm"
                      color={client.health === 'critical' ? 'danger' : client.health === 'at-risk' ? 'warning' : 'brand'}
                      label={`Contract · ends ${new Date(client.contractEnd).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`}
                    />
                  </div>
                )}

                {/* Contacts */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <div className="flex -space-x-2">
                    {client.contacts.slice(0, 3).map(ct => (
                      <div key={ct.id} className="ring-2 ring-white rounded-full">
                        <Avatar name={ct.name} size="xs" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{client.contacts[0]?.name} {client.contacts.length > 1 && `+${client.contacts.length - 1}`}</span>
                </div>
              </div>
            </div>
          </Card>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  )
}
