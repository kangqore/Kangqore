import { useState } from 'react'
import { Search, MapPin, Mail, Users, AlertTriangle } from 'lucide-react'
import { StaggerList, StaggerItem } from '@components/animations/Stagger'
import { Card } from '@design-system/components/Card'
import { StatCard } from '@design-system/components/StatCard'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { cn } from '@design-system/cn'
import { useResourcesStore } from '../store'
import type { Department, MemberStatus } from '../types'

const DEPT_COLORS: Record<Department, string> = {
  Engineering: 'bg-blue-100 text-blue-700',
  Design:      'bg-pink-100   text-pink-700',
  Product:     'bg-blue-100   text-blue-700',
  Sales:       'bg-green-100  text-green-700',
  Operations:  'bg-amber-100  text-amber-700',
  Finance:     'bg-cyan-100   text-cyan-700',
}

const STATUS_VARIANT: Record<MemberStatus, 'success' | 'warning' | 'neutral'> = {
  active:     'success',
  'on-leave': 'warning',
  'part-time':'neutral',
}

const UTIL_COLOR = (u: number) =>
  u >= 95 ? 'danger' : u >= 80 ? 'warning' : 'success'

const DEPTS: (Department | 'all')[] = ['all', 'Engineering', 'Design', 'Product', 'Sales', 'Operations', 'Finance']

export function TeamOverview() {
  const { team, allocationsForMember } = useResourcesStore()
  const [search, setSearch]   = useState('')
  const [dept, setDept]       = useState<Department | 'all'>('all')

  const visible = team.filter(m =>
    (dept === 'all' || m.department === dept) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.role.toLowerCase().includes(search.toLowerCase()))
  )

  const avgUtil    = Math.round(team.reduce((s, m) => s + m.utilization, 0) / team.length)
  const overloaded = team.filter(m => m.utilization >= 95).length
  const totalBillable = team.reduce((s, m) => s + m.billableRate * m.availability, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Team</h2>
        <p className="text-sm text-slate-500 mt-0.5">{team.length} members · {team.filter(m => m.status === 'active').length} active</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Team Size"          value={team.length}    icon={<Users         className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" />
        <StatCard label="Avg Utilization"    value={`${avgUtil}%`}  icon={<AlertTriangle className="w-5 h-5" />} iconColor={avgUtil > 85 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'} />
        <StatCard label="Overloaded (≥95%)"  value={overloaded}     icon={<AlertTriangle className="w-5 h-5" />} iconColor={overloaded > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'} />
        <StatCard label="Weekly Capacity"    value={`£${(totalBillable / 1000).toFixed(0)}k`} icon={<Users className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" changeLabel="billable value/wk" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input placeholder="Search team…" prefix={<Search className="w-3.5 h-3.5" />} className="w-52" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex items-center gap-2 flex-wrap">
          {DEPTS.map(d => (
            <button key={d} onClick={() => setDept(d)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${dept === d ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Member cards */}
      <StaggerList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visible.map(member => {
          const allocs = allocationsForMember(member.id)
          return (
            <StaggerItem key={member.id}>
            <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <Avatar name={member.name} size="lg" status={member.status === 'active' ? 'online' : member.status === 'on-leave' ? 'away' : 'busy'} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{member.name}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{member.role}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', DEPT_COLORS[member.department])}>
                      {member.department}
                    </span>
                    <Badge variant={STATUS_VARIANT[member.status]} dot size="sm">{member.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="space-y-1.5 mb-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 flex-shrink-0" />{member.location}</div>
                <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 flex-shrink-0" />{member.email}</div>
              </div>

              {/* Utilization */}
              <Progress
                value={member.utilization}
                color={UTIL_COLOR(member.utilization)}
                size="md"
                label={`Utilization — ${member.availability}h/wk capacity`}
                showValue
              />

              {/* Project allocations */}
              {allocs.length > 0 && (
                <div className="mt-3 flex gap-1 flex-wrap">
                  {allocs.map(a => (
                    <span
                      key={a.id}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full text-white"
                      style={{ background: a.projectColor }}
                    >
                      {a.allocationPct}%
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-400 self-center ml-1">
                    {allocs.map(a => a.projectName.split(' ')[0]).join(', ')}
                  </span>
                </div>
              )}

              {/* Skills */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex gap-1.5 flex-wrap">
                {member.skills.slice(0, 4).map(s => (
                  <Badge key={s} variant="neutral" size="sm">{s}</Badge>
                ))}
                {member.skills.length > 4 && (
                  <Badge variant="neutral" size="sm">+{member.skills.length - 4}</Badge>
                )}
              </div>

              {/* Rate */}
              <div className="mt-2 text-right text-xs text-slate-400">
                £{member.billableRate}/hr · £{(member.billableRate * member.availability).toLocaleString()}/wk
              </div>
            </Card>
            </StaggerItem>
          )
        })}
      </StaggerList>
    </div>
  )
}
