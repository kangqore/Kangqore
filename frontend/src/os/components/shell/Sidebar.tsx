import { useState, useRef, useEffect, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
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
  const { pathname } = useLocation()

  const navRef = useRef<HTMLElement>(null as unknown as HTMLElement)
  const [hasMore, setHasMore] = useState(false)

  // Track which expandable items are open; auto-open when on a child route
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const set = new Set<string>()
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.children?.some(c => pathname.startsWith(c.path))) set.add(item.id)
      }
    }
    return set
  })

  useEffect(() => {
    setExpanded(prev => {
      let changed = false
      const next = new Set(prev)
      for (const group of navGroups) {
        for (const item of group.items) {
          if (item.children?.some(c => pathname.startsWith(c.path)) && !next.has(item.id)) {
            next.add(item.id)
            changed = true
          }
        }
      }
      return changed ? next : prev
    })
  }, [pathname])

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

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
              <p className="px-5 mb-1.5 text-[11px] font-semibold tracking-wider text-[var(--os-text-2)] uppercase flex items-center gap-1.5">
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
                const hasChildren = (item.children?.length ?? 0) > 0
                const isOpen = expanded.has(item.id)
                const isChildActive = hasChildren && item.children!.some(c => pathname.startsWith(c.path))

                const link = (
                  <div className="relative">
                    {/* Parent row */}
                    <div className={cn(
                      'flex items-center gap-3 rounded-lg transition-all duration-150 group relative',
                      sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'h-8 px-3 mx-3',
                      isChildActive
                        ? 'text-[#2564ea]'
                        : 'text-[var(--os-text-2)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] hover:text-[var(--os-text-1)]'
                    )}>
                      {/* Icon — always navigates to the item path */}
                      <NavLink
                        to={item.path}
                        end={!hasChildren}
                        className={({ isActive }) => cn(
                          'flex items-center gap-3 flex-1 min-w-0',
                          !hasChildren && isActive ? 'text-white' : '',
                        )}
                        style={({ isActive }) =>
                          !hasChildren && isActive
                            ? { background: 'none' }
                            : {}
                        }
                        onClick={() => {
                          if (hasChildren) toggleExpand(item.id)
                        }}
                      >
                        {({ isActive }) => (
                          <>
                            <span className={cn(
                              'flex items-center flex-shrink-0 rounded-lg transition-all duration-100',
                              sidebarCollapsed
                                ? 'justify-center w-10 h-10'
                                : 'flex-1 min-w-0',
                              !hasChildren && isActive
                                ? 'text-white [&_*]:text-white'
                                : ''
                            )}
                              style={!hasChildren && isActive && !sidebarCollapsed
                                ? { background: 'linear-gradient(90deg,#2564ea,#4ab6d4)', borderRadius: 8, width: '100%', padding: '0 12px', height: 32, marginLeft: -12, marginRight: -12, paddingLeft: 12 }
                                : sidebarCollapsed && !hasChildren && isActive
                                  ? { background: 'linear-gradient(90deg,#2564ea,#4ab6d4)', borderRadius: 8 }
                                  : {}
                              }
                            >
                              <Icon weight="fill" className={cn("w-[18px] h-[18px] flex-shrink-0 transition-transform duration-100", sidebarCollapsed ? "" : "opacity-70 group-hover:opacity-100 group-hover:scale-110")} />
                              {!sidebarCollapsed && (
                                <span className="text-[13px] font-medium truncate flex-1 ml-3">{item.label}</span>
                              )}
                            </span>
                          </>
                        )}
                      </NavLink>

                      {/* Badge (non-children items) */}
                      {!hasChildren && !sidebarCollapsed && (ITEM_BADGE[item.id] ?? 0) > 0 && (
                        <span className="flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                          {ITEM_BADGE[item.id] > 99 ? '99+' : ITEM_BADGE[item.id]}
                        </span>
                      )}
                      {!hasChildren && sidebarCollapsed && (ITEM_BADGE[item.id] ?? 0) > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                          {ITEM_BADGE[item.id] > 9 ? '9+' : ITEM_BADGE[item.id]}
                        </span>
                      )}

                      {/* Expand toggle for items with children */}
                      {hasChildren && !sidebarCollapsed && (
                        <button
                          onClick={e => { e.preventDefault(); e.stopPropagation(); toggleExpand(item.id) }}
                          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors text-[11px] font-bold"
                        >
                          {isOpen ? '−' : '+'}
                        </button>
                      )}
                    </div>

                    {/* Child items */}
                    {hasChildren && isOpen && !sidebarCollapsed && (
                      <ul className="mt-0.5 space-y-0.5">
                        {item.children!.map(child => (
                          <li key={child.id}>
                            <NavLink
                              to={child.path}
                              className={({ isActive }) => cn(
                                'flex items-center gap-2 h-7 rounded-lg text-[12px] font-medium transition-all duration-150 mx-3',
                                'pl-8 pr-3',
                                isActive
                                  ? 'text-[#2564ea] bg-blue-500/10'
                                  : 'text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
                              )}
                            >
                              {({ isActive }) => (
                                <>
                                  <span className={cn(
                                    'w-1 h-1 rounded-full flex-shrink-0',
                                    isActive ? 'bg-[#2564ea]' : 'bg-current opacity-40'
                                  )} />
                                  {child.label}
                                </>
                              )}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )

                return (
                  <li key={item.id}>
                    {sidebarCollapsed && !hasChildren ? (
                      <Tooltip content={item.label} side="right">
                        <NavLink
                          to={item.path}
                          end
                          className={({ isActive }) => cn(
                            'flex items-center justify-center h-10 w-10 mx-auto rounded-lg transition-all duration-150 relative',
                            isActive
                              ? 'bg-gradient-to-r from-os-blue to-os-cyan text-white shadow-sm'
                              : 'text-[var(--os-text-2)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] hover:text-[var(--os-text-1)]'
                          )}
                        >
                          {({ isActive: _a }) => (
                            <>
                              <Icon weight="fill" className="w-[18px] h-[18px] flex-shrink-0" />
                              {(ITEM_BADGE[item.id] ?? 0) > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                                  {ITEM_BADGE[item.id] > 9 ? '9+' : ITEM_BADGE[item.id]}
                                </span>
                              )}
                            </>
                          )}
                        </NavLink>
                      </Tooltip>
                    ) : sidebarCollapsed && hasChildren ? (
                      <Tooltip content={item.label} side="right">
                        <NavLink
                          to={item.path}
                          className={({ isActive }) => cn(
                            'flex items-center justify-center h-10 w-10 mx-auto rounded-lg transition-all duration-150',
                            isActive || isChildActive
                              ? 'text-[#2564ea]'
                              : 'text-[var(--os-text-2)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] hover:text-[var(--os-text-1)]'
                          )}
                        >
                          <Icon weight="fill" className="w-[18px] h-[18px] flex-shrink-0" />
                        </NavLink>
                      </Tooltip>
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
