import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, AlertTriangle, Users, DollarSign, Star, CheckSquare, Trash2 } from 'lucide-react'
import { StaggerList, StaggerItem } from '@components/animations/Stagger'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Card } from '@design-system/components/Card'
import { StatCard } from '@design-system/components/StatCard'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { Progress } from '@design-system/components/Progress'
import { BulkActionBar } from '@components/BulkActionBar'
import { InlineSelect } from '@components/InlineSelect'
import { useClientsStore } from '../store'
import { api, isDemo } from '@lib/api'
import type { ClientHealth, RelationshipTier, ClientStatus } from '../types'

const HEALTH_OPTIONS = [
  { value: 'excellent', label: 'Excellent', variant: 'info'    as const },
  { value: 'good',      label: 'Good',      variant: 'success' as const },
  { value: 'at-risk',   label: 'At Risk',   variant: 'warning' as const },
  { value: 'critical',  label: 'Critical',  variant: 'danger'  as const },
]
const STATUS_OPTIONS = [
  { value: 'active',     label: 'Active',     variant: 'success' as const },
  { value: 'onboarding', label: 'Onboarding', variant: 'info'    as const },
  { value: 'paused',     label: 'Paused',     variant: 'warning' as const },
  { value: 'churned',    label: 'Churned',    variant: 'neutral' as const },
]

const TIER_COLOR: Record<RelationshipTier, string> = {
  strategic:  'bg-os-blue/20 text-os-cyan border border-os-cyan/30',
  enterprise: 'bg-violet-900/20 text-violet-300 border border-violet-500/30',
  standard:   'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300 border border-white/10 border-t-white/20',
  starter:    'bg-slate-900 text-slate-300 border border-white/10 border-t-white/20',
}
const fmt = (n: number) => `₹${(n / 1000).toFixed(0)}k`

export function ClientsOverview() {
  const { clients, setSelected, updateClient, bulkUpdateClients, bulkDeleteClients } = useClientsStore()
  const navigate = useNavigate()

  function patchClient(id: string, patch: Partial<Parameters<typeof updateClient>[1]>) {
    updateClient(id, patch)
    if (!isDemo()) api.patch(`/admin/crm/clients/${id}`, patch)
  }
  const [search, setSearch] = useState('')
  const [tierFilter, setTier] = useState<RelationshipTier | 'all'>('all')
  const [selecting, setSelecting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

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
    if (selecting) { toggleSelect(id); return }
    setSelected(id)
    navigate('/kangqore-view/admin/clients/profile')
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (visible.every(c => selectedIds.has(c.id))) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(visible.map(c => c.id)))
    }
  }

  function clearSelection() {
    setSelectedIds(new Set())
    setSelecting(false)
  }

  async function handleBulkHealth(health: string) {
    const ids = [...selectedIds]
    bulkUpdateClients(ids, { health: health as ClientHealth })
    if (!isDemo()) {
      await Promise.all(ids.map(id => api.patch(`/admin/crm/clients/${id}`, { health })))
    }
    setSelectedIds(new Set())
  }

  async function handleBulkStatus(status: string) {
    const ids = [...selectedIds]
    bulkUpdateClients(ids, { status: status as ClientStatus })
    if (!isDemo()) {
      await Promise.all(ids.map(id => api.patch(`/admin/crm/clients/${id}`, { status })))
    }
    setSelectedIds(new Set())
  }

  async function handleBulkTier(tier: string) {
    const ids = [...selectedIds]
    bulkUpdateClients(ids, { tier: tier as RelationshipTier })
    if (!isDemo()) {
      await Promise.all(ids.map(id => api.patch(`/admin/crm/clients/${id}`, { tier })))
    }
    setSelectedIds(new Set())
  }

  async function handleBulkDelete() {
    const ids = [...selectedIds]
    bulkDeleteClients(ids)
    if (!isDemo()) {
      await Promise.all(ids.map(id => api.delete(`/admin/crm/clients/${id}`)))
    }
    clearSelection()
  }

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Clients" />
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Clients</h2>
          <p className="text-sm text-slate-500 mt-0.5">{clients.length} clients · {activeCount} active</p>
        </div>
        <button
          onClick={() => { setSelecting(s => !s); if (selecting) setSelectedIds(new Set()) }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
            selecting
              ? 'bg-os-blue/20 text-os-cyan border-os-cyan/40'
              : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-400 border-white/10 border-t-white/20 hover:text-white'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          {selecting ? 'Cancel Select' : 'Select'}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total ARR"       value={fmt(totalARR)} icon={<DollarSign    className="w-5 h-5"/>} iconColor="bg-os-blue/20 text-os-cyan" change={14} changeLabel="YoY" />
        <StatCard label="Active Clients"  value={activeCount}   icon={<Users         className="w-5 h-5"/>} iconColor="bg-[#00c875]/20 text-[#00c875]"   />
        <StatCard label="At Risk / Critical" value={atRisk}     icon={<AlertTriangle className="w-5 h-5"/>} iconColor={atRisk > 0 ? 'bg-[#fdab3d]/20 text-[#fdab3d]' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300'} />
        <StatCard label="Avg Satisfaction" value={`${avgNPS}`}  icon={<Star          className="w-5 h-5"/>} iconColor="bg-[#fdab3d]/20 text-[#fdab3d]" suffix="/100" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Search clients…" prefix={<Search className="w-3.5 h-3.5"/>} className="w-56" value={search} onChange={e => setSearch(e.target.value)} />
        {(['all','strategic','enterprise','standard','starter'] as const).map(t => (
          <button key={t} onClick={() => setTier(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${tierFilter === t ? 'bg-os-cyan text-[#0F172A]' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 text-slate-300 hover:text-white'}`}>
            {t === 'all' ? 'All Tiers' : t}
          </button>
        ))}
        {selecting && visible.length > 0 && (
          <button
            onClick={toggleAll}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 hover:text-white transition-colors ml-auto"
          >
            {visible.every(c => selectedIds.has(c.id)) ? 'Deselect All' : `Select All (${visible.length})`}
          </button>
        )}
      </div>

      {/* Client cards */}
      <StaggerList className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visible.map(client => (
          <StaggerItem key={client.id}>
          <Card
            className={`hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full border-white/10 border-t-white/20 relative ${
              selecting && selectedIds.has(client.id) ? 'ring-2 ring-[#2564ea] border-os-blue/60' : ''
            }`}
            onClick={() => openClient(client.id)}
          >
            {selecting && (
              <div className="absolute top-3 right-3 z-10" onClick={e => { e.stopPropagation(); toggleSelect(client.id) }}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(client.id)}
                  onChange={() => toggleSelect(client.id)}
                  className="w-4 h-4 rounded border-white/10 border-t-white/20 bg-slate-900 accent-[#2564ea] cursor-pointer"
                />
              </div>
            )}
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-os-blue to-os-cyan flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{client.logo}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate">{client.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{client.industry} · {client.country}</p>
                  </div>
                  <div className={`flex items-center gap-2 flex-shrink-0 ${selecting ? 'pr-6' : ''}`}>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${TIER_COLOR[client.tier]}`}>
                      {client.tier}
                    </span>
                    <InlineSelect
                      value={client.health}
                      options={HEALTH_OPTIONS}
                      onChange={v => patchClient(client.id, { health: v as ClientHealth })}
                      dot
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-1">{client.description}</p>

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-200 text-sm">{fmt(client.arr)}<span className="font-normal text-slate-500 text-xs"> ARR</span></span>
                  <span>Owner: <strong className="text-slate-300">{client.owner.split(' ')[0]}</strong></span>
                  <span>NPS <strong className={client.satisfactionScore >= 75 ? 'text-[#00c875]' : client.satisfactionScore >= 55 ? 'text-[#fdab3d]' : 'text-[#e2445c]'}>{client.satisfactionScore}</strong></span>
                  <InlineSelect
                    value={client.status}
                    options={STATUS_OPTIONS}
                    onChange={v => patchClient(client.id, { status: v as ClientStatus })}
                  />
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
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10 border-t-white/20">
                  <div className="flex -space-x-2">
                    {client.contacts.slice(0, 3).map(ct => (
                      <div key={ct.id} className="ring-2 ring-os-s1 rounded-full">
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

      <BulkActionBar
        count={selectedIds.size}
        onClear={clearSelection}
        groups={[
          {
            label: 'Set Health',
            options: [
              { value: 'excellent', label: 'Excellent' },
              { value: 'good',      label: 'Good'      },
              { value: 'at-risk',   label: 'At Risk'   },
              { value: 'critical',  label: 'Critical'  },
            ],
            onSelect: handleBulkHealth,
          },
          {
            label: 'Set Status',
            options: [
              { value: 'active',     label: 'Active'     },
              { value: 'onboarding', label: 'Onboarding' },
              { value: 'paused',     label: 'Paused'     },
              { value: 'churned',    label: 'Churned'    },
            ],
            onSelect: handleBulkStatus,
          },
          {
            label: 'Set Tier',
            options: [
              { value: 'strategic',  label: 'Strategic'  },
              { value: 'enterprise', label: 'Enterprise' },
              { value: 'standard',   label: 'Standard'   },
              { value: 'starter',    label: 'Starter'    },
            ],
            onSelect: handleBulkTier,
          },
        ]}
        actions={[
          {
            label: 'Delete',
            icon: <Trash2 className="w-3 h-3" />,
            variant: 'danger',
            onClick: handleBulkDelete,
          },
        ]}
      />
    </div>
  )
}
