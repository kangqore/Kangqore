import { cn } from '../cn'

type Health = 'on-track' | 'at-risk' | 'behind' | 'completed'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  health?: Health
}

const paddingMap = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
}

const variantMap = {
  default:  'bg-white border border-slate-200 shadow-sm',
  flat:     'bg-white border border-slate-200',
  elevated: 'bg-white border border-slate-200 shadow-md hover:shadow-lg transition-shadow duration-200',
  glass:    'bg-white/80 backdrop-blur-md border border-white/60 shadow-md ring-1 ring-slate-200/50',
}

// Left-border stripe + background tint — the whole card communicates health
const healthMap: Record<Health, string> = {
  'on-track':  'border-l-4 border-l-green-500  bg-green-50/40',
  'at-risk':   'border-l-4 border-l-amber-500  bg-amber-50/40',
  'behind':    'border-l-4 border-l-red-500    bg-red-50/40',
  'completed': 'border-l-4 border-l-slate-400  bg-slate-50/60',
}

function Card({ className, variant = 'default', padding = 'md', health, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        variantMap[variant],
        health && healthMap[health],
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
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
    <h3 className={cn('text-base font-semibold text-slate-900 font-display', className)} {...props}>
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
    <div className={cn('mt-4 pt-4 border-t border-slate-100 flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardBody, CardFooter }
export type { Health as CardHealth }
