import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  SidebarSimpleIcon,
  HouseSimpleIcon,
  CheckSquareIcon,
  MegaphoneIcon,
  BookOpenIcon,
  BrainIcon,
  UsersThreeIcon,
  CalendarCheckIcon,
} from '@phosphor-icons/react'
import { cn } from '@design-system/cn'
import { Tooltip } from '@design-system/components/Tooltip'
import { useUIStore } from '@store/ui'
import { staggerContainer, staggerChild } from '@os/motion'

const BASE = '/kangqore-view/team'

const NAV_GROUPS = [
  {
    label: 'MY SPACE',
    color: '#F97316',
    items: [
      { id: 'workspace',     label: 'Workspace',      icon: HouseSimpleIcon,   path: `${BASE}` },
      { id: 'tasks',         label: 'My Tasks',        icon: CheckSquareIcon,   path: `${BASE}/tasks` },
      { id: 'announcements', label: 'Announcements',   icon: MegaphoneIcon,     path: `${BASE}/announcements` },
      { id: 'resources',     label: 'Resources',       icon: BookOpenIcon,      path: `${BASE}/resources` },
    ],
  },
  {
    label: 'TEAM',
    color: '#6366F1',
    items: [
      { id: 'members',   label: 'Team Members',  icon: UsersThreeIcon,    path: `${BASE}/members`  },
      { id: 'standups',  label: 'Standups',       icon: CalendarCheckIcon, path: `${BASE}/standups` },
      { id: 'kimmp',     label: 'KIMMP Brief',    icon: BrainIcon,         path: `${BASE}/kimmp`    },
    ],
  },
]

export function TeamSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        'flex-shrink-0 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-full',
        'bg-[#f6f7fb] dark:bg-[#111111] text-[#323338] dark:text-[var(--os-text-1)]',
        'border-r border-[#e6e9ef] dark:border-white/10',
        sidebarCollapsed ? 'w-16' : 'w-[176px]'
      )}
      style={{ zIndex: 40 }}
    >
      {/* Logo */}


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
              <p className="px-5 mb-1.5 text-[10px] font-semibold tracking-wider text-[var(--os-text-2)] uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: group.color }} />
                {group.label}
              </p>
            )}
            {sidebarCollapsed && <div className="mx-4 my-2 h-px bg-[#e6e9ef] dark:bg-[#2E2854]" />}
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon
                const link = (
                  <NavLink
                    to={item.path}
                    end={item.id === 'workspace'}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 rounded-lg transition-all duration-150 group relative',
                      sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'h-8 px-3 mx-3',
                      isActive ? 'text-white shadow-sm' : 'text-[#676879] dark:text-[var(--os-text-2)] hover:bg-[#e6e9ef] dark:hover:bg-white/[0.06] hover:text-[#323338] dark:hover:text-slate-100'
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
      <div className="flex-shrink-0 border-t border-[#e6e9ef] dark:border-white/10 p-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2.5 w-full rounded-lg h-9 text-[#676879] dark:text-[var(--os-text-2)] hover:text-[#323338] dark:hover:text-slate-100 hover:bg-[#e6e9ef] dark:hover:bg-white/[0.06] transition-all duration-150',
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
