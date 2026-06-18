import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, Settings, LogOut, User, ChevronDown, Grid3X3, ChevronRight, Plus, Zap, LayoutDashboard, Target, Cpu } from 'lucide-react'
import { cn } from '@design-system/cn'
import { Avatar } from '@design-system/components/Avatar'
import { Badge } from '@design-system/components/Badge'
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

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin', CLIENT: 'Client', PARTNER: 'Partner',
  INVESTOR: 'Investor', JOB_SEEKER: 'Applicant',
}

const NEW_ACTIONS = [
  { label: 'New Lead',    icon: Zap,             path: '/kangqore-view/admin/leads'                },
  { label: 'New Project', icon: LayoutDashboard, path: '/kangqore-view/admin/projects'             },
  { label: 'New Goal',    icon: Target,          path: '/kangqore-view/admin/kangqore-immp/goals'  },
  { label: 'Ask WAANDA',  icon: Cpu,             path: '/kangqore-view/admin/WAANDA'               },
]

export function Topbar() {
  const { openNotificationPanel } = useUIStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { setOpen: openSearch } = useCommandPalette()
  const [newOpen, setNewOpen] = useState(false)
  const newRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!newOpen) return
    function onClick(e: MouseEvent) {
      if (newRef.current && !newRef.current.contains(e.target as Node)) setNewOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [newOpen])

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications?limit=20').then(r => r.data.notifications ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  })
  const unreadCount: number = Array.isArray(notifData)
    ? notifData.filter((n: { read: boolean }) => !n.read).length
    : 0
  const location = useLocation()

  const currentModule = allNavItems.find(item =>
    location.pathname.startsWith(item.path)
  )

  const displayName = user?.name  ?? 'User'
  const displayEmail = user?.email ?? ''
  const displayRole  = ROLE_LABEL[user?.role ?? ''] ?? user?.role ?? 'Admin'

  return (
    <header className="flex-shrink-0 h-[60px] bg-os-s1 border-b border-os-border flex items-center justify-between px-4 z-10">
      {/* App Launcher & Breadcrumbs */}
      <div className="flex items-center gap-4 flex-1">
        <Tooltip content="App Launcher" side="bottom">
          <button className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-slate-300 transition-colors">
            <Grid3X3 className="w-5 h-5" />
          </button>
        </Tooltip>

        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-slate-500 font-medium">Workspace</span>
          <ChevronRight className="w-4 h-4 text-[#2E2854]" />
          <span className="text-white font-semibold">{currentModule?.label ?? 'Overview'}</span>
        </div>
      </div>

      {/* Centered Search — opens CommandPalette */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={() => openSearch(true)}
          className={cn(
            'relative h-9 w-full max-w-[400px] rounded-full border border-os-border bg-slate-900',
            'flex items-center gap-2 pl-9 pr-3 text-sm text-slate-500',
            'hover:border-[#4ab6d4]/60 hover:bg-os-s1 transition-all duration-150 text-left'
          )}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          Search anything…
          <kbd className="ml-auto text-[10px] text-slate-500 font-mono hidden lg:block bg-os-s1 px-1 border border-os-border rounded">⌘K</kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 flex-1 justify-end">

        {/* +New quick-create */}
        <div className="relative" ref={newRef}>
          <button
            onClick={() => setNewOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-os-blue to-os-cyan text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
          {newOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-os-s1 border border-os-border rounded-xl shadow-lg py-1 z-50">
              {NEW_ACTIONS.map(a => {
                const Icon = a.icon
                return (
                  <button
                    key={a.label}
                    onClick={() => { navigate(a.path); setNewOpen(false) }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    {a.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <Tooltip content="Notifications" side="bottom">
          <button
            onClick={openNotificationPanel}
            className="relative h-9 w-9 rounded-full flex items-center justify-center text-slate-500 border border-os-border hover:bg-slate-900 transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#151C2F]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </Tooltip>

        <div className="w-px h-6 bg-[#2E2854] mx-1 hidden sm:block" />

        {/* User menu */}
        <DropdownRoot>
          <DropdownTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-full pl-1 pr-3 py-1 hover:bg-slate-900 transition-colors border border-transparent hover:border-os-border">
              <Avatar name={displayName} size="sm" className="w-7 h-7" />
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-xs font-semibold text-white leading-none">{displayName}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden lg:block" />
            </button>
          </DropdownTrigger>
          <DropdownPortal>
            <DropdownContent align="end" sideOffset={8} className="z-50 min-w-[200px] bg-os-s1 border border-os-border rounded-xl shadow-lg p-1 animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-os-border mb-1">
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
                <Badge variant="brand" size="sm" className="mt-2 w-max">{displayRole}</Badge>
              </div>
              <DropdownItem className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-slate-300 rounded-lg cursor-default outline-none hover:bg-slate-900 hover:text-white">
                <User className="w-4 h-4 text-slate-500" />
                Profile
              </DropdownItem>
              <DropdownItem className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-slate-300 rounded-lg cursor-default outline-none hover:bg-slate-900 hover:text-white">
                <Settings className="w-4 h-4 text-slate-500" />
                Settings
              </DropdownItem>
              <DropdownSeparator className="my-1 h-px bg-[#2E2854]" />
              <DropdownItem
                onClick={logout}
                className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-red-500 rounded-lg cursor-default outline-none hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownItem>
            </DropdownContent>
          </DropdownPortal>
        </DropdownRoot>
      </div>
    </header>
  )
}
