import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, User, Bell, X, ChevronDown, Brain } from 'lucide-react'
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

const PANEL_STYLE = {
  background: 'var(--os-card)',
  backdropFilter: 'blur(24px)',
  border: '1px solid var(--os-border)',
  boxShadow: '0 20px 48px rgba(0,0,0,0.1)',
} as const

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
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
        style={{ background: 'var(--os-card)', borderLeft: '1px solid var(--os-border)', boxShadow: '-24px 0 80px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--os-border)' }}>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Notifications</h3>
            {unread > 0 && (
              <p className="text-[11px] mt-0.5" style={{ color: accent }}>{unread} unread</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={markAll}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"
                style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
              style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-surface-0)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Bell className="w-8 h-8 text-[var(--os-text-2)]" />
              <p className="text-sm text-[var(--os-text-2)]">No notifications</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--os-surface-0)' }}>
              {items.map(n => {
                const meta = NOTIF_META[n.type]
                return (
                  <button
                    key={n.id}
                    onClick={() => markOne(n.id)}
                    className="w-full text-left px-5 py-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="flex items-start gap-3">
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
                          <span className="text-[10px] text-[var(--os-text-2)]">{n.time}</span>
                        </div>
                        <p className="text-[13px] font-semibold leading-snug mb-0.5" style={{ color: n.read ? 'var(--os-text-2)' : 'var(--os-text-1)' }}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-[var(--os-text-2)] leading-relaxed line-clamp-2">{n.body}</p>
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
  const unread = notifications.filter(n => !n.read).length

  return (
    <>
      <header
        className="flex-shrink-0 h-[60px] flex items-center w-full sticky top-0 z-40"
        style={{ background: 'var(--os-topbar-bg, var(--os-card))', borderBottom: '1px solid var(--os-topbar-border, var(--os-border))' }}
      >
        {/* ── Left: logo + portal name ── */}
        <button
          onClick={() => navigate(basePath)}
          className="flex items-center gap-2.5 flex-shrink-0 select-none group px-6 h-full"
        >
          <div
            className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 bg-gradient-to-tr from-[#2564ea] to-[#0ea5e9]"
          >
            <img src="/favicon.jpg" alt="Kangqore" className="w-full h-full object-cover"
              onError={e => { e.currentTarget.style.display = 'none' }} />
            <Brain className="w-4 h-4 text-white absolute" style={{ zIndex: -1 }} />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-black tracking-tight leading-none" style={{ color: 'var(--os-text-1)' }}>
              Kangqore
            </span>
            <span className="text-[10px] font-semibold text-[#2564ea] tracking-wider uppercase leading-none mt-0.5">
              {portalName}
            </span>
          </div>
        </button>

        {/* ── Center: tab navigation ── */}
        <nav className="flex items-center h-full flex-1 gap-0.5 px-3 overflow-x-auto scrollbar-none">
          {tabs.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path === '' ? basePath : `${basePath}/${tab.path}`}
              end={tab.path === ''}
              className={({ isActive }) => cn(
                'flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap flex-shrink-0',
                isActive
                  ? ''
                  : 'hover:bg-black/[0.05] dark:hover:bg-white/5'
              )}
              style={({ isActive }) => isActive
                ? { background: `${accent}18`, color: accent, boxShadow: `inset 0 0 0 1px ${accent}28` }
                : { color: 'var(--os-text-2)' }
              }
            >
              <tab.icon className="w-3.5 h-3.5 flex-shrink-0" />
              {tab.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Right: utility cluster + separator + user profile ── */}
        <div className="flex items-center gap-4 px-4 flex-shrink-0">
          {/* Icon cluster */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative w-8 h-8 flex items-center justify-center rounded-full text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors"
            >
              <Bell className="w-[17px] h-[17px]" />
              {unread > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center leading-none"
                  style={{ padding: '0 3px' }}
                >
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>
          </div>

          <div className="w-px h-5 bg-[var(--os-border)] flex-shrink-0" />

          <DropdownRoot>
            <DropdownTrigger asChild>
              <button className="flex items-center gap-2 h-9 px-1.5 rounded-xl hover:bg-[var(--os-surface-0)] transition-colors flex-shrink-0">
                <Avatar name={user?.name ?? 'U'} size="sm" className="w-[28px] h-[28px] flex-shrink-0" />
                <div className="text-left hidden md:block min-w-0">
                  <p className="text-[12px] font-bold leading-none mb-0.5 truncate" style={{ color: 'var(--os-text-1)' }}>{user?.name ?? 'User'}</p>
                  <p className="text-[9px] text-slate-500 leading-none">{roleLabel}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-3)] flex-shrink-0" />
              </button>
            </DropdownTrigger>
            <DropdownPortal>
              <DropdownContent
                align="end"
                sideOffset={8}
                className="z-50 min-w-[210px] rounded-xl p-1.5 animate-in fade-in-0 zoom-in-95 duration-150"
                style={PANEL_STYLE}
              >
                <div className="flex items-center gap-2.5 px-2.5 py-2.5 mb-1" style={{ borderBottom: '1px solid var(--os-border)' }}>
                  <Avatar name={user?.name ?? 'U'} size="sm" className="w-8 h-8 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-none mb-1 truncate" style={{ color: 'var(--os-text-1)' }}>{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate leading-none">{user?.email}</p>
                  </div>
                </div>
                <div className="px-2.5 pt-2 pb-1.5 mb-1" style={{ borderBottom: '1px solid var(--os-border)' }}>
                  <span
                    className="inline-block text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-md"
                    style={{ background: `${accent}14`, color: accent, border: `1px solid ${accent}28` }}
                  >
                    {roleLabel}
                  </span>
                </div>
                <DropdownItem
                  onClick={() => navigate(`${basePath}/profile`)}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-[var(--os-text-2)] rounded-lg cursor-pointer outline-none hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[var(--os-text-1)] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  Profile
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
            </DropdownPortal>
          </DropdownRoot>
        </div>
      </header>

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
