import { useEffect } from 'react'
import { getSocket, connectSocket } from '@lib/socket'
import { useRelayStore } from '../store'
import type { ChatMessage, MessageReaction, PresenceStatus } from '../types'

export function useChatSocket() {
  useEffect(() => {
    connectSocket()
    const socket = getSocket()

    const onMessage = (msg: ChatMessage) => {
      const s = useRelayStore.getState()
      if (msg.parentId) {
        s.appendThreadReply(msg.parentId, msg)
        const { activeChannelId, messages } = useRelayStore.getState()
        if (activeChannelId) {
          const parent = messages[activeChannelId]?.find((m) => m.id === msg.parentId)
          if (parent) {
            s.updateMessage(activeChannelId, {
              id: msg.parentId,
              _count: { replies: (parent._count?.replies ?? 0) + 1 },
            })
          }
        }
      } else {
        s.appendMessage(msg.channelId, msg)
      }
    }

    const onEdit = (patch: { id: string; content: string; editedAt: string; channelId?: string }) => {
      const { activeChannelId, updateMessage } = useRelayStore.getState()
      const cid = patch.channelId ?? activeChannelId ?? ''
      if (cid) updateMessage(cid, patch)
    }

    const onDelete = (data: { id: string; deletedAt: string; channelId?: string }) => {
      const { activeChannelId, removeMessage } = useRelayStore.getState()
      const cid = data.channelId ?? activeChannelId ?? ''
      if (cid) removeMessage(cid, data.id, data.deletedAt)
    }

    const onReaction = (data: { messageId: string; channelId?: string; allReactions: MessageReaction[] }) => {
      const { activeChannelId, toggleReaction } = useRelayStore.getState()
      const cid = data.channelId ?? activeChannelId ?? ''
      if (cid) toggleReaction(cid, data.messageId, data.allReactions)
    }

    const onTypingStart = (data: { userId: string; userName: string; channelId: string }) => {
      useRelayStore.getState().setTyping(data.channelId, data.userId, data.userName)
    }

    const onTypingStop = (data: { userId: string; channelId: string }) => {
      useRelayStore.getState().clearTyping(data.channelId, data.userId)
    }

    const onPresence = (data: { userId: string; status: PresenceStatus }) => {
      useRelayStore.getState().setPresence(data.userId, data.status)
    }

    socket.on('chat:message:new', onMessage)
    socket.on('chat:message:edit', onEdit)
    socket.on('chat:message:delete', onDelete)
    socket.on('chat:reaction', onReaction)
    socket.on('chat:typing:start', onTypingStart)
    socket.on('chat:typing:stop', onTypingStop)
    socket.on('presence:update', onPresence)

    return () => {
      socket.off('chat:message:new', onMessage)
      socket.off('chat:message:edit', onEdit)
      socket.off('chat:message:delete', onDelete)
      socket.off('chat:reaction', onReaction)
      socket.off('chat:typing:start', onTypingStart)
      socket.off('chat:typing:stop', onTypingStop)
      socket.off('presence:update', onPresence)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
