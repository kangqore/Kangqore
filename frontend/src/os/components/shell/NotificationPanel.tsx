import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Bell, CheckCheck, AlertTriangle, CheckCircle2, Info,
  Zap, Shield, Brain, BellOff,
} from 'lucide-react'
import { useUIStore } from '@store/ui'
import { useKIMMPStore } from '@store/kimmp'
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
  type: 'success' | 'warning' | 'info' | 'danger'
  title: string
  body: string
  time: string
  createdAt: string
  read: boolean
  source: string
  link?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', type: 'success', title: 'Project delivered',    body: 'Alpha CRM phase 2 marked complete.',       time: '2m ago',  createdAt: new Date(Date.now() - 2*60000).toISOString(),   read: false, source: 'WAANDA'  },
  { id: '2', type: 'warning', title: 'Budget threshold hit', body: 'Q2 Marketing spend at 90% of allocation.', time: '18m ago', createdAt: new Date(Date.now() - 18*60000).toISOString(),  read: false, source: 'Finance' },
  { id: '3', type: 'info',    title: 'New lead assigned',    body: 'TechNova Inc. assigned to you via eQORE.', time: '1h ago',  createdAt: new Date(Date.now() - 3600000).toISOString(),   read: false, source: 'WAANDA'   },
  { id: '4', type: 'danger',  title: 'Risk escalated',       body: 'Sprint 14 scope risk moved to HIGH.',      time: '3h ago',  createdAt: new Date(Date.now() - 3*3600000).toISOString(), read: true,  source: 'AEGIS'   },
  { id: '5', type: 'info',    title: 'Meeting in 30 min',    body: 'Quarterly review with Nexus Partners.',    time: '5h ago',  createdAt: new Date(Date.now() - 5*3600000).toISOString(), read: true,  source: 'System'  },
]

function mapNotification(db: DbNotification): NotificationItem {
  const typeMap: Record<DbNotification['type'], NotificationItem['type']> = {
    SUCCESS: 'success', WARNING: 'warning', ERROR: 'danger', INFO: 'info',
  }
  const title = db.title ?? ''
  const source = title.startsWith('AEGIS') ? 'AEGIS'
    : title.startsWith('WAANDA') || title.startsWith('WAANDA') ? 'WAANDA'
    : db.type === 'SUCCESS' ? 'System'
    : db.type === 'WARNING' ? 'System'
    : 'System'

  return {
    id: db.id,
    type: typeMap[db.type] ?? 'info',
    title: db.title,
    body: db.message,
    time: dayjs(db.createdAt).fromNow(),
    createdAt: db.createdAt,
    read: db.isRead,
    source,
    link: db.link,
  }
}

const TYPE_CONFIG = {
  danger:  { icon: AlertTriangle, color: '#ef4444', bar: 'bg-red-500'    },
  warning: { icon: AlertTriangle, color: '#f59e0b', bar: 'bg-amber-500'  },
  success: { icon: CheckCircle2,  color: '#10b981', bar: 'bg-emerald-500' },
  info:    { icon: Info,          color: 'var(--os-text-2)', bar: 'bg-[var(--os-text-2)]'   },
}

const SOURCE_ICON: Record<string, React.ElementType> = {
  AEGIS:   Shield,
  KIMMP:   Brain,
  WAANDA:  Brain,
  Finance: Zap,
  System:  Bell,
}

function isToday(iso: string) {
  return dayjs(iso).isSame(dayjs(), 'day')
}

// ─── Single notification row ──────────────────────────────────────────────────

function NotifRow({ n, onClick }: { n: NotificationItem; onClick: () => void }) {
  const cfg   = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.info
  const Icon  = cfg.icon
  const SIcon = SOURCE_ICON[n.source] ?? Bell

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      className={`relative flex gap-3 px-5 py-4 cursor-pointer group transition-colors duration-150 ${
        n.read ? 'hover:bg-white/[2%]' : 'bg-white/[3%] hover:bg-white/[5%]'
      }`}
    >
      {/* Left severity bar */}
      <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full ${n.read ? 'opacity-0' : cfg.bar}`} />

      {/* Type icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}20` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p className={`text-xs font-semibold leading-snug truncate ${n.read ? 'text-slate-400' : 'text-slate-100'}`}>
            {n.title}
          </p>
          <span className="text-[10px] text-slate-600 whitespace-nowrap flex-shrink-0 pt-px">{n.time}</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{n.body}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <SIcon className="w-2.5 h-2.5 text-slate-700 flex-shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-700">{n.source}</span>
        </div>
      </div>

      {/* Unread dot */}
      {!n.read && (
        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-2" />
      )}
    </motion.div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function NotificationPanel() {
  const { notificationPanelOpen, closeNotificationPanel } = useUIStore()
  const queryClient = useQueryClient()

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications?limit=30').then(r => r.data.notifications as DbNotification[]),
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
    const handle = () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
    socket.on('notification:new', handle)

    // Hot visitor alerts — prepend as ephemeral local notifications
    const onHotAlert = (data: { message: string; visitorId: string }) => {
      queryClient.setQueryData<any[]>(['notifications'], (prev = []) => [{
        id:        `hot-${Date.now()}`,
        title:     '🔴 Hot Visitor',
        message:   data.message,
        type:      'ALERT',
        isRead:    false,
        read:      false,
        createdAt: new Date().toISOString(),
        link:      `/kangqore-view/admin/visitors`,
      }, ...prev.slice(0, 49)])
    }
    socket.on('visitor:hot:alert', onHotAlert)

    // eQORE → KIMMP signals — push into KIMMP store as live insights
    const onEqoreSignal = (data: {
      type: 'LEAD_CAPTURE' | 'BOOKING_INTENT' | 'DEEP_ENGAGEMENT'
      conversationId: string
      visitorUuid: string | null
      intent: string
      messageCount: number
      timestamp: string
    }) => {
      const { addLiveSignal } = useKIMMPStore.getState()
      const titles: Record<string, string> = {
        LEAD_CAPTURE:    'eQORE captured a new lead',
        BOOKING_INTENT:  'eQORE visitor requesting consultation',
        DEEP_ENGAGEMENT: 'eQORE deep engagement detected',
      }
      const impacts: Record<string, string> = {
        LEAD_CAPTURE:    'Warm inbound',
        BOOKING_INTENT:  'Booking intent',
        DEEP_ENGAGEMENT: `${data.messageCount} turns`,
      }
      addLiveSignal({
        id:         `eqore-${data.conversationId}`,
        type:       'reactive',
        category:   data.type === 'LEAD_CAPTURE' ? 'revenue' : data.type === 'BOOKING_INTENT' ? 'ops' : 'opportunity',
        priority:   data.type === 'DEEP_ENGAGEMENT' ? 'medium' : 'high',
        module:     'Leads',
        title:      titles[data.type] ?? 'eQORE signal',
        summary:    `Intent: ${data.intent || '—'} · ${data.messageCount} message${data.messageCount !== 1 ? 's' : ''}`,
        detail:     `Conversation ${data.conversationId}${data.visitorUuid ? ` · Visitor ${data.visitorUuid.slice(0, 8)}` : ''}`,
        action:     'Open transcript or visitor profile to review and respond.',
        confidence: 88,
        impact:     impacts[data.type] ?? '—',
        createdAt:  data.timestamp,
      })
    }
    socket.on('kimmp:signal:eqore', onEqoreSignal)

    return () => {
      socket.off('notification:new', handle)
      socket.off('visitor:hot:alert', onHotAlert)
      socket.off('kimmp:signal:eqore', onEqoreSignal)
    }
  }, [queryClient])

  const notifications: NotificationItem[] = apiData && !isDemo()
    ? apiData.map(mapNotification)
    : MOCK_NOTIFICATIONS

  const unread = notifications.filter(n => !n.read).length
  const today   = notifications.filter(n => isToday(n.createdAt))
  const earlier = notifications.filter(n => !isToday(n.createdAt))

  const handleClick = (n: NotificationItem) => {
    if (!n.read) markRead(n.id)
    if (n.link) window.location.href = n.link
  }

  return (
    <>
      {notificationPanelOpen && (
        <div className="fixed inset-0 z-40" onClick={closeNotificationPanel} />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-[360px] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          notificationPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(10,12,18,0.97)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-200">Notifications</h2>
            {unread > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 ring-1 ring-white/10">
                {unread} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unread > 0 && (
              <button
                onClick={() => markAllRead()}
                title="Mark all read"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={closeNotificationPanel}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-slate-700 border-t-slate-400 animate-spin" />
              <p className="text-[11px] text-slate-600">Loading…</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center px-8">
              <BellOff className="w-8 h-8 text-slate-800" />
              <p className="text-xs font-semibold text-slate-600">No notifications</p>
              <p className="text-[10px] text-slate-700 leading-relaxed">You're all caught up. Activity from AEGIS, KIMMP, and the OS will appear here.</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {today.length > 0 && (
                <>
                  <div className="px-5 pt-4 pb-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-700">Today</p>
                  </div>
                  {today.map(n => (
                    <NotifRow key={n.id} n={n} onClick={() => handleClick(n)} />
                  ))}
                </>
              )}
              {earlier.length > 0 && (
                <>
                  <div className="px-5 pt-4 pb-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-700">Earlier</p>
                  </div>
                  {earlier.map(n => (
                    <NotifRow key={n.id} n={n} onClick={() => handleClick(n)} />
                  ))}
                </>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={closeNotificationPanel}
            className="w-full text-[11px] font-medium text-slate-600 hover:text-slate-400 py-1.5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}
