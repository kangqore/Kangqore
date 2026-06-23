import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  SidebarSimpleIcon,
  ChartPieSliceIcon,
  TargetIcon,
  BrainIcon,
  BookBookmarkIcon,
  ShieldCheckeredIcon,
  TrendUpIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { cn } from '@design-system/cn'
import { Tooltip } from '@design-system/components/Tooltip'
import { useUIStore } from '@store/ui'
import { staggerContainer, staggerChild } from '@os/motion'

const BASE = '/kangqore-view/executive'

const NAV_GROUPS = [
  {
    label: 'EXECUTIVE',
    color: '#6366F1',
    items: [
      { id: 'overview',  label: 'Overview',       icon: ChartPieSliceIcon, path: `${BASE}`          },
      { id: 'strategy',  label: 'Strategy & OKRs', icon: TargetIcon,        path: `${BASE}/strategy` },
      { id: 'kimmp',     label: 'KIMMP Brief',     icon: BrainIcon,         path: `${BASE}/kimmp`    },
      { id: 'board',     label: 'Board Materials', icon: BookBookmarkIcon,  path: `${BASE}/board`    },
    ],
  },
  {
    label: 'INTELLIGENCE',
    color: '#7C3AED',
    items: [
      { id: 'governance', label: 'Governance',   icon: ShieldCheckeredIcon, path: `${BASE}/governance`  },
      { id: 'revenue',    label: 'Revenue',      icon: TrendUpIcon,         path: `${BASE}/revenue`     },
      { id: 'people',     label: 'People',       icon: UsersIcon,           path: `${BASE}/people`      },
    ],
  },
]

export function ExecutiveSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        'flex-shrink-0 flex flex-col bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-white border-r border-white/10 border-t-white/20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-full',
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
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }}>
          <img src="/assets/kangqore-icon-white.png" alt="Kangqore" className="w-5 h-5 object-contain" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-none" style={{ fontFamily: 'var(--font-display)' }}>Kangqore</p>
            <p className="text-[#4ab6d4] text-[10px] tracking-widest mt-0.5 font-bold uppercase">Executive</p>
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
        {NAV_GROUPS.map(group => (
          <motion.div key={group.label} variants={staggerChild}>
            {!sidebarCollapsed && (
              <p className="px-5 mb-1.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: group.color }} />
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
                    end={item.id === 'overview'}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 rounded-lg transition-all duration-150 group relative',
                      sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'h-8 px-3 mx-3',
                      isActive ? 'text-white shadow-sm' : 'text-slate-500 hover:bg-white/[0.06] hover:text-slate-100'
                    )}
                    style={({ isActive }) => isActive ? { background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' } : {}}
                  >
                    <Icon weight="fill" className={cn('w-[18px] h-[18px] flex-shrink-0 transition-transform duration-100', sidebarCollapsed ? '' : 'opacity-70 group-hover:opacity-100 group-hover:scale-110')} />
                    {!sidebarCollapsed && (
                      <span className="text-[13px] font-medium truncate flex-1">{item.label}</span>
                    )}
                  </NavLink>
                )
                return (
                  <li key={item.id}>
                    {sidebarCollapsed
                      ? <Tooltip content={item.label} side="right">{link}</Tooltip>
                      : link}
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
