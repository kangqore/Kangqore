import * as Switch from '@radix-ui/react-switch'
import { cn } from '../cn'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}

function Toggle({ checked, onChange, label, description, disabled, size = 'md', className }: ToggleProps) {
  const track = size === 'sm'
    ? 'w-8 h-4'
    : 'w-11 h-6'
  const thumb = size === 'sm'
    ? 'w-3 h-3 data-[state=checked]:translate-x-4'
    : 'w-5 h-5 data-[state=checked]:translate-x-5'

  const control = (
    <Switch.Root
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center rounded-full transition-colors duration-200 outline-none',
        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-200',
        track
      )}
    >
      <Switch.Thumb
        className={cn(
          'block rounded-full bg-white shadow-sm translate-x-0.5 transition-transform duration-200',
          thumb
        )}
      />
    </Switch.Root>
  )

  if (!label) return control

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {control}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {description && <span className="text-xs text-slate-400">{description}</span>}
      </div>
    </div>
  )
}

export { Toggle }
