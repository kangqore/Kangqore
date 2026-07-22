import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { NavLink, Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom'
import RelayPage from '@features/relay/pages/RelayPage'
import {
  LayoutGrid, FolderOpen, FileText, Briefcase,
  Calendar, CheckSquare, Headphones, GitPullRequest,
  MessageSquare, BarChart2, LogOut, ChevronLeft,
  Bell, ChevronRight, Phone, Search, Settings, User,
  ChevronDown, SlidersHorizontal, BookOpen, Package, Brain,
  X, Clock, Crosshair, Sun, Moon, Maximize2, Minimize2, Plus, Eye, Home, ArrowUpRight, Building2, Check, Loader2
} from 'lucide-react'
import {
  ChatCircleDotsIcon, CpuIcon, UsersThreeIcon, CrownSimpleIcon,
  UserCircleIcon, HandshakeIcon, TrendUpIcon, SquaresFourIcon, GlobeIcon, LightningIcon, TargetIcon
} from '@phosphor-icons/react'
import { cn } from '@design-system/cn'
import { Avatar } from '@design-system/components/Avatar'
import { Tooltip } from '@design-system/components/Tooltip'
import {
  DropdownRoot, DropdownTrigger, DropdownContent,
  DropdownItem, DropdownSeparator, DropdownPortal,
} from '@design-system/components/Dropdown'
import { useQuery } from '@tanstack/react-query'
import { api, isDemo } from '@lib/api'
import { QuickCreateModal, type CreateMode } from '../../components/QuickCreateModal'
import { ModuleShell }             from '@components/ModuleShell'
import { Rail }                    from '@components/shell/Rail'
import { ClientDashboard }         from './pages/ClientDashboard'
import { ClientProjects }          from './pages/ClientProjects'
import { ClientInvoices }          from './pages/ClientInvoices'
import { ClientDocuments }         from './pages/ClientDocuments'
import { ClientMeetings }          from './pages/ClientMeetings'
import { ClientTasks }             from './pages/ClientTasks'
import { ClientSupport }           from './pages/ClientSupport'
import { ClientChangeRequests }    from './pages/ClientChangeRequests'
import { ClientFeedback }          from './pages/ClientFeedback'
import { ClientExecutiveReport }   from './pages/ClientExecutiveReport'
import { ClientSettings }          from './pages/ClientSettings'
import { ClientKnowledge }         from './pages/ClientKnowledge'
import { ClientServices }          from './pages/ClientServices'
import { ClientWaanda }            from './pages/ClientWaanda'
import { BidsIntakePage }          from './pages/BidsIntakePage'
import { useAuthStore }            from '@store/auth'
import {
  useClientNotifications,
  useClientActions,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  type ClientNotif,
} from './useClientData'

const ACCENT = '#2564ea'
const BASE   = '/kangqore-view/client'

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin', CLIENT: 'Client', PARTNER: 'Partner',
  INVESTOR: 'Investor', JOB_SEEKER: 'Applicant',
}

type ClientNavItem = { path: string; label: string; icon: React.ComponentType<any>; end: boolean; badge: number; badgeDanger?: boolean }

// ── Notification meta ──────────────────────────────────────────────────────────


const NOTIF_META: Record<string, { color: string; bg: string; border: string; label: string }> = {
  kimmp:     { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', label: 'WAANDA'    },
  invoice:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)',  label: 'Finance'   },
  milestone: { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',  label: 'Delivery'  },
  ticket:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)',  label: 'Support'   },
  info:      { color: 'var(--os-text-2)', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', label: 'Update'    },
}

// ── Nav groups ─────────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: 'OVERVIEW',
    color: '#2564ea',
    items: [
      { path: '',                label: 'Dashboard',  icon: LayoutGrid,     end: true,  badge: 0 },
    ],
  },
  {
    label: 'WORK',
    color: '#7f53f9',
    items: [
      { path: 'projects',        label: 'Projects',   icon: Briefcase,      end: false, badge: 0 },
      { path: 'tasks',           label: 'Tasks',      icon: CheckSquare,    end: false, badge: 0 },
      { path: 'meetings',        label: 'Meetings',   icon: Calendar,       end: false, badge: 0 },
    ],
  },
  {
    label: 'FINANCE',
    color: '#fdab3d',
    items: [
      { path: 'invoices',        label: 'Invoices',   icon: FileText,       end: false, badge: 0, badgeDanger: true },
      { path: 'documents',       label: 'Documents',  icon: FolderOpen,     end: false, badge: 0 },
    ],
  },
  {
    label: 'SERVICES',
    color: '#00c875',
    items: [
      { path: 'services',        label: 'Services',   icon: Package,        end: false, badge: 0 },
    ],
  },
  {
    label: 'MESSAGING',
    color: '#7f53f9',
    items: [
      { path: 'relay',           label: 'RELAY',      icon: ChatCircleDotsIcon, end: false, badge: 0 },
    ],
  },
  {
    label: 'SUPPORT',
    color: '#2564ea',
    items: [
      { path: 'support',         label: 'Support',    icon: Headphones,     end: false, badge: 0 },
      { path: 'change-requests', label: 'Changes',    icon: GitPullRequest, end: false, badge: 0 },
      { path: 'feedback',        label: 'Feedback',   icon: MessageSquare,  end: false, badge: 0 },
      { path: 'knowledge',       label: 'Knowledge',  icon: BookOpen,       end: false, badge: 0 },
    ],
  },
  {
    label: 'INSIGHTS',
    color: '#7f53f9',
    items: [
      { path: 'waanda',          label: 'WAANDA',     icon: Brain,          end: false, badge: 0 },
      { path: 'report',          label: 'Report',     icon: BarChart2,      end: false, badge: 0 },
      { path: 'bids',            label: 'BIDS™',      icon: Crosshair,      end: false, badge: 0 },
    ],
  },
  {
    label: 'ACCOUNT',
    color: 'var(--os-text-2)',
    items: [
      { path: 'settings',        label: 'Settings',   icon: SlidersHorizontal, end: false, badge: 0 },
    ],
  },
]

// ── Sidebar ───────────────────────────────────────────────────────────────────

function ClientSidebar({ collapsed, onToggle, badgeCounts = {} }: {
  collapsed: boolean
  onToggle: () => void
  badgeCounts?: Record<string, number>
}) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <aside
      className="flex flex-col h-full flex-shrink-0 transition-all duration-200 select-none relative z-20 bg-[var(--os-sidebar-bg)] border-r border-[var(--os-border)]"
      style={{ width: collapsed ? 56 : 220 }}>

      {/* Logo area removed, now in ClientTopbar */}

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <div className="flex items-center gap-1.5 px-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: group.color }} />
                <span className="text-[9px] font-bold tracking-widest" style={{ color: `${group.color}80` }}>
                  {group.label}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {(group.items as ClientNavItem[]).map(item => (
                <NavLink
                  key={item.path}
                  to={item.path === '' ? BASE : `${BASE}/${item.path}`}
                  end={item.end}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 rounded-xl transition-all duration-150 relative',
                    collapsed ? 'h-9 w-9 mx-auto justify-center px-0' : 'px-3 py-2',
                    isActive ? 'text-white' : 'hover:text-[#323338] dark:hover:text-slate-200',
                  )}
                  style={({ isActive }) => isActive
                    ? { background: `${ACCENT}18`, border: `1px solid ${ACCENT}30` }
                    : { border: '1px solid transparent' }
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className="w-4 h-4 flex-shrink-0"
                        style={{ color: isActive ? ACCENT : undefined } as React.CSSProperties} />
                      {!collapsed && (
                        <>
                          <span className="text-[13px] font-medium truncate flex-1">{item.label}</span>
                          {(badgeCounts[item.path] ?? item.badge) > 0 && (
                            <span className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{
                                background: item.badgeDanger ? '#e2445c' : ACCENT,
                                color: '#fff',
                              }}>
                              {badgeCounts[item.path] ?? item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {/* Collapsed badge dot */}
                      {collapsed && (badgeCounts[item.path] ?? item.badge) > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full"
                          style={{ background: item.badgeDanger ? '#e2445c' : '#fdab3d' }} />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Account manager card */}
      {!collapsed && (
        <div className="flex-shrink-0 mx-2 mb-2 rounded-xl p-3"
          style={{ background: 'rgba(37,100,234,0.06)', border: '1px solid rgba(37,100,234,0.15)' }}>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: `${ACCENT}80` }}>
            Your Account Manager
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
              style={{ background: ACCENT }}>
              RN
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>Ravi Nair</p>
              <p className="text-[10px] text-slate-500">Delivery Lead</p>
            </div>
            <button className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 hover:text-white transition-colors flex-shrink-0"
              style={{ background: 'var(--os-surface)' }} title="Call Ravi">
              <Phone className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* User + sign out removed, now in ClientTopbar */}
    </aside>
  )
}

// ── Notifications panel ───────────────────────────────────────────────────────

function NotificationsPanel({
  isOpen,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClose,
}: {
  isOpen: boolean
  notifications: ClientNotif[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onClose: () => void
}) {
  // Optimistic local state so the UI feels instant
  const [notifs, setNotifs] = useState<ClientNotif[]>(notifications)
  useEffect(() => { setNotifs(notifications) }, [notifications])
  const unread = notifs.filter(n => !n.read).length

  const markRead = (id: string) => {
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
    onMarkRead(id)
  }

  const markAllRead = () => {
    setNotifs(ns => ns.map(n => ({ ...n, read: true })))
    onMarkAllRead()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in-0 duration-200" onClick={onClose} />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--os-bg-dropdown, var(--os-surface-1, #ffffff))', borderLeft: '1px solid var(--os-border)', boxShadow: '-20px 0 48px rgba(0,0,0,0.3)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--os-surface-0)' }}>
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Notifications</span>
            {unread > 0 && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white">{unread}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[11px] text-slate-500 hover:text-blue-400 transition-colors">
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-[#050810]/5 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {notifs.map(n => {
            const meta = NOTIF_META[n.type]
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className="w-full text-left px-4 py-3.5 transition-all relative"
                style={{ borderBottom: '1px solid var(--os-surface-0)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--os-surface-0)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                {/* Unread dot */}
                {!n.read && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                )}
                <div className="pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
                    >
                      {meta.label}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-600">
                      <Clock className="w-2.5 h-2.5" />{n.time}
                    </span>
                  </div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: n.read ? 'var(--os-text-2)' : 'var(--os-text-1)' }}>{n.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{n.body}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4" style={{ borderTop: '1px solid var(--os-surface-0)' }}>
          <p className="text-[11px] text-slate-600 text-center">Notifications from WAANDA, Finance, and Delivery</p>
        </div>
      </div>
    </>
  )
}

const PORTALS = [
  { id: 'admin',     label: 'Admin Dashboard',  path: '/kangqore-view/admin',     icon: CpuIcon,          color: '#2564ea', roles: ['ADMIN'] },
  { id: 'team',      label: 'Team Portal',       path: '/kangqore-view/team',      icon: UsersThreeIcon,   color: '#8B5CF6', roles: ['TEAM', 'ADMIN'] },
  { id: 'executive', label: 'Executive Portal',  path: '/kangqore-view/executive', icon: CrownSimpleIcon,  color: '#F59E0B', roles: ['EXECUTIVE', 'ADMIN'] },
  { id: 'client',    label: 'Client Portal',     path: '/kangqore-view/client',    icon: UserCircleIcon,   color: '#14B8A6', roles: ['CLIENT', 'ADMIN'] },
  { id: 'partner',   label: 'Partner Portal',    path: '/kangqore-view/partner',   icon: HandshakeIcon,    color: '#EC4899', roles: ['PARTNER', 'ADMIN'] },
  { id: 'investor',  label: 'Investor Portal',   path: '/kangqore-view/investor',  icon: TrendUpIcon,      color: '#10B981', roles: ['INVESTOR', 'ADMIN'] },
  { id: 'analyst',   label: 'Analyst Portal',    path: '/kangqore-view/analyst',   icon: SquaresFourIcon,  color: '#06B6D4', roles: ['ANALYST', 'ADMIN'] },
] as const

const NEW_ACTIONS = [
  { label: 'New Lead',    icon: LightningIcon,   mode: 'lead' as CreateMode },
  { label: 'New Project', icon: SquaresFourIcon, mode: 'project' as CreateMode },
  { label: 'New Goal',    icon: TargetIcon,      mode: 'goal' as CreateMode },
  { label: 'Ask WAANDA',  icon: CpuIcon,         path: '/kangqore-view/client/waanda' },
]

function UserMonogram({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0] ?? '').join('').slice(0, 2).toUpperCase()
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white select-none"
      style={{
        width: size, height: size,
        fontSize: size * 0.38,
        background: 'linear-gradient(135deg, #2564ea 0%, #0ea5e9 100%)',
      }}
    >
      {initials}
    </div>
  )
}

const PANEL_STYLE = {
  background: 'var(--os-bg-dropdown, var(--os-surface-1, #ffffff))',
  border: '1px solid var(--os-border)',
  boxShadow: 'var(--os-shadow-md)',
} as const

function ClientTopbar({
  notifications,
  onMarkRead,
  onMarkAllRead,
  collapsed,
  onToggle,
}: {
  notifications: ClientNotif[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  collapsed: boolean
  onToggle: () => void
}) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout, currentOrg, switchOrg } = useAuthStore()
  const [userOpen,      setUserOpen]      = useState(false)
  const [notifOpen,     setNotifOpen]     = useState(false)
  const [switcherOpen,  setSwitcherOpen]  = useState(false)
  const [createMode,    setCreateMode]    = useState<CreateMode>(null)
  const [isFullscreen,  setIsFullscreen]  = useState(false)
  const [isDark,        setIsDark]        = useState(() => document.documentElement.classList.contains('dark'))
  const userRef = useRef<HTMLDivElement>(null)
  const switcherRef = useRef<HTMLDivElement>(null)
  const newRef = useRef<HTMLDivElement>(null)

  const toggleTheme = useCallback(() => {
    const nowDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('kq-theme', nowDark ? 'dark' : 'light')
    setIsDark(nowDark)
  }, [])

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
      else await document.exitFullscreen()
    } catch {}
  }, [])

  useEffect(() => {
    if (!userOpen) return
    function onClickOutside(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [userOpen])

  useEffect(() => {
    if (!switcherOpen) return
    const onClick = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) setSwitcherOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [switcherOpen])

  const unreadCount = notifications.filter(n => !n.read).length

  const { data: orgsData } = useQuery({
    queryKey: ['my-orgs'],
    queryFn:  () => api.get('/orgs').then(r => r.data.orgs ?? []),
    enabled:  !isDemo(),
    staleTime: 60_000,
  })
  const myOrgs: Array<{ id: string; name: string; slug: string; logoUrl: string | null; role: string }> = orgsData ?? []
  const [switchingOrgId, setSwitchingOrgId] = useState<string | null>(null)

  const allItems = NAV_GROUPS.flatMap(g => g.items)
  const current  = allItems.find(n =>
    pathname === (n.path === '' ? BASE : `${BASE}/${n.path}`)
  ) ?? allItems[0]

  const displayName  = user?.name  ?? 'Client'
  const displayEmail = user?.email ?? ''
  const roleLabel = ROLE_LABEL[user?.role ?? ''] ?? (user?.role ?? 'Client')

  const accessiblePortals = PORTALS.filter(p =>
    user?.role === 'ADMIN' || (p.roles as readonly string[]).includes(user?.role ?? '')
  )

  const userDropdown = (align: 'start' | 'end' = 'end') => (
    <DropdownContent
      align={align}
      sideOffset={8}
      className="z-50 min-w-[210px] rounded-xl p-1.5 animate-in fade-in-0 zoom-in-95 duration-150"
      style={PANEL_STYLE}
    >
      <div className="flex items-center gap-2.5 px-2.5 py-2.5 mb-1" style={{ borderBottom: '1px solid var(--os-border)' }}>
        <UserMonogram name={displayName} size={32} />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[var(--os-text-1)] leading-none mb-1 truncate">{displayName}</p>
          <p className="text-[11px] text-slate-500 truncate leading-none">{displayEmail}</p>
        </div>
      </div>
      <div className="px-2.5 pt-2 pb-1.5 mb-1" style={{ borderBottom: '1px solid var(--os-border)' }}>
        <span
          className="inline-block text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded-md"
          style={{ background: 'var(--os-blue-dim)', color: 'var(--os-blue)', border: '1px solid var(--os-border)' }}
        >
          {roleLabel}
        </span>
      </div>
      <DropdownItem
        onClick={() => navigate(`${BASE}/settings`)}
        className="flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-[var(--os-text-2)] rounded-lg cursor-pointer outline-none hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[var(--os-text-1)] transition-colors"
      >
        <User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        Profile
      </DropdownItem>
      <DropdownItem
        onClick={() => navigate(`${BASE}/settings`)}
        className="flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-[var(--os-text-2)] rounded-lg cursor-pointer outline-none hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[var(--os-text-1)] transition-colors"
      >
        <Settings className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        Settings
      </DropdownItem>
      <DropdownSeparator className="my-1 h-px mx-1" style={{ background: 'var(--os-border)' }} />
      <DropdownItem
        onClick={logout}
        className="flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-red-500 rounded-lg cursor-default outline-none hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
        Sign out
      </DropdownItem>
    </DropdownContent>
  )

  return (
    <>
    <header
      className="flex-shrink-0 h-[60px] flex items-center justify-between w-full px-6 relative"
      style={{
        zIndex: 50,
        background: 'var(--os-topbar-bg, var(--os-card))',
        borderBottom: '1px solid var(--os-topbar-border, var(--os-border))',
      }}
    >
      {/* LEFT AREA: Logo */}
      <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 select-none group">
        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-transform duration-300 group-hover:scale-105 flex items-center justify-center bg-gradient-to-tr from-[#2564ea] to-[#0ea5e9]">
          <img
            src="/favicon.jpg"
            alt="Kangqore"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <Brain className="w-4 h-4 text-white absolute" style={{ zIndex: -1 }} />
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-black tracking-tight leading-none text-[var(--os-text-1)]">
            Kangqore
          </span>
          <span className="text-[10px] font-semibold text-[#2564ea] tracking-wider uppercase leading-none mt-0.5">
            VIEW
          </span>
        </div>
      </Link>

      {/* CENTER AREA: Switcher & Breadcrumbs + Search capsule */}
      <div className="flex-1 flex items-center justify-center gap-4 max-w-[580px] mx-4 hidden md:flex min-w-0">
        {/* Switcher & Breadcrumbs */}
        <div className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
          <div className="relative" ref={switcherRef}>
            <button
              onClick={() => setSwitcherOpen(o => !o)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all"
              style={{
                background: 'rgba(37, 100, 234, 0.08)',
                color: '#2564ea',
                border: '1px solid rgba(37, 100, 234, 0.15)',
              }}
            >
              CLIENT
              <ChevronDown className="w-3 h-3" />
            </button>

            {switcherOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150" style={PANEL_STYLE}>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--os-text-2)] px-3 pb-2">
                  Switch Portal
                </p>
                {accessiblePortals.map(portal => {
                  const Icon = portal.icon
                  const isActive = portal.id === 'client'
                  return (
                    <button
                      key={portal.id}
                      onClick={() => { navigate(portal.path); setSwitcherOpen(false) }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-[var(--os-surface-0)] text-left"
                      style={isActive ? { background: `${portal.color}10`, outline: `1px solid ${portal.color}30` } : {}}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${portal.color}18`, border: `1px solid ${portal.color}28` }}
                      >
                        <Icon weight="duotone" className="w-4 h-4" style={{ color: portal.color }} />
                      </div>
                      <span className={`text-[13px] font-semibold flex-1 ${isActive ? 'text-[var(--os-text-1)]' : 'text-[var(--os-text-2)]'}`}>
                        {portal.label}
                      </span>
                      {isActive && (
                        <span
                          className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md flex-shrink-0"
                          style={{ background: `${portal.color}20`, color: portal.color }}
                        >
                          Active
                        </span>
                      )}
                    </button>
                  )
                })}
                {myOrgs.length > 0 && (
                  <div className="mt-2 pt-2 mx-3 border-t border-[var(--os-border)]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--os-text-2)] pb-1.5">
                      Organisation
                    </p>
                    {myOrgs.map(org => {
                      const isActive = currentOrg?.id === org.id
                      return (
                        <button
                          key={org.id}
                          disabled={switchingOrgId !== null}
                          onClick={async () => {
                            if (isActive) return
                            setSwitchingOrgId(org.id)
                            try { await switchOrg(org.id) } finally { setSwitchingOrgId(null) }
                          }}
                          className="flex items-center gap-2.5 w-full py-2 text-[12px] rounded-lg transition-colors hover:bg-[var(--os-surface-0)] px-1 text-left"
                          style={isActive ? { color: '#2564ea' } : { color: 'var(--os-text-2)' }}
                        >
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="flex-1 truncate font-medium">{org.name}</span>
                          {switchingOrgId === org.id
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : isActive && <Check className="w-3 h-3" />}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => { navigate('/kangqore-view/client/settings'); setSwitcherOpen(false) }}
                      className="flex items-center gap-2.5 w-full py-2 text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors px-1 mt-0.5"
                    >
                      <Settings className="w-3 h-3 flex-shrink-0" />
                      Manage organisation
                    </button>
                  </div>
                )}

                <div className="mt-2 pt-2 mx-3 space-y-0.5 border-t border-[var(--os-border)]">
                  <a href="/" className="flex items-center gap-2.5 py-2 text-[12px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors group">
                    <Home className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="flex-1">Back to Kangqore.com</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a href="/login" className="flex items-center gap-2.5 py-2 text-[12px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors group">
                    <GlobeIcon weight="duotone" className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="flex-1">Login Page</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <ChevronRight className="w-3 h-3 text-[var(--os-text-3)] flex-shrink-0" />
          <span className="text-[12px] font-semibold text-[var(--os-text-1)] truncate">{current.label}</span>
        </div>

        {/* Search capsule */}
        <div
          className="flex-1 h-9 flex items-center gap-2.5 px-4 text-[12px] rounded-lg transition-colors min-w-0"
          style={{
            background: 'var(--os-surface-0)',
            border: '1px solid var(--os-border)',
            color: 'var(--os-text-2)',
          }}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--os-text-3)' }} />
          <input
            placeholder="Search..."
            className="flex-1 bg-transparent border-none outline-none text-[12px] text-[var(--os-text-1)] placeholder:text-[var(--os-text-3)]"
          />
          <kbd
            className="hidden lg:flex items-center justify-center text-[9px] font-sans rounded-md px-1.5 py-0.5 leading-none flex-shrink-0"
            style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-2)' }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* RIGHT AREA: Utility cluster, Profile, New (+) action */}
      <div className="flex items-center gap-4">
        {/* Utility Group */}
        <div className="flex items-center gap-1">
          <Tooltip content="Messages" side="bottom">
            <button
              onClick={() => navigate(`/kangqore-view/client/relay`)}
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors"
            >
              <ChatCircleDotsIcon weight="duotone" className="w-[18px] h-[18px]" />
            </button>
          </Tooltip>

          {user?.role === 'ADMIN' && (
            <Tooltip content="Live visitors" side="bottom">
              <div className="relative">
                <button
                  onClick={() => setPresenceOpen(o => !o)}
                  className="relative w-8 h-8 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors"
                >
                  <Eye className="w-[17px] h-[17px]" />
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-green-500 border-2 border-[var(--os-card)] animate-pulse" />
                </button>
              </div>
            </Tooltip>
          )}

          <Tooltip content="Notifications" side="bottom">
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors"
            >
              <Bell className="w-[17px] h-[17px]" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center leading-none"
                  style={{ padding: '0 3px' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </Tooltip>

          <Tooltip content={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} side="bottom">
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-[15px] h-[15px]" /> : <Maximize2 className="w-[15px] h-[15px]" />}
            </button>
          </Tooltip>

          <Tooltip content={isDark ? 'Light mode' : 'Dark mode'} side="bottom">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors"
            >
              {isDark ? <Sun className="w-[15px] h-[15px]" /> : <Moon className="w-[16px] h-[16px]" />}
            </button>
          </Tooltip>

          <Tooltip content="Quick Create" side="bottom">
            <div className="relative" ref={newRef}>
              <button
                onClick={() => setCreateMode('project')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors active:scale-95 flex-shrink-0"
              >
                <Plus className="w-[16px] h-[16px]" />
              </button>
            </div>
          </Tooltip>
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-[var(--os-border)] flex-shrink-0" />

        {/* User profile dropdown */}
        <DropdownRoot>
          <DropdownTrigger asChild>
            <button className="flex items-center gap-2 h-9 px-1.5 rounded-xl hover:bg-[var(--os-surface-0)] transition-colors flex-shrink-0 group">
              <div className="relative flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80"
                  alt={displayName}
                  className="w-[28px] h-[28px] rounded-full object-cover border border-slate-200 dark:border-slate-800"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-white dark:border-black rounded-full" />
              </div>
              <div className="text-left hidden md:block min-w-0">
                <p className="text-[12px] font-bold text-[var(--os-text-1)] leading-none mb-0.5 truncate group-hover:text-[#2564ea] transition-colors">{displayName}</p>
                <p className="text-[9px] text-slate-500 leading-none">{roleLabel}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-3)] group-hover:text-[var(--os-text-2)] transition-colors flex-shrink-0" />
            </button>
          </DropdownTrigger>
          {userDropdown('end')}
        </DropdownRoot>

      </div>
    </header>

    <QuickCreateModal mode={createMode} onClose={() => setCreateMode(null)} />
    <NotificationsPanel
      isOpen={notifOpen}
      notifications={notifications}
      onMarkRead={onMarkRead}
      onMarkAllRead={onMarkAllRead}
      onClose={() => setNotifOpen(false)}
    />
    </>
  )
}

// ── Portal shell ──────────────────────────────────────────────────────────────
import { AmbientBackground } from '../../components/shell/AmbientBackground'

const LIGHT_TOKENS: React.CSSProperties = {
  background:              'linear-gradient(160deg, #f0f4fc 0%, #eaeffa 50%, #f4f7fd 100%)',
  color:                   '#0f1117',
  '--os-bg'             :  '#f0f4fc',
  '--os-surface-0'      :  '#f8faff',
  '--os-surface-1'      :  '#ffffff',
  '--os-surface-2'      :  '#f0f4fd',
  '--os-surface-3'      :  '#e6ecf7',
  '--os-glass'          :  'rgba(255,255,255,0.85)',
  '--os-card'           :  '#ffffff',
  '--os-sidebar-bg'     :  '#ffffff',
  '--os-topbar-bg'      :  '#ffffff',
  '--os-topbar-border'  :  'rgba(37,100,234,0.12)',
  '--os-border'         :  'rgba(37,100,234,0.13)',
  '--os-border-subtle'  :  'rgba(37,100,234,0.07)',
  '--os-border-strong'  :  'rgba(37,100,234,0.24)',
  '--os-text-1'         :  '#0f1117',
  '--os-text-2'         :  '#3d4459',
  '--os-text-3'         :  '#7280a0',
  '--os-text-4'         :  '#a0aec0',
  '--os-shadow-sm'      :  '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(37,100,234,0.04)',
  '--os-shadow-md'      :  '0 4px 16px rgba(37,100,234,0.10), 0 1px 4px rgba(0,0,0,0.05)',
  '--os-shadow-lg'      :  '0 12px 40px rgba(37,100,234,0.14), 0 4px 8px rgba(0,0,0,0.06)',
  '--os-shadow-card'    :  '0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(37,100,234,0.09), 0 0 0 1px rgba(37,100,234,0.10)',
  '--os-shadow-glow'    :  '0 0 24px rgba(37,100,234,0.22)',
  '--os-blue-dim'       :  'rgba(37,100,234,0.09)',
  '--os-cyan-dim'       :  'rgba(74,182,212,0.09)',
} as React.CSSProperties

export function ClientPortal() {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()
  const isRelay  = pathname.includes('/relay')
  const isBids   = pathname.includes('/bids')
  const isWaanda = pathname.includes('/waanda')

  const { data: liveNotifications = [] } = useClientNotifications()
  const { data: actionsData }            = useClientActions()
  const markReadMutation    = useMarkNotificationRead()
  const markAllReadMutation = useMarkAllNotificationsRead()

  const badgeCounts = useMemo(() => {
    const acts: Array<{ type: string }> = (actionsData as { actions?: Array<{ type: string }> })?.actions ?? []
    return {
      support:           acts.filter(a => a.type === 'TICKET').length,
      'change-requests': acts.filter(a => a.type === 'CHANGE_REQUEST').length,
      invoices:          acts.filter(a => a.type === 'INVOICE').length,
    }
  }, [actionsData])

  const portalStyle = isWaanda
    ? { background: '#000000', color: '#e2e8f0' }
    : { ...LIGHT_TOKENS, '--dept-accent': '#14B8A6' }

  return (
    <div className="flex flex-col h-screen overflow-hidden relative" style={portalStyle as React.CSSProperties}>
      {!isWaanda && <AmbientBackground />}
      {!isWaanda && (
        <ClientTopbar
          notifications={liveNotifications}
          onMarkRead={(id) => markReadMutation.mutate(id)}
          onMarkAllRead={() => markAllReadMutation.mutate()}
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
        />
      )}
      <div className="flex flex-1 min-h-0 relative z-10 w-full overflow-hidden">
        <Rail />
        {!isWaanda && <ClientSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} badgeCounts={badgeCounts} />}
        <div className={cn(
          "os-main-content flex flex-col flex-1 min-w-0 overflow-hidden relative z-10 mx-2 md:my-2 md:mr-2 md:rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] shadow-[var(--os-shadow-card)]",
          isWaanda && "!bg-black !m-0 !rounded-none !border-none"
        )}>
        {isBids ? (
          <BidsIntakePage />
        ) : isRelay ? (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <RelayPage />
          </div>
        ) : isWaanda ? (
          <main className="flex-1 overflow-y-auto overflow-x-hidden !bg-black !m-0 !rounded-none !border-none">
            <ModuleShell>
              <Routes>
                <Route path="waanda" element={<ClientWaanda />} />
              </Routes>
            </ModuleShell>
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto">
            <div className="px-6 lg:px-10 py-8 w-full max-w-6xl mx-auto">
              <ModuleShell>
                <Routes>
                  <Route index                     element={<ClientDashboard />}       />
                  <Route path="projects"           element={<ClientProjects />}        />
                  <Route path="meetings"           element={<ClientMeetings />}        />
                  <Route path="tasks"              element={<ClientTasks />}           />
                  <Route path="support"            element={<ClientSupport />}         />
                  <Route path="change-requests"    element={<ClientChangeRequests />}  />
                  <Route path="feedback"           element={<ClientFeedback />}        />
                  <Route path="invoices"           element={<ClientInvoices />}        />
                  <Route path="documents"          element={<ClientDocuments />}       />
                  <Route path="report"             element={<ClientExecutiveReport />} />
                  <Route path="knowledge"          element={<ClientKnowledge />}       />
                  <Route path="services"           element={<ClientServices />}        />
                  <Route path="settings"           element={<ClientSettings />}        />
                  <Route path="bids/*"             element={<BidsIntakePage />}        />
                  <Route path="*"                  element={<Navigate to={BASE} replace />} />
                </Routes>
              </ModuleShell>
            </div>
          </main>
        )}
        </div>
      </div>
    </div>
  )
}
