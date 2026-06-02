import { useLocation } from 'react-router-dom'
import { Search, Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react'
import { cn } from '@design-system/cn'
import { Avatar } from '@design-system/components/Avatar'
import { Badge } from '@design-system/components/Badge'
import { Tooltip } from '@design-system/components/Tooltip'
import {
  DropdownRoot, DropdownTrigger, DropdownContent,
  DropdownItem, DropdownSeparator, DropdownPortal,
} from '@design-system/components/Dropdown'
import { useUIStore }  from '@store/ui'
import { useAuthStore } from '@store/auth'
import { allNavItems } from '@lib/nav'

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin', CLIENT: 'Client', PARTNER: 'Partner',
  INVESTOR: 'Investor', JOB_SEEKER: 'Applicant',
}

const UNREAD_COUNT = 3

export function Topbar() {
  const { openNotificationPanel } = useUIStore()
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const currentModule = allNavItems.find(item =>
    location.pathname.startsWith(item.path)
  )

  const displayName = user?.name  ?? 'User'
  const displayEmail = user?.email ?? ''
  const displayRole  = ROLE_LABEL[user?.role ?? ''] ?? user?.role ?? 'Admin'

  return (
    <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center gap-4 px-8 lg:px-8 z-10">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-slate-900 truncate">
          {currentModule?.label ?? 'Kangqore OS'}
        </h1>
        <p className="text-[11px] text-slate-400 leading-none mt-0.5">
          {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search anything…"
          className={cn(
            'h-8 w-56 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm text-slate-700',
            'placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
            'transition-all duration-150'
          )}
        />
        <kbd className="absolute right-2.5 text-[10px] text-slate-400 font-mono hidden lg:block">⌘K</kbd>
      </div>

      {/* Notification bell */}
      <Tooltip content="Notifications" side="bottom">
        <button
          onClick={openNotificationPanel}
          className="relative h-8 w-8 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {UNREAD_COUNT > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
              {UNREAD_COUNT}
            </span>
          )}
        </button>
      </Tooltip>

      {/* User menu */}
      <DropdownRoot>
        <DropdownTrigger asChild>
          <button className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-slate-50 transition-colors">
            <Avatar name={displayName} size="sm" />
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-sm font-medium text-slate-800 leading-none">{displayName}</span>
              <Badge variant="brand" size="sm" className="mt-1">{displayRole}</Badge>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>
        </DropdownTrigger>
        <DropdownPortal>
          <DropdownContent align="end" sideOffset={8} className="z-50 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-lg p-1 animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
              <p className="text-sm font-semibold text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
            </div>
            <DropdownItem className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-slate-700 rounded-lg cursor-default outline-none focus:bg-slate-50">
              <User className="w-4 h-4 text-slate-400" />
              Profile
            </DropdownItem>
            <DropdownItem className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-slate-700 rounded-lg cursor-default outline-none focus:bg-slate-50">
              <Settings className="w-4 h-4 text-slate-400" />
              Settings
            </DropdownItem>
            <DropdownSeparator className="my-1 h-px bg-slate-100" />
            <DropdownItem
              onClick={logout}
              className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-red-600 rounded-lg cursor-default outline-none focus:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownItem>
          </DropdownContent>
        </DropdownPortal>
      </DropdownRoot>
    </header>
  )
}
