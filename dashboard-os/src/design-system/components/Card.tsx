import { cn } from '../cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
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
  elevated: 'bg-white border border-slate-200 shadow-md',
  glass:    'bg-white border border-slate-200 shadow-sm',
}

function Card({ className, variant = 'default', padding = 'md', children, ...props }: CardProps) {
  return (
    <div className={cn('rounded-xl transition-all duration-300', variantMap[variant], paddingMap[padding], className)} {...props}>
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
    <h3 className={cn('text-base font-semibold text-slate-900', className)} {...props}>
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
