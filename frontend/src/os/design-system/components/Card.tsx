import { motion } from 'framer-motion'
import { cn } from '../cn'
import { spring } from '@os/motion'

type Health = 'on-track' | 'at-risk' | 'behind' | 'completed'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  health?: Health
  interactive?: boolean
}

const paddingMap = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
}

const variantMap = {
  default:  'bg-[#151C2F] border border-[#2E2854] shadow-sm',
  flat:     'bg-[#151C2F] border border-[#2E2854]',
  elevated: 'bg-[#151C2F] border border-[#2E2854] shadow-os-md',
  glass:    'os-glass-card shadow-os-md',
}

const healthMap: Record<Health, string> = {
  'on-track':  'border-l-4 border-l-[#00c875]  bg-[#151C2F]',
  'at-risk':   'border-l-4 border-l-[#fdab3d]  bg-[#151C2F]',
  'behind':    'border-l-4 border-l-[#e2445c]  bg-[#151C2F]',
  'completed': 'border-l-4 border-l-[#64748b]  bg-[#151C2F]',
}

function Card({ className, variant = 'default', padding = 'md', health, interactive, children, ...props }: CardProps) {
  const lift = interactive || variant === 'elevated'
  return (
    <motion.div
      className={cn(
        'rounded-xl',
        variantMap[variant],
        health && healthMap[health],
        paddingMap[padding],
        className,
      )}
      whileHover={lift ? { y: -3, transition: spring.smooth } : undefined}
      whileTap={lift ? { y: 0, transition: spring.snappy } : undefined}
      {...(props as any)}
    >
      {children}
    </motion.div>
  )
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between gap-3 mb-4', className)} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold text-white font-display', className)} {...props}>
      {children}
    </h3>
  )
}

function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-[#2E2854] flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardBody, CardFooter }
export type { Health as CardHealth }
