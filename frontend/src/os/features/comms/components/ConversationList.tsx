import { Search, MessageSquare } from 'lucide-react'
import { EmptyState } from '@design-system/components/EmptyState'
import { Avatar } from '@design-system/components/Avatar'
import { cn } from '@design-system/cn'
import type { EmailConversation, InternalConversation } from '../types'

type AnyConversation = EmailConversation | InternalConversation

function getUser(c: AnyConversation) {
  return c.user
}
function getPreview(c: AnyConversation): string {
  if ('emails' in c) return c.lastMessage.preview
  return c.lastMessage.content
}
function getTime(c: AnyConversation): string {
  if ('emails' in c) return c.lastMessage.createdAt
  return c.lastMessage.createdAt
}

const fmtTime = (s: string) => {
  const d = new Date(s)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  return isToday
    ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

interface Props {
  conversations:  AnyConversation[]
  selectedId:     string | null
  onSelect:       (id: string) => void
  loading?:       boolean
  audienceLabel?: string
  search:         string
  onSearch:       (v: string) => void
}

export function ConversationList({
  conversations, selectedId, onSelect, loading, audienceLabel, search, onSearch,
}: Props) {
  const filtered = conversations.filter(c =>
    !search || getUser(c).name.toLowerCase().includes(search.toLowerCase()) ||
    (getUser(c).company ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full border-r border-white/10 border-t-white/20">
      {/* Search */}
      <div className="p-3 border-b border-white/10 border-t-white/20 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder={`Search ${audienceLabel?.toLowerCase() ?? 'conversations'}…`}
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-900 border border-white/10 border-t-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={<MessageSquare className="w-5 h-5" />}
            title="No conversations"
            description="Messages will appear here once contacts reach out."
            className="py-10"
          />
        )}
        {!loading && filtered.map(c => {
          const user      = getUser(c)
          const preview   = getPreview(c)
          const time      = getTime(c)
          const isSelected = selectedId === user.id
          const unread    = c.unreadCount

          return (
            <button
              key={user.id}
              onClick={() => onSelect(user.id)}
              className={cn(
                'w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-900 border-b border-white/10 border-t-white/20',
                isSelected && 'bg-blue-50 border-blue-100 hover:bg-blue-50',
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar name={user.name} size="sm" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-os-blue text-white text-[9px] font-bold flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-1 mb-0.5">
                  <p className={cn('text-xs font-semibold truncate', isSelected ? 'text-os-blue' : 'text-slate-200')}>
                    {user.name}
                  </p>
                  <span className="text-[10px] text-slate-500 flex-shrink-0">{fmtTime(time)}</span>
                </div>
                {user.company && (
                  <p className="text-[10px] text-slate-500 truncate mb-0.5">{user.company}</p>
                )}
                <p className={cn('text-[11px] truncate', unread > 0 ? 'text-slate-300 font-medium' : 'text-slate-500')}>
                  {preview}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
