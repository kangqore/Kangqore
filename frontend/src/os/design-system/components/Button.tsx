import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '../cn'
import { spring } from '@os/motion'

const button = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary:   'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] text-white hover:opacity-90 focus-visible:ring-[#2564ea] shadow-[0_8px_24px_rgba(37,100,234,0.35)]',
        secondary: 'bg-[var(--os-card)] text-[var(--os-text-1)] border border-[var(--os-border)] hover:bg-[var(--os-surface-2)] shadow-[var(--os-shadow-md)]',
        ghost:     'text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-2)] focus-visible:ring-[var(--os-border)]',
        danger:    'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-[0_8px_24px_rgba(239,68,68,0.35)]',
        success:   'bg-[#00c875] text-white hover:bg-[#00c875]/90 focus-visible:ring-[#00c875] shadow-[0_8px_24px_rgba(0,200,117,0.35)]',
        brand:     'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] text-white hover:opacity-90 focus-visible:ring-[#2564ea] shadow-[0_8px_24px_rgba(37,100,234,0.35)]',
      },
      size: {
        sm:   'h-8 px-4 text-xs rounded-full',
        md:   'h-10 px-5 text-sm rounded-full',
        lg:   'h-12 px-6 text-base rounded-full',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const isDisabled = disabled ?? loading
    return (
      <motion.button
        ref={ref}
        className={cn(button({ variant, size }), className)}
        disabled={isDisabled}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        whileHover={isDisabled ? undefined : { scale: 1.01 }}
        transition={spring.snappy}
        {...(props as any)}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
