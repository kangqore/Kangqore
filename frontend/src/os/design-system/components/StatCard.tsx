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

const resolvePremiumIconColor = (color: string) => {
  const c = color.toLowerCase();
  if (c.includes('red') || c.includes('danger') || c.includes('e2445c')) {
    return 'bg-[#e2445c] text-white shadow-[0_2px_8px_rgba(226,68,92,0.25)]';
  }
  if (c.includes('green') || c.includes('success') || c.includes('00c875')) {
    return 'bg-[#00c875] text-white shadow-[0_2px_8px_rgba(0,200,117,0.25)]';
  }
  if (c.includes('blue') || c.includes('info') || c.includes('brand') || c.includes('0073ea') || c.includes('2564ea')) {
    return 'bg-[#0073ea] text-white shadow-[0_2px_8px_rgba(0,115,234,0.25)]';
  }
  if (c.includes('orange') || c.includes('amber') || c.includes('yellow') || c.includes('warning') || c.includes('fdab3d')) {
    return 'bg-[#fdab3d] text-white shadow-[0_2px_8px_rgba(253,171,61,0.25)]';
  }
  if (c.includes('purple') || c.includes('violet') || c.includes('indigo') || c.includes('7f53f9')) {
    return 'bg-[#7f53f9] text-white shadow-[0_2px_8px_rgba(127,83,249,0.25)]';
  }
  return color;
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
            resolvePremiumIconColor(iconColor)
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
              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] tracking-wide uppercase shadow-sm',
              isPositive ? 'bg-[#00c875] text-white shadow-[0_2px_6px_rgba(0,200,117,0.2)]' : 'bg-[#e2445c] text-white shadow-[0_2px_6px_rgba(226,68,92,0.2)]'
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
