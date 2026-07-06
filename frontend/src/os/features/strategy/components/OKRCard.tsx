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
    <Card className="overflow-hidden bg-[var(--os-card)] border border-[var(--os-border)] hover:shadow-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative" padding="lg">
      {/* Pillar accent */}
      <div className="w-1.5 absolute left-0 top-0 bottom-0" style={{ background: objective.pillarColor }} />
      <div className="pl-4">
        {/* Header */}
        <div
          className="flex items-start gap-4 cursor-pointer"
          onClick={() => setExpanded(v => !v)}
        >
          <button className="mt-1 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] flex-shrink-0 transition-colors">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: objective.pillarColor + '15', color: objective.pillarColor }}
              >
                {objective.pillarName}
              </span>
              <HealthBadge status={objective.status} />
            </div>
            <p className="text-base font-bold text-[var(--os-text-1)] mt-2.5 tracking-tight">{objective.title}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-1 line-clamp-1 font-normal">{objective.description}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-2xl font-black text-[var(--os-text-1)] leading-none">{objective.progress}%</p>
            <p className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wider mt-1">progress</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-5 ml-8">
          <Progress
            value={objective.progress}
            size="sm"
            color={statusColor[objective.status] as 'success' | 'warning' | 'danger' | 'info'}
          />
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2.5 mt-4 ml-8">
          <Avatar name={objective.owner} size="xs" />
          <span className="text-xs text-[var(--os-text-2)] font-semibold">{objective.owner}</span>
        </div>

        {/* Key results (expanded) */}
        {expanded && (
          <div className="mt-6 ml-8 space-y-4 border-t border-[var(--os-border)] pt-5">
            <p className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-widest mb-1">Key Results</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {objective.keyResults.map(kr => (
                <div key={kr.id} className={cn('p-4 rounded-xl', 'bg-[var(--os-surface-0)] border border-[var(--os-border)] flex flex-col justify-between gap-3')}>
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-xs font-bold text-[var(--os-text-1)] leading-relaxed flex-1">{kr.title}</p>
                      <HealthBadge status={kr.status} />
                    </div>
                  </div>
                  <div>
                    <Progress
                      value={kr.progress}
                      size="sm"
                      color={statusColor[kr.status] as 'success' | 'warning' | 'danger' | 'info'}
                    />
                    <p className="text-[11px] font-semibold text-[var(--os-text-2)] mt-2">
                      {kr.unit === '$' || kr.unit === '₹'
                        ? `${kr.unit}${kr.current.toLocaleString()} / ${kr.unit}${kr.target.toLocaleString()}`
                        : `${kr.current} / ${kr.target} ${kr.unit}`
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
