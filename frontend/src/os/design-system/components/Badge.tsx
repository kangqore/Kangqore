import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../cn'

const badge = cva(
  'inline-flex items-center gap-1.5 font-bold rounded-full border border-transparent shadow-sm',
  {
    variants: {
      variant: {
        success: 'bg-[#00c875]  text-white',
        warning: 'bg-[#fdab3d]  text-white',
        danger:  'bg-[#e2445c]  text-white',
        info:    'bg-[#0073ea]  text-white',
        neutral: 'bg-slate-100  text-slate-700',
        brand:   'bg-[#2564ea]  text-white',
        dark:    'bg-slate-800  text-white',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px] tracking-wide',
        md: 'px-2.5 py-1 text-[11px] tracking-wide',
        lg: 'px-3 py-1.5 text-xs tracking-wide',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
)

const dotColors: Record<string, string> = {
  success: 'bg-white',
  warning: 'bg-white',
  danger:  'bg-white',
  info:    'bg-white',
  neutral: 'bg-slate-400',
  brand:   'bg-white',
  dark:    'bg-white',
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
