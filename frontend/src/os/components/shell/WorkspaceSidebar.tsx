import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@design-system/cn'
import { getActiveRailItem } from '@lib/nav'
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
  const { sidebarCollapsed } = useUIStore()
  const badges = useBadgeCounts()

  const activeRailItem = getActiveRailItem(pathname)
  const sidebarItems = activeRailItem?.sidebarItems ?? []

  return (
    <aside
      className={cn(
        'flex-shrink-0 h-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'bg-[var(--os-sidebar-bg)] border-r border-[var(--os-border)]',
        sidebarCollapsed ? 'w-0' : 'w-[176px]',
      )}
      style={{ zIndex: 39 }}
    >
      <div className="w-[176px] h-full flex flex-col">
        {activeRailItem && (
          <div className="px-5 pt-5 pb-3 flex-shrink-0">
            <p
              className="text-[10px] font-semibold tracking-widest uppercase truncate"
              style={{ color: 'var(--os-text-3)' }}
            >
              {activeRailItem.label}
            </p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto overflow-x-hidden pb-4 px-2 space-y-0.5">
          {sidebarItems.map(item => {
            const count  = item.badge ? (badges[item.badge] ?? 0) : 0
            const active = isItemActive(item, pathname, searchParams)
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 h-8 rounded-lg px-3 text-[13px] font-medium transition-all duration-150',
                  active
                    ? 'bg-gradient-to-r from-os-blue to-os-cyan text-white shadow-sm'
                    : 'text-[var(--os-text-2)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] hover:text-[var(--os-text-1)]'
                )}
              >
                <span className="flex-1 truncate">{item.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      'flex-shrink-0 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1',
                      active ? 'bg-white/25 text-white' : 'bg-red-500 text-white'
                    )}
                  >
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
