import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Search, Bell, Settings, LogOut, User,
  ChevronDown, Grid3X3, ChevronRight, Plus, Maximize2, Minimize2,
} from 'lucide-react'
import { LightningIcon, SquaresFourIcon, TargetIcon, CpuIcon } from '@phosphor-icons/react'
import { Tooltip } from '@design-system/components/Tooltip'
import {
  DropdownRoot, DropdownTrigger, DropdownContent,
  DropdownItem, DropdownSeparator, DropdownPortal,
} from '@design-system/components/Dropdown'
import { useQuery } from '@tanstack/react-query'
import { useUIStore }  from '@store/ui'
import { useAuthStore } from '@store/auth'
import { allNavItems } from '@lib/nav'
import { api, isDemo } from '@lib/api'
import { useCommandPalette } from './CommandPalette'
import { QuickCreateModal, type CreateMode } from '../QuickCreateModal'

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin', CLIENT: 'Client', PARTNER: 'Partner',
  INVESTOR: 'Investor', JOB_SEEKER: 'Applicant',
}

const NEW_ACTIONS: Array<{
  label: string
  icon: React.ElementType
  mode?: CreateMode
  path?: string
}> = [
  { label: 'New Lead',    icon: LightningIcon,   mode: 'lead'    },
  { label: 'New Project', icon: SquaresFourIcon, mode: 'project' },
  { label: 'New Goal',    icon: TargetIcon,      mode: 'goal'    },
  { label: 'Ask WAANDA',  icon: CpuIcon,         path: '/kangqore-view/admin/WAANDA' },
]

// Custom avatar — no design system component, no teal
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
  background: 'rgba(8,12,22,0.97)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: '0 20px 48px rgba(0,0,0,0.6)',
} as const

export function Topbar() {
  const { openNotificationPanel } = useUIStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { setOpen: openSearch } = useCommandPalette()
  const [newOpen, setNewOpen] = useState(false)
  const [createMode, setCreateMode] = useState<CreateMode>(null)
  const newRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

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
    if (!newOpen) return
    const onClick = (e: MouseEvent) => {
      if (newRef.current && !newRef.current.contains(e.target as Node)) setNewOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [newOpen])

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications?limit=20').then(r => r.data.notifications ?? []),
    enabled: !isDemo(),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
  const unreadCount: number = Array.isArray(notifData)
    ? notifData.filter((n: { isRead?: boolean; read?: boolean }) => !(n.isRead ?? n.read)).length
    : 0

  const location = useLocation()
  const currentModule = allNavItems.find(item => location.pathname.startsWith(item.path))

  const displayName  = user?.name  ?? 'User'
  const displayEmail = user?.email ?? ''
  const displayRole  = ROLE_LABEL[user?.role ?? ''] ?? user?.role ?? 'Admin'

  return (
    <>
    <header
      className="flex-shrink-0 h-[60px] flex items-center gap-4 px-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >

      {/* ── Left: breadcrumb ── */}
      <div className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
        <Tooltip content="App launcher" side="bottom">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all duration-150 flex-shrink-0">
            <Grid3X3 className="w-[15px] h-[15px]" />
          </button>
        </Tooltip>

        <div className="hidden md:flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-slate-600 font-medium flex-shrink-0">Kangqore View</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-800 flex-shrink-0" />
          <span className="text-white font-semibold truncate">{currentModule?.label ?? 'Overview'}</span>
        </div>
      </div>

      {/* ── Centre: search ── */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={() => openSearch(true)}
          className="group relative h-9 w-full max-w-[400px] rounded-full flex items-center gap-2 pl-9 pr-3 text-sm text-slate-500 text-left transition-all duration-150 hover:text-slate-300"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-slate-600 pointer-events-none group-hover:text-slate-500 transition-colors" />
          <span className="flex-1 leading-none">Search anything…</span>
          <kbd
            className="hidden lg:flex items-center gap-px text-[10px] text-slate-700 font-sans rounded px-1.5 py-1 leading-none flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span style={{ fontSize: 13, lineHeight: 1 }}>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* ── Right: actions ── */}
      <div className="flex items-center gap-1.5 flex-shrink-0">

        {/* + New */}
        <div className="relative" ref={newRef}>
          <button
            onClick={() => setNewOpen(o => !o)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-white text-[13px] font-semibold transition-opacity hover:opacity-85 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2564ea 0%, #0ea5e9 100%)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
          {newOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl py-1.5 z-50" style={PANEL_STYLE}>
              {NEW_ACTIONS.map(a => {
                const Icon = a.icon
                return (
                  <button
                    key={a.label}
                    onClick={() => {
                      setNewOpen(false)
                      if (a.mode) { setCreateMode(a.mode) }
                      else if (a.path) { navigate(a.path) }
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <Icon weight="fill" className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    {a.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 mx-0.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />

        {/* Bell */}
        <Tooltip content="Notifications" side="bottom">
          <button
            onClick={openNotificationPanel}
            className="relative w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all duration-150"
          >
            <Bell className="w-[17px] h-[17px]" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center leading-none tabular-nums"
                style={{ padding: '0 4px', boxShadow: '0 0 0 2px #0B1121, 0 2px 8px rgba(239,68,68,0.35)' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </Tooltip>

        {/* Fullscreen */}
        <Tooltip content={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} side="bottom">
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all duration-150"
          >
            {isFullscreen
              ? <Minimize2 className="w-[15px] h-[15px]" />
              : <Maximize2 className="w-[15px] h-[15px]" />}
          </button>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-5 mx-0.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />

        {/* User menu */}
        <DropdownRoot>
          <DropdownTrigger asChild>
            <button className="flex items-center gap-2 h-8 pl-1 pr-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150">
              <UserMonogram name={displayName} size={26} />
              <span className="hidden lg:block text-[13px] font-semibold text-white leading-none">{displayName}</span>
              <ChevronDown className="w-3 h-3 text-slate-600 hidden lg:block" />
            </button>
          </DropdownTrigger>
          <DropdownPortal>
            <DropdownContent
              align="end"
              sideOffset={8}
              className="z-50 min-w-[210px] rounded-xl p-1.5 animate-in fade-in-0 zoom-in-95 duration-150"
              style={PANEL_STYLE}
            >
              {/* User info header */}
              <div className="flex items-center gap-2.5 px-2.5 py-2.5 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <UserMonogram name={displayName} size={32} />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-white leading-none mb-1 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-500 truncate leading-none">{displayEmail}</p>
                </div>
              </div>

              {/* Role chip */}
              <div className="px-2.5 pt-2 pb-1.5 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span
                  className="inline-block text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-md"
                  style={{ background: 'rgba(37,100,234,0.1)', color: '#60a5fa', border: '1px solid rgba(37,100,234,0.18)' }}
                >
                  {displayRole}
                </span>
              </div>

              <DropdownItem
                onClick={() => navigate('/kangqore-view/admin/settings/profile')}
                className="flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-slate-400 rounded-lg cursor-pointer outline-none hover:bg-white/5 hover:text-white transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                Profile
              </DropdownItem>
              <DropdownItem
                onClick={() => navigate('/kangqore-view/admin/settings')}
                className="flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-slate-400 rounded-lg cursor-pointer outline-none hover:bg-white/5 hover:text-white transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                Settings
              </DropdownItem>
              <DropdownSeparator className="my-1 h-px mx-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
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

    <QuickCreateModal mode={createMode} onClose={() => setCreateMode(null)} />
  </>
  )
}
