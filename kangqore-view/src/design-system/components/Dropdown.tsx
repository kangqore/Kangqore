import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '../cn'

interface DropdownItem {
  label: string
  icon?: React.ReactNode
  shortcut?: string
  variant?: 'default' | 'danger'
  disabled?: boolean
  onClick?: () => void
}

interface DropdownGroup {
  label?: string
  items: DropdownItem[]
}

interface DropdownProps {
  trigger: React.ReactNode
  groups: DropdownGroup[]
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

function Dropdown({ trigger, groups, align = 'end', side = 'bottom', className }: DropdownProps) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>
        {trigger as React.ReactElement}
      </RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align={align}
          side={side}
          sideOffset={6}
          className={cn(
            'z-50 min-w-[180px] bg-white border border-slate-200 rounded-xl shadow-lg p-1',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            className
          )}
        >
          {groups.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <RadixDropdown.Separator className="my-1 h-px bg-slate-100" />}
              {group.label && (
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  {group.label}
                </div>
              )}
              {group.items.map((item, ii) => (
                <RadixDropdown.Item
                  key={ii}
                  disabled={item.disabled}
                  onSelect={item.onClick}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-lg cursor-default outline-none transition-colors',
                    item.variant === 'danger'
                      ? 'text-red-600 focus:bg-red-50'
                      : 'text-slate-700 focus:bg-slate-50',
                    item.disabled && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  {item.icon && <span className="w-4 h-4 flex items-center">{item.icon}</span>}
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && (
                    <span className="text-[11px] text-slate-400 font-mono">{item.shortcut}</span>
                  )}
                </RadixDropdown.Item>
              ))}
            </div>
          ))}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  )
}

// Re-export primitives for custom dropdown compositions
const DropdownRoot = RadixDropdown.Root
const DropdownTrigger = RadixDropdown.Trigger
const DropdownContent = RadixDropdown.Content
const DropdownItem = RadixDropdown.Item
const DropdownSeparator = RadixDropdown.Separator
const DropdownLabel = RadixDropdown.Label
const DropdownCheckboxItem = RadixDropdown.CheckboxItem
const DropdownItemIndicator = RadixDropdown.ItemIndicator
const DropdownPortal = RadixDropdown.Portal
const DropdownSub = RadixDropdown.Sub
const DropdownSubTrigger = RadixDropdown.SubTrigger
const DropdownSubContent = RadixDropdown.SubContent

export {
  Dropdown,
  DropdownRoot, DropdownTrigger, DropdownContent, DropdownItem,
  DropdownSeparator, DropdownLabel, DropdownCheckboxItem,
  DropdownItemIndicator, DropdownPortal, DropdownSub,
  DropdownSubTrigger, DropdownSubContent,
  Check, ChevronRight,
}
