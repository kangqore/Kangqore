import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SidebarSimpleIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@design-system/cn'
import { Tooltip } from '@design-system/components/Tooltip'
import { navGroups, HOME_NAV_ITEM } from '@lib/nav'
import { useUIStore } from '@store/ui'
import { useKIMMPStore } from '@store/kimmp'
import { staggerContainer, staggerChild } from '@os/motion'
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
  SYSTEM:       '#64748b',
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const criticalCount = useKIMMPStore(s => s.criticalCount())
  const counts = useSidebarCounts()

  const ITEM_BADGE: Record<string, number> = {
    'kangqore-immp': criticalCount,
    leads:           counts.leads,
    consultations:   counts.consultations,
    comms:           counts.comms,
  }

  return (
    <aside
      className={cn(
        'flex-shrink-0 flex flex-col bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-white border-r border-white/10 border-t-white/20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ease-in-out h-full',
        sidebarCollapsed ? 'w-16' : 'w-[230px]'
      )}
      style={{ zIndex: 40 }}
    >
      {/* Logo */}
      <Link
        to="/"
        className={cn(
          'flex items-center gap-3 flex-shrink-0 hover:bg-white/[0.04] transition-colors cursor-pointer',
          sidebarCollapsed ? 'h-[60px] justify-center px-0' : 'h-[60px] px-5'
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-os-blue to-os-cyan flex items-center justify-center flex-shrink-0 shadow-sm">
          <img src="/assets/kangqore-icon-white.png" alt="Kangqore" className="w-5 h-5 object-contain" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-none" style={{ fontFamily: 'var(--font-display)' }}>Kangqore</p>
            <p className="text-os-cyan text-[10px] tracking-widest mt-0.5 font-bold uppercase">View</p>
          </div>
        )}
      </Link>

      {/* Nav */}
      <motion.nav
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-4"
      >
        {/* Pinned Home */}
        <motion.div variants={staggerChild}>
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
                    : 'text-slate-500 hover:bg-white/[0.06] hover:text-slate-100'
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
                <div className="mx-4 mt-3 h-px bg-[#2E2854]" />
              </div>
            )
          })()}
        </motion.div>

        {navGroups.map(group => (
          <motion.div key={group.label} variants={staggerChild}>
            {!sidebarCollapsed && (
              <p className="px-5 mb-1.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: GROUP_DOT[group.label] ?? '#64748b' }}
                />
                {group.label}
              </p>
            )}
            {sidebarCollapsed && <div className="mx-4 my-2 h-px bg-[#2E2854]" />}
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
                        : 'text-slate-500 hover:bg-white/[0.06] hover:text-slate-100'
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
          </motion.div>
        ))}
      </motion.nav>

      {/* Collapse toggle */}
      <div className="flex-shrink-0 border-t border-white/10 border-t-white/20 p-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2.5 w-full rounded-lg h-9 text-slate-500 hover:text-slate-100 hover:bg-white/[0.06] transition-all duration-150',
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
