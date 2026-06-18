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
  strategic:  'bg-[#2564ea]/20 text-[#4ab6d4] border border-[#4ab6d4]/30',
  enterprise: 'bg-violet-900/20 text-violet-300 border border-violet-500/30',
  standard:   'bg-[#151C2F] text-slate-300 border border-[#2E2854]',
  starter:    'bg-[#0F172A] text-slate-300 border border-[#2E2854]',
}
const fmt = (n: number) => `₹${(n / 1000).toFixed(0)}k`

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
    navigate('/kangqore-view/admin/clients/profile')
  }

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Clients" />
      <div>
        <h2 className="text-xl font-bold text-white">Clients</h2>
        <p className="text-sm text-slate-500 mt-0.5">{clients.length} clients · {activeCount} active</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total ARR"       value={fmt(totalARR)} icon={<DollarSign    className="w-5 h-5"/>} iconColor="bg-[#2564ea]/20 text-[#4ab6d4]" change={14} changeLabel="YoY" />
        <StatCard label="Active Clients"  value={activeCount}   icon={<Users         className="w-5 h-5"/>} iconColor="bg-[#00c875]/20 text-[#00c875]"   />
        <StatCard label="At Risk / Critical" value={atRisk}     icon={<AlertTriangle className="w-5 h-5"/>} iconColor={atRisk > 0 ? 'bg-[#fdab3d]/20 text-[#fdab3d]' : 'bg-[#151C2F] text-slate-300'} />
        <StatCard label="Avg Satisfaction" value={`${avgNPS}`}  icon={<Star          className="w-5 h-5"/>} iconColor="bg-[#fdab3d]/20 text-[#fdab3d]" suffix="/100" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Search clients…" prefix={<Search className="w-3.5 h-3.5"/>} className="w-56" value={search} onChange={e => setSearch(e.target.value)} />
        {(['all','strategic','enterprise','standard','starter'] as const).map(t => (
          <button key={t} onClick={() => setTier(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${tierFilter === t ? 'bg-[#4ab6d4] text-[#0F172A]' : 'bg-[#151C2F] border border-[#2E2854] text-slate-300 hover:text-white'}`}>
            {t === 'all' ? 'All Tiers' : t}
          </button>
        ))}
      </div>

      {/* Client cards */}
      <StaggerList className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visible.map(client => (
          <StaggerItem key={client.id}>
          <Card className="hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full border-[#2E2854]" onClick={() => openClient(client.id)}>
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2564ea] to-[#4ab6d4] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{client.logo}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate">{client.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{client.industry} · {client.country}</p>
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
                  <span className="font-semibold text-slate-200 text-sm">{fmt(client.arr)}<span className="font-normal text-slate-500 text-xs"> ARR</span></span>
                  <span>Owner: <strong className="text-slate-300">{client.owner.split(' ')[0]}</strong></span>
                  <span>NPS <strong className={client.satisfactionScore >= 75 ? 'text-[#00c875]' : client.satisfactionScore >= 55 ? 'text-[#fdab3d]' : 'text-[#e2445c]'}>{client.satisfactionScore}</strong></span>
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
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#2E2854]">
                  <div className="flex -space-x-2">
                    {client.contacts.slice(0, 3).map(ct => (
                      <div key={ct.id} className="ring-2 ring-[#151C2F] rounded-full">
                        <Avatar name={ct.name} size="xs" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">{client.contacts[0]?.name} {client.contacts.length > 1 && `+${client.contacts.length - 1}`}</span>
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
