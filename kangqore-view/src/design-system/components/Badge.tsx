import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../cn'

const badge = cva(
  'inline-flex items-center gap-1.5 font-medium rounded-full border',
  {
    variants: {
      variant: {
        success: 'bg-green-50  text-green-700  border-green-200',
        warning: 'bg-amber-50  text-amber-700  border-amber-200',
        danger:  'bg-red-50    text-red-700    border-red-200',
        info:    'bg-blue-50   text-blue-700   border-blue-200',
        neutral: 'bg-slate-50  text-slate-600  border-slate-200',
        brand:   'bg-blue-50 text-blue-700 border-blue-200',
        dark:    'bg-slate-800 text-white       border-transparent',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
)

const dotColors: Record<string, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  neutral: 'bg-slate-400',
  brand:   'bg-blue-500',
  dark:    'bg-slate-300',
}

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {
  dot?: boolean
}

function Badge({ className, variant = 'neutral', size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badge({ variant, size }), className)} {...props}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant ?? 'neutral'])} />
      )}
      {children}
    </span>
  )
}

export { Badge }
