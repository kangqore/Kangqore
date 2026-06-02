import { useRef, useEffect, useState } from 'react'
import { Send, Paperclip, Mail } from 'lucide-react'
import { Avatar } from '@design-system/components/Avatar'
import { Button } from '@design-system/components/Button'
import { cn } from '@design-system/cn'
import type { EmailLog, ContactInfo } from '../types'

const fmtTime = (s: string) =>
  new Date(s).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

interface Props {
  contact:    ContactInfo
  emails:     EmailLog[]
  onReply:    (content: string) => void
  isPending?: boolean
  loading?:   boolean
}

export function EmailThread({ contact, emails, onReply, isPending, loading }: Props) {
  const [draft,  setDraft]  = useState('')
  const bottomRef           = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [emails.length])

  function send() {
    if (!draft.trim() || isPending) return
    onReply(draft.trim())
    setDraft('')
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send()
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-3 w-full max-w-md px-8 animate-pulse">
          {[1,2,3].map(i => <div key={i} className={`h-14 rounded-2xl bg-slate-100 ${i % 2 === 0 ? 'ml-auto w-4/5' : 'w-4/5'}`} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Contact header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 flex-shrink-0">
        <Avatar name={contact.name} size="sm" />
        <div>
          <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
          <p className="text-xs text-slate-400">{contact.email ?? contact.company ?? contact.role}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
          <Mail className="w-3.5 h-3.5" />
          {emails.length} message{emails.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {emails.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400 py-16 text-center">
            No messages yet.
          </div>
        )}
        {emails.map(email => {
          const isOutbound = email.direction === 'outbound'
          return (
            <div key={email.id} className={cn('flex gap-3 max-w-[85%]', isOutbound ? 'ml-auto flex-row-reverse' : '')}>
              <Avatar name={isOutbound ? 'Admin' : contact.name} size="xs" className="flex-shrink-0 mt-1" />
              <div>
                <div className={cn(
                  'rounded-2xl px-4 py-3',
                  isOutbound ? 'bg-[#2564ea] text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm',
                )}>
                  {email.subject && (
                    <p className={cn('text-[10px] font-semibold mb-1.5', isOutbound ? 'text-blue-200' : 'text-slate-500')}>
                      {email.subject}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{email.body}</p>
                  {email.hasAttachment && (
                    <div className={cn('flex items-center gap-1.5 mt-2 text-[11px]', isOutbound ? 'text-blue-200' : 'text-slate-400')}>
                      <Paperclip className="w-3 h-3" /> Attachment
                    </div>
                  )}
                </div>
                <p className={cn('text-[10px] text-slate-400 mt-1', isOutbound ? 'text-right' : '')}>
                  {fmtTime(email.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Compose reply */}
      <div className="border-t border-slate-100 px-4 py-3 flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder={`Reply to ${contact.name}… (⌘↵ to send)`}
            className="flex-1 resize-none border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 leading-relaxed"
          />
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-3.5 h-3.5" />}
            disabled={!draft.trim() || isPending}
            onClick={send}
          >
            Send
          </Button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">⌘↵ to send</p>
      </div>
    </div>
  )
}
