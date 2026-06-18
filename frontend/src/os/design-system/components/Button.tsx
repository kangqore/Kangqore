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
        primary:   'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] text-white hover:opacity-90 focus-visible:ring-[#2564ea] shadow-sm',
        secondary: 'bg-[#0F172A] text-slate-300 border border-[#2E2854] hover:bg-[#151C2F] hover:text-white focus-visible:ring-slate-400 shadow-sm',
        ghost:     'text-slate-500 hover:text-white hover:bg-[#0F172A] focus-visible:ring-slate-400',
        danger:    'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-sm',
        success:   'bg-[#00c875] text-white hover:bg-[#00c875]/90 focus-visible:ring-[#00c875] shadow-sm',
        brand:     'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] text-white hover:opacity-90 focus-visible:ring-[#2564ea] shadow-sm',
      },
      size: {
        sm:   'h-8 px-3 text-xs rounded-lg',
        md:   'h-9 px-4 text-sm rounded-xl',
        lg:   'h-11 px-6 text-base rounded-xl',
        icon: 'h-9 w-9 rounded-xl',
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
