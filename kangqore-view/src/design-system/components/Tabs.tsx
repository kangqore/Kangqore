import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '../cn'

interface Tab {
  value: string
  label: string
  icon?: React.ReactNode
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
  variant?: 'underline' | 'pills'
  children?: React.ReactNode
  className?: string
}

function Tabs({ tabs, value, onChange, variant = 'underline', children, className }: TabsProps) {
  return (
    <RadixTabs.Root value={value} onValueChange={onChange} className={cn('flex flex-col', className)}>
      <RadixTabs.List
        className={cn(
          'flex items-center gap-1',
          variant === 'underline' && 'border-b border-slate-200 gap-0',
          variant === 'pills' && 'bg-slate-100 p-1 rounded-xl w-fit'
        )}
      >
        {tabs.map(tab => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-all duration-150 outline-none',
              variant === 'underline' && [
                'px-4 py-2.5 text-slate-500 hover:text-slate-800',
                'border-b-2 border-transparent -mb-px',
                'data-[state=active]:border-blue-600 data-[state=active]:text-blue-700',
              ],
              variant === 'pills' && [
                'px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-700',
                'data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm',
              ]
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'text-xs rounded-full px-1.5 py-0.5 font-medium',
                value === tab.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-200 text-slate-500'
              )}>
                {tab.count}
              </span>
            )}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {children}
    </RadixTabs.Root>
  )
}

function TabContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return (
    <RadixTabs.Content value={value} className={cn('outline-none', className)}>
      {children}
    </RadixTabs.Content>
  )
}

export { Tabs, TabContent }
