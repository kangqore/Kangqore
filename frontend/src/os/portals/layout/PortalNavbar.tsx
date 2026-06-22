import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, User, Settings } from 'lucide-react'
import { cn } from '@design-system/cn'
import { Avatar } from '@design-system/components/Avatar'
import {
  DropdownRoot, DropdownTrigger, DropdownContent,
  DropdownItem, DropdownSeparator, DropdownPortal,
} from '@design-system/components/Dropdown'
import { useAuthStore } from '@store/auth'
import type { LucideIcon } from 'lucide-react'

interface NavTab { path: string; label: string; icon: LucideIcon }

interface PortalNavbarProps {
  portalName: string
  portalColor: string
  tabs: NavTab[]
  basePath: string
  accent?: string
}

const ROLE_LABEL: Record<string, string> = {
  CLIENT: 'Client', PARTNER: 'Partner', INVESTOR: 'Investor',
  JOB_SEEKER: 'Applicant', JOURNALIST: 'Journalist', ANALYST: 'Analyst',
}

export function PortalNavbar({ portalName, tabs, basePath, accent = '#2564ea' }: PortalNavbarProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const roleLabel = ROLE_LABEL[user?.role ?? ''] ?? (user?.role ?? 'User')

  return (
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
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
                     boxShadow: `0 0 14px ${accent}40` }}>
            K
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Kangqore</p>
            <p className="text-[10px] leading-none mt-0.5" style={{ color: `${accent}bb` }}>{portalName}</p>
          </div>
        </button>

        <div className="w-px h-5 bg-[#2E2854] mx-2 flex-shrink-0" />

        {/* Client name */}
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
  )
}
