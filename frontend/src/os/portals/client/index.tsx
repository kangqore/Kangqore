import { useState, useRef, useEffect } from 'react'
import { NavLink, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutGrid, FolderOpen, FileText, Briefcase,
  Calendar, CheckSquare, Headphones, GitPullRequest,
  MessageSquare, BarChart2, LogOut, ChevronLeft,
  Bell, ChevronRight, Phone, Search, Settings, User,
  ChevronDown, SlidersHorizontal, BookOpen, Package, Brain,
  AlertTriangle, X, Clock,
} from 'lucide-react'
import { cn } from '@design-system/cn'
import { Avatar } from '@design-system/components/Avatar'
import { ModuleShell }             from '@components/ModuleShell'
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
import { useAuthStore }            from '@store/auth'

const ACCENT = '#2564ea'
const BASE   = '/kangqore-view/client'

// ── Mock notifications ─────────────────────────────────────────────────────────

type NotifType = 'kimmp' | 'invoice' | 'milestone' | 'ticket'

interface ClientNotif {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
}

const MOCK_NOTIFS: ClientNotif[] = [
  { id: 'n1', type: 'kimmp',     title: 'WAANDA: delivery risk detected',           body: 'Project Phoenix milestone is 3 days from a potential breach. WAANDA recommends a sync with your delivery lead.',           time: '2 hours ago',  read: false },
  { id: 'n2', type: 'invoice',   title: 'Invoice INV-2026-042 due in 7 days',       body: 'Payment of ₹3,40,000 is due on 29 Jun 2026. Please arrange bank transfer to avoid a late payment notice.',               time: '1 day ago',    read: false },
  { id: 'n3', type: 'milestone', title: 'Phase 2 Delivery — milestone completed',   body: 'Your team has confirmed Phase 2 delivery as complete. Your Executive Report has been updated to reflect this milestone.',   time: '2 days ago',   read: true  },
  { id: 'n4', type: 'ticket',    title: 'Support ticket #TK-001 resolved',          body: 'The staging environment issue (500 error on patient login) has been resolved and confirmed by your UAT team.',             time: '3 days ago',   read: true  },
  { id: 'n5', type: 'kimmp',     title: 'WAANDA: AR health signal',                 body: 'Accounts receivable aging has increased by 18% this month. WAANDA recommends reviewing INV-2026-038 before end of week.',  time: '4 days ago',   read: true  },
  { id: 'n6', type: 'milestone', title: 'Upcoming: UAT signoff due in 5 days',      body: 'UAT signoff is due on 28 Jun 2026. Please ensure your team is available and the test plan is finalised.',                  time: '5 days ago',   read: true  },
]

const NOTIF_META: Record<NotifType, { color: string; bg: string; border: string; label: string }> = {
  kimmp:     { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', label: 'WAANDA'    },
  invoice:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)',  label: 'Finance'   },
  milestone: { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',  label: 'Delivery'  },
  ticket:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)',  label: 'Support'   },
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
      { path: 'tasks',           label: 'Tasks',      icon: CheckSquare,    end: false, badge: 3 },
      { path: 'meetings',        label: 'Meetings',   icon: Calendar,       end: false, badge: 0 },
    ],
  },
  {
    label: 'FINANCE',
    color: '#fdab3d',
    items: [
      { path: 'invoices',        label: 'Invoices',   icon: FileText,       end: false, badge: 1, badgeDanger: true },
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
    label: 'SUPPORT',
    color: '#2564ea',
    items: [
      { path: 'support',         label: 'Support',    icon: Headphones,     end: false, badge: 2 },
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
    ],
  },
  {
    label: 'ACCOUNT',
    color: '#64748b',
    items: [
      { path: 'settings',        label: 'Settings',   icon: SlidersHorizontal, end: false, badge: 0 },
    ],
  },
]

// ── Sidebar ───────────────────────────────────────────────────────────────────

function ClientSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <aside
      className="flex flex-col h-full flex-shrink-0 transition-all duration-200 select-none bg-slate-900/40 backdrop-blur-2xl relative z-20"
      style={{ width: collapsed ? 56 : 220, borderRight: '1px solid rgba(255,255,255,0.1)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-3 h-14 flex-shrink-0"
        style={{ borderBottom: '1px solid #1f2a4a' }}>
        <button onClick={() => navigate(BASE)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 transition-transform hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}88)`, boxShadow: `0 0 14px ${ACCENT}40` }}>
          K
        </button>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-none truncate">Kangqore</p>
            <p className="text-[10px] mt-0.5 truncate" style={{ color: `${ACCENT}aa` }}>Client Portal</p>
          </div>
        )}
        <button onClick={onToggle}
          className="w-6 h-6 flex items-center justify-center rounded-md transition-colors flex-shrink-0 text-slate-600 hover:text-slate-300"
          style={{ marginLeft: collapsed ? 'auto' : undefined }}>
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

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
              {group.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path === '' ? BASE : `${BASE}/${item.path}`}
                  end={item.end}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 rounded-xl transition-all duration-150 relative',
                    collapsed ? 'h-9 w-9 mx-auto justify-center px-0' : 'px-3 py-2',
                    isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200',
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
                          {item.badge > 0 && (
                            <span className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{
                                background: item.badgeDanger ? '#e2445c' : ACCENT,
                                color: '#fff',
                              }}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {/* Collapsed badge dot */}
                      {collapsed && item.badge > 0 && (
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
              <p className="text-xs font-semibold text-white truncate">Ravi Nair</p>
              <p className="text-[10px] text-slate-500">Delivery Lead</p>
            </div>
            <button className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 hover:text-white transition-colors flex-shrink-0"
              style={{ background: '#151C2F' }} title="Call Ravi">
              <Phone className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* User + sign out */}
      <div className="flex-shrink-0 p-2 space-y-1" style={{ borderTop: '1px solid #1f2a4a' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl" style={{ background: '#0d1117' }}>
            <Avatar name={user?.name ?? 'U'} size="sm" className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-600 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title="Sign out"
          className={cn(
            'flex items-center gap-2.5 rounded-xl transition-colors w-full text-slate-600 hover:text-red-400',
            collapsed ? 'h-9 w-9 mx-auto justify-center px-0' : 'px-3 py-2',
          )}
          style={{ border: '1px solid transparent' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(226,68,92,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(226,68,92,0.15)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-xs font-medium">Sign out</span>}
        </button>
      </div>
    </aside>
  )
}

// ── Notifications panel ───────────────────────────────────────────────────────

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState<ClientNotif[]>(MOCK_NOTIFS)
  const unread = notifs.filter(n => !n.read).length

  const markRead = (id: string) =>
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })))

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-[380px] z-50 flex flex-col"
        style={{ background: '#080c18', borderLeft: '1px solid rgba(255,255,255,0.07)', boxShadow: '-20px 0 48px rgba(0,0,0,0.5)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-bold text-white">Notifications</span>
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
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all">
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
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
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
                  <p className={`text-xs font-semibold mb-0.5 ${n.read ? 'text-slate-400' : 'text-white'}`}>{n.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{n.body}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[11px] text-slate-600 text-center">Notifications from WAANDA, Finance, and Delivery</p>
        </div>
      </div>
    </>
  )
}

// ── Topbar ────────────────────────────────────────────────────────────────────

function ClientTopbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [userOpen,      setUserOpen]      = useState(false)
  const [notifOpen,     setNotifOpen]     = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const userRef = useRef<HTMLDivElement>(null)

  const unreadCount = MOCK_NOTIFS.filter(n => !n.read).length

  useEffect(() => {
    if (!userOpen) return
    function onClickOutside(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [userOpen])

  const allItems = NAV_GROUPS.flatMap(g => g.items)
  const current  = allItems.find(n =>
    pathname === (n.path === '' ? BASE : `${BASE}/${n.path}`)
  ) ?? allItems[0]

  const displayName  = user?.name  ?? 'Client'
  const displayEmail = user?.email ?? ''

  return (
    <>
    <header
      className="flex-shrink-0 flex items-center justify-between px-4 relative z-20 bg-slate-900/40 backdrop-blur-2xl"
      style={{ height: 60, borderBottom: '1px solid rgba(6,11,24,0.6)' }}
    >
      {/* Left — breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-slate-500 font-medium">Client Portal</span>
          <ChevronRight className="w-4 h-4 text-slate-700" />
          <span className="text-white font-semibold">{current.label}</span>
        </div>
      </div>

      {/* Center — search bar */}
      <div className="flex-1 flex justify-center px-4">
        <div
          className="relative w-full max-w-[380px] h-9 rounded-full flex items-center gap-2 pl-9 pr-3 text-sm text-slate-500 transition-all duration-150"
          style={{
            background: '#0d1117',
            border: `1px solid ${searchFocused ? 'rgba(37,100,234,0.5)' : '#1e2b40'}`,
            boxShadow: searchFocused ? '0 0 0 3px rgba(37,100,234,0.12)' : 'none',
          }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
          <input
            placeholder="Search…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent outline-none w-full text-sm text-slate-300 placeholder:text-slate-600"
          />
          <kbd className="ml-auto text-[10px] text-slate-600 font-mono hidden lg:block bg-[#121d30] px-1.5 py-0.5 rounded border border-[#1e2b40] flex-shrink-0">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right — bell + user */}
      <div className="flex items-center gap-2 flex-1 justify-end">

        {/* Bell */}
        <button
          onClick={() => setNotifOpen(o => !o)}
          className="relative h-9 w-9 rounded-full flex items-center justify-center text-slate-500 transition-colors"
          style={{ border: '1px solid #1e2b40', background: notifOpen ? '#121d30' : '#0d1117' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#121d30'; (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
          onMouseLeave={e => { if (!notifOpen) (e.currentTarget as HTMLElement).style.background = '#0d1117'; (e.currentTarget as HTMLElement).style.color = '' }}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-[#080c18]" style={{ background: '#e2445c' }} />
          )}
        </button>

        <div className="w-px h-5 mx-1 hidden sm:block" style={{ background: '#1e2b40' }} />

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserOpen(o => !o)}
            className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 transition-all"
            style={{ border: '1px solid transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#121d30'; (e.currentTarget as HTMLElement).style.borderColor = '#1e2b40' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}
          >
            <Avatar name={displayName} size="sm" className="w-7 h-7 flex-shrink-0" />
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-xs font-semibold text-white leading-none">{displayName}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-500 hidden lg:block" />
          </button>

          {userOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl py-1 z-50"
              style={{ background: '#0d1117', border: '1px solid #1e2b40' }}
            >
              {/* User info header */}
              <div className="px-3 py-3 mb-1" style={{ borderBottom: '1px solid #1e2b40' }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <Avatar name={displayName} size="sm" className="w-8 h-8 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
                  </div>
                </div>
                <span style={{
                  display: 'inline-block', fontSize: 9, fontWeight: 700,
                  padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: '#2564ea', background: 'rgba(37,100,234,0.12)', border: '1px solid rgba(37,100,234,0.25)',
                }}>
                  Client
                </span>
              </div>

              {/* Menu items */}
              {[
                { Icon: User,     label: 'Profile',  action: () => navigate(`${BASE}/settings`) },
                { Icon: Settings, label: 'Settings', action: () => navigate(`${BASE}/settings`) },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => { item.action(); setUserOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-400 transition-colors text-left"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#121d30'; (e.currentTarget as HTMLElement).style.color = '#f1f5f9' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '' }}
                >
                  <item.Icon className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  {item.label}
                </button>
              ))}

              <div className="my-1 h-px mx-2" style={{ background: '#1e2b40' }} />

              <button
                onClick={() => { logout(); setUserOpen(false) }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors text-left"
                style={{ color: '#e2445c' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(226,68,92,0.08)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
    </>
  )
}

// ── Portal shell ──────────────────────────────────────────────────────────────
import { AmbientBackground } from '../../components/shell/AmbientBackground'

export function ClientPortal() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden relative text-slate-200">
      <AmbientBackground />
      <ClientSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <ClientTopbar />
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
                <Route path="waanda"             element={<ClientWaanda />}          />
                <Route path="settings"           element={<ClientSettings />}        />
                <Route path="*"                  element={<Navigate to={BASE} replace />} />
              </Routes>
            </ModuleShell>
          </div>
        </main>
      </div>
    </div>
  )
}
