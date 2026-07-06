import { useState } from 'react'
import { X, Send, Paperclip, AtSign, MessageSquare, Link2 } from 'lucide-react'

export interface PanelField {
  label: string
  field: string
}

export interface RelatedItem {
  id:     string
  label:  string
  type:   string
  status: string
  color:  string
}

interface Comment {
  id:       string
  author:   string
  initials: string
  color:    string
  text:     string
  time:     string
}

const SEED_COMMENTS: Comment[] = [
  {
    id: '1', author: 'Arjun S.', initials: 'AS', color: '#2564ea',
    text: 'Investigated the root cause — looks like the VPN gateway certificate auto-renewal job failed silently. Escalating to Rohan.',
    time: '2h ago',
  },
  {
    id: '2', author: 'Rohan M.', initials: 'RM', color: '#10B981',
    text: '@Arjun S. Confirmed. Renewing manually now. ETA 30 min.',
    time: '1h ago',
  },
]

interface ItemDetailPanelProps {
  item:          Record<string, any>
  fields:        PanelField[]
  relatedItems?: RelatedItem[]
  accentColor?:  string
  itemLabel?:    string
  onClose:       () => void
  onUpdate?:     (field: string, value: string) => void
}

export function ItemDetailPanel({
  item, fields, relatedItems, accentColor = '#2564ea', itemLabel, onClose,
}: ItemDetailPanelProps) {
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS)
  const [draft, setDraft]       = useState('')

  function postComment() {
    if (!draft.trim()) return
    setComments(prev => [...prev, {
      id:       Date.now().toString(),
      author:   'You',
      initials: 'YO',
      color:    accentColor,
      text:     draft.trim(),
      time:     'just now',
    }])
    setDraft('')
  }

  const title = item.title ?? item.name ?? item.id

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-[#0D1628] border-l border-white/10 z-50 flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accentColor }} />
          <p className="text-xs font-bold text-[var(--os-text-2)] font-mono flex-shrink-0">{item.id}</p>
          {itemLabel && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${accentColor}22`, color: accentColor }}
            >
              {itemLabel}
            </span>
          )}
          <button onClick={onClose} className="ml-auto text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Title */}
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-base font-bold text-white leading-snug">{title}</p>
          </div>

          {/* Fields */}
          <div className="px-5 py-4 border-b border-white/10 space-y-2.5">
            {fields.map(f => (
              <div key={f.field} className="flex items-start gap-4">
                <p className="text-xs text-[var(--os-text-2)] w-24 flex-shrink-0 pt-0.5">{f.label}</p>
                <p className="text-xs text-[var(--os-text-1)]">{item[f.field] ?? '—'}</p>
              </div>
            ))}
          </div>

          {/* CMDB / Related Items */}
          {relatedItems && relatedItems.length > 0 && (
            <div className="px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
                <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Linked Items (CMDB)</p>
              </div>
              <div className="space-y-2">
                {relatedItems.map(r => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-white/10"
                  >
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                      style={{ background: `${r.color}22`, color: r.color }}
                    >
                      {r.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{r.label}</p>
                      <p className="text-xs text-[var(--os-text-2)]">{r.id}</p>
                    </div>
                    <span className="text-xs text-[var(--os-text-2)]">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
              <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Thread</p>
              <span className="ml-auto text-xs text-[var(--os-text-2)]">{comments.length}</span>
            </div>
            <div className="space-y-4">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: `${c.color}25`, color: c.color }}
                  >
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-semibold text-white">{c.author}</p>
                      <p className="text-xs text-[var(--os-text-2)]">{c.time}</p>
                    </div>
                    <p className="text-xs text-[var(--os-text-1)] leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comment input */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-white/10 bg-[#0B1121]">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postComment() }
                }}
                placeholder="Add a comment… (Enter to post, @ to mention)"
                rows={2}
                className="w-full bg-transparent text-xs text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] outline-none resize-none"
              />
              <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-white/10">
                <button className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
                  <Paperclip className="w-3.5 h-3.5" />
                </button>
                <button className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
                  <AtSign className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <button
              onClick={postComment}
              disabled={!draft.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: accentColor }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
