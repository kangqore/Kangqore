import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { cn } from '../cn'
import { spring } from '@os/motion'

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

const ICON_PRESETS: Record<string, string> = {
  red:     'bg-[#ef4444] text-white shadow-[0_2px_8px_rgba(239,68,68,0.25)]',
  danger:  'bg-[#ef4444] text-white shadow-[0_2px_8px_rgba(239,68,68,0.25)]',
  green:   'bg-[#059669] text-white shadow-[0_2px_8px_rgba(5,150,105,0.25)]',
  success: 'bg-[#059669] text-white shadow-[0_2px_8px_rgba(5,150,105,0.25)]',
  blue:    'bg-[#2564ea] text-white shadow-[0_2px_8px_rgba(37,100,234,0.25)]',
  info:    'bg-[#2564ea] text-white shadow-[0_2px_8px_rgba(37,100,234,0.25)]',
  brand:   'bg-[#2564ea] text-white shadow-[0_2px_8px_rgba(37,100,234,0.25)]',
  orange:  'bg-[#d97706] text-white shadow-[0_2px_8px_rgba(217,119,6,0.25)]',
  warning: 'bg-[#d97706] text-white shadow-[0_2px_8px_rgba(217,119,6,0.25)]',
  purple:  'bg-[#7c3aed] text-white shadow-[0_2px_8px_rgba(124,58,237,0.25)]',
}

function resolveIconClass(color: string): string {
  const c = color.toLowerCase()
  for (const [key, cls] of Object.entries(ICON_PRESETS)) {
    if (c.includes(key)) return cls
  }
  return color
}

function StatCard({
  label, value, change, changeLabel, icon,
  iconColor = 'brand',
  prefix, suffix, loading, className,
}: StatCardProps) {
  const isNum = typeof value === 'number'
  const countMv = useMotionValue(0)
  const displayed = useTransform(countMv, (v) => Math.round(v).toLocaleString())
  const isPositive = change !== undefined && change > 0
  const isNeutral  = change !== undefined && change === 0

  useEffect(() => {
    if (!isNum) return
    const controls = animate(countMv, value as number, {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    })
    return controls.stop
  }, [value])

  if (loading) {
    return (
      <div className={cn(
        'bg-[#151C2F] rounded-xl p-6 shadow-sm border border-[#2E2854] animate-pulse flex flex-col justify-between h-[140px]',
        className
      )}>
        <div className="flex justify-between items-start">
          <div className="h-4 w-28 bg-[#20273a] rounded" />
          <div className="h-12 w-12 bg-[#20273a] rounded-xl" />
        </div>
        <div className="h-9 w-20 bg-[#20273a] rounded mt-3" />
        <div className="h-4 w-32 bg-[#20273a] rounded mt-2" />
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        'bg-[#151C2F] rounded-xl p-6 shadow-sm border border-[#2E2854] group',
        className
      )}
      whileHover={{ y: -3, transition: spring.smooth }}
      whileTap={{ y: 0 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase truncate">{label}</p>
          <h3 className="text-3xl font-bold text-white mt-2 tracking-tight leading-none">
            {prefix}
            {isNum ? <motion.span>{displayed}</motion.span> : value}
            {suffix}
          </h3>
        </div>
        {icon && (
          <motion.div
            className={cn('p-3 rounded-xl flex-shrink-0', resolveIconClass(iconColor))}
            whileHover={{ scale: 1.1, transition: spring.snappy }}
          >
            {icon}
          </motion.div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 text-sm mt-1">
          {isNeutral ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0F172A] text-slate-500 border border-[#2E2854] font-medium text-xs">
              <Minus className="w-3 h-3" /> 0%
            </span>
          ) : (
            <span className={cn(
              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] tracking-wide uppercase shadow-sm',
              isPositive
                ? 'bg-[#059669] text-white shadow-[0_2px_6px_rgba(5,150,105,0.2)]'
                : 'bg-[#ef4444] text-white shadow-[0_2px_6px_rgba(239,68,68,0.2)]'
            )}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {isPositive ? '+' : ''}{change}%
            </span>
          )}
          {changeLabel && (
            <span className="text-slate-500 text-xs">{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}

export { StatCard }
