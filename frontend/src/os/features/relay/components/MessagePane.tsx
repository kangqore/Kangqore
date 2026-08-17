import { useEffect, useRef, useState } from 'react'
import { format, isToday, isYesterday } from 'date-fns'
import { useRelayStore } from '../store'
import { useMessages } from '../hooks/useMessages'
import { useAuthStore } from '@store/auth'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { TypingIndicator } from './TypingIndicator'
import { ChannelHeader } from './ChannelHeader'
import { ThreadPanel } from './ThreadPanel'
import { MemberList } from './MemberList'
import type { Channel, ChatMessage } from '../types'

function dateDividerLabel(dateStr: string) {
  const d = new Date(dateStr)
  if (isToday(d)) return 'Today'
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMMM d, yyyy')
}

export function MessagePane({ channel }: { channel: Channel }) {
  const user = useAuthStore((s) => s.user)
  const messages = useRelayStore((s) => s.messages[channel.id]) ?? []
  const markRead = useRelayStore((s) => s.markRead)

  const listRef = useRef<HTMLDivElement>(null)
  const [threadMsg, setThreadMsg] = useState<ChatMessage | null>(null)
  const [membersOpen, setMembersOpen] = useState(false)

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(channel.id)

  const scrollToBottom = (smooth = false) => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = smooth ? el.scrollTop + 9999 : el.scrollHeight
  }

  useEffect(() => {
    scrollToBottom()
    markRead(channel.id)
  }, [channel.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll when the current user sends a message
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last?.author.id === user?.id) scrollToBottom(true)
  }, [messages.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget
    if (scrollTop < 80 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden">
      {/* Main pane */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <ChannelHeader
          channel={channel}
          memberCount={channel._count?.members}
          onToggleMembers={() => setMembersOpen((v) => !v)}
          membersOpen={membersOpen}
        />

        {/* Messages */}
        <div ref={listRef} className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          {isFetchingNextPage && (
            <div className="text-center py-4 text-[11px] font-bold tracking-widest uppercase text-[var(--os-text-3)]">Loading older messages…</div>
          )}

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 rounded-3xl bg-[var(--os-surface-0)] border border-[var(--os-border)] flex items-center justify-center mb-4 text-3xl shadow-sm">#</div>
              <p className="text-[15px] font-bold text-[var(--os-text-1)] mb-1">Welcome to {channel.name}</p>
              <p className="text-[12px] font-semibold text-[var(--os-text-2)]">This is the start of the channel. Say hello!</p>
            </div>
          )}

          {messages.map((msg, i) => {
            const prev = messages[i - 1]
            const showDivider = !prev || dateDividerLabel(msg.createdAt) !== dateDividerLabel(prev.createdAt)
            const isConsecutive =
              !showDivider &&
              prev?.author.id === msg.author.id &&
              new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000

            return (
              <div key={msg.id}>
                {showDivider && (
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="flex-1 h-px bg-[var(--os-border)]" />
                    <span className="text-[10px] font-extrabold text-[var(--os-text-3)] tracking-widest uppercase">
                      {dateDividerLabel(msg.createdAt)}
                    </span>
                    <div className="flex-1 h-px bg-[var(--os-border)]" />
                  </div>
                )}
                <MessageBubble
                  msg={msg}
                  channelId={channel.id}
                  currentUserId={user?.id ?? ''}
                  isConsecutive={isConsecutive}
                  onThreadOpen={setThreadMsg}
                />
              </div>
            )
          })}
        </div>

        {/* Typing + Input */}
        <TypingIndicator channelId={channel.id} />
        {channel.type !== 'ANNOUNCEMENT' && (
          <MessageInput channelId={channel.id} placeholder={`Message ${channel.name}`} />
        )}
        {channel.type === 'ANNOUNCEMENT' && (
          <div className="px-4 py-4 m-4 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[12px] font-bold text-[var(--os-text-2)] text-center shadow-sm">
            Only admins can post in announcement channels.
          </div>
        )}
      </div>

      {/* Thread panel */}
      {threadMsg && (
        <ThreadPanel
          channelId={channel.id}
          parentMsg={threadMsg}
          currentUserId={user?.id ?? ''}
          onClose={() => setThreadMsg(null)}
        />
      )}

      {/* Member list */}
      {membersOpen && (
        <MemberList channelId={channel.id} onClose={() => setMembersOpen(false)} />
      )}
    </div>
  )
}
