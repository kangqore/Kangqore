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
  strategic:  'text-white',
  enterprise: 'text-white',
  standard:   'text-white',
  starter:    'text-white',
}
const TIER_BG: Record<RelationshipTier, string> = {
  strategic:  '#579bfc',
  enterprise: '#7c3aed',
  standard:   '#323338',
  starter:    '#323338',
}
const HEALTH_COLOR: Record<string, string> = {
  excellent: '#00c875',
  good: '#00c875',
  'at-risk': '#fdab3d',
  critical: '#e2445c',
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
          <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Clients</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--os-text-2)' }}>{clients.length} clients · {activeCount} active</p>
        </div>
        <button
          onClick={() => { setSelecting(s => !s); if (selecting) setSelectedIds(new Set()) }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          style={{ background: selecting ? '#579bfc22' : 'var(--os-surface-0)', color: selecting ? '#579bfc' : 'var(--os-text-2)', border: `1px solid ${selecting ? '#579bfc44' : 'var(--os-border)'}` }}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          {selecting ? 'Cancel Select' : 'Select'}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total ARR',       value: fmt(totalARR),  sub: '+14% YoY',     bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
          { label: 'Active Clients',  value: activeCount,    sub: 'engaged',      bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'At Risk',         value: atRisk,         sub: 'need attention', bg: atRisk > 0 ? 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)' : 'linear-gradient(135deg,#64748b 0%,#475569 100%)', glow: atRisk > 0 ? '#fdab3d' : '#64748b' },
          { label: 'Avg Satisfaction',value: `${avgNPS}/100`,sub: 'NPS score',    bg: 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)', glow: '#fdab3d' },
        ].map(t => (
          <div key={t.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: t.bg, boxShadow: `0 4px 20px ${t.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{t.label}</p>
            <p className="relative text-3xl font-black tracking-tight" style={{ color: '#ffffff' }}>{t.value}</p>
            <p className="relative text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.72)' }}>{t.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Input placeholder="Search clients…" prefix={<Search className="w-3.5 h-3.5"/>} className="w-56" value={search} onChange={e => setSearch(e.target.value)} />
        {(['all','strategic','enterprise','standard','starter'] as const).map(t => (
          <button key={t} onClick={() => setTier(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
            style={{
              background: tierFilter === t ? '#579bfc' : 'var(--os-surface-0)',
              color: tierFilter === t ? 'white' : 'var(--os-text-2)',
              border: `1px solid ${tierFilter === t ? '#579bfc' : 'var(--os-border)'}`,
            }}>
            {t === 'all' ? 'All Tiers' : t}
          </button>
        ))}
        {selecting && visible.length > 0 && (
          <button
            onClick={toggleAll}
            className="px-3 py-1.5 rounded-lg text-xs font-bold ml-auto transition-colors"
            style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }}
          >
            {visible.every(c => selectedIds.has(c.id)) ? 'Deselect All' : `Select All (${visible.length})`}
          </button>
        )}
      </div>

      {/* Client cards */}
      <StaggerList className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visible.map(client => {
          const healthColor = HEALTH_COLOR[client.health] ?? 'var(--os-text-2)'
          return (
          <StaggerItem key={client.id}>
          <Card
            className={`hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full relative overflow-hidden ${
              selecting && selectedIds.has(client.id) ? 'ring-2 ring-[#579bfc]' : ''
            }`}
            onClick={() => openClient(client.id)}
          >
            {/* Health indicator bar at top */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: healthColor }} />

            {selecting && (
              <div className="absolute top-4 right-4 z-10" onClick={e => { e.stopPropagation(); toggleSelect(client.id) }}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(client.id)}
                  onChange={() => toggleSelect(client.id)}
                  className="w-4 h-4 rounded accent-[#579bfc] cursor-pointer"
                />
              </div>
            )}
            <div className="flex items-start gap-4 mt-1">
              {/* Logo with health border */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-sm shadow-lg"
                style={{ background: TIER_BG[client.tier], boxShadow: `0 4px 12px ${TIER_BG[client.tier]}44` }}>
                {client.logo}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-white truncate">{client.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-2)' }}>{client.industry} · {client.country}</p>
                  </div>
                  <div className={`flex items-center gap-2 flex-shrink-0 ${selecting ? 'pr-6' : ''}`}>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize text-white"
                      style={{ background: TIER_BG[client.tier] }}>
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

                <p className="text-xs mt-2 line-clamp-1" style={{ color: 'var(--os-text-2)' }}>{client.description}</p>

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--os-text-2)' }}>
                  <span className="font-black text-white text-sm">{fmt(client.arr)}<span className="font-normal text-xs ml-1" style={{ color: 'var(--os-text-2)' }}>ARR</span></span>
                  <span>Owner: <strong className="text-white">{client.owner.split(' ')[0]}</strong></span>
                  <span>NPS <strong style={{ color: client.satisfactionScore >= 75 ? '#00c875' : client.satisfactionScore >= 55 ? '#fdab3d' : '#e2445c' }}>{client.satisfactionScore}</strong></span>
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
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--os-border)]">
                  <div className="flex -space-x-2">
                    {client.contacts.slice(0, 3).map(ct => (
                      <div key={ct.id} className="ring-2 ring-os-s1 rounded-full">
                        <Avatar name={ct.name} size="xs" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: 'var(--os-text-2)' }}>{client.contacts[0]?.name} {client.contacts.length > 1 && `+${client.contacts.length - 1}`}</span>
                </div>
              </div>
            </div>
          </Card>
          </StaggerItem>
          )
        })}
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
