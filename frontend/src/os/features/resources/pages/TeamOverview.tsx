import { useState } from 'react'
import { Search, MapPin, Mail, Users, AlertTriangle } from 'lucide-react'
import { StaggerList, StaggerItem } from '@components/animations/Stagger'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { cn } from '@design-system/cn'
import { useResourcesStore } from '../store'
import type { Department, MemberStatus } from '../types'

const DEPT_COLORS: Record<Department, { bg: string; color: string }> = {
  Engineering: { bg: '#579bfc20', color: '#579bfc' },
  Design:      { bg: '#7c3aed20', color: '#7c3aed' },
  Product:     { bg: '#579bfc20', color: '#579bfc' },
  Sales:       { bg: '#00c87520', color: '#00c875' },
  Operations:  { bg: '#fdab3d20', color: '#fdab3d' },
  Finance:     { bg: '#579bfc20', color: '#579bfc' },
}

const STATUS_VARIANT: Record<MemberStatus, 'success' | 'warning' | 'neutral'> = {
  active:     'success',
  'on-leave': 'warning',
  'part-time':'neutral',
}

function utilColor(u: number) {
  if (u > 100) return '#e2445c'
  if (u > 90) return '#fdab3d'
  if (u >= 70) return '#00c875'
  return '#579bfc'
}

const DEPTS: (Department | 'all')[] = ['all', 'Engineering', 'Design', 'Product', 'Sales', 'Operations', 'Finance']

export function TeamOverview() {
  const { team, allocationsForMember } = useResourcesStore()
  const [search, setSearch] = useState('')
  const [dept, setDept]     = useState<Department | 'all'>('all')

  const visible = team.filter(m =>
    (dept === 'all' || m.department === dept) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.role.toLowerCase().includes(search.toLowerCase()))
  )

  const avgUtil       = team.length > 0 ? Math.round(team.reduce((s, m) => s + m.utilization, 0) / team.length) : 0
  const overloaded    = team.filter(m => m.utilization >= 95).length
  const totalBillable = team.reduce((s, m) => s + m.billableRate * m.availability, 0)
  const activeCount   = team.filter(m => m.status === 'active').length

  const statCards = [
    { label: 'Total Team',     value: team.length,                                                   accent: '#579bfc' },
    { label: 'Active',         value: activeCount,                                                    accent: '#00c875' },
    { label: 'Avg Utilization',value: `${avgUtil}%`,                                                  accent: avgUtil > 85 ? '#fdab3d' : '#00c875' },
    { label: 'Over-allocated', value: overloaded,                                                     accent: overloaded > 0 ? '#e2445c' : '#00c875' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Team</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
          {team.length} members · {activeCount} active
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Team',     value: team.length,   bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
          { label: 'Active',         value: activeCount,   bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'Avg Utilization',value: `${avgUtil}%`, bg: avgUtil > 85 ? 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)' : 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: avgUtil > 85 ? '#fdab3d' : '#7c3aed' },
          { label: 'Over-allocated', value: overloaded,    bg: overloaded > 0 ? 'linear-gradient(135deg,#e2445c 0%,#c0392b 100%)' : 'linear-gradient(135deg,#64748b 0%,#475569 100%)', glow: overloaded > 0 ? '#e2445c' : '#64748b' },
        ].map(c => (
          <div key={c.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: c.bg, boxShadow: `0 4px 20px ${c.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{c.label}</p>
            <p className="relative text-3xl font-black tracking-tight" style={{ color: '#ffffff' }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search team…"
          prefix={<Search className="w-3.5 h-3.5" />}
          className="w-52"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-1.5 flex-wrap">
          {DEPTS.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className="px-3 py-1.5 text-xs font-bold rounded-full transition-all capitalize"
              style={dept === d
                ? { background: '#579bfc', color: '#fff' }
                : { background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }
              }
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Member grid */}
      <StaggerList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visible.map(member => {
          const allocs = allocationsForMember(member.id)
          const uc = utilColor(member.utilization)
          const dc = DEPT_COLORS[member.department]
          const initials = member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

          return (
            <StaggerItem key={member.id}>
              <div
                className="os-card p-5 h-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                style={{ boxShadow: 'var(--os-shadow-card)' }}
              >
                {/* Header row */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Avatar initials circle */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ background: uc + '25', color: uc }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate" style={{ color: 'var(--os-text-1)' }}>{member.name}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--os-text-2)' }}>{member.role}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: dc.bg, color: dc.color }}
                      >
                        {member.department}
                      </span>
                      <Badge variant={STATUS_VARIANT[member.status]} dot size="sm">{member.status}</Badge>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="space-y-1.5 mb-4 text-xs" style={{ color: 'var(--os-text-2)' }}>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{member.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />{member.email}
                  </div>
                </div>

                {/* Utilization bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--os-text-2)' }}>
                      Utilization · {member.availability}h/wk
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: uc + '20', color: uc }}>
                      {member.utilization}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--os-surface-0)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(100, member.utilization)}%`, background: uc }}
                    />
                  </div>
                </div>

                {/* Project allocations */}
                {allocs.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-3">
                    {allocs.map(a => (
                      <span
                        key={a.id}
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: a.projectColor + '25', color: a.projectColor }}
                      >
                        {a.allocationPct}%
                      </span>
                    ))}
                    <span className="text-[11px] self-center ml-1" style={{ color: 'var(--os-text-2)' }}>
                      {allocs.map(a => a.projectName.split(' ')[0]).join(', ')}
                    </span>
                  </div>
                )}

                {/* Skills */}
                <div className="pt-3 flex gap-1.5 flex-wrap" style={{ borderTop: '1px solid var(--os-border)' }}>
                  {member.skills.slice(0, 4).map((s: string) => (
                    <span
                      key={s}
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)' }}
                    >
                      {s}
                    </span>
                  ))}
                  {member.skills.length > 4 && (
                    <span
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)' }}
                    >
                      +{member.skills.length - 4}
                    </span>
                  )}
                </div>

                {/* Rate */}
                <div className="mt-2 text-right text-xs" style={{ color: 'var(--os-text-2)' }}>
                  ₹{member.billableRate}/hr · <strong style={{ color: 'var(--os-text-1)' }}>₹{(member.billableRate * member.availability).toLocaleString()}/wk</strong>
                </div>
              </div>
            </StaggerItem>
          )
        })}
      </StaggerList>
    </div>
  )
}
