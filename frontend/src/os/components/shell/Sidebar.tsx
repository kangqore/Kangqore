import { useState, useRef, useEffect, useCallback } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { SidebarSimpleIcon } from '@phosphor-icons/react'
import { ChevronDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@design-system/cn'
import { Tooltip } from '@design-system/components/Tooltip'
import { navGroups, HOME_NAV_ITEM } from '@lib/nav'
import { useUIStore } from '@store/ui'
import { useKIMMPStore } from '@store/kimmp'
import { api, isDemo } from '@lib/api'

function useSidebarCounts() {
  const { data: leadStats } = useQuery({
    queryKey: ['contact-stats'],
    queryFn: () => api.get('/contact/stats').then(r => r.data.stats),
    staleTime: 60_000,
    refetchInterval: 120_000,
    enabled: !isDemo(),
  })
  const { data: consultStats } = useQuery({
    queryKey: ['consultation-stats'],
    queryFn: () => api.get('/consultations/stats').then(r => r.data.stats),
    staleTime: 60_000,
    refetchInterval: 120_000,
    enabled: !isDemo(),
  })
  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications?limit=20').then(r => r.data.notifications ?? []),
    staleTime: 30_000,
    enabled: !isDemo(),
  })
  const unread: number = Array.isArray(notifData)
    ? notifData.filter((n: { read: boolean }) => !n.read).length
    : 0

  return {
    leads:         (leadStats?.new ?? 0) as number,
    consultations: (consultStats?.pending ?? 0) as number,
    comms:         unread,
  }
}

const GROUP_DOT: Record<string, string> = {
  INTELLIGENCE: '#7c3aed',
  CRM:          '#2564ea',
  CORE:         '#059669',
  OPERATIONS:   '#d97706',
  SYSTEM:       'var(--os-text-2)',
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const criticalCount = useKIMMPStore(s => s.criticalCount())
  const counts = useSidebarCounts()

  const navRef = useRef<HTMLElement>(null as unknown as HTMLElement)
  const [hasMore, setHasMore] = useState(false)

  const checkScroll = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    setHasMore(nav.scrollTop + nav.clientHeight < nav.scrollHeight - 4)
  }, [])

  useEffect(() => {
    checkScroll()
    const nav = navRef.current
    if (!nav) return
    nav.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll, { passive: true })
    return () => {
      nav.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const ITEM_BADGE: Record<string, number> = {
    'kangqore-immp': criticalCount,
    leads:           counts.leads,
    consultations:   counts.consultations,
    comms:           counts.comms,
  }

  return (
    <aside
      className={cn(
        'flex-shrink-0 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-full',
        'bg-[var(--os-sidebar-bg)] text-[var(--os-text-1)]',
        'border-r border-[var(--os-border)]',
        sidebarCollapsed ? 'w-16' : 'w-[176px]'
      )}
      style={{ zIndex: 40 }}
    >
      {/* Nav */}
      <div className="relative flex-1 min-h-0 flex flex-col">
      <nav
        ref={navRef}
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-4"
      >
        {/* Pinned Home */}
        <div>
          {(() => {
            const HomeIcon = HOME_NAV_ITEM.icon
            const homeLink = (
              <NavLink
                to={HOME_NAV_ITEM.path}
                end
                className={({ isActive }) => cn(
                  'flex items-center gap-3 rounded-lg transition-all duration-150 group relative',
                  sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'h-8 px-3 mx-3',
                  isActive
                    ? 'bg-gradient-to-r from-os-blue to-os-cyan text-white shadow-sm'
                    : 'text-[var(--os-text-2)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] hover:text-[var(--os-text-1)]'
                )}
              >
                <HomeIcon weight="fill" className={cn("w-[18px] h-[18px] flex-shrink-0 transition-transform duration-100", sidebarCollapsed ? "" : "opacity-70 group-hover:opacity-100 group-hover:scale-110")} />
                {!sidebarCollapsed && (
                  <span className="text-[13px] font-semibold truncate flex-1">{HOME_NAV_ITEM.label}</span>
                )}
              </NavLink>
            )
            return (
              <div>
                {sidebarCollapsed ? (
                  <Tooltip content="Home" side="right">{homeLink}</Tooltip>
                ) : homeLink}
                <div className="mx-4 mt-3 h-px bg-[var(--os-border)]" />
              </div>
            )
          })()}
        </div>

        {navGroups.map(group => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <p className="px-5 mb-1.5 text-[10px] font-semibold tracking-wider text-[var(--os-text-2)] uppercase flex items-center gap-1.5 opacity-80">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: GROUP_DOT[group.label] ?? 'var(--os-text-2)' }}
                />
                {group.label}
              </p>
            )}
            {sidebarCollapsed && <div className="mx-4 my-2 h-px bg-[var(--os-border)]" />}
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon
                const link = (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 rounded-lg transition-all duration-150 group relative',
                      sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'h-8 px-3 mx-3',
                      isActive
                        ? 'bg-gradient-to-r from-os-blue to-os-cyan text-white shadow-sm'
                        : 'text-[var(--os-text-2)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] hover:text-[var(--os-text-1)]'
                    )}
                  >
                    <Icon weight="fill" className={cn("w-[18px] h-[18px] flex-shrink-0 transition-transform duration-100", sidebarCollapsed ? "" : "opacity-70 group-hover:opacity-100 group-hover:scale-110")} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="text-[13px] font-medium truncate flex-1">{item.label}</span>
                        {(ITEM_BADGE[item.id] ?? 0) > 0 && (
                          <span className="flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                            {ITEM_BADGE[item.id] > 99 ? '99+' : ITEM_BADGE[item.id]}
                          </span>
                        )}
                      </>
                    )}
                    {sidebarCollapsed && (ITEM_BADGE[item.id] ?? 0) > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {ITEM_BADGE[item.id] > 9 ? '9+' : ITEM_BADGE[item.id]}
                      </span>
                    )}
                  </NavLink>
                )

                return (
                  <li key={item.id}>
                    {sidebarCollapsed ? (
                      <Tooltip content={item.label} side="right">{link}</Tooltip>
                    ) : link}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Scroll-more fade + chevron */}
      {!sidebarCollapsed && hasMore && (
        <div
          className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--os-sidebar-bg))' }}
        >
          <div className="absolute bottom-1 w-full flex justify-center">
            <ChevronDown className="w-4 h-4 opacity-40 animate-bounce" style={{ color: 'var(--os-text-2)' }} />
          </div>
        </div>
      )}
      </div>

      {/* Collapse toggle */}
      <div className="flex-shrink-0 border-t border-[var(--os-border)] p-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2.5 w-full rounded-lg h-9 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] transition-all duration-150',
            sidebarCollapsed ? 'justify-center' : 'px-3'
          )}
        >
          {sidebarCollapsed
            ? <SidebarSimpleIcon weight="fill" className="w-[18px] h-[18px]" />
            : <><SidebarSimpleIcon weight="fill" className="w-[18px] h-[18px]" /><span className="text-[13px] font-medium">Collapse</span></>
          }
        </button>
      </div>
    </aside>
  )
}
