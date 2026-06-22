import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, User, Bell, X } from 'lucide-react'
import { cn } from '@design-system/cn'
import { Avatar } from '@design-system/components/Avatar'
import {
  DropdownRoot, DropdownTrigger, DropdownContent,
  DropdownItem, DropdownSeparator, DropdownPortal,
} from '@design-system/components/Dropdown'
import { useAuthStore } from '@store/auth'
import type { LucideIcon } from 'lucide-react'

// ─── types ────────────────────────────────────────────────────────────────────

export interface PortalNotif {
  id: string
  type: 'info' | 'alert' | 'success' | 'payment'
  title: string
  body: string
  read: boolean
  time: string
}

interface NavTab { path: string; label: string; icon: LucideIcon }

interface PortalNavbarProps {
  portalName: string
  portalColor: string
  tabs: NavTab[]
  basePath: string
  accent?: string
  notifications?: PortalNotif[]
}

// ─── notif config ─────────────────────────────────────────────────────────────

const NOTIF_META: Record<PortalNotif['type'], { color: string; bg: string; border: string; label: string }> = {
  info:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)',  label: 'Update'  },
  alert:   { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', label: 'Alert'   },
  success: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)',  label: 'Done'    },
  payment: { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)',  label: 'Finance' },
}

const ROLE_LABEL: Record<string, string> = {
  CLIENT: 'Client', PARTNER: 'Partner', INVESTOR: 'Investor',
  JOB_SEEKER: 'Applicant', JOURNALIST: 'Journalist', ANALYST: 'Analyst',
}

// ─── notifications panel ──────────────────────────────────────────────────────

function NotificationsPanel({
  notifications,
  onClose,
  accent,
}: {
  notifications: PortalNotif[]
  onClose: () => void
  accent: string
}) {
  const [items, setItems] = useState(notifications)
  const unread = items.filter(n => !n.read).length

  const markAll = () => setItems(items.map(n => ({ ...n, read: true })))
  const markOne = (id: string) => setItems(items.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
        style={{ background: '#0a0e1a', borderLeft: '1px solid #2E2854', boxShadow: '-24px 0 80px rgba(0,0,0,0.5)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #2E2854' }}>
          <div>
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            {unread > 0 && (
              <p className="text-[11px] mt-0.5" style={{ color: accent }}>{unread} unread</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={markAll}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors text-slate-400 hover:text-white"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Bell className="w-8 h-8 text-slate-700" />
              <p className="text-sm text-slate-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#1a2035' }}>
              {items.map(n => {
                const meta = NOTIF_META[n.type]
                return (
                  <button
                    key={n.id}
                    onClick={() => markOne(n.id)}
                    className="w-full text-left px-5 py-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="flex items-start gap-3">
                      {/* Unread dot */}
                      <div className="flex-shrink-0 mt-1.5">
                        {!n.read
                          ? <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
                          : <div className="w-2 h-2" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                            style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
                          >
                            {meta.label}
                          </span>
                          <span className="text-[10px] text-slate-600">{n.time}</span>
                        </div>
                        <p className={`text-[13px] font-semibold leading-snug mb-0.5 ${n.read ? 'text-slate-400' : 'text-white'}`}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{n.body}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── navbar ───────────────────────────────────────────────────────────────────

export function PortalNavbar({ portalName, tabs, basePath, accent = '#2564ea', notifications = [] }: PortalNavbarProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const roleLabel = ROLE_LABEL[user?.role ?? ''] ?? (user?.role ?? 'User')
  const [notifOpen, setNotifOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set(notifications.filter(n => n.read).map(n => n.id)))
  const unread = notifications.filter(n => !readIds.has(n.id)).length

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex-shrink-0"
        style={{ background: '#0a0e1a', borderBottom: '1px solid #1f2a4a' }}>

        {/* Main bar */}
        <div className="flex items-center gap-4 px-6 lg:px-10 h-14">

          {/* Wordmark */}
          <button
            onClick={() => navigate(basePath)}
            className="flex items-center gap-3 mr-2 group flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)`, boxShadow: `0 0 14px ${accent}40` }}>
              K
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">Kangqore</p>
              <p className="text-[10px] leading-none mt-0.5" style={{ color: `${accent}bb` }}>{portalName}</p>
            </div>
          </button>

          <div className="w-px h-5 bg-[#2E2854] mx-2 flex-shrink-0" />

          {/* User name */}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
            <p className="text-[10px] text-slate-600">{user?.email}</p>
          </div>

          <div className="flex-1" />

          {/* Role chip */}
          <span className="hidden sm:inline text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}30` }}>
            {roleLabel}
          </span>

          {/* Bell */}
          {notifications.length > 0 && (
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors flex-shrink-0"
              style={{ background: notifOpen ? `${accent}14` : 'rgba(255,255,255,0.04)', border: `1px solid ${notifOpen ? accent + '30' : '#2E2854'}` }}
            >
              <Bell className="w-4 h-4" style={{ color: notifOpen ? accent : '#64748b' }} />
              {unread > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center"
                  style={{ background: accent }}
                >
                  {unread}
                </span>
              )}
            </button>
          )}

          {/* Avatar + dropdown */}
          <DropdownRoot>
            <DropdownTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors flex-shrink-0"
                style={{ border: '1px solid transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#151C2F'; (e.currentTarget as HTMLElement).style.borderColor = '#2E2854' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}
              >
                <Avatar name={user?.name ?? 'U'} size="sm" />
              </button>
            </DropdownTrigger>
            <DropdownPortal>
              <DropdownContent align="end" sideOffset={8}
                className="z-50 min-w-[200px] rounded-xl shadow-2xl p-1"
                style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
                <div className="px-3 py-2.5 mb-1" style={{ borderBottom: '1px solid #2E2854' }}>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                </div>
                <DropdownItem
                  onClick={() => navigate(`${basePath}/profile`)}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-slate-300 rounded-lg cursor-pointer outline-none"
                  style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#151C2F' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <User className="w-4 h-4 text-slate-500" /> Profile
                </DropdownItem>
                <DropdownSeparator style={{ height: 1, background: '#2E2854', margin: '4px 0' }} />
                <DropdownItem
                  onClick={logout}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-lg cursor-pointer outline-none"
                  style={{ color: '#e2445c', transition: 'background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(226,68,92,0.08)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </DropdownItem>
              </DropdownContent>
            </DropdownPortal>
          </DropdownRoot>
        </div>

        {/* Tab strip */}
        <div className="flex items-center gap-0.5 px-6 lg:px-10 overflow-x-auto scrollbar-none"
          style={{ borderTop: '1px solid #1a2340' }}>
          {tabs.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path === '' ? basePath : `${basePath}/${tab.path}`}
              end={tab.path === ''}
              className={({ isActive }) => cn(
                'flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-all whitespace-nowrap flex-shrink-0',
                isActive
                  ? 'border-b-2 text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              )}
              style={({ isActive }) => isActive ? { borderBottomColor: accent, color: '#ffffff' } : {}}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Notifications panel */}
      {notifOpen && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          accent={accent}
        />
      )}
    </>
  )
}
