import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@design-system/components/Input'
import { OKRCard } from '../components/OKRCard'
import { useStrategyStore } from '../store'
import type { HealthStatus } from '../types'

const QUARTER_OPTIONS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'] as const

const STATUS_FILTERS: { label: string; value: HealthStatus | 'all' }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'On Track',  value: 'on-track'  },
  { label: 'At Risk',   value: 'at-risk'   },
  { label: 'Behind',    value: 'behind'    },
  { label: 'Completed', value: 'completed' },
]

export function OKRsPage() {
  const { filteredObjectives, selectedQuarter, setSelectedQuarter, pillars } = useStrategyStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<HealthStatus | 'all'>('all')
  const [pillarFilter, setPillarFilter] = useState<string>('all')

  const objectives = filteredObjectives().filter(o =>
    (statusFilter === 'all' || o.status === statusFilter) &&
    (pillarFilter === 'all' || o.pillarId === pillarFilter) &&
    (o.title.toLowerCase().includes(search.toLowerCase()) ||
     o.description.toLowerCase().includes(search.toLowerCase()))
  )

  const avgProgress = Math.round(objectives.reduce((s, o) => s + o.progress, 0) / (objectives.length || 1))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">OKRs — {selectedQuarter}</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {objectives.length} objectives · avg progress {avgProgress}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          {QUARTER_OPTIONS.map(q => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedQuarter === q
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-purple-300'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Status summary chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { label: 'On Track',  color: '#22c55e', status: 'on-track'  },
          { label: 'At Risk',   color: '#f59e0b', status: 'at-risk'   },
          { label: 'Behind',    color: '#ef4444', status: 'behind'    },
          { label: 'Completed', color: '#3b82f6', status: 'completed' },
        ].map(s => {
          const count = filteredObjectives().filter(o => o.status === s.status).length
          return (
            <div key={s.status} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="font-medium text-slate-700">{s.label}</span>
              <span className="font-bold text-slate-900">{count}</span>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search objectives…"
          prefix={<Search className="w-3.5 h-3.5" />}
          className="w-56"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === f.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-purple-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={pillarFilter}
          onChange={e => setPillarFilter(e.target.value)}
          className="h-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pl-3 pr-8 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        >
          <option value="all">All Pillars</option>
          {pillars.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* OKR list */}
      {objectives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-slate-400 text-sm">No objectives match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3 relative">
          {objectives.map(o => <OKRCard key={o.id} objective={o} />)}
        </div>
      )}
    </div>
  )
}
