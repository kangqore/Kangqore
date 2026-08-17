import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Search, Bell, Settings, LogOut, User,
  ChevronDown, Grid3X3, ChevronRight, Plus, Maximize2, Minimize2,
  Brain, Home, ArrowUpRight, Eye, Building2, Check, Loader2,
} from 'lucide-react'
import {
  LightningIcon, SquaresFourIcon, TargetIcon, CpuIcon,
  UsersThreeIcon, UserCircleIcon, CrownSimpleIcon, HandshakeIcon,
  TrendUpIcon, GlobeIcon, ChatCircleDotsIcon,
} from '@phosphor-icons/react'
import { useRelayStore } from '@features/relay/store'
import { Surface } from '@design-system/primitives/Surface'
import { Tooltip } from '@design-system/components/Tooltip'
import { usePagePresence } from '@hooks/usePagePresence'
import { PagePresenceBubbles } from '../PagePresenceBubbles'
import {
  DropdownRoot, DropdownTrigger, DropdownContent,
  DropdownItem, DropdownSeparator, DropdownPortal,
} from '@design-system/components/Dropdown'
import { useQuery } from '@tanstack/react-query'
import { LivePresencePanel } from '../LivePresencePanel'
import { useUIStore }  from '@store/ui'
import { useAuthStore } from '@store/auth'
import { allNavItems } from '@lib/nav'
import { api, isDemo } from '@lib/api'
import { useCommandPalette } from './CommandPalette'
import { QuickCreateModal, type CreateMode } from '../QuickCreateModal'
import { ViewToggle } from '../ViewToggle'

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin', CLIENT: 'Client', PARTNER: 'Partner',
  INVESTOR: 'Investor', JOB_SEEKER: 'Applicant',
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
  background: 'var(--os-card)',
  border: '1px solid var(--os-border)',
  boxShadow: 'var(--os-shadow-md)',
} as const

export function Topbar({ config }: { config?: any }) {
  const { openNotificationPanel } = useUIStore()
  const { user, logout, currentOrg, switchOrg } = useAuthStore()
  const navigate = useNavigate()
  const { setOpen: openSearch } = useCommandPalette()
  const [newOpen, setNewOpen]         = useState(false)
  const [presenceOpen, setPresenceOpen] = useState(false)
  const [createMode, setCreateMode] = useState<CreateMode>(null)
  const newRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (!switcherOpen) return
    const onClick = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) setSwitcherOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [switcherOpen])

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

  const { data: orgsData } = useQuery({
    queryKey: ['my-orgs'],
    queryFn:  () => api.get('/orgs').then(r => r.data.orgs ?? []),
    enabled:  !isDemo(),
    staleTime: 60_000,
  })
  const myOrgs: Array<{ id: string; name: string; slug: string; logoUrl: string | null; role: string }> = orgsData ?? []
  const [switchingOrgId, setSwitchingOrgId] = useState<string | null>(null)

  const location = useLocation()
  const pageKey = location.pathname.replace(/\//g, ':').slice(1)
  const { viewers: pageViewers } = usePagePresence(pageKey)
  const currentModule = allNavItems.find(item => location.pathname.startsWith(item.path))

  const currentPortalId = location.pathname.startsWith('/kangqore-view/admin')     ? 'admin'
    : location.pathname.startsWith('/kangqore-view/team')      ? 'team'
    : location.pathname.startsWith('/kangqore-view/executive') ? 'executive'
    : location.pathname.startsWith('/kangqore-view/client')    ? 'client'
    : location.pathname.startsWith('/kangqore-view/partner')   ? 'partner'
    : location.pathname.startsWith('/kangqore-view/investor')  ? 'investor'
    : location.pathname.startsWith('/kangqore-view/analyst')   ? 'analyst'
    : null

  const portalLabel = config?.label ?? (
    currentPortalId === 'admin'     ? 'Admin'
    : currentPortalId === 'team'      ? 'Team'
    : currentPortalId === 'executive' ? 'Executive'
    : 'OS'
  )

  const accessiblePortals = PORTALS.filter(p =>
    user?.role === 'ADMIN' || (p.roles as readonly string[]).includes(user?.role ?? '')
  )

  const displayName  = user?.name  ?? 'User'
  const displayEmail = user?.email ?? ''
  const displayRole  = ROLE_LABEL[user?.role ?? ''] ?? user?.role ?? 'Admin'

  const totalMentions = useRelayStore(
    (s) => Object.values(s.unreadCounts).reduce((sum, c) => sum + c.mentions, 0),
  )

  const userDropdown = (align: 'start' | 'end' = 'end') => (
    <DropdownPortal>
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
            {displayRole}
          </span>
        </div>
        <DropdownItem
          onClick={() => navigate('/kangqore-view/admin/settings/profile')}
          className="flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-[var(--os-text-2)] rounded-lg cursor-pointer outline-none hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[var(--os-text-1)] transition-colors"
        >
          <User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          Profile
        </DropdownItem>
        <DropdownItem
          onClick={() => navigate('/kangqore-view/admin/settings')}
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
    </DropdownPortal>
  )

  return (
    <>
    <header
      className="flex-shrink-0 h-[60px] flex items-center justify-between w-full px-6 sticky top-0 bg-[#323949] border-b border-black/10"
      style={{ zIndex: 40 }}
    >
      {/* LEFT AREA: "Kangqore view" logo */}
      {/* LEFT AREA: Title */}
      <div className="flex items-center gap-2.5 flex-shrink-0 select-none group">
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold tracking-tight leading-none text-white">
            Kangqore View
          </span>
        </div>
      </div>

      {/* CENTER AREA: Switcher & Breadcrumbs + Search capsule */}
      <div className="flex-1 flex items-center justify-center gap-4 max-w-[580px] mx-4 hidden md:flex min-w-0">
        {/* Switcher & Breadcrumbs */}
        <div className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
          <div className="relative" ref={switcherRef}>
            <button
              onClick={() => setSwitcherOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-os-md text-[12px] font-medium transition-colors bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              {portalLabel}
              <ChevronDown className="w-3 h-3" />
            </button>

            {switcherOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150" style={PANEL_STYLE}>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--os-text-2)] px-3 pb-2">
                  Switch Portal
                </p>
                {accessiblePortals.map(portal => {
                  const Icon = portal.icon
                  const isActive = currentPortalId === portal.id
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
                      onClick={() => { navigate('/kangqore-view/admin/settings/organization'); setSwitcherOpen(false) }}
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

          <ChevronRight className="w-3 h-3 text-white/50 flex-shrink-0" />
          <span className="text-[12px] font-semibold text-white truncate">{currentModule?.label ?? 'Overview'}</span>
        </div>

        {/* Search capsule */}
        <button
          onClick={() => openSearch(true)}
          className="flex-1 h-8 flex items-center gap-2.5 px-3 text-[12px] rounded-os-md transition-colors min-w-0 bg-white/5 hover:bg-white/10 border border-white/10 shadow-sm text-white/70"
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1 text-left truncate">Search...</span>
          <kbd
            className="hidden lg:flex items-center justify-center text-[9px] font-sans rounded px-1.5 py-0.5 leading-none flex-shrink-0 bg-black/20 text-white/70 border border-white/10 shadow-sm"
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* RIGHT AREA: Utility cluster, Profile, New (+) action */}
      <div className="flex items-center gap-4">
        {/* View toggle */}
        <ViewToggle />

        {/* Utility Group */}
        <div className="flex items-center gap-1">
          <PagePresenceBubbles viewers={pageViewers} />
          <Tooltip content="Messages" side="bottom">
            <button
              onClick={() => navigate(`/kangqore-view/${currentPortalId ?? 'admin'}/relay`)}
              className="relative w-8 h-8 rounded-os-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChatCircleDotsIcon weight="duotone" className="w-[18px] h-[18px]" />
              {totalMentions > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center leading-none"
                  style={{ padding: '0 3px' }}
                >
                  {totalMentions > 9 ? '9+' : totalMentions}
                </span>
              )}
            </button>
          </Tooltip>

          {user?.role === 'ADMIN' && (
            <Tooltip content="Live visitors" side="bottom">
              <div className="relative">
                <button
                  onClick={() => setPresenceOpen(o => !o)}
                  className="relative w-8 h-8 rounded-os-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Eye className="w-[17px] h-[17px]" />
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-green-500 border-2 border-[var(--os-card)] animate-pulse" />
                </button>
                {presenceOpen && <LivePresencePanel onClose={() => setPresenceOpen(false)} />}
              </div>
            </Tooltip>
          )}

          <Tooltip content="Notifications" side="bottom">
            <button
              onClick={openNotificationPanel}
              className="relative w-8 h-8 rounded-os-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
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
              className="w-8 h-8 rounded-os-md flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-[15px] h-[15px]" /> : <Maximize2 className="w-[15px] h-[15px]" />}
            </button>
          </Tooltip>

          <Tooltip content="Quick Create" side="bottom">
            <div className="relative" ref={newRef}>
              <button
                onClick={() => setNewOpen(o => !o)}
                className="w-8 h-8 rounded-os-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors active:scale-95 flex-shrink-0"
              >
                <Plus className="w-[16px] h-[16px]" />
              </button>
              {newOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl py-1 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150" style={PANEL_STYLE}>
                  {NEW_ACTIONS.filter(a =>
                    user?.role === 'ADMIN' || (a.mode === 'project' || a.mode === 'goal')
                  ).map(a => {
                    const Icon = a.icon
                    return (
                      <button
                        key={a.label}
                        onClick={() => {
                          setNewOpen(false)
                          if (a.mode) { setCreateMode(a.mode) }
                          else if (a.path) { navigate(a.path) }
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors text-left"
                      >
                        <Icon weight="fill" className="w-4 h-4 text-[var(--os-text-3)] flex-shrink-0" />
                        {a.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </Tooltip>
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-border flex-shrink-0" />

        {/* User profile dropdown */}
        <DropdownRoot>
          <DropdownTrigger asChild>
            <button className="flex items-center gap-2 h-9 px-1.5 rounded-os-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex-shrink-0 group">
              <div className="relative flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80"
                  alt={displayName}
                  className="w-[28px] h-[28px] rounded-full object-cover border border-border-subtle"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-success border border-white dark:border-black rounded-full" />
              </div>
              <div className="text-left hidden md:block min-w-0">
                <p className="text-[12px] font-medium text-text-primary leading-none mb-0.5 truncate transition-colors">{displayName}</p>
                <p className="text-[9px] text-text-secondary leading-none">{displayRole}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted group-hover:text-text-secondary transition-colors flex-shrink-0" />
            </button>
          </DropdownTrigger>
          {userDropdown('end')}
        </DropdownRoot>

      </div>
    </Surface>

    <QuickCreateModal mode={createMode} onClose={() => setCreateMode(null)} />
    </>
  )
}
