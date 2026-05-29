import { useNavigate } from 'react-router-dom'
import { Users, LayoutDashboard, Target, ArrowRight } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Progress } from '@design-system/components/Progress'
import { Avatar } from '@design-system/components/Avatar'
import { cn } from '@design-system/cn'
import { HealthBadge } from './HealthBadge'
import type { Pillar } from '../types'

export function PillarCard({ pillar }: { pillar: Pillar }) {
  const navigate = useNavigate()
  const spentPct = Math.round((pillar.spent / pillar.budget) * 100)

  return (
    <Card
      className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
      onClick={() => navigate(`/os/strategy/pillars/${pillar.id}`)}
    >
      {/* Colour bar */}
      <div className="h-1 rounded-full mb-4" style={{ background: pillar.color }} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm truncate">{pillar.name}</h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{pillar.description}</p>
        </div>
        <HealthBadge status={pillar.health} />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <LayoutDashboard className="w-3.5 h-3.5" />
          {pillar.programCount} programs
        </span>
        <span className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" />
          {pillar.okrCount} OKRs
        </span>
      </div>

      {/* Budget */}
      <Progress
        value={spentPct}
        size="sm"
        color={spentPct > 85 ? 'danger' : spentPct > 70 ? 'warning' : 'success'}
        label={`Budget — £${(pillar.spent / 1000).toFixed(0)}k / £${(pillar.budget / 1000).toFixed(0)}k`}
        showValue
      />

      {/* Footer */}
      <div className={cn('flex items-center justify-between mt-4 pt-3 border-t border-slate-100')}>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Users className="w-3.5 h-3.5" />
          <Avatar name={pillar.owner} size="xs" />
          <span>{pillar.owner}</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Card>
  )
}
