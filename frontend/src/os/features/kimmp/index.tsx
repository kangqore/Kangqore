import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Brain } from 'lucide-react'
import { cn } from '@design-system/cn'
import { KIMMMPage } from './pages/KIMMPPage'

const TABS = [
  { path: '', label: 'Intelligence', icon: Brain },
]

export function KIMMMModule() {
  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to="/kangqore-view/kimmp"
            end
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-[#2564ea] text-[#2564ea]'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index  element={<KIMMMPage />} />
        <Route path="*" element={<Navigate to="/kangqore-view/kimmp" replace />} />
      </Routes>
    </div>
  )
}
