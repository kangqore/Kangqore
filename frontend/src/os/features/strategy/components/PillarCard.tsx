import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Target, ArrowRight } from 'lucide-react'
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
      padding="lg"
      className="group cursor-pointer hover:border-[#2E2854]/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full bg-[#151C2F] border border-[#2E2854]"
      onClick={() => navigate(`/kangqore-view/admin/strategy/pillars/${pillar.id}`)}
    >
      <div>
        {/* Muted color bar indicator */}
        <div 
          className="h-1.5 w-14 rounded-full mb-5" 
          style={{ background: pillar.color }} 
        />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-base tracking-tight truncate">{pillar.name}</h3>
            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-normal">{pillar.description}</p>
          </div>
          <HealthBadge status={pillar.health} />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-5 mb-5 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            {pillar.programCount} programs
          </span>
          <span className="flex items-center gap-2">
            <Target className="w-4 h-4 text-slate-500" />
            {pillar.okrCount} OKRs
          </span>
        </div>
      </div>

      <div>
        {/* Budget */}
        <Progress
          value={spentPct}
          size="sm"
          color={spentPct > 85 ? 'danger' : spentPct > 70 ? 'warning' : 'success'}
          label={`Budget — ₹${(pillar.spent / 1000).toFixed(0)}k / ₹${(pillar.budget / 1000).toFixed(0)}k`}
          showValue
        />

        {/* Footer */}
        <div className={cn('flex items-center justify-between mt-5 pt-4 border-t border-[#2E2854]/80')}>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Avatar name={pillar.owner} size="xs" className="ring-2 ring-slate-50" />
            <span className="font-semibold text-slate-300">{pillar.owner}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-350 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </Card>
  )
}
