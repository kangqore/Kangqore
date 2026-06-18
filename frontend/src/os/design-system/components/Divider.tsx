import { cn } from '../cn'

interface DividerProps {
  label?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

function Divider({ label, orientation = 'horizontal', className }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={cn('w-px self-stretch bg-slate-200', className)} />
  }

  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
    )
  }

  return <div className={cn('h-px w-full bg-slate-200', className)} />
}

export { Divider }
