export type ChannelType = 'PUBLIC' | 'PRIVATE' | 'DM' | 'GROUP_DM' | 'ANNOUNCEMENT'
export type ChannelScope = 'GLOBAL' | 'DEPT' | 'EXECUTIVE' | 'CLIENT_ROOM' | 'PARTNER_ROOM'
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER'
export type NotifPref = 'ALL' | 'MENTIONS' | 'NOTHING'
export type PresenceStatus = 'ONLINE' | 'AWAY' | 'DND' | 'OFFLINE'

export interface Channel {
  id: string
  name: string
  slug: string
  type: ChannelType
  scope: ChannelScope
  deptId: string | null
  description: string | null
  isArchived: boolean
  createdById: string
  createdAt: string
  _count?: { members: number; messages: number }
  members?: ChannelMemberSelf[] // current-user membership only
}

export interface ChannelMemberSelf {
  role: MemberRole
  notifPref: NotifPref
  lastReadAt: string | null
}

export interface ChannelMember {
  id: string
  channelId: string
  userId: string
  role: MemberRole
  notifPref: NotifPref
  lastReadAt: string | null
  joinedAt: string
  user: { id: string; name: string; avatarUrl: string | null; role: string; deptId?: string | null }
  presence?: { status: PresenceStatus; customStatus?: string | null }
}

export interface ChatAttachment {
  name: string
  url: string
  size: number
  mimeType: string
}

export interface MessageReaction {
  id: string
  emoji: string
  userId: string
  user: { id: string; name: string }
}

export interface ChatMessage {
  id: string
  channelId: string
  content: string
  parentId: string | null
  isPinned: boolean
  editedAt: string | null
  deletedAt: string | null
  attachments: ChatAttachment[]
  mentions: string[]
  createdAt: string
  author: { id: string; name: string; avatarUrl: string | null; role: string }
  reactions: MessageReaction[]
  _count?: { replies: number }
}

export interface UnreadCount {
  messages: number
  mentions: number
}
