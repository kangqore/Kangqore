import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

export function useClientProjects() {
  return useQuery({
    queryKey: ['client', 'projects'],
    queryFn: () => api.get('/projects').then(r => r.data.projects ?? []),
    staleTime: 1000 * 60 * 5,
  })
}

export function useClientInvoices() {
  return useQuery({
    queryKey: ['client', 'invoices'],
    queryFn: () => api.get('/invoices').then(r => r.data.invoices ?? []),
    staleTime: 1000 * 60 * 5,
  })
}

export function useClientActions() {
  return useQuery({
    queryKey: ['client', 'actions'],
    queryFn: () => api.get('/client/actions').then(r => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useClientDocuments() {
  return useQuery({
    queryKey: ['client', 'documents'],
    queryFn: () => api.get('/documents').then(r => r.data.documents ?? []),
    staleTime: 1000 * 60 * 5,
  })
}
