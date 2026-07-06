import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { PencilSimple, Trash, PushPin, ChatCircle, Smiley } from '@phosphor-icons/react'
import { api } from '@lib/api'
import { useRelayStore } from '../store'
import { ReactionBar } from './ReactionBar'
import type { ChatMessage } from '../types'

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '🔥', '👀']

interface Props {
  msg: ChatMessage
  channelId: string
  currentUserId: string
  isConsecutive?: boolean
  onThreadOpen?: (msg: ChatMessage) => void
}

export function MessageBubble({ msg, channelId, currentUserId, isConsecutive = false, onThreadOpen }: Props) {
  const [hover, setHover] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(msg.content)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const { updateMessage, removeMessage, toggleReaction } = useRelayStore()

  const isMine = msg.author.id === currentUserId
  const isDeleted = !!msg.deletedAt

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === msg.content) { setEditing(false); return }
    try {
      const { data } = await api.patch(`/channels/${channelId}/messages/${msg.id}`, { content: editContent.trim() })
      updateMessage(channelId, { id: msg.id, content: data.message.content, editedAt: data.message.editedAt })
    } catch { }
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this message?')) return
    try {
      await api.delete(`/channels/${channelId}/messages/${msg.id}`)
      removeMessage(channelId, msg.id, new Date().toISOString())
    } catch { }
  }

  const handlePin = async () => {
    try {
      await api.patch(`/channels/${channelId}/messages/${msg.id}/pin`)
    } catch { }
  }

  const handleReaction = async (emoji: string) => {
    setEmojiPickerOpen(false)
    try {
      const { data } = await api.post(`/channels/${channelId}/messages/${msg.id}/reactions`, { emoji })
      toggleReaction(channelId, msg.id, data.allReactions)
    } catch { }
  }

  return (
    <div
      className={`group relative flex gap-3 px-4 py-0.5 ${!isConsecutive ? 'pt-3' : ''} hover:bg-[var(--os-surface-0)] transition-colors rounded-xl mx-2`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setEmojiPickerOpen(false) }}
    >
      {/* Avatar or spacer */}
      <div className="w-10 flex-shrink-0 flex flex-col items-center pt-0.5">
        {!isConsecutive ? (
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 overflow-hidden border border-slate-200">
              {msg.author.avatarUrl
                ? <img src={msg.author.avatarUrl} alt={msg.author.name} className="w-full h-full object-cover" />
                : msg.author.name[0].toUpperCase()
              }
            </div>
          </div>
        ) : (
          hover && (
            <span className="text-[9px] font-bold text-[var(--os-text-3)] leading-none mt-1">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {!isConsecutive && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-[14px] font-bold text-[var(--os-text-1)]">{msg.author.name}</span>
            <span className="text-[11px] font-medium text-[var(--os-text-3)]">
              {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
            </span>
            {msg.isPinned && <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md">📌 pinned</span>}
          </div>
        )}

        {/* Message body */}
        {isDeleted ? (
          <p className="text-[13px] font-medium text-[var(--os-text-3)] italic">{msg.content}</p>
        ) : editing ? (
          <div className="flex flex-col gap-1 mt-1">
            <textarea
              autoFocus
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEdit() }
                if (e.key === 'Escape') setEditing(false)
              }}
              rows={2}
              className="w-full bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg px-3 py-2 text-[13px] text-[var(--os-text-1)] outline-none resize-none focus:border-os-blue focus:ring-1 focus:ring-os-blue transition-all"
            />
            <div className="flex gap-2 text-[11px] font-bold">
              <button onClick={handleEdit} className="text-os-blue hover:underline">Save</button>
              <button onClick={() => setEditing(false)} className="text-[var(--os-text-3)] hover:underline">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="text-[14px] text-[var(--os-text-1)] font-medium leading-relaxed whitespace-pre-wrap break-words">
            {msg.content}
            {msg.editedAt && <span className="text-[10px] text-[var(--os-text-3)] ml-2">(edited)</span>}
          </div>
        )}

        {/* Attachments */}
        {msg.attachments?.map((att) => (
          <div key={att.url} className="mt-2">
            {att.mimeType?.startsWith('image/') ? (
              <img src={att.url} alt={att.name} className="max-w-xs max-h-48 rounded-xl object-cover border border-[var(--os-border)] shadow-sm" />
            ) : (
              <a
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[12px] font-bold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-card)] transition-colors shadow-sm"
              >
                📎 {att.name}
              </a>
            )}
          </div>
        ))}

        {/* Reactions */}
        {!isDeleted && (
          <ReactionBar
            channelId={channelId}
            messageId={msg.id}
            reactions={msg.reactions ?? []}
            currentUserId={currentUserId}
          />
        )}

        {/* Thread count */}
        {!isDeleted && (msg._count?.replies ?? 0) > 0 && onThreadOpen && (
          <button
            onClick={() => onThreadOpen(msg)}
            className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-os-blue bg-os-blue/5 hover:bg-os-blue/10 transition-colors border border-os-blue/10"
          >
            <ChatCircle size={14} weight="bold" />
            {msg._count!.replies} {msg._count!.replies === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>

      {/* Hover toolbar */}
      {hover && !isDeleted && !editing && (
        <div className="absolute right-4 -top-3 flex items-center gap-1 bg-[var(--os-card)] border border-[var(--os-border)] rounded-lg px-1.5 py-1 shadow-md z-10 animate-in fade-in zoom-in duration-100">
          {/* Quick emoji */}
          <div className="relative">
            <button
              onClick={() => setEmojiPickerOpen((v) => !v)}
              className="p-1.5 rounded-md hover:bg-[var(--os-surface-0)] text-[var(--os-text-3)] hover:text-[var(--os-text-1)] transition-colors"
              title="React"
            >
              <Smiley size={16} />
            </button>
            {emojiPickerOpen && (
              <div className="absolute bottom-full right-0 mb-2 flex gap-1 bg-[var(--os-card)] border border-[var(--os-border)] rounded-xl px-2 py-2 shadow-xl z-20">
                {QUICK_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => handleReaction(e)}
                    className="text-lg hover:scale-125 transition-transform"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          {onThreadOpen && (
            <button
              onClick={() => onThreadOpen(msg)}
              className="p-1.5 rounded-md hover:bg-[var(--os-surface-0)] text-[var(--os-text-3)] hover:text-[var(--os-text-1)] transition-colors"
              title="Reply in thread"
            >
              <ChatCircle size={16} />
            </button>
          )}
          {isMine && (
            <button
              onClick={() => { setEditing(true); setEditContent(msg.content) }}
              className="p-1.5 rounded-md hover:bg-[var(--os-surface-0)] text-[var(--os-text-3)] hover:text-[var(--os-text-1)] transition-colors"
              title="Edit"
            >
              <PencilSimple size={16} />
            </button>
          )}
          <button
            onClick={handlePin}
            className={`p-1.5 rounded-md hover:bg-[var(--os-surface-0)] transition-colors ${msg.isPinned ? 'text-amber-500' : 'text-[var(--os-text-3)] hover:text-[var(--os-text-1)]'}`}
            title={msg.isPinned ? 'Unpin' : 'Pin'}
          >
            <PushPin size={16} />
          </button>
          {(isMine || true) && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-md hover:bg-rose-50 text-[var(--os-text-3)] hover:text-rose-500 transition-colors"
              title="Delete"
            >
              <Trash size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
