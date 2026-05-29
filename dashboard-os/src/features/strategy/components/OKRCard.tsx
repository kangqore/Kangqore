import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Card } from '@design-system/components/Card'
import { Progress } from '@design-system/components/Progress'
import { Avatar } from '@design-system/components/Avatar'
import { cn } from '@design-system/cn'
import { HealthBadge } from './HealthBadge'
import type { Objective } from '../types'

const statusColor: Record<string, string> = {
  'on-track': 'success',
  'at-risk':  'warning',
  'behind':   'danger',
  'completed':'info',
}

export function OKRCard({ objective }: { objective: Objective }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="overflow-hidden">
      {/* Pillar accent */}
      <div className="w-1 absolute left-0 top-0 bottom-0 rounded-l-2xl" style={{ background: objective.pillarColor }} />
      <div className="pl-3">
        {/* Header */}
        <div
          className="flex items-start gap-3 cursor-pointer"
          onClick={() => setExpanded(v => !v)}
        >
          <button className="mt-0.5 text-slate-400 hover:text-slate-600 flex-shrink-0">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: objective.pillarColor + '20', color: objective.pillarColor }}
              >
                {objective.pillarName}
              </span>
              <HealthBadge status={objective.status} />
            </div>
            <p className="text-sm font-semibold text-slate-900 mt-1.5">{objective.title}</p>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{objective.description}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xl font-bold text-slate-900">{objective.progress}%</p>
            <p className="text-[10px] text-slate-400">progress</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-3 ml-7">
          <Progress
            value={objective.progress}
            size="md"
            color={statusColor[objective.status] as 'success' | 'warning' | 'danger' | 'info'}
          />
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2 mt-3 ml-7">
          <Avatar name={objective.owner} size="xs" />
          <span className="text-xs text-slate-500">{objective.owner}</span>
        </div>

        {/* Key results (expanded) */}
        {expanded && (
          <div className="mt-4 ml-7 space-y-3 border-t border-slate-100 pt-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Key Results</p>
            {objective.keyResults.map(kr => (
              <div key={kr.id} className={cn('p-3 rounded-xl', 'bg-slate-50 border border-slate-100')}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs font-medium text-slate-700 flex-1">{kr.title}</p>
                  <HealthBadge status={kr.status} />
                </div>
                <Progress
                  value={kr.progress}
                  size="sm"
                  color={statusColor[kr.status] as 'success' | 'warning' | 'danger' | 'info'}
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  {kr.unit === '$' || kr.unit === '£'
                    ? `${kr.unit}${kr.current.toLocaleString()} / ${kr.unit}${kr.target.toLocaleString()}`
                    : `${kr.current} / ${kr.target} ${kr.unit}`
                  }
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
