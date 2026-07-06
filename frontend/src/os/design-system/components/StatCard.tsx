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

const VIBRANT_COLORS = [
  '#579bfc', // Blue
  '#00c875', // Green
  '#7c3aed', // Purple
  '#fdab3d', // Orange
  '#e2445c', // Red
  '#0ea5e9', // Light Blue
]

function getColorForLabel(label: string): string {
  let hash = 0
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash)
  }
  return VIBRANT_COLORS[Math.abs(hash) % VIBRANT_COLORS.length]
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
        'bg-[var(--os-surface-0)] p-6 animate-pulse flex flex-col justify-between h-[140px]',
        className
      )} style={{ borderRadius: 'var(--os-radius-xl)', border: '1px solid var(--os-border)' }}>
        <div className="flex justify-between items-start">
          <div className="h-4 w-28 bg-[var(--os-surface-2)] rounded" />
          <div className="h-10 w-10 bg-[var(--os-surface-2)] rounded-2xl" />
        </div>
        <div className="h-9 w-20 bg-[var(--os-surface-2)] rounded mt-3" />
        <div className="h-4 w-32 bg-[var(--os-surface-2)] rounded mt-2" />
      </div>
    )
  }

  const bgColor = getColorForLabel(label)

  return (
    <motion.div
      className={cn(
        'cursor-pointer relative overflow-hidden flex flex-col p-6 transition-all duration-300 group',
        className
      )}
      style={{
        background: bgColor,
        color: '#ffffff',
        borderRadius: 'var(--os-radius-xl)',
        boxShadow: `0 12px 32px ${bgColor}60`,
        border: 'none'
      }}
      whileHover={{ y: -6, scale: 1.02, transition: spring.smooth }}
      whileTap={{ y: 0 }}
    >
      {/* Subtle inner background shine effect */}
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: '50%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15))', pointerEvents: 'none' }} />

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1 truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{label}</p>
          <h3 className="text-3xl font-black tracking-tight leading-none mt-2" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {prefix}
            {isNum ? <motion.span>{displayed}</motion.span> : value}
            {suffix}
          </h3>
        </div>
        {icon && (
          <motion.div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-white"
            style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}
            whileHover={{ scale: 1.1, transition: spring.snappy }}
          >
            {icon}
          </motion.div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 text-sm mt-1 relative z-10">
          {isNeutral ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[10px] tracking-wide shadow-sm" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              <Minus className="w-3 h-3" /> 0%
            </span>
          ) : (
            <span className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-extrabold text-[10px] tracking-wide uppercase shadow-sm'
            )} style={{ background: '#ffffff', color: bgColor }}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {isPositive ? '+' : ''}{change}%
            </span>
          )}
          {changeLabel && (
            <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}

export { StatCard }
