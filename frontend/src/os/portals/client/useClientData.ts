import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export interface ClientNotif {
  id: string
  type: 'kimmp' | 'invoice' | 'milestone' | 'ticket' | 'info'
  title: string
  body: string
  time: string
  read: boolean
  link?: string
}

// Normalized shape returned by /api/client/projects
export interface ClientProject {
  id: string
  name: string
  description: string
  progress: number
  health: 'on-track' | 'at-risk' | 'behind'
  budget: number
  spent: number
  startDate: string
  targetDate: string
  nextMilestone: string
  milestoneDate: string
  status: string
  lead: string
  deliverables: Array<{
    id: string
    title: string
    status: string
    dueDate: string | null
  }>
}

export function useClientProjects() {
  return useQuery({
    queryKey: ['client', 'projects'],
    queryFn: () => api.get('/client/projects').then(r => (r.data.projects ?? []) as ClientProject[]),
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
    queryFn: () => api.get('/feedback').then(r => Array.isArray(r.data) ? r.data : (r.data?.feedback ?? [])),
    staleTime: 1000 * 60 * 10,
  })
}

const TASK_STATUS_MAP: Record<string, string> = {
  todo: 'pending', in_progress: 'in-progress', blocked: 'pending',
  completed: 'done', approved: 'done',
}

export function useClientTasks() {
  return useQuery({
    queryKey: ['client', 'tasks'],
    queryFn: () => api.get('/client/tasks').then(r =>
      (r.data.tasks ?? []).map((t: Record<string, unknown>) => ({
        id:          String(t.id),
        projectName: String((t.project as Record<string, unknown>)?.title ?? ''),
        title:       String(t.title ?? ''),
        status:      TASK_STATUS_MAP[String(t.status ?? 'todo')] ?? 'pending',
        priority:    'medium',
        assignee:    String((t.partner as Record<string, unknown>)?.name ?? 'Kangqore Team'),
        dueDate:     t.dueDate ? String(t.dueDate).slice(0, 10) : null,
        category:    'Task',
      }))
    ),
    staleTime: 1000 * 60 * 2,
  })
}

export interface ClientTeamMember {
  id: string; name: string; role: string; project: string; initials: string; color: string
}

export interface ClientSlaMetric {
  metric: string; target: string; current: string; met: boolean; pct: number
}

export interface ClientWeekItem {
  type: 'milestone' | 'meeting' | 'task'; title: string; date: string
  project: string; urgent: boolean; color: string
}

export interface ClientActivityItem {
  title: string; date: string; color: string
}

export interface ClientEngagement {
  deliveryPace: number; slaCompliance: number; communication: number
  budgetHealth: number; sprintVelocity: number
}

export interface ClientDashboardSummary {
  team: ClientTeamMember[]
  sla: ClientSlaMetric[]
  thisWeek: ClientWeekItem[]
  activity: ClientActivityItem[]
  engagement: ClientEngagement
}

export function useClientDashboardSummary() {
  return useQuery({
    queryKey: ['client', 'dashboard-summary'],
    queryFn: () => api.get('/client/dashboard-summary').then(r => r.data as ClientDashboardSummary),
    staleTime: 1000 * 60 * 2,
  })
}

export function useClientRisks() {
  return useQuery({
    queryKey: ['client', 'risks'],
    queryFn: () => api.get('/client/risks').then(r => r.data.risks ?? []),
    staleTime: 1000 * 60 * 5,
  })
}

export function useClientNotifications() {
  return useQuery<ClientNotif[]>({
    queryKey: ['client', 'notifications'],
    queryFn: () => api.get('/client/notifications').then(r => {
      const raw: Record<string, unknown>[] = r.data.notifications ?? []
      return raw.map(n => {
        const rawType = String(n.type ?? 'info').toLowerCase()
        const type = (['kimmp', 'invoice', 'milestone', 'ticket'] as const).includes(rawType as 'kimmp')
          ? (rawType as ClientNotif['type'])
          : 'info' as const
        return {
          id:    String(n.id),
          type,
          title: String(n.title),
          body:  String(n.message),
          time:  relativeTime(new Date(String(n.createdAt))),
          read:  Boolean(n.isRead),
          link:  n.link ? String(n.link) : undefined,
        }
      })
    }),
    refetchInterval: 30_000,
    staleTime: 0,
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/client/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['client', 'notifications'] }),
  })
}

export interface CRMessage {
  id: string
  senderId: string
  content: string
  createdAt: string
  sender: { id: string; name: string; role: string; avatarUrl?: string }
}

export function useCRMessages(crId: string | null) {
  return useQuery<CRMessage[]>({
    queryKey: ['cr', 'messages', crId],
    queryFn: () => api.get(`/change-requests/${crId}/messages`).then(r => r.data.messages ?? []),
    enabled: !!crId,
    refetchInterval: 10_000,
    staleTime: 0,
  })
}

export function useSendCRMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ crId, content }: { crId: string; content: string }) =>
      api.post(`/change-requests/${crId}/messages`, { content }),
    onSuccess: (_data, { crId }) => qc.invalidateQueries({ queryKey: ['cr', 'messages', crId] }),
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.patch('/client/notifications/read-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['client', 'notifications'] }),
  })
}
