import { Fragment } from 'react'
import { SidebarSimpleIcon } from '@phosphor-icons/react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@design-system/cn'
import { Surface } from '@design-system/primitives/Surface'
import { getActiveRailItem, RAIL_ITEMS, getTeamSidebarItems } from '@lib/nav'
import { useUIStore } from '@store/ui'
import { useKIMMPStore } from '@store/kimmp'
import { api, isDemo } from '@lib/api'
import type { RailSidebarItem } from '@lib/nav'

type BadgeMap = Record<string, number>

function useBadgeCounts(): BadgeMap {
  const criticalCount = useKIMMPStore(s => s.criticalCount())

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
    'kangqore-immp': criticalCount,
    leads:           (leadStats?.new ?? 0) as number,
    consultations:   (consultStats?.pending ?? 0) as number,
    comms:           unread,
  }
}

function isItemActive(item: RailSidebarItem, pathname: string, searchParams: URLSearchParams): boolean {
  if (!item.path.includes('?')) return pathname === item.path
  const [base, qs] = item.path.split('?')
  if (pathname !== base) return false
  const itemParams = new URLSearchParams(qs)
  for (const [k, v] of itemParams.entries()) {
    if (searchParams.get(k) !== v) return false
  }
  return true
}

export function WorkspaceSidebar() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const { sidebarCollapsed, toggleSidebar, pinnedRailId } = useUIStore()
  const badges = useBadgeCounts()

  const activeRailItem = pinnedRailId
    ? (RAIL_ITEMS.find(i => i.id === pinnedRailId) ?? getActiveRailItem(pathname))
    : getActiveRailItem(pathname)
    
  let sidebarItems = activeRailItem?.sidebarItems ?? []
  let sidebarLabel = activeRailItem?.label

  // Contextual override for Team Portal
  if (pathname.startsWith('/kangqore-view/team/')) {
    const match = pathname.match(/^\/kangqore-view\/team\/([^/]+)/)
    const currentDept = match ? match[1] : 'it'
    sidebarItems = getTeamSidebarItems(currentDept)
    sidebarLabel = `${currentDept.toUpperCase()} Team`
  }

  return (
    <div className="relative h-full flex-shrink-0" style={{ zIndex: 39 }}>
      <Surface
        as="aside"
        variant="glass"
        className={cn(
          'h-full overflow-hidden transition-all duration-300 ease-spring',
          'border-r border-border bg-surface-secondary/80 backdrop-blur-os-thick',
          sidebarCollapsed ? 'w-0 border-r-0' : 'w-[220px]',
        )}
      >
        <div className="w-[220px] h-full flex flex-col">
          {sidebarLabel && (
            <div className="px-5 pt-6 lg:pt-8 pb-3 flex-shrink-0 flex items-center justify-between">
              <p
                className="text-[11px] font-semibold text-text-secondary tracking-wide truncate"
              >
                {sidebarLabel}
              </p>
            </div>
          )}

        <nav className="flex-1 overflow-y-auto overflow-x-hidden pb-4 px-2 space-y-1">
          {(() => {
            const grouped: Record<string, RailSidebarItem[]> = {}
            const uncategorized: RailSidebarItem[] = []
            
            sidebarItems.forEach(item => {
              if (item.category) {
                if (!grouped[item.category]) grouped[item.category] = []
                grouped[item.category].push(item)
              } else {
                uncategorized.push(item)
              }
            })

            const renderItem = (item: RailSidebarItem) => {
              const count  = item.badge ? (badges[item.badge] ?? 0) : 0
              const active = isItemActive(item, pathname, searchParams)
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 h-8 rounded-os-md px-3 text-[13px] font-medium transition-colors group relative overflow-hidden',
                    active
                      ? 'bg-brand-primary text-white'
                      : 'text-text-primary hover:bg-black/5 dark:hover:bg-white/10'
                  )}
                >
                  <span className="flex-1 truncate relative z-10">{item.label}</span>
                  
                  {count > 0 && (
                    <span
                      className={cn(
                        'relative z-10 flex-shrink-0 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 shadow-sm',
                        active ? 'bg-white/20 text-white' : 'bg-text-muted text-white'
                      )}
                    >
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </Link>
              )
            }

            return (
              <>
                {uncategorized.map(renderItem)}
                {Object.entries(grouped).map(([category, items]) => (
                  <Fragment key={category}>
                    <div className="mt-4 mb-1.5 px-3">
                      <p className="text-[11px] font-semibold tracking-wide text-text-secondary">
                        {category}
                      </p>
                    </div>
                    {items.map(renderItem)}
                  </Fragment>
                ))}
              </>
            )
          })()}
        </nav>
      </div>
    </Surface>

    {/* Floating Toggle Button */}
    {sidebarItems.length > 0 && (
      <button
        onClick={toggleSidebar}
        className={cn(
          "absolute z-50 flex items-center justify-center transition-all duration-300 text-text-muted hover:text-text-primary",
          sidebarCollapsed 
            ? "top-5 -right-8 w-8 h-8 bg-surface-secondary/90 backdrop-blur-md border border-border border-l-0 rounded-r-lg shadow-sm"
            : "top-5 right-3 w-8 h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
        )}
      >
        <SidebarSimpleIcon weight="fill" className={cn("w-4 h-4 transition-transform duration-300", sidebarCollapsed ? "rotate-180" : "")} />
      </button>
    )}
    </div>
  )
}

