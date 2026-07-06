import { Tooltip } from '@design-system/components/Tooltip'
import type { PageViewer } from '@hooks/usePagePresence'

const BUBBLE_COLOURS = ['#579bfc', '#00c875', '#fdab3d', '#e2445c', '#7c3aed']

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase()
}

interface Props {
  viewers: PageViewer[]
}

export function PagePresenceBubbles({ viewers }: Props) {
  if (viewers.length === 0) return null

  const visible = viewers.slice(0, 4)
  const overflow = viewers.length - visible.length

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((v, i) => (
        <Tooltip key={v.userId} content={v.userName}>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-white dark:ring-[var(--os-surface-0)] select-none cursor-default"
            style={{ backgroundColor: BUBBLE_COLOURS[i % BUBBLE_COLOURS.length] }}
          >
            {initials(v.userName)}
          </div>
        </Tooltip>
      ))}
      {overflow > 0 && (
        <Tooltip content={`${overflow} more viewer${overflow > 1 ? 's' : ''}`}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold bg-[var(--os-card)] text-[var(--os-text-2)] ring-2 ring-white dark:ring-[var(--os-surface-0)] select-none cursor-default border border-[var(--os-border)]">
            +{overflow}
          </div>
        </Tooltip>
      )}
    </div>
  )
}
