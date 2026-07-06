import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { useRelayStore } from '../store'
import type { Channel } from '../types'

export function useChannels() {
  const hydrateChannels = useRelayStore((s) => s.hydrateChannels)

  return useQuery({
    queryKey: ['relay-channels'],
    queryFn: async () => {
      const { data } = await api.get<{ channels: Channel[] }>('/channels')
      hydrateChannels(data.channels)
      return data.channels
    },
    staleTime: 60_000,
  })
}

export function useUnreadCounts() {
  const setUnread = useRelayStore((s) => s.setUnread)

  return useQuery({
    queryKey: ['relay-unread'],
    queryFn: async () => {
      const { data } = await api.get<{ counts: Record<string, { messages: number; mentions: number }> }>('/channels/unread-counts')
      Object.entries(data.counts).forEach(([id, count]) => setUnread(id, count))
      return data.counts
    },
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
}
