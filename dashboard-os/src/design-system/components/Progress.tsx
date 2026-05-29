import * as RadixProgress from '@radix-ui/react-progress'
import { cn } from '../cn'

const colorMap = {
  brand:   'bg-purple-600',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

interface ProgressProps {
  value: number
  max?: number
  color?: keyof typeof colorMap
  size?: keyof typeof sizeMap
  label?: string
  showValue?: boolean
  animated?: boolean
  className?: string
}

function Progress({ value, max = 100, color = 'brand', size = 'md', label, showValue, animated, className }: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-slate-700">{Math.round(pct)}%</span>}
        </div>
      )}
      <RadixProgress.Root
        value={pct}
        className={cn('overflow-hidden rounded-full bg-slate-100 w-full', sizeMap[size])}
      >
        <RadixProgress.Indicator
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorMap[color],
            animated && 'animate-pulse'
          )}
          style={{ width: `${pct}%` }}
        />
      </RadixProgress.Root>
    </div>
  )
}

function MultiProgress({ segments, size = 'md', className }: {
  segments: { value: number; color: keyof typeof colorMap; label?: string }[]
  size?: keyof typeof sizeMap
  className?: string
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)

  return (
    <div className={cn('flex overflow-hidden rounded-full bg-slate-100 w-full', sizeMap[size], className)}>
      {segments.map((seg, i) => (
        <div
          key={i}
          className={cn('h-full transition-all duration-500', colorMap[seg.color])}
          style={{ width: `${(seg.value / total) * 100}%` }}
          title={seg.label}
        />
      ))}
    </div>
  )
}

export { Progress, MultiProgress }
