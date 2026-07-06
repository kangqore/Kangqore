import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { useRelayStore } from '../store'
import type { ChatMessage, ChannelMember } from '../types'

export function useMessages(channelId: string | null) {
  const prependMessages = useRelayStore((s) => s.prependMessages)

  return useInfiniteQuery({
    queryKey: ['relay-messages', channelId],
    enabled: !!channelId,
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const params = new URLSearchParams({ limit: '50' })
      if (pageParam) params.set('before', pageParam)
      const { data } = await api.get<{ messages: ChatMessage[]; hasMore: boolean }>(
        `/channels/${channelId}/messages?${params}`,
      )
      prependMessages(channelId!, data.messages)
      return data
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.messages[0]?.id : undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 30_000,
  })
}

export function useThread(channelId: string, parentId: string | null) {
  const hydrateThread = useRelayStore((s) => s.hydrateThread)

  return useQuery({
    queryKey: ['relay-thread', parentId],
    enabled: !!parentId,
    queryFn: async () => {
      const { data } = await api.get<{ replies: ChatMessage[] }>(
        `/channels/${channelId}/threads/${parentId}`,
      )
      hydrateThread(parentId!, data.replies)
      return data.replies
    },
    staleTime: 15_000,
  })
}

export function useChannelMembers(channelId: string | null) {
  return useQuery({
    queryKey: ['relay-members', channelId],
    enabled: !!channelId,
    queryFn: async () => {
      const { data } = await api.get<{ members: ChannelMember[] }>(`/channels/${channelId}/members`)
      return data.members
    },
    staleTime: 60_000,
  })
}
