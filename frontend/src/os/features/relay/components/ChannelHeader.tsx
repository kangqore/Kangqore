import { Hash, Lock, MegaphoneSimple, Users, PushPin, MagnifyingGlass } from '@phosphor-icons/react'
import type { Channel } from '../types'

const TYPE_ICON = {
  PUBLIC:       Hash,
  PRIVATE:      Lock,
  ANNOUNCEMENT: MegaphoneSimple,
  DM:           Users,
  GROUP_DM:     Users,
}

interface Props {
  channel: Channel
  memberCount?: number
  onToggleMembers: () => void
  onSearch?: () => void
  onPins?: () => void
  membersOpen: boolean
}

export function ChannelHeader({ channel, memberCount, onToggleMembers, onSearch, onPins, membersOpen }: Props) {
  const Icon = TYPE_ICON[channel.type] ?? Hash

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon size={16} weight="bold" className="text-white/40 flex-shrink-0" />
        <span className="text-[14px] font-bold text-white truncate">{channel.name}</span>
        {channel.description && (
          <>
            <span className="text-white/20 text-xs">|</span>
            <span className="text-[12px] text-white/40 truncate">{channel.description}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {onPins && (
          <button
            onClick={onPins}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors text-[11px]"
            title="Pinned messages"
          >
            <PushPin size={14} />
          </button>
        )}
        {onSearch && (
          <button
            onClick={onSearch}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors text-[11px]"
            title="Search"
          >
            <MagnifyingGlass size={14} />
          </button>
        )}
        <button
          onClick={onToggleMembers}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors text-[11px] ${
            membersOpen ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
          title="Members"
        >
          <Users size={14} />
          {memberCount !== undefined && <span>{memberCount}</span>}
        </button>
      </div>
    </div>
  )
}
