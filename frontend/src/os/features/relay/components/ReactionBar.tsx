import { api } from '@lib/api'
import { useRelayStore } from '../store'
import type { MessageReaction } from '../types'

interface Props {
  channelId: string
  messageId: string
  reactions: MessageReaction[]
  currentUserId: string
}

function groupReactions(reactions: MessageReaction[]) {
  const map = new Map<string, MessageReaction[]>()
  for (const r of reactions) {
    map.set(r.emoji, [...(map.get(r.emoji) ?? []), r])
  }
  return Array.from(map.entries()).map(([emoji, list]) => ({ emoji, list, count: list.length }))
}

export function ReactionBar({ channelId, messageId, reactions, currentUserId }: Props) {
  const toggleReaction = useRelayStore((s) => s.toggleReaction)

  const handleToggle = async (emoji: string) => {
    try {
      const { data } = await api.post(`/channels/${channelId}/messages/${messageId}/reactions`, { emoji })
      toggleReaction(channelId, messageId, data.allReactions)
    } catch { /* ignore */ }
  }

  const groups = groupReactions(reactions)
  if (!groups.length) return null

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {groups.map(({ emoji, list, count }) => {
        const mine = list.some((r) => r.userId === currentUserId)
        const tooltip = list.map((r) => r.user.name).join(', ')
        return (
          <button
            key={emoji}
            title={tooltip}
            onClick={() => handleToggle(emoji)}
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px] border font-bold transition-colors shadow-sm ${
              mine
                ? 'bg-os-blue/10 border-os-blue/30 text-os-blue'
                : 'bg-[var(--os-surface-0)] border-[var(--os-border)] text-[var(--os-text-2)] hover:bg-[var(--os-card)] hover:text-[var(--os-text-1)]'
            }`}
          >
            <span>{emoji}</span>
            <span className="text-[11px] font-black opacity-80">{count}</span>
          </button>
        )
      })}
    </div>
  )
}
