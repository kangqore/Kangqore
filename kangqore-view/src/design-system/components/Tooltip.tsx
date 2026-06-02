import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '../cn'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delay?: number
  className?: string
}

function Tooltip({ content, children, side = 'top', align = 'center', delay = 300, className }: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delay}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          {children as React.ReactElement}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={6}
            className={cn(
              'z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg shadow-lg',
              'animate-in fade-in-0 zoom-in-95 duration-100',
              className
            )}
          >
            {content}
            <RadixTooltip.Arrow className="fill-slate-900" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

export { Tooltip }
