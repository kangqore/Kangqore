import { cn } from '../cn'

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-4',
}

const colorMap = {
  brand:   'border-[#4ab6d4]/30 border-t-[#2564ea]',
  white:   'border-white/30 border-t-white',
  slate:   'border-[#2E2854] border-t-slate-500',
  success: 'border-green-200 border-t-green-600',
  danger:  'border-red-200 border-t-red-600',
}

interface SpinnerProps {
  size?: keyof typeof sizeMap
  color?: keyof typeof colorMap
  className?: string
}

function Spinner({ size = 'md', color = 'brand', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('rounded-full animate-spin', sizeMap[size], colorMap[color], className)}
    />
  )
}

function FullPageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#151C2F]/60 backdrop-blur-sm z-50">
      <Spinner size="lg" />
    </div>
  )
}

export { Spinner, FullPageSpinner }
