import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
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
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Strategic Pillars</h2>
          <p className="text-sm text-slate-500 mt-0.5">{pillars.length} pillars · foundation of company strategy</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search pillars…"
          prefix={<Search className="w-3.5 h-3.5" />}
          className="w-56"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {HEALTH_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setHealthFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                healthFilter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pillar detail cards */}
      <div className="space-y-4">
        {visible.map(pillar => {
          const programs = filteredPrograms(pillar.id)
          const spentPct = Math.round((pillar.spent / pillar.budget) * 100)

          return (
            <Card key={pillar.id} className="overflow-hidden">
              <div className="h-1 rounded-full mb-5" style={{ background: pillar.color }} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left — pillar info */}
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-900">{pillar.name}</h3>
                    <HealthBadge status={pillar.health} />
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{pillar.description}</p>
                  <div className="flex items-center gap-2">
                    <Avatar name={pillar.owner} size="sm" />
                    <div>
                      <p className="text-xs font-medium text-slate-700">{pillar.owner}</p>
                      <p className="text-[11px] text-slate-400">Pillar owner</p>
                    </div>
                  </div>
                </div>

                {/* Middle — budget */}
                <div className="lg:col-span-1 flex flex-col gap-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget</p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-slate-900">£{(pillar.spent / 1000).toFixed(0)}k</span>
                    <span className="text-sm text-slate-400">of £{(pillar.budget / 1000).toFixed(0)}k</span>
                  </div>
                  <Progress
                    value={spentPct}
                    color={spentPct > 85 ? 'danger' : spentPct > 70 ? 'warning' : 'success'}
                    showValue
                  />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-lg font-bold text-slate-900">{pillar.programCount}</p>
                      <p className="text-xs text-slate-400">Programs</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-lg font-bold text-slate-900">{pillar.okrCount}</p>
                      <p className="text-xs text-slate-400">OKRs</p>
                    </div>
                  </div>
                </div>

                {/* Right — programs */}
                <div className="lg:col-span-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Programs</p>
                  <div className="space-y-2">
                    {programs.slice(0, 4).map(prog => (
                      <div key={prog.id} className="flex items-center gap-2.5">
                        <Badge
                          variant={
                            prog.status === 'active' ? 'success' :
                            prog.status === 'completed' ? 'info' :
                            prog.status === 'on-hold' ? 'neutral' : 'brand'
                          }
                          size="sm"
                          className="flex-shrink-0 w-16 justify-center"
                        >
                          {prog.status}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">{prog.name}</p>
                          <Progress value={prog.progress} size="sm" color="brand" />
                        </div>
                        <span className="text-xs text-slate-400 w-8 text-right">{prog.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
