import { useRef, useState, useEffect, KeyboardEvent } from 'react'
import { PaperPlaneRight, Paperclip, Smiley } from '@phosphor-icons/react'
import { api } from '@lib/api'
import { getSocket } from '@lib/socket'
import { useRelayStore } from '../store'
import { useAuthStore } from '@store/auth'
import type { ChatMessage } from '../types'

const COMMON_EMOJI = ['😀','😂','❤️','👍','🔥','🎉','✅','⚡','🚀','💡','👀','🙏']

interface Props {
  channelId: string
  placeholder?: string
  onSent?: () => void
}

export function MessageInput({ channelId, placeholder = 'Message…', onSent }: Props) {
  const appendMessage = useRelayStore((s) => s.appendMessage)
  const user = useAuthStore((s) => s.user)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [attachments, setAttachments] = useState<{ name: string; url: string; size: number; mimeType: string }[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore draft
  useEffect(() => {
    const draft = localStorage.getItem(`relay-draft:${channelId}`)
    if (draft) setContent(draft)
    return () => { if (typingTimer.current) clearTimeout(typingTimer.current) }
  }, [channelId])

  const saveDraft = (val: string) => {
    if (val.trim()) localStorage.setItem(`relay-draft:${channelId}`, val)
    else localStorage.removeItem(`relay-draft:${channelId}`)
  }

  const emitTyping = () => {
    try { getSocket().emit('chat:typing:start', { channelId }) } catch { }
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      try { getSocket().emit('chat:typing:stop', { channelId }) } catch { }
    }, 3000)
  }

  const handleChange = (val: string) => {
    setContent(val)
    saveDraft(val)
    if (val.trim()) emitTyping()
  }

  const send = async () => {
    const trimmed = content.trim()
    if (!trimmed && !attachments.length) return
    setSending(true)
    setContent('')
    setAttachments([])
    localStorage.removeItem(`relay-draft:${channelId}`)
    try {
      const { data } = await api.post<{ message: ChatMessage }>(
        `/channels/${channelId}/messages`,
        { content: trimmed || '📎', attachments },
      )
      // Immediately show the sent message; socket echo deduped by appendMessage
      if (data?.message) appendMessage(channelId, data.message)
      onSent?.()
    } catch {
      // Restore content on failure so user doesn't lose their message
      setContent(trimmed)
    } finally { setSending(false) }
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await api.post<{ url: string }>('/uploads/single', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setAttachments((prev) => [...prev, { name: file.name, url: data.url, size: file.size, mimeType: file.type }])
    } catch { } finally { setUploading(false); e.target.value = '' }
  }

  return (
    <div className="px-4 pb-4 bg-[var(--os-card)] z-10">
      {/* Pending attachments */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((att, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs font-bold text-[var(--os-text-2)] shadow-sm">
              📎 {att.name}
              <button onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))} className="text-[var(--os-text-3)] hover:text-rose-500">×</button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 bg-[var(--os-card)] border border-[var(--os-border)] rounded-[var(--os-radius-xl)] px-4 py-2 focus-within:ring-2 focus-within:ring-os-blue/20 transition-shadow shadow-[0_12px_32px_rgba(0,0,0,0.04)]">
        {/* File upload */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="p-1.5 text-[var(--os-text-3)] hover:text-[var(--os-text-1)] transition-colors flex-shrink-0 self-end mb-0.5"
          title="Attach file"
        >
          <Paperclip size={18} />
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />

        {/* Text area */}
        <textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-transparent text-[13px] font-medium text-[var(--os-text-1)] placeholder:text-[var(--os-text-3)] outline-none resize-none max-h-40 overflow-y-auto py-1"
          style={{ lineHeight: '1.5' }}
          onInput={(e) => {
            const el = e.currentTarget
            el.style.height = 'auto'
            el.style.height = `${el.scrollHeight}px`
          }}
        />

        {/* Emoji picker */}
        <div className="relative flex-shrink-0 self-end mb-0.5">
          <button
            onClick={() => setEmojiOpen((v) => !v)}
            className="p-1.5 text-[var(--os-text-3)] hover:text-[var(--os-text-1)] transition-colors"
          >
            <Smiley size={18} />
          </button>
          {emojiOpen && (
            <div className="absolute bottom-full right-0 mb-2 grid grid-cols-6 gap-1 bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-2 shadow-2xl z-20">
              {COMMON_EMOJI.map((e) => (
                <button
                  key={e}
                  onClick={() => { setContent((c) => c + e); setEmojiOpen(false) }}
                  className="text-base hover:scale-125 transition-transform w-7 h-7 flex items-center justify-center"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Send */}
        <button
          onClick={send}
          disabled={sending || (!content.trim() && !attachments.length)}
          className="p-1.5 text-os-blue hover:text-os-blue/80 disabled:opacity-30 transition-colors flex-shrink-0 self-end mb-0.5"
          title="Send (Enter)"
        >
          <PaperPlaneRight size={18} weight="fill" />
        </button>
      </div>
      <p className="text-[10px] font-bold text-[var(--os-text-3)] mt-2 px-2">Enter to send · Shift+Enter for new line</p>
    </div>
  )
}
