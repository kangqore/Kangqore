import { ChevronDown, Check } from 'lucide-react'
import {
  DropdownRoot, DropdownTrigger, DropdownPortal,
  DropdownContent, DropdownItem,
} from '@design-system/components/Dropdown'
import { cn } from '@design-system/cn'

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand' | 'dark'

export interface SelectOption<T extends string = string> {
  value: T
  label: string
  variant?: Variant
}

interface InlineSelectProps<T extends string = string> {
  value: T
  options: SelectOption<T>[]
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  disabled?: boolean
  dot?: boolean
}

const variantClasses: Record<Variant, string> = {
  success: 'bg-[#00c875]  text-white border-transparent hover:bg-[#00c875]/90 shadow-sm',
  warning: 'bg-[#fdab3d]  text-white border-transparent hover:bg-[#fdab3d]/90 shadow-sm',
  danger:  'bg-[#e2445c]  text-white border-transparent hover:bg-[#e2445c]/90 shadow-sm',
  info:    'bg-[#0073ea]  text-white border-transparent hover:bg-[#0073ea]/90 shadow-sm',
  neutral: 'bg-slate-100  text-slate-700 border-slate-200  hover:bg-slate-200',
  brand:   'bg-[#2564ea]  text-white border-transparent hover:bg-[#2564ea]/90 shadow-sm',
  dark:    'bg-slate-800 text-white       border-transparent hover:bg-slate-700 shadow-sm',
}

const dotColors: Record<Variant, string> = {
  success: 'bg-white',
  warning: 'bg-white',
  danger:  'bg-white',
  info:    'bg-white',
  neutral: 'bg-slate-400',
  brand:   'bg-white',
  dark:    'bg-white',
}

const itemDotColors: Record<Variant, string> = {
  success: 'bg-[#00c875]',
  warning: 'bg-[#fdab3d]',
  danger:  'bg-[#e2445c]',
  info:    'bg-[#0073ea]',
  neutral: 'bg-slate-400',
  brand:   'bg-[#2564ea]',
  dark:    'bg-slate-800',
}

const itemHover: Record<Variant, string> = {
  success: 'focus:bg-[#00c875]/10  text-[#00c875]',
  warning: 'focus:bg-[#fdab3d]/10  text-[#fdab3d]',
  danger:  'focus:bg-[#e2445c]/10  text-[#e2445c]',
  info:    'focus:bg-[#0073ea]/10  text-[#0073ea]',
  neutral: 'focus:bg-slate-50  text-slate-700',
  brand:   'focus:bg-[#2564ea]/10  text-[#2564ea]',
  dark:    'focus:bg-slate-700 text-white',
}

export function InlineSelect<T extends string = string>({
  value,
  options,
  onChange,
  size = 'sm',
  disabled = false,
  dot = false,
}: InlineSelectProps<T>) {
  const current = options.find(o => o.value === value)
  const variant = current?.variant ?? 'neutral'

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs gap-1'
    : 'px-2.5 py-1 text-xs gap-1.5'

  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <button
          disabled={disabled}
          onClick={e => e.stopPropagation()}
          className={cn(
            'inline-flex items-center font-bold rounded-full border transition-all duration-150 outline-none',
            'cursor-pointer select-none',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            variantClasses[variant],
            sizeClasses,
          )}
        >
          {dot && (
            <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />
          )}
          <span className="capitalize">{current?.label ?? value}</span>
          <ChevronDown className={cn('flex-shrink-0 opacity-60', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
        </button>
      </DropdownTrigger>
      <DropdownPortal>
        <DropdownContent
          align="start"
          sideOffset={4}
          onClick={e => e.stopPropagation()}
          className="z-[100] min-w-[150px] bg-white border border-slate-200 rounded-xl shadow-lg p-1 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {options.map(opt => {
            const isSelected = opt.value === value
            const v = opt.variant ?? 'neutral'
            return (
              <DropdownItem
                key={opt.value}
                onSelect={() => onChange(opt.value)}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-lg cursor-default outline-none transition-colors',
                  itemHover[v],
                )}
              >
                <span className={cn('w-2 h-2 rounded-full flex-shrink-0', itemDotColors[v])} />
                <span className="flex-1 capitalize font-medium">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 opacity-70" />}
              </DropdownItem>
            )
          })}
        </DropdownContent>
      </DropdownPortal>
    </DropdownRoot>
  )
}
