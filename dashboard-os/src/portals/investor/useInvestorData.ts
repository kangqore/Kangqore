import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

export function useInvestorStats() {
  return useQuery({
    queryKey: ['investor', 'stats'],
    queryFn: () => api.get('/investor/stats').then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useInvestorUpdates() {
  return useQuery({
    queryKey: ['investor', 'updates'],
    queryFn: () => api.get('/investor/updates').then(r => r.data.updates ?? r.data ?? []),
    staleTime: 1000 * 60 * 5,
  })
}
