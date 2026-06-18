import * as RadixTabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import { cn } from '../cn'
import { tabContent } from '@os/motion'

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
          variant === 'underline' && 'border-b border-[#2E2854] gap-0',
          variant === 'pills' && 'bg-[#0F172A] border border-[#2E2854] p-1 rounded-xl w-fit'
        )}
      >
        {tabs.map(tab => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-all duration-150 outline-none',
              variant === 'underline' && [
                'px-4 py-2.5 text-slate-500 hover:text-white',
                'border-b-2 border-transparent -mb-px',
                'data-[state=active]:border-[#4ab6d4] data-[state=active]:text-[#4ab6d4]',
              ],
              variant === 'pills' && [
                'px-4 py-1.5 rounded-lg text-slate-500 hover:text-white',
                'data-[state=active]:bg-[#151C2F] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-[#2E2854]',
              ]
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'text-xs rounded-full px-1.5 py-0.5 font-medium border border-transparent',
                value === tab.value
                  ? 'bg-[#2564ea]/20 text-[#4ab6d4]'
                  : 'bg-[#151C2F] text-slate-500 border-[#2E2854]'
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
      <motion.div
        variants={tabContent}
        initial="hidden"
        animate="visible"
      >
        {children}
      </motion.div>
    </RadixTabs.Content>
  )
}

export { Tabs, TabContent }
