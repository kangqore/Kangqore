import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, ChevronDown } from 'lucide-react'
import { cn } from '@design-system/cn'
import { Avatar } from '@design-system/components/Avatar'
import { Badge } from '@design-system/components/Badge'
import {
  DropdownRoot, DropdownTrigger, DropdownContent,
  DropdownItem, DropdownSeparator, DropdownPortal,
} from '@design-system/components/Dropdown'
import { useAuthStore } from '@store/auth'
import { SiteNav } from '@components/shell/SiteNav'
import type { LucideIcon } from 'lucide-react'

interface NavTab {
  path: string
  label: string
  icon: LucideIcon
}

interface PortalNavbarProps {
  portalName: string
  portalColor: string          // tailwind gradient class
  tabs: NavTab[]
  basePath: string
}

const ROLE_BADGE: Record<string, string> = {
  CLIENT: 'Client', PARTNER: 'Partner', INVESTOR: 'Investor', JOB_SEEKER: 'Applicant',
}

export function PortalNavbar({ portalName, portalColor, tabs, basePath }: PortalNavbarProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <>
    <SiteNav />
    <header className="bg-os-s1 border-b border-os-border z-10 flex-shrink-0">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 lg:px-10 h-14">
        {/* Logo */}
        <button onClick={() => navigate(basePath)} className="flex items-center gap-2.5 mr-4">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${portalColor}`}>
            <span className="text-white font-bold text-xs">K</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white leading-none">Kangqore</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{portalName}</p>
          </div>
        </button>

        <div className="flex-1" />

        {/* User menu */}
        <DropdownRoot>
          <DropdownTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-900 transition-colors">
              <Avatar name={user?.name ?? 'User'} size="sm" />
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-slate-200 leading-none">{user?.name}</span>
                <Badge variant="info" size="sm" className="mt-0.5">
                  {ROLE_BADGE[user?.role ?? ''] ?? user?.role}
                </Badge>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
            </button>
          </DropdownTrigger>
          <DropdownPortal>
            <DropdownContent align="end" sideOffset={8} className="z-50 min-w-[180px] bg-os-s1 border border-os-border rounded-xl shadow-lg p-1">
              <div className="px-3 py-2.5 border-b border-os-border mb-1">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <DropdownSeparator className="my-1 h-px bg-os-s1" />
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
      </div>

      {/* Sub-nav tabs */}
      <div className="flex items-center gap-1 px-6 lg:px-10 overflow-x-auto">
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? basePath : `${basePath}/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap flex-shrink-0',
              isActive
                ? 'border-os-blue text-os-blue'
                : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-os-border'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>
    </header>
    </>
  )
}
