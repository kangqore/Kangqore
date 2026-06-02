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
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">OKRs — {selectedQuarter}</h2>
          <p className="text-sm text-slate-500 mt-1">
            {objectives.length} objectives · avg progress {avgProgress}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          {QUARTER_OPTIONS.map(q => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                selectedQuarter === q
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Status summary chips with extra padding and gaps */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { label: 'On Track',  color: '#22c55e', status: 'on-track'  },
          { label: 'At Risk',   color: '#f59e0b', status: 'at-risk'   },
          { label: 'Behind',    color: '#ef4444', status: 'behind'    },
          { label: 'Completed', color: '#3b82f6', status: 'completed' },
        ].map(s => {
          const count = filteredObjectives().filter(o => o.status === s.status).length
          return (
            <div key={s.status} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/80 rounded-2xl text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
              <span className="font-semibold text-slate-700">{s.label}</span>
              <span className="font-bold text-slate-900 ml-1">{count}</span>
            </div>
          )
        })}
      </div>

      {/* Filters with spacious layout */}
      <div className="flex items-center gap-4 flex-wrap pt-2">
        <Input
          placeholder="Search objectives…"
          prefix={<Search className="w-3.5 h-3.5" />}
          className="w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                statusFilter === f.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={pillarFilter}
          onChange={e => setPillarFilter(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pl-4 pr-10 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 shadow-sm"
        >
          <option value="all">All Pillars</option>
          {pillars.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* OKR list with spacious card gaps */}
      {objectives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-slate-400 text-sm">No objectives match your filters.</p>
        </div>
      ) : (
        <div className="space-y-6 relative">
          {objectives.map(o => <OKRCard key={o.id} objective={o} />)}
        </div>
      )}
    </div>
  )
}
