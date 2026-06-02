import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { StaggerList, StaggerItem } from '@components/animations/Stagger'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { HealthBadge } from '../components/HealthBadge'
import { useStrategyStore } from '../store'
import type { HealthStatus } from '../types'

const HEALTH_FILTERS: { label: string; value: HealthStatus | 'all' }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'On Track',  value: 'on-track'  },
  { label: 'At Risk',   value: 'at-risk'   },
  { label: 'Behind',    value: 'behind'    },
]

export function PillarsPage() {
  const { pillars, filteredPrograms } = useStrategyStore()
  const [search, setSearch] = useState('')
  const [healthFilter, setHealthFilter] = useState<HealthStatus | 'all'>('all')

  const visible = pillars.filter(p =>
    (healthFilter === 'all' || p.health === healthFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-12 pb-16">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Strategic Pillars</h2>
          <p className="text-sm text-slate-500 mt-1">{pillars.length} pillars · foundation of company strategy</p>
        </div>
      </div>

      {/* Filters with spacious margins */}
      <div className="flex items-center gap-4 flex-wrap">
        <Input
          placeholder="Search pillars…"
          prefix={<Search className="w-3.5 h-3.5" />}
          className="w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {HEALTH_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setHealthFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                healthFilter === f.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pillar detail cards with spacious list gaps */}
      <StaggerList className="space-y-8">
        {visible.map(pillar => {
          const programs = filteredPrograms(pillar.id)
          const spentPct = Math.round((pillar.spent / pillar.budget) * 100)

          return (
            <StaggerItem key={pillar.id}>
            <Card padding="lg" health={pillar.health as 'on-track' | 'at-risk' | 'behind' | 'completed'} className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-1.5 rounded-full mb-6 w-20" style={{ background: pillar.color }} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left — pillar info */}
                <div className="lg:col-span-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-lg text-slate-900 tracking-tight">{pillar.name}</h3>
                      <HealthBadge status={pillar.health} />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6 font-normal">{pillar.description}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-50/50">
                    <Avatar name={pillar.owner} size="sm" className="ring-2 ring-slate-50" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">{pillar.owner}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Pillar owner</p>
                    </div>
                  </div>
                </div>

                {/* Middle — budget */}
                <div className="lg:col-span-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Budget Overview</p>
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-2xl font-black text-slate-900">£{(pillar.spent / 1000).toFixed(0)}k</span>
                      <span className="text-xs text-slate-400 font-medium pb-0.5">of £{(pillar.budget / 1000).toFixed(0)}k spent</span>
                    </div>
                    <Progress
                      value={spentPct}
                      color={spentPct > 85 ? 'danger' : spentPct > 70 ? 'warning' : 'success'}
                      showValue
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50 flex flex-col justify-center">
                      <p className="text-2xl font-black text-slate-900">{pillar.programCount}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Programs</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50 flex flex-col justify-center">
                      <p className="text-2xl font-black text-slate-900">{pillar.okrCount}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">OKRs</p>
                    </div>
                  </div>
                </div>

                {/* Right — programs */}
                <div className="lg:col-span-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Active Programs</p>
                    <div className="space-y-4">
                      {programs.slice(0, 4).map(prog => (
                        <div key={prog.id} className="flex items-center gap-3">
                          <Badge
                            variant={
                              prog.status === 'active' ? 'success' :
                              prog.status === 'completed' ? 'info' :
                              prog.status === 'on-hold' ? 'neutral' : 'brand'
                            }
                            size="sm"
                            className="flex-shrink-0 w-20 justify-center font-bold capitalize"
                          >
                            {prog.status}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{prog.name}</p>
                            <div className="mt-1">
                              <Progress value={prog.progress} size="sm" color="brand" />
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 w-8 text-right">{prog.progress}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            </StaggerItem>
          )
        })}
      </StaggerList>
    </div>
  )
}
