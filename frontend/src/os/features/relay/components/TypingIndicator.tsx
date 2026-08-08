import { useRelayStore } from '../store'

export function TypingIndicator({ channelId }: { channelId: string }) {
  const typingUsers = useRelayStore((s) => s.typingUsers[channelId]) ?? []

  if (!typingUsers.length) return null

  const names = typingUsers.map((t) => t.userName).filter(Boolean)
  const label =
    names.length === 1
      ? `${names[0]} is typing…`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing…`
      : 'Several people are typing…'

  return (
    <div className="flex items-center gap-2 px-4 pb-1 h-6">
      <div className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <span className="text-[11px] text-white/50 italic">{label}</span>
    </div>
  )
}
