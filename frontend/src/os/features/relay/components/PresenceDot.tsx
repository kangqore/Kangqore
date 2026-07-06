import type { PresenceStatus } from '../types'

const COLORS: Record<PresenceStatus, string> = {
  ONLINE:  'bg-emerald-400',
  AWAY:    'bg-amber-400',
  DND:     'bg-rose-500',
  OFFLINE: 'bg-slate-500',
}

export function PresenceDot({ status, className = '' }: { status: PresenceStatus; className?: string }) {
  return (
    <span
      className={`inline-block w-3 h-3 rounded-full border-2 border-[var(--os-card)] shadow-sm flex-shrink-0 ${COLORS[status]} ${className}`}
      title={status.toLowerCase()}
    />
  )
}
