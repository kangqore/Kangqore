import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

export function usePartnerStats() {
  return useQuery({
    queryKey: ['partner', 'stats'],
    queryFn: () => api.get('/partner/stats').then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePartnerProjects() {
  return useQuery({
    queryKey: ['partner', 'projects'],
    queryFn: () => api.get('/partner/projects').then(r => r.data.projects ?? r.data ?? []),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePartnerEarnings() {
  return useQuery({
    queryKey: ['partner', 'earnings'],
    queryFn: () => api.get('/partner/earnings').then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePartnerDeliverables() {
  return useQuery({
    queryKey: ['partner', 'deliverables'],
    queryFn: () => api.get('/partner/deliverables').then(r => r.data.deliverables ?? []),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePartnerDocuments() {
  return useQuery({
    queryKey: ['partner', 'documents'],
    queryFn: () => api.get('/documents').then(r => r.data.documents ?? []),
    staleTime: 1000 * 60 * 5,
  })
}
