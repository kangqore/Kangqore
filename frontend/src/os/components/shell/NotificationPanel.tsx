import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Bell, CheckCheck } from 'lucide-react'
import { cn } from '@design-system/cn'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Avatar } from '@design-system/components/Avatar'
import { Spinner } from '@design-system/components/Spinner'
import { useUIStore } from '@store/ui'
import { api, isDemo } from '@lib/api'
import { getSocket } from '@lib/socket'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface DbNotification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  link?: string
  isRead: boolean
  createdAt: string
}

interface NotificationItem {
  id: string
  type: 'success' | 'warning' | 'info' | 'danger' | 'neutral'
  title: string
  body: string
  time: string
  read: boolean
  user: string
  link?: string
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', type: 'success', title: 'Project delivered',       body: 'Alpha CRM phase 2 marked complete.',        time: '2m ago',  read: false, user: 'Anika Roy'    },
  { id: '2', type: 'warning', title: 'Budget threshold hit',    body: 'Q2 Marketing spend at 90% of allocation.',  time: '18m ago', read: false, user: 'Finance Bot'  },
  { id: '3', type: 'info',    title: 'New lead assigned',       body: 'TechNova Inc. assigned to you via eQORE.',  time: '1h ago',  read: false, user: 'KIMMP'        },
  { id: '4', type: 'danger',  title: 'Risk escalated',          body: 'Sprint 14 scope risk moved to HIGH.',       time: '3h ago',  read: true,  user: 'Dev Team'     },
  { id: '5', type: 'neutral', title: 'Meeting in 30 min',       body: 'Quarterly review with Nexus Partners.',     time: '5h ago',  read: true,  user: 'Calendar'     },
]

function mapNotification(db: DbNotification): NotificationItem {
  const typeMap: Record<DbNotification['type'], NotificationItem['type']> = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'danger',
    INFO: 'info',
  }
  return {
    id: db.id,
    type: typeMap[db.type] ?? 'info',
    title: db.title,
    body: db.message,
    time: dayjs(db.createdAt).fromNow(),
    read: db.isRead,
    user: db.type === 'SUCCESS' ? 'Success Bot' : db.type === 'WARNING' ? 'System Warning' : 'System',
    link: db.link,
  }
}

export function NotificationPanel() {
  const { notificationPanelOpen, closeNotificationPanel } = useUIStore()
  const queryClient = useQueryClient()

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications?limit=20').then(r => r.data.notifications as DbNotification[]),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 2,
  })

  const { mutate: markAllRead } = useMutation({
    mutationFn: () => api.patch('/notifications/mark-all-read'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const { mutate: markRead } = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  useEffect(() => {
    if (isDemo()) return

    const socket = getSocket()
    const handleNewNotification = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }

    socket.on('notification:new', handleNewNotification)
    return () => {
      socket.off('notification:new', handleNewNotification)
    }
  }, [queryClient])

  const notifications = apiData && !isDemo()
    ? apiData.map(mapNotification)
    : MOCK_NOTIFICATIONS

  const unread = notifications.filter(n => !n.read).length

  const handleNotificationClick = (n: NotificationItem) => {
    if (!n.read) {
      markRead(n.id)
    }
    if (n.link) {
      window.location.href = n.link
    }
  }

  return (
    <>
      {/* Backdrop */}
      {notificationPanelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={closeNotificationPanel}
        />
      )}

      {/* Panel */}
      <div className={cn(
        'fixed top-0 right-0 h-screen w-[380px] bg-[#151C2F] border-l border-[#2E2854] z-50 flex flex-col shadow-2xl',
        'transition-transform duration-300 ease-in-out',
        notificationPanelOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2E2854]">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-slate-500" />
            <h2 className="font-semibold text-white text-sm">Notifications</h2>
            {unread > 0 && (
              <Badge variant="brand" size="sm">{unread} new</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" title="Mark all read" onClick={() => markAllRead()}>
              <CheckCheck className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={closeNotificationPanel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2E2854]">
          {isLoading && (
            <div className="flex items-center justify-center p-8 text-sm text-slate-500 gap-2">
              <Spinner size="sm" /> Loading…
            </div>
          )}
          {!isLoading && notifications.length === 0 && (
            <div className="text-center py-12 text-sm text-slate-500">
              No notifications yet.
            </div>
          )}
          {!isLoading && notifications.map(n => (
            <div
              key={n.id}
              className={cn(
                'flex gap-3 px-5 py-4 hover:bg-[#0F172A] transition-colors cursor-pointer',
                !n.read && 'bg-blue-50/40'
              )}
              onClick={() => handleNotificationClick(n)}
            >
              <Avatar name={n.user} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">{n.title}</span>
                  <Badge variant={n.type} size="sm" dot />
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-[11px] text-slate-500 mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#2E2854]">
          <Button variant="ghost" size="sm" className="w-full text-slate-500" onClick={closeNotificationPanel}>
            Close Panel
          </Button>
        </div>
      </div>
    </>
  )
}
