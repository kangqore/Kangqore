import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SidebarSimpleIcon } from '@phosphor-icons/react'
import { cn } from '@design-system/cn'
import { Tooltip } from '@design-system/components/Tooltip'
import { useUIStore } from '@store/ui'
import { staggerContainer, staggerChild } from '@os/motion'
import type { DeptConfig } from './deptConfigs'

interface DeptSidebarProps {
  config: DeptConfig
}

export function DeptSidebar({ config }: DeptSidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        'flex-shrink-0 flex flex-col',
        'bg-[var(--os-sidebar-bg)] text-[var(--os-text-1)]',
        'border-r border-[var(--os-border)]',
        'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-full relative overflow-hidden',
        sidebarCollapsed ? 'w-16' : 'w-[176px]'
      )}
      style={{ zIndex: 40 }}
    >


      {/* Nav */}
      <motion.nav
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-4"
      >
        {config.navGroups.map(group => (
          <motion.div key={group.label} variants={staggerChild}>
            {!sidebarCollapsed && (
              <p className="px-5 mb-1.5 text-[10px] font-semibold tracking-wider text-[var(--os-text-2)] uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: group.color }} />
                {group.label}
              </p>
            )}
            {sidebarCollapsed && <div className="mx-4 my-2 h-px bg-[var(--os-border)]" />}
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon
                const isWorkspace = item.id === 'workspace'
                const link = (
                  <NavLink
                    to={item.path}
                    end={isWorkspace}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 rounded-lg transition-all duration-150 group relative',
                      sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'h-8 px-3 mx-3',
                      isActive
                        ? 'text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                        : 'text-[var(--os-text-2)] hover:bg-[var(--os-border-subtle)] hover:text-[var(--os-text-1)]'
                    )}
                    style={({ isActive }) =>
                      isActive
                        ? { background: `linear-gradient(135deg, ${config.accentColor} 0%, ${config.accentColor}bb 100%)` }
                        : {}
                    }
                  >
                    <Icon
                      weight="fill"
                      className={cn(
                        'w-[18px] h-[18px] flex-shrink-0 transition-transform duration-100',
                        sidebarCollapsed ? '' : 'opacity-70 group-hover:opacity-100 group-hover:scale-110'
                      )}
                    />
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
      <div className="flex-shrink-0 border-t border-[var(--os-border)] p-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2.5 w-full rounded-lg h-9 text-[var(--os-text-2)]',
            'hover:text-[var(--os-text-1)] hover:bg-[var(--os-border-subtle)] transition-all duration-150',
            sidebarCollapsed ? 'justify-center' : 'px-3'
          )}
        >
          <SidebarSimpleIcon weight="fill" className="w-[18px] h-[18px] flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-[13px] font-medium">Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
