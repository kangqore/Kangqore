import { forwardRef, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { cn } from '../cn'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  label?: string
  error?: string
  hint?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, prefix, suffix, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const controls = useAnimation()
    const prevError = useRef<string | undefined>(undefined)

    useEffect(() => {
      if (error && error !== prevError.current) {
        controls.start({
          x: [0, -4, 4, -4, 4, 0],
          transition: { duration: 0.35, ease: 'easeInOut' },
        })
      }
      prevError.current = error
    }, [error, controls])

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <motion.div animate={controls} className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 flex items-center text-slate-500 pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-9 rounded-xl border bg-[#0F172A] text-sm text-white placeholder:text-slate-500',
              'border-[#2E2854] focus:border-[#4ab6d4] focus:ring-2 focus:ring-[#4ab6d4]/20',
              'outline-none transition-all duration-150',
              'disabled:bg-[#151C2F] disabled:text-slate-500 disabled:cursor-not-allowed',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              prefix ? 'pl-9' : 'pl-3',
              suffix ? 'pr-9' : 'pr-3',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 flex items-center text-slate-500">
              {suffix}
            </span>
          )}
        </motion.div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
