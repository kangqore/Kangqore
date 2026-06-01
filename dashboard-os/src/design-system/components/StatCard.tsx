import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { cn } from '../cn'

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

function StatCard({
  label, value, change, changeLabel, icon,
  iconColor = 'bg-blue-50 text-blue-600',
  prefix, suffix, loading, className
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNeutral  = change !== undefined && change === 0

  if (loading) {
    return (
      <div className={cn(
        'bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse flex flex-col justify-between h-[140px]',
        className
      )}>
        <div className="flex justify-between items-start">
          <div className="h-4 w-28 bg-gray-100 rounded" />
          <div className="h-12 w-12 bg-gray-100 rounded-xl" />
        </div>
        <div className="h-9 w-20 bg-gray-100 rounded mt-3" />
        <div className="h-4 w-32 bg-gray-100 rounded mt-2" />
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group',
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-500 tracking-wider uppercase truncate">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2 tracking-tight leading-none">
            {prefix}<span>{value}</span>{suffix}
          </h3>
        </div>
        {icon && (
          <div className={cn(
            'p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200',
            iconColor
          )}>
            {icon}
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 text-sm mt-1">
          {isNeutral ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium text-xs">
              <Minus className="w-3 h-3" /> 0%
            </span>
          ) : (
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-xs',
              isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            )}>
              {isPositive
                ? <ArrowUpRight className="w-3 h-3" />
                : <ArrowDownRight className="w-3 h-3" />
              }
              {isPositive ? '+' : ''}{change}%
            </span>
          )}
          {changeLabel && (
            <span className="text-gray-400 text-xs">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}

export { StatCard }
