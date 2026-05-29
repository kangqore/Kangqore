import { X, Bell, CheckCheck } from 'lucide-react'
import { cn } from '@design-system/cn'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Avatar } from '@design-system/components/Avatar'
import { useUIStore } from '@store/ui'

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'success' as const, title: 'Project delivered',       body: 'Alpha CRM phase 2 marked complete.',        time: '2m ago',  read: false, user: 'Anika Roy'    },
  { id: '2', type: 'warning' as const, title: 'Budget threshold hit',    body: 'Q2 Marketing spend at 90% of allocation.',  time: '18m ago', read: false, user: 'Finance Bot'  },
  { id: '3', type: 'info'    as const, title: 'New lead assigned',       body: 'TechNova Inc. assigned to you via eQORE.',  time: '1h ago',  read: false, user: 'KIMMP'        },
  { id: '4', type: 'danger'  as const, title: 'Risk escalated',          body: 'Sprint 14 scope risk moved to HIGH.',       time: '3h ago',  read: true,  user: 'Dev Team'     },
  { id: '5', type: 'neutral' as const, title: 'Meeting in 30 min',       body: 'Quarterly review with Nexus Partners.',     time: '5h ago',  read: true,  user: 'Calendar'     },
]

export function NotificationPanel() {
  const { notificationPanelOpen, closeNotificationPanel } = useUIStore()
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length

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
        'fixed top-0 right-0 h-screen w-[380px] bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl',
        'transition-transform duration-300 ease-in-out',
        notificationPanelOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-slate-600" />
            <h2 className="font-semibold text-slate-900 text-sm">Notifications</h2>
            {unread > 0 && (
              <Badge variant="brand" size="sm">{unread} new</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" title="Mark all read">
              <CheckCheck className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={closeNotificationPanel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {MOCK_NOTIFICATIONS.map(n => (
            <div
              key={n.id}
              className={cn(
                'flex gap-3 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer',
                !n.read && 'bg-purple-50/40'
              )}
            >
              <Avatar name={n.user} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900 truncate">{n.title}</span>
                  <Badge variant={n.type} size="sm" dot />
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100">
          <Button variant="ghost" size="sm" className="w-full text-slate-500">
            View all notifications
          </Button>
        </div>
      </div>
    </>
  )
}
