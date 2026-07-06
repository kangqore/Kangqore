import { X } from 'lucide-react'
import { PresenceDot } from './PresenceDot'
import { useRelayStore } from '../store'
import { useChannelMembers } from '../hooks/useMessages'
import type { PresenceStatus } from '../types'

const ORDER: PresenceStatus[] = ['ONLINE', 'AWAY', 'DND', 'OFFLINE']

export function MemberList({ channelId, onClose }: { channelId: string; onClose: () => void }) {
  const presence = useRelayStore((s) => s.presence)
  const { data: members = [] } = useChannelMembers(channelId)

  const grouped = ORDER.reduce<Record<PresenceStatus, typeof members>>(
    (acc, s) => { acc[s] = []; return acc },
    {} as Record<PresenceStatus, typeof members>,
  )
  members.forEach((m) => {
    const status = (presence[m.userId] ?? m.presence?.status ?? 'OFFLINE') as PresenceStatus
    grouped[status].push(m)
  })

  return (
    <div className="w-[260px] flex-shrink-0 border-l border-[var(--os-border)] flex flex-col bg-[var(--os-surface-0)]">
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--os-border)]">
        <span className="text-[12px] font-bold text-[var(--os-text-2)] tracking-widest uppercase">Members — {members.length}</span>
        <button onClick={onClose} className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)] transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {ORDER.map((status) => {
          const group = grouped[status]
          if (!group.length) return null
          return (
            <div key={status} className="mb-3 mt-2">
              <p className="px-4 mb-2 text-[10px] font-extrabold tracking-widest text-[var(--os-text-3)] uppercase">
                {status.toLowerCase()} — {group.length}
              </p>
              {group.map((m) => (
                <div key={m.userId} className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--os-card)] transition-colors mx-2 rounded-xl">
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden border border-slate-200">
                      {m.user.avatarUrl
                        ? <img src={m.user.avatarUrl} alt={m.user.name} className="w-full h-full object-cover" />
                        : m.user.name[0].toUpperCase()
                      }
                    </div>
                    <PresenceDot
                      status={(presence[m.userId] ?? m.presence?.status ?? 'OFFLINE') as PresenceStatus}
                      className="absolute -bottom-0.5 -right-0.5"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[var(--os-text-1)] truncate">{m.user.name}</p>
                    {m.presence?.customStatus && (
                      <p className="text-[11px] font-medium text-[var(--os-text-2)] truncate">{m.presence.customStatus}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
