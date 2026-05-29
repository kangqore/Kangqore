import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../cn'
import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  iconColor?: string
  prefix?: string
  suffix?: string
  loading?: boolean
  className?: string
}

function StatCard({ label, value, change, changeLabel, icon, iconColor = 'bg-purple-100 text-purple-600', prefix, suffix, loading, className }: StatCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const isNeutral  = change !== undefined && change === 0

  return (
    <Card className={cn('', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500 font-medium truncate">{label}</p>
          {loading ? (
            <div className="mt-2 h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
          ) : (
            <p className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
              {prefix}<span>{value}</span>{suffix}
            </p>
          )}
          {change !== undefined && !loading && (
            <div className={cn(
              'mt-2 inline-flex items-center gap-1 text-xs font-medium',
              isPositive && 'text-green-600',
              isNegative && 'text-red-600',
              isNeutral  && 'text-slate-400',
            )}>
              {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
              {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
              {isNeutral  && <Minus className="w-3.5 h-3.5" />}
              <span>{isPositive ? '+' : ''}{change}%</span>
              {changeLabel && <span className="text-slate-400 font-normal">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('p-2.5 rounded-xl flex-shrink-0', iconColor)}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

export { StatCard }
