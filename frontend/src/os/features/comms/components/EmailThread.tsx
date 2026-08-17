import { useRef, useEffect, useState } from 'react'
import { Send, Paperclip, Mail, X, FileText, Loader2 } from 'lucide-react'
import { Avatar } from '@design-system/components/Avatar'
import { Button } from '@design-system/components/Button'
import { cn } from '@design-system/cn'
import { api } from '@lib/api'
import type { EmailLog, ContactInfo, EmailAttachment } from '../types'

const fmtTime = (s: string) =>
  new Date(s).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

type Attachment = EmailAttachment

interface Props {
  contact:    ContactInfo
  emails:     EmailLog[]
  onReply:    (content: string, attachments?: Attachment[]) => void
  isPending?: boolean
  loading?:   boolean
}

export function EmailThread({ contact, emails, onReply, isPending, loading }: Props) {
  const [draft,       setDraft]       = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploading,   setUploading]   = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [emails.length])

  function send() {
    if ((!draft.trim() && attachments.length === 0) || isPending) return
    onReply(draft.trim(), attachments.length > 0 ? attachments : undefined)
    setDraft('')
    setAttachments([])
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await api.post('/uploads/single', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setAttachments(prev => [...prev, { name: file.name, url: res.data.url, size: file.size }])
    } catch {
      // silently fail — user can retry
    } finally {
      setUploading(false)
    }
  }

  function removeAttachment(idx: number) {
    setAttachments(prev => prev.filter((_, i) => i !== idx))
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-3 w-full max-w-md px-8 animate-pulse">
          {[1,2,3].map(i => <div key={i} className={`h-14 rounded-2xl bg-[var(--os-surface-0)] ${i % 2 === 0 ? 'ml-auto w-4/5' : 'w-4/5'}`} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Contact header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--os-border)] flex-shrink-0">
        <Avatar name={contact.name} size="sm" />
        <div>
          <p className="text-sm font-semibold text-[var(--os-text-1)]">{contact.name}</p>
          <p className="text-xs text-[var(--os-text-2)]">{contact.email ?? contact.company ?? contact.role}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-[var(--os-text-2)]">
          <Mail className="w-3.5 h-3.5" />
          {emails.length} message{emails.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {emails.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-[var(--os-text-2)] py-16 text-center">
            No messages yet.
          </div>
        )}
        {emails.map(email => {
          const isOutbound = email.direction === 'outbound'
          const emailAttachments = email.attachments as Attachment[] | null
          return (
            <div key={email.id} className={cn('flex gap-3 max-w-[85%]', isOutbound ? 'ml-auto flex-row-reverse' : '')}>
              <Avatar name={isOutbound ? 'Admin' : contact.name} size="xs" className="flex-shrink-0 mt-1" />
              <div>
                <div className={cn(
                  'rounded-2xl px-4 py-3',
                  isOutbound ? 'bg-[#579bfc] text-white rounded-tr-sm' : 'bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-1)] rounded-tl-sm',
                )}>
                  {email.subject && (
                    <p className={cn('text-[10px] font-semibold mb-1.5', isOutbound ? 'text-blue-200' : 'text-[var(--os-text-2)]')}>
                      {email.subject}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{email.body}</p>
                  {emailAttachments && emailAttachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {emailAttachments.map((a, i) => (
                        <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
                          className={cn('flex items-center gap-1 text-[11px] px-2 py-1 rounded-2xl',
                            isOutbound ? 'bg-blue-700/50 text-blue-100 hover:bg-blue-700' : 'bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-1)] hover:bg-[var(--os-card)]')}>
                          <FileText className="w-3 h-3" />{a.name}
                        </a>
                      ))}
                    </div>
                  )}
                  {email.hasAttachment && (!emailAttachments || emailAttachments.length === 0) && (
                    <div className={cn('flex items-center gap-1.5 mt-2 text-[11px]', isOutbound ? 'text-blue-200' : 'text-[var(--os-text-2)]')}>
                      <Paperclip className="w-3 h-3" /> Attachment
                    </div>
                  )}
                </div>
                <p className={cn('text-[10px] text-[var(--os-text-2)] mt-1', isOutbound ? 'text-right' : '')}>
                  {fmtTime(email.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Compose reply */}
      <div className="border-t border-[var(--os-border)] px-4 py-3 flex-shrink-0">
        {/* Attachment chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {attachments.map((a, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[11px] bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-1)] px-2 py-1 rounded-2xl">
                <FileText className="w-3 h-3 text-[var(--os-text-2)]" />
                {a.name}
                <button onClick={() => removeAttachment(i)} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Hidden file input */}
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

          {/* Attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-2xl text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors disabled:opacity-50"
            title="Attach file"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
          </button>

          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder={`Reply to ${contact.name}… (⌘↵ to send)`}
            className="flex-1 resize-none border border-[var(--os-border)] rounded-2xl px-3 py-2.5 text-sm text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] bg-[var(--os-surface-0)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 leading-relaxed"
          />
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-3.5 h-3.5" />}
            disabled={(!draft.trim() && attachments.length === 0) || isPending}
            onClick={send}
          >
            Send
          </Button>
        </div>
        <p className="text-[10px] text-[var(--os-text-2)] mt-1.5">⌘↵ to send</p>
      </div>
    </div>
  )
}
