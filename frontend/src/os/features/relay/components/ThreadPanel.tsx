import { X } from 'lucide-react'
import { api } from '@lib/api'
import { useRelayStore } from '../store'
import { useThread } from '../hooks/useMessages'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { useRef, useState, useEffect } from 'react'
import { PaperPlaneRight } from '@phosphor-icons/react'
import type { ChatMessage } from '../types'

interface Props {
  channelId: string
  parentMsg: ChatMessage
  currentUserId: string
  onClose: () => void
}

export function ThreadPanel({ channelId, parentMsg, currentUserId, onClose }: Props) {
  const appendThreadReply = useRelayStore((s) => s.appendThreadReply)
  const replies = useRelayStore((s) => s.threads[parentMsg.id]) ?? []
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useThread(channelId, parentMsg.id)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [replies.length])

  const send = async () => {
    const trimmed = reply.trim()
    if (!trimmed) return
    setSending(true)
    try {
      const { data } = await api.post(`/channels/${channelId}/messages`, {
        content: trimmed,
        parentId: parentMsg.id,
      })
      appendThreadReply(parentMsg.id, data.message)
      setReply('')
    } catch { } finally { setSending(false) }
  }

  return (
    <div className="w-[400px] flex-shrink-0 border-l border-[var(--os-border)] flex flex-col bg-[var(--os-surface-0)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--os-border)]">
        <span className="text-[14px] font-black tracking-tight text-[var(--os-text-1)]">Thread</span>
        <button onClick={onClose} className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)] transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Parent message */}
      <div className="px-2 pt-2 border-b border-[var(--os-border)]">
        <MessageBubble msg={parentMsg} channelId={channelId} currentUserId={currentUserId} />
        <p className="px-6 pb-3 text-[11px] font-bold tracking-widest uppercase text-[var(--os-text-3)]">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</p>
      </div>

      {/* Replies */}
      <div className="flex-1 overflow-y-auto py-2">
        {replies.map((r, i) => (
          <MessageBubble
            key={r.id}
            msg={r}
            channelId={channelId}
            currentUserId={currentUserId}
            isConsecutive={i > 0 && replies[i - 1].author.id === r.author.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Typing */}
      <TypingIndicator channelId={channelId} />

      {/* Reply input */}
      <div className="px-4 pb-4 mt-auto pt-2 bg-[var(--os-surface-0)]">
        <div className="flex items-center gap-2 bg-[var(--os-card)] border border-[var(--os-border)] rounded-[var(--os-radius-lg)] px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-os-blue/20 transition-all">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send() } }}
            placeholder="Reply in thread…"
            className="flex-1 bg-transparent text-[13px] font-medium text-[var(--os-text-1)] placeholder:text-[var(--os-text-3)] outline-none"
          />
          <button
            onClick={send}
            disabled={sending || !reply.trim()}
            className="text-os-blue disabled:opacity-30 hover:text-os-blue/80 transition-colors"
          >
            <PaperPlaneRight size={18} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  )
}
