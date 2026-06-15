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

export function useClientMeetings() {
  return useQuery({
    queryKey: ['client', 'meetings'],
    queryFn: () => api.get('/meetings/client').then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useClientTickets() {
  return useQuery({
    queryKey: ['client', 'tickets'],
    queryFn: () => api.get('/tickets').then(r => r.data.tickets ?? []),
    staleTime: 1000 * 60 * 2,
  })
}

export function useClientChangeRequests() {
  return useQuery({
    queryKey: ['client', 'change-requests'],
    queryFn: () => api.get('/change-requests').then(r => r.data.changeRequests ?? []),
    staleTime: 1000 * 60 * 3,
  })
}

export function useClientFeedback() {
  return useQuery({
    queryKey: ['client', 'feedback'],
    queryFn: () => api.get('/feedback').then(r => r.data ?? []),
    staleTime: 1000 * 60 * 10,
  })
}

export function useClientTasks() {
  return useQuery({
    queryKey: ['client', 'tasks'],
    queryFn: () => api.get('/tickets').then(r =>
      (r.data.tickets ?? []).map((t: Record<string, unknown>) => ({
        id:          String(t.id),
        projectName: String(t.projectName ?? t.subject ?? ''),
        title:       String(t.subject ?? t.title ?? ''),
        status:      String(t.status ?? 'pending').toLowerCase().replace('open', 'pending').replace('resolved', 'completed'),
        priority:    String(t.priority ?? 'medium').toLowerCase(),
        assignee:    String((t.client as Record<string, unknown>)?.name ?? 'Client'),
        dueDate:     t.dueDate ? String(t.dueDate).slice(0, 10) : new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        category:    String(t.category ?? 'Review'),
      }))
    ),
    staleTime: 1000 * 60 * 2,
  })
}
