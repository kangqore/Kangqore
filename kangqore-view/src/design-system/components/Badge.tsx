import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../cn'

const badge = cva(
  'inline-flex items-center gap-1.5 font-bold rounded-full border border-transparent',
  {
    variants: {
      variant: {
        success: 'bg-[#059669]   text-white',
        warning: 'bg-[#d97706]   text-white',
        danger:  'bg-[#ef4444]   text-white',
        info:    'bg-[#2564ea]   text-white',
        neutral: 'bg-[#0F172A]   text-slate-300 border border-[#2E2854]',
        brand:   'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] text-white',
        dark:    'bg-[#151C2F]   text-white border border-[#2E2854]',
        // Dim variants — colored text on dark tinted background
        'success-dim': 'bg-[rgba(5,150,105,0.14)]  text-[#34d399] border border-[rgba(5,150,105,0.2)]',
        'warning-dim': 'bg-[rgba(217,119,6,0.14)]  text-[#fbbf24] border border-[rgba(217,119,6,0.2)]',
        'danger-dim':  'bg-[rgba(239,68,68,0.14)]  text-[#f87171] border border-[rgba(239,68,68,0.2)]',
        'info-dim':    'bg-[rgba(37,100,234,0.14)] text-[#60a5fa] border border-[rgba(37,100,234,0.2)]',
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

// Dot colors: white on solid backgrounds, match text color on dim backgrounds
const dotColors: Record<string, string> = {
  success:     'bg-white/70',
  warning:     'bg-white/70',
  danger:      'bg-white/70',
  info:        'bg-white/70',
  neutral:     'bg-slate-400',
  brand:       'bg-white/70',
  dark:        'bg-slate-400',
  'success-dim': 'bg-[#34d399]',
  'warning-dim': 'bg-[#fbbf24]',
  'danger-dim':  'bg-[#f87171]',
  'info-dim':    'bg-[#60a5fa]',
}

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {
  dot?: boolean
  pulse?: boolean
}

function Badge({ className, variant = 'neutral', size, dot, pulse, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badge({ variant, size }), className)} {...props}>
      {dot && (
        <span className="relative flex-shrink-0 w-1.5 h-1.5">
          {pulse && (
            <span className={cn('absolute inset-0 rounded-full animate-ping opacity-75', dotColors[variant ?? 'neutral'])} />
          )}
          <span className={cn('relative rounded-full w-1.5 h-1.5 inline-block', dotColors[variant ?? 'neutral'])} />
        </span>
      )}
      {children}
    </span>
  )
}

export { Badge }
