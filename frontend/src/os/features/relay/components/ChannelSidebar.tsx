import { useState } from 'react'
import { Plus, MagnifyingGlass } from '@phosphor-icons/react'
import { Hash, Lock, MegaphoneSimple, Users } from '@phosphor-icons/react'
import { useRelayStore } from '../store'
import { PresenceDot } from './PresenceDot'
import { useAuthStore } from '@store/auth'
import type { Channel, PresenceStatus } from '../types'

const TYPE_ICON = {
  PUBLIC:       Hash,
  PRIVATE:      Lock,
  ANNOUNCEMENT: MegaphoneSimple,
  DM:           Users,
  GROUP_DM:     Users,
}

function ChannelRow({ ch, isActive, onClick }: { ch: Channel; isActive: boolean; onClick: () => void }) {
  const unread = useRelayStore((s) => s.unreadCounts[ch.id])
  const Icon = TYPE_ICON[ch.type] ?? Hash
  const hasUnread = (unread?.messages ?? 0) > 0
  const hasMention = (unread?.mentions ?? 0) > 0

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-2xl text-left transition-all group ${
        isActive
          ? 'bg-slate-100/80 text-[var(--os-text-1)] shadow-sm border border-[var(--os-border)]'
          : 'text-[var(--os-text-2)] hover:bg-slate-50 hover:text-[var(--os-text-1)] border border-transparent'
      }`}
    >
      <Icon size={14} weight={hasUnread ? 'bold' : 'regular'} className={isActive ? 'text-os-blue' : ''} />
      <span className={`flex-1 text-[13px] truncate ${hasUnread || isActive ? 'font-bold text-[var(--os-text-1)]' : 'font-medium'}`}>
        {ch.name}
      </span>
      {hasMention && (
        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center shadow-[0_2px_4px_rgba(244,63,94,0.3)]">
          {unread.mentions > 9 ? '9+' : unread.mentions}
        </span>
      )}
      {!hasMention && hasUnread && (
        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-os-blue shadow-[0_0_8px_rgba(37,100,234,0.4)]" />
      )}
    </button>
  )
}

interface Props {
  activeChannelId: string | null
  onSelect: (ch: Channel) => void
}

export function ChannelSidebar({ activeChannelId, onSelect }: Props) {
  const channels = useRelayStore((s) => s.channels) ?? []
  const presence = useRelayStore((s) => s.presence)
  const user = useAuthStore((s) => s.user)

  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] }))

  const filtered = search
    ? channels.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : channels

  const globalChannels = filtered.filter((c) => c.scope === 'GLOBAL' && c.type !== 'DM' && c.type !== 'GROUP_DM')
  const deptChannels   = filtered.filter((c) => c.scope === 'DEPT')
  const execChannels   = filtered.filter((c) => c.scope === 'EXECUTIVE')
  const roomChannels   = filtered.filter((c) => ['CLIENT_ROOM', 'PARTNER_ROOM'].includes(c.scope))
  const dmChannels     = filtered.filter((c) => c.type === 'DM' || c.type === 'GROUP_DM')

  const Section = ({ label, items, sectionKey }: { label: string; items: Channel[]; sectionKey: string }) => {
    if (!items.length) return null
    const isCollapsed = collapsed[sectionKey]
    return (
      <div className="mb-1">
        <button
          onClick={() => toggle(sectionKey)}
          className="w-full flex items-center gap-1 px-3 py-1.5 mt-2 text-[10px] font-extrabold tracking-widest text-[var(--os-text-3)] uppercase hover:text-[var(--os-text-2)] transition-colors"
        >
          <span className={`transition-transform ${isCollapsed ? '' : 'rotate-90'}`}>›</span>
          {label}
        </button>
        {!isCollapsed && items.map((ch) => (
          <ChannelRow key={ch.id} ch={ch} isActive={ch.id === activeChannelId} onClick={() => onSelect(ch)} />
        ))}
      </div>
    )
  }

  return (
    <div className="w-[260px] flex-shrink-0 flex flex-col border-r border-[var(--os-border)] bg-[var(--os-surface-0)]">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[var(--os-border)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-black tracking-tight text-[var(--os-text-1)]">RELAY</span>
          <button className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors" title="New channel">
            <Plus size={16} />
          </button>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-os-blue/20 transition-all">
          <MagnifyingGlass size={12} className="text-[var(--os-text-3)] flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels"
            className="flex-1 bg-transparent text-[12px] font-medium text-[var(--os-text-1)] placeholder:text-[var(--os-text-3)] outline-none"
          />
        </div>
      </div>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        <Section label="Channels" items={globalChannels} sectionKey="global" />
        {execChannels.length > 0 && <Section label="Executive" items={execChannels} sectionKey="exec" />}
        {deptChannels.length > 0 && <Section label="Department" items={deptChannels} sectionKey="dept" />}
        {roomChannels.length > 0 && <Section label="Rooms" items={roomChannels} sectionKey="rooms" />}
        <Section label="Direct Messages" items={dmChannels} sectionKey="dms" />
      </div>

      {/* Current user strip */}
      {user && (
        <div className="flex items-center gap-3 px-4 py-3 border-t border-[var(--os-border)] bg-[var(--os-card)] mt-auto rounded-bl-[var(--os-radius-xl)]">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden border border-slate-200">
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                : user.name[0].toUpperCase()
              }
            </div>
            <PresenceDot
              status={(presence[user.id] ?? 'ONLINE') as PresenceStatus}
              className="absolute -bottom-0.5 -right-0.5"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[var(--os-text-1)] truncate leading-tight">{user.name}</p>
            <p className="text-[11px] font-semibold text-[var(--os-text-2)] capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
      )}
    </div>
  )
}
