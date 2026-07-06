import { create } from 'zustand'
import type { Channel, ChatMessage, PresenceStatus, UnreadCount } from './types'

interface TypingUser { userId: string; userName: string; expiresAt: number }

interface RelayStore {
  channels: Channel[]
  activeChannelId: string | null
  messages: Record<string, ChatMessage[]>
  threads: Record<string, ChatMessage[]>  // parentId → replies
  presence: Record<string, PresenceStatus>
  unreadCounts: Record<string, UnreadCount>
  typingUsers: Record<string, TypingUser[]>

  hydrateChannels: (channels: Channel[]) => void
  setActiveChannel: (id: string | null) => void

  prependMessages: (channelId: string, msgs: ChatMessage[]) => void
  appendMessage: (channelId: string, msg: ChatMessage) => void
  updateMessage: (channelId: string, patch: Partial<ChatMessage> & { id: string }) => void
  removeMessage: (channelId: string, id: string, deletedAt: string) => void

  appendThreadReply: (parentId: string, msg: ChatMessage) => void
  hydrateThread: (parentId: string, replies: ChatMessage[]) => void

  toggleReaction: (channelId: string, messageId: string, updatedReactions: ChatMessage['reactions']) => void

  setPresence: (userId: string, status: PresenceStatus) => void
  setUnread: (channelId: string, count: UnreadCount) => void
  markRead: (channelId: string) => void

  setTyping: (channelId: string, userId: string, userName: string) => void
  clearTyping: (channelId: string, userId: string) => void
}

export const useRelayStore = create<RelayStore>((set, get) => ({
  channels: [],
  activeChannelId: null,
  messages: {},
  threads: {},
  presence: {},
  unreadCounts: {},
  typingUsers: {},

  hydrateChannels: (channels) => set({ channels: channels ?? [] }),

  setActiveChannel: (id) => set({ activeChannelId: id }),

  prependMessages: (channelId, msgs) =>
    set((s) => ({
      messages: { ...s.messages, [channelId]: [...msgs, ...(s.messages[channelId] ?? [])] },
    })),

  appendMessage: (channelId, msg) =>
    set((s) => {
      const existing = s.messages[channelId] ?? []
      if (existing.some((m) => m.id === msg.id)) return s
      return { messages: { ...s.messages, [channelId]: [...existing, msg] } }
    }),

  updateMessage: (channelId, patch) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: (s.messages[channelId] ?? []).map((m) =>
          m.id === patch.id ? { ...m, ...patch } : m,
        ),
      },
    })),

  removeMessage: (channelId, id, deletedAt) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: (s.messages[channelId] ?? []).map((m) =>
          m.id === id ? { ...m, deletedAt, content: 'This message was deleted.' } : m,
        ),
      },
    })),

  appendThreadReply: (parentId, msg) =>
    set((s) => ({
      threads: { ...s.threads, [parentId]: [...(s.threads[parentId] ?? []), msg] },
    })),

  hydrateThread: (parentId, replies) =>
    set((s) => ({ threads: { ...s.threads, [parentId]: replies } })),

  toggleReaction: (channelId, messageId, updatedReactions) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: (s.messages[channelId] ?? []).map((m) =>
          m.id === messageId ? { ...m, reactions: updatedReactions } : m,
        ),
      },
    })),

  setPresence: (userId, status) =>
    set((s) => ({ presence: { ...s.presence, [userId]: status } })),

  setUnread: (channelId, count) =>
    set((s) => ({ unreadCounts: { ...s.unreadCounts, [channelId]: count } })),

  markRead: (channelId) =>
    set((s) => ({ unreadCounts: { ...s.unreadCounts, [channelId]: { messages: 0, mentions: 0 } } })),

  setTyping: (channelId, userId, userName) => {
    const expiresAt = Date.now() + 4500
    set((s) => {
      const prev = (s.typingUsers[channelId] ?? []).filter((t) => t.userId !== userId)
      return { typingUsers: { ...s.typingUsers, [channelId]: [...prev, { userId, userName, expiresAt }] } }
    })
    setTimeout(() => get().clearTyping(channelId, userId), 4500)
  },

  clearTyping: (channelId, userId) =>
    set((s) => ({
      typingUsers: {
        ...s.typingUsers,
        [channelId]: (s.typingUsers[channelId] ?? []).filter((t) => t.userId !== userId),
      },
    })),
}))
